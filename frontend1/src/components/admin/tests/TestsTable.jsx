import { ChevronLeft, ChevronRight, Eye, PencilLine, Trash2 } from "lucide-react";

const categoryClasses = {
  Biochemistry: "bg-green-50 text-upchar-green ring-green-100",
  Hematology: "bg-violet-50 text-upchar-purple ring-violet-100",
  Hormone: "bg-blue-50 text-upchar-blue ring-blue-100",
  Immunology: "bg-orange-50 text-upchar-orange ring-orange-100",
  Pathology: "bg-pink-50 text-pink-600 ring-pink-100"
};

function CategoryBadge({ category }) {
  return <span className={`rounded-md px-3 py-1 text-sm font-black ring-1 ${categoryClasses[category] || "bg-blue-50 text-navy-800 ring-blue-100"}`}>{category}</span>;
}

function DiscountBadge({ value }) {
  const hasDiscount = Number(value) > 0;
  return <span className={`rounded-md px-3 py-1 text-sm font-black ${hasDiscount ? "bg-green-50 text-upchar-green ring-1 ring-green-100" : "bg-slate-100 text-navy-700"}`}>{value}%</span>;
}

function StatusBadge({ status }) {
  const active = status === "Active";
  return <span className={`rounded-md px-3 py-1 text-sm font-black ${active ? "bg-green-50 text-upchar-green ring-1 ring-green-100" : "bg-red-50 text-upchar-red ring-1 ring-red-100"}`}>{status}</span>;
}

function TestsTable({ rows, totalCount, emptyMessage = "No tests found. Try changing your filters.", onEdit, onView, onDelete }) {
  const endCount = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / 10));
  const visiblePages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => index + 1);

  return (
    <section className="min-w-0 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <h2 className="text-xl font-black text-navy-950">All Tests ({totalCount})</h2>

      <div className="mt-5 max-w-full overflow-x-auto">
        <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-left">
          <thead>
            <tr className="text-sm font-black text-navy-900">
              {["", "#", "Test Name", "Test Code", "Category", "Price (Rs.)", "Discount (%)", "Final Price (Rs.)", "Status", "Actions"].map((heading) => (
                <th className="border-b border-t border-blue-100 bg-slate-50 px-4 py-4 first:border-l last:border-r" key={heading}>
                  {heading === "" ? <input type="checkbox" className="h-4 w-4 rounded border-blue-200 accent-upchar-green" aria-label="Select all tests" /> : heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm font-semibold text-navy-900">
            {rows.map((test, index) => (
              <tr className="transition hover:bg-blue-50/45" key={test.id}>
                <td className="border-b border-blue-100 px-4 py-4">
                  <input type="checkbox" className="h-4 w-4 rounded border-blue-200 accent-upchar-green" aria-label={`Select ${test.testName}`} />
                </td>
                <td className="border-b border-blue-100 px-4 py-4">{index + 1}</td>
                <td className="border-b border-blue-100 px-4 py-4 font-black">{test.testName}</td>
                <td className="border-b border-blue-100 px-4 py-4">{test.testCode}</td>
                <td className="border-b border-blue-100 px-4 py-4"><CategoryBadge category={test.category} /></td>
                <td className="border-b border-blue-100 px-4 py-4">{test.price}</td>
                <td className="border-b border-blue-100 px-4 py-4"><DiscountBadge value={test.discountPercent} /></td>
                <td className="border-b border-blue-100 px-4 py-4">{test.finalPrice}</td>
                <td className="border-b border-blue-100 px-4 py-4"><StatusBadge status={test.status} /></td>
                <td className="border-b border-blue-100 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => onEdit(test)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-upchar-blue ring-1 ring-blue-100" aria-label={`Edit ${test.testName}`}>
                      <PencilLine className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => onView(test)} className="flex h-9 w-9 items-center justify-center rounded-md bg-green-50 text-upchar-green ring-1 ring-green-100" aria-label={`View ${test.testName}`}>
                      <Eye className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => onDelete(test)} className="flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-upchar-red ring-1 ring-red-100" aria-label={`Delete ${test.testName}`}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 ? (
          <div className="rounded-b-lg border-x border-b border-blue-100 px-4 py-10 text-center text-sm font-black text-navy-600">
            {emptyMessage}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm font-semibold text-navy-900">
          Showing {rows.length ? 1 : 0} to {endCount} of {totalCount} entries
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-md border border-blue-100 text-navy-400" aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {visiblePages.map((page) => (
              <button type="button" key={page} className={`h-10 w-10 rounded-md border text-sm font-black ${page === 1 ? "border-upchar-green bg-upchar-green text-white" : "border-blue-100 text-navy-900"}`}>{page}</button>
            ))}
            {totalPages > 5 ? (
              <>
                <span className="px-1 text-sm font-black text-navy-600">...</span>
                <button type="button" className="h-10 w-12 rounded-md border border-blue-100 text-sm font-black text-navy-900">{totalPages}</button>
              </>
            ) : null}
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-md border border-blue-100 text-navy-900" aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <select className="h-10 rounded-md border border-blue-100 px-4 text-sm font-black text-navy-900 outline-none">
            <option>10 / page</option>
            <option>25 / page</option>
            <option>50 / page</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default TestsTable;
