export const profileStorageKey = "upchar_profile_data";

export const defaultProfile = {
  fullName: "Rahul Sharma",
  email: "rahulsharma@gmail.com",
  phone: "+91 98765 43210",
  memberSince: "May, 2025",
  dateOfBirth: "15 Aug, 1990",
  gender: "Male",
  bloodGroup: "O+",
  alternateNumber: "+91 91234 56789",
  preferredLanguage: "English",
  totalBookings: "5",
  reportsGenerated: "3",
  upcomingAppointments: "1",
  totalSpent: "Rs. 4,346",
  verified: true
};

export const defaultAddresses = [
  {
    id: "home",
    type: "Home",
    label: "Home",
    name: "",
    badge: "Home (Primary)",
    addressLine1: "221B, Baker Street",
    addressLine2: "Near City Hospital, Connaught Place",
    addressLine: "221B, Baker Street, Near City Hospital, Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    country: "India",
    phone: "+91 98765 43210",
    isPrimary: true,
    primary: true
  },
  {
    id: "office",
    type: "Office",
    label: "Office",
    name: "Upchar Pathology Pvt. Ltd.",
    badge: "Office",
    addressLine1: "Upchar Pathology Pvt. Ltd.",
    addressLine2: "4th Floor, Tech Park, Sector 62",
    addressLine: "Upchar Pathology Pvt. Ltd. 4th Floor, Tech Park, Sector 62",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    country: "India",
    phone: "+91 99112 34567",
    isPrimary: false,
    primary: false
  }
];

export const defaultFamilyMembers = [
  {
    id: "priya",
    fullName: "Priya Sharma",
    name: "Priya Sharma",
    relation: "Wife",
    dateOfBirth: "12 March, 1992",
    gender: "Female",
    bloodGroup: "A+",
    color: "green"
  },
  {
    id: "aarav",
    fullName: "Aarav Sharma",
    name: "Aarav Sharma",
    relation: "Son",
    dateOfBirth: "05 July, 2018",
    gender: "Male",
    bloodGroup: "B+",
    color: "blue"
  },
  {
    id: "ananya",
    fullName: "Ananya Sharma",
    name: "Ananya Sharma",
    relation: "Daughter",
    dateOfBirth: "21 Nov, 2021",
    gender: "Female",
    bloodGroup: "O+",
    color: "purple"
  }
];

export const sidebarItems = [
  { id: "profile", label: "My Profile", subtitle: "Personal information", icon: "UserRound" },
  { id: "prescription", label: "Upload Prescription", subtitle: "Share prescription", icon: "UploadCloud" },
  { id: "addresses", label: "Addresses", subtitle: "Manage addresses", icon: "MapPin" },
  { id: "family", label: "Family Members", subtitle: "Manage your family", icon: "UsersRound" },
  { id: "bookings", label: "My Bookings", subtitle: "View booking history", icon: "ClipboardList" },
  { id: "reports", label: "Reports", subtitle: "View your reports", icon: "FileText" },
  { id: "appointments", label: "Appointments", subtitle: "Upcoming appointments", icon: "CalendarDays" },
  { id: "saved", label: "Saved Packages", subtitle: "Your saved packages", icon: "Heart" },
  { id: "payments", label: "Payment Methods", subtitle: "Saved cards & UPI", icon: "CreditCard" },
  { id: "offers", label: "Offers & Coupons", subtitle: "View offers & coupons", icon: "BadgePercent" },
  { id: "notifications", label: "Notification Settings", subtitle: "Manage notifications", icon: "Bell" },
  { id: "settings", label: "Account Settings", subtitle: "Change password", icon: "Settings" },
  { id: "help", label: "Help & Support", subtitle: "Get help", icon: "Headphones" }
];

export const accountSidebarItems = [
  { id: "profile", href: "/my-account", label: "My Profile", subtitle: "Personal information", icon: "UserRound" },
  { id: "prescription", href: "/my-account", label: "Upload Prescription", subtitle: "Share prescription", icon: "UploadCloud" },
  { id: "addresses", href: "/my-account/addresses", label: "Addresses", subtitle: "Manage addresses", icon: "MapPin" },
  { id: "family", href: "/my-account/family-members", label: "Family Members", subtitle: "Manage your family", icon: "UsersRound" },
  { id: "bookings", href: "/my-account/bookings", label: "My Bookings", subtitle: "View booking history", icon: "ClipboardList" },
  { id: "reports", href: "/my-account/reports", label: "Reports", subtitle: "View your reports", icon: "FileText" },
  { id: "appointments", href: "/my-account/appointments", label: "Appointments", subtitle: "Upcoming appointments", icon: "CalendarDays" },
  { id: "saved", href: "/my-account/saved-packages", label: "Saved Packages", subtitle: "Your saved packages", icon: "Heart" },
  { id: "offers", href: "/my-account/offers-coupons", label: "Offers & Coupons", subtitle: "View offers & coupons", icon: "BadgePercent" },
  { id: "notifications", href: "/my-account", label: "Notification Settings", subtitle: "Manage notifications", icon: "Bell" },
  { id: "settings", href: "/my-account/account-settings", label: "Account Settings", subtitle: "Change password", icon: "Settings" },
  { id: "help", href: "/my-account/help-support", label: "Help & Support", subtitle: "Get help", icon: "Headphones" }
];

export const quickActions = [
  { title: "Book a Test", subtitle: "Book health tests", icon: "FileCheck2", href: "/tests" },
  { title: "View Reports", subtitle: "Access your reports", icon: "ClipboardList", href: "/my-account/reports" },
  { title: "Check Health Packages", subtitle: "Explore packages", icon: "BadgeCheck", href: "/packages" },
  { title: "Refer & Earn", subtitle: "Invite and earn rewards", icon: "UsersRound", href: "/my-account/offers-coupons" }
];

export const profileTrustItems = [
  { title: "100% Safe & Secure", subtitle: "Your data is protected", icon: "ShieldCheck" },
  { title: "NABL Accredited Labs", subtitle: "Accurate & Reliable Reports", icon: "Award" },
  { title: "Home Collection", subtitle: "Safe & Hygienic", icon: "Truck" },
  { title: "Fast & Accurate Reports", subtitle: "Within 24 - 48 Hours", icon: "CalendarCheck" }
];
