import FormModal from "../../profile/FormModal.jsx";

const details = [
  ["Test Name", "testName"],
  ["Test Code", "testCode"],
  ["Category", "category"],
  ["Price", "price"],
  ["Discount %", "discountPercent"],
  ["Final Price", "finalPrice"],
  ["Sample Type", "sampleType"],
  ["Report Time", "reportTime"],
  ["Home Collection", "homeCollection"],
  ["Fasting Required", "fastingRequired"],
  ["Badge", "badge"],
  ["Badge Type", "badgeType"],
  ["Icon", "icon"],
  ["Rating", "rating"],
  ["Popularity", "popularity"],
  ["Sort Order", "sortOrder"],
  ["Status", "status"]
];

function ViewTestModal({ test, onClose }) {
  if (!test) return null;

  return (
    <FormModal
      title="View Test Details"
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="h-11 rounded-md bg-upchar-blue px-6 text-sm font-black text-white">
            Close
          </button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {details.map(([label, key]) => (
          <div className="rounded-md border border-blue-100 bg-slate-50 px-4 py-3" key={key}>
            <p className="text-xs font-black uppercase tracking-wide text-navy-500">{label}</p>
            <p className="mt-2 text-sm font-black text-navy-950">{test[key]}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-blue-100 px-4 py-3">
        <p className="text-xs font-black uppercase tracking-wide text-navy-500">Description</p>
        <p className="mt-2 text-sm font-semibold leading-7 text-navy-800">{test.description || "No description added."}</p>
      </div>
    </FormModal>
  );
}

export default ViewTestModal;
