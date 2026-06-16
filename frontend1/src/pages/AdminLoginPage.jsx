import { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/api.js";
import upcharLogo from "../assets/upchar-logo.png";
import { hasAdminSession, storeAdminAuthSession } from "../components/auth/authStorage.js";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "", remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Admin Login | Upchar Pathology Lab";
    if (hasAdminSession()) navigate("/admin", { replace: true });
  }, [navigate]);

  const updateValue = (key, value) => {
    setError("");
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginAdmin(values);
      storeAdminAuthSession(result);
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-navy-950 lg:grid lg:grid-cols-[minmax(360px,40vw)_1fr]">
      <section className="relative overflow-hidden bg-navy-950 px-8 py-10 text-white sm:px-12 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(0,151,136,0.18),transparent_24%),radial-gradient(circle_at_80%_72%,rgba(22,119,255,0.16),transparent_28%)]" />
        <div className="absolute right-0 top-0 hidden h-full w-1/2 opacity-20 lg:block">
          <div className="absolute right-12 top-1/3 h-44 w-44 rounded-[2rem] border border-cyan-300/30" />
          <div className="absolute right-24 top-[46%] h-36 w-36 rounded-[2rem] border border-emerald-300/30" />
          <div className="absolute right-8 top-[58%] h-28 w-28 rounded-[2rem] border border-blue-300/30" />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-5">
            <img src={upcharLogo} alt="Upchar logo" className="h-20 w-20 object-contain" />
            <div>
              <p className="text-5xl font-black leading-none">Upchar</p>
              <p className="mt-2 text-lg font-semibold text-upchar-green">Health & Diagnostics</p>
            </div>
          </div>

          <div className="mt-16">
            <h1 className="text-4xl font-black tracking-normal">Admin Panel</h1>
            <span className="mt-7 block h-1 w-20 rounded-full bg-upchar-green" />
            <p className="mt-8 max-w-sm text-xl font-semibold leading-9 text-blue-50">
              Manage tests, packages, bookings, reports and system settings from one secure dashboard.
            </p>
          </div>

          <div className="mt-20 hidden rounded-xl border border-cyan-300/25 bg-blue-500/10 p-6 shadow-2xl shadow-blue-950/20 lg:block">
            <div className="flex items-end gap-5">
              <div className="flex h-24 flex-1 items-end gap-3 rounded-lg border border-blue-200/20 p-4">
                <span className="h-8 w-5 rounded-t bg-upchar-blue/60" />
                <span className="h-12 w-5 rounded-t bg-upchar-blue/70" />
                <span className="h-16 w-5 rounded-t bg-upchar-blue/80" />
                <span className="h-20 w-5 rounded-t bg-upchar-blue" />
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-[14px] border-upchar-blue/70 border-r-upchar-green/70" />
            </div>
            <div className="mt-6 flex items-center gap-3 text-upchar-green">
              <ShieldCheck className="h-12 w-12" />
              <span className="text-sm font-black uppercase tracking-wide">Protected Operations</span>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-5 py-10 sm:px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-2xl border border-blue-100 bg-white px-8 py-10 shadow-2xl shadow-blue-950/10 sm:px-16 sm:py-12">
          <div className="text-center">
            <span className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-green-50 text-navy-950">
              <LockKeyhole className="h-14 w-14" />
            </span>
            <h2 className="mt-8 text-4xl font-black text-navy-950">Welcome Back!</h2>
            <p className="mt-4 text-xl font-semibold text-navy-700">Login to access Upchar Admin Panel</p>
          </div>

          <div className="mt-12 grid gap-7">
            <label className="block">
              <span className="text-base font-black text-navy-900">Username</span>
              <span className="mt-4 flex h-16 items-center gap-4 rounded-lg border border-blue-100 bg-white px-5 shadow-sm focus-within:border-upchar-green">
                <UserRound className="h-6 w-6 shrink-0 text-navy-500" />
                <input
                  type="text"
                  value={values.username}
                  onChange={(event) => updateValue("username", event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-lg font-semibold text-navy-900 outline-none placeholder:text-navy-400"
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="text-base font-black text-navy-900">Password</span>
              <span className="mt-4 flex h-16 items-center gap-4 rounded-lg border border-blue-100 bg-white px-5 shadow-sm focus-within:border-upchar-green">
                <LockKeyhole className="h-6 w-6 shrink-0 text-navy-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={(event) => updateValue("password", event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-lg font-semibold text-navy-900 outline-none placeholder:text-navy-400"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button type="button" className="text-navy-500 transition hover:text-upchar-green" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </span>
            </label>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 text-base font-semibold">
            <label className="inline-flex items-center gap-3 text-navy-800">
              <input
                type="checkbox"
                checked={values.remember}
                onChange={(event) => updateValue("remember", event.target.checked)}
                className="h-6 w-6 rounded border-blue-100 accent-upchar-green"
              />
              Remember me
            </label>
            <a href="#" className="font-bold text-upchar-green hover:text-upchar-greenDark">
              Forgot Password?
            </a>
          </div>

          {error ? (
            <div className="mt-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-black text-upchar-red">
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={loading} className="mt-8 inline-flex h-16 w-full items-center justify-center gap-3 rounded-lg bg-upchar-green text-lg font-black text-white shadow-lg shadow-green-900/20 transition hover:bg-upchar-greenDark disabled:cursor-not-allowed disabled:opacity-70">
            <LogIn className="h-6 w-6" />
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-10 flex items-center gap-5">
            <span className="h-px flex-1 bg-blue-100" />
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-sm font-semibold text-navy-700">or</span>
            <span className="h-px flex-1 bg-blue-100" />
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 text-lg font-semibold text-navy-900">
            <ShieldCheck className="h-7 w-7 text-upchar-green" />
            Secure Admin Access
          </div>
        </form>

        <p className="mt-9 text-center text-sm font-semibold text-navy-500">
          © 2026 Upchar Health & Diagnostics. All rights reserved.
        </p>
      </section>
    </main>
  );
}

export default AdminLoginPage;
