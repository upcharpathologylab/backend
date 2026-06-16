export const bookingItems = [
  {
    id: "booking-1",
    status: "Completed",
    title: "Full Body Checkup Package",
    bookingId: "UPCH123456789",
    date: "16 May, 2025",
    time: "07:00 AM - 09:00 AM",
    collection: "Home Collection",
    address: "221B, Baker Street, New Delhi",
    amount: 1999,
    paymentStatus: "Paid",
    action: "View Report",
    icon: "ClipboardList",
    color: "green"
  },
  {
    id: "booking-2",
    status: "Upcoming",
    title: "Vitamin D Test",
    bookingId: "UPCH987654321",
    date: "20 May, 2025",
    time: "08:00 AM - 09:00 AM",
    collection: "Lab Visit",
    address: "Upchar Pathology Lab, Sector 62, Noida",
    amount: 699,
    paymentStatus: "Paid",
    action: "Reschedule",
    icon: "Droplet",
    color: "blue"
  },
  {
    id: "booking-3",
    status: "Completed",
    title: "Thyroid Profile",
    bookingId: "UPCH192837465",
    date: "10 May, 2025",
    time: "07:30 AM - 08:30 AM",
    collection: "Home Collection",
    address: "221B, Baker Street, New Delhi",
    amount: 299,
    paymentStatus: "Paid",
    action: "View Report",
    icon: "ShieldCheck",
    color: "green"
  },
  {
    id: "booking-4",
    status: "Cancelled",
    title: "Liver Function Test",
    bookingId: "UPCH564738291",
    date: "05 May, 2025",
    time: "09:00 AM - 10:00 AM",
    collection: "Lab Visit",
    address: "Upchar Pathology Lab, Sector 62, Noida",
    amount: 599,
    paymentStatus: "Refunded",
    action: "View Details",
    icon: "Leaf",
    color: "red"
  },
  {
    id: "booking-5",
    status: "Completed",
    title: "Diabetes Profile Test",
    bookingId: "UPCH837465192",
    date: "28 Apr, 2025",
    time: "07:00 AM - 08:00 AM",
    collection: "Home Collection",
    address: "221B, Baker Street, New Delhi",
    amount: 499,
    paymentStatus: "Paid",
    action: "View Report",
    icon: "Droplet",
    color: "green"
  }
];

export const reportRows = [
  { id: "report-1", title: "Full Body Checkup Package", subtitle: "80+ Tests", bookingId: "UPCH123456789", date: "16 May, 2025", time: "11:24 AM", status: "Available", action: "View PDF", icon: "UsersRound", color: "green" },
  { id: "report-2", title: "Vitamin D Test", subtitle: "25 OH Vitamin D", bookingId: "UPCH987654321", date: "20 May, 2025", time: "09:10 AM", status: "Available", action: "View PDF", icon: "Droplet", color: "purple" },
  { id: "report-3", title: "Thyroid Profile", subtitle: "Total 3 Tests", bookingId: "UPCH192837465", date: "10 May, 2025", time: "08:30 AM", status: "Available", action: "View PDF", icon: "ShieldCheck", color: "blue" },
  { id: "report-4", title: "Liver Function Test", subtitle: "LFT, 11 Parameters", bookingId: "UPCH564738291", date: "05 May, 2025", time: "10:00 AM", status: "Available", action: "View PDF", icon: "Leaf", color: "orange" },
  { id: "report-5", title: "Diabetes Profile", subtitle: "HbA1c, FBS, PPBS", bookingId: "UPCH837465192", date: "28 Apr, 2025", time: "08:00 AM", status: "Processing", action: "Track Status", icon: "Droplet", color: "red" },
  { id: "report-6", title: "Kidney Function Test", subtitle: "KFT, 8 Parameters", bookingId: "UPCH746382910", date: "18 Apr, 2025", time: "09:20 AM", status: "Not Available", action: "-", icon: "HeartPulse", color: "blue" }
];

export const appointmentData = {
  upcoming: [
    {
      id: "apt-1",
      member: "Rahul Sharma",
      relation: "Self",
      test: "Full Body Checkup Package",
      appointmentId: "APT123456",
      collectionType: "Home Collection",
      date: "20 May, 2026",
      time: "07:00 AM - 09:00 AM",
      address: "Home Address",
      status: "Upcoming",
      avatar: "RS",
      actions: ["Reschedule", "Cancel", "View Details", "Track Collection"]
    },
    {
      id: "apt-2",
      member: "Priya Sharma",
      relation: "Wife",
      test: "Thyroid Profile",
      appointmentId: "APT123789",
      collectionType: "Home Collection",
      date: "25 May, 2026",
      time: "08:00 AM - 10:00 AM",
      address: "Home Address",
      status: "Upcoming",
      avatar: "PS",
      actions: ["Reschedule", "Cancel"]
    }
  ],
  rows: [
    { appointment: "Full Body Checkup Package", id: "APT123456", member: "Rahul Sharma", relation: "Self", date: "20 May, 2026", time: "07:00 AM - 09:00 AM", collectionType: "Home Collection", status: "Upcoming" },
    { appointment: "Thyroid Profile", id: "APT123789", member: "Priya Sharma", relation: "Wife", date: "25 May, 2026", time: "08:00 AM - 10:00 AM", collectionType: "Home Collection", status: "Upcoming" },
    { appointment: "Vitamin D Test", id: "APT124567", member: "Aarav Sharma", relation: "Son", date: "28 May, 2026", time: "07:30 AM - 08:30 AM", collectionType: "Lab Visit", status: "Upcoming" }
  ],
  completed: [
    { appointment: "Full Body Checkup", id: "APT12222", member: "Rahul Sharma", relation: "Self", date: "12 May, 2026", status: "Ready" },
    { appointment: "Vitamin D Test", id: "APT12223", member: "Priya Sharma", relation: "Wife", date: "10 May, 2026", status: "Ready" },
    { appointment: "Liver Function Test", id: "APT12224", member: "Aarav Sharma", relation: "Son", date: "05 May, 2026", status: "Downloaded" }
  ],
  cancelled: [
    { appointment: "Thyroid Profile", id: "APT12111", date: "08 May, 2026", cancellationDate: "06 May, 2026", reason: "Customer Request" }
  ]
};

export const savedPackages = [
  { id: "saved-1", title: "Full Body Checkup Package", subtitle: "80+ Tests", description: "Complete health checkup for overall well-being and early detection.", benefits: ["80+ Tests", "Home Collection", "Digital Report", "Doctor Consultation"], price: 2499, oldPrice: 3999, discount: "37% OFF", savedOn: "16 May, 2025", icon: "UsersRound", color: "green" },
  { id: "saved-2", title: "Vitamin D Test", subtitle: "25 OH Vitamin D", description: "Check vitamin D levels and deficiencies for better health.", benefits: ["Accurate Results", "Home Collection", "Digital Report"], price: 699, oldPrice: 999, discount: "30% OFF", savedOn: "14 May, 2025", icon: "Droplet", color: "purple" },
  { id: "saved-3", title: "Thyroid Profile", subtitle: "Total 3 Tests", description: "Complete thyroid profile and related tests.", benefits: ["3 Important Tests", "Home Collection", "Digital Report"], price: 299, oldPrice: 499, discount: "40% OFF", savedOn: "12 May, 2025", icon: "ShieldCheck", color: "blue" },
  { id: "saved-4", title: "Heart Care Package", subtitle: "35+ Tests", description: "Comprehensive heart health checkup for a healthy heart.", benefits: ["35+ Tests", "Home Collection", "Digital Report", "Doctor Consultation"], price: 1999, oldPrice: 2999, discount: "33% OFF", savedOn: "10 May, 2025", icon: "HeartPulse", color: "orange" },
  { id: "saved-5", title: "Diabetes Care Package", subtitle: "45+ Tests", description: "Complete diabetes screening and management tests.", benefits: ["45+ Tests", "Home Collection", "Digital Report", "Diet Consultation"], price: 1299, oldPrice: 1999, discount: "35% OFF", savedOn: "08 May, 2025", icon: "Activity", color: "red" }
];

export const activeOffers = [
  { id: "offer-1", value: "40%", suffix: "OFF", label: "FLAT DISCOUNT", title: "Flat 40% OFF on Full Body Checkup", text: "Get flat 40% off on Full Body Checkup Package. Stay healthy, stay strong!", validTill: "31 May, 2025", minOrder: "Rs. 999", badge: "Applicable on 12 Packages", color: "purple" },
  { id: "offer-2", value: "30%", suffix: "OFF", label: "LAB TESTS", title: "Up to 30% OFF on Lab Tests", text: "Save up to 30% on a wide range of lab tests. Book now and get accurate reports.", validTill: "25 May, 2025", minOrder: "Rs. 499", badge: "Applicable on 45 Tests", color: "green" },
  { id: "offer-3", value: "Rs. 300", suffix: "OFF", label: "ON ORDERS ABOVE Rs. 1499", title: "Flat Rs. 300 OFF on Orders Above Rs. 1499", text: "Get flat Rs. 300 OFF on all orders above Rs. 1499. Use code at checkout and save more!", validTill: "20 May, 2025", minOrder: "Rs. 1,499", badge: "Applicable on All Packages", color: "orange" }
];

export const coupons = [
  { id: "coupon-1", value: "20%", suffix: "OFF", label: "MAX DISCOUNT Rs. 500", title: "20% OFF on Pathology Tests", validTill: "15 June, 2025", minOrder: "Rs. 399", color: "blue" },
  { id: "coupon-2", value: "Rs. 100", suffix: "OFF", label: "ON ORDERS ABOVE Rs. 599", title: "Flat Rs. 100 OFF on Orders Above Rs. 599", validTill: "30 May, 2025", minOrder: "Rs. 599", color: "orange" },
  { id: "coupon-3", value: "FREE", suffix: "HOME COLLECTION", label: "ON ORDERS ABOVE Rs. 999", title: "Free Home Collection", validTill: "30 May, 2025", minOrder: "Rs. 999", color: "red" }
];

export const supportConversations = [
  { title: "Report download issue", id: "#SUP-12456", time: "2 hours ago", status: "Resolved", color: "green" },
  { title: "Payment refund status", id: "#SUP-12410", time: "1 day ago", status: "In Progress", color: "orange" },
  { title: "Appointment reschedule", id: "#SUP-12389", time: "3 days ago", status: "Closed", color: "blue" }
];

export const commonQuestions = [
  "How do I book a test or package?",
  "How can I download my lab report?",
  "How to reschedule an appointment?",
  "What is the home sample collection process?",
  "How can I use coupons & offers?"
];
