import { Pencil, Plus, Trash2, UserRound } from "lucide-react";

const colorStyles = {
  green: "bg-green-50 text-upchar-green",
  blue: "bg-blue-50 text-upchar-blue",
  purple: "bg-violet-50 text-upchar-purple",
  orange: "bg-orange-50 text-upchar-orange"
};

function MemberAvatar({ member }) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-black ${colorStyles[member.color] || colorStyles.green}`}>
      {initials}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm font-semibold text-navy-800">
      <span>{label}</span>
      <span className="font-black text-navy-900">{value}</span>
    </div>
  );
}

function FamilyMembersSection({ members, onAdd, onEdit, onDelete }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-2xl font-black text-navy-900">
          <UserRound className="h-6 w-6 text-upchar-blue" />
          Family Members
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-blue-100 bg-white px-5 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
        >
          <Plus className="h-4 w-4" />
          Add Family Member
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm" key={member.id}>
            <div className="flex items-center gap-4">
              <MemberAvatar member={member} />
              <div>
                <h3 className="text-lg font-black text-navy-900">{member.name}</h3>
                <span className={`mt-2 inline-flex rounded-md px-3 py-1 text-xs font-black ${colorStyles[member.color] || colorStyles.green}`}>
                  {member.relation}
                </span>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <DetailRow label="Date of Birth" value={member.dateOfBirth} />
              <DetailRow label="Gender" value={member.gender} />
              <DetailRow label="Blood Group" value={member.bloodGroup} />
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onEdit(member)}
                className="inline-flex items-center gap-2 text-sm font-black text-upchar-blue"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(member)}
                className="inline-flex items-center gap-2 text-sm font-black text-upchar-red"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FamilyMembersSection;
