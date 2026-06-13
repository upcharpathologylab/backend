import Review from "../models/Review.js";
import ContentBlock from "../models/ContentBlock.js";
import { defaultHomeData } from "../data/defaultHomeData.js";

const seedMarkerQuery = { pageSlug: "_system", sectionKey: "reviewsSeeded" };
let seedPromise = null;

const relativeDate = (value, index) => {
  const text = String(value || "").toLowerCase();
  const match = text.match(/(\d+)\s+(day|week)/);
  if (match) {
    const amount = Number(match[1]);
    const days = match[2] === "week" ? amount * 7 : amount;
    return new Date(Date.now() - days * 86400000);
  }

  const parsed = value ? new Date(value) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : new Date(Date.now() - (index + 1) * 86400000);
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const defaultReviews = () =>
  defaultHomeData.reviews.map((item, index) => ({
    name: item.name || "Customer",
    customerName: item.customerName || item.name || "Customer",
    email: item.email || "",
    rating: Number(item.rating || 5),
    comment: item.comment || item.content || "",
    content: item.content || item.comment || "",
    image: item.image || item.customerPhoto || "",
    customerPhoto: item.customerPhoto || item.image || "",
    status: "Published",
    displayedOn: "Homepage",
    reviewDate: relativeDate(item.reviewDate, index),
    isActive: true
  }));

async function importMissingDefaultReviews(reviews) {
  for (const review of reviews) {
    const nameRegex = new RegExp(`^${escapeRegex(review.name)}$`, "i");
    const existing = await Review.findOne({
      $or: [
        { name: nameRegex },
        { customerName: nameRegex }
      ]
    }).select("_id").lean();

    if (!existing) {
      await Review.create(review);
    }
  }
}

async function seedReviewsOnce() {
  const seeded = await ContentBlock.findOne(seedMarkerQuery).select("_id").lean();

  if (!seeded) {
    await importMissingDefaultReviews(defaultReviews());
  }

  await ContentBlock.findOneAndUpdate(
    seedMarkerQuery,
    {
      $set: {
        ...seedMarkerQuery,
        title: "Reviews seeded",
        description: "Seed marker for default reviews."
      }
    },
    { upsert: true }
  );
}

export async function ensureReviewSeedData() {
  if (!seedPromise) {
    seedPromise = seedReviewsOnce().finally(() => {
      seedPromise = null;
    });
  }

  await seedPromise;
}
