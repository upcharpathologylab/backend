import Icon from "../Icon.jsx";
import { whatsNextItems } from "../../data/paymentData.js";

function WhatsNextTimeline() {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <h2 className="text-2xl font-black text-navy-900">What's Next?</h2>
      <div className="mt-7 grid gap-0">
        {whatsNextItems.map((item, index) => (
          <div className="grid grid-cols-[62px_1fr] gap-4" key={item.number}>
            <div className="relative flex justify-center">
              <span className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-upchar-green">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              {index < whatsNextItems.length - 1 ? <span className="absolute bottom-0 top-12 w-px bg-green-100" /> : null}
            </div>
            <div className="pb-8">
              <p className="text-lg font-black text-upchar-green">{item.number}</p>
              <h3 className="mt-1 font-black text-navy-900">{item.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhatsNextTimeline;
