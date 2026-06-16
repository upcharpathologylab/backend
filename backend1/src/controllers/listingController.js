import mongoose from "mongoose";
import { packageListingData, testListingData } from "../data/listingData.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import PackageModel from "../models/Package.js";
import TestModel from "../models/Test.js";
import { ensurePackageSeedData } from "../utils/packageSeed.js";
import { ensureTestSeedData, toCategoryLabel } from "../utils/testSeed.js";

const dbReady = () => mongoose.connection.readyState === 1;

const numeric = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const boolParam = (value) => {
  if (value === undefined || value === null || value === "") return null;
  if (["true", "yes", "1"].includes(String(value).toLowerCase())) return true;
  if (["false", "no", "0"].includes(String(value).toLowerCase())) return false;
  return null;
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const splitParam = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const categoryRegex = (value) => {
  const label = toCategoryLabel(String(value).toLowerCase());
  return new RegExp(`^${escapeRegex(label)}$`, "i");
};

const mapPackage = (item, index) => {
  const fallback = packageListingData[index] || {};
  const originalPrice = numeric(item.price ?? item.originalPrice, fallback.originalPrice);
  const discountedPrice = numeric(item.finalPrice ?? item.discountedPrice, fallback.discountedPrice ?? originalPrice);
  const hasDiscountPercent = item.discountPercent !== undefined && item.discountPercent !== null && item.discountPercent !== "";
  return {
    ...fallback,
    ...item,
    id: item.id || String(item._id || fallback.id),
    name: item.packageName || item.name || fallback.name,
    packageName: item.packageName || item.name || fallback.name,
    packageCode: item.packageCode || fallback.packageCode || "",
    description: item.description || fallback.description,
    testCount: item.testsIncluded || item.testCount || fallback.testCount,
    testsIncluded: item.testsIncluded || item.testCount || fallback.testCount,
    originalPrice,
    discountedPrice,
    discount: hasDiscountPercent ? `${numeric(item.discountPercent)}% OFF` : item.discount || fallback.discount,
    image: item.packageImage || item.image || fallback.image,
    packageImage: item.packageImage || item.image || fallback.image,
    badge: item.badge || fallback.badge,
    gender: item.gender || fallback.gender || "all",
    homeCollection: item.homeCollection ?? fallback.homeCollection ?? true,
    reportTime: item.reportTime || fallback.reportTime || "24 - 36 hrs",
    popularity: item.popularity ?? fallback.popularity ?? index,
    status: item.status || (item.isActive === false ? "Inactive" : "Active"),
    isActive: item.isActive !== false
  };
};

const mapTest = (item, index) => {
  const originalPrice = numeric(item.price ?? item.originalPrice, 0);
  const discountedPrice = numeric(item.finalPrice ?? item.discountedPrice, originalPrice);
  const hasDiscountPercent = item.discountPercent !== undefined && item.discountPercent !== null && item.discountPercent !== "";
  return {
    ...item,
    id: item.id || String(item._id || `test-${index + 1}`),
    name: item.testName || item.name || "Pathology Test",
    subtitle: item.description || item.subtitle || item.category || "Pathology test",
    description: item.description || item.subtitle || "",
    originalPrice,
    discountedPrice,
    discount: hasDiscountPercent ? `${numeric(item.discountPercent)}% OFF` : item.discount || "Best Price",
    image: item.testImage || item.image || "",
    icon: item.icon || "TestTube2",
    color: item.badgeType || item.color || "green",
    badge: item.badge || "",
    reportTime: item.reportTime || "24 hrs",
    homeCollection: item.homeCollection ?? true,
    fastingRequired: item.fastingRequired ?? false,
    rating: item.rating ?? 4.6,
    popularity: item.popularity ?? 0,
    sortOrder: item.sortOrder ?? 0,
    status: item.status || (item.isActive === false ? "Inactive" : "Active"),
    isActive: item.isActive !== false
  };
};

const sortDemoTests = (items, sort) => {
  const values = [...items];
  if (sort === "price-low") return values.sort((a, b) => a.discountedPrice - b.discountedPrice);
  if (sort === "price-high") return values.sort((a, b) => b.discountedPrice - a.discountedPrice);
  if (sort === "rating") return values.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  if (sort === "newest") return values.reverse();
  return values.sort((a, b) => {
    const orderA = Number(a.sortOrder || 9999);
    const orderB = Number(b.sortOrder || 9999);
    if (orderA !== orderB) return orderA - orderB;
    return Number(b.popularity || 0) - Number(a.popularity || 0);
  });
};

const filterDemoTests = (items, query) => {
  const search = String(query.search || query.query || "").trim().toLowerCase();
  const categories = splitParam(query.category);
  const minPrice = query.minPrice === undefined || query.minPrice === "" ? null : numeric(query.minPrice);
  const maxPrice = query.maxPrice === undefined || query.maxPrice === "" ? null : numeric(query.maxPrice);
  const fastingRequired = boolParam(query.fastingRequired);
  const homeCollection = boolParam(query.homeCollection);
  const reportTimes = splitParam(query.reportTime);

  return items.filter((item) => {
    const textMatch =
      !search ||
      [item.name, item.subtitle, item.description, item.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));
    const categoryMatch =
      !categories.length ||
      categories.some((category) => {
        const label = toCategoryLabel(category.toLowerCase()).toLowerCase();
        return [item.category, toCategoryLabel(item.category).toLowerCase()].includes(label) || item.category === category;
      });
    const minMatch = minPrice === null || Number(item.discountedPrice) >= minPrice;
    const maxMatch = maxPrice === null || Number(item.discountedPrice) <= maxPrice;
    const fastingMatch = fastingRequired === null || Boolean(item.fastingRequired) === fastingRequired;
    const collectionMatch = homeCollection === null || Boolean(item.homeCollection) === homeCollection;
    const reportMatch = !reportTimes.length || reportTimes.some((value) => String(item.reportTime || "").includes(value));

    return textMatch && categoryMatch && minMatch && maxMatch && fastingMatch && collectionMatch && reportMatch;
  });
};

const paginate = (items, page, limit) => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page: safePage, limit, total, totalPages }
  };
};

const testSort = (sort) => {
  if (sort === "price-low") return { discountedPrice: 1, finalPrice: 1 };
  if (sort === "price-high") return { discountedPrice: -1, finalPrice: -1 };
  if (sort === "rating") return { rating: -1, popularity: -1 };
  if (sort === "newest") return { updatedAt: -1 };
  return { sortOrder: 1, popularity: -1, updatedAt: -1 };
};

const buildTestQuery = (query) => {
  const conditions = [];
  const activeOnly = query.activeOnly !== "false";
  const search = String(query.search || query.query || "").trim();
  const categories = splitParam(query.category);
  const minPrice = query.minPrice === undefined || query.minPrice === "" ? null : numeric(query.minPrice);
  const maxPrice = query.maxPrice === undefined || query.maxPrice === "" ? null : numeric(query.maxPrice);
  const fastingRequired = boolParam(query.fastingRequired);
  const homeCollection = boolParam(query.homeCollection);
  const reportTimes = splitParam(query.reportTime);

  if (activeOnly) conditions.push({ isActive: true });
  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    conditions.push({
      $or: [
        { name: searchRegex },
        { testName: searchRegex },
        { subtitle: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    });
  }
  if (categories.length) {
    conditions.push({ $or: categories.map((category) => ({ category: categoryRegex(category) })) });
  }
  if (minPrice !== null) conditions.push({ discountedPrice: { $gte: minPrice } });
  if (maxPrice !== null) conditions.push({ discountedPrice: { $lte: maxPrice } });
  if (fastingRequired !== null) conditions.push({ fastingRequired });
  if (homeCollection !== null) conditions.push({ homeCollection });
  if (reportTimes.length) {
    conditions.push({ $or: reportTimes.map((value) => ({ reportTime: new RegExp(escapeRegex(value), "i") })) });
  }

  return conditions.length ? { $and: conditions } : {};
};

export const getPackages = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    return res.json({ success: true, data: packageListingData, source: "demo" });
  }

  await ensurePackageSeedData();

  const packages = await PackageModel.find({ isActive: true }).sort({ isPopular: -1, updatedAt: -1 }).lean();
  const data = packages.map(mapPackage);

  return res.json({ success: true, data, source: "database" });
});

export const getTests = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(numeric(req.query.limit, 12), 1), 500);
  const page = Math.max(numeric(req.query.page, 1), 1);
  const sort = req.query.sort || "popular";

  if (!dbReady()) {
    const filtered = filterDemoTests(testListingData, req.query);
    const sorted = sortDemoTests(filtered, sort);
    const { data, meta } = paginate(sorted, page, limit);
    return res.json({ success: true, data, meta, source: "demo" });
  }

  await ensureTestSeedData();

  const query = buildTestQuery(req.query);
  const [tests, total] = await Promise.all([
    TestModel.find(query)
      .sort(testSort(sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    TestModel.countDocuments(query)
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const data = tests.map(mapTest);

  return res.json({
    success: true,
    data,
    meta: { page, limit, total, totalPages },
    source: "database"
  });
});

export const getPackageById = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    const item = packageListingData.find((value) => value.id === req.params.id);
    return item
      ? res.json({ success: true, data: item, source: "demo" })
      : res.status(404).json({ success: false, message: "Package not found." });
  }

  await ensurePackageSeedData();

  const packageItem = mongoose.Types.ObjectId.isValid(req.params.id)
    ? await PackageModel.findById(req.params.id).lean()
    : await PackageModel.findOne({ packageCode: req.params.id }).lean();

  if (!packageItem || packageItem.isActive === false) {
    return res.status(404).json({ success: false, message: "Package not found." });
  }

  return res.json({ success: true, data: mapPackage(packageItem, 0), source: "database" });
});

export const getTestById = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    const item = testListingData.find((value) => value.id === req.params.id);
    return item
      ? res.json({ success: true, data: item, source: "demo" })
      : res.status(404).json({ success: false, message: "Test not found." });
  }

  const testItem = mongoose.Types.ObjectId.isValid(req.params.id)
    ? await TestModel.findById(req.params.id).lean()
    : await TestModel.findOne({ testCode: req.params.id }).lean();

  if (!testItem || testItem.isActive === false) {
    return res.status(404).json({ success: false, message: "Test not found." });
  }

  return res.json({ success: true, data: mapTest(testItem, 0), source: "database" });
});
