import Icon from "../Icon.jsx";
import { profileTrustItems } from "../../data/profileData.js";

function TrustStrip() {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {profileTrustItems.map((item) => (
          <div className="grid grid-cols-[56px_1fr] items-center gap-4" key={item.title}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-upchar-green">
              <Icon name={item.icon} className="h-7 w-7" />
            </span>
            <span>
              <span className="block text-sm font-black text-navy-900">{item.title}</span>
              <span className="mt-1 block text-xs font-semibold text-navy-600">{item.subtitle}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustStrip;
