import mongoose from "mongoose";
import ContentBlock from "../models/ContentBlock.js";
import { defaultHomeData } from "../data/defaultHomeData.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const contentPages = [
  { slug: "home", name: "Home Page", status: "Published" },
  { slug: "about-us", name: "About Us", status: "Published" },
  { slug: "packages", name: "Packages", status: "Published" },
  { slug: "tests", name: "Tests", status: "Published" },
  { slug: "blog", name: "Blog", status: "Published" },
  { slug: "contact-us", name: "Contact Us", status: "Published" },
  { slug: "faqs", name: "FAQs", status: "Published" },
  { slug: "privacy-policy", name: "Privacy Policy", status: "Published" },
  { slug: "terms-conditions", name: "Terms & Conditions", status: "Published" },
  { slug: "refund-policy", name: "Refund Policy", status: "Published" }
];

const dbReady = () => mongoose.connection.readyState === 1;

const defaultBlogCards = defaultHomeData.blogs.map((blog, index) => ({
  id: blog.slug || `blog-card-${index + 1}`,
  image: blog.image || "",
  title: blog.title || "",
  description: blog.shortDescription || "",
  content: blog.content || blog.shortDescription || "",
  category: blog.category || "Health Tips",
  date: blog.date || "",
  status: blog.isActive === false ? "Inactive" : "Active"
}));

const defaultBlogContent = {
  pageSlug: "blog",
  sectionKey: "hero",
  title: "From Our",
  subtitle: "Blog",
  description: "Health tips, insights and guides to help you live a healthier life.",
  imageUrl: "",
  hasCards: true,
  cards: defaultBlogCards,
  status: "Published",
  updatedAt: null
};

const normalizeBlock = (block) => ({
  pageSlug: block.pageSlug,
  sectionKey: block.sectionKey,
  title: block.title || "",
  subtitle: block.subtitle || "",
  description: block.description || "",
  imageUrl: block.imageUrl || "",
  hasCards: Array.isArray(block.cards),
  cards: Array.isArray(block.cards) ? block.cards : [],
  settings: block.settings && typeof block.settings === "object" ? block.settings : {},
  status: block.status || "Published",
  updatedAt: block.updatedAt
});

const isActiveCard = (card = {}) => {
  const status = String(card.status ?? "").trim().toLowerCase();
  if (card.isActive === false || status === "inactive") return false;
  return card.isActive === true || status === "active" || status === "published" || !status;
};

const cleanCards = (cards = []) =>
  Array.isArray(cards)
    ? cards.map((card, index) => ({
        id: String(card.id || `card-${index + 1}`),
        image: card.image || "",
        title: card.title || "",
        description: card.description || "",
        content: card.content || "",
        category: card.category || "",
        date: card.date || "",
        testCount: card.testCount || "",
        oldPrice: card.oldPrice || "",
        newPrice: card.newPrice || "",
        badge: card.badge || "",
        buttonText: card.buttonText || "Book Now",
        buttonLink: card.buttonLink || "#booking",
        isActive: isActiveCard(card),
        status: isActiveCard(card) ? "Active" : "Inactive"
      }))
    : [];

export const getContentPages = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    return res.json({
      success: true,
      data: contentPages.map((page) => ({ ...page, lastUpdated: "Not updated" })),
      source: "demo"
    });
  }

  const updates = await ContentBlock.aggregate([
    { $group: { _id: "$pageSlug", lastUpdated: { $max: "$updatedAt" } } }
  ]);
  const updateMap = new Map(updates.map((item) => [item._id, item.lastUpdated]));
  const pageStatuses = await ContentBlock.find({ sectionKey: "main" }, "pageSlug status").lean();
  const statusMap = new Map(pageStatuses.map((item) => [item.pageSlug, item.status]));

  return res.json({
    success: true,
    data: contentPages.map((page) => ({
      ...page,
      status: statusMap.get(page.slug) || page.status,
      lastUpdated: updateMap.get(page.slug) || null
    }))
  });
});

export const getPageContent = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    const sections = req.params.pageSlug === "blog" ? [defaultBlogContent] : [];
    return res.json({
      success: true,
      data: {
        pageSlug: req.params.pageSlug,
        sections,
        ...(req.params.pageSlug === "blog" ? { blogCards: defaultBlogCards } : {})
      },
      source: "demo"
    });
  }

  const sections = await ContentBlock.find({ pageSlug: req.params.pageSlug }).sort({ sectionKey: 1 }).lean();
  const dataSections = sections.length || req.params.pageSlug !== "blog" ? sections.map(normalizeBlock) : [defaultBlogContent];

  return res.json({
    success: true,
    data: {
      pageSlug: req.params.pageSlug,
      sections: dataSections,
      ...(req.params.pageSlug === "blog" ? { blogCards: dataSections.find((section) => section.sectionKey === "hero")?.cards || [] } : {})
    }
  });
});

export const savePageContent = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    return res.status(503).json({ success: false, message: "Database is not connected." });
  }

  const pageSlug = req.params.pageSlug;
  const sections = Array.isArray(req.body.sections) ? req.body.sections : [];

  const cleanSections = sections
    .filter((section) => section?.sectionKey)
    .map((section) => ({
      pageSlug,
      sectionKey: String(section.sectionKey),
      title: section.title || "",
      subtitle: section.subtitle || "",
      description: section.description || "",
      imageUrl: section.imageUrl || "",
      cards: cleanCards(section.cards),
      settings: section.settings && typeof section.settings === "object" ? section.settings : {},
      status: section.status === "Draft" ? "Draft" : "Published"
    }));

  if (!cleanSections.length) {
    return res.status(400).json({ success: false, message: "At least one content section is required." });
  }

  await ContentBlock.bulkWrite(
    cleanSections.map((section) => ({
      updateOne: {
        filter: { pageSlug, sectionKey: section.sectionKey },
        update: { $set: section },
        upsert: true
      }
    }))
  );

  const savedSections = await ContentBlock.find({ pageSlug }).sort({ sectionKey: 1 }).lean();
  const normalizedSections = savedSections.map(normalizeBlock);
  const blogCards = pageSlug === "blog"
    ? normalizedSections.find((section) => section.sectionKey === "hero")?.cards || []
    : undefined;

  return res.json({
    success: true,
    message: "Content saved successfully.",
    data: {
      pageSlug,
      sections: normalizedSections,
      ...(pageSlug === "blog" ? { blogCards } : {})
    }
  });
});

export const uploadContentImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload an image." });
  }

  const imageUrl = `/uploads/content/${req.file.filename}`;

  return res.status(201).json({
    success: true,
    imageUrl,
    data: { imageUrl }
  });
});
