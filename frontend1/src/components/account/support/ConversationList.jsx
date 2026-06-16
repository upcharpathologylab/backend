import { ChevronRight } from "lucide-react";
import StatusBadge from "../StatusBadge.jsx";

function ConversationList({ conversations, onOpen }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-navy-900">Your Conversations</h2>
          <p className="mt-1 text-sm font-semibold text-navy-600">Track and manage your support tickets</p>
        </div>
        <button type="button" className="rounded-md border border-blue-100 px-4 py-2 text-sm font-black text-upchar-blue hover:bg-blue-50">
          View All
        </button>
      </div>
      <div className="mt-5 divide-y divide-blue-100">
        {conversations.map((ticket) => (
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 py-4 text-left"
            key={ticket.id}
            onClick={() => onOpen(ticket)}
          >
            <span>
              <span className="block text-sm font-black text-navy-900">{ticket.title}</span>
              <span className="mt-1 block text-xs font-semibold text-navy-600">{ticket.id} - {ticket.time}</span>
            </span>
            <span className="inline-flex items-center gap-3">
              <StatusBadge label={ticket.status} color={ticket.color} />
              <ChevronRight className="h-5 w-5 text-navy-700" />
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="mt-5 h-11 w-full rounded-md border border-blue-100 px-5 text-sm font-black text-upchar-blue hover:bg-blue-50">
        Go to My Tickets
      </button>
    </section>
  );
}

export default ConversationList;
