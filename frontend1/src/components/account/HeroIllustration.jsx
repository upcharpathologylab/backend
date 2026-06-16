import Icon from "../Icon.jsx";

const heroConfig = {
  bookings: {
    icon: "CalendarCheck",
    smallIcons: ["BadgeCheck", "ClipboardList", "Clock3"],
    label: "Bookings"
  },
  reports: {
    icon: "FileText",
    smallIcons: ["TestTube2", "Search", "Leaf"],
    label: "Lab Report"
  },
  support: {
    icon: "Headphones",
    smallIcons: ["MessageCircle", "Mail", "Phone"],
    label: "Support"
  }
};

function HeroIllustration({ type = "bookings" }) {
  const config = heroConfig[type] || heroConfig.bookings;

  return (
    <div className="relative hidden min-h-[150px] w-[360px] max-w-full overflow-hidden rounded-lg border border-blue-100 bg-blue-50/70 p-5 lg:block">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/70" />
      <div className="absolute bottom-4 left-5 right-5 h-16 rounded-full bg-white/50 blur-xl" />
      <div className="relative ml-auto flex h-28 w-36 items-center justify-center rounded-lg bg-white shadow-card">
        <span className="absolute -top-4 left-6 h-8 w-3 rounded-full bg-upchar-blue" />
        <span className="absolute -top-4 right-6 h-8 w-3 rounded-full bg-upchar-blue" />
        <Icon name={config.icon} className="h-16 w-16 text-upchar-blue" strokeWidth={1.9} />
        <span className="absolute -left-8 bottom-5 flex h-14 w-14 items-center justify-center rounded-full bg-upchar-green text-white shadow-lg">
          <Icon name="BadgeCheck" className="h-8 w-8" />
        </span>
      </div>
      <div className="relative mt-4 flex justify-end gap-3">
        {config.smallIcons.map((icon) => (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-upchar-green shadow-sm" key={icon}>
            <Icon name={icon} className="h-5 w-5" />
          </span>
        ))}
      </div>
      <p className="absolute left-5 top-5 text-sm font-black uppercase tracking-wide text-navy-600">{config.label}</p>
    </div>
  );
}

export default HeroIllustration;
