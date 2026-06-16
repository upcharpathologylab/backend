import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assetUrl, getPackages, getPageContent } from "../api/api.js";
import BenefitsStrip from "../components/listing/BenefitsStrip.jsx";
import { PackageCard } from "../components/listing/CatalogCard.jsx";
import { matchesSearch, sortCatalogItems, toggleValue } from "../components/listing/catalogUtils.js";
import FilterSidebar, { CheckboxRow, FilterSection } from "../components/listing/FilterSidebar.jsx";
import ListingHero from "../components/listing/ListingHero.jsx";
import ListingToolbar from "../components/listing/ListingToolbar.jsx";
import OfferBanner from "../components/listing/OfferBanner.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import { benefitItems, listingHeroes } from "../data/listingData.js";
import { fallbackHomeData } from "../data/homeData.js";
import { addCartItem } from "../utils/cart.js";
import { applyListingHeroContent, getContentSection } from "../utils/contentOverrides.js";
import { price } from "../utils.js";

const defaultFilters = {
  categories: [],
  genders: [],
  homeCollectionOnly: false,
  maxPrice: 5000
};

const booleanValue = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["true", "yes", "available"].includes(value.trim().toLowerCase());
  return value == null ? fallback : Boolean(value);
};

const normalizePackage = (item, index) => {
  const originalPrice = item.price ?? item.originalPrice ?? item.oldPrice ?? 0;
  const discountedPrice = item.finalPrice ?? item.discountedPrice ?? originalPrice;
  const hasDiscountPercent = item.discountPercent !== undefined && item.discountPercent !== null && item.discountPercent !== "";

  return {
    ...item,
    id: item.id || item.slug || item._id || `package-${index}`,
    name: item.packageName || item.name || "Health Package",
    packageName: item.packageName || item.name || "Health Package",
    packageCode: item.packageCode || "",
    description: item.description || "Curated health package with home sample collection.",
    testCount: item.testsIncluded || item.testCount || "30+ Tests",
    testsIncluded: item.testsIncluded || item.testCount || "30+ Tests",
    image: assetUrl(item.packageImage || item.image || ""),
    icon: item.icon || "Gift",
    color: item.color || "green",
    badge: item.badge || "",
    discountedPrice,
    originalPrice,
    discount: hasDiscountPercent ? `${item.discountPercent}% OFF` : item.discount || "Best Price",
    gender: item.gender || "all",
    homeCollection: booleanValue(item.homeCollection ?? item.isHomeCollectionAvailable ?? item.homeCollectionAvailable, false),
    reportTime: item.reportTime || "24 - 36 hrs",
    popularity: item.popularity ?? index,
    status: item.status || (item.isActive === false ? "Inactive" : "Active"),
    isActive: item.isActive !== false,
    buttonText: item.buttonText || "Book Now",
    buttonLink: item.buttonLink || (item.buttonUrl && item.buttonUrl !== "/cart" ? item.buttonUrl : "")
  };
};

const packageCategoryOptions = (rows) =>
  [...new Set(rows.map((item) => item.category).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b)))
    .map((category) => ({ label: category, value: category }));

function PackagesPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [sort, setSort] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [toast, setToast] = useState("");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    getPackages()
      .then((data) => {
        if (mounted) {
          const sourceRows = Array.isArray(data) ? data : data?.data || [];
          const rows = sourceRows.filter((item) => item.isActive !== false && item.status !== "Inactive").map(normalizePackage);
          const maximumPrice = Math.max(500, ...rows.map((item) => Number(item.discountedPrice || 0)));
          setItems(rows);
          setCategories(packageCategoryOptions(rows));
          setFilters((current) => ({ ...current, maxPrice: maximumPrice }));
          setAppliedFilters((current) => ({ ...current, maxPrice: maximumPrice }));
        }
      })
      .catch((requestError) => {
        if (mounted) {
          setItems([]);
          setCategories([]);
          setError(requestError?.response?.data?.message || "Could not load packages. Please try again.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    getPageContent("packages")
      .then((data) => {
        if (mounted) setContent(data);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const values = items.filter((item) => {
      const categoryMatch = !appliedFilters.categories.length || appliedFilters.categories.includes(item.category);
      const genderMatch =
        !appliedFilters.genders.length || appliedFilters.genders.includes(item.gender) || item.gender === "all";
      const collectionMatch = !appliedFilters.homeCollectionOnly || item.homeCollection;
      const priceMatch = Number(item.discountedPrice) <= Number(appliedFilters.maxPrice);

      return categoryMatch && genderMatch && collectionMatch && priceMatch && matchesSearch(item, searchTerm);
    });

    return sortCatalogItems(values, sort);
  }, [items, appliedFilters, searchTerm, sort]);
  const maximumPrice = useMemo(() => Math.max(500, ...items.map((item) => Number(item.discountedPrice || 0))), [items]);
  const homeCollectionCount = useMemo(() => items.filter((item) => item.homeCollection).length, [items]);

  const showingLabel = `Showing ${filteredItems.length ? 1 : 0} - ${filteredItems.length} of ${filteredItems.length} packages`;
  const heroContent = useMemo(() => applyListingHeroContent(listingHeroes.packages, content), [content]);

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
      type: "package",
      name: item.name,
      subtitle: item.testCount,
      description: item.description,
      price: item.discountedPrice,
      oldPrice: item.originalPrice,
      discount: item.discount,
      badge: item.badge,
      icon: item.icon,
      color: item.color
    });
    showToast(`${item.name} added to cart.`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        <ListingHero hero={heroContent} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

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

              <FilterSection title="Gender">
                {[
                  ["all", "All"],
                  ["male", "Male"],
                  ["female", "Female"]
                ].map(([value, label]) => (
                  <CheckboxRow
                    key={value}
                    label={label}
                    checked={filters.genders.includes(value)}
                    onChange={() => updateFilter("genders", toggleValue(filters.genders, value))}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Home Collection">
                <CheckboxRow
                  label="Available Only"
                  count={homeCollectionCount}
                  checked={filters.homeCollectionOnly}
                  onChange={() => updateFilter("homeCollectionOnly", !filters.homeCollectionOnly)}
                />
                <button
                  type="button"
                  onClick={() => setAppliedFilters(filters)}
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
              />

              {loading ? (
                <div className="mt-6 rounded-lg border border-blue-100 bg-white p-8 text-center shadow-sm">
                  <h3 className="text-xl font-black text-navy-900">Loading packages...</h3>
                  <p className="mt-2 text-sm font-semibold text-navy-600">Fetching the latest active packages.</p>
                </div>
              ) : null}

              {error ? (
                <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-8 text-center shadow-sm">
                  <h3 className="text-xl font-black text-upchar-red">Unable to load packages</h3>
                  <p className="mt-2 text-sm font-semibold text-navy-700">{error}</p>
                </div>
              ) : null}

              {!loading && !error ? (
                <div
                  className={`mt-5 grid gap-5 ${
                    viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1"
                  }`}
                >
                  {filteredItems.map((item) => (
                    <PackageCard
                      item={item}
                      viewMode={viewMode}
                      key={item.id}
                      onAddToCart={handleAddToCart}
                      onDetails={() => showToast("Details page coming soon.")}
                    />
                  ))}
                </div>
              ) : null}

              {!loading && !error && !filteredItems.length ? (
                <div className="mt-6 rounded-lg border border-blue-100 bg-white p-8 text-center shadow-sm">
                  <h3 className="text-xl font-black text-navy-900">No packages found</h3>
                  <p className="mt-2 text-sm font-semibold text-navy-600">Try changing search or filters.</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="container-page mt-8 grid gap-5">
            <BenefitsStrip items={benefitItems.slice(0, 4)} />
            <OfferBanner type="packages" content={getContentSection(content, "offer")} />
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

export default PackagesPage;
