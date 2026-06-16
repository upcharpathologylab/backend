import { AnimatePresence, motion } from "framer-motion";

function AccountToast({ message }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          className="fixed bottom-6 left-1/2 z-[140] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg bg-navy-950 px-5 py-3 text-center text-sm font-black text-white shadow-soft"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default AccountToast;
