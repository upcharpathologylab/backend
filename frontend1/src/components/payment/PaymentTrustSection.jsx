import Icon from "../Icon.jsx";
import { paymentTrustItems } from "../../data/paymentData.js";

const colorStyles = {
  green: "bg-green-50 text-upchar-green",
  blue: "bg-blue-50 text-upchar-blue",
  purple: "bg-violet-50 text-upchar-purple",
  orange: "bg-orange-50 text-upchar-orange"
};

function PaymentTrustSection() {
  return (
    <section className="mt-8 rounded-lg border border-blue-100 bg-white p-6 text-center shadow-sm lg:p-8">
      <h2 className="text-2xl font-black text-navy-900">Your trust is important to us</h2>
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {paymentTrustItems.map((item) => (
          <div className="rounded-lg p-4" key={item.title}>
            <span className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${colorStyles[item.color] || colorStyles.green}`}>
              <Icon name={item.icon} className="h-10 w-10" />
            </span>
            <h3 className="mt-4 text-base font-black text-navy-900">{item.title}</h3>
            <p className="mx-auto mt-2 max-w-[190px] text-sm font-semibold leading-6 text-navy-600">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PaymentTrustSection;
