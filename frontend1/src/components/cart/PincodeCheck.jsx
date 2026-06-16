import { MapPin } from "lucide-react";
import { useState } from "react";

function PincodeCheck() {
  const [pincode, setPincode] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleCheck = () => {
    if (/^\d{6}$/.test(pincode.trim())) {
      setStatus("success");
      setMessage("Home collection available in your area");
      return;
    }

    setStatus("error");
    setMessage("Please enter a valid 6 digit pincode");
  };

  return (
    <section className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-navy-900">Check delivery / collection availability</h2>
      <p className="mt-2 text-sm font-semibold text-navy-700">Enter your pincode to check home collection</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={pincode}
          onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter Pincode"
          inputMode="numeric"
          className="h-11 rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-900 outline-none placeholder:text-navy-400 focus:border-upchar-blue focus:ring-4 focus:ring-upchar-blue/10"
        />
        <button
          type="button"
          onClick={handleCheck}
          className="h-11 rounded-md bg-upchar-green px-7 text-sm font-black text-white transition hover:bg-upchar-greenDark"
        >
          Check
        </button>
      </div>
      {message ? (
        <p className={`mt-3 text-sm font-black ${status === "success" ? "text-upchar-green" : "text-upchar-red"}`}>{message}</p>
      ) : null}
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy-800">
        <MapPin className="h-5 w-5 text-upchar-green" />
        Current Pincode: 110001
      </p>
    </section>
  );
}

export default PincodeCheck;
