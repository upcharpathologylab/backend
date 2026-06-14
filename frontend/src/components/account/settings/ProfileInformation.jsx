import { Pencil } from "lucide-react";
import StatusBadge from "../StatusBadge.jsx";
import Icon from "../../Icon.jsx";
import { settingsProfileFields } from "../../../data/accountPagesData.js";

const fieldIcons = ["UserRound", "Mail", "Phone", "CalendarDays", "UsersRound", "Droplet"];

const profileFields = (profile) => profile
  ? [
      ["Full Name", profile.fullName || "", ""],
      ["Email Address", profile.email || "", "Verified"],
      ["Mobile Number", profile.phone || "", "Verified"],
      ["Date of Birth", profile.dateOfBirth || "", ""],
      ["Gender", profile.gender || "", ""],
      ["Blood Group", profile.bloodGroup || "", ""]
    ]
  : settingsProfileFields;

function ProfileInformation({ profile, onEdit }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-upchar-blue">
            <Icon name="UserRound" className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-black text-navy-900">Profile Information</h2>
            <p className="mt-1 text-sm font-semibold text-navy-600">Update your personal details</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-blue-100 px-4 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {profileFields(profile).map(([label, value, badge], index) => (
          <div className="grid gap-3 rounded-md p-2 sm:grid-cols-[180px_1fr] sm:items-center" key={label}>
            <span className="inline-flex items-center gap-3 text-sm font-semibold text-navy-600">
              <Icon name={fieldIcons[index]} className="h-5 w-5 text-upchar-blue" />
              {label}
            </span>
            <span className="flex flex-wrap items-center gap-3 text-sm font-black text-navy-900">
              {value}
              {badge ? <StatusBadge label={badge} /> : null}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProfileInformation;
