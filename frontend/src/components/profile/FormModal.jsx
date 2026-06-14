import { X } from "lucide-react";

function FormModal({ title, children, footer, onClose }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-navy-950/60 px-3 py-4 sm:items-center sm:px-4 sm:py-6">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-soft">
        <div className="flex items-center justify-between gap-4 border-b border-blue-100 px-5 py-4">
          <h2 className="min-w-0 truncate text-lg font-black text-navy-900 sm:text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-100 text-navy-500 transition hover:text-upchar-red"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer ? <div className="border-t border-blue-100 px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}

export default FormModal;
