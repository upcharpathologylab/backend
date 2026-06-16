import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Icon from "../Icon.jsx";
import { accountSidebarItems } from "../../data/profileData.js";

function AccountSidebar({ active, onSectionSelect }) {
  return (
    <aside className="rounded-lg border border-blue-100 bg-white p-3 shadow-sm lg:sticky lg:top-32">
      <nav className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {accountSidebarItems.map((item) => {
          const isActive = active === item.id;

          const className = `flex min-w-[220px] items-center gap-4 rounded-md border-l-4 px-4 py-4 text-left transition lg:min-w-0 ${
            isActive
              ? "border-upchar-green bg-green-50/70 text-upchar-green"
              : "border-transparent text-navy-800 hover:bg-blue-50/70"
          }`;
          const content = (
            <>
              <Icon name={item.icon} className="h-7 w-7 shrink-0" />
              <span>
                <span className={`block text-sm font-black ${isActive ? "text-upchar-green" : "text-navy-900"}`}>
                  {item.label}
                </span>
                <span className="mt-1 block text-xs font-semibold text-navy-600">{item.subtitle}</span>
              </span>
            </>
          );

          return onSectionSelect?.(item.id) ? (
            <button
              type="button"
              key={item.id}
              className={className}
              onClick={() => onSectionSelect(item.id, true)}
            >
              {content}
            </button>
          ) : (
            <Link to={item.href} key={item.id} className={className}>
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 rounded-lg border border-green-100 bg-green-50/50 p-5 text-center lg:text-left">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-upchar-green shadow-sm lg:mx-0">
          <Icon name="Headphones" className="h-7 w-7" />
        </span>
        <h3 className="mt-4 text-base font-black text-navy-900">Need Help?</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">Our support team is here to help you.</p>
        <a
          href="https://wa.me/917838532205"
          className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-upchar-green px-5 text-sm font-black text-white transition hover:bg-upchar-greenDark"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </a>
      </div>
    </aside>
  );
}

export default AccountSidebar;
