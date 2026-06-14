import { Check, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { registerUser } from "../../api/api.js";
import PasswordInput from "./PasswordInput.jsx";
import SocialLoginButton from "./SocialLoginButton.jsx";

const initialValues = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: true
};

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = "Full name is required.";
  if (!/^[6-9]\d{9}$/.test(values.phone.trim())) errors.phone = "Enter a valid 10-digit phone number.";
  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords must match.";
  }
  if (!values.terms) errors.terms = "You must agree before signing up.";

  return errors;
}

function TextInput({ label, name, value, onChange, placeholder, error, icon: Icon, type = "text" }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-black text-navy-950 sm:text-base">{label}</span>
      <div
        className={`flex h-14 items-center rounded-lg border bg-white px-4 transition focus-within:border-upchar-blue focus-within:ring-4 focus-within:ring-upchar-blue/10 ${
          error ? "border-red-300" : "border-blue-100"
        }`}
      >
        <Icon className="h-6 w-6 shrink-0 text-navy-700" />
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-base font-semibold text-navy-900 outline-none placeholder:text-navy-500"
        />
      </div>
      {error && <p className="mt-1 text-sm font-semibold text-red-600">{error}</p>}
    </label>
  );
}

function SignUpForm({ onModeChange, onSignupSuccess }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => {
    const { name, value, checked, type } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setApiError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await registerUser(values);
      setSuccess("Account created successfully. Please sign in.");
      onSignupSuccess?.("Account created successfully. Please sign in.");
      setTimeout(() => onModeChange("signin"), 800);
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <p className="text-xl font-black text-upchar-green">Create Account</p>
      <h2 className="mt-4 text-4xl font-black leading-tight text-navy-950 sm:text-5xl">Sign up for Upchar Pathology</h2>
      <p className="mt-3 text-xl font-semibold leading-8 text-navy-600">Join us and book tests from trusted labs near you</p>

      <div className="mt-7 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            label="Full Name"
            name="fullName"
            value={values.fullName}
            onChange={update}
            placeholder="Enter your full name"
            error={errors.fullName}
            icon={UserRound}
          />
          <TextInput
            label="Phone Number"
            name="phone"
            value={values.phone}
            onChange={update}
            placeholder="Enter your phone number"
            error={errors.phone}
            icon={Phone}
            type="tel"
          />
        </div>

        <TextInput
          label="Email Address"
          name="email"
          value={values.email}
          onChange={update}
          placeholder="Enter your email address"
          error={errors.email}
          icon={Mail}
          type="email"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-black text-navy-950 sm:text-base">Password</span>
            <PasswordInput
              id="signup-password"
              name="password"
              value={values.password}
              onChange={update}
              placeholder="Create a password"
              error={errors.password}
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-black text-navy-950 sm:text-base">Confirm Password</span>
            <PasswordInput
              id="signup-confirm-password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={update}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
            />
          </label>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-navy-600">
        <ShieldCheck className="h-5 w-5 text-navy-600" />
        Password must be at least 8 characters long
      </p>

      <div className="mt-7">
        <p className="mb-3 text-base font-black text-navy-950">I am signing up as</p>
        <div className="flex items-center justify-between rounded-xl border-2 border-upchar-green bg-green-50/30 p-5">
          <div className="flex items-center gap-5">
            <UserRound className="h-14 w-14 text-upchar-green" />
            <div>
              <p className="text-lg font-black text-navy-950">Customer</p>
              <p className="mt-1 max-w-sm text-base font-semibold leading-7 text-navy-800">
                Book tests, view reports and manage bookings
              </p>
            </div>
          </div>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-upchar-green">
            <span className="h-4 w-4 rounded-full bg-upchar-green" />
          </span>
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 text-base font-black text-navy-950">
        <span className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 border-upchar-green text-upchar-green">
          <input name="terms" type="checkbox" checked={values.terms} onChange={update} className="peer sr-only" />
          {values.terms && <Check className="h-5 w-5" />}
        </span>
        <span>
          I agree to the <button type="button" className="text-upchar-blue">Terms & Conditions</button> and{" "}
          <button type="button" className="text-upchar-blue">Privacy Policy</button>
        </span>
      </label>
      {errors.terms && <p className="mt-1 text-sm font-semibold text-red-600">{errors.terms}</p>}

      {apiError && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{apiError}</p>}
      {success && <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-bold text-upchar-green">{success}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex h-14 w-full items-center justify-center rounded-lg bg-upchar-green text-xl font-black text-white shadow-lg shadow-green-900/15 transition hover:bg-upchar-greenDark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Signing Up..." : "Sign Up"}
      </button>

      <div className="my-7 flex items-center gap-5 text-base font-bold text-navy-500">
        <span className="h-px flex-1 bg-blue-100" />
        or continue with
        <span className="h-px flex-1 bg-blue-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SocialLoginButton type="google" />
        <SocialLoginButton type="phone" />
      </div>

      <p className="mt-7 text-center text-lg font-semibold text-navy-600">
        Already have an account?{" "}
        <button type="button" className="font-black text-upchar-blue" onClick={() => onModeChange("signin")}>
          Sign In
        </button>
      </p>
    </form>
  );
}

export default SignUpForm;
