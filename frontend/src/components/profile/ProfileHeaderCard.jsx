import { useEffect, useRef, useState } from "react";
import { CalendarDays, Camera, Droplet, Mail, Phone, UserRound } from "lucide-react";
import { assetUrl } from "../../api/api.js";

function Avatar({ name, profileImage, onUpload, onError, uploading, uploadProgress }) {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const imageUrl = previewUrl || assetUrl(profileImage);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      onError("Only JPG, JPEG, PNG and WEBP images are allowed.");
      event.target.value = "";
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      onError("Profile image must be 4 MB or smaller.");
      event.target.value = "";
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    event.target.value = "";
  };

  const cancelSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const saveSelection = async () => {
    if (selectedFile && await onUpload(selectedFile)) cancelSelection();
  };

  return (
    <div className="relative">
      <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-green-100 text-4xl font-black text-navy-900 shadow-lg lg:h-40 lg:w-40">
        {imageUrl ? (
          <img src={imageUrl} alt={`${name} profile`} className="h-full w-full rounded-full object-cover" />
        ) : (
          initials || <UserRound className="h-16 w-16" />
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-3 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-green-50 text-upchar-green shadow-sm"
        aria-label="Change profile photo"
      >
        <Camera className="h-5 w-5" />
      </button>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={selectImage} />
      {selectedFile ? (
        <div className="absolute left-1/2 top-full mt-2 flex -translate-x-1/2 gap-2">
          <button type="button" onClick={saveSelection} disabled={uploading} className="rounded-md bg-upchar-green px-3 py-1 text-xs font-black text-white">
            {uploading ? `${uploadProgress}%` : "Save"}
          </button>
          <button type="button" onClick={cancelSelection} disabled={uploading} className="rounded-md bg-white px-3 py-1 text-xs font-black text-navy-900">
            Cancel
          </button>
        </div>
      ) : null}
    </div>
  );
}

function OverviewBox({ label, value }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 p-4">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold text-blue-100">{label}</p>
    </div>
  );
}

function ProfileHeaderCard({ profile, onProfileImageUpload, onProfileImageError, uploading = false, uploadProgress = 0 }) {
  const overview = [
    ["Total Bookings", profile.totalBookings],
    ["Reports Generated", profile.reportsGenerated],
    ["Upcoming Appointments", profile.upcomingAppointments],
    ["Total Spent", profile.totalSpent]
  ];

  return (
    <section className="overflow-hidden rounded-lg bg-gradient-to-br from-navy-900 via-upchar-blue to-navy-950 p-6 text-white shadow-card lg:p-9">
      <div className="grid gap-7 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-6 md:grid-cols-[170px_1fr] md:items-center">
          <Avatar
            name={profile.fullName}
            profileImage={profile.profileImage}
            onUpload={onProfileImageUpload}
            onError={onProfileImageError}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-black sm:text-4xl">{profile.fullName}</h2>
              {profile.verified ? (
                <span className="rounded-md bg-upchar-green px-3 py-1 text-sm font-black text-white">Verified</span>
              ) : null}
            </div>
            <div className="mt-6 grid gap-4 text-base font-semibold text-blue-50">
              <p className="flex items-center gap-4">
                <Mail className="h-5 w-5" />
                {profile.email}
              </p>
              <p className="flex items-center gap-4">
                <Phone className="h-5 w-5" />
                {profile.phone}
              </p>
              <p className="flex items-center gap-4">
                <CalendarDays className="h-5 w-5" />
                Member since {profile.memberSince}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:self-center">
          {overview.map(([label, value]) => (
            <OverviewBox label={label} value={value} key={label} />
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 border-t border-white/20 pt-7 sm:grid-cols-3">
        <div className="flex items-center gap-4">
          <CalendarDays className="h-9 w-9" />
          <span>
            <span className="block text-sm font-bold text-blue-100">Date of Birth</span>
            <span className="mt-1 block text-base font-black">{profile.dateOfBirth}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <UserRound className="h-9 w-9" />
          <span>
            <span className="block text-sm font-bold text-blue-100">Gender</span>
            <span className="mt-1 block text-base font-black">{profile.gender}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Droplet className="h-9 w-9" />
          <span>
            <span className="block text-sm font-bold text-blue-100">Blood Group</span>
            <span className="mt-1 block text-base font-black">{profile.bloodGroup}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

export default ProfileHeaderCard;
