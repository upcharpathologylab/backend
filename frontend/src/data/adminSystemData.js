export const userRoleStats = [
  { title: "Total Users", value: "0", text: "Database users", icon: "users", color: "green" },
  { title: "Total Roles", value: "0", text: "Database roles", icon: "shield", color: "blue" },
  { title: "Active Users", value: "0", text: "0.0% of total", icon: "userPlus", color: "purple", tone: "green" },
  { title: "Inactive Users", value: "0", text: "0.0% of total", icon: "userX", color: "orange", tone: "green" }
];

export const userRows = [
];

export const roleRows = [
  { id: 1, roleName: "Super Admin", description: "Full system access", usersCount: "2 users", permissions: "All permissions", status: "Active", createdOn: "Apr 10, 2025" },
  { id: 2, roleName: "Admin", description: "Admin access except system settings", usersCount: "18 users", permissions: "Manage operations", status: "Active", createdOn: "Apr 11, 2025" },
  { id: 3, roleName: "Editor", description: "Content and banner management", usersCount: "6 users", permissions: "Content permissions", status: "Active", createdOn: "Apr 12, 2025" },
  { id: 4, roleName: "Technician", description: "Reports and lab workflow", usersCount: "24 users", permissions: "Report permissions", status: "Active", createdOn: "Apr 14, 2025" },
  { id: 5, roleName: "Receptionist", description: "Booking and customer handling", usersCount: "12 users", permissions: "Booking permissions", status: "Active", createdOn: "Apr 15, 2025" },
  { id: 6, roleName: "Support", description: "Helpdesk and customer support", usersCount: "8 users", permissions: "Support permissions", status: "Active", createdOn: "Apr 16, 2025" },
  { id: 7, roleName: "Billing", description: "Payment and invoice access", usersCount: "9 users", permissions: "Billing permissions", status: "Active", createdOn: "Apr 18, 2025" }
];

export const userRoleFilters = [
  { key: "query", label: "Search User", type: "search", placeholder: "Search by name, email or mobile..." },
  { key: "role", label: "Role", type: "select", defaultValue: "All Roles", options: ["All Roles", "Super Admin", "Admin", "Editor", "Receptionist", "Technician", "Doctor", "Support", "Billing", "Marketing", "Accountant", "Verifier"] },
  { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Active", "Inactive"] },
  { key: "createdOn", label: "Created On", type: "date", placeholder: "Select Date Range" }
];

export const userTableConfig = {
  tableTitle: "All Users",
  totalCount: 0,
  totalLabel: "0",
  lastPageLabel: "1",
  emptyText: "No users found. Try changing your filters.",
  actions: ["view", "edit", "more"],
  tableMinWidth: 1280,
  columns: [
    { key: "userName", label: "User", format: "person" },
    { key: "role", label: "Role", badge: "category" },
    { key: "email", label: "Email / Mobile", secondaryKey: "mobile" },
    { key: "status", label: "Status", badge: "status" },
    { key: "lastLogin", label: "Last Login" },
    { key: "createdOn", label: "Created On" }
  ]
};

export const roleTableConfig = {
  tableTitle: "All Roles",
  totalCount: 12,
  totalLabel: "12",
  lastPageLabel: "2",
  emptyText: "No roles found. Try changing your filters.",
  actions: ["view", "edit", "more"],
  tableMinWidth: 1180,
  columns: [
    { key: "roleName", label: "Role Name", badge: "category" },
    { key: "description", label: "Description", truncate: true },
    { key: "usersCount", label: "Users Count" },
    { key: "permissions", label: "Permissions" },
    { key: "status", label: "Status", badge: "status" },
    { key: "createdOn", label: "Created On" }
  ]
};

export const userFormConfig = {
  breadcrumb: "User",
  addLabel: "Add New User",
  saveLabel: "Save User",
  formFields: [
    { key: "userName", label: "Full Name", required: true },
    { key: "email", label: "Email", required: true },
    { key: "mobile", label: "Mobile Number", required: true },
    { key: "role", label: "Role", type: "select", options: ["Super Admin", "Admin", "Editor", "Receptionist", "Technician", "Doctor", "Support", "Billing", "Marketing", "Accountant", "Verifier"], required: true },
    { key: "password", label: "Password" },
    { key: "confirmPassword", label: "Confirm Password" },
    { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true },
    { key: "permissions", label: "Permissions optional", type: "textarea" }
  ]
};

export const roleFormConfig = {
  breadcrumb: "Role",
  addLabel: "Add New Role",
  saveLabel: "Save Role",
  formFields: [
    { key: "roleName", label: "Role Name", required: true },
    { key: "description", label: "Description", type: "textarea", required: true },
    { key: "permissions", label: "Permissions checklist", type: "textarea", required: true },
    { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true }
  ]
};

export const userRoleBottom = {
  donut: {
    title: "Users by Role",
    chart: "bg-[conic-gradient(#94a3b8_0_100%)]",
    segments: [{ label: "No Users", value: "0 (0.0%)", color: "bg-slate-400" }]
  },
  recent: [],
  actions: ["Add New User", "Add New Role", "Manage Permissions", "User Activity Logs", "Role Management"]
};

export const securityStats = [
  { title: "Active Sessions", value: "42", text: "Currently logged in", icon: "user", color: "green" },
  { title: "Failed Logins", value: "12", text: "Last 24 hours", icon: "x", color: "orange", tone: "red" },
  { title: "Two-Factor Enabled", value: "86", text: "55.1% of users", icon: "shield", color: "purple" },
  { title: "Blocked IPs", value: "8", text: "Security rules", icon: "lock", color: "blue" }
];

export const securityPolicies = [
  { id: 1, title: "Two-Factor Authentication", description: "Require 2FA for admin users", value: "ON", enabled: true },
  { id: 2, title: "Password Expiry", description: "Force password reset every 90 days", value: "90 Days" },
  { id: 3, title: "Login Attempt Limit", description: "Block account after failed login attempts", value: "5 Attempts" },
  { id: 4, title: "Session Timeout", description: "Auto logout inactive admin users", value: "30 Minutes" },
  { id: 5, title: "IP Whitelist", description: "Allow admin access only from approved IPs", value: "OFF", enabled: false },
  { id: 6, title: "Device Verification", description: "Verify new device login via email/OTP", value: "ON", enabled: true }
];

export const accessLogRows = [
];

export const blockedIpRows = [
  { id: 1, ipAddress: "192.168.1.50", reason: "Multiple failed login attempts", blockedOn: "May 22, 2025 08:30 AM", blockedBy: "System", status: "Blocked" },
  { id: 2, ipAddress: "192.168.1.77", reason: "Suspicious activity detected", blockedOn: "May 21, 2025 07:15 PM", blockedBy: "System", status: "Blocked" },
  { id: 3, ipAddress: "192.168.1.90", reason: "Unauthorized API access", blockedOn: "May 20, 2025 11:05 AM", blockedBy: "System", status: "Blocked" }
];

export const accessLogConfig = {
  tableTitle: "Recent Security Access Logs",
  showTableCount: false,
  totalCount: 5,
  totalLabel: "5",
  lastPageLabel: "1",
  emptyText: "No access logs found.",
  actions: [],
  tableMinWidth: 1280,
  columns: [
    { key: "user", label: "User", format: "person" },
    { key: "role", label: "Role", badge: "category" },
    { key: "action", label: "Action", badge: "status" },
    { key: "ipAddress", label: "IP Address" },
    { key: "device", label: "Device" },
    { key: "location", label: "Location" },
    { key: "dateTime", label: "Date & Time" },
    { key: "status", label: "Status", badge: "status" }
  ]
};

export const blockedIpConfig = {
  tableTitle: "Blocked IP Addresses",
  showTableCount: false,
  totalCount: 3,
  totalLabel: "3",
  lastPageLabel: "1",
  emptyText: "No blocked IP addresses found.",
  actions: ["view", "more"],
  tableMinWidth: 980,
  columns: [
    { key: "ipAddress", label: "IP Address", link: true },
    { key: "reason", label: "Reason", truncate: true },
    { key: "blockedOn", label: "Blocked On" },
    { key: "blockedBy", label: "Blocked By" },
    { key: "status", label: "Status", badge: "status" }
  ]
};

export const backupStats = [
  { title: "Total Backups", value: "128", text: "All time", icon: "database", color: "green" },
  { title: "Successful Backups", value: "116", text: "90.63% of total", icon: "file", color: "blue", tone: "green" },
  { title: "Failed Backups", value: "6", text: "4.69% of total", icon: "warning", color: "orange", tone: "red" },
  { title: "Scheduled Backups", value: "6", text: "Active schedules", icon: "clock", color: "purple" }
];

export const backupFilters = [
  { key: "query", label: "Search backup", type: "search", placeholder: "Search backup by name or type..." },
  { key: "type", label: "Type", type: "select", defaultValue: "All Types", options: ["All Types", "Automatic", "Manual"] },
  { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Success", "Failed", "Scheduled", "Restored"] },
  { key: "backupDateTime", label: "Date Range", type: "date", placeholder: "Select Date Range" }
];

export const backupRows = [
  { id: 1, backupName: "Daily Backup - May 22, 2025", backupNote: "System Backup", type: "Automatic", status: "Success", fileSize: "1.24 GB", backupDateTime: "May 22, 2025 02:30 AM", createdBy: "System" },
  { id: 2, backupName: "Manual Backup - May 21, 2025", backupNote: "Manual Backup", type: "Manual", status: "Success", fileSize: "1.18 GB", backupDateTime: "May 21, 2025 11:45 AM", createdBy: "Admin User" },
  { id: 3, backupName: "Daily Backup - May 21, 2025", backupNote: "System Backup", type: "Automatic", status: "Success", fileSize: "1.16 GB", backupDateTime: "May 21, 2025 02:30 AM", createdBy: "System" },
  { id: 4, backupName: "Weekly Backup - May 18, 2025", backupNote: "System Backup", type: "Automatic", status: "Success", fileSize: "1.32 GB", backupDateTime: "May 18, 2025 02:30 AM", createdBy: "System" },
  { id: 5, backupName: "Manual Backup - May 17, 2025", backupNote: "Manual Backup", type: "Manual", status: "Failed", fileSize: "-", backupDateTime: "May 17, 2025 10:20 AM", createdBy: "Admin User" },
  { id: 6, backupName: "Daily Backup - May 17, 2025", backupNote: "System Backup", type: "Automatic", status: "Success", fileSize: "1.10 GB", backupDateTime: "May 17, 2025 02:30 AM", createdBy: "System" },
  { id: 7, backupName: "Daily Backup - May 16, 2025", backupNote: "System Backup", type: "Automatic", status: "Success", fileSize: "1.09 GB", backupDateTime: "May 16, 2025 02:30 AM", createdBy: "System" },
  { id: 8, backupName: "Manual Backup - May 15, 2025", backupNote: "Manual Backup", type: "Manual", status: "Success", fileSize: "1.05 GB", backupDateTime: "May 15, 2025 04:15 PM", createdBy: "Admin User" },
  { id: 9, backupName: "Daily Backup - May 15, 2025", backupNote: "System Backup", type: "Automatic", status: "Success", fileSize: "1.07 GB", backupDateTime: "May 15, 2025 02:30 AM", createdBy: "System" },
  { id: 10, backupName: "Daily Backup - May 14, 2025", backupNote: "System Backup", type: "Automatic", status: "Success", fileSize: "1.08 GB", backupDateTime: "May 14, 2025 02:30 AM", createdBy: "System" }
];

export const scheduledBackupRows = [
  { id: 1, backupName: "Daily Backup", backupNote: "Every day at 02:30 AM", type: "Automatic", status: "Scheduled", fileSize: "Estimated 1.2 GB", backupDateTime: "May 23, 2025 02:30 AM", createdBy: "System" },
  { id: 2, backupName: "Weekly Backup", backupNote: "Every Sunday at 02:30 AM", type: "Automatic", status: "Scheduled", fileSize: "Estimated 1.3 GB", backupDateTime: "May 25, 2025 02:30 AM", createdBy: "System" },
  { id: 3, backupName: "Monthly Backup", backupNote: "First day of every month", type: "Automatic", status: "Scheduled", fileSize: "Estimated 1.5 GB", backupDateTime: "Jun 01, 2025 02:30 AM", createdBy: "System" }
];

export const restoreHistoryRows = [
  { id: 1, backupName: "Restore - Daily Backup May 18", backupNote: "Restored selected database tables", type: "Manual", status: "Restored", fileSize: "1.32 GB", backupDateTime: "May 18, 2025 10:30 AM", createdBy: "Admin User" },
  { id: 2, backupName: "Restore - Manual Backup May 10", backupNote: "Full system restore", type: "Manual", status: "Success", fileSize: "1.20 GB", backupDateTime: "May 10, 2025 06:15 PM", createdBy: "Admin User" }
];

export const backupTableConfig = {
  tableTitle: "All Backups",
  totalCount: 128,
  totalLabel: "128",
  lastPageLabel: "13",
  emptyText: "No backups found. Try changing your filters.",
  actions: ["download", "more"],
  tableMinWidth: 1150,
  columns: [
    { key: "backupName", label: "Backup Name", secondaryKey: "backupNote" },
    { key: "type", label: "Type", badge: "category" },
    { key: "status", label: "Status", badge: "status" },
    { key: "fileSize", label: "File Size" },
    { key: "backupDateTime", label: "Backup Date & Time" },
    { key: "createdBy", label: "Created By" }
  ]
};

export const backupSettingsRows = [
  { id: 1, backupName: "Auto Backup", backupNote: "Create backup automatically every day", type: "Automatic", status: "Active", fileSize: "Enabled", backupDateTime: "02:30 AM daily", createdBy: "System" },
  { id: 2, backupName: "Retention Period", backupNote: "Keep backup files for recovery", type: "Manual", status: "Active", fileSize: "365 Days", backupDateTime: "Always on", createdBy: "Admin User" },
  { id: 3, backupName: "Encrypted Storage", backupNote: "Encrypt backup files before storing", type: "Automatic", status: "Active", fileSize: "AES-256", backupDateTime: "All backups", createdBy: "System" }
];

export const backupSideCards = {
  summary: {
    title: "Backup Summary",
    chart: "bg-[conic-gradient(#099447_0_90.63%,#ec1f34_90.63%_95.32%,#94a3b8_95.32%_100%)]",
    footer: "Total Backups: 128",
    segments: [
      { label: "Successful", value: "116 (90.63%)", color: "bg-upchar-green" },
      { label: "Failed", value: "6 (4.69%)", color: "bg-upchar-red" },
      { label: "Skipped", value: "6 (4.69%)", color: "bg-slate-400" }
    ]
  },
  quickActions: ["Create Manual Backup", "Restore Backup", "Backup Settings", "View Backup Logs"]
};

export const systemSettingCards = [
  { title: "General Settings", text: "Manage basic system information and preferences.", count: "12 Settings", icon: "settings", color: "bg-green-50 text-upchar-green" },
  { title: "Site Settings", text: "Configure website details, SEO and site appearance.", count: "8 Settings", icon: "globe", color: "bg-blue-50 text-upchar-blue" },
  { title: "Payment Settings", text: "Manage payment methods, wallet and transaction settings.", count: "6 Settings", icon: "card", color: "bg-violet-50 text-upchar-purple" },
  { title: "Notification Settings", text: "Configure email, SMS, WhatsApp and push notifications.", count: "9 Settings", icon: "bell", color: "bg-orange-50 text-upchar-orange" },
  { title: "Security Settings", text: "Manage system security and session settings.", count: "7 Settings", icon: "shield", color: "bg-red-50 text-upchar-red" }
];

export const generalSettingsRows = [
  { id: 1, key: "System Name", description: "Set the name of your system.", value: "Upchar Pathology Lab" },
  { id: 2, key: "System Email", description: "Set the default system email address.", value: "info@upcharlab.com" },
  { id: 3, key: "System Phone", description: "Set the default system phone number.", value: "+91 98765 43210" },
  { id: 4, key: "Timezone", description: "Set the default timezone for the system.", value: "(UTC+05:30) Asia/Kolkata" },
  { id: 5, key: "Date Format", description: "Set the default date format.", value: "May 22, 2025 (DD MMM, YYYY)" },
  { id: 6, key: "Currency", description: "Set the default currency.", value: "INR (Rs.) - Indian Rupee" },
  { id: 7, key: "Default Language", description: "Set the default system language.", value: "English" },
  { id: 8, key: "Invoice Prefix", description: "Set the prefix for invoice numbers.", value: "INV-" },
  { id: 9, key: "Maintenance Mode", description: "Enable or disable the maintenance mode.", value: "Disabled", toggle: false },
  { id: 10, key: "Data Retention (Days)", description: "Set how many days to keep system logs.", value: "365 Days" },
  { id: 11, key: "Auto Backup", description: "Enable or disable automatic system backup.", value: "Enabled", toggle: true },
  { id: 12, key: "System Version", description: "Current installed system version.", value: "v2.4.1 (Latest)", badge: "Up to date" }
];

export const systemQuickActions = ["Clear System Cache", "Optimize Database", "View System Logs", "System Health Check", "Backup Now", "System Update"];

export const systemInfoRows = [
  ["System Environment", "Production"],
  ["Server Time", "May 22, 2025 10:30:45 AM"],
  ["PHP Version", "8.2.12"],
  ["Database Version", "MySQL 8.0.36"],
  ["Web Server", "Apache/2.4.58"],
  ["Total Users", "156"],
  ["Total Tests", "2,458"],
  ["Total Bookings", "1,245"],
  ["Total Revenue", "Rs. 12,45,890.50"]
];
