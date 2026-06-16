import { ChevronRight, Plus } from "lucide-react";

function CommonQuestions({ questions, onSelect }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <h2 className="text-xl font-black text-navy-900">Common Questions</h2>
      <p className="mt-1 text-sm font-semibold text-navy-600">Quick answers to popular questions</p>
      <div className="mt-5 divide-y divide-blue-100">
        {questions.map((question) => (
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-black text-navy-900"
            key={question}
            onClick={() => onSelect(question)}
          >
            <span className="inline-flex items-center gap-3">
              <Plus className="h-4 w-4 text-upchar-blue" />
              {question}
            </span>
            <ChevronRight className="h-5 w-5 text-navy-700" />
          </button>
        ))}
      </div>
      <button type="button" className="mt-5 h-11 w-full rounded-md border border-blue-100 px-5 text-sm font-black text-upchar-blue hover:bg-blue-50">
        View All FAQs
      </button>
    </section>
  );
}

export default CommonQuestions;
