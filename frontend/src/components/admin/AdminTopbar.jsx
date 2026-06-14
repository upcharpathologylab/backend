import { useEffect, useMemo, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdminNotifications, markAdminNotificationRead } from "../../api/api.js";
import AdminDateFilter from "./AdminDateFilter.jsx";
import { clearAdminAuthSession, getStoredAdminUser } from "../auth/authStorage.js";

function AdminTopbar({ onMenuClick, title = "Dashboard", badge = "Admin Panel" }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const adminUser = getStoredAdminUser();
  const initials = useMemo(() => {
    const name = adminUser?.fullName || adminUser?.username || "Admin User";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "AU";
  }, [adminUser]);

  const logout = () => {
    clearAdminAuthSession();
    navigate("/admin/login", { replace: true });
  };

  const loadNotifications = () => {
    getAdminNotifications()
      .then((data) => {
        setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
        setUnreadCount(Number(data?.unreadCount || 0));
      })
      .catch(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const openNotification = async (notification) => {
    if (!notification.read) {
      setNotifications((current) => current.map((item) => (item.eventKey === notification.eventKey ? { ...item, read: true } : item)));
      setUnreadCount((current) => Math.max(0, current - 1));
      try {
        await markAdminNotificationRead(notification.eventKey);
      } catch {
        loadNotifications();
      }
    }
    if (notification.href) navigate(notification.href);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="flex min-h-[92px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <button type="button" className="rounded-md p-2 text-navy-900 transition hover:bg-blue-50 lg:hidden" onClick={onMenuClick} aria-label="Open sidebar">
            <Menu className="h-7 w-7" />
          </button>
          {title ? (
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <h1 className="min-w-0 truncate text-xl font-black text-navy-950 sm:text-2xl">{title}</h1>
              {badge ? <span className="hidden shrink-0 rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-navy-700 sm:inline-flex">{badge}</span> : null}
            </div>
          ) : null}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <AdminDateFilter compact buttonClassName="inline-flex h-11 min-w-[260px] items-center justify-between gap-3 rounded-lg border border-blue-100 bg-white px-4 text-sm font-black text-navy-900 shadow-sm" />
          <div className="relative">
            <button type="button" className="relative rounded-full p-2 text-navy-900 transition hover:bg-blue-50" aria-label="Notifications" onClick={() => setNotificationsOpen((current) => !current)}>
              <Bell className="h-6 w-6" />
              {unreadCount > 0 ? (
                <span className="absolute right-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-upchar-red px-1 text-[10px] font-black text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : null}
            </button>
            {notificationsOpen ? (
              <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-soft">
                <div className="flex items-center justify-between border-b border-blue-100 px-4 py-3">
                  <span className="text-sm font-black text-navy-950">Notifications</span>
                  <span className="text-xs font-black text-upchar-blue">{unreadCount} unread</span>
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  {notifications.length ? (
                    notifications.map((notification) => (
                      <button
                        key={notification.eventKey}
                        type="button"
                        onClick={() => openNotification(notification)}
                        className={`flex w-full gap-3 border-b border-blue-50 px-4 py-3 text-left transition hover:bg-blue-50 ${notification.read ? "bg-white" : "bg-green-50/50"}`}
                      >
                        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.read ? "bg-slate-300" : "bg-upchar-green"}`} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black text-navy-950">{notification.title}</span>
                          <span className="mt-1 block text-xs font-semibold leading-5 text-navy-700">{notification.message}</span>
                          <span className="mt-1 block text-[11px] font-black text-navy-500">{notification.timestamp}</span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm font-black text-navy-500">No notifications yet.</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className="relative">
            <button type="button" className="flex items-center gap-3" onClick={() => setMenuOpen((current) => !current)}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-950 text-sm font-black text-white">{initials}</span>
              <span className="text-left">
                <span className="block text-sm font-black text-navy-950">{adminUser?.fullName || "Admin User"}</span>
                <span className="block text-xs font-semibold text-navy-500">{adminUser?.adminRole || "Admin"}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-navy-700" />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-14 z-50 w-44 rounded-lg border border-blue-100 bg-white p-2 shadow-soft">
                <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-black text-upchar-red transition hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
