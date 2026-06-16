import cartDoctor from "../assets/cart-doctor.png";
import cartGift from "../assets/cart-gift.png";

export const defaultCartItems = [
  {
    id: "full-body-checkup",
    type: "package",
    name: "Full Body Checkup Package",
    subtitle: "80+ Tests",
    description: "Complete health checkup for overall well-being and early detection.",
    price: 1999,
    oldPrice: 4999,
    discount: "60% OFF",
    badge: "Most Popular",
    icon: "FileCheck2",
    color: "green",
    quantity: 1
  },
  {
    id: "vitamin-d-test",
    type: "test",
    name: "Vitamin D Test",
    subtitle: "25 OH Vitamin D",
    description: "Check vitamin D levels and deficiencies for better health.",
    price: 699,
    oldPrice: 1399,
    discount: "50% OFF",
    icon: "Droplet",
    color: "purple",
    quantity: 1
  },
  {
    id: "thyroid-profile",
    type: "test",
    name: "Thyroid Profile",
    subtitle: "Total 3 Tests",
    description: "Complete thyroid profile and related tests.",
    price: 299,
    oldPrice: 599,
    discount: "50% OFF",
    icon: "ShieldCheck",
    color: "blue",
    quantity: 1
  }
];

export const recommendedCartItems = [
  {
    id: "heart-care-package",
    type: "package",
    name: "Heart Care Package",
    subtitle: "35+ Tests",
    description: "Keep your heart healthy with essential heart related tests.",
    price: 1499,
    oldPrice: 3499,
    discount: "57% OFF",
    badge: "Popular",
    icon: "HeartPulse",
    color: "red"
  },
  {
    id: "diabetes-care-package",
    type: "package",
    name: "Diabetes Care Package",
    subtitle: "45+ Tests",
    description: "Comprehensive tests to monitor diabetes and stay healthy.",
    price: 1299,
    oldPrice: 3199,
    discount: "60% OFF",
    badge: "Best Value",
    icon: "UserRound",
    color: "orange"
  },
  {
    id: "kidney-function-test",
    type: "test",
    name: "Kidney Function Test",
    subtitle: "KFT, 8 Parameters",
    description: "Complete kidney function and urine analysis.",
    price: 499,
    oldPrice: 899,
    discount: "45% OFF",
    icon: "ShieldPlus",
    color: "green"
  },
  {
    id: "liver-function-test",
    type: "test",
    name: "Liver Function Test",
    subtitle: "LFT, 11 Parameters",
    description: "Essential tests to assess liver function and health.",
    price: 599,
    oldPrice: 1199,
    discount: "50% OFF",
    icon: "Leaf",
    color: "purple"
  },
  {
    id: "vitamin-b12-test",
    type: "test",
    name: "Vitamin B12 Test",
    subtitle: "Vitamin B12",
    description: "Check vitamin B12 levels and deficiencies.",
    price: 649,
    oldPrice: 1299,
    discount: "50% OFF",
    icon: "Sun",
    color: "orange"
  }
];

export const trustStripItems = [
  { title: "100% Safe & Secure", subtitle: "Your data is protected", icon: "ShieldCheck" },
  { title: "NABL Accredited Labs", subtitle: "Accurate & Reliable Reports", icon: "Award" },
  { title: "Home Collection", subtitle: "Safe & Hygienic", icon: "Truck" },
  { title: "Fast & Accurate Reports", subtitle: "Within 24 - 48 Hours", icon: "CalendarCheck" }
];

export const cartOfferAssets = {
  doctor: cartDoctor,
  gift: cartGift
};
