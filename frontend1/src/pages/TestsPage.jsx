import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assetUrl, getPageContent, getTests } from "../api/api.js";
import BenefitsStrip from "../components/listing/BenefitsStrip.jsx";
import { TestCard } from "../components/listing/CatalogCard.jsx";
import { matchesSearch, sortCatalogItems, toggleValue } from "../components/listing/catalogUtils.js";
import FilterSidebar, { CheckboxRow, FilterSection } from "../components/listing/FilterSidebar.jsx";
import ListingHero from "../components/listing/ListingHero.jsx";
import ListingToolbar from "../components/listing/ListingToolbar.jsx";
import OfferBanner from "../components/listing/OfferBanner.jsx";
import Pagination from "../components/listing/Pagination.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import { benefitItems, listingHeroes } from "../data/listingData.js";
import { fallbackHomeData } from "../data/homeData.js";
import { addCartItem } from "../utils/cart.js";
import { applyListingHeroContent, getContentSection } from "../utils/contentOverrides.js";
import { price } from "../utils.js";

const defaultFilters = {
  categories: [],
  fasting: [],
  homeCollectionOnly: false,
  reportTime: [],
  maxPrice: 5000
};

const testSortOptions = [
  { value: "popular", label: "Popularity" },
  { value: "price-low", label: "Price Low to High" },
  { value: "price-high", label: "Price High to Low" },
  { value: "rating", label: "Rating" }
];

const booleanValue = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["true", "yes", "available"].includes(value.trim().toLowerCase());
  return value == null ? fallback : Boolean(value);
};

const reportTimeGroup = (value) => {
  const text = String(value || "").toLowerCase();
  const hours = Math.max(...(text.match(/\d+/g) || ["0"]).map(Number));
  if (text.includes("day")) return "3";
  if (hours > 24) return "48";
  return "24";
};

const sortTests = (items, sort) => {
  if (sort === "rating") return [...items].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  return sortCatalogItems(items, sort);
};

const normalizeTest = (item, index) => {
  const originalPrice = item.price ?? item.originalPrice ?? item.oldPrice ?? 0;
  const discountedPrice = item.finalPrice ?? item.discountedPrice ?? originalPrice;
  const hasDiscountPercent = item.discountPercent !== undefined && item.discountPercent !== null && item.discountPercent !== "";

  const image = assetUrl(item.testImage || item.image || "");

  return {
    ...item,
    id: item.id || item.slug || item._id || `test-${index}`,
    name: item.testName || item.name || "Pathology Test",
    subtitle: item.description || item.subtitle || item.category || "Pathology test",
    description: item.description || item.subtitle || "",
    image,
    icon: item.icon || "TestTube2",
    color: item.badgeType || item.color || "green",
    badge: item.badge || "",
    discountedPrice,
    originalPrice,
    discount: hasDiscountPercent ? `${item.discountPercent}% OFF` : item.discount || "Best Price",
    reportTime: item.reportTime || "24 hrs",
    homeCollection: booleanValue(item.homeCollection ?? item.isHomeCollectionAvailable ?? item.homeCollectionAvailable, false),
    fastingRequired: booleanValue(item.fastingRequired, false),
    rating: item.rating ?? 4.6,
    popularity: item.popularity ?? 0,
    sortOrder: item.sortOrder ?? 0,
    status: item.status || (item.isActive === false ? "Inactive" : "Active"),
    isActive: item.isActive !== false
  };
};

function TestsPage() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [sort, setSort] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [content, setContent] = useState(null);
  const itemsPerPage = 12;

  useEffect(() => {
    let mounted = true;

    getPageContent("tests")
      .then((data) => {
        if (mounted) setContent(data);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters, searchTerm, sort]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    getTests({ activeOnly: true, limit: 500, page: 1, sort: "popular" })
      .then((response) => {
        if (!mounted) return;
        const rows = Array.isArray(response) ? response : response?.data || [];
        const normalizedRows = rows.map(normalizeTest);
        const maximumPrice = Math.max(100, ...normalizedRows.map((item) => Number(item.discountedPrice || 0)));
        setItems(normalizedRows);
        setFilters((current) => ({ ...current, maxPrice: maximumPrice }));
        setAppliedFilters((current) => ({ ...current, maxPrice: maximumPrice }));
      })
      .catch((requestError) => {
        if (!mounted) return;
        setItems([]);
        setError(requestError?.response?.data?.message || "Could not load tests. Please try again.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const counts = items.reduce((result, item) => {
      if (item.category) result[item.category] = (result[item.category] || 0) + 1;
      return result;
    }, {});
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => ({ label: value, value, count }));
  }, [items]);
  const filterCounts = useMemo(() => ({
    fastingYes: items.filter((item) => item.fastingRequired).length,
    fastingNo: items.filter((item) => !item.fastingRequired).length,
    homeCollection: items.filter((item) => item.homeCollection).length,
    report24: items.filter((item) => reportTimeGroup(item.reportTime) === "24").length,
    report48: items.filter((item) => reportTimeGroup(item.reportTime) === "48").length,
    report3: items.filter((item) => reportTimeGroup(item.reportTime) === "3").length
  }), [items]);
  const maximumPrice = useMemo(() => Math.max(100, ...items.map((item) => Number(item.discountedPrice || 0))), [items]);
  const filteredItems = useMemo(() => {
    const values = items.filter((item) => {
      const categoryMatch = !appliedFilters.categories.length || appliedFilters.categories.includes(item.category);
      const fastingMatch = !appliedFilters.fasting.length
        || appliedFilters.fasting.includes(item.fastingRequired ? "yes" : "no");
      const collectionMatch = !appliedFilters.homeCollectionOnly || item.homeCollection;
      const reportMatch = !appliedFilters.reportTime.length || appliedFilters.reportTime.includes(reportTimeGroup(item.reportTime));
      const priceMatch = Number(item.discountedPrice) <= Number(appliedFilters.maxPrice);
      return categoryMatch && fastingMatch && collectionMatch && reportMatch && priceMatch && matchesSearch(item, searchTerm);
    });
    return sortTests(values, sort);
  }, [appliedFilters, items, searchTerm, sort]);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const visibleItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const start = filteredItems.length ? (page - 1) * itemsPerPage + 1 : 0;
  const end = Math.min(page * itemsPerPage, filteredItems.length);
  const showingLabel = loading ? "Loading tests..." : `Showing ${start} - ${end} of ${filteredItems.length} tests`;
  const heroContent = useMemo(() => applyListingHeroContent(listingHeroes.tests, content), [content]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const handleAddToCart = (item) => {
    addCartItem({
      id: item.id,
      type: "test",
      name: item.name,
      subtitle: item.subtitle,
      price: item.discountedPrice,
      oldPrice: item.originalPrice,
      discount: item.discount,
      icon: item.icon,
      image: item.image,
      color: item.color
    });
    showToast(`${item.name} added to cart.`);
  };

  const handleQuickCategory = (value) => {
    if (value === "all") {
      setSearchTerm("");
      updateFilter("categories", []);
      setAppliedFilters((current) => ({ ...current, categories: [] }));
      return;
    }

    if (value === "full-body") {
      setSearchTerm("profile");
      updateFilter("categories", []);
      setAppliedFilters((current) => ({ ...current, categories: [] }));
      return;
    }

    const matchingCategory = categories.find(
      (category) =>
        String(category.value).toLowerCase() === value ||
        String(category.label).toLowerCase().includes(value)
    );

    setSearchTerm("");
    updateFilter("categories", [matchingCategory?.value || value]);
    setAppliedFilters((current) => ({ ...current, categories: [matchingCategory?.value || value] }));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        <ListingHero
          hero={heroContent}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onQuickCategory={handleQuickCategory}
        />

        <section className="bg-gradient-to-b from-white to-blue-50/50 py-8 lg:py-10">
          <div className="container-page grid min-w-0 gap-6 lg:grid-cols-[260px_1fr]">
            <FilterSidebar onClear={() => {
              const cleared = { ...defaultFilters, maxPrice: maximumPrice };
              setFilters(cleared);
              setAppliedFilters(cleared);
            }}>
              <FilterSection title="Category">
                {categories.map((category) => (
                  <CheckboxRow
                    key={category.value}
                    label={category.label}
                    count={category.count}
                    checked={filters.categories.includes(category.value)}
                    onChange={() => updateFilter("categories", toggleValue(filters.categories, category.value))}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Price Range">
                <div>
                  <div className="mb-3 flex justify-between text-xs font-black text-navy-700">
                    <span>{price(0)}</span>
                    <span>{price(filters.maxPrice)}+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maximumPrice}
                    step="100"
                    value={filters.maxPrice}
                    onChange={(event) => updateFilter("maxPrice", Number(event.target.value))}
                    className="w-full accent-upchar-green"
                  />
                  <p className="mt-2 text-center text-xs font-black text-navy-700">{price(0)} - {price(filters.maxPrice)}+</p>
                </div>
              </FilterSection>

              <FilterSection title="Fasting Required">
                <CheckboxRow
                  label="Yes"
                  count={filterCounts.fastingYes}
                  checked={filters.fasting.includes("yes")}
                  onChange={() => updateFilter("fasting", toggleValue(filters.fasting, "yes"))}
                />
                <CheckboxRow
                  label="No"
                  count={filterCounts.fastingNo}
                  checked={filters.fasting.includes("no")}
                  onChange={() => updateFilter("fasting", toggleValue(filters.fasting, "no"))}
                />
              </FilterSection>

              <FilterSection title="Home Collection">
                <CheckboxRow
                  label="Available"
                  count={filterCounts.homeCollection}
                  checked={filters.homeCollectionOnly}
                  onChange={() => updateFilter("homeCollectionOnly", !filters.homeCollectionOnly)}
                />
              </FilterSection>

              <FilterSection title="Report Time">
                {[
                  ["24", "Within 24 hrs", filterCounts.report24],
                  ["48", "Within 48 hrs", filterCounts.report48],
                  ["3", "2-3 Days", filterCounts.report3]
                ].map(([value, label, count]) => (
                  <CheckboxRow
                    key={value}
                    label={label}
                    count={count}
                    checked={filters.reportTime.includes(value)}
                    onChange={() => updateFilter("reportTime", toggleValue(filters.reportTime, value))}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setAppliedFilters(filters);
                    setPage(1);
                  }}
                  className="mt-2 rounded-md border border-upchar-green py-2 text-sm font-black text-upchar-green"
                >
                  Apply Filters
                </button>
              </FilterSection>
            </FilterSidebar>

            <div className="min-w-0">
              <ListingToolbar
                label={showingLabel}
                sort={sort}
                onSortChange={setSort}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortOptions={testSortOptions}
              />

              {loading ? (
                <div className="mt-6 rounded-lg border border-blue-100 bg-white p-8 text-center shadow-sm">
                  <h3 className="text-xl font-black text-navy-900">Loading tests...</h3>
                  <p className="mt-2 text-sm font-semibold text-navy-600">Fetching the latest active tests.</p>
                </div>
              ) : null}

              {error ? (
                <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-8 text-center shadow-sm">
                  <h3 className="text-xl font-black text-upchar-red">Unable to load tests</h3>
                  <p className="mt-2 text-sm font-semibold text-navy-700">{error}</p>
                </div>
              ) : null}

              {!loading && !error ? (
                <div
                  className={`mt-5 grid gap-5 ${
                    viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1"
                  }`}
                >
                  {visibleItems.map((item) => (
                    <TestCard item={item} viewMode={viewMode} key={item.id} onAddToCart={handleAddToCart} onDetails={() => showToast("Coming Soon")} />
                  ))}
                </div>
              ) : null}

              {!loading && !error && !visibleItems.length ? (
                <div className="mt-6 rounded-lg border border-blue-100 bg-white p-8 text-center shadow-sm">
                  <h3 className="text-xl font-black text-navy-900">No tests found</h3>
                  <p className="mt-2 text-sm font-semibold text-navy-600">Try changing search or filters.</p>
                </div>
              ) : null}

              {!loading && !error ? <Pagination page={page} totalPages={totalPages} onPageChange={setPage} /> : null}
            </div>
          </div>

          <div className="container-page mt-8 grid gap-5">
            <OfferBanner type="tests" content={getContentSection(content, "offer")} />
            <BenefitsStrip items={benefitItems} />
          </div>
        </section>
      </main>
      <Footer data={fallbackHomeData} />

      <AnimatePresence>
        {toast ? (
          <motion.div
            className="fixed bottom-6 left-1/2 z-[120] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg bg-navy-950 px-5 py-3 text-center text-sm font-black text-white shadow-soft"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default TestsPage;
