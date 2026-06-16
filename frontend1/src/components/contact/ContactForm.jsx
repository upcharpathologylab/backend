import { useState } from "react";
import { Send, UserRound } from "lucide-react";
import { createContactMessage } from "../../api/api.js";

const initialValues = {
  fullName: "",
  email: "",
  countryCode: "+91",
  phone: "",
  subject: "",
  message: ""
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function ContactForm({ content }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const updateValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!values.email.trim()) nextErrors.email = "Email address is required.";
    if (values.email.trim() && !validateEmail(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!values.phone.trim()) nextErrors.phone = "Mobile number is required.";
    if (values.phone.trim() && !/^\d{10}$/.test(values.phone.trim())) nextErrors.phone = "Enter a valid 10 digit mobile number.";
    if (!values.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!values.message.trim()) nextErrors.message = "Message is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!validate()) return;

    setSubmitting(true);
    try {
      await createContactMessage({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: `${values.countryCode} ${values.phone.trim()}`,
        subject: values.subject.trim(),
        message: values.message.trim()
      });
      setValues(initialValues);
      setStatus({ type: "success", message: "Message sent successfully" });
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 h-11 w-full rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue focus:ring-4 focus:ring-upchar-blue/10";

  const labelClass = "text-sm font-black text-navy-900";

  return (
    <form className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm lg:p-7" onSubmit={handleSubmit} noValidate>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-upchar-blue">
          <UserRound className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-black text-upchar-blue">{content?.title || ""}</h2>
          <p className="mt-2 text-sm font-semibold text-navy-700">{content?.subtitle || ""}</p>
        </div>
      </div>

      <div className="mt-7 grid gap-5">
        <label className={labelClass}>
          Full Name <span className="text-upchar-red">*</span>
          <input
            className={inputClass}
            value={values.fullName}
            onChange={(event) => updateValue("fullName", event.target.value)}
            placeholder="Enter your full name"
          />
          {errors.fullName ? <span className="mt-1 block text-xs text-upchar-red">{errors.fullName}</span> : null}
        </label>

        <label className={labelClass}>
          Email Address <span className="text-upchar-red">*</span>
          <input
            className={inputClass}
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            placeholder="Enter your email address"
            type="email"
          />
          {errors.email ? <span className="mt-1 block text-xs text-upchar-red">{errors.email}</span> : null}
        </label>

        <label className={labelClass}>
          Mobile Number <span className="text-upchar-red">*</span>
          <div className="mt-2 grid grid-cols-[90px_1fr] gap-3">
            <select
              className="h-11 rounded-md border border-blue-100 bg-white px-3 text-sm font-bold text-navy-900 outline-none focus:border-upchar-blue focus:ring-4 focus:ring-upchar-blue/10"
              value={values.countryCode}
              onChange={(event) => updateValue("countryCode", event.target.value)}
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input
              className="h-11 min-w-0 rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue focus:ring-4 focus:ring-upchar-blue/10"
              value={values.phone}
              onChange={(event) => updateValue("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Enter your mobile number"
              inputMode="numeric"
            />
          </div>
          {errors.phone ? <span className="mt-1 block text-xs text-upchar-red">{errors.phone}</span> : null}
        </label>

        <label className={labelClass}>
          Subject <span className="text-upchar-red">*</span>
          <input
            className={inputClass}
            value={values.subject}
            onChange={(event) => updateValue("subject", event.target.value)}
            placeholder="Enter the subject"
          />
          {errors.subject ? <span className="mt-1 block text-xs text-upchar-red">{errors.subject}</span> : null}
        </label>

        <label className={labelClass}>
          Message <span className="text-upchar-red">*</span>
          <textarea
            className="mt-2 min-h-[110px] w-full resize-y rounded-md border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue focus:ring-4 focus:ring-upchar-blue/10"
            value={values.message}
            onChange={(event) => updateValue("message", event.target.value)}
            placeholder="Write your message here..."
          />
          {errors.message ? <span className="mt-1 block text-xs text-upchar-red">{errors.message}</span> : null}
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-md bg-upchar-blue text-sm font-black text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send className="h-5 w-5" />
        {submitting ? "Sending..." : content?.settings?.buttonText || ""}
      </button>

      {status.message ? (
        <p
          className={`mt-4 rounded-md px-4 py-3 text-sm font-bold ${
            status.type === "success" ? "bg-green-50 text-upchar-green" : "bg-red-50 text-upchar-red"
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}

export default ContactForm;
