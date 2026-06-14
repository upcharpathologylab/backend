import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronDown, Filter, Search } from "lucide-react";
import AccountLayout from "../components/account/AccountLayout.jsx";
import AccountToast from "../components/account/AccountToast.jsx";
import { AccountEmptyState, AccountLoadingState, AccountSyncNotice } from "../components/account/AccountState.jsx";
import HeroIllustration from "../components/account/HeroIllustration.jsx";
import ReportActions from "../components/account/reports/ReportActions.jsx";
import ReportsTable from "../components/account/reports/ReportsTable.jsx";
import SummaryCard from "../components/account/SummaryCard.jsx";
import TabFilterBar from "../components/account/TabFilterBar.jsx";
import TrustStrip from "../components/account/TrustStrip.jsx";
import { assetUrl, getUserReports } from "../api/api.js";
import useAccountResource from "../hooks/useAccountResource.js";

const reportTabs = ["All Reports", "Available", "Report Pending"];

function AccountReportsPage() {
  const [activeTab, setActiveTab] = useState(reportTabs[0]);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const { data: reports, loading, error } = useAccountResource(getUserReports, [], []);

  useEffect(() => {
    document.title = "Reports | Upchar Pathology";
  }, []);

  const filteredReports = useMemo(() => {
    const tabFiltered = activeTab.startsWith("Available")
      ? reports.filter((item) => item.status === "Available")
      : activeTab.startsWith("Report Pending")
        ? reports.filter((item) => item.status !== "Available")
        : reports;
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return tabFiltered;
    return tabFiltered.filter((item) => `${item.title} ${item.bookingId}`.toLowerCase().includes(normalizedQuery));
  }, [activeTab, query, reports]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const reportsSummaryCards = useMemo(() => {
    const available = reports.filter((item) => item.status === "Available").length;
    const pending = reports.length - available;
    return [
      { title: "Total Reports", value: String(reports.length), icon: "FileText", color: "blue" },
      { title: "Available", value: String(available), icon: "CloudDownload", color: "green" },
      { title: "Report Pending", value: String(pending), icon: "Clock3", color: "orange" },
      { title: "Verified Reports", value: String(available), icon: "BadgeCheck", color: "purple" }
    ];
  }, [reports]);

  const handleReportAction = (row) => {
    if (!row.reportFile) {
      showToast("Report pending.");
      return;
    }
    window.open(assetUrl(row.reportFile), "_blank", "noopener,noreferrer");
    showToast(`Report opened for ${row.title}.`);
  };

  return (
    <AccountLayout
      active="reports"
      breadcrumbCurrent="Reports"
      title="Reports"
      subtitle="View and download your test reports (PDF)"
      actions={<HeroIllustration type="reports" />}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportsSummaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <AccountSyncNotice message={error} />

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <section className="min-w-0 rounded-lg border border-blue-100 bg-white p-4 shadow-sm lg:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_250px_150px]">
            <label className="flex h-12 items-center gap-3 rounded-md border border-blue-100 px-4">
              <Search className="h-5 w-5 text-upchar-blue" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-navy-900 outline-none placeholder:text-navy-400"
                placeholder="Search by test name or booking ID..."
              />
            </label>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-3 rounded-md border border-blue-100 px-4 text-sm font-black text-navy-800 hover:bg-blue-50">
              <CalendarDays className="h-5 w-5 text-upchar-blue" />
              Select Date Range
              <ChevronDown className="h-4 w-4" />
            </button>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-3 rounded-md border border-blue-100 px-4 text-sm font-black text-upchar-blue hover:bg-blue-50">
              <Filter className="h-5 w-5" />
              Filter
            </button>
          </div>

          <div className="mt-5">
            <TabFilterBar tabs={reportTabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="mt-5">
            {loading ? (
              <AccountLoadingState />
            ) : filteredReports.length ? (
              <ReportsTable rows={filteredReports} onAction={handleReportAction} />
            ) : (
              <AccountEmptyState title="No reports found" text="Try another search or filter." />
            )}
          </div>
        </section>

        <ReportActions onAction={(label) => showToast(`${label} selected.`)} />
      </div>

      <TrustStrip />
      <AccountToast message={toast} />
    </AccountLayout>
  );
}

export default AccountReportsPage;
