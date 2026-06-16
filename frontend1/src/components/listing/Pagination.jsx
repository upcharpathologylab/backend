import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-white text-navy-700 disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      {pages.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onPageChange(item)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-black ${
            item === page ? "border-upchar-green bg-upchar-green text-white" : "border-blue-100 bg-white text-navy-800"
          }`}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-white text-navy-700 disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default Pagination;
