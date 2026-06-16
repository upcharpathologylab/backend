import { useEffect, useMemo, useState } from "react";
import { getAdminDashboard } from "../api/api.js";
import { useAdminDateRange } from "../components/admin/AdminDateFilter.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import AdminMetricCard from "../components/admin/AdminMetricCard.jsx";
import AdminQuickActions from "../components/admin/AdminQuickActions.jsx";
import BookingOverviewChart from "../components/admin/BookingOverviewChart.jsx";
import OrdersStatusChart from "../components/admin/OrdersStatusChart.jsx";
import RecentOrdersTable from "../components/admin/RecentOrdersTable.jsx";
import SampleCollectionSummary from "../components/admin/SampleCollectionSummary.jsx";
import SystemAlerts from "../components/admin/SystemAlerts.jsx";
import TopLabsTable from "../components/admin/TopLabsTable.jsx";

const metricConfig = [
  { key: "totalBookings", title: "Total Bookings", icon: "calendar", color: "blue" },
  { key: "totalOrders", title: "Total Orders", icon: "clipboard", color: "green" },
  { key: "testsConducted", title: "Tests Conducted", icon: "flask", color: "purple" },
  { key: "totalRevenue", title: "Total Revenue", icon: "rupee", color: "orange", currency: true },
  { key: "reportsGenerated", title: "Reports Generated", icon: "report", color: "cyan" },
  { key: "pendingOrders", title: "Pending Orders", icon: "clock", color: "red" }
];

const statusColors = {
  Completed: "#17c77d",
  "In Progress": "#1677ff",
  Pending: "#ff9f0a",
  Cancelled: "#ef3349"
};

const sampleConfig = [
  ["totalCollected", "Total Collected"],
  ["collectedToday", "Collected Today"],
  ["inTransit", "In Transit"],
  ["receivedAtLab", "Received at Lab"]
];

const emptySummary = {
  stats: {},
  statTrends: {},
  bookingOverview: { labels: [], thisWeek: [], lastWeek: [] },
  ordersByStatus: [],
  topPerformingLabs: [],
  recentOrders: [],
  sampleCollectionSummary: {},
  systemAlerts: []
};

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0));

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const growthText = (trend) => `${trend?.percent || "0.0"}% vs last week`;

const dashboardView = (summary = emptySummary) => ({
  metrics: metricConfig.map((metric) => ({
    title: metric.title,
    value: metric.currency ? formatCurrency(summary.stats?.[metric.key]) : formatNumber(summary.stats?.[metric.key]),
    growth: growthText(summary.statTrends?.[metric.key]),
    trend: summary.statTrends?.[metric.key]?.trend || "up",
    icon: metric.icon,
    color: metric.color
  })),
  bookingOverview: summary.bookingOverview || emptySummary.bookingOverview,
  orderStatus: (summary.ordersByStatus || []).map((item) => ({
    label: item.label,
    value: Number(item.value || 0),
    percent: item.percent || "0.0%",
    color: statusColors[item.label] || "#1677ff"
  })),
  laboratories: summary.topPerformingLabs || [],
  recentOrders: summary.recentOrders || [],
  sampleCollection: sampleConfig.map(([key, title]) => ({
    title,
    value: formatNumber(summary.sampleCollectionSummary?.[key]),
    change: "0.0%",
    trend: "up"
  })),
  alerts: summary.systemAlerts || []
});

function AdminDashboardPage() {
  const adminDateRange = useAdminDateRange();
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dashboard = useMemo(() => dashboardView(summary), [summary]);

  useEffect(() => {
    document.title = "Admin Dashboard | Upchar Pathology Lab";
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    getAdminDashboard({ startDate: adminDateRange.range.startDate, endDate: adminDateRange.range.endDate })
      .then((data) => {
        if (mounted) setSummary({ ...emptySummary, ...data });
      })
      .catch((requestError) => {
        if (!mounted) return;
        setSummary(emptySummary);
        setError(requestError?.response?.data?.message || "Could not load dashboard data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [adminDateRange.range.endDate, adminDateRange.range.startDate]);

  return (
    <AdminLayout>
      {loading || error ? (
        <div className={`mb-5 rounded-lg border px-5 py-3 text-sm font-black ${error ? "border-red-100 bg-red-50 text-upchar-red" : "border-blue-100 bg-white text-navy-700"}`}>
          {error || "Loading dashboard data..."}
        </div>
      ) : null}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {dashboard.metrics.map((metric) => (
          <AdminMetricCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.88fr_1.05fr]">
        <BookingOverviewChart data={dashboard.bookingOverview} />
        <OrdersStatusChart items={dashboard.orderStatus} />
        <TopLabsTable labs={dashboard.laboratories} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.7fr]">
        <RecentOrdersTable orders={dashboard.recentOrders} />
        <div className="grid content-start gap-6">
          <SampleCollectionSummary items={dashboard.sampleCollection} />
          <SystemAlerts alerts={dashboard.alerts} />
        </div>
      </section>

      <div className="mt-6">
        <AdminQuickActions />
      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;
