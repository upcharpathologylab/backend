import StatusBadge from "./StatusBadge.jsx";

function UserProfileCard({ profile }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-green-50 text-xl font-black text-upchar-blue">
          {profile.avatarInitials || profile.fullName?.slice(0, 2) || "UP"}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-black text-navy-900">{profile.fullName}</h2>
          <p className="mt-1 truncate text-xs font-semibold text-navy-700">{profile.email}</p>
          {profile.verified ? <div className="mt-2"><StatusBadge label="Verified" /></div> : null}
        </div>
      </div>
    </section>
  );
}

export default UserProfileCard;
