import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LogOut, UploadCloud, X } from "lucide-react";
import EditProfileModal from "../components/profile/EditProfileModal.jsx";
import AccountSidebar from "../components/account/AccountSidebar.jsx";
import Footer from "../components/Footer.jsx";
import FormModal from "../components/profile/FormModal.jsx";
import Header from "../components/Header.jsx";
import PersonalInfoCard from "../components/profile/PersonalInfoCard.jsx";
import ProfileHeaderCard from "../components/profile/ProfileHeaderCard.jsx";
import ProfileTrustStrip from "../components/profile/ProfileTrustStrip.jsx";
import QuickActions from "../components/profile/QuickActions.jsx";
import { getUserProfile, getUserProfileSummary, updateUserProfile, updateUserProfileImage, uploadUserPrescription } from "../api/api.js";
import { clearAuthSession, getStoredUser, AUTH_USER_KEY } from "../components/auth/authStorage.js";
import { fallbackHomeData } from "../data/homeData.js";
import { assetUrl } from "../api/api.js";
import { price } from "../utils.js";
import { cartEventName, getCartItems, removeCartItem } from "../utils/cart.js";
const optimizeProfileImage = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const sourceUrl = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 300;
      const sourceSize = Math.min(image.width, image.height);
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d").drawImage(
        image,
        (image.width - sourceSize) / 2,
        (image.height - sourceSize) / 2,
        sourceSize,
        sourceSize,
        0,
        0,
        size,
        size
      );
      URL.revokeObjectURL(sourceUrl);
      canvas.toBlob(
        (blob) => blob
          ? resolve(new File([blob], "profile-photo.webp", { type: "image/webp" }))
          : reject(new Error("Could not optimize profile photo.")),
        "image/webp",
        0.82
      );
    };
    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      reject(new Error("The selected file is not a valid image."));
    };
    image.src = sourceUrl;
  });

const emptySummary = {
  totalBookings: "0",
  reportsGenerated: "0",
  upcomingAppointments: "0",
  totalSpent: "Rs. 0"
};

const emptyProfile = {
  fullName: "",
  email: "",
  phone: "",
  alternateNumber: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  preferredLanguage: "",
  verified: false
};

const formatProfileSummary = (summary = {}) => ({
  totalBookings: String(summary.totalBookings ?? 0),
  reportsGenerated: String(summary.reportsGenerated ?? 0),
  upcomingAppointments: String(summary.upcomingAppointments ?? 0),
  totalSpent: price(Number(summary.totalSpent || 0))
});

const prescriptionTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);

function UploadPrescriptionModal({ file, onClose, onFileChange, onSend, previewUrl, profile, sending }) {
  const isImage = file && file.type !== "application/pdf";

  return (
    <FormModal
      title="Upload Prescription"
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 rounded-md border border-blue-100 px-6 text-sm font-black text-navy-800">
            Cancel
          </button>
          <button type="button" onClick={onSend} disabled={!file || sending} className="h-11 rounded-md bg-upchar-green px-6 text-sm font-black text-white transition hover:bg-upchar-greenDark disabled:opacity-60">
            {sending ? "Sending..." : "Send Prescription"}
          </button>
        </div>
      }
    >
      <div className="grid gap-5">
        <div className="grid gap-3 rounded-lg border border-blue-100 bg-blue-50/30 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-navy-500">Name</p>
            <p className="mt-1 text-sm font-black text-navy-950">{profile.fullName || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-navy-500">Mobile</p>
            <p className="mt-1 text-sm font-black text-navy-950">{profile.phone || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-navy-500">Email</p>
            <p className="mt-1 text-sm font-black text-navy-950">{profile.email || "-"}</p>
          </div>
        </div>

        <label className="grid cursor-pointer gap-3 rounded-lg border border-dashed border-blue-200 bg-white p-5 text-center transition hover:bg-blue-50/40">
          <UploadCloud className="mx-auto h-10 w-10 text-upchar-blue" />
          <span className="text-sm font-black text-navy-950">Choose JPG, PNG or PDF prescription</span>
          <span className="text-xs font-semibold text-navy-600">Maximum file size 5 MB</span>
          <input type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" className="sr-only" onChange={(event) => onFileChange(event.target.files?.[0])} />
        </label>

        {file ? (
          <div className="rounded-lg border border-blue-100 bg-slate-50 p-4">
            <p className="text-sm font-black text-navy-950">{file.name}</p>
            <p className="mt-1 text-xs font-semibold text-navy-600">{Math.ceil(file.size / 1024)} KB</p>
            <div className="mt-4 overflow-hidden rounded-md border border-blue-100 bg-white">
              {isImage ? (
                <img src={previewUrl} alt="Prescription preview" className="max-h-72 w-full object-contain" />
              ) : (
                <iframe src={previewUrl} title="Prescription PDF preview" className="h-72 w-full" />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </FormModal>
  );
}

function MyAccountPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profile, setProfile] = useState(emptyProfile);
  const [toast, setToast] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreviewUrl, setPrescriptionPreviewUrl] = useState("");
  const [prescriptionSending, setPrescriptionSending] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [cartItems, setCartItems] = useState(() => getCartItems());
  const section = searchParams.get("section") || "profile";
  const activeSection = section === "saved-packages" ? "saved" : section;

  useEffect(() => {
    document.title = "My Account / Profile | Upchar Pathology";
    const authUser = getStoredUser();
    const authProfile = authUser
      ? {
          fullName: authUser.fullName || authUser.name || "",
          email: authUser.email || "",
          phone: authUser.phone || ""
        }
      : {};

    setProfile({ ...emptyProfile, ...authProfile, ...emptySummary });

    if (authUser) {
      getUserProfile()
        .then((serverProfile) => {
          setProfile((current) => ({ ...current, ...serverProfile }));
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...authUser, ...serverProfile }));
        })
        .catch(() => {});

      getUserProfileSummary()
        .then((summary) => setProfile((current) => ({ ...current, ...formatProfileSummary(summary) })))
        .catch(() => setProfile((current) => ({ ...current, ...emptySummary })));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (prescriptionPreviewUrl) URL.revokeObjectURL(prescriptionPreviewUrl);
    };
  }, [prescriptionPreviewUrl]);

  useEffect(() => {
    const refreshCart = () => setCartItems(getCartItems());
    window.addEventListener(cartEventName, refreshCart);
    window.addEventListener("storage", refreshCart);
    return () => {
      window.removeEventListener(cartEventName, refreshCart);
      window.removeEventListener("storage", refreshCart);
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleProfileSave = async (values) => {
    try {
      await updateUserProfile(values);
      const savedProfile = await getUserProfile();
      setProfile((current) => ({ ...current, ...savedProfile }));
      const storedUser = getStoredUser();
      if (storedUser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...storedUser, ...savedProfile }));
      }
      setProfileModalOpen(false);
      showToast("Profile updated successfully.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not update profile.");
    }
  };

  const handleProfileImageUpload = async (file) => {
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(file.type)) {
      showToast("Only JPG, JPEG, PNG and WEBP images are allowed.");
      return false;
    }
    if (file.size > 4 * 1024 * 1024) {
      showToast("Profile image must be 4 MB or smaller.");
      return false;
    }

    setImageUploading(true);
    setImageUploadProgress(0);
    try {
      const optimizedFile = await optimizeProfileImage(file);
      const result = await updateUserProfileImage(optimizedFile, (event) => {
        if (event.total) setImageUploadProgress(Math.round((event.loaded * 100) / event.total));
      });
      setProfile((current) => ({ ...current, profileImage: result.profileImage }));
      const storedUser = getStoredUser();
      if (storedUser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...storedUser, profileImage: result.profileImage }));
      }
      showToast("Profile photo updated successfully.");
      return true;
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not upload profile photo.");
      return false;
    } finally {
      setImageUploading(false);
      setImageUploadProgress(0);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    showToast("Logged out successfully");
    window.setTimeout(() => navigate("/"), 700);
  };

  const selectAccountSection = (sectionId, select = false) => {
    if (sectionId === "prescription") {
      if (select) setPrescriptionModalOpen(true);
      return true;
    }
    const localSections = ["profile", "appointments", "saved"];
    if (!localSections.includes(sectionId)) return false;
    if (select) setSearchParams({ section: sectionId === "saved" ? "saved-packages" : sectionId });
    return true;
  };

  const removeSavedPackage = (item) => {
    removeCartItem(item.id, item.type);
    showToast(`${item.name || item.title} removed from cart.`);
  };

  const handlePrescriptionFileChange = (file) => {
    if (!file) return;
    if (!prescriptionTypes.has(file.type)) {
      showToast("Only JPG, PNG and PDF prescriptions are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Prescription file must be 5 MB or smaller.");
      return;
    }
    if (prescriptionPreviewUrl) URL.revokeObjectURL(prescriptionPreviewUrl);
    setPrescriptionFile(file);
    setPrescriptionPreviewUrl(URL.createObjectURL(file));
  };

  const closePrescriptionModal = () => {
    setPrescriptionModalOpen(false);
    setPrescriptionFile(null);
    if (prescriptionPreviewUrl) URL.revokeObjectURL(prescriptionPreviewUrl);
    setPrescriptionPreviewUrl("");
  };

  const handlePrescriptionSend = async () => {
    if (!prescriptionFile) {
      showToast("Please choose a prescription file.");
      return;
    }

    try {
      setPrescriptionSending(true);
      const saved = await uploadUserPrescription(prescriptionFile);
      const whatsappNumber = String(fallbackHomeData.siteSettings.whatsappNumber || "8882753539").replace(/\D/g, "").slice(-10);
      const message = [
        "Hi, I have uploaded my prescription.",
        `Name: ${profile.fullName || ""}`,
        `Mobile: ${profile.phone || ""}`,
        `Prescription ID: ${saved.bookingId || saved.prescriptionId || ""}`
      ].join("\n");
      closePrescriptionModal();
      showToast("Prescription uploaded successfully.");
      window.open(`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not upload prescription.");
    } finally {
      setPrescriptionSending(false);
    }
  };

  const comingSoonTitle = {
    appointments: "Appointments"
  }[activeSection];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-blue-50/70 via-white to-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        <section className="container-page py-8 lg:py-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-black text-navy-800">
                <Link to="/" className="text-upchar-blue">Home</Link>
                <span className="mx-2 text-navy-400">&gt;</span>
                My Account
              </p>
              <h1 className="mt-5 text-4xl font-black text-navy-900 sm:text-5xl">My Account / Profile</h1>
              <p className="mt-4 text-base font-semibold text-navy-700">
                Manage your profile, addresses and family members
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-12 items-center gap-3 rounded-lg border border-blue-100 bg-white px-7 text-sm font-black text-upchar-red shadow-sm transition hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <AccountSidebar active={activeSection} onSectionSelect={selectAccountSection} />

            <div className="grid min-w-0 gap-6">
              {comingSoonTitle ? (
                <section className="rounded-lg border border-blue-100 bg-white p-6 text-center shadow-sm lg:p-9">
                  <h2 className="text-2xl font-black text-navy-900">{comingSoonTitle}</h2>
                  <p className="mt-3 text-base font-semibold text-navy-700">Coming Soon</p>
                  <p className="mt-2 text-sm font-semibold text-navy-700">This section will be available soon.</p>
                </section>
              ) : activeSection === "saved" ? (
                <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
                  <h2 className="text-xl font-black text-navy-900">Saved Packages</h2>
                  <div className="mt-5 grid gap-4">
                    {cartItems.length ? cartItems.map((item) => (
                      <article className="flex flex-wrap items-center gap-4 rounded-lg border border-blue-100 p-4" key={`${item.type}-${item.id}`}>
                        {item.image ? (
                          <img src={assetUrl(item.image)} alt={item.name || item.title} className="h-16 w-16 rounded-md object-cover" />
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-black text-navy-900">{item.name || item.title}</h3>
                          <p className="mt-1 text-sm font-black text-upchar-green">{price(item.price ?? item.discountedPrice ?? 0)}</p>
                          <p className="mt-1 text-sm font-semibold text-navy-700">Quantity: {Number(item.quantity || 1)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSavedPackage(item)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 text-navy-400 transition hover:border-upchar-red hover:text-upchar-red"
                          aria-label={`Remove ${item.name || item.title}`}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </article>
                    )) : (
                      <p className="py-8 text-center text-sm font-semibold text-navy-700">No saved packages yet.</p>
                    )}
                  </div>
                </section>
              ) : (
                <>
              <div id="profile-section" className="scroll-mt-36">
                <ProfileHeaderCard
                  profile={profile}
                  onProfileImageUpload={handleProfileImageUpload}
                  onProfileImageError={showToast}
                  uploading={imageUploading}
                  uploadProgress={imageUploadProgress}
                />
              </div>
              <div id="settings-section" className="scroll-mt-36">
                <PersonalInfoCard profile={profile} onEdit={() => setProfileModalOpen(true)} />
              </div>
              <QuickActions />
              <ProfileTrustStrip />
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer data={fallbackHomeData} />

      {profileModalOpen ? (
        <EditProfileModal profile={profile} onClose={() => setProfileModalOpen(false)} onSave={handleProfileSave} />
      ) : null}
      {prescriptionModalOpen ? (
        <UploadPrescriptionModal
          file={prescriptionFile}
          onClose={closePrescriptionModal}
          onFileChange={handlePrescriptionFileChange}
          onSend={handlePrescriptionSend}
          previewUrl={prescriptionPreviewUrl}
          profile={profile}
          sending={prescriptionSending}
        />
      ) : null}
      <AnimatePresence>
        {toast ? (
          <motion.div
            className="fixed bottom-6 left-1/2 z-[140] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg bg-navy-950 px-5 py-3 text-center text-sm font-black text-white shadow-soft"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default MyAccountPage;
