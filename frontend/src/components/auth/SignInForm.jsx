import { Check, Mail } from "lucide-react";
import { useState } from "react";
import { loginUser } from "../../api/api.js";
import PasswordInput from "./PasswordInput.jsx";
import SocialLoginButton from "./SocialLoginButton.jsx";
import { storeAuthSession } from "./authStorage.js";

const initialValues = {
  identifier: "",
  password: "",
  remember: true
};

function validate(values) {
  const errors = {};

  if (!values.identifier.trim()) {
    errors.identifier = "Email or phone number is required.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

function SignInForm({ onModeChange, onSuccess }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
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
      const result = await loginUser(values);
      storeAuthSession(result);
      onSuccess?.(result.user, "Signed in successfully.");
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to sign in. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <p className="text-xl font-black text-upchar-green">Welcome Back!</p>
      <h2 className="mt-5 text-4xl font-black leading-tight text-navy-950 sm:text-5xl">Sign in to your account</h2>
      <p className="mt-4 text-xl font-semibold leading-8 text-navy-600 sm:text-2xl">Access your bookings, reports and health records</p>

      <div className="mt-8 grid gap-5">
        <label>
          <span className="mb-2 block text-base font-black text-navy-950 sm:text-lg">Email or Phone Number</span>
          <div
            className={`flex h-14 items-center rounded-lg border bg-white px-4 transition focus-within:border-upchar-blue focus-within:ring-4 focus-within:ring-upchar-blue/10 sm:h-16 ${
              errors.identifier ? "border-red-300" : "border-blue-100"
            }`}
          >
            <Mail className="h-6 w-6 shrink-0 text-navy-700" />
            <input
              name="identifier"
              type="text"
              value={values.identifier}
              onChange={update}
              placeholder="Enter your email or phone number"
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-base font-semibold text-navy-900 outline-none placeholder:text-navy-500 sm:text-lg"
            />
          </div>
          {errors.identifier && <p className="mt-1 text-sm font-semibold text-red-600">{errors.identifier}</p>}
        </label>

        <label>
          <span className="mb-2 block text-base font-black text-navy-950 sm:text-lg">Password</span>
          <PasswordInput
            id="signin-password"
            name="password"
            value={values.password}
            onChange={update}
            placeholder="Enter your password"
            error={errors.password}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-3 text-base font-black text-navy-950">
          <span className="relative flex h-7 w-7 items-center justify-center rounded border-2 border-upchar-green text-upchar-green">
            <input name="remember" type="checkbox" checked={values.remember} onChange={update} className="peer sr-only" />
            {values.remember && <Check className="h-5 w-5" />}
          </span>
          Remember me
        </label>
        <button type="button" className="text-left text-base font-black text-upchar-blue sm:text-right">
          Forgot Password?
        </button>
      </div>

      {apiError && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{apiError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-7 flex h-14 w-full items-center justify-center rounded-lg bg-upchar-green text-xl font-black text-white shadow-lg shadow-green-900/15 transition hover:bg-upchar-greenDark disabled:cursor-not-allowed disabled:opacity-70 sm:h-16"
      >
        {submitting ? "Signing In..." : "Sign In"}
      </button>

      <div className="my-8 flex items-center gap-5 text-base font-bold text-navy-500">
        <span className="h-px flex-1 bg-blue-100" />
        or continue with
        <span className="h-px flex-1 bg-blue-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SocialLoginButton type="google" />
        <SocialLoginButton type="phone" />
      </div>

      <p className="mt-8 text-center text-lg font-semibold text-navy-600">
        Don't have an account?{" "}
        <button type="button" className="font-black text-upchar-blue" onClick={() => onModeChange("signup")}>
          Sign Up
        </button>
      </p>
    </form>
  );
}

export default SignInForm;
