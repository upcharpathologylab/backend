import { fallbackHomeData } from "./homeData.js";

const toEditablePackageCard = (item, index) => ({
  id: item.id || item.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `package-card-${index + 1}`,
  image: item.image || "",
  title: item.name || "",
  description: item.description || "",
  testCount: item.testCount || "",
  oldPrice: String(item.originalPrice || ""),
  newPrice: String(item.discountedPrice || ""),
  badge: item.badge || (item.isPopular ? "Most Booked" : ""),
  buttonText: item.buttonText || "Book Now",
  buttonLink: item.buttonLink || "#booking",
  status: item.isActive === false ? "Inactive" : "Active"
});

const packageCardRepeater = {
  field: "cards",
  label: "Package Cards",
  type: "package"
};

const defaultHomePackageCards = fallbackHomeData.packages.map(toEditablePackageCard);

const toEditableBlogCard = (item, index) => ({
  id: item.id || item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `blog-card-${index + 1}`,
  image: item.image || "",
  title: item.title || "",
  description: item.shortDescription || item.description || "",
  content: item.content || item.shortDescription || item.description || "",
  category: item.category || "Health Tips",
  date: item.date || "",
  status: item.isActive === false ? "Inactive" : "Active"
});

const blogCardRepeater = {
  field: "cards",
  label: "Blog Cards",
  type: "blog"
};

const defaultBlogCards = fallbackHomeData.blogs.map(toEditableBlogCard);

export const adminContentPages = [
  { slug: "home", title: "Home Page", url: "/", status: "Published", updatedAt: "Not updated", editUrl: "/admin/content-pages/home", previewUrl: "/" },
  { slug: "about-us", title: "About Us", url: "/about-us", status: "Published", updatedAt: "Not updated", editUrl: "/admin/content-pages/about-us", previewUrl: "/about-us" },
  { slug: "packages", title: "Packages", url: "/packages", status: "Published", updatedAt: "Not updated", editUrl: "/admin/content-pages/packages", previewUrl: "/packages" },
  { slug: "tests", title: "Tests", url: "/tests", status: "Published", updatedAt: "Not updated", editUrl: "/admin/content-pages/tests", previewUrl: "/tests" },
  { slug: "blog", title: "Blog", url: "/blog", status: "Published", updatedAt: "Not updated", editUrl: "/admin/content-pages/blog", previewUrl: "/" },
  { slug: "contact-us", title: "Contact Us", url: "/contact-us", status: "Published", updatedAt: "Not updated", editUrl: "/admin/content-pages/contact-us", previewUrl: "/contact-us" },
  { slug: "faqs", title: "FAQs", url: "/faqs", status: "Published", updatedAt: "Not updated", editUrl: "/admin/content-pages/faqs", previewUrl: "/" },
  { slug: "privacy-policy", title: "Privacy Policy", url: "/privacy-policy", status: "Published", updatedAt: "Not updated", editUrl: "/admin/content-pages/privacy-policy", previewUrl: "/" },
  { slug: "terms-conditions", title: "Terms & Conditions", url: "/terms-conditions", status: "Published", updatedAt: "Not updated", editUrl: "/admin/content-pages/terms-conditions", previewUrl: "/" },
  { slug: "refund-policy", title: "Refund Policy", url: "/refund-policy", status: "Published", updatedAt: "Not updated", editUrl: "/admin/content-pages/refund-policy", previewUrl: "/" }
];

const commonPageSections = [
  {
    sectionKey: "main",
    label: "Main Content",
    fields: ["title", "subtitle", "description", "imageUrl"],
    defaults: { title: "", subtitle: "", description: "", imageUrl: "" }
  }
];

export const policyPageDefaults = {
  "terms-conditions": {
    title: "Terms & Conditions",
    description:
      "Welcome to Upchar Pathology. By using our website, booking diagnostic services, uploading prescriptions, or communicating with our support team, you agree to these terms and conditions.\n\nUpchar Pathology is a technology-driven service provider that helps users connect with diagnostic laboratories, collection partners, and healthcare service providers. We are not a substitute for medical advice, diagnosis, or treatment from a qualified medical professional.\n\nService bookings are subject to availability, serviceable location, partner lab confirmation, sample collection slots, and successful payment where applicable. Users are responsible for providing accurate personal details, contact information, prescription details, address, and test or package selection.\n\nReports, timelines, prices, offers, and collection availability may vary based on the selected service, partner lab, location, and operational conditions. While we work with trusted partners, delays may occur because of sample quality, weather, logistics, technical issues, or other circumstances beyond our reasonable control.\n\nUsers must not misuse the website, submit false information, attempt unauthorized access, or interfere with platform operations. We may restrict, cancel, or refuse service if misuse, fraud, abusive behavior, or incorrect information is detected.\n\nAll content on this website, including text, branding, graphics, and layout, belongs to Upchar Pathology or its licensors and may not be copied or reused without permission.\n\nFor questions about these terms, please contact our support team using the details provided on the Contact Us page."
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "Upchar Pathology respects your privacy and is committed to protecting the personal and health-related information you share with us.\n\nWe may collect information such as your name, mobile number, email address, age, gender, address, uploaded prescriptions, selected tests or packages, booking details, payment status, and support communication. This information is collected when you use our website, create an account, book a service, upload a prescription, contact us, or interact with our support team.\n\nWe use your information to process bookings, arrange sample collection, coordinate with diagnostic partners, deliver reports, provide customer support, improve our services, send booking updates, and comply with legal or regulatory obligations.\n\nYour information may be shared with trusted diagnostic labs, sample collection partners, payment providers, technology vendors, and support teams only as needed to provide the requested service. We do not sell your personal information.\n\nWe use reasonable technical and organizational safeguards to protect your information. However, no online transmission or storage system is completely secure, and users should also protect their account credentials and devices.\n\nYou may contact us to request corrections to your personal information or to ask questions about how your data is handled. Certain records may be retained where required for service, legal, accounting, or regulatory purposes.\n\nBy using our website and services, you consent to the collection and use of information as described in this Privacy Policy."
  },
  "refund-policy": {
    title: "Refund Policy",
    description:
      "This Refund Policy explains how refunds are handled for bookings made through Upchar Pathology.\n\nA refund may be considered if a booking is cancelled before sample collection, if payment was deducted but the booking was not confirmed, if a duplicate payment was made, or if the requested service could not be fulfilled by our partner network.\n\nRefunds are generally not applicable after sample collection has been completed, after a test has been processed by the lab, or where incorrect information was provided by the customer and the service could not be completed for that reason.\n\nApproved refunds will be processed to the original payment method where possible. The time taken for the amount to reflect depends on the bank, card issuer, wallet, UPI provider, or payment gateway and may vary.\n\nIf you believe you are eligible for a refund, please contact our support team with your booking details, payment reference, registered mobile number, and reason for the request. Our team will review the request and share an update after checking booking and payment records.\n\nFor failed payments where money is deducted, the amount is usually reversed automatically by the payment provider. If it is not reversed within the expected banking timeline, please contact support with the transaction details.\n\nUpchar Pathology reserves the right to approve or decline refund requests based on booking status, service progress, partner lab confirmation, and applicable operational policies."
  }
};

const policyPageSections = (slug) => [
  {
    sectionKey: "main",
    label: "Policy Content",
    fields: ["title", "description", "status"],
    defaults: { ...policyPageDefaults[slug], status: "Published" }
  }
];

export const pageSectionDefinitions = {
  home: [
    {
      sectionKey: "hero",
      label: "Hero Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      defaults: {
        title: "Book Lab Tests Online from",
        subtitle: "Trusted Partner Labs",
        description: "We are a service provider connecting you with NABL accredited labs & trusted collection partners.",
        imageUrl: ""
      }
    },
    {
      sectionKey: "why-choose",
      label: "Why Choose Us Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      defaults: {
        title: "Why Choose",
        subtitle: "Upchar?",
        description: "Trusted by thousands of patients across India for accurate diagnostics, affordable pricing, and fast report delivery.",
        imageUrl: ""
      }
    },
    {
      sectionKey: "packages",
      label: "Packages Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      repeater: packageCardRepeater,
      defaults: {
        title: "Special Care for",
        subtitle: "You & Your Family",
        description: "Choose from our most popular health packages",
        imageUrl: "",
        cards: defaultHomePackageCards
      }
    },
    {
      sectionKey: "trusted-tests",
      label: "Trusted Lab Tests at Affordable Prices",
      fields: ["title", "subtitle", "description"],
      defaults: {
        title: "Trusted lab tests at affordable prices",
        subtitle: "",
        description: ""
      }
    },
    {
      sectionKey: "testimonials",
      label: "Testimonials Section",
      fields: ["title", "subtitle", "description"],
      settingsFields: [
        { key: "totalReviewsText", label: "Total Reviews Text" },
        { key: "happyCustomersText", label: "Happy Customers Text / Count" },
        { key: "recommendPercentage", label: "Recommend Percentage" }
      ],
      defaults: {
        title: "Google",
        subtitle: "Reviews",
        description: "Real experiences from our happy customers",
        settings: {
          totalReviewsText: "10K+ Reviews",
          happyCustomersText: "10K+",
          recommendPercentage: "98%"
        }
      }
    },
    {
      sectionKey: "blog",
      label: "Blog Section",
      fields: ["title", "subtitle", "description"],
      defaults: {
        title: "From Our",
        subtitle: "Blog",
        description: "Health tips, insights and guides to help you live a healthier life."
      }
    },
    {
      sectionKey: "cta",
      label: "CTA Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      defaults: {
        title: "Book Your Test Now",
        subtitle: "Quick | Easy | Reliable",
        description: "Get fast and accurate reports delivered on time.",
        imageUrl: ""
      }
    }
  ],
  "about-us": [
    {
      sectionKey: "hero",
      label: "Hero Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      defaults: {
        title: "We are a service provider connecting you with NABL accredited labs & trusted collection partners.",
        subtitle: "We are a Service Provider Not a Lab",
        description: "Upchar Pathology is a technology-driven platform that connects you with NABL accredited laboratories and verified sample collection partners for a seamless testing experience.",
        imageUrl: ""
      }
    },
    {
      sectionKey: "mission",
      label: "Mission Section",
      fields: ["title", "subtitle", "description"],
      defaults: {
        title: "Our Mission",
        subtitle: "",
        description: "To provide accurate, reliable and timely diagnostic services using advanced technology and a customer-first approach."
      }
    },
    {
      sectionKey: "promise",
      label: "Promise Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      defaults: {
        title: "Our Promise",
        subtitle: "",
        description: "As a service provider, our promise is to bridge the gap between you and the best diagnostic services.",
        imageUrl: ""
      }
    }
  ],
  packages: [
    {
      sectionKey: "hero",
      label: "Hero Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      defaults: {
        title: "Health Packages",
        subtitle: "",
        description: "Choose from our wide range of health packages and take a step towards better health.",
        imageUrl: ""
      }
    },
    {
      sectionKey: "offer",
      label: "Offer Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      defaults: {
        title: "On Selected Health Packages",
        subtitle: "Up to 60% OFF",
        description: "Limited time offer. Book now and save more on your health.",
        imageUrl: ""
      }
    },
    {
      sectionKey: "package-cards",
      label: "Package Cards Section",
      fields: ["title", "subtitle", "description"],
      repeater: packageCardRepeater,
      defaults: {
        title: "All Packages",
        subtitle: "",
        description: "Manage package card content and order.",
        cards: []
      }
    }
  ],
  tests: [
    {
      sectionKey: "hero",
      label: "Hero Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      defaults: {
        title: "Find & Book Lab Tests",
        subtitle: "",
        description: "Search from 1000+ tests with best prices and fast report delivery.",
        imageUrl: ""
      }
    },
    {
      sectionKey: "offer",
      label: "Offer Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      defaults: {
        title: "On Selected Health Packages",
        subtitle: "Up to 60% OFF",
        description: "Limited time offer. Book now and save more.",
        imageUrl: ""
      }
    }
  ],
  blog: [
    {
      sectionKey: "hero",
      label: "Blog Header",
      fields: ["title", "subtitle", "description", "imageUrl"],
      repeater: blogCardRepeater,
      defaults: {
        title: "From Our",
        subtitle: "Blog",
        description: "Health tips, insights and guides to help you live a healthier life.",
        imageUrl: "",
        cards: defaultBlogCards
      }
    }
  ],
  "contact-us": [
    {
      sectionKey: "hero",
      label: "Hero Section",
      fields: ["title", "subtitle", "description", "imageUrl"],
      defaults: {
        title: "Contact Us",
        subtitle: "",
        description: "We are here to help you. Reach out to us for any queries or assistance.",
        imageUrl: ""
      }
    },
    {
      sectionKey: "contact-form",
      label: "Contact Form",
      fields: ["title", "subtitle"],
      settingsFields: [{ key: "buttonText", label: "Send Button Text" }],
      defaults: {
        title: "Send Us a Message",
        subtitle: "Fill in the form below and our team will get back to you as soon as possible.",
        settings: { buttonText: "Send Message" }
      }
    },
    {
      sectionKey: "contact-info",
      label: "Contact Information",
      fields: ["title"],
      settingsFields: [
        { key: "phoneNumber", label: "Phone Number" },
        { key: "phoneTiming", label: "Phone Timing" },
        { key: "whatsappNumber", label: "WhatsApp Number" },
        { key: "whatsappText", label: "WhatsApp Text" },
        { key: "emailAddress", label: "Email Address" },
        { key: "emailResponseText", label: "Email Response Text" },
        { key: "companyName", label: "Company / Location Name" },
        { key: "address", label: "Address", type: "textarea" }
      ],
      defaults: {
        title: "Contact Information",
        settings: {
          phoneNumber: "7838532205",
          phoneTiming: "Mon - Sun: 7:00 AM - 9:00 PM",
          whatsappNumber: "7838532205",
          whatsappText: "Send us a message on WhatsApp",
          emailAddress: "support@upcharlab.com",
          emailResponseText: "We reply within 24 hours",
          companyName: "Upchar Pathology Pvt. Ltd.",
          address: "4th Floor, Tech Park, Sector 62, Noida, Uttar Pradesh - 201301"
        }
      }
    },
    {
      sectionKey: "immediate-help",
      label: "Immediate Help",
      fields: ["title", "description"],
      settingsFields: [{ key: "buttonText", label: "WhatsApp Button Text" }],
      defaults: {
        title: "Need Immediate Help?",
        description: "Chat with our support team on WhatsApp for quick assistance.",
        settings: { buttonText: "Chat on WhatsApp" }
      }
    },
    {
      sectionKey: "location",
      label: "We Are Here",
      fields: ["title", "description"],
      settingsFields: [{ key: "featurePoints", label: "We Are Here Feature Points", type: "textarea" }],
      defaults: {
        title: "We Are Here",
        description: "Our head office is located in the heart of Noida. Visit us for any assistance.",
        settings: {
          featurePoints: "Easy parking available\nWheelchair accessible\nNear Noida Electronic City Metro Station\nSurrounded by cafes and restaurants"
        }
      }
    }
  ],
  faqs: commonPageSections,
  "privacy-policy": policyPageSections("privacy-policy"),
  "terms-conditions": policyPageSections("terms-conditions"),
  "refund-policy": policyPageSections("refund-policy")
};

export const homePageSections = pageSectionDefinitions.home.map((section) => section.label);

export const getPageDefinition = (slug) => adminContentPages.find((page) => page.slug === slug) || adminContentPages[0];

export const getSectionDefinitions = (slug) => pageSectionDefinitions[slug] || commonPageSections;
