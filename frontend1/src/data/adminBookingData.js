const collectorRows = [
  { id: 1, collectorCode: "COL001", collectorName: "Ramesh Kumar", phoneNumber: "9876543210", areaLocation: "South Delhi", availability: "Available", specialization: "Home Collection", activeBookings: 18, rating: 4.5, status: "Active" },
  { id: 2, collectorCode: "COL002", collectorName: "Priya Sharma", phoneNumber: "9876501234", areaLocation: "West Delhi", availability: "Busy", specialization: "Corporate Collection", activeBookings: 24, rating: 4.0, status: "Active" },
  { id: 3, collectorCode: "COL003", collectorName: "Amit Verma", phoneNumber: "9876512345", areaLocation: "East Delhi", availability: "Available", specialization: "Lab Pickup", activeBookings: 12, rating: 5.0, status: "Active" },
  { id: 4, collectorCode: "COL004", collectorName: "Neha Gupta", phoneNumber: "9876523456", areaLocation: "Gurgaon", availability: "Busy", specialization: "Home Collection", activeBookings: 20, rating: 4.5, status: "Active" },
  { id: 5, collectorCode: "COL005", collectorName: "Sanjay Singh", phoneNumber: "9876534567", areaLocation: "Noida", availability: "Available", specialization: "Corporate Collection", activeBookings: 8, rating: 4.0, status: "Active" },
  { id: 6, collectorCode: "COL006", collectorName: "Pooja Mehta", phoneNumber: "9876545678", areaLocation: "Faridabad", availability: "Busy", specialization: "Lab Pickup", activeBookings: 16, rating: 4.5, status: "Active" },
  { id: 7, collectorCode: "COL007", collectorName: "Vikram Patel", phoneNumber: "9876556789", areaLocation: "Ghaziabad", availability: "Available", specialization: "Home Collection", activeBookings: 10, rating: 4.0, status: "Active" },
  { id: 8, collectorCode: "COL008", collectorName: "Anjali Desai", phoneNumber: "9876567890", areaLocation: "Dwarka", availability: "Busy", specialization: "Corporate Collection", activeBookings: 22, rating: 5.0, status: "Active" },
  { id: 9, collectorCode: "COL009", collectorName: "Karan Malhotra", phoneNumber: "9876578901", areaLocation: "Rohini", availability: "Available", specialization: "Lab Pickup", activeBookings: 9, rating: 4.5, status: "Active" },
  { id: 10, collectorCode: "COL010", collectorName: "Meera Nair", phoneNumber: "9876589012", areaLocation: "Saket", availability: "Available", specialization: "Home Collection", activeBookings: 7, rating: 4.0, status: "Active" }
];

const collectionPointRows = [
  { id: 1, pointCode: "SCP001", pointName: "Upchar Collection Point - Sector 62", city: "Noida", areaLocality: "Sector 62", address: "Near Metro Station, Sector 62, Noida", contactPerson: "Ramesh Kumar", phoneNumber: "9876543210", email: "sector62@upcharlab.com", collectionType: "Lab Visit + Pickup", openingTime: "07:00 AM", closingTime: "09:00 PM", workingDays: "Mon - Sun", status: "Active" },
  { id: 2, pointCode: "SCP002", pointName: "Upchar Collection Point - Connaught Place", city: "New Delhi", areaLocality: "Connaught Place", address: "Near City Hospital, CP, New Delhi", contactPerson: "Priya Sharma", phoneNumber: "9876501234", email: "cp@upcharlab.com", collectionType: "Lab Visit", openingTime: "07:00 AM", closingTime: "09:00 PM", workingDays: "Mon - Sun", status: "Active" },
  { id: 3, pointCode: "SCP003", pointName: "Upchar Collection Point - Faridabad NIT", city: "Faridabad", areaLocality: "NIT", address: "Main Market, NIT Faridabad", contactPerson: "Amit Verma", phoneNumber: "9876512345", email: "nit@upcharlab.com", collectionType: "Pickup", openingTime: "07:00 AM", closingTime: "09:00 PM", workingDays: "Mon - Sat", status: "Active" },
  { id: 4, pointCode: "SCP004", pointName: "Upchar Collection Point - Gurgaon Cyber City", city: "Gurgaon", areaLocality: "Cyber City", address: "DLF Cyber City, Gurgaon", contactPerson: "Neha Gupta", phoneNumber: "9876523456", email: "cybercity@upcharlab.com", collectionType: "Lab Visit + Pickup", openingTime: "07:00 AM", closingTime: "09:00 PM", workingDays: "Mon - Sun", status: "Active" },
  { id: 5, pointCode: "SCP005", pointName: "Upchar Collection Point - Dwarka", city: "New Delhi", areaLocality: "Dwarka", address: "Sector 12, Dwarka, New Delhi", contactPerson: "Sanjay Singh", phoneNumber: "9876534567", email: "dwarka@upcharlab.com", collectionType: "Lab Visit", openingTime: "07:00 AM", closingTime: "09:00 PM", workingDays: "Mon - Sun", status: "Active" },
  { id: 6, pointCode: "SCP006", pointName: "Upchar Collection Point - Rohini", city: "New Delhi", areaLocality: "Rohini", address: "Sector 7, Rohini, New Delhi", contactPerson: "Pooja Mehta", phoneNumber: "9876545678", email: "rohini@upcharlab.com", collectionType: "Pickup", openingTime: "07:00 AM", closingTime: "09:00 PM", workingDays: "Mon - Sat", status: "Active" },
  { id: 7, pointCode: "SCP007", pointName: "Upchar Collection Point - Ghaziabad", city: "Ghaziabad", areaLocality: "Indirapuram", address: "Shipra Mall Road, Indirapuram", contactPerson: "Vikram Patel", phoneNumber: "9876556789", email: "ghaziabad@upcharlab.com", collectionType: "Lab Visit + Pickup", openingTime: "07:00 AM", closingTime: "09:00 PM", workingDays: "Mon - Sat", status: "Inactive" },
  { id: 8, pointCode: "SCP008", pointName: "Upchar Collection Point - Saket", city: "New Delhi", areaLocality: "Saket", address: "Near Max Hospital, Saket", contactPerson: "Anjali Desai", phoneNumber: "9876567890", email: "saket@upcharlab.com", collectionType: "Lab Visit", openingTime: "07:00 AM", closingTime: "09:00 PM", workingDays: "Mon - Sun", status: "Active" },
  { id: 9, pointCode: "SCP009", pointName: "Upchar Collection Point - Lajpat Nagar", city: "New Delhi", areaLocality: "Lajpat Nagar", address: "Central Market, Lajpat Nagar", contactPerson: "Karan Malhotra", phoneNumber: "9876578901", email: "lajpat@upcharlab.com", collectionType: "Pickup", openingTime: "07:00 AM", closingTime: "09:00 PM", workingDays: "Mon - Sat", status: "Active" },
  { id: 10, pointCode: "SCP010", pointName: "Upchar Collection Point - Karol Bagh", city: "New Delhi", areaLocality: "Karol Bagh", address: "Ajmal Khan Road, Karol Bagh", contactPerson: "Meera Nair", phoneNumber: "9876589012", email: "karolbagh@upcharlab.com", collectionType: "Lab Visit + Pickup", openingTime: "07:00 AM", closingTime: "09:00 PM", workingDays: "Mon - Sun", status: "Active" }
];

const statusOptions = [
  "Pending Confirmation",
  "Confirmed",
  "Sample Collection Scheduled",
  "Sample Collected",
  "Testing In Progress",
  "Report Ready",
  "Completed",
  "Cancelled"
];

export const adminBookingConfigs = {
  bookings: {
    apiResource: "bookings",
    title: "Booking Management",
    breadcrumb: "Booking Management",
    tableTitle: "All Bookings",
    totalCount: 0,
    totalLabel: "0",
    lastPageLabel: "1",
    emptyText: "No bookings found. Try changing your filters.",
    searchFields: ["bookingId", "patientName", "phoneNumber", "testsPackages"],
    actions: ["view", "whatsapp"],
    tableMinWidth: 1260,
    stats: [
      { title: "Total Bookings", value: "0", text: "Real bookings", icon: "calendar", color: "green", tone: "green" },
      { title: "Completed Bookings", value: "0", text: "Completed", icon: "check", color: "blue", tone: "green" },
      { title: "Pending Bookings", value: "0", text: "Pending confirmation", icon: "clock", color: "orange" },
      { title: "Cancelled Bookings", value: "0", text: "Cancelled", icon: "x", color: "purple" },
      { title: "Completion Rate", value: "0%", text: "Completed / total", icon: "badge", color: "cyan" }
    ],
    filters: [
      { key: "query", label: "Search Booking", type: "search", placeholder: "Search by name, phone, booking ID..." },
      { key: "bookingDate", label: "Booking Date", type: "date", placeholder: "Select Date Range" },
      { key: "bookingStatus", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", ...statusOptions] },
      { key: "paymentStatus", label: "Payment Status", type: "select", defaultValue: "All Payment Status", options: ["All Payment Status", "Paid", "Pending"] }
    ],
    columns: [
      { key: "bookingId", label: "Booking ID", link: true },
      { key: "bookingType", label: "Type", badge: "status" },
      { key: "patientName", label: "Patient Name" },
      { key: "phoneNumber", label: "Phone Number" },
      { key: "bookingDate", label: "Booking Date" },
      { key: "testsPackages", label: "Tests / Packages" },
      { key: "amount", label: "Amount (Rs.)", format: "money" },
      { key: "paymentStatus", label: "Payment Status", badge: "status" },
      { key: "bookingStatus", label: "Booking Status", badge: "status" }
    ],
    sideWidgets: {
      overview: [
        { label: "Completed", value: "98,745 (79.4%)", color: "bg-upchar-green" },
        { label: "In Progress", value: "12,000 (9.6%)", color: "bg-upchar-blue" },
        { label: "Pending", value: "10,976 (8.8%)", color: "bg-upchar-orange" },
        { label: "Cancelled", value: "2,859 (2.2%)", color: "bg-upchar-red" }
      ],
      today: { value: "3,245", text: "Up 8.6% vs yesterday" },
      activities: [
        { title: "Booking confirmed", text: "BKD125487 for Ramesh Kumar", time: "May 22, 2025 - 09:15 AM", tone: "green" },
        { title: "Payment received", text: "Rs. 1,499 from Priya Sharma", time: "May 22, 2025 - 09:10 AM", tone: "blue" },
        { title: "Booking cancelled", text: "BKD125475 for Amit Verma", time: "May 22, 2025 - 08:45 AM", tone: "red" },
        { title: "Sample collected", text: "BKD125483 for Sanjay Singh", time: "May 22, 2025 - 08:30 AM", tone: "purple" },
        { title: "Booking rescheduled", text: "BKD125472 for Neha Gupta", time: "May 22, 2025 - 08:15 AM", tone: "orange" }
      ]
    },
    infoCard: {
      title: "Booking Management",
      text: "View and manage all bookings, track status, payments and customer details. Use filters to find specific bookings quickly."
    },
    rows: []
  },
  bookingStatus: {
    apiResource: "bookings",
    title: "Booking Status Management",
    breadcrumb: "Booking Status Management",
    tableTitle: "All Bookings",
    totalCount: 0,
    totalLabel: "0",
    lastPageLabel: "1",
    emptyText: "No booking statuses found. Try changing your filters.",
    searchFields: ["bookingId", "patientName", "phoneNumber", "testPackage"],
    actions: ["details", "statusUpdate"],
    statusOptions,
    tableMinWidth: 1240,
    stats: [
      { title: "Total Bookings", value: "0", text: "All time", icon: "calendar", color: "blue" },
      { title: "Completed", value: "0", text: "(0%)", icon: "check", color: "green", progress: "0%", progressClass: "bg-upchar-green" },
      { title: "In Progress", value: "0", text: "(0%)", icon: "clock", color: "orange", progress: "0%", progressClass: "bg-upchar-orange" },
      { title: "Pending", value: "0", text: "(0%)", icon: "pause", color: "purple", progress: "0%", progressClass: "bg-upchar-purple" },
      { title: "Cancelled", value: "0", text: "(0%)", icon: "x", color: "orange", progress: "0%", progressClass: "bg-upchar-red" }
    ],
    filters: [
      { key: "query", label: "Search Booking", type: "search", placeholder: "Search by ID, name or phone..." },
      { key: "bookingDate", label: "Booking Date", type: "date", placeholder: "Select Date Range" },
      { key: "currentStatus", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", ...statusOptions] },
      { key: "testPackage", label: "Test / Package", type: "select", defaultValue: "All Tests & Packages", options: ["All Tests & Packages", "3 Tests", "Thyroid Profile", "Diabetes Panel", "Liver Function Test", "Full Body Checkup"] }
    ],
    statusStages: [
      { title: "Pending Confirmation", text: "Booking received waiting to confirm", tone: "orange" },
      { title: "Confirmed", text: "Booking confirmed by admin", tone: "blue" },
      { title: "Sample Collection Scheduled", text: "Collection slot scheduled", tone: "blue" },
      { title: "Sample Collected", text: "Sample collected from patient", tone: "purple" },
      { title: "Testing In Progress", text: "Sample in lab for testing", tone: "orange" },
      { title: "Report Ready", text: "Report generated and ready", tone: "green" },
      { title: "Completed", text: "Report delivered to customer", tone: "green" },
      { title: "Cancelled", text: "Booking cancelled at any stage", tone: "red" }
    ],
    columns: [
      { key: "bookingId", label: "Booking ID", link: true },
      { key: "patientName", label: "Patient Name" },
      { key: "phoneNumber", label: "Phone Number" },
      { key: "testPackage", label: "Test / Package" },
      { key: "bookingDate", label: "Booking Date" },
      { key: "currentStatus", label: "Current Status", badge: "status" },
      { key: "lastUpdated", label: "Last Updated" }
    ],
    rows: []
  },
  assignSampleCollector: {
    title: "Assign Sample Collector",
    breadcrumb: "Assign Sample Collector",
    tableTitle: "Sample Collectors",
    totalCount: 32,
    emptyText: "No sample collectors found. Try changing your filters.",
    searchFields: ["collectorCode", "collectorName", "phoneNumber", "areaLocation"],
    actions: ["edit", "view"],
    tableMinWidth: 1180,
    stats: [
      { title: "Total Collectors", value: "32", text: "All time", icon: "users", color: "green" },
      { title: "Active Collectors", value: "28", text: "Currently active", icon: "clipboard", color: "blue" },
      { title: "Unassigned Bookings", value: "156", text: "Need assignment", icon: "users", color: "orange" },
      { title: "Assigned Today", value: "1,245", text: "May 22, 2025", icon: "check", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search Collector", type: "search", placeholder: "Search by name, phone or code..." },
      { key: "areaLocation", label: "Area / Location", type: "select", defaultValue: "All Locations", options: ["All Locations", "South Delhi", "West Delhi", "East Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad", "Dwarka", "Rohini", "Saket"] },
      { key: "availability", label: "Availability", type: "select", defaultValue: "All Status", options: ["All Status", "Available", "Busy"] },
      { key: "specialization", label: "Specialization", type: "select", defaultValue: "All Types", options: ["All Types", "Home Collection", "Corporate Collection", "Lab Pickup"] }
    ],
    columns: [
      { key: "collectorCode", label: "Collector Code", link: true },
      { key: "collectorName", label: "Collector Name" },
      { key: "phoneNumber", label: "Phone Number" },
      { key: "areaLocation", label: "Area / Location" },
      { key: "availability", label: "Availability", badge: "status" },
      { key: "activeBookings", label: "Active Bookings" },
      { key: "rating", label: "Rating", format: "rating" },
      { key: "status", label: "Status", badge: "status" }
    ],
    formFields: [
      { key: "collectorCode", label: "Collector Code", required: true },
      { key: "collectorName", label: "Collector Name", required: true },
      { key: "phoneNumber", label: "Phone Number", required: true },
      { key: "areaLocation", label: "Area / Location", type: "select", options: ["South Delhi", "West Delhi", "East Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad", "Dwarka", "Rohini", "Saket"], required: true },
      { key: "availability", label: "Availability", type: "select", options: ["Available", "Busy"], required: true },
      { key: "specialization", label: "Specialization", type: "select", options: ["Home Collection", "Corporate Collection", "Lab Pickup"], required: true },
      { key: "activeBookings", label: "Active Bookings", type: "number", required: true },
      { key: "rating", label: "Rating", type: "number", required: true },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true }
    ],
    rows: collectorRows
  },
  sampleCollectionPoints: {
    route: "/admin/sample-collection-points",
    title: "Sample Collection Points",
    breadcrumb: "Sample Collection Points",
    addLabel: "Add Collection Point",
    exportLabel: "Export",
    saveLabel: "Save Collection Point",
    tableTitle: "All Collection Points",
    totalCount: 48,
    emptyText: "No collection points found. Try changing your filters.",
    searchFields: ["pointCode", "pointName", "city", "areaLocality", "contactPerson"],
    actions: ["edit", "view", "delete"],
    tableMinWidth: 1700,
    stats: [
      { title: "Total Collection Points", value: "48", text: "All locations", icon: "map", color: "green" },
      { title: "Active Points", value: "42", text: "Currently active", icon: "check", color: "blue" },
      { title: "Inactive Points", value: "6", text: "Currently inactive", icon: "pause", color: "orange" },
      { title: "Cities Covered", value: "12", text: "Service areas", icon: "truck", color: "purple" }
    ],
    filters: [
      { key: "query", label: "Search Collection Point", type: "search", placeholder: "Search by point name, code or city..." },
      { key: "city", label: "City", type: "select", defaultValue: "All Cities", options: ["All Cities", "Noida", "New Delhi", "Faridabad", "Gurgaon", "Ghaziabad"] },
      { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive"] },
      { key: "collectionType", label: "Collection Type", type: "select", defaultValue: "All Types", options: ["All Types", "Lab Visit", "Pickup", "Lab Visit + Pickup"] }
    ],
    columns: [
      { key: "pointCode", label: "Point Code", link: true },
      { key: "pointName", label: "Collection Point Name" },
      { key: "city", label: "City" },
      { key: "areaLocality", label: "Area / Locality" },
      { key: "address", label: "Address" },
      { key: "contactPerson", label: "Contact Person" },
      { key: "phoneNumber", label: "Phone Number" },
      { key: "collectionType", label: "Collection Type" },
      { key: "status", label: "Status", badge: "status" }
    ],
    formFields: [
      { key: "pointCode", label: "Point Code", required: true },
      { key: "pointName", label: "Collection Point Name", required: true },
      { key: "city", label: "City", type: "select", options: ["Noida", "New Delhi", "Faridabad", "Gurgaon", "Ghaziabad"], required: true },
      { key: "areaLocality", label: "Area / Locality", required: true },
      { key: "address", label: "Full Address", type: "textarea", required: true },
      { key: "contactPerson", label: "Contact Person", required: true },
      { key: "phoneNumber", label: "Phone Number", required: true },
      { key: "email", label: "Email optional" },
      { key: "collectionType", label: "Collection Type", type: "select", options: ["Lab Visit", "Pickup", "Lab Visit + Pickup"], required: true },
      { key: "openingTime", label: "Opening Time", required: true },
      { key: "closingTime", label: "Closing Time", required: true },
      { key: "workingDays", label: "Working Days", required: true },
      { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true }
    ],
    infoCard: {
      title: "Collection Point Management",
      text: "Manage lab visit and pickup points across service areas. Keep contact details, timings and availability updated for smoother bookings."
    },
    rows: collectionPointRows
  }
};
