import { useEffect, useState } from "react";
import { CalendarPlus, ChevronDown, Download } from "lucide-react";
import { Link } from "react-router-dom";
import AccountLayout from "../components/account/AccountLayout.jsx";
import AccountToast from "../components/account/AccountToast.jsx";
import { AccountEmptyState, AccountLoadingState, AccountSyncNotice } from "../components/account/AccountState.jsx";
import AppointmentCard from "../components/account/appointments/AppointmentCard.jsx";
import AppointmentTable from "../components/account/appointments/AppointmentTable.jsx";
import QuickActions from "../components/account/QuickActions.jsx";
import StatusBadge from "../components/account/StatusBadge.jsx";
import SummaryCard from "../components/account/SummaryCard.jsx";
import TabFilterBar from "../components/account/TabFilterBar.jsx";
import TrustStrip from "../components/account/TrustStrip.jsx";
import { getUserAppointments } from "../api/api.js";
import {
  appointmentRows,
  appointmentSummaryCards,
  cancelledAppointments,
  completedAppointments,
  upcomingAppointments
} from "../data/accountPagesData.js";
import useAccountResource from "../hooks/useAccountResource.js";

const appointmentFallback = {
  upcoming: upcomingAppointments,
  rows: appointmentRows,
  completed: completedAppointments,
  cancelled: cancelledAppointments
};

const appointmentTabs = ["Upcoming (3)", "Completed (8)", "Cancelled (1)"];

function CompactTable({ title, rows, columns, actionLabel, onAction }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className={`text-xl font-black ${title.startsWith("Cancelled") ? "text-upchar-red" : "text-navy-900"}`}>{title}</h2>
        <button type="button" className="rounded-md border border-blue-100 px-4 py-2 text-sm font-black text-upchar-blue hover:bg-blue-50">View All</button>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-blue-50/50 text-xs font-black text-navy-800">
            <tr>
              {columns.map((column) => <th className="px-4 py-3" key={column}>{column}</th>)}
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 font-semibold text-navy-700">
            {rows.map((row) => (
              <tr key={`${row.id}-${row.appointment}`}>
                <td className="px-4 py-4 font-black text-navy-900">{row.appointment}<span className="block text-xs font-semibold text-upchar-blue">{row.id}</span></td>
                {"member" in row ? <td className="px-4 py-4">{row.member}<StatusBadge label={row.relation} color="green" /></td> : null}
                <td className="px-4 py-4">{row.date}</td>
                {"status" in row ? <td className="px-4 py-4"><StatusBadge label={row.status} color={row.status === "Downloaded" ? "blue" : "green"} /></td> : null}
                {"cancellationDate" in row ? <td className="px-4 py-4">{row.cancellationDate}</td> : null}
                {"reason" in row ? <td className="px-4 py-4">{row.reason}</td> : null}
                <td className="px-4 py-4">
                  <button type="button" className="rounded-md border border-blue-100 px-3 py-2 text-xs font-black text-upchar-blue hover:bg-blue-50" onClick={() => onAction(row)}>
                    {actionLabel}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AccountAppointmentsPage() {
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState(appointmentTabs[0]);
  const { data, loading, error } = useAccountResource(getUserAppointments, appointmentFallback, []);

  useEffect(() => {
    document.title = "Appointments | Upchar Pathology";
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  return (
    <AccountLayout
      active="appointments"
      breadcrumbCurrent="Appointments"
      title="Appointments"
      subtitle="Manage your upcoming, completed, and cancelled appointments."
      actions={
        <>
          <button type="button" className="inline-flex h-12 items-center gap-3 rounded-lg border border-blue-100 bg-white px-5 text-sm font-black text-upchar-blue shadow-sm hover:bg-blue-50" onClick={() => showToast("Schedule download started.")}>
            <Download className="h-5 w-5" />
            Download Schedule
          </button>
          <Link to="/tests" className="inline-flex h-12 items-center gap-3 rounded-lg bg-upchar-blue px-5 text-sm font-black text-white shadow-lg shadow-blue-900/15 hover:bg-navy-800">
            <CalendarPlus className="h-5 w-5" />
            Book New Test
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {appointmentSummaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <AccountSyncNotice message={error} />

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
        <h2 className="text-xl font-black text-navy-900">Upcoming Appointments</h2>
        <div className="mt-5 grid gap-4">
          {loading ? (
            <AccountLoadingState />
          ) : data.upcoming?.length ? (
            data.upcoming.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onAction={(action) => showToast(`${action} selected.`)} />
            ))
          ) : (
            <AccountEmptyState title="No upcoming appointments" text="Book a test to see upcoming appointments here." />
          )}
        </div>
        <button type="button" className="mx-auto mt-5 flex h-11 w-full max-w-sm items-center justify-center rounded-md border border-blue-100 px-5 text-sm font-black text-upchar-blue hover:bg-blue-50">
          View All Upcoming Appointments
        </button>
      </section>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
        <TabFilterBar
          tabs={appointmentTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          rightControl={
            <button type="button" className="inline-flex h-11 items-center gap-3 rounded-md border border-blue-100 px-4 text-sm font-black text-navy-800 hover:bg-blue-50">
              All Time
              <ChevronDown className="h-4 w-4" />
            </button>
          }
        />
        <div className="mt-5">
          {loading ? (
            <AccountLoadingState />
          ) : data.rows?.length ? (
            <AppointmentTable rows={data.rows} onAction={() => showToast("Appointment details opened.")} />
          ) : (
            <AccountEmptyState title="No appointments found" text="Try another filter." />
          )}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <CompactTable title="Completed Appointments" rows={data.completed || []} columns={["Appointment", "Family Member", "Date", "Report Status"]} actionLabel="Download" onAction={() => showToast("Report download started.")} />
        <CompactTable title="Cancelled Appointments" rows={data.cancelled || []} columns={["Appointment", "Date", "Cancellation Date", "Reason"]} actionLabel="Book Again" onAction={() => showToast("Booking flow opened.")} />
      </div>

      <QuickActions
        actions={[
          { title: "Book New Test", subtitle: "Book health tests", icon: "FileCheck2", href: "/tests" },
          { title: "View Reports", subtitle: "Access your reports", icon: "ClipboardList", href: "/my-account/reports" },
          { title: "View Bookings", subtitle: "Check your bookings", icon: "HeartPulse", href: "/my-account/bookings" },
          { title: "Contact Support", subtitle: "Get help anytime", icon: "Headphones", href: "/my-account/help-support" }
        ]}
      />
      <TrustStrip />
      <AccountToast message={toast} />
    </AccountLayout>
  );
}

export default AccountAppointmentsPage;
