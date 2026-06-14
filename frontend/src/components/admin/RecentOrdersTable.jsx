import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { price } from "../../utils.js";

const statusClass = {
  Completed: "bg-green-50 text-upchar-green",
  Generated: "bg-green-50 text-upchar-green",
  "In Progress": "bg-blue-50 text-upchar-blue",
  Pending: "bg-orange-50 text-upchar-orange"
};

function Badge({ label }) {
  return <span className={`inline-flex rounded-md px-3 py-1 text-xs font-black ${statusClass[label] || "bg-blue-50 text-navy-800"}`}>{label}</span>;
}

function RecentOrdersTable({ orders }) {
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <section className="min-w-0 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-navy-950">Recent Test Orders</h2>
        <a href="#" className="text-sm font-black text-upchar-blue">View All Orders</a>
      </div>
      <div className="mt-6 max-w-full overflow-x-auto">
        <table className="w-full min-w-[920px] text-left">
          <thead className="text-sm font-black text-navy-600">
            <tr className="border-b border-blue-100">
              {["Order ID", "Patient Name", "Test / Package", "Lab / Center", "Status", "Order Date", "Amount", "Report Status"].map((heading) => (
                <th className="pb-4" key={heading}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 text-sm font-semibold text-navy-800">
            {safeOrders.map((order) => (
              <tr key={order.id}>
                <td className="py-4 font-black text-upchar-blue">{order.id}</td>
                <td className="py-4">{order.patient}</td>
                <td className="py-4">{order.test}</td>
                <td className="py-4">{order.lab}</td>
                <td className="py-4"><Badge label={order.status} /></td>
                <td className="py-4">{order.date}</td>
                <td className="py-4 font-black">{price(order.amount)}</td>
                <td className="py-4">
                  <span className="inline-flex items-center gap-2">
                    <Badge label={order.reportStatus} />
                    {order.reportStatus === "Generated" ? <Download className="h-4 w-4 text-upchar-green" /> : null}
                  </span>
                </td>
              </tr>
            ))}
            {!safeOrders.length ? (
              <tr>
                <td className="py-6 text-center text-sm font-black text-navy-500" colSpan={8}>
                  No recent test orders available.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <a href="#" className="text-sm font-black text-upchar-blue">View All Orders</a>
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-md border border-blue-100 text-navy-800"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" className="h-9 w-9 rounded-md border border-upchar-blue bg-upchar-blue text-sm font-black text-white">1</button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-md border border-blue-100 text-navy-800"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}

export default RecentOrdersTable;
