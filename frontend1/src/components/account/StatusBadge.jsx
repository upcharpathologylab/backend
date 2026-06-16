const statusClasses = {
  green: "bg-green-50 text-upchar-green",
  blue: "bg-blue-50 text-upchar-blue",
  orange: "bg-orange-50 text-upchar-orange",
  red: "bg-red-50 text-upchar-red",
  purple: "bg-violet-50 text-upchar-purple",
  navy: "bg-navy-50 text-navy-800"
};

const statusColorByLabel = {
  Available: "green",
  Cancelled: "red",
  Completed: "green",
  Closed: "blue",
  "In Progress": "orange",
  "Not Available": "red",
  Paid: "green",
  Processing: "orange",
  Ready: "green",
  Refunded: "blue",
  Resolved: "green",
  Upcoming: "green",
  Verified: "green"
};

function StatusBadge({ label, color }) {
  const resolvedColor = color || statusColorByLabel[label] || "navy";

  return (
    <span className={`inline-flex rounded-md px-3 py-1 text-xs font-black ${statusClasses[resolvedColor] || statusClasses.navy}`}>
      {label}
    </span>
  );
}

export default StatusBadge;
