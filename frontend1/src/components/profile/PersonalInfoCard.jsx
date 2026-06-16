import { BadgeCheck, Mail, Pencil, Phone, UserRound } from "lucide-react";

function InfoField({ label, value, verified = false }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/30 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-navy-500">{label}</p>
      <p className="mt-2 flex items-center gap-2 text-sm font-black text-navy-900">
        {value}
        {verified ? <BadgeCheck className="h-4 w-4 text-upchar-green" /> : null}
      </p>
    </div>
  );
}

function PersonalInfoCard({ profile, onEdit }) {
  const leftFields = [
    ["Full Name", profile.fullName],
    ["Date of Birth", profile.dateOfBirth],
    ["Gender", profile.gender],
    ["Blood Group", profile.bloodGroup]
  ];

  const rightFields = [
    ["Mobile Number", profile.phone, true],
    ["Email Address", profile.email, true],
    ["Alternate Number", profile.alternateNumber],
    ["Preferred Language", profile.preferredLanguage]
  ];

  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-2xl font-black text-navy-900">
          <UserRound className="h-6 w-6 text-upchar-blue" />
          Personal Information
        </h2>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-blue-100 bg-white px-5 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="grid gap-4">
          {leftFields.map(([label, value]) => (
            <InfoField label={label} value={value} key={label} />
          ))}
        </div>
        <div className="grid gap-4">
          {rightFields.map(([label, value, verified]) => (
            <InfoField label={label} value={value} verified={verified} key={label} />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-lg border border-green-100 bg-green-50/40 p-4 sm:grid-cols-2">
        <p className="flex items-center gap-3 text-sm font-bold text-navy-800">
          <Phone className="h-5 w-5 text-upchar-green" />
          Mobile and WhatsApp updates enabled
        </p>
        <p className="flex items-center gap-3 text-sm font-bold text-navy-800">
          <Mail className="h-5 w-5 text-upchar-green" />
          Reports will be sent to your email
        </p>
      </div>
    </section>
  );
}

export default PersonalInfoCard;
