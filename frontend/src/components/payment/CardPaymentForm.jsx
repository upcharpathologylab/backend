import { BadgeCheck, CreditCard, LockKeyhole } from "lucide-react";
import { paymentMethods } from "../../data/paymentData.js";
import { price } from "../../utils.js";

const fieldClass =
  "h-12 w-full rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-800 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue focus:ring-4 focus:ring-blue-100";

function PaymentButton({ amount, loading, cashOnDelivery = false }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-md bg-upchar-green px-5 py-4 text-base font-black text-white shadow-lg shadow-green-900/15 transition hover:bg-upchar-greenDark disabled:cursor-wait disabled:opacity-80"
    >
      <LockKeyhole className="h-5 w-5" />
      {loading ? "Processing Payment..." : cashOnDelivery ? "Confirm Booking" : `Pay ${price(amount)}`}
    </button>
  );
}

function CardFields({ amount, loading }) {
  return (
    <>
      <div className="mt-7">
        <label className="text-sm font-black text-navy-800" htmlFor="card-number">
          Card Number
        </label>
        <div className="relative mt-2">
          <input id="card-number" className={`${fieldClass} pr-12`} placeholder="1234 5678 9012 3456" inputMode="numeric" />
          <CreditCard className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" />
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[1.25fr_0.8fr]">
        <div>
          <label className="text-sm font-black text-navy-800" htmlFor="card-holder">
            Card Holder Name
          </label>
          <input id="card-holder" className={`${fieldClass} mt-2`} placeholder="Enter card holder name" />
        </div>
        <div>
          <label className="text-sm font-black text-navy-800" htmlFor="expiry-date">
            Expiry Date
          </label>
          <input id="expiry-date" className={`${fieldClass} mt-2`} placeholder="MM / YY" />
        </div>
      </div>

      <div className="mt-5 max-w-sm">
        <label className="text-sm font-black text-navy-800" htmlFor="card-cvv">
          CVV
        </label>
        <input id="card-cvv" className={`${fieldClass} mt-2`} placeholder="123" inputMode="numeric" />
      </div>

      <label className="mt-5 flex items-center gap-3 text-sm font-bold text-navy-800">
        <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-blue-200 accent-upchar-green" />
        Save this card for faster payments
      </label>

      <div className="mt-6 rounded-lg border border-green-100 bg-green-50 p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-upchar-green">
            <BadgeCheck className="h-7 w-7" />
          </span>
          <div>
            <p className="font-black text-upchar-green">Your card details are secure & encrypted.</p>
            <p className="mt-1 text-sm font-semibold text-navy-700">We do not store your card details.</p>
          </div>
        </div>
      </div>

      <PaymentButton amount={amount} loading={loading} />
    </>
  );
}

function AlternatePaymentFields({ selectedMethod, amount, loading, customer, onCustomerChange }) {
  const method = paymentMethods.find((item) => item.id === selectedMethod);

  if (selectedMethod === "upi") {
    return (
      <>
        <div className="mt-7">
          <label className="text-sm font-black text-navy-800" htmlFor="upi-id">
            UPI ID
          </label>
          <input id="upi-id" className={`${fieldClass} mt-2`} placeholder="name@upi" />
        </div>
        <PaymentButton amount={amount} loading={loading} />
      </>
    );
  }

  if (selectedMethod === "netbanking") {
    return (
      <>
        <div className="mt-7">
          <label className="text-sm font-black text-navy-800" htmlFor="bank-name">
            Select Bank
          </label>
          <select id="bank-name" className={`${fieldClass} mt-2`}>
            <option>HDFC Bank</option>
            <option>ICICI Bank</option>
            <option>State Bank of India</option>
            <option>Axis Bank</option>
          </select>
        </div>
        <PaymentButton amount={amount} loading={loading} />
      </>
    );
  }

  return (
    <>
      <div className="mt-7 rounded-lg border border-blue-100 bg-blue-50/50 p-5">
        <p className="text-base font-black text-navy-900">{method?.label || "Cash on Delivery"}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">
          Continue to confirm your booking and complete payment at your convenience.
        </p>
      </div>
      <PaymentButton amount={amount} loading={loading} cashOnDelivery={selectedMethod === "cod"} />
    </>
  );
}

function CardPaymentForm({ selectedMethod, amount, loading, onPay, customer, onCustomerChange }) {
  const method = paymentMethods.find((item) => item.id === selectedMethod) || paymentMethods[0];

  return (
    <form
      className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        onPay();
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-navy-900">
            {selectedMethod === "card" ? "Pay using Card" : `Pay using ${method.label}`}
          </h2>
          <p className="mt-3 text-sm font-semibold text-navy-600">
            {selectedMethod === "card" ? "We accept all major cards" : method.subtitle}
          </p>
        </div>
        {selectedMethod === "card" ? (
          <div className="flex items-center gap-3 text-sm font-black">
            <span className="text-upchar-blue">VISA</span>
            <span className="text-upchar-orange">Mastercard</span>
            <span className="text-navy-800">RuPay</span>
          </div>
        ) : null}
      </div>

      {selectedMethod === "card" ? (
        <CardFields amount={amount} loading={loading} />
      ) : (
        <AlternatePaymentFields
          selectedMethod={selectedMethod}
          amount={amount}
          loading={loading}
          customer={customer}
          onCustomerChange={onCustomerChange}
        />
      )}

      <p className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-semibold text-navy-700">
        <BadgeCheck className="h-4 w-4 text-upchar-green" />
        By proceeding, you agree to our{" "}
        <a href="/terms-conditions" className="font-black text-upchar-blue">
          Terms & Conditions.
        </a>
      </p>
    </form>
  );
}

export default CardPaymentForm;
