import { Search } from "lucide-react";
import Icon from "../../Icon.jsx";

const contactCards = [
  { title: "Live Chat", text: "Chat with our support team", badge: "24/7 Available", icon: "MessageCircle", color: "green" },
  { title: "Call Us", text: "+91 98765 43210", badge: "9 AM - 9 PM", icon: "Phone", color: "purple" },
  { title: "Email Us", text: "support@upcharlabs.com", badge: "Within 24 hours", icon: "Mail", color: "orange" }
];

const colorClasses = {
  green: "bg-green-50 text-upchar-green",
  orange: "bg-orange-50 text-upchar-orange",
  purple: "bg-violet-50 text-upchar-purple"
};

function HelpHero({ query, onQueryChange, onAction }) {
  return (
    <section className="overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 via-violet-50/70 to-blue-50 p-5 shadow-sm lg:p-8">
      <div className="grid gap-6 xl:grid-cols-[1fr_330px] xl:items-center">
        <div>
          <p className="text-xl font-black text-upchar-blue">Hi Rahul!</p>
          <h2 className="mt-2 text-3xl font-black text-navy-900 lg:text-4xl">How can we assist you today?</h2>
          <label className="mt-6 flex h-14 max-w-3xl items-center gap-3 rounded-lg border border-blue-100 bg-white px-5 shadow-sm">
            <Search className="h-5 w-5 text-upchar-blue" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-navy-900 outline-none placeholder:text-navy-400"
              placeholder="Search for help articles, issues or questions..."
            />
          </label>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {contactCards.map((card) => (
              <button
                type="button"
                className="rounded-lg border border-blue-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
                key={card.title}
                onClick={() => onAction(card.title)}
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClasses[card.color]}`}>
                  <Icon name={card.icon} className="h-6 w-6" />
                </span>
                <span className="mt-4 block text-base font-black text-navy-900">{card.title}</span>
                <span className="mt-1 block text-sm font-semibold text-navy-700">{card.text}</span>
                <span className={`mt-4 inline-flex rounded-md px-3 py-1 text-xs font-black ${colorClasses[card.color]}`}>
                  {card.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="hidden justify-center xl:flex">
          <div className="relative h-64 w-64 rounded-full bg-white/70">
            <span className="absolute bottom-3 left-10 flex h-36 w-44 items-end justify-center rounded-t-full bg-upchar-blue text-white shadow-card">
              <Icon name="Headphones" className="mb-14 h-16 w-16" />
            </span>
            <span className="absolute right-4 top-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-upchar-green shadow-sm">
              <Icon name="MessageCircle" className="h-7 w-7" />
            </span>
            <span className="absolute left-0 top-16 flex h-12 w-12 items-center justify-center rounded-full bg-white text-upchar-purple shadow-sm">
              <Icon name="Search" className="h-6 w-6" />
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-md bg-upchar-blue px-5 py-3 text-sm font-black text-white">
        Your queries are important to us. We usually respond within a few hours.
      </div>
    </section>
  );
}

export default HelpHero;
