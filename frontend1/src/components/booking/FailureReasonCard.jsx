import { AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import { failureReasons, recoveryActions } from "../../data/paymentData.js";

function FailureReasonCard() {
  return (
    <section className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
      <div className="p-5 lg:p-6">
        <h2 className="text-2xl font-black text-navy-900">What Went Wrong?</h2>
        <div className="mt-6 grid gap-4 rounded-lg bg-red-50 p-5 sm:grid-cols-[54px_1fr]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-upchar-red">
            <AlertTriangle className="h-7 w-7" />
          </span>
          <div>
            <h3 className="text-lg font-black text-upchar-red">Transaction Failed</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">The payment was unable to be processed.</p>
            <p className="mt-3 text-sm font-black text-navy-900">This could be due to:</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm font-semibold leading-6 text-navy-700">
              {failureReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-100 p-5 lg:p-6">
        <h2 className="text-2xl font-black text-navy-900">What You Can Do?</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-blue-100">
          {recoveryActions.map((action) => {
            const isExternal = action.href.startsWith("http");
            const content = (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-upchar-blue">
                  <Icon name={action.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-navy-900">{action.title}</span>
                  <span className="mt-1 block text-xs font-semibold text-navy-600">{action.subtitle}</span>
                </span>
                <ChevronRight className="h-5 w-5 text-navy-400" />
              </>
            );

            return isExternal ? (
              <a
                href={action.href}
                className="flex items-center gap-4 border-b border-blue-100 p-4 transition last:border-b-0 hover:bg-blue-50/50"
                key={action.title}
              >
                {content}
              </a>
            ) : (
              <Link
                to={action.href}
                className="flex items-center gap-4 border-b border-blue-100 p-4 transition last:border-b-0 hover:bg-blue-50/50"
                key={action.title}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FailureReasonCard;
