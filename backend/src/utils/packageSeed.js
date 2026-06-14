import PackageModel from "../models/Package.js";
import ContentBlock from "../models/ContentBlock.js";
import { packageListingData } from "../data/listingData.js";

const seedMarkerQuery = { pageSlug: "_system", sectionKey: "packagesSeeded" };
let seedPromise = null;

const categoryLabels = {
  bone: "Health Checkup",
  diabetes: "Diabetes",
  "full-body": "Health Checkup",
  heart: "Cardiac",
  kidney: "Kidney",
  liver: "Liver",
  men: "Health Checkup",
  senior: "Health Checkup",
  thyroid: "Thyroid",
  vitamin: "Health Checkup",
  women: "Women Health"
};

const packageCodes = {
  "bone-joint-package": "BJP001",
  "diabetes-care-package": "DP001",
  "full-body-checkup": "FBC001",
  "heart-care-package": "HHP001",
  "kidney-care-package": "KFP001",
  "liver-care-package": "LFP001",
  "mens-health-package": "MHP001",
  "pre-marriage-package": "PMP001",
  "senior-citizen-package": "SCP001",
  "thyroid-care-package": "TP001",
  "vitamin-profile-package": "VPP001",
  "womens-health-package": "WWP001"
};

const toDiscountPercent = (value) => {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const packageCodeFromId = (value, index) =>
  packageCodes[value] ||
  String(value || `package-${index + 1}`)
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 10)
    .toUpperCase();

const toCategoryLabel = (value) => categoryLabels[value] || value || "Health Checkup";

const defaultPackages = () =>
  packageListingData.map((item, index) => {
    const discountPercent = toDiscountPercent(item.discount);
    return {
      name: item.name,
      packageName: item.name,
      packageCode: packageCodeFromId(item.id, index),
      category: toCategoryLabel(item.category),
      testCount: item.testCount,
      testsIncluded: item.testCount,
      description: item.description,
      originalPrice: item.originalPrice,
      discountedPrice: item.discountedPrice,
      price: item.originalPrice,
      finalPrice: item.discountedPrice,
      discountPercent,
      discount: `${discountPercent}% OFF`,
      image: item.image || "",
      packageImage: item.image || "",
      icon: item.icon || "Gift",
      color: item.color || "green",
      badge: item.badge || "",
      buttonText: "Book Now",
      buttonUrl: "/cart",
      homeCollection: item.homeCollection !== false,
      reportTime: item.reportTime || "24 - 36 hrs",
      gender: item.gender || "all",
      popularity: Number(item.popularity || 0),
      status: "Active",
      isPopular: Boolean(item.badge),
      isActive: true
    };
  });

async function importMissingDefaultPackages(packages) {
  for (const packageItem of packages) {
    const nameRegex = new RegExp(`^${escapeRegex(packageItem.name)}$`, "i");
    const existing = await PackageModel.findOne({
      $or: [
        { packageCode: packageItem.packageCode },
        { name: nameRegex },
        { packageName: nameRegex }
      ]
    }).select("_id").lean();

    if (!existing) {
      await PackageModel.create(packageItem);
    }
  }
}

async function seedPackagesOnce() {
  const seeded = await ContentBlock.findOne(seedMarkerQuery).select("_id").lean();

  if (!seeded) {
    await importMissingDefaultPackages(defaultPackages());
  }

  await ContentBlock.findOneAndUpdate(
    seedMarkerQuery,
    {
      $set: {
        ...seedMarkerQuery,
        title: "Packages seeded",
        description: "Seed marker for default packages."
      }
    },
    { upsert: true }
  );
}

export async function ensurePackageSeedData() {
  if (!seedPromise) {
    seedPromise = seedPackagesOnce().finally(() => {
      seedPromise = null;
    });
  }

  await seedPromise;
}
