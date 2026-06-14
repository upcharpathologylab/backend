import { CalendarDays, Droplet, Ellipsis, Pencil, Trash2, UserRound } from "lucide-react";

const colorStyles = {
  green: "bg-green-50 text-upchar-green",
  blue: "bg-blue-50 text-upchar-blue",
  purple: "bg-violet-50 text-upchar-purple",
  orange: "bg-orange-50 text-upchar-orange"
};

function MemberAvatar({ member }) {
  const initials = (member.fullName || member.name || "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-black ${colorStyles[member.color] || colorStyles.blue}`}>
      {initials || <UserRound className="h-10 w-10" />}
    </span>
  );
}

function InfoBlock({ icon: IconComponent, label, value }) {
  return (
    <div className="flex items-center gap-3 border-blue-100 pr-5 md:border-r md:last:border-r-0">
      <IconComponent className="h-6 w-6 text-upchar-blue" />
      <span>
        <span className="block text-xs font-black text-navy-600">{label}</span>
        <span className="mt-1 block text-sm font-black text-navy-900">{value}</span>
      </span>
    </div>
  );
}

function FamilyMemberCard({ member, menuOpen, onToggleMenu, onEdit, onDelete }) {
  const name = member.fullName || member.name;

  return (
    <article className="relative rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
      <div className="grid gap-6 xl:grid-cols-[130px_1fr_150px] xl:items-start">
        <MemberAvatar member={member} />
        <div>
          <h2 className="text-2xl font-black text-navy-900">{name}</h2>
          <span className={`mt-3 inline-flex rounded-md px-3 py-1.5 text-sm font-black ${colorStyles[member.color] || colorStyles.green}`}>
            {member.relation}
          </span>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            <InfoBlock icon={CalendarDays} label="Date of Birth" value={member.dateOfBirth} />
            <InfoBlock icon={UserRound} label="Gender" value={member.gender} />
            <InfoBlock icon={Droplet} label="Blood Group" value={member.bloodGroup} />
          </div>
        </div>
        <div className="flex justify-start gap-3 xl:justify-end">
          <button
            type="button"
            onClick={() => onEdit(member)}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-blue-100 bg-white px-4 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onToggleMenu(member.id)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-blue-100 bg-white text-upchar-blue transition hover:bg-blue-50"
            aria-label={`Open menu for ${name}`}
          >
            <Ellipsis className="h-5 w-5" />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="absolute right-6 top-20 z-20 w-48 rounded-lg border border-blue-100 bg-white p-2 shadow-soft">
          <button
            type="button"
            onClick={() => onEdit(member)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-black text-navy-900 hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4 text-upchar-blue" />
            Edit Member
          </button>
          <button
            type="button"
            onClick={() => onDelete(member)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-black text-upchar-red hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Member
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default FamilyMemberCard;
