import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/cart/CartItem.jsx";
import CartOfferBanner from "../components/cart/CartOfferBanner.jsx";
import CartSummary from "../components/cart/CartSummary.jsx";
import CartTrustStrip from "../components/cart/CartTrustStrip.jsx";
import CouponBox from "../components/cart/CouponBox.jsx";
import PincodeCheck from "../components/cart/PincodeCheck.jsx";
import RecommendedItems from "../components/cart/RecommendedItems.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import { applyCoupon as applyCouponApi } from "../api/api.js";
import { getStoredUser } from "../components/auth/authStorage.js";
import { defaultCartItems, recommendedCartItems, trustStripItems } from "../data/cartData.js";
import { fallbackHomeData } from "../data/homeData.js";
import {
  addCartItem,
  cartEventName,
  getCartItems,
  hasStoredCart,
  removeCartItem,
  setCartItems,
  updateCartItemQuantity
} from "../utils/cart.js";
import { saveCheckoutData } from "../utils/checkout.js";

const normalizeCartItem = (item) => {
  const price = item.price ?? item.discountedPrice ?? item.finalPrice ?? 0;
  const oldPrice = item.oldPrice ?? item.originalPrice ?? item.price ?? price;

  return {
    ...item,
    price,
    oldPrice,
    subtitle: item.subtitle || item.testCount || item.testsIncluded || "Health item",
    description: item.description || "Trusted diagnostic service with easy booking.",
    discount: item.discount || "Best Price",
    icon: item.icon || "TestTube2",
    color: item.color || "green",
    quantity: Math.max(1, Number(item.quantity || 1))
  };
};

function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = "Your Cart | Upchar Pathology";

    if (!hasStoredCart()) {
      setCartItems(defaultCartItems);
      setItems(defaultCartItems.map(normalizeCartItem));
    } else {
      setItems(getCartItems().map(normalizeCartItem));
    }

    const handleCartChange = () => {
      setItems(getCartItems().map(normalizeCartItem));
    };

    window.addEventListener(cartEventName, handleCartChange);
    window.addEventListener("storage", handleCartChange);

    return () => {
      window.removeEventListener(cartEventName, handleCartChange);
      window.removeEventListener("storage", handleCartChange);
    };
  }, []);

  const summary = useMemo(() => {
    const subtotal = items.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 1), 0);
    const discount = items.length ? Math.floor(subtotal * 0.5) : 0;
    const safeCouponDiscount = Math.min(couponDiscount, Math.max(0, subtotal - discount));
    const totalPayable = Math.max(0, subtotal - discount - safeCouponDiscount);
    const itemCount = items.reduce((total, item) => total + Number(item.quantity || 1), 0);

    return {
      subtotal,
      discount,
      couponDiscount: safeCouponDiscount,
      totalPayable,
      totalSavings: discount + safeCouponDiscount,
      itemCount
    };
  }, [couponDiscount, items]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const refreshItems = () => {
    setItems(getCartItems().map(normalizeCartItem));
  };

  const handleQuantityChange = (item, quantity) => {
    updateCartItemQuantity(item.id, item.type, quantity);
    refreshItems();
  };

  const handleRemove = (item) => {
    removeCartItem(item.id, item.type);
    refreshItems();
    showToast(`${item.name} removed from cart.`);
  };

  const handleCouponApply = async () => {
    const subtotal = items.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 1), 0);

    try {
      const result = await applyCouponApi({ couponCode, subtotal, items });
      setCouponDiscount(Number(result.discountAmount || 0));
      setAppliedCoupon(result);
      showToast(result.message || "Coupon applied successfully");
    } catch {
      setCouponDiscount(0);
      setAppliedCoupon(null);
      showToast("Invalid coupon code");
    }
  };

  const handleRecommendedAdd = (item) => {
    addCartItem({ ...item, quantity: 1 });
    refreshItems();
    showToast(`${item.name} added to cart.`);
  };

  const handleCheckout = () => {
    if (!items.length) {
      showToast("Your cart is empty. Add a package or test first.");
      return;
    }

    saveCheckoutData(items, summary, appliedCoupon);
    if (!getStoredUser()) {
      navigate(`/?auth=signin&returnTo=${encodeURIComponent("/payment")}`);
      return;
    }

    navigate("/payment");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-blue-50/70 via-white to-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        <section className="container-page py-8 lg:py-10">
          <p className="text-sm font-black text-navy-800">
            <a href="/" className="text-upchar-blue">Home</a>
            <span className="mx-2 text-navy-400">&gt;</span>
            Cart
          </p>
          <h1 className="mt-5 text-4xl font-black text-navy-900 sm:text-5xl">Your Cart</h1>
          <p className="mt-4 text-base font-semibold text-navy-700">Review your selected tests / packages before proceeding.</p>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="min-w-0">
              <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
                <h2 className="text-2xl font-black text-navy-900">Cart Items ({summary.itemCount})</h2>
                <div className="mt-5 hidden border-y border-blue-100 py-3 text-sm font-black text-navy-700 lg:grid lg:grid-cols-[1fr_180px_150px_110px_36px]">
                  <span>Test / Package</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span />
                </div>

                {items.length ? (
                  <div>
                    {items.map((item) => (
                      <CartItem
                        item={item}
                        key={`${item.type}-${item.id}`}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50/40 p-8 text-center">
                    <h3 className="text-xl font-black text-navy-900">Your cart is empty</h3>
                    <p className="mt-2 text-sm font-semibold text-navy-700">Add a package or test to continue.</p>
                    <a href="/packages" className="mt-5 inline-flex rounded-md bg-upchar-green px-6 py-3 text-sm font-black text-white">
                      Continue Shopping
                    </a>
                  </div>
                )}

                <CouponBox couponCode={couponCode} onCouponChange={setCouponCode} onApply={handleCouponApply} />
                <CartTrustStrip items={trustStripItems} />
              </section>
            </div>

            <aside className="grid gap-5 self-start">
              <CartSummary summary={summary} onCheckout={handleCheckout} />
              <PincodeCheck />
            </aside>
          </div>

          <RecommendedItems items={recommendedCartItems} onAdd={handleRecommendedAdd} />
          <CartOfferBanner />
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

export default CartPage;
