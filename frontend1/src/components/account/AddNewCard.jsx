import { Plus } from "lucide-react";

function AddNewCard({ title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[150px] flex-col items-center justify-center rounded-lg border border-dashed border-upchar-blue/45 bg-white p-6 text-center transition hover:bg-blue-50"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-upchar-blue text-upchar-blue">
        <Plus className="h-6 w-6" />
      </span>
      <span className="mt-4 text-xl font-black text-upchar-blue">{title}</span>
      <span className="mt-2 max-w-[260px] whitespace-pre-line text-sm font-semibold leading-6 text-navy-700">{text}</span>
    </button>
  );
}

export default AddNewCard;
