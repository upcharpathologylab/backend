import FormModal from "./FormModal.jsx";

function ConfirmDialog({ title, message, confirmLabel = "Delete", onCancel, onConfirm }) {
  return (
    <FormModal
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} className="h-11 rounded-md border border-blue-100 px-6 text-sm font-black text-navy-800">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 rounded-md bg-upchar-red px-6 text-sm font-black text-white transition hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-sm font-semibold leading-7 text-navy-700">{message}</p>
    </FormModal>
  );
}

export default ConfirmDialog;
