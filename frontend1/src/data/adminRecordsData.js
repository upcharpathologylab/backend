const customerRows = [
  { id: 1, customerId: "CUS125487", customerName: "Ramesh Kumar", phoneNumber: "9876543210", email: "ramesh.kumar@email.com", cityLocation: "South Delhi", customerType: "Regular", totalBookings: 18, totalSpent: 24_580, status: "Active", lastBooking: "May 22, 2025" },
  { id: 2, customerId: "CUS125486", customerName: "Priya Sharma", phoneNumber: "9876501234", email: "priya.sharma@email.com", cityLocation: "West Delhi", customerType: "Premium", totalBookings: 15, totalSpent: 18_760, status: "Active", lastBooking: "May 22, 2025" },
  { id: 3, customerId: "CUS125485", customerName: "Amit Verma", phoneNumber: "9876512345", email: "amit.verma@email.com", cityLocation: "East Delhi", customerType: "Regular", totalBookings: 9, totalSpent: 9_450, status: "Inactive", lastBooking: "May 21, 2025" },
  { id: 4, customerId: "CUS125484", customerName: "Neha Gupta", phoneNumber: "9876523456", email: "neha.gupta@email.com", cityLocation: "Gurgaon", customerType: "Premium", totalBookings: 22, totalSpent: 31_200, status: "Active", lastBooking: "May 21, 2025" },
  { id: 5, customerId: "CUS125483", customerName: "Sanjay Singh", phoneNumber: "9876534567", email: "sanjay.singh@email.com", cityLocation: "Noida", customerType: "Family", totalBookings: 12, totalSpent: 14_600, status: "Active", lastBooking: "May 20, 2025" },
  { id: 6, customerId: "CUS125482", customerName: "Pooja Mehta", phoneNumber: "9876545678", email: "pooja.mehta@email.com", cityLocation: "Faridabad", customerType: "Regular", totalBookings: 7, totalSpent: 8_950, status: "Inactive", lastBooking: "May 20, 2025" },
  { id: 7, customerId: "CUS125481", customerName: "Vikram Patel", phoneNumber: "9876556789", email: "vikram.patel@email.com", cityLocation: "Ghaziabad", customerType: "Premium", totalBookings: 20, totalSpent: 27_890, status: "Active", lastBooking: "May 19, 2025" },
  { id: 8, customerId: "CUS125480", customerName: "Anjali Desai", phoneNumber: "9876567890", email: "anjali.desai@email.com", cityLocation: "Dwarka", customerType: "Regular", totalBookings: 5, totalSpent: 6_200, status: "Blocked", lastBooking: "May 19, 2025" },
  { id: 9, customerId: "CUS125479", customerName: "Karan Malhotra", phoneNumber: "9876578901", email: "karan.malhotra@email.com", cityLocation: "Rohini", customerType: "Family", totalBookings: 16, totalSpent: 21_450, status: "Active", lastBooking: "May 18, 2025" },
  { id: 10, customerId: "CUS125478", customerName: "Meera Nair", phoneNumber: "9876589012", email: "meera.nair@email.com", cityLocation: "Saket", customerType: "Premium", totalBookings: 8, totalSpent: 10_500, status: "Active", lastBooking: "May 18, 2025" }
];

const paymentRows = [
  { id: 1, paymentId: "PAY125487", bookingId: "BKD125487", patientName: "Ramesh Kumar", amount: 2450, paymentMethod: "UPI", status: "Success", paymentDateTime: "May 22, 2025 10:30 AM", transactionId: "UPI123456789012" },
  { id: 2, paymentId: "PAY125486", bookingId: "BKD125486", patientName: "Priya Sharma", amount: 1850, paymentMethod: "Credit Card", status: "Success", paymentDateTime: "May 22, 2025 09:15 AM", transactionId: "CC987654321001" },
  { id: 3, paymentId: "PAY125485", bookingId: "BKD125485", patientName: "Amit Verma", amount: 950, paymentMethod: "Net Banking", status: "Failed", paymentDateTime: "May 21, 2025 08:45 AM", transactionId: "NB123456789005" },
  { id: 4, paymentId: "PAY125484", bookingId: "BKD125484", patientName: "Neha Gupta", amount: 3120, paymentMethod: "Debit Card", status: "Success", paymentDateTime: "May 21, 2025 11:20 AM", transactionId: "DC456789123004" },
  { id: 5, paymentId: "PAY125483", bookingId: "BKD125483", patientName: "Sanjay Singh", amount: 1460, paymentMethod: "UPI", status: "Pending", paymentDateTime: "May 20, 2025 02:10 PM", transactionId: "UPI789456123006" },
  { id: 6, paymentId: "PAY125482", bookingId: "BKD125482", patientName: "Pooja Mehta", amount: 895, paymentMethod: "Wallet", status: "Success", paymentDateTime: "May 20, 2025 07:30 PM", transactionId: "WL123789456007" },
  { id: 7, paymentId: "PAY125481", bookingId: "BKD125481", patientName: "Vikram Patel", amount: 2789, paymentMethod: "Net Banking", status: "Success", paymentDateTime: "May 19, 2025 09:00 AM", transactionId: "NB654321987003" },
  { id: 8, paymentId: "PAY125480", bookingId: "BKD125480", patientName: "Anjali Desai", amount: 620, paymentMethod: "UPI", status: "Failed", paymentDateTime: "May 19, 2025 10:05 AM", transactionId: "UPI456123789008" },
  { id: 9, paymentId: "PAY125479", bookingId: "BKD125479", patientName: "Karan Malhotra", amount: 2145, paymentMethod: "Credit Card", status: "Refunded", paymentDateTime: "May 18, 2025 06:45 PM", transactionId: "CC321654987002" },
  { id: 10, paymentId: "PAY125478", bookingId: "BKD125478", patientName: "Meera Nair", amount: 1050, paymentMethod: "Debit Card", status: "Pending", paymentDateTime: "May 18, 2025 08:15 PM", transactionId: "DC789123456009" }
];

const invoiceRows = [
  { id: 1, invoiceId: "INV125487", customer: "Ramesh Kumar", invoiceType: "Test", invoiceDate: "May 22, 2025", dueDate: "May 29, 2025", amount: 2450, paidAmount: 2450, status: "Paid", paymentMethod: "UPI" },
  { id: 2, invoiceId: "INV125486", customer: "Priya Sharma", invoiceType: "Package", invoiceDate: "May 22, 2025", dueDate: "May 29, 2025", amount: 1850, paidAmount: 1850, status: "Paid", paymentMethod: "Credit Card" },
  { id: 3, invoiceId: "INV125485", customer: "Amit Verma", invoiceType: "Test", invoiceDate: "May 21, 2025", dueDate: "May 28, 2025", amount: 950, paidAmount: 0, status: "Pending", paymentMethod: "Net Banking" },
  { id: 4, invoiceId: "INV125484", customer: "Neha Gupta", invoiceType: "Package", invoiceDate: "May 21, 2025", dueDate: "May 28, 2025", amount: 3120, paidAmount: 1000, status: "Partial", paymentMethod: "Debit Card" },
  { id: 5, invoiceId: "INV125483", customer: "Sanjay Singh", invoiceType: "Test", invoiceDate: "May 20, 2025", dueDate: "May 27, 2025", amount: 1460, paidAmount: 0, status: "Pending", paymentMethod: "UPI" },
  { id: 6, invoiceId: "INV125482", customer: "Pooja Mehta", invoiceType: "Corporate", invoiceDate: "May 20, 2025", dueDate: "May 27, 2025", amount: 895, paidAmount: 895, status: "Paid", paymentMethod: "Wallet" },
  { id: 7, invoiceId: "INV125481", customer: "Vikram Patel", invoiceType: "Package", invoiceDate: "May 19, 2025", dueDate: "May 26, 2025", amount: 2789, paidAmount: 2789, status: "Paid", paymentMethod: "Net Banking" },
  { id: 8, invoiceId: "INV125480", customer: "Anjali Desai", invoiceType: "Test", invoiceDate: "May 19, 2025", dueDate: "May 26, 2025", amount: 620, paidAmount: 0, status: "Overdue", paymentMethod: "UPI" },
  { id: 9, invoiceId: "INV125479", customer: "Karan Malhotra", invoiceType: "Corporate", invoiceDate: "May 18, 2025", dueDate: "May 25, 2025", amount: 2145, paidAmount: 2145, status: "Paid", paymentMethod: "Credit Card" },
  { id: 10, invoiceId: "INV125478", customer: "Meera Nair", invoiceType: "Package", invoiceDate: "May 18, 2025", dueDate: "May 25, 2025", amount: 1050, paidAmount: 500, status: "Partial", paymentMethod: "Debit Card" }
];

const homepageBannerRows = [
  { id: 1, bannerTitle: "Health Checkup Offer", bannerDescription: "Full body health checkup offer for families.", position: "Top Slider", status: "Active", bannerImage: "Full body health checkup", linkUrl: "/book-test", addedOn: "May 22, 2025 10:30 AM", addedBy: "Admin User", buttonText: "Book Now", startDate: "May 16, 2025", endDate: "May 31, 2025", sortOrder: 1 },
  { id: 2, bannerTitle: "Discount on Pathology Tests", bannerDescription: "Flat discount on selected pathology tests.", position: "Top Slider", status: "Active", bannerImage: "Flat discount on tests", linkUrl: "/packages", addedOn: "May 21, 2025 03:45 PM", addedBy: "Admin User", buttonText: "View Packages", startDate: "May 16, 2025", endDate: "May 31, 2025", sortOrder: 2 },
  { id: 3, bannerTitle: "Free Home Sample Collection", bannerDescription: "Free home collection on selected orders.", position: "Below Slider", status: "Active", bannerImage: "Free home sample collection", linkUrl: "/sample-collection", addedOn: "May 21, 2025 11:20 AM", addedBy: "Admin User", buttonText: "Book Collection", startDate: "May 16, 2025", endDate: "May 31, 2025", sortOrder: 3 },
  { id: 4, bannerTitle: "Women's Health Package", bannerDescription: "Package created for women's health screening.", position: "Middle Banner", status: "Inactive", bannerImage: "Women's health package", linkUrl: "/packages/women-health", addedOn: "May 20, 2025 04:15 PM", addedBy: "Admin User", buttonText: "Explore", startDate: "May 16, 2025", endDate: "May 31, 2025", sortOrder: 4 },
  { id: 5, bannerTitle: "Diabetes Test Package", bannerDescription: "Affordable diabetes screening package.", position: "Middle Banner", status: "Active", bannerImage: "Diabetes test package", linkUrl: "/packages/diabetes", addedOn: "May 20, 2025 09:10 AM", addedBy: "Admin User", buttonText: "Book Now", startDate: "May 16, 2025", endDate: "May 31, 2025", sortOrder: 5 },
  { id: 6, bannerTitle: "Senior Citizen Discount", bannerDescription: "Special savings for senior citizens.", position: "Bottom Banner", status: "Active", bannerImage: "Senior citizen discount", linkUrl: "/offers/senior-citizen", addedOn: "May 19, 2025 02:30 PM", addedBy: "Editor User", buttonText: "Claim Offer", startDate: "May 16, 2025", endDate: "May 31, 2025", sortOrder: 6 },
  { id: 7, bannerTitle: "Refer & Earn", bannerDescription: "Referral rewards for customers.", position: "Bottom Banner", status: "Inactive", bannerImage: "Refer and earn", linkUrl: "/refer-earn", addedOn: "May 19, 2025 11:05 AM", addedBy: "Editor User", buttonText: "Refer Now", startDate: "May 16, 2025", endDate: "May 31, 2025", sortOrder: 7 },
  { id: 8, bannerTitle: "Lab Safety Measures", bannerDescription: "Trusted quality and safety practices.", position: "Below Slider", status: "Active", bannerImage: "Lab safety measures", linkUrl: "/safety-measures", addedOn: "May 18, 2025 06:40 PM", addedBy: "Admin User", buttonText: "Learn More", startDate: "May 16, 2025", endDate: "May 31, 2025", sortOrder: 8 },
  { id: 9, bannerTitle: "Thyroid Test Package", bannerDescription: "Thyroid profile package promotion.", position: "Middle Banner", status: "Inactive", bannerImage: "Thyroid test package", linkUrl: "/packages/thyroid", addedOn: "May 18, 2025 01:15 PM", addedBy: "Editor User", buttonText: "Book Now", startDate: "May 16, 2025", endDate: "May 31, 2025", sortOrder: 9 },
  { id: 10, bannerTitle: "Book Now & Save More", bannerDescription: "General booking offer for lab tests.", position: "Top Slider", status: "Active", bannerImage: "Book now save more", linkUrl: "/book-test", addedOn: "May 17, 2025 10:25 AM", addedBy: "Admin User", buttonText: "Save Now", startDate: "May 16, 2025", endDate: "May 31, 2025", sortOrder: 10 }
];

const testimonialRows = [
  { id: 1, customerName: "Ramesh Kumar", email: "ramesh.kumar@email.com", content: "Excellent service and very accurate reports. The staff is very cooperative and the process was smooth.", rating: 5, ratingLabel: "5 Stars", status: "Published", addedOn: "May 22, 2025 10:30 AM", displayedOn: "Homepage" },
  { id: 2, customerName: "Priya Sharma", email: "priya.sharma@email.com", content: "Quick sample collection and timely report delivery. Highly recommended!", rating: 5, ratingLabel: "5 Stars", status: "Published", addedOn: "May 21, 2025 03:45 PM", displayedOn: "Homepage" },
  { id: 3, customerName: "Amit Verma", email: "amit.verma@email.com", content: "Very professional and reliable lab. Will definitely use their services again.", rating: 4, ratingLabel: "4 Stars", status: "Published", addedOn: "May 21, 2025 11:20 AM", displayedOn: "Homepage" },
  { id: 4, customerName: "Neha Gupta", email: "neha.gupta@email.com", content: "Good experience overall. Reports were accurate and delivered on time.", rating: 4, ratingLabel: "4 Stars", status: "Pending", addedOn: "May 20, 2025 04:15 PM", displayedOn: "-" },
  { id: 5, customerName: "Sanjay Singh", email: "sanjay.singh@email.com", content: "Affordable pricing and great customer support. Thank you Upchar Pathology Lab!", rating: 5, ratingLabel: "5 Stars", status: "Published", addedOn: "May 20, 2025 09:10 AM", displayedOn: "Homepage" },
  { id: 6, customerName: "Pooja Mehta", email: "pooja.mehta@email.com", content: "The lab is clean, well-equipped and the staff is friendly. Happy with the service.", rating: 4, ratingLabel: "4 Stars", status: "Pending", addedOn: "May 19, 2025 02:30 PM", displayedOn: "-" },
  { id: 7, customerName: "Vikram Patel", email: "vikram.patel@email.com", content: "Reports are accurate and delivered very quickly. Great work by the team!", rating: 5, ratingLabel: "5 Stars", status: "Published", addedOn: "May 19, 2025 11:05 AM", displayedOn: "Homepage" },
  { id: 8, customerName: "Anjali Desai", email: "anjali.desai@email.com", content: "Excellent experience from sample collection to report delivery. Keep it up!", rating: 4, ratingLabel: "4 Stars", status: "Hidden", addedOn: "May 18, 2025 06:40 PM", displayedOn: "-" },
  { id: 9, customerName: "Karan Malhotra", email: "karan.malhotra@email.com", content: "Very satisfied with the service and support.", rating: 5, ratingLabel: "5 Stars", status: "Published", addedOn: "May 18, 2025 01:15 PM", displayedOn: "Homepage" },
  { id: 10, customerName: "Meera Nair", email: "meera.nair@email.com", content: "Good service but waiting time was a bit long.", rating: 2, ratingLabel: "2 Stars", status: "Pending", addedOn: "May 17, 2025 10:25 AM", displayedOn: "-" }
];

const activityLogRows = [
  { id: 1, dateTime: "May 22, 2025 10:30:45 AM", user: "Admin User", role: "Super Admin", module: "Bookings", action: "Created", description: "Created a new booking #BKG-1256 for John Doe", ipAddress: "192.168.1.10", status: "Success" },
  { id: 2, dateTime: "May 22, 2025 10:28:12 AM", user: "Admin User", role: "Super Admin", module: "Users", action: "Updated", description: "Updated user profile for Dr. Priya Sharma", ipAddress: "192.168.1.10", status: "Success" },
  { id: 3, dateTime: "May 22, 2025 10:15:33 AM", user: "Editor User", role: "Editor", module: "Packages", action: "Updated", description: "Updated package \"Full Body Checkup\" details", ipAddress: "192.168.1.15", status: "Success" },
  { id: 4, dateTime: "May 22, 2025 09:45:21 AM", user: "Admin User", role: "Super Admin", module: "Payments", action: "Created", description: "Added payment of Rs. 2,500 for booking #BKG-1255", ipAddress: "192.168.1.10", status: "Success" },
  { id: 5, dateTime: "May 22, 2025 09:30:10 AM", user: "Receptionist", role: "Receptionist", module: "Appointments", action: "Created", description: "Scheduled appointment for Ravi Kumar on May 25", ipAddress: "192.168.1.22", status: "Success" },
  { id: 6, dateTime: "May 22, 2025 09:10:05 AM", user: "Lab Technician", role: "Technician", module: "Reports", action: "Uploaded", description: "Uploaded report for booking #BKG-1252", ipAddress: "192.168.1.30", status: "Success" },
  { id: 7, dateTime: "May 22, 2025 08:55:42 AM", user: "Admin User", role: "Super Admin", module: "Settings", action: "Updated", description: "Updated system settings - Notification Preferences", ipAddress: "192.168.1.10", status: "Success" },
  { id: 8, dateTime: "May 22, 2025 08:40:18 AM", user: "Editor User", role: "Editor", module: "Content", action: "Deleted", description: "Deleted banner \"Diabetes Special Offer\"", ipAddress: "192.168.1.15", status: "Success" },
  { id: 9, dateTime: "May 22, 2025 08:20:30 AM", user: "Admin User", role: "Super Admin", module: "Users", action: "Deleted", description: "Deleted user account - testuser@example.com", ipAddress: "192.168.1.10", status: "Failed" },
  { id: 10, dateTime: "May 22, 2025 07:50:11 AM", user: "System", role: "System", module: "Backup", action: "Created", description: "Automated database backup completed", ipAddress: "192.168.1.1", status: "Success" }
];

const commonPaymentMethods = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet"];

export const adminRecordsConfigs = {
  customers: {
    title: "Customers Management",
    breadcrumb: "Customers Management",
    addLabel: "Add New Customer",
    idField: "customerId",
    idPrefix: "CUS",
    defaultRowValues: { totalBookings: 0, totalSpent: 0, lastBooking: "No bookings yet" },
    tableTitle: "All Customers",
    totalCount: 12458,
    totalLabel: "12,458",
    lastPageLabel: "1246",
    emptyText: "No customers found. Try changing your filters.",
    searchFields: ["customerId", "customerName", "phoneNumber", "email"],
    actions: ["view", "edit", "delete"],
    tableMinWidth: 1380,
    stats: [
      { title: "Total Customers", value: "12,458", text: "All time", icon: "users", color: "green" },
      { title: "Active Customers", value: "10,245", text: "82.2% of total", icon: "user", color: "blue", tone: "green" },
      { title: "Inactive Customers", value: "1,245", text: "10.0% of total", icon: "pause", color: "orange", tone: "red" },
      { title: "Blocked Customers", value: "968", text: "7.8% of total", icon: "userX", color: "purple", tone: "red" },
      { title: "Bookings This Week", value: "2,345", text: "Up 12.5% vs last week", icon: "clipboard", color: "cyan", tone: "green" }
    ],
    filters: [
      { key: "query", label: "Search Customer", type: "search", placeholder: "Search by name, phone, email or ID..." },
      { key: "customerType", label: "Customer Type", type: "select", defaultValue: "All Types", options: ["All Types", "Regular", "Premium", "Family"] },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive", "Blocked"] },
      { key: "cityLocation", label: "City / Location", type: "select", defaultValue: "All Cities", options: ["All Cities", "South Delhi", "West Delhi", "East Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad", "Dwarka", "Rohini", "Saket"] }
    ],
    columns: [
      { key: "customerId", label: "Customer ID", link: true },
      { key: "customerName", label: "Customer Name" },
      { key: "phoneNumber", label: "Phone Number" },
      { key: "email", label: "Email" },
      { key: "cityLocation", label: "City / Location" },
      { key: "totalBookings", label: "Total Bookings" },
      { key: "totalSpent", label: "Total Spent (Rs.)", format: "money" },
      { key: "status", label: "Status", badge: "status" },
      { key: "lastBooking", label: "Last Booking" }
    ],
    formFields: [
      { key: "customerName", label: "Customer Name", required: true },
      { key: "phoneNumber", label: "Phone Number", required: true },
      { key: "email", label: "Email", required: true },
      { key: "cityLocation", label: "City / Location", required: true },
      { key: "customerType", label: "Customer Type", type: "select", options: ["Regular", "Premium", "Family"], required: true },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Blocked"], required: true }
    ],
    bottomCards: [
      {
        type: "donut",
        title: "Customer Demographics",
        segments: [
          { label: "Male", value: "60.2% (7,508)", color: "bg-upchar-blue" },
          { label: "Female", value: "38.1% (4,751)", color: "bg-upchar-purple" },
          { label: "Other", value: "1.7% (199)", color: "bg-slate-400" }
        ],
        chart: "bg-[conic-gradient(#1358f6_0_60.2%,#7c3aed_60.2%_98.3%,#94a3b8_98.3%_100%)]"
      },
      { type: "list", title: "Top Cities by Customers", link: "View All", items: [["South Delhi", "2,450"], ["West Delhi", "2,120"], ["Gurgaon", "1,890"], ["Noida", "1,560"], ["Ghaziabad", "1,250"]] },
      { type: "recent", title: "Recent Customers", link: "View All", items: [["Sneha Kapoor", "CUS125488 - May 22, 2025"], ["Rahul Joshi", "CUS125489 - May 22, 2025"], ["Deepika Arora", "CUS125490 - May 22, 2025"]] },
      { type: "actions", title: "Quick Actions", items: ["Add New Customer", "Import Customers", "Export Customers", "Customer Reports"] }
    ],
    rows: customerRows
  },
  prescriptions: {
    title: "Prescription Management",
    breadcrumb: "Prescription Management",
    apiResource: "prescriptions",
    idField: "prescriptionId",
    idPrefix: "RXN",
    tableTitle: "All Prescriptions",
    showTableCount: false,
    emptyText: "No prescriptions found. Try changing your filters.",
    searchFields: ["prescriptionId", "patientName", "customerName"],
    actions: ["view", "download", "whatsapp", "edit", "delete"],
    tableMinWidth: 1280,
    stats: [
      { title: "Total Prescriptions", value: "0", text: "From user uploads", icon: "file", color: "green" },
      { title: "Pending", value: "0", text: "Needs review", icon: "clock", color: "orange" },
      { title: "Reviewed", value: "0", text: "Checked by admin", icon: "fileUpload", color: "blue", tone: "green" },
      { title: "Completed", value: "0", text: "Action completed", icon: "check", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search Prescription", type: "search", placeholder: "Search by patient name, prescription ID..." },
      { key: "uploadDate", label: "Upload Date", type: "date", placeholder: "Select Date Range" },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Pending", "Reviewed", "Completed"] }
    ],
    columns: [
      { key: "prescriptionId", label: "Prescription ID", link: true },
      { key: "patientName", label: "Patient Name" },
      { key: "customerName", label: "Customer Name" },
      { key: "uploadDate", label: "Upload Date" },
      { key: "testsPackages", label: "Tests / Packages" },
      { key: "status", label: "Status", badge: "status" },
      { key: "prescriptionFile", label: "File" }
    ],
    formFields: [
      { key: "status", label: "Status", type: "select", options: ["Pending", "Reviewed", "Completed"], required: true }
    ]
  },
  payments: {
    title: "Payment Management",
    breadcrumb: "Payment Management",
    tableTitle: "All Payments",
    totalCount: 1246,
    totalLabel: "1,246",
    lastPageLabel: "125",
    emptyText: "No payments found. Try changing your filters.",
    searchFields: ["paymentId", "bookingId", "patientName"],
    actions: ["view", "download", "more"],
    tableMinWidth: 1320,
    stats: [
      { title: "Total Payments", value: "Rs. 8,75,620", text: "All time", icon: "rupee", color: "green" },
      { title: "Successful Payments", value: "Rs. 7,98,450", text: "91.20% of total", icon: "check", color: "green", tone: "green" },
      { title: "Failed Payments", value: "Rs. 45,230", text: "5.17% of total", icon: "x", color: "orange", tone: "red" },
      { title: "Refunded Amount", value: "Rs. 32,940", text: "3.63% of total", icon: "clock", color: "purple" },
      { title: "Pending Payments", value: "Rs. 66,000", text: "24 Payments", icon: "card", color: "blue" }
    ],
    filters: [
      { key: "query", label: "Search Payment", type: "search", placeholder: "Search by payment ID, booking ID, patient name..." },
      { key: "paymentMethod", label: "Payment Method", type: "select", defaultValue: "All Methods", options: ["All Methods", ...commonPaymentMethods] },
      { key: "status", label: "Payment Status", type: "select", defaultValue: "All Status", options: ["All Status", "Success", "Failed", "Pending", "Refunded"] },
      { key: "paymentDateTime", label: "Date Range", type: "date", placeholder: "Select Date Range" }
    ],
    columns: [
      { key: "paymentId", label: "Payment ID", link: true },
      { key: "bookingId", label: "Booking ID", link: true },
      { key: "patientName", label: "Patient Name" },
      { key: "amount", label: "Amount (Rs.)", format: "money" },
      { key: "paymentMethod", label: "Payment Method" },
      { key: "status", label: "Status", badge: "status" },
      { key: "paymentDateTime", label: "Payment Date & Time" },
      { key: "transactionId", label: "Transaction ID" }
    ],
    bottomCards: [
      { type: "donut", title: "Payments Overview", segments: [{ label: "Successful", value: "91.20% (Rs. 7,98,450)", color: "bg-upchar-green" }, { label: "Failed", value: "5.17% (Rs. 45,230)", color: "bg-upchar-red" }, { label: "Refunded", value: "3.63% (Rs. 32,940)", color: "bg-upchar-purple" }], chart: "bg-[conic-gradient(#099447_0_91.2%,#ec1f34_91.2%_96.37%,#7c3aed_96.37%_100%)]" },
      { type: "bars", title: "Payment Methods", items: [["UPI", "42.5% (Rs. 3,72,850)", "42.5%"], ["Credit Card", "28.7% (Rs. 2,51,420)", "28.7%"], ["Net Banking", "15.3% (Rs. 1,33,850)", "15.3%"], ["Debit Card", "9.8% (Rs. 85,750)", "9.8%"], ["Wallet", "3.7% (Rs. 31,750)", "3.7%"]] },
      { type: "recent", title: "Recent Transactions", link: "View All", items: [["Ramesh Kumar", "PAY125487 - Success - Rs. 2,450"], ["Priya Sharma", "PAY125486 - Success - Rs. 1,850"], ["Amit Verma", "PAY125485 - Failed - Rs. 950"]] },
      { type: "actions", title: "Quick Actions", items: ["Refund Payment", "Download Reports", "Payment Settings", "Payment Gateway Logs"] }
    ],
    rows: paymentRows
  },
  invoices: {
    title: "Invoice Management",
    breadcrumb: "Invoice Management",
    addLabel: "Generate Invoice",
    idField: "invoiceId",
    idPrefix: "INV",
    defaultRowValues: { invoiceType: "Test" },
    tableTitle: "All Invoices",
    totalCount: 2458,
    totalLabel: "2,458",
    lastPageLabel: "246",
    emptyText: "No invoices found. Try changing your filters.",
    searchFields: ["invoiceId", "customer"],
    actions: ["view", "download", "more"],
    tableMinWidth: 1300,
    stats: [
      { title: "Total Invoices", value: "2,458", text: "All time", icon: "receipt", color: "green" },
      { title: "Paid Invoices", value: "1,856", text: "75.61% of total", icon: "file", color: "blue", tone: "green" },
      { title: "Pending Invoices", value: "486", text: "19.78% of total", icon: "clock", color: "orange", tone: "red" },
      { title: "Overdue Invoices", value: "116", text: "4.72% of total", icon: "x", color: "red", tone: "red" },
      { title: "Total Revenue", value: "Rs. 28,75,620", text: "All time", icon: "rupee", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search Invoice", type: "search", placeholder: "Search by invoice ID, customer name, or email..." },
      { key: "invoiceType", label: "Invoice Type", type: "select", defaultValue: "All Types", options: ["All Types", "Test", "Package", "Corporate"] },
      { key: "status", label: "Payment Status", type: "select", defaultValue: "All Status", options: ["All Status", "Paid", "Pending", "Partial", "Overdue"] },
      { key: "invoiceDate", label: "Date Range", type: "date", defaultValue: "May 16, 2025 - May 22, 2025", placeholder: "May 16, 2025 - May 22, 2025" }
    ],
    columns: [
      { key: "invoiceId", label: "Invoice ID", link: true },
      { key: "customer", label: "Customer" },
      { key: "invoiceDate", label: "Invoice Date" },
      { key: "dueDate", label: "Due Date" },
      { key: "amount", label: "Amount (Rs.)", format: "money" },
      { key: "paidAmount", label: "Paid Amount (Rs.)", format: "money" },
      { key: "status", label: "Status", badge: "status" },
      { key: "paymentMethod", label: "Payment Method" }
    ],
    formFields: [
      { key: "customer", label: "Customer", required: true },
      { key: "invoiceDate", label: "Invoice Date", required: true },
      { key: "dueDate", label: "Due Date", required: true },
      { key: "amount", label: "Amount", type: "number", required: true },
      { key: "paidAmount", label: "Paid Amount", type: "number", required: true },
      { key: "paymentMethod", label: "Payment Method", type: "select", options: commonPaymentMethods, required: true },
      { key: "status", label: "Status", type: "select", options: ["Paid", "Pending", "Partial", "Overdue"], required: true }
    ],
    bottomCards: [
      { type: "donut", title: "Invoice Overview", segments: [{ label: "Paid", value: "75.61% (1,856)", color: "bg-upchar-green" }, { label: "Pending", value: "19.78% (486)", color: "bg-upchar-orange" }, { label: "Overdue", value: "4.72% (116)", color: "bg-upchar-red" }], chart: "bg-[conic-gradient(#099447_0_75.61%,#ff6b1a_75.61%_95.28%,#ec1f34_95.28%_100%)]" },
      { type: "revenue", title: "Revenue Overview", total: "Rs. 28,75,620", received: "Rs. 22,45,780", outstanding: "Rs. 6,29,840" },
      { type: "recent", title: "Recent Invoices", link: "View All", items: [["INV125487", "Ramesh Kumar - May 22, 2025 - Rs. 2,450 - Paid"], ["INV125486", "Priya Sharma - May 22, 2025 - Rs. 1,850 - Paid"], ["INV125485", "Amit Verma - May 21, 2025 - Rs. 950 - Pending"]] },
      { type: "actions", title: "Quick Actions", items: ["Generate Invoice", "Download Invoices", "Invoice Reports", "Payment Reminders", "Tax Settings"] }
    ],
    rows: invoiceRows
  },
  homepageBanners: {
    apiResource: "homepage-banners",
    title: "Homepage Banner Management",
    breadcrumb: "Homepage Banner Management",
    addLabel: "Add New Banner",
    saveLabel: "Save Banner",
    idField: "bannerId",
    idPrefix: "BAN",
    defaultRowValues: { addedOn: "Added just now", addedBy: "Admin User" },
    tableTitle: "All Banners",
    totalCount: 12,
    totalLabel: "12",
    lastPageLabel: "2",
    emptyText: "No banners found. Try changing your filters.",
    searchFields: ["bannerTitle", "bannerDescription", "linkUrl", "addedBy"],
    actions: ["view", "edit", "delete"],
    tableMinWidth: 1320,
    stats: [
      { title: "Total Banners", value: "12", text: "All time", icon: "image", color: "green" },
      { title: "Active Banners", value: "8", text: "66.67% of total", icon: "send", color: "blue", tone: "green" },
      { title: "Inactive Banners", value: "3", text: "25.00% of total", icon: "pause", color: "orange", tone: "red" },
      { title: "Archived Banners", value: "1", text: "8.33% of total", icon: "archive", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search Banner", type: "search", placeholder: "Search by title or description..." },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive", "Archived"] },
      { key: "position", label: "Position", type: "select", defaultValue: "All Positions", options: ["All Positions", "Top Slider", "Below Slider", "Middle Banner", "Bottom Banner"] },
      { key: "addedOn", label: "Added On", type: "date", placeholder: "Select Date Range" }
    ],
    columns: [
      { key: "bannerTitle", label: "Banner Title" },
      { key: "position", label: "Position", badge: "position" },
      { key: "status", label: "Status", badge: "status" },
      { key: "bannerImage", label: "Image", format: "thumbnail" },
      { key: "linkUrl", label: "Link URL" },
      { key: "addedOn", label: "Added On" },
      { key: "addedBy", label: "Added By" }
    ],
    formFields: [
      { key: "bannerTitle", label: "Banner Title", required: true },
      { key: "bannerDescription", label: "Banner Description", type: "textarea" },
      { key: "bannerImage", label: "Banner Image Upload", type: "image", required: true },
      { key: "position", label: "Position", type: "select", options: ["Top Slider", "Below Slider", "Middle Banner", "Bottom Banner"], required: true },
      { key: "linkUrl", label: "Link URL", required: true },
      { key: "buttonText", label: "Button Text optional" },
      { key: "startDate", label: "Start Date" },
      { key: "endDate", label: "End Date" },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Archived"], required: true }
    ],
    bottomCards: [
      {
        type: "donut",
        title: "Banner Position Overview",
        segments: [
          { label: "Top Slider", value: "5 (41.67%)", color: "bg-upchar-green" },
          { label: "Below Slider", value: "2 (16.67%)", color: "bg-upchar-blue" },
          { label: "Middle Banner", value: "3 (25.00%)", color: "bg-upchar-purple" },
          { label: "Bottom Banner", value: "2 (16.67%)", color: "bg-upchar-orange" }
        ],
        chart: "bg-[conic-gradient(#099447_0_41.67%,#1358f6_41.67%_58.34%,#7c3aed_58.34%_83.34%,#ff9800_83.34%_100%)]"
      },
      {
        type: "recent",
        title: "Recent Activity",
        link: "View All",
        items: [
          ["Health Checkup Offer", "Banner was activated - May 22, 2025 10:30 AM by Admin User"],
          ["Women's Health Package", "Banner was deactivated - May 20, 2025 04:15 PM by Admin User"],
          ["Refer & Earn", "Banner was deactivated - May 19, 2025 11:05 AM by Editor User"],
          ["Book Now & Save More", "Banner was updated - May 17, 2025 10:25 AM by Admin User"]
        ]
      },
      { type: "actions", title: "Quick Actions", items: ["Add New Banner", "Manage Banner Positions", "Banner Settings", "View All Banners"] }
    ],
    rows: homepageBannerRows
  },
  testimonials: {
    apiResource: "testimonials",
    title: "Testimonials Management",
    breadcrumb: "Testimonials Management",
    addLabel: "Add New Testimonial",
    saveLabel: "Save Testimonial",
    idField: "testimonialId",
    idPrefix: "TST",
    defaultRowValues: { addedOn: "Added just now", displayedOn: "Homepage" },
    tableTitle: "All Testimonials",
    totalCount: 48,
    totalLabel: "48",
    lastPageLabel: "5",
    emptyText: "No testimonials found. Try changing your filters.",
    searchFields: ["customerName", "email", "content"],
    actions: ["view", "edit", "delete"],
    tableMinWidth: 1360,
    stats: [
      { title: "Total Testimonials", value: "48", text: "All time", icon: "message", color: "green" },
      { title: "Published Testimonials", value: "38", text: "79.17% of total", icon: "thumbsUp", color: "blue", tone: "green" },
      { title: "Pending Testimonials", value: "6", text: "12.50% of total", icon: "clock", color: "orange" },
      { title: "Hidden Testimonials", value: "4", text: "8.33% of total", icon: "eyeOff", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search Testimonial", type: "search", placeholder: "Search by name, email or content..." },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Published", "Pending", "Hidden"] },
      { key: "ratingLabel", label: "Rating", type: "select", defaultValue: "All Ratings", options: ["All Ratings", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"] },
      { key: "addedOn", label: "Added On", type: "date", placeholder: "Select Date Range" }
    ],
    columns: [
      { key: "customerName", label: "Customer", format: "person", secondaryKey: "email" },
      { key: "content", label: "Content", truncate: true },
      { key: "rating", label: "Rating", format: "stars" },
      { key: "status", label: "Status", badge: "status" },
      { key: "source", label: "Source" },
      { key: "addedOn", label: "Added On" },
      { key: "displayedOn", label: "Displayed On" }
    ],
    formFields: [
      { key: "googlePlaceId", label: "Google Place ID" },
      { key: "googleReviewsUrl", label: "Google Review / Business URL" },
      { key: "customerName", label: "Customer Name" },
      { key: "email", label: "Customer Email" },
      { key: "customerPhoto", label: "Customer Photo optional", type: "image" },
      { key: "content", label: "Testimonial Content", type: "textarea" },
      { key: "rating", label: "Rating", type: "select", options: ["5", "4", "3", "2", "1"] },
      { key: "status", label: "Status", type: "select", options: ["Published", "Pending", "Hidden"] },
      { key: "displayedOn", label: "Displayed On", type: "select", options: ["Homepage", "Packages Page", "About Us", "None"] }
    ],
    bottomCards: [
      {
        type: "donut",
        title: "Rating Overview",
        segments: [
          { label: "5 Stars", value: "24 (50.00%)", color: "bg-upchar-green" },
          { label: "4 Stars", value: "14 (29.17%)", color: "bg-upchar-blue" },
          { label: "3 Stars", value: "6 (12.50%)", color: "bg-upchar-orange" },
          { label: "2 Stars", value: "2 (4.17%)", color: "bg-upchar-purple" },
          { label: "1 Star", value: "2 (4.17%)", color: "bg-upchar-red" }
        ],
        chart: "bg-[conic-gradient(#099447_0_50%,#1358f6_50%_79.17%,#ff9800_79.17%_91.67%,#7c3aed_91.67%_95.84%,#ec1f34_95.84%_100%)]"
      },
      {
        type: "recent",
        title: "Recent Testimonials",
        link: "View All",
        items: [
          ["Ramesh Kumar", "5 stars - May 22, 2025 10:30 AM - Published"],
          ["Priya Sharma", "4 stars - May 21, 2025 03:45 PM - Published"],
          ["Amit Verma", "4 stars - May 21, 2025 11:20 AM - Published"]
        ]
      },
      { type: "actions", title: "Quick Actions", items: ["Add New Testimonial", "Manage Testimonials", "Testimonial Settings", "View on Website"] }
    ],
    rows: testimonialRows
  },
  blogs: {
    apiResource: "blogs",
    title: "Manage Blog",
    breadcrumb: "Manage Blog",
    addLabel: "Add Blog",
    saveLabel: "Save Blog",
    idField: "blogId",
    idPrefix: "BLG",
    tableTitle: "All Blogs",
    emptyText: "No blogs found. Try changing your filters.",
    searchFields: ["title", "shortDescription", "category", "author"],
    actions: ["view", "edit", "delete"],
    tableMinWidth: 1280,
    stats: [
      { title: "Total Blogs", value: "All", text: "Dynamic records", icon: "file", color: "green" },
      { title: "Active Blogs", value: "Live", text: "Shown on website", icon: "send", color: "blue", tone: "green" },
      { title: "Featured Blogs", value: "Featured", text: "Homepage priority", icon: "badge", color: "orange" },
      { title: "Inactive Blogs", value: "Hidden", text: "Not shown", icon: "eyeOff", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search Blog", type: "search", placeholder: "Search by title, category or author..." },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive"] },
      { key: "featuredLabel", label: "Featured", type: "select", defaultValue: "All Blogs", options: ["All Blogs", "Featured", "Latest"] },
      { key: "publishDate", label: "Publish Date", type: "date", placeholder: "Select Date Range" }
    ],
    columns: [
      { key: "title", label: "Title", secondaryKey: "slug" },
      { key: "shortDescription", label: "Short Description", truncate: true },
      { key: "category", label: "Category", badge: "category" },
      { key: "author", label: "Author" },
      { key: "image", label: "Image", format: "thumbnail" },
      { key: "date", label: "Publish Date" },
      { key: "featuredLabel", label: "Featured" },
      { key: "status", label: "Status", badge: "status" }
    ],
    formFields: [
      { key: "title", label: "Blog Title", required: true },
      { key: "slug", label: "Slug" },
      { key: "shortDescription", label: "Short Description", type: "textarea", required: true },
      { key: "content", label: "Full Content", type: "textarea", required: true },
      { key: "category", label: "Category" },
      { key: "author", label: "Author Name" },
      { key: "image", label: "Blog Image", type: "image" },
      { key: "publishDate", label: "Publish Date" },
      { key: "isFeatured", label: "Featured / Latest", type: "select", options: ["Latest", "Featured"] },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true }
    ],
    bottomCards: [
      { type: "actions", title: "Quick Actions", items: ["Add New Blog", "Manage Blogs", "View Website Blog"] }
    ],
    rows: []
  },
  serviceLocations: {
    apiResource: "service-locations",
    title: "Service Locations Management",
    breadcrumb: "Service Locations",
    addLabel: "Add Location",
    saveLabel: "Save Location",
    tableTitle: "All Service Locations",
    emptyText: "No service locations found.",
    searchFields: ["centerName", "fullAddress", "areaLabel", "city", "state", "pincode"],
    actions: ["view", "edit", "delete"],
    tableMinWidth: 1250,
    previewMap: true,
    stats: [
      { title: "Service Locations", value: "All", text: "Managed locations", icon: "mapPin", color: "green" },
      { title: "Featured Location", value: "1", text: "Homepage default", icon: "mapPin", color: "blue" }
    ],
    filters: [
      { key: "query", label: "Search Location", type: "search", placeholder: "Search by center, address or city..." },
      { key: "active", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive"] },
      { key: "featured", label: "Featured", type: "select", defaultValue: "All Featured", options: ["All Featured", "Featured", "Standard"] }
    ],
    columns: [
      { key: "centerName", label: "Center Name", secondaryKey: "areaLabel" },
      { key: "fullAddress", label: "Address", truncate: true },
      { key: "city", label: "City" },
      { key: "openStatusText", label: "Opening Status" },
      { key: "active", label: "Status", badge: "status" },
      { key: "featured", label: "Featured" },
      { key: "sortOrder", label: "Sort Order" }
    ],
    formFields: [
      { key: "centerName", label: "Center Name", required: true },
      { key: "fullAddress", label: "Full Address", type: "textarea", required: true },
      { key: "areaLabel", label: "Area Label" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "pincode", label: "Pincode" },
      { key: "latitude", label: "Latitude", type: "number", step: "any", min: -90, max: 90 },
      { key: "longitude", label: "Longitude", type: "number", step: "any", min: -180, max: 180 },
      { key: "googleMapEmbedUrl", label: "Google Map Embed URL" },
      { key: "googlePlaceUrl", label: "Google Place URL" },
      { key: "googleDirectionUrl", label: "Google Direction URL" },
      { key: "openingTime", label: "Opening Time" },
      { key: "closingTime", label: "Closing Time" },
      { key: "openStatusText", label: "Open Status Text" },
      { key: "phone", label: "Phone optional" },
      { key: "whatsapp", label: "WhatsApp optional" },
      { key: "active", label: "Active", type: "select", options: ["Active", "Inactive"], required: true },
      { key: "featured", label: "Featured / Default", type: "select", options: ["Featured", "Standard"], required: true },
      { key: "sortOrder", label: "Sort Order", type: "number" }
    ]
  },
  activityLogs: {
    title: "Activity Logs Management",
    breadcrumb: "Activity Logs Management",
    exportLabel: "Export Logs",
    exportFileName: "activity-logs.csv",
    tableTitle: "All Activity Logs",
    showTableCount: false,
    totalCount: 2458,
    totalLabel: "2,458",
    lastPageLabel: "246",
    emptyText: "No activity logs found. Try changing your filters.",
    searchFields: ["dateTime", "user", "role", "module", "action", "description", "ipAddress", "status"],
    actions: [],
    tableMinWidth: 1480,
    stats: [
      { title: "Total Activities", value: "2,458", text: "All time", icon: "refresh", color: "green" },
      { title: "Unique Users", value: "125", text: "87.50% of total", icon: "user", color: "blue", tone: "green" },
      { title: "Today's Activities", value: "156", text: "6.35% of total", icon: "calendar", color: "orange" },
      { title: "Failed Activities", value: "12", text: "0.49% of total", icon: "shield", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search Logs", type: "search", placeholder: "Search by user, action, module..." },
      { key: "module", label: "Module", type: "select", defaultValue: "All Modules", options: ["All Modules", "Bookings", "Users", "Packages", "Payments", "Appointments", "Reports", "Settings", "Content", "Backup"] },
      { key: "action", label: "Action", type: "select", defaultValue: "All Actions", options: ["All Actions", "Created", "Updated", "Deleted", "Uploaded"] },
      { key: "user", label: "User", type: "select", defaultValue: "All Users", options: ["All Users", "Admin User", "Editor User", "Receptionist", "Lab Technician", "System"] },
      { key: "dateTime", label: "Date Range", type: "date", placeholder: "Select Date Range" }
    ],
    columns: [
      { key: "dateTime", label: "Date & Time" },
      { key: "user", label: "User", format: "person" },
      { key: "role", label: "Role" },
      { key: "module", label: "Module" },
      { key: "action", label: "Action", badge: "status" },
      { key: "description", label: "Description", truncate: true },
      { key: "ipAddress", label: "IP Address" },
      { key: "status", label: "Status", badge: "status" }
    ],
    bottomCards: [
      {
        type: "donut",
        title: "Activity Overview",
        segments: [
          { label: "Created", value: "1,152 (46.89%)", color: "bg-upchar-green" },
          { label: "Updated", value: "798 (32.50%)", color: "bg-upchar-blue" },
          { label: "Deleted", value: "312 (12.70%)", color: "bg-upchar-orange" },
          { label: "Uploaded", value: "156 (6.35%)", color: "bg-upchar-purple" },
          { label: "Failed", value: "40 (1.63%)", color: "bg-upchar-red" }
        ],
        chart: "bg-[conic-gradient(#099447_0_46.89%,#1358f6_46.89%_79.39%,#ff9800_79.39%_92.09%,#7c3aed_92.09%_98.44%,#ec1f34_98.44%_100%)]"
      },
      {
        type: "bars",
        title: "Top Active Users",
        items: [
          ["Admin User", "1,245 activities", "100%"],
          ["Editor User", "456 activities", "37%"],
          ["Receptionist", "312 activities", "25%"],
          ["Lab Technician", "245 activities", "20%"],
          ["Other Users", "200 activities", "16%"]
        ]
      },
      {
        type: "recent",
        title: "Recent Failed Activities",
        link: "View All",
        items: [
          ["Failed login attempt", "testuser@example.com - May 22, 2025 08:20 AM - IP: 192.168.1.50"],
          ["Delete user account", "testuser@example.com - May 22, 2025 08:20 AM - IP: 192.168.1.10"],
          ["Invalid API request", "Payment gateway - May 21, 2025 11:05 AM - IP: 192.168.1.30"],
          ["Permission denied", "Restricted resource - May 20, 2025 04:15 PM - IP: 192.168.1.15"]
        ]
      }
    ],
    rows: activityLogRows
  }
};
