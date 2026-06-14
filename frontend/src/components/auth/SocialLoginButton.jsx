import { Phone } from "lucide-react";

function SocialLoginButton({ type }) {
  const isGoogle = type === "google";

  return (
    <button
      type="button"
      className="flex h-14 items-center justify-center gap-4 rounded-lg border border-blue-100 bg-white px-5 text-base font-black text-navy-900 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 sm:h-16 sm:text-lg"
    >
      {isGoogle ? (
        <span className="text-3xl font-black leading-none">
          <span className="text-[#4285f4]">G</span>
        </span>
      ) : (
        <Phone className="h-7 w-7 text-upchar-blue" />
      )}
      {isGoogle ? "Continue with Google" : "Continue with Phone"}
    </button>
  );
}

export default SocialLoginButton;
