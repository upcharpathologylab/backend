import FormModal from "../../profile/FormModal.jsx";
import { assetUrl } from "../../../api/api.js";

function AdminDetailsModal({ config, extraContent, item, onClose }) {
  if (!item) return null;
  const mapUrl = item.googleMapEmbedUrl || (
    item.latitude != null && item.longitude != null
      ? `https://www.google.com/maps?q=${item.latitude},${item.longitude}&z=15&output=embed`
      : ""
  );

  return (
    <FormModal
      title={`${config.breadcrumb} Details`}
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
        {config.previewMap && mapUrl ? (
          <iframe title={item.centerName || "Service location map"} src={mapUrl} className="h-64 w-full rounded-md border border-blue-100 sm:col-span-2" loading="lazy" />
        ) : null}
        {config.columns.map((column) => (
          <div className="rounded-md border border-blue-100 bg-slate-50 px-4 py-3" key={column.key}>
            <p className="text-xs font-black uppercase tracking-wide text-navy-500">{column.label}</p>
            {column.key === "prescriptionFile" && item[column.key] ? (
              <a href={assetUrl(item[column.key])} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-black text-upchar-blue underline underline-offset-2">
                View / Download Prescription
              </a>
            ) : (
              <p className="mt-2 text-sm font-black text-navy-950">{item[column.key]}</p>
            )}
          </div>
        ))}
        {extraContent ? <div className="sm:col-span-2">{extraContent}</div> : null}
      </div>
    </FormModal>
  );
}

export default AdminDetailsModal;
