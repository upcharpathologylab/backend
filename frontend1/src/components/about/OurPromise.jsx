import { CheckCircle2 } from "lucide-react";
import promiseImage from "../../assets/about-promise.png";

const promiseItems = [
  "We connect you with the right labs.",
  "We ensure reliable sample collection.",
  "We deliver a better testing experience."
];

function OurPromise() {
  return (
    <section className="bg-white py-7">
      <div className="container-page">
        <div className="grid overflow-hidden rounded-lg border border-blue-100 bg-white shadow-card lg:grid-cols-[0.9fr_1.1fr]">
          <img src={promiseImage} alt="Healthcare partnership handshake" className="h-full min-h-[260px] w-full object-cover" />
          <div className="p-8 lg:p-11">
            <h2 className="text-4xl font-black text-navy-900">Our Promise</h2>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-navy-800">
              As a service provider, our promise is to bridge the gap between you and the best diagnostic services.
            </p>
            <ul className="mt-7 grid gap-4">
              {promiseItems.map((item) => (
                <li className="flex items-center gap-3 text-base font-bold text-navy-900" key={item}>
                  <CheckCircle2 className="h-6 w-6 shrink-0 fill-upchar-green text-white" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurPromise;
