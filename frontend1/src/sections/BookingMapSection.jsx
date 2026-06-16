import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, FileUp, LockKeyhole, MapPin, Search, ShieldCheck, UploadCloud, X } from "lucide-react";
import { assetUrl, createBookingLead } from "../api/api.js";
import AuthModal from "../components/auth/AuthModal.jsx";
import { getStoredUser } from "../components/auth/authStorage.js";
import Icon from "../components/Icon.jsx";
import { textValue } from "../utils/contentOverrides.js";
import { price } from "../utils.js";
import { addCartItem } from "../utils/cart.js";

const initialValues = {
  fullName: "",
  mobile: "",
  city: "",
  selectedTestOrPackage: "",
  prescriptionFile: null,
  source: "home-page"
};

const prescriptionTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);

function FieldError({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-xs font-semibold text-red-200">{children}</p>;
}

function BookingMapSection({ data, content, modal = false, tests = [], packages = [], serviceLocation = null, serviceLocationLoaded = true }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [pendingBooking, setPendingBooking] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [prescriptionPreviewUrl, setPrescriptionPreviewUrl] = useState("");
  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return [
      ...tests.map((item) => ({ ...item, resultType: "Test" })),
      ...packages.map((item) => ({ ...item, resultType: "Package" }))
    ]
      .filter((item) => item.name.toLowerCase().startsWith(term))
      .slice(0, 10);
  }, [packages, query, tests]);
  const hasCoordinates = serviceLocation?.latitude != null && serviceLocation?.longitude != null;
  const savedEmbedUrl = serviceLocation?.googleMapEmbedUrl?.trim() || "";
  const mapEmbedUrl = savedEmbedUrl.includes("output=embed") || savedEmbedUrl.includes("/embed")
    ? savedEmbedUrl
    : hasCoordinates
      ? `https://maps.google.com/maps?q=${serviceLocation.latitude},${serviceLocation.longitude}&z=15&output=embed`
      : ""
  const locationQuery = serviceLocation ? `${serviceLocation.centerName || ""} ${serviceLocation.fullAddress || ""}`.trim() : "";
  const openMapUrl = serviceLocation?.googlePlaceUrl?.trim()
    || serviceLocation?.googleDirectionUrl?.trim()
    || (locationQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}` : "");
  const directionUrl = serviceLocation?.googleDirectionUrl?.trim()
    || (locationQuery ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationQuery)}` : "");

  useEffect(() => {
    return () => {
      if (prescriptionPreviewUrl) URL.revokeObjectURL(prescriptionPreviewUrl);
    };
  }, [prescriptionPreviewUrl]);

  const update = (event) => {
    const { name, value, files } = event.target;
    const file = files?.[0] || null;

    if (name === "prescriptionFile" && file) {
      if (!prescriptionTypes.has(file.type)) {
        if (prescriptionPreviewUrl) URL.revokeObjectURL(prescriptionPreviewUrl);
        setPrescriptionPreviewUrl("");
        setValues((current) => ({ ...current, prescriptionFile: null }));
        setErrors((current) => ({ ...current, prescriptionFile: "Only JPG, PNG and PDF prescriptions are allowed." }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        if (prescriptionPreviewUrl) URL.revokeObjectURL(prescriptionPreviewUrl);
        setPrescriptionPreviewUrl("");
        setValues((current) => ({ ...current, prescriptionFile: null }));
        setErrors((current) => ({ ...current, prescriptionFile: "Prescription file must be 5 MB or smaller." }));
        return;
      }
      if (prescriptionPreviewUrl) URL.revokeObjectURL(prescriptionPreviewUrl);
      setPrescriptionPreviewUrl(URL.createObjectURL(file));
    }

    setValues((current) => ({
      ...current,
      [name]: files ? file : value
    }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!/^[6-9]\d{9}$/.test(values.mobile.trim())) nextErrors.mobile = "Enter a valid 10-digit mobile number.";
    if (!selectedItems.length) nextErrors.selectedTestOrPackage = "Select a test or package.";
    if (!values.prescriptionFile) nextErrors.prescriptionFile = "Upload a JPG, PNG or PDF prescription.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveBookingAndOpenWhatsApp = async () => {
    setStatus({ type: "", message: "" });
    setSubmitting(true);

    try {
      const selectedLines = selectedItems.map(
        (item) => `- ${item.name} (${item.resultType}) - ${price(item.discountedPrice)}`
      );
      const total = selectedItems.reduce((sum, item) => sum + Number(item.discountedPrice || 0), 0);
      const saved = await createBookingLead({
        ...values,
        source: modal ? "hero-booking-popup" : "booking-form",
        selectedTestOrPackage: selectedItems.map((item) => `${item.name} (${item.resultType})`).join(", "),
        items: JSON.stringify(selectedItems.map((item) => ({
          ...item,
          type: item.resultType.toLowerCase(),
          price: item.discountedPrice,
          oldPrice: item.originalPrice,
          quantity: 1
        }))),
        summary: JSON.stringify({
          itemCount: selectedItems.length,
          subtotal: total,
          totalPayable: total
        }),
        totalPayable: total,
        quantity: selectedItems.length,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "COD",
        bookingStatus: "Confirmed"
      });
      const booking = saved?.data || saved;
      const prescriptionLink = assetUrl(booking?.prescriptionFile || "");
      const message = [
        "Hi, I want to book lab tests.",
        "",
        `Full Name: ${values.fullName}`,
        `Mobile Number: ${values.mobile}`,
        `Reference ID: ${booking?.bookingId || ""}`,
        prescriptionLink ? `Prescription: ${prescriptionLink}` : "",
        "",
        "Selected Tests/Packages:",
        ...selectedLines,
        "",
        `Total Amount: ${price(total)}`
      ].filter(Boolean).join("\n");

      setStatus({ type: "success", message: "Booking request saved. WhatsApp opened for manual share." });
      window.open(`https://wa.me/91${data.siteSettings.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    } catch (error) {
      setStatus({ type: "error", message: error?.response?.data?.message || "Could not save booking request. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!validate()) return;

    if (!getStoredUser()) {
      setPendingBooking(true);
      setAuthMode("signin");
      setAuthModalOpen(true);
      return;
    }

    saveBookingAndOpenWhatsApp();
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    if (pendingBooking) {
      setPendingBooking(false);
      saveBookingAndOpenWhatsApp();
    }
  };

  const addSearchItem = (item) => {
    if (!selectedItems.some((selected) => selected.id === item.id && selected.resultType === item.resultType)) {
      setSelectedItems((current) => [...current, item]);
      addCartItem({ ...item, type: item.resultType.toLowerCase(), price: item.discountedPrice, oldPrice: item.originalPrice });
    }
    setErrors((current) => ({ ...current, selectedTestOrPackage: "" }));
  };

  return (
    <section id={modal ? undefined : "booking"} className={modal ? "" : "bg-white py-14 lg:py-20"}>
      <div className={modal ? "" : "container-page"}>
        <div className={`grid gap-2 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-soft ${modal ? "" : "lg:grid-cols-[0.62fr_1.1fr]"}`}>
          <form className="bg-navy-950 p-5 text-white sm:p-8" onSubmit={submit} noValidate>
            <div className="text-center">
              <h2 className="text-3xl font-black">{textValue(content?.title, "Book Your Test Now")}</h2>
              <p className="mt-2 text-sm font-bold text-green-200">{textValue(content?.subtitle, "Quick - Easy - Reliable")}</p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="sr-only">Full Name</span>
                <input
                  name="fullName"
                  type="text"
                  value={values.fullName}
                  onChange={update}
                  placeholder="Full Name"
                  className="focus-ring w-full rounded-lg border border-white/10 bg-white px-4 py-4 text-sm font-bold text-navy-900 placeholder:text-navy-600"
                />
                <FieldError>{errors.fullName}</FieldError>
              </label>
              <label className="block">
                <span className="sr-only">Mobile Number</span>
                <input
                  name="mobile"
                  type="tel"
                  value={values.mobile}
                  onChange={update}
                  placeholder="Mobile Number"
                  className="focus-ring w-full rounded-lg border border-white/10 bg-white px-4 py-4 text-sm font-bold text-navy-900 placeholder:text-navy-600"
                />
                <FieldError>{errors.mobile}</FieldError>
              </label>
            </div>

            <div className="relative mt-4">
                <div className="flex overflow-hidden rounded-lg bg-white">
                  <Search className="ml-4 h-5 w-5 self-center text-navy-600" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search Tests or Packages"
                    className="w-full px-3 py-4 text-sm font-bold text-navy-900 outline-none"
                  />
                </div>
                {query.trim() && (
                  <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg bg-white p-2 text-navy-900 shadow-soft">
                    {searchResults.map((item) => (
                      <button
                        type="button"
                        onClick={() => addSearchItem(item)}
                        className="grid w-full gap-1 border-b border-blue-50 px-3 py-2 text-left last:border-0 sm:grid-cols-[1fr_70px_80px]"
                        key={`${item.resultType}-${item.id}`}
                      >
                        <span className="truncate text-xs font-black">{item.name}</span>
                        <span className="text-xs font-bold text-navy-600">{item.resultType}</span>
                        <span className="text-xs font-black text-upchar-green">{price(item.discountedPrice)}</span>
                      </button>
                    ))}
                    {!searchResults.length && <p className="px-3 py-3 text-center text-xs font-bold text-navy-600">No matching tests or packages.</p>}
                  </div>
                )}
                <FieldError>{errors.selectedTestOrPackage}</FieldError>
                {selectedItems.length > 0 && (
                  <div className="mt-3 grid gap-2">
                    {selectedItems.map((item) => (
                      <div className="grid gap-2 rounded-lg border border-blue-500/40 bg-white/5 px-3 py-2 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center" key={`${item.resultType}-${item.id}`}>
                        <span className="truncate text-xs font-black">{item.name}</span>
                        <span className="text-xs font-bold text-blue-100 sm:text-right">{item.resultType}</span>
                        <span className="text-xs font-black text-green-200 sm:text-right">{price(item.discountedPrice)}</span>
                        <button className="justify-self-start sm:justify-self-auto" type="button" onClick={() => setSelectedItems((current) => current.filter((selected) => !(selected.id === item.id && selected.resultType === item.resultType)))} aria-label={`Remove ${item.name}`}>
                          <X className="h-4 w-4 text-red-200" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            <div className="mt-6 text-center">
              <p className="text-sm font-black text-white">Attach Your Prescription on WhatsApp</p>
            </div>

            <label className="mt-3 grid cursor-pointer gap-3 rounded-lg border border-dashed border-blue-400/50 bg-white/5 p-4 text-center transition hover:bg-white/10">
              <UploadCloud className="mx-auto h-9 w-9 text-upchar-green" />
              <span className="text-sm font-black text-white">Upload prescription JPG, PNG or PDF</span>
              <span className="text-xs font-semibold text-blue-100">Maximum file size 5 MB</span>
              <input
                name="prescriptionFile"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                className="sr-only"
                onChange={update}
              />
            </label>
            <FieldError>{errors.prescriptionFile}</FieldError>

            {values.prescriptionFile ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-blue-400/40 bg-white/5">
                <div className="flex items-center justify-between gap-3 border-b border-blue-400/30 px-4 py-3">
                  <span className="min-w-0 truncate text-xs font-black text-white">{values.prescriptionFile.name}</span>
                  <span className="text-xs font-semibold text-blue-100">{Math.ceil(values.prescriptionFile.size / 1024)} KB</span>
                </div>
                {values.prescriptionFile.type === "application/pdf" ? (
                  <iframe src={prescriptionPreviewUrl} title="Prescription PDF preview" className="h-48 w-full bg-white" />
                ) : (
                  <img src={prescriptionPreviewUrl} alt="Prescription preview" className="max-h-48 w-full bg-white object-contain" />
                )}
              </div>
            ) : null}

            <button type="submit" className="mt-5 flex w-full items-center justify-center gap-3 rounded-lg bg-upchar-green px-6 py-4 text-base font-black text-white transition hover:bg-upchar-greenDark disabled:cursor-not-allowed disabled:opacity-70" disabled={submitting}>
              {submitting ? "Booking..." : "Book Test Now"}
              <ArrowRight className="h-5 w-5" />
            </button>

            {status.message && (
              <p
                className={`mt-4 rounded-lg px-4 py-3 text-sm font-bold ${
                  status.type === "success" ? "bg-green-500/15 text-green-100" : "bg-red-500/15 text-red-100"
                }`}
              >
                {status.message}
              </p>
            )}

            <div className="mt-6 grid gap-3 text-xs font-bold text-green-100 sm:grid-cols-3">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-upchar-green" />
                Secure Payment
              </span>
              <span className="inline-flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-upchar-green" />
                100% Confidential
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="Headphones" className="h-5 w-5 text-upchar-green" />
                Quick Support
              </span>
            </div>

            <div className="mt-7 flex items-center gap-4 rounded-lg border border-blue-500/40 bg-white/5 p-4">
              <FileUp className="h-8 w-8 text-upchar-green" />
              <p className="text-sm font-bold text-blue-50">{textValue(content?.description, "Get fast and accurate reports delivered on time.")}</p>
            </div>
          </form>

          {!modal && <div className="relative min-h-[520px] overflow-hidden bg-blue-50">
            {mapEmbedUrl ? (
              <iframe title={serviceLocation.centerName || "Service location map"} src={mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" />
            ) : (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(32deg,transparent_48%,rgba(17,85,204,0.22)_49%,rgba(17,85,204,0.22)_51%,transparent_52%),linear-gradient(118deg,transparent_48%,rgba(9,148,71,0.18)_49%,rgba(9,148,71,0.18)_51%,transparent_52%)] bg-[length:170px_170px]" />
                <div className="absolute inset-0 soft-dot-pattern opacity-70" />
              </>
            )}
            {openMapUrl ? (
              <button
                type="button"
                className="absolute inset-0 z-[2] cursor-pointer border-0 bg-transparent"
                onClick={() => window.open(openMapUrl, "_blank", "noopener,noreferrer")}
                aria-label="Open location in Google Maps"
              />
            ) : null}
            <div className="pointer-events-none absolute left-[54%] top-[45%] z-[3] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-navy-800 text-white shadow-soft">
                <MapPin className="h-9 w-9 fill-upchar-red text-upchar-red" />
              </span>
              <span className="mt-2 rounded-full bg-white px-4 py-1 text-sm font-black text-upchar-blue shadow-card">
                {serviceLocationLoaded ? serviceLocation?.areaLabel || serviceLocation?.city || "Location unavailable" : "Loading location..."}
              </span>
            </div>
            <div className="absolute right-5 top-6 z-[4] max-w-sm rounded-xl bg-white p-6 shadow-soft">
              <div className="flex gap-3">
                <MapPin className="h-6 w-6 text-navy-800" />
                <div>
                  <h3 className="text-lg font-black text-navy-900">{serviceLocationLoaded ? serviceLocation?.centerName || "Service location unavailable" : "Loading service location..."}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">{serviceLocation?.fullAddress || ""}</p>
                </div>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm font-black text-upchar-green">
                <Clock3 className="h-5 w-5 text-navy-800" />
                {serviceLocation?.openStatusText || (serviceLocation?.openingTime && serviceLocation?.closingTime ? `Open today: ${serviceLocation.openingTime} - ${serviceLocation.closingTime}` : "")}
              </p>
              <a href={directionUrl || "#"} target={directionUrl ? "_blank" : undefined} rel={directionUrl ? "noreferrer" : undefined} className="mt-5 flex items-center justify-center gap-3 rounded-lg border border-upchar-blue px-5 py-3 text-sm font-black text-upchar-blue">
                Get Directions
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-[4] m-5 grid gap-3 rounded-xl bg-white p-4 shadow-card sm:grid-cols-3">
              {[
                ["Bike", "Home Sample Collection", "Available"],
                ["FileCheck2", "Reports", "Same Day / Next Day"],
                ["BadgeIndianRupee", "Best Price Guaranteed", "Affordable pricing always"]
              ].map(([icon, title, text]) => (
                <div className="flex items-center gap-4 border-blue-100 sm:border-r last:border-r-0" key={title}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-upchar-green">
                    <Icon name={icon} className="h-7 w-7" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-navy-900">{title}</span>
                    <span className="text-xs font-semibold text-navy-700">{text}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute right-6 top-1/2 z-[5] overflow-hidden rounded-lg bg-white shadow-card">
              <button className="block h-12 w-12 text-2xl font-black text-navy-900" aria-label="Zoom in">
                +
              </button>
              <button className="block h-12 w-12 border-t border-blue-100 text-2xl font-black text-navy-900" aria-label="Zoom out">
                -
              </button>
            </div>
          </div>}
        </div>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </section>
  );
}

export default BookingMapSection;
