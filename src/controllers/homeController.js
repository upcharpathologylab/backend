import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import HomeFeature from "../models/HomeFeature.js";
import HomeHero from "../models/HomeHero.js";
import HomepageBanner from "../models/HomepageBanner.js";
import PackageModel from "../models/Package.js";
import Review from "../models/Review.js";
import SiteSetting from "../models/SiteSetting.js";
import TestModel from "../models/Test.js";
import { defaultHomeData } from "../data/defaultHomeData.js";
import { blogShape } from "./blogController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ensurePackageSeedData } from "../utils/packageSeed.js";
import { ensureReviewSeedData } from "../utils/reviewSeed.js";
import { ensureTestSeedData } from "../utils/testSeed.js";

const dbReady = () => mongoose.connection.readyState === 1;

const asObject = (value) => (value?.toObject ? value.toObject() : value);

const formatRelativeDate = (value) => {
  if (!value) return "";
  if (typeof value === "string" && Number.isNaN(Date.parse(value))) return value;

  const days = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 86400000));
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  return `${Math.round(days / 7)} week${days >= 14 ? "s" : ""} ago`;
};

const mapReview = (review) => ({
  ...asObject(review),
  reviewDate: formatRelativeDate(review.reviewDate)
});

const mapFeature = (feature) => {
  const item = asObject(feature);
  return {
    title: item.title,
    name: item.title,
    description: item.description,
    icon: item.icon,
    color: item.color
  };
};

const bannerToHero = (banner, fallbackHero) => {
  if (!banner) return fallbackHero;
  const features = [banner.feature1, banner.feature2, banner.feature3, banner.feature4].filter(Boolean);
  const fallbackPoints = fallbackHero.trustPoints || [];
  const offerText = [banner.offerText, banner.offerHighlightText].filter(Boolean).join(" on ");

  return {
    ...fallbackHero,
    title: banner.headingLine1 || banner.bannerTitle || fallbackHero.title,
    highlightText: banner.headingHighlightText || "",
    subtitle: banner.description || banner.bannerDescription || fallbackHero.subtitle,
    trustPoints: (features.length ? features : fallbackPoints.map((point) => point.label)).map((label, index) => ({
      label,
      icon: fallbackPoints[index]?.icon || "BadgeCheck"
    })),
    buttons: [
      {
        label: banner.primaryButtonText || banner.buttonText || fallbackHero.buttons?.[0]?.label || "Book Test Now",
        href: banner.primaryButtonUrl || banner.linkUrl || fallbackHero.buttons?.[0]?.href || "#booking",
        variant: "primary"
      },
      {
        label: banner.secondaryButtonText || fallbackHero.buttons?.[1]?.label || "View Packages",
        href: banner.secondaryButtonUrl || fallbackHero.buttons?.[1]?.href || "#packages",
        variant: "outline"
      }
    ],
    offerText: offerText || fallbackHero.offerText,
    image: banner.bannerImage || fallbackHero.image
  };
};

export const getHome = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    return res.json({ success: true, data: defaultHomeData, source: "demo" });
  }

  await Promise.all([ensurePackageSeedData(), ensureTestSeedData(), ensureReviewSeedData()]);

  const [hero, heroBanner, packages, tests, features, blogs, reviews, siteSettings] = await Promise.all([
    HomeHero.findOne().sort({ updatedAt: -1 }).lean(),
    HomepageBanner.findOne({ status: "Active", isActive: true }).sort({ sortOrder: 1, updatedAt: -1 }).lean(),
    PackageModel.find({ isActive: true }).sort({ isPopular: -1, updatedAt: -1 }).limit(8).lean(),
    TestModel.find({ isActive: true }).sort({ sortOrder: 1, popularity: -1, updatedAt: -1 }).limit(12).lean(),
    HomeFeature.find({ isActive: true }).sort({ sectionType: 1, order: 1 }).lean(),
    Blog.find({ isActive: true, status: "Active" }).sort({ isFeatured: -1, publishDate: -1, updatedAt: -1 }).limit(8).lean(),
    Review.find({ isActive: true }).sort({ reviewDate: -1 }).limit(6).lean(),
    SiteSetting.findOne().sort({ updatedAt: -1 }).lean()
  ]);

  const sectionFeatures = (sectionType, fallback) => {
    const values = features.filter((feature) => feature.sectionType === sectionType).map(mapFeature);
    return values.length ? values : fallback;
  };

  const data = {
    ...defaultHomeData,
    hero: bannerToHero(heroBanner, hero || defaultHomeData.hero),
    siteSettings: siteSettings || defaultHomeData.siteSettings,
    packages,
    tests,
    quickCards: sectionFeatures("quickCards", defaultHomeData.quickCards),
    organs: sectionFeatures("organs", defaultHomeData.organs),
    whyChoose: sectionFeatures("whyChoose", defaultHomeData.whyChoose),
    howItWorks: sectionFeatures("howItWorks", defaultHomeData.howItWorks),
    blogs: blogs.map(blogShape),
    reviews: reviews.length ? reviews.map(mapReview) : defaultHomeData.reviews
  };

  return res.json({ success: true, data, source: "database" });
});

export const getFeaturedPackages = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    return res.json({ success: true, data: defaultHomeData.packages, source: "demo" });
  }

  await ensurePackageSeedData();

  const packages = await PackageModel.find({ isActive: true }).sort({ isPopular: -1, updatedAt: -1 }).limit(8).lean();
  return res.json({ success: true, data: packages, source: "database" });
});

export const getFeaturedTests = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    return res.json({ success: true, data: defaultHomeData.tests, source: "demo" });
  }

  await ensureTestSeedData();

  const tests = await TestModel.find({ isActive: true }).sort({ sortOrder: 1, popularity: -1, updatedAt: -1 }).limit(12).lean();
  return res.json({ success: true, data: tests, source: "database" });
});

export const getFeaturedBlogs = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    return res.json({ success: true, data: [], source: "demo" });
  }

  const blogs = await Blog.find({ isActive: true, status: "Active" }).sort({ isFeatured: -1, publishDate: -1, updatedAt: -1 }).limit(8).lean();
  return res.json({ success: true, data: blogs.map(blogShape), source: "database" });
});

export const getReviews = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    return res.json({ success: true, data: defaultHomeData.reviews, source: "demo" });
  }

  await ensureReviewSeedData();

  const reviews = await Review.find({ isActive: true }).sort({ reviewDate: -1 }).limit(10).lean();
  return res.json({ success: true, data: reviews.length ? reviews.map(mapReview) : defaultHomeData.reviews });
});
