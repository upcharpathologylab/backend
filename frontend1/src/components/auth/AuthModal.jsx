import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import SignInForm from "./SignInForm.jsx";
import SignUpForm from "./SignUpForm.jsx";

function AuthModal({ isOpen, mode, onModeChange, onClose, onSuccess, onSignupSuccess }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={mode === "signin" ? "Sign in" : "Sign up"}
            className={`relative max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl sm:p-10 ${
              mode === "signin" ? "max-w-[650px]" : "max-w-[760px]"
            }`}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-navy-900 transition hover:bg-blue-100"
              onClick={onClose}
              aria-label="Close auth popup"
            >
              <X className="h-5 w-5" />
            </button>

            {mode === "signin" ? (
              <SignInForm onModeChange={onModeChange} onSuccess={onSuccess} />
            ) : (
              <SignUpForm onModeChange={onModeChange} onSignupSuccess={onSignupSuccess} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
