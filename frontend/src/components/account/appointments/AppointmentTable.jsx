import StatusBadge from "../StatusBadge.jsx";

function AppointmentTable({ rows, onAction }) {
  return (
    <div className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
      <div className="hidden grid-cols-[1.15fr_1fr_1.1fr_1fr_0.75fr_0.8fr] bg-blue-50/50 px-5 py-4 text-sm font-black text-navy-800 lg:grid">
        <span>Appointment</span>
        <span>Family Member</span>
        <span>Date & Time</span>
        <span>Collection Type</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      <div className="divide-y divide-blue-100">
        {rows.map((row) => (
          <div className="grid gap-4 p-5 lg:grid-cols-[1.15fr_1fr_1.1fr_1fr_0.75fr_0.8fr] lg:items-center" key={row.id}>
            <span>
              <span className="block text-sm font-black text-navy-900">{row.appointment}</span>
              <span className="mt-1 block text-xs font-semibold text-upchar-blue">{row.id}</span>
            </span>
            <span className="text-sm font-semibold text-navy-800">
              {row.member}
              <StatusBadge label={row.relation} color="green" />
            </span>
            <span className="text-sm font-semibold text-navy-700">
              {row.date}
              <span className="block text-xs text-navy-500">{row.time}</span>
            </span>
            <span className="text-sm font-semibold text-navy-700">{row.collectionType}</span>
            <StatusBadge label={row.status} />
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md border border-blue-100 px-4 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
              onClick={() => onAction(row)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppointmentTable;
