import ContentBlock from "../models/ContentBlock.js";
import TestModel from "../models/Test.js";
import TestCategory from "../models/TestCategory.js";
import { testListingData } from "../data/listingData.js";

const seedMarkerQuery = { pageSlug: "_system", sectionKey: "testsSeeded" };
let seedPromise = null;

const categoryLabels = {
  blood: "Blood Test",
  diabetes: "Diabetes",
  thyroid: "Thyroid",
  vitamin: "Vitamin",
  kidney: "Kidney",
  liver: "Liver",
  heart: "Heart",
  others: "Others"
};

const categoryIcons = {
  "Blood Test": "Droplet",
  Diabetes: "Droplet",
  Thyroid: "Activity",
  Vitamin: "Sun",
  Kidney: "ShieldPlus",
  Liver: "Leaf",
  Heart: "HeartPulse",
  Others: "FileCheck2"
};

const toCategoryLabel = (value) => categoryLabels[value] || value || "Others";

const toDiscountPercent = (value) => {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const testCodeFromId = (value, index) =>
  String(value || `test-${index + 1}`)
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 10)
    .toUpperCase();

async function ensureCategoriesFromTests(seedTests = null) {
  const categories = await TestModel.aggregate([
    { $match: { category: { $type: "string", $ne: "" } } },
    { $group: { _id: "$category", totalTests: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).then((rows) => rows.map((row) => ({ categoryName: row._id, totalTests: row.totalTests })));

  if (!categories.length && seedTests) {
    categories.push(
      ...Object.values(categoryLabels).map((categoryName) => ({
        categoryName,
        totalTests: seedTests.filter((test) => test.category === categoryName).length
      }))
    );
  }

  await Promise.all(
    categories
      .filter((category) => category.categoryName)
      .map((category) =>
        TestCategory.updateOne(
          { categoryName: category.categoryName },
          {
            $set: {
              totalTests: category.totalTests
            },
            $setOnInsert: {
              categoryName: category.categoryName,
              description: `${category.categoryName} related tests`,
              icon: categoryIcons[category.categoryName] || "FileCheck2",
              status: "Active",
              isActive: true
            }
          },
          { upsert: true }
        )
      )
  );
}

const defaultTests = () =>
  testListingData.map((item, index) => {
    const category = toCategoryLabel(item.category);
    return {
      name: item.name,
      testName: item.name,
      testCode: testCodeFromId(item.id, index),
      category,
      subtitle: item.subtitle,
      description: item.subtitle,
      originalPrice: item.originalPrice,
      discountedPrice: item.discountedPrice,
      price: item.originalPrice,
      finalPrice: item.discountedPrice,
      discountPercent: toDiscountPercent(item.discount),
      discount: item.discount,
      image: item.image || "",
      testImage: item.image || "",
      icon: item.icon || "TestTube2",
      color: item.color || "green",
      badge: item.badge || "",
      badgeType: item.color || "green",
      sampleType: item.category === "others" ? "Sample" : "Blood",
      reportTime: item.reportTime || "24 hrs",
      fastingRequired: Boolean(item.fastingRequired),
      homeCollection: item.homeCollection !== false,
      rating: Number(item.rating || 4.6),
      popularity: Number(item.popularity || 0),
      sortOrder: index + 1,
      status: "Active",
      isActive: true
    };
  });

async function importMissingDefaultTests(tests) {
  for (const test of tests) {
    const nameRegex = new RegExp(`^${escapeRegex(test.name)}$`, "i");
    const existing = await TestModel.findOne({
      $or: [{ testCode: test.testCode }, { name: nameRegex }, { testName: nameRegex }]
    }).select("_id").lean();

    if (!existing) {
      await TestModel.create(test);
    }
  }
}

async function seedTestsOnce() {
  const tests = defaultTests();
  const seeded = await ContentBlock.findOne(seedMarkerQuery).select("_id").lean();

  if (!seeded) {
    await importMissingDefaultTests(tests);
  }

  await ensureCategoriesFromTests(seeded ? null : tests);

  await ContentBlock.findOneAndUpdate(
    seedMarkerQuery,
    {
      $set: {
        ...seedMarkerQuery,
        title: "Tests seeded",
        description: "Seed marker for default tests."
      }
    },
    { upsert: true }
  );
}

export async function ensureTestSeedData() {
  if (!seedPromise) {
    seedPromise = seedTestsOnce().finally(() => {
      seedPromise = null;
    });
  }

  await seedPromise;
}

export { categoryLabels, toCategoryLabel };
