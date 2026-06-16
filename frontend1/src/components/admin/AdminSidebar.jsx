import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Bell,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  DatabaseBackup,
  FileText,
  FlaskConical,
  Gift,
  HelpCircle,
  Image,
  KeyRound,
  Layers3,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  ReceiptText,
  Settings,
  Star,
  TicketPercent,
  Truck,
  UserRoundCog,
  UsersRound,
  WalletCards,
  X
} from "lucide-react";
import { getStoredAdminUser } from "../auth/authStorage.js";
import { getAdminPageForPath, hasAdminPermission } from "../../utils/adminPermissions.js";

const sections = [
  {
    label: "Main",
    items: [{ label: "Dashboard", icon: LayoutDashboard, to: "/admin" }]
  },
  {
    label: "Manage",
    items: [
      { label: "Manage Tests", icon: FlaskConical, to: "/admin/tests" },
      { label: "Manage Packages", icon: Gift, to: "/admin/packages" },
      { label: "Test Categories", icon: Layers3, to: "/admin/test-categories" },
      { label: "Coupons / Offers", icon: TicketPercent, to: "/admin/coupons-offers" }
    ]
  },
  {
    label: "Orders & Bookings",
    items: [
      { label: "Bookings", icon: CalendarCheck, to: "/admin/bookings" },
      { label: "Booking Status", icon: ClipboardList, to: "/admin/booking-status" },
      { label: "Assign Sample Collector", icon: Truck, to: "/admin/assign-sample-collector" },
      { label: "Sample Collection Points", icon: MapPin, to: "/admin/sample-collection-points" }
    ]
  },
  {
    label: "Management",
    items: [
      { label: "Customers", icon: UsersRound, to: "/admin/customers" },
      { label: "Prescription Management", icon: FileText, to: "/admin/prescriptions" },
      { label: "Payment Management", icon: WalletCards, to: "/admin/payments" },
      { label: "Invoice Management", icon: ReceiptText, to: "/admin/invoices" }
    ]
  },
  {
    label: "Content & Settings",
    items: [
      { label: "Content / Pages", icon: BookOpen, to: "/admin/content-pages" },
      { label: "Manage Blog", icon: FileText, to: "/admin/blogs" },
      { label: "Homepage Banners", icon: Image, to: "/admin/homepage-banners" },
      { label: "Testimonials", icon: Star, to: "/admin/testimonials" },
      { label: "FAQs", icon: HelpCircle, page: "Content" },
      { label: "Service Locations", icon: MapPin, to: "/admin/service-locations" },
      { label: "Notifications", icon: Bell, page: "Dashboard" },
      { label: "Activity Logs", icon: Activity, to: "/admin/activity-logs" }
    ]
  },
  {
    label: "System",
    items: [
      { label: "Users & Roles", icon: UserRoundCog, to: "/admin/users-roles" },
      { label: "Security & Access", icon: KeyRound, to: "/admin/security-access" },
      { label: "Data Backup", icon: DatabaseBackup, to: "/admin/backup-management" },
      { label: "System Settings", icon: Settings, to: "/admin/system-settings" }
    ]
  }
];

function AdminSidebar({ open, onClose }) {
  const location = useLocation();
  const adminUser = getStoredAdminUser();

  const isActiveItem = (item) => {
    if (!item.to) return false;
    if (item.to === "/admin") return location.pathname === "/admin";
    return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-navy-950 text-white shadow-soft transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-[92px] items-center justify-between border-b border-white/10 px-5">
        <Link to="/admin" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-upchar-green">
            <FlaskConical className="h-8 w-8" />
          </span>
          <span>
            <span className="block text-3xl font-black leading-7">Upchar</span>
            <span className="block text-sm font-black uppercase tracking-wide text-upchar-green">Pathology Lab</span>
          </span>
        </Link>
        <button type="button" className="rounded-md p-2 text-white lg:hidden" onClick={onClose} aria-label="Close sidebar">
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {sections.map((section) => {
          const visibleItems = section.items.filter((item) => hasAdminPermission(adminUser, item.page || getAdminPageForPath(item.to), "view"));
          if (!visibleItems.length) return null;
          return (
          <div className="mb-6" key={section.label}>
            <p className="mb-2 px-3 text-xs font-black uppercase tracking-wide text-blue-100/80">{section.label}</p>
            <div className="grid gap-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = isActiveItem(item);
                const className = `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition ${
                  active ? "bg-gradient-to-r from-upchar-green to-teal-500 text-white shadow-lg shadow-green-950/20" : "text-blue-50 hover:bg-white/10"
                }`;

                if (item.to) {
                  return (
                    <Link to={item.to} className={className} key={item.label} onClick={() => onClose?.()}>
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <a href="#" className={className} key={item.label}>
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
          );
        })}
      </nav>

      <div className="p-3">
        <a href="#" className="flex items-center gap-3 rounded-md bg-gradient-to-r from-teal-600 to-upchar-green px-4 py-4 text-sm font-black text-white">
          <MessageCircle className="h-6 w-6" />
          Need Help?
        </a>
      </div>
    </aside>
  );
}

export default AdminSidebar;
