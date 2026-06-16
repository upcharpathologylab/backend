const image = (id, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const fallbackHomeData = {
  siteSettings: {
    contactHeading: "Contact Information",
    companyName: "Upchar Pathology Pvt. Ltd.",
    phone: "8882753539",
    phoneTiming: "Mon - Sun: 7:00 AM - 9:00 PM",
    whatsappNumber: "8882753539",
    whatsappText: "Send us a message on WhatsApp",
    email: "upcharpathologylab@gmail.com",
    emailResponseText: "We reply within 24 hours",
    address: "Upchar Pathology, 163, Health Street, Sector 44, Noida, Uttar Pradesh - 201301",
    hours: "Mon - Sun: 7:00 AM - 9:00 PM",
    socialLinks: [
      { label: "Facebook", url: "#" },
      { label: "Instagram", url: "#" },
      { label: "LinkedIn", url: "#" },
      { label: "YouTube", url: "#" }
    ],
    footerLinks: {
      company: ["About Us", "Blog", "Careers", "Contact Us", "Corporate Services"],
      services: ["All Tests", "Health Packages", "Sample Collection", "Corporate Services", "Home Collection"],
      support: ["Help Center", "FAQs", "Terms & Conditions", "Privacy Policy", "Refund Policy"]
    }
  },
  hero: {
    title: "Book Lab Tests Online from",
    highlightText: "Trusted Partner Labs",
    subtitle:
      "We are a service provider connecting you with NABL accredited labs and trusted collection partners.",
    trustPoints: [
      { label: "Accurate Reports", icon: "BadgeCheck" },
      { label: "Affordable Prices", icon: "BadgeIndianRupee" },
      { label: "Home Sample Collection", icon: "Home" },
      { label: "Fast Report Delivery", icon: "Truck" }
    ],
    buttons: [
      { label: "Book Test Now", href: "#booking", variant: "primary" },
      { label: "View Packages", href: "#packages", variant: "outline" }
    ],
    offerText: "UP TO 60% OFF on selected health packages",
    image: "/images/home-banner.png"
  },
  govtPanels: [
    "CGHS (Central Government Health Scheme)",
    "ECHS (Ex-Servicemen Contributory Health Scheme)",
    "ESIC / ESI",
    "DGEHS (Delhi Govt Employees Health Scheme)",
    "Delhi Jal Board (DJB)",
    "NTPC",
    "IOCL",
    "GAIL",
    "SAIL",
    "NPT"
  ],
  partnerships: ["Pharmacy Partnership Model", "Doctor Partnership Model"],
  quickCards: [
    { title: "Popular Tests", icon: "Flame", color: "red" },
    { title: "Health Packages", icon: "Gift", color: "green" },
    { title: "Upload Prescription", icon: "UploadCloud", color: "blue" },
    { title: "Download Report", icon: "FileDown", color: "green" }
  ],
  packages: [
    {
      name: "Full Body Checkup",
      category: "family",
      testCount: "80+ Tests",
      originalPrice: 4999,
      discountedPrice: 1999,
      image: image("photo-1560250097-0b93528c311a", 700),
      icon: "UsersRound",
      color: "blue",
      isPopular: false,
      isActive: true
    },
    {
      name: "Senior Citizen Package",
      category: "senior",
      testCount: "70+ Tests",
      originalPrice: 4599,
      discountedPrice: 1799,
      image: image("photo-1581579438747-104c53d7fbc4", 700),
      icon: "HeartHandshake",
      color: "red",
      isPopular: false,
      isActive: true
    },
    {
      name: "Womens Health Package",
      category: "women",
      testCount: "65+ Tests",
      originalPrice: 4299,
      discountedPrice: 1699,
      image: image("photo-1594824476967-48c8b964273f", 700),
      icon: "VenetianMask",
      color: "purple",
      isPopular: true,
      isActive: true
    },
    {
      name: "Diabetes Care Package",
      category: "diabetes",
      testCount: "45+ Tests",
      originalPrice: 2199,
      discountedPrice: 1299,
      image: image("photo-1583912267550-46a783ef226a", 700),
      icon: "Droplet",
      color: "green",
      isPopular: false,
      isActive: true
    },
    {
      name: "Thyroid Package",
      category: "thyroid",
      testCount: "30+ Tests",
      originalPrice: 2199,
      discountedPrice: 999,
      image: image("photo-1559757148-5c350d0d3c56", 700),
      icon: "Activity",
      color: "orange",
      isPopular: false,
      isActive: true
    }
  ],
  organs: [
    { name: "Heart Test", icon: "HeartPulse", color: "red" },
    { name: "Lung Test", icon: "Wind", color: "red" },
    { name: "Gastrointestine", icon: "Apple", color: "orange" },
    { name: "Kidney Test", icon: "ShieldPlus", color: "green" },
    { name: "Bone & Joint", icon: "Bone", color: "orange" },
    { name: "Brain Health", icon: "Brain", color: "purple" },
    { name: "Blood Test", icon: "Droplet", color: "red" },
    { name: "Liver Function", icon: "Leaf", color: "green" }
  ],
  tests: [
    {
      name: "CBC Test",
      category: "blood",
      originalPrice: 249,
      discountedPrice: 199,
      image: image("photo-1579154204601-01588f351e67", 600),
      icon: "TestTube2",
      isActive: true
    },
    {
      name: "Thyroid Profile",
      category: "thyroid",
      originalPrice: 299,
      discountedPrice: 199,
      image: image("photo-1559757175-0eb30cd8c063", 600),
      icon: "Activity",
      isActive: true
    },
    {
      name: "Liver Function Test",
      category: "liver",
      originalPrice: 399,
      discountedPrice: 299,
      image: image("photo-1579684288361-5c1a29545625", 600),
      icon: "Leaf",
      isActive: true
    },
    {
      name: "Kidney Function Test",
      category: "kidney",
      originalPrice: 599,
      discountedPrice: 399,
      image: image("photo-1581595219315-a187dd40c322", 600),
      icon: "ShieldPlus",
      isActive: true
    },
    {
      name: "Blood Sugar Test",
      category: "diabetes",
      originalPrice: 99,
      discountedPrice: 79,
      image: image("photo-1625134673337-519d4d10b313", 600),
      icon: "Droplet",
      isActive: true
    },
    {
      name: "Vitamin D Test",
      category: "vitamin",
      originalPrice: 699,
      discountedPrice: 499,
      image: image("photo-1581093458791-9f3c3900df7b", 600),
      icon: "Sun",
      isActive: true
    },
    {
      name: "Vitamin B12 Test",
      category: "vitamin",
      originalPrice: 699,
      discountedPrice: 499,
      image: image("photo-1582719471384-894fbb16e074", 600),
      icon: "BadgeCheck",
      isActive: true
    },
    {
      name: "Lipid Profile Test",
      category: "heart",
      originalPrice: 399,
      discountedPrice: 299,
      image: image("photo-1578496781985-452d4a934d50", 600),
      icon: "HeartPulse",
      isActive: true
    }
  ],
  whyChoose: [
    {
      title: "NABL Accredited Lab Network",
      description: "Trusted labs with highest quality and accuracy",
      icon: "ShieldCheck",
      color: "blue"
    },
    {
      title: "Affordable & Transparent Pricing",
      description: "Best prices with no hidden charges",
      icon: "BadgeIndianRupee",
      color: "green"
    },
    {
      title: "Accurate & Reliable Reports",
      description: "Advanced technology and expert analysis",
      icon: "Target",
      color: "purple"
    },
    {
      title: "Home Sample Collection",
      description: "Convenient home sample collection by experts",
      icon: "HousePlus",
      color: "orange"
    },
    {
      title: "Expert Report Verification",
      description: "Reports verified by experienced pathologists",
      icon: "Award",
      color: "teal"
    },
    {
      title: "Secure & Confidential",
      description: "Your data and reports are 100% secure",
      icon: "LockKeyhole",
      color: "red"
    },
    {
      title: "Fast Report Online Download",
      description: "Get reports quickly on email or account",
      icon: "CloudDownload",
      color: "blue"
    },
    {
      title: "24/7 Customer Support",
      description: "Our support team is always here to help",
      icon: "Headphones",
      color: "green"
    }
  ],
  howItWorks: [
    {
      title: "Book Your Test",
      description: "Select tests or packages and place your order online.",
      icon: "CalendarCheck",
      color: "blue"
    },
    {
      title: "Sample Collection",
      description: "Our executive will visit your home for sample collection.",
      icon: "HousePlus",
      color: "green"
    },
    {
      title: "Testing at Partner Lab",
      description: "Samples are tested at NABL accredited labs.",
      icon: "TestTube2",
      color: "purple"
    },
    {
      title: "Expert Report Verification",
      description: "Reports are verified by our expert pathologists for accuracy.",
      icon: "Award",
      color: "teal"
    },
    {
      title: "Get Reports Online",
      description: "Reports delivered quickly in your account.",
      icon: "FileCheck2",
      color: "orange"
    }
  ],
  reviews: [
    {
      name: "Rahul Sharma",
      rating: 5,
      comment: "On-time and reports are accurate.",
      reviewDate: "2 days ago",
      image: image("photo-1500648767791-00dcc994a43e", 300)
    },
    {
      name: "Priya Mehta",
      rating: 5,
      comment: "Quick and reliable. Highly recommended!",
      reviewDate: "5 days ago",
      image: image("photo-1494790108377-be9c29b29330", 300)
    },
    {
      name: "Amit Verma",
      rating: 5,
      comment: "Very professional and hassle-free experience.",
      reviewDate: "1 week ago",
      image: image("photo-1506794778202-cad84cf45f1d", 300)
    }
  ],
  blogs: [
    {
      title: "10 Essential Health Tests You Shouldn't Ignore",
      shortDescription: "Regular health checkups can help detect problems early and keep you healthier.",
      image: image("photo-1579684385127-1ef15d508118", 800),
      date: "May 16, 2025",
      readTime: "5 min read",
      slug: "essential-health-tests"
    },
    {
      title: "Why Preventive Health Checkups Are Important",
      shortDescription: "Prevention is better than cure. Know how regular tests can save lives.",
      image: image("photo-1582750433449-648ed127bb54", 800),
      date: "May 10, 2025",
      readTime: "6 min read",
      slug: "preventive-health-checkups"
    },
    {
      title: "Understanding Your Blood Test Reports",
      shortDescription: "A simple guide to help you understand common blood test parameters.",
      image: image("photo-1579154341098-e4e158cc7f55", 800),
      date: "May 04, 2025",
      readTime: "7 min read",
      slug: "understanding-blood-test-reports"
    },
    {
      title: "Tips to Boost Immunity Naturally",
      shortDescription: "Simple lifestyle and diet tips to strengthen your immune system.",
      image: image("photo-1506126613408-eca07ce68773", 800),
      date: "May 01, 2025",
      readTime: "5 min read",
      slug: "boost-immunity-naturally"
    }
  ],
  booking: {
    cities: ["Noida", "Delhi", "Ghaziabad", "Gurugram", "Faridabad"],
    testOptions: [
      "Full Body Checkup",
      "Senior Citizen Package",
      "Womens Health Package",
      "Diabetes Care Package",
      "Thyroid Profile",
      "CBC Test"
    ],
    center: {
      name: "Upchar Diagnostics Center",
      address: "163, Health Street, Sector 44, Noida, Uttar Pradesh - 201301",
      hours: "Open today: 7:00 AM - 9:00 PM"
    }
  }
};

export const mergeHomeData = (apiData = {}) => ({
  ...fallbackHomeData,
  ...apiData,
  siteSettings: {
    ...fallbackHomeData.siteSettings,
    ...(apiData.siteSettings || {})
  },
  hero: {
    ...fallbackHomeData.hero,
    ...(apiData.hero || {})
  },
  booking: {
    ...fallbackHomeData.booking,
    ...(apiData.booking || {}),
    center: {
      ...fallbackHomeData.booking.center,
      ...(apiData.booking?.center || {})
    }
  }
});
