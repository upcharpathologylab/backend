import { useMemo, useState } from "react";
import { ArrowRight, Search, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/auth/AuthModal.jsx";
import { getStoredUser } from "../components/auth/authStorage.js";
import Icon from "../components/Icon.jsx";
import { price } from "../utils.js";
import { addCartItem } from "../utils/cart.js";

function SearchSection({ quickCards, whatsappNumber, tests, packages }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState({});
  const [added, setAdded] = useState({});
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    return [
      ...tests.map((item) => ({ ...item, resultType: "Test" })),
      ...packages.map((item) => ({ ...item, resultType: "Package" }))
    ]
      .filter((item) => item.name.toLowerCase().startsWith(term))
      .slice(0, 10);
  }, [packages, query, tests]);

  const quickLink = (title) => {
    if (title === "Popular Tests") return "#popular-tests";
    if (title === "Health Packages") return "#packages";
    if (title === "Upload Prescription") {
      return `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent("Hi, I want to upload my prescription for booking a test.")}`;
    }
    if (title === "Download Report") return "/my-account/reports";
    return "#booking";
  };

  const openReports = () => {
    if (getStoredUser()) {
      navigate("/my-account/reports");
      return;
    }
    setAuthMode("signin");
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    navigate("/my-account/reports");
  };

  const resultKey = (item) => `${item.resultType}-${item.id}`;

  const addResultToCart = (item) => {
    const key = resultKey(item);
    setSelected((current) => ({ ...current, [key]: true }));
    addCartItem({
      ...item,
      type: item.resultType.toLowerCase(),
      price: item.discountedPrice,
      oldPrice: item.originalPrice
    });
    setAdded((current) => ({ ...current, [key]: true }));
    window.setTimeout(() => setAdded((current) => ({ ...current, [key]: false })), 1600);
  };

  return (
    <section className="border-b border-blue-100 bg-navy-950 pb-7 pt-4">
      <div className="container-page">
        <div className="rounded-xl border border-white/25 bg-navy-900/60 p-3 shadow-2xl backdrop-blur">
          <div className="grid gap-4 lg:grid-cols-[minmax(420px,560px)_1fr] lg:items-center">
            <div className="relative">
              <div className="flex h-[50px] overflow-hidden rounded-md bg-white shadow-card">
                <span className="flex w-14 items-center justify-center text-black">
                  <Search className="h-7 w-7" />
                </span>
                <input
                  id="home-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="focus-ring h-[50px] flex-1 border-0 px-1 text-base font-medium text-navy-900 outline-none placeholder:text-neutral-600"
                  placeholder="Search for tests eg. CBC, Thyroid, Diabetes..."
                />
                <button className="flex h-[50px] w-[118px] items-center justify-center bg-upchar-green text-lg font-bold text-white transition hover:bg-upchar-greenDark" aria-label="Search">
                  Search
                </button>
              </div>
              {query.trim() && (
                <div className="absolute inset-x-0 top-full z-40 mt-2 max-h-[420px] overflow-y-auto rounded-lg border border-blue-100 bg-white p-2 text-navy-900 shadow-soft">
                  {results.map((item) => {
                    const key = resultKey(item);
                    return (
                      <div className="grid gap-2 border-b border-blue-50 px-3 py-3 last:border-0 sm:grid-cols-[24px_minmax(0,1fr)_70px_90px_120px] sm:items-center" key={key}>
                        <input
                          type="checkbox"
                          checked={Boolean(selected[key])}
                          onChange={(event) => setSelected((current) => ({ ...current, [key]: event.target.checked }))}
                          aria-label={`Select ${item.name}`}
                        />
                        <span className="truncate text-sm font-black">{item.name}</span>
                        <span className="text-xs font-bold text-navy-600">{item.resultType}</span>
                        <span className="text-sm font-black text-upchar-green">{price(item.discountedPrice)}</span>
                        <button
                          type="button"
                          onClick={() => addResultToCart(item)}
                          className={`inline-flex h-9 items-center justify-center gap-1 rounded-md bg-upchar-green px-3 text-xs font-black text-white transition ${
                            added[key] ? "scale-105 bg-upchar-greenDark ring-2 ring-green-200" : ""
                          }`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {added[key] ? "Added" : "Add to Cart"}
                        </button>
                      </div>
                    );
                  })}
                  {!results.length && <p className="px-3 py-5 text-center text-sm font-bold text-navy-600">No matching tests or packages.</p>}
                  <a href={`/tests?search=${encodeURIComponent(query.trim())}`} className="mt-1 flex items-center justify-center gap-2 rounded-md px-3 py-3 text-sm font-black text-upchar-green hover:bg-green-50">
                    View All Results <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {quickCards.map((card, index) => (
                card.title === "Download Report" ? (
                  <button
                    type="button"
                    onClick={openReports}
                    className={`group flex h-[50px] items-center justify-center gap-3 px-2 text-base font-bold text-white transition hover:text-upchar-green ${
                      index ? "xl:border-l xl:border-white/25" : ""
                    }`}
                    key={card.title}
                  >
                    <Icon
                      name={card.icon}
                      className={`h-8 w-8 ${
                        card.color === "red" ? "text-upchar-red" : card.color === "blue" ? "text-upchar-blue" : "text-upchar-green"
                      }`}
                    />
                    <span>{card.title}</span>
                  </button>
                ) : (
                  <a
                    href={quickLink(card.title)}
                    className={`group flex h-[50px] items-center justify-center gap-3 px-2 text-base font-bold text-white transition hover:text-upchar-green ${
                      index ? "xl:border-l xl:border-white/25" : ""
                    }`}
                    key={card.title}
                  >
                    <Icon
                      name={card.icon}
                      className={`h-8 w-8 ${
                        card.color === "red" ? "text-upchar-red" : card.color === "blue" ? "text-upchar-blue" : "text-upchar-green"
                      }`}
                    />
                    <span>{card.title}</span>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </section>
  );
}

export default SearchSection;
