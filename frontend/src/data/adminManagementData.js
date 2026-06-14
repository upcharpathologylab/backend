const categoryOptions = [
  "Health Checkup",
  "Diabetes",
  "Thyroid",
  "Cardiac",
  "Liver",
  "Kidney",
  "Women Health",
  "Hematology",
  "Biochemistry",
  "Hormone",
  "Immunology",
  "Pathology",
  "Cardiology",
  "Radiology"
];

export const adminManagementConfigs = {
  packages: {
    apiResource: "packages",
    route: "/admin/packages",
    title: "Manage Packages",
    breadcrumb: "Manage Packages",
    addLabel: "Add New Package",
    exportLabel: "Export",
    tableTitle: "All Packages",
    totalCount: 28,
    selectable: true,
    emptyText: "No packages found. Try changing your filters.",
    searchFields: ["packageName", "packageCode"],
    priceField: "price",
    actions: ["edit", "view", "delete"],
    stats: [
      { title: "Total Packages", value: "28", text: "All time", icon: "gift", color: "green" },
      { title: "Active Packages", value: "22", text: "Enabled", icon: "box", color: "blue" },
      { title: "Inactive Packages", value: "6", text: "Disabled", icon: "pause", color: "orange" },
      { title: "Total Tests in Packages", value: "1,248", text: "All Packages", icon: "tag", color: "purple" },
      { title: "Total Revenue", value: "Rs. 45,78,320", text: "Up 15.3% vs last week", icon: "rupee", color: "cyan" }
    ],
    filters: [
      { key: "query", label: "Search Package", type: "search", placeholder: "Search by package name, code..." },
      { key: "category", label: "Category", type: "select", defaultValue: "All Categories", options: ["All Categories", ...categoryOptions.slice(0, 7)] },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive"] },
      { key: "priceRange", label: "Price Range (Rs.)", type: "priceRange" }
    ],
    columns: [
      { key: "packageName", label: "Package Name" },
      { key: "packageCode", label: "Package Code" },
      { key: "category", label: "Category", badge: "category" },
      { key: "testsIncluded", label: "Tests Included" },
      { key: "price", label: "Price (Rs.)", format: "money" },
      { key: "discountPercent", label: "Discount (%)", format: "percent", badge: "discount" },
      { key: "finalPrice", label: "Final Price (Rs.)", format: "money" },
      { key: "status", label: "Status", badge: "status" }
    ],
    formFields: [
      { key: "packageName", label: "Package Name", required: true },
      { key: "packageCode", label: "Package Code", required: true },
      { key: "packageImage", label: "Package Image", type: "image" },
      { key: "category", label: "Category", type: "select", options: categoryOptions.slice(0, 7), required: true },
      { key: "testsIncluded", label: "Tests Included", required: true },
      { key: "price", label: "Price", type: "number", required: true },
      { key: "discountPercent", label: "Discount %", type: "number", defaultValue: 0 },
      { key: "finalPrice", label: "Final Price", type: "calculated" },
      { key: "badge", label: "Badge Text optional" },
      { key: "buttonText", label: "Button Text", defaultValue: "Book Now" },
      { key: "buttonUrl", label: "Button URL", defaultValue: "/cart" },
      { key: "reportTime", label: "Report Time", defaultValue: "24 - 36 hrs" },
      { key: "homeCollection", label: "Home Collection", type: "select", options: ["Yes", "No"], defaultValue: "Yes" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true }
    ],
    calculation: { baseKey: "price", discountKey: "discountPercent", finalKey: "finalPrice" },
    rows: [
      { id: 1, packageName: "Full Body Checkup", packageCode: "FBC001", category: "Health Checkup", testsIncluded: "72 Tests", price: 2999, discountPercent: 20, finalPrice: 2399, status: "Active" },
      { id: 2, packageName: "Diabetes Profile", packageCode: "DP001", category: "Diabetes", testsIncluded: "15 Tests", price: 1299, discountPercent: 15, finalPrice: 1104, status: "Active" },
      { id: 3, packageName: "Thyroid Profile", packageCode: "TP001", category: "Thyroid", testsIncluded: "10 Tests", price: 899, discountPercent: 10, finalPrice: 809, status: "Active" },
      { id: 4, packageName: "Heart Health Package", packageCode: "HHP001", category: "Cardiac", testsIncluded: "18 Tests", price: 1999, discountPercent: 15, finalPrice: 1699, status: "Active" },
      { id: 5, packageName: "Liver Function Package", packageCode: "LFP001", category: "Liver", testsIncluded: "12 Tests", price: 999, discountPercent: 10, finalPrice: 899, status: "Active" },
      { id: 6, packageName: "Kidney Function Package", packageCode: "KFP001", category: "Kidney", testsIncluded: "10 Tests", price: 899, discountPercent: 10, finalPrice: 809, status: "Active" },
      { id: 7, packageName: "Advanced Cardiac Package", packageCode: "ACP001", category: "Cardiac", testsIncluded: "28 Tests", price: 2499, discountPercent: 20, finalPrice: 1999, status: "Active" },
      { id: 8, packageName: "Women Wellness Package", packageCode: "WWP001", category: "Women Health", testsIncluded: "22 Tests", price: 1799, discountPercent: 15, finalPrice: 1529, status: "Active" },
      { id: 9, packageName: "Senior Citizen Package", packageCode: "SCP001", category: "Health Checkup", testsIncluded: "60 Tests", price: 2199, discountPercent: 20, finalPrice: 1759, status: "Inactive" },
      { id: 10, packageName: "Child Health Package", packageCode: "CHP001", category: "Health Checkup", testsIncluded: "35 Tests", price: 1499, discountPercent: 10, finalPrice: 1349, status: "Inactive" }
    ]
  },
  testCategories: {
    apiResource: "test-categories",
    route: "/admin/test-categories",
    title: "Manage Test Categories",
    breadcrumb: "Manage Test Categories",
    addLabel: "Add New Category",
    exportLabel: "Export",
    tableTitle: "All Test Categories",
    totalCount: 24,
    emptyText: "No test categories found. Try changing your filters.",
    searchFields: ["categoryName"],
    actions: ["edit", "delete"],
    stats: [
      { title: "Total Categories", value: "24", text: "All time", icon: "folder", color: "green" },
      { title: "Active Categories", value: "18", text: "Enabled", icon: "clipboard", color: "blue" },
      { title: "Inactive Categories", value: "6", text: "Disabled", icon: "pause", color: "orange" },
      { title: "Total Tests", value: "1,248", text: "Across all categories", icon: "file", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search Category", type: "search", placeholder: "Search by category name..." },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive"] },
      { key: "testCount", label: "Test Count", type: "select", defaultValue: "All", options: ["All", "100+ Tests", "Below 100 Tests"] }
    ],
    columns: [
      { key: "categoryName", label: "Category Name", badge: "categoryName" },
      { key: "description", label: "Description" },
      { key: "totalTests", label: "Total Tests" },
      { key: "status", label: "Status", badge: "status" }
    ],
    formFields: [
      { key: "categoryName", label: "Category Name", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "icon", label: "Icon optional" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true }
    ],
    rows: [
      { id: 1, categoryName: "Hematology", description: "Study of blood and blood-forming organs and disorders.", totalTests: 156, status: "Active" },
      { id: 2, categoryName: "Biochemistry", description: "Analysis of chemicals and elements in the blood.", totalTests: 312, status: "Active" },
      { id: 3, categoryName: "Microbiology", description: "Detection of bacteria, viruses and other microorganisms.", totalTests: 142, status: "Active" },
      { id: 4, categoryName: "Pathology", description: "Examination of tissues, cells and body fluids.", totalTests: 210, status: "Active" },
      { id: 5, categoryName: "Immunology", description: "Tests related to immune system function and disorders.", totalTests: 104, status: "Active" },
      { id: 6, categoryName: "Hormone", description: "Tests related to hormone levels and endocrine function.", totalTests: 98, status: "Active" },
      { id: 7, categoryName: "Cardiology", description: "Heart-related tests and diagnostic procedures.", totalTests: 76, status: "Inactive" },
      { id: 8, categoryName: "Radiology", description: "Imaging tests like X-ray, CT, MRI, Ultrasound.", totalTests: 87, status: "Active" }
    ]
  },
  packageTests: {
    route: "/admin/package-tests",
    title: "Package Tests Management",
    breadcrumb: "Package Tests Management",
    addLabel: "Add Package Test",
    exportLabel: "Export",
    tableTitle: "All Package Tests",
    totalCount: 1248,
    totalLabel: "1,248",
    emptyText: "No package tests found. Try changing your filters.",
    searchFields: ["packageName", "testName"],
    actions: ["edit", "delete"],
    stats: [
      { title: "Total Package Tests", value: "1,248", text: "All time", icon: "grid", color: "green" },
      { title: "Active Package Tests", value: "1,065", text: "Enabled", icon: "clipboard", color: "blue" },
      { title: "Inactive Package Tests", value: "183", text: "Disabled", icon: "pause", color: "orange" },
      { title: "Total Added Value", value: "Rs. 45,78,320", text: "Up 15.3% vs last week", icon: "rupee", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search Package Test", type: "search", placeholder: "Search by package or test name..." },
      { key: "packageName", label: "Package", type: "select", defaultValue: "All Packages", options: ["All Packages", "Full Body Checkup", "Diabetes Profile", "Thyroid Profile", "Heart Health Package", "Kidney Function Package"] },
      { key: "testName", label: "Test", type: "select", defaultValue: "All Tests", options: ["All Tests", "Complete Blood Count (CBC)", "Liver Function Test (LFT)", "Fasting Blood Sugar (FBS)", "HbA1c", "Lipid Profile"] },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive"] }
    ],
    columns: [
      { key: "packageName", label: "Package Name" },
      { key: "testName", label: "Test Name" },
      { key: "testCode", label: "Test Code" },
      { key: "category", label: "Category", badge: "category" },
      { key: "price", label: "Price (Rs.)" },
      { key: "discountPercent", label: "Discount (%)", format: "percent", badge: "discount" },
      { key: "finalPrice", label: "Final Price (Rs.)" },
      { key: "status", label: "Status", badge: "status" }
    ],
    formFields: [
      { key: "packageName", label: "Package", type: "select", options: ["Full Body Checkup", "Diabetes Profile", "Thyroid Profile", "Heart Health Package", "Kidney Function Package"], required: true },
      { key: "testName", label: "Test", required: true },
      { key: "testCode", label: "Test Code", required: true },
      { key: "category", label: "Category", type: "select", options: categoryOptions.slice(7), required: true },
      { key: "price", label: "Price", type: "number", required: true },
      { key: "discountPercent", label: "Discount %", type: "number", defaultValue: 0 },
      { key: "finalPrice", label: "Final Price", type: "calculated" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true }
    ],
    calculation: { baseKey: "price", discountKey: "discountPercent", finalKey: "finalPrice" },
    rows: [
      { id: 1, packageName: "Full Body Checkup", testName: "Complete Blood Count (CBC)", testCode: "CBC001", category: "Hematology", price: 400, discountPercent: 10, finalPrice: 360, status: "Active" },
      { id: 2, packageName: "Full Body Checkup", testName: "Liver Function Test (LFT)", testCode: "LFT001", category: "Biochemistry", price: 650, discountPercent: 15, finalPrice: 553, status: "Active" },
      { id: 3, packageName: "Diabetes Profile", testName: "Fasting Blood Sugar (FBS)", testCode: "FBS001", category: "Biochemistry", price: 120, discountPercent: 10, finalPrice: 108, status: "Active" },
      { id: 4, packageName: "Diabetes Profile", testName: "HbA1c", testCode: "HBA1C001", category: "Biochemistry", price: 350, discountPercent: 10, finalPrice: 315, status: "Active" },
      { id: 5, packageName: "Thyroid Profile", testName: "Thyroid Stimulating Hormone (TSH)", testCode: "TSH001", category: "Hormone", price: 450, discountPercent: 15, finalPrice: 383, status: "Active" },
      { id: 6, packageName: "Thyroid Profile", testName: "Total T3", testCode: "T3001", category: "Hormone", price: 300, discountPercent: 10, finalPrice: 270, status: "Active" },
      { id: 7, packageName: "Thyroid Profile", testName: "Total T4", testCode: "T4001", category: "Hormone", price: 300, discountPercent: 10, finalPrice: 270, status: "Active" },
      { id: 8, packageName: "Heart Health Package", testName: "Lipid Profile", testCode: "LIP001", category: "Biochemistry", price: 700, discountPercent: 20, finalPrice: 560, status: "Active" },
      { id: 9, packageName: "Heart Health Package", testName: "ECG", testCode: "ECG001", category: "Cardiology", price: 500, discountPercent: 10, finalPrice: 450, status: "Inactive" },
      { id: 10, packageName: "Kidney Function Package", testName: "Serum Creatinine", testCode: "CRE001", category: "Biochemistry", price: 150, discountPercent: 10, finalPrice: 135, status: "Active" }
    ]
  },
  pricingDiscounts: {
    route: "/admin/pricing-discounts",
    title: "Pricing & Discounts Management",
    breadcrumb: "Pricing & Discounts Management",
    addLabel: "Add New Pricing",
    tableTitle: "Test Pricing",
    totalCount: 156,
    emptyText: "No pricing items found. Try changing your filters.",
    searchFields: ["itemName"],
    actions: ["edit", "delete"],
    tabs: [
      { label: "Test Pricing (156)", value: "Test" },
      { label: "Package Pricing (100)", value: "Package" }
    ],
    stats: [
      { title: "Total Pricing Items", value: "256", text: "All time", icon: "tag", color: "green" },
      { title: "Items with Discount", value: "142", text: "Active discounts", icon: "chart", color: "blue" },
      { title: "Average Discount", value: "18.6%", text: "Across all items", icon: "percent", color: "orange" },
      { title: "Total Discount Given", value: "Rs. 12,45,780", text: "All time", icon: "rupee", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search", type: "search", placeholder: "Search by test/package name..." },
      { key: "type", label: "Type", type: "select", defaultValue: "All Types", options: ["All Types", "Test", "Package"] },
      { key: "category", label: "Category", type: "select", defaultValue: "All Categories", options: ["All Categories", ...categoryOptions.slice(7)] },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive"] }
    ],
    columns: [
      { key: "itemName", label: "Item Name" },
      { key: "type", label: "Type" },
      { key: "category", label: "Category", badge: "category" },
      { key: "mrp", label: "MRP (Rs.)" },
      { key: "discountPercent", label: "Discount (%)", format: "percent", badge: "discount" },
      { key: "discountAmount", label: "Discount (Rs.)" },
      { key: "finalPrice", label: "Final Price (Rs.)" },
      { key: "status", label: "Status", badge: "status" }
    ],
    formFields: [
      { key: "type", label: "Item Type", type: "select", options: ["Test", "Package"], required: true },
      { key: "itemName", label: "Item Name", required: true },
      { key: "category", label: "Category", type: "select", options: categoryOptions.slice(7), required: true },
      { key: "mrp", label: "MRP", type: "number", required: true },
      { key: "discountPercent", label: "Discount %", type: "number", defaultValue: 0 },
      { key: "discountAmount", label: "Discount Amount", type: "calculated" },
      { key: "finalPrice", label: "Final Price", type: "calculated" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true }
    ],
    calculation: { baseKey: "mrp", discountKey: "discountPercent", amountKey: "discountAmount", finalKey: "finalPrice" },
    rows: [
      { id: 1, itemName: "Complete Blood Count (CBC)", type: "Test", category: "Hematology", mrp: 400, discountPercent: 10, discountAmount: 40, finalPrice: 360, status: "Active" },
      { id: 2, itemName: "Liver Function Test (LFT)", type: "Test", category: "Biochemistry", mrp: 650, discountPercent: 15, discountAmount: 98, finalPrice: 552, status: "Active" },
      { id: 3, itemName: "Thyroid Profile (T3, T4, TSH)", type: "Test", category: "Hormone", mrp: 750, discountPercent: 20, discountAmount: 150, finalPrice: 600, status: "Active" },
      { id: 4, itemName: "Blood Sugar Fasting (FBS)", type: "Test", category: "Biochemistry", mrp: 120, discountPercent: 10, discountAmount: 12, finalPrice: 108, status: "Active" },
      { id: 5, itemName: "Lipid Profile", type: "Test", category: "Biochemistry", mrp: 700, discountPercent: 10, discountAmount: 70, finalPrice: 630, status: "Active" },
      { id: 6, itemName: "Vitamin D (25-OH Vitamin D)", type: "Test", category: "Immunology", mrp: 1200, discountPercent: 20, discountAmount: 240, finalPrice: 960, status: "Active" },
      { id: 7, itemName: "Vitamin B12", type: "Test", category: "Immunology", mrp: 950, discountPercent: 10, discountAmount: 95, finalPrice: 855, status: "Active" },
      { id: 8, itemName: "ECG", type: "Test", category: "Cardiology", mrp: 500, discountPercent: 10, discountAmount: 50, finalPrice: 450, status: "Active" },
      { id: 9, itemName: "X-Ray Chest", type: "Test", category: "Radiology", mrp: 600, discountPercent: 15, discountAmount: 90, finalPrice: 510, status: "Active" },
      { id: 10, itemName: "Ultrasound Whole Abdomen", type: "Test", category: "Radiology", mrp: 1200, discountPercent: 15, discountAmount: 180, finalPrice: 1020, status: "Active" }
    ]
  },
  couponsOffers: {
    apiResource: "coupons",
    route: "/admin/coupons-offers",
    title: "Coupons / Offers Management",
    breadcrumb: "Coupons / Offers Management",
    addLabel: "Create New Coupon",
    tableTitle: "All Coupons",
    totalCount: 56,
    emptyText: "No coupons found. Try changing your filters.",
    searchFields: ["couponCode", "couponName"],
    actions: ["edit", "copy", "delete"],
    infoCard: {
      title: "How Coupons / Offers Work?",
      text: "Create coupons and offers to provide discounts on tests or packages. Set validity, usage limits and discount type to attract more customers."
    },
    stats: [
      { title: "Total Coupons", value: "56", text: "All time", icon: "ticket", color: "green" },
      { title: "Active Coupons", value: "34", text: "Currently active", icon: "tag", color: "blue" },
      { title: "Inactive / Expired", value: "22", text: "Currently inactive", icon: "pause", color: "orange" },
      { title: "Total Discounts Given", value: "Rs. 12,45,780", text: "All time", icon: "percent", color: "purple" },
      { title: "Redemptions", value: "2,486", text: "All time", icon: "gift", color: "green" }
    ],
    filters: [
      { key: "query", label: "Search Coupon", type: "search", placeholder: "Search by coupon code or name..." },
      { key: "type", label: "Coupon Type", type: "select", defaultValue: "All Types", options: ["All Types", "Percentage", "Flat"] },
      { key: "discountType", label: "Discount Type", type: "select", defaultValue: "All Discount Types", options: ["All Discount Types", "Percentage", "Flat"] },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive", "Scheduled", "Expired"] }
    ],
    columns: [
      { key: "couponCode", label: "Coupon Code" },
      { key: "couponName", label: "Coupon Name" },
      { key: "description", label: "Description", truncate: true },
      { key: "type", label: "Type", badge: "type" },
      { key: "discount", label: "Discount", badge: "discountText" },
      { key: "minOrder", label: "Min. Order (Rs.)" },
      { key: "applicableOn", label: "Applicable On" },
      { key: "isBestOffer", label: "Best Offer" },
      { key: "validFrom", label: "Valid From" },
      { key: "validTo", label: "Valid To" },
      { key: "usageLimit", label: "Usage Limit" },
      { key: "used", label: "Used" },
      { key: "status", label: "Status", badge: "status" }
    ],
    formFields: [
      { key: "couponCode", label: "Coupon Code", required: true },
      { key: "couponName", label: "Coupon Name", required: true },
      { key: "title", label: "Offer Title" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "type", label: "Coupon Type", type: "select", options: ["Percentage", "Flat"], required: true },
      { key: "discountType", label: "Discount Type", type: "select", options: ["Percentage", "Flat"], required: true },
      { key: "discountValue", label: "Discount Value", type: "number", required: true },
      { key: "minOrder", label: "Minimum Order Amount", type: "number", required: true },
      { key: "maxDiscount", label: "Maximum Discount", type: "number", defaultValue: 0 },
      { key: "validFrom", label: "Valid From", required: true },
      { key: "validTo", label: "Valid To", required: true },
      { key: "applicableOn", label: "Applicable Tests / Packages" },
      { key: "applicableItems", label: "Applicable Item Names", type: "textarea" },
      { key: "isBestOffer", label: "Best Offer", type: "select", options: ["No", "Yes"], defaultValue: "No" },
      { key: "usageLimit", label: "Usage Limit", required: true },
      { key: "sortOrder", label: "Sort Order", type: "number", defaultValue: 0 },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Scheduled", "Expired"], required: true }
    ],
    rows: [
      { id: 1, couponCode: "WELCOME10", couponName: "Welcome Offer", type: "Percentage", discountType: "Percentage", discountValue: 10, discount: "10% OFF", minOrder: 500, validFrom: "May 01, 2025", validTo: "May 31, 2025", usageLimit: "500", used: 120, status: "Active" },
      { id: 2, couponCode: "HEALTH20", couponName: "Health is Wealth", type: "Percentage", discountType: "Percentage", discountValue: 20, discount: "20% OFF", minOrder: 1000, validFrom: "May 05, 2025", validTo: "Jun 05, 2025", usageLimit: "300", used: 80, status: "Active" },
      { id: 3, couponCode: "FLAT100", couponName: "Flat 100 Discount", type: "Flat", discountType: "Flat", discountValue: 100, discount: "Rs. 100 OFF", minOrder: 800, validFrom: "May 10, 2025", validTo: "May 30, 2025", usageLimit: "200", used: 45, status: "Active" },
      { id: 4, couponCode: "LAB25", couponName: "Lab Test Offer", type: "Percentage", discountType: "Percentage", discountValue: 25, discount: "25% OFF", minOrder: 1200, validFrom: "May 12, 2025", validTo: "Jun 12, 2025", usageLimit: "250", used: 60, status: "Active" },
      { id: 5, couponCode: "NEWUSER", couponName: "New User Offer", type: "Flat", discountType: "Flat", discountValue: 150, discount: "Rs. 150 OFF", minOrder: 700, validFrom: "May 01, 2025", validTo: "May 31, 2025", usageLimit: "Unlimited", used: 250, status: "Active" },
      { id: 6, couponCode: "FREEDOM50", couponName: "Independence Special", type: "Flat", discountType: "Flat", discountValue: 50, discount: "Rs. 50 OFF", minOrder: 500, validFrom: "Aug 01, 2025", validTo: "Aug 15, 2025", usageLimit: "1000", used: 0, status: "Scheduled" },
      { id: 7, couponCode: "SAVE15", couponName: "Save More", type: "Percentage", discountType: "Percentage", discountValue: 15, discount: "15% OFF", minOrder: 1500, validFrom: "Apr 01, 2025", validTo: "Apr 30, 2025", usageLimit: "400", used: 400, status: "Expired" },
      { id: 8, couponCode: "FESTIVE30", couponName: "Festive Bonanza", type: "Percentage", discountType: "Percentage", discountValue: 30, discount: "30% OFF", minOrder: 2000, validFrom: "Oct 01, 2024", validTo: "Oct 31, 2024", usageLimit: "300", used: 300, status: "Expired" },
      { id: 9, couponCode: "DIWALI100", couponName: "Diwali Dhamaka", type: "Flat", discountType: "Flat", discountValue: 100, discount: "Rs. 100 OFF", minOrder: 1000, validFrom: "Oct 20, 2024", validTo: "Nov 05, 2024", usageLimit: "500", used: 500, status: "Expired" },
      { id: 10, couponCode: "REPUBLIC15", couponName: "Republic Day Offer", type: "Percentage", discountType: "Percentage", discountValue: 15, discount: "15% OFF", minOrder: 1000, validFrom: "Jan 20, 2025", validTo: "Jan 26, 2025", usageLimit: "200", used: 200, status: "Expired" }
    ]
  }
};
