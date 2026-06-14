import {
  Archive,
  AlertTriangle,
  BadgeCheck,
  Bell,
  Boxes,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  CreditCard,
  Database,
  EyeOff,
  FileText,
  FileUp,
  FlaskConical,
  FolderOpen,
  Gift,
  Globe,
  Image,
  IndianRupee,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  PauseCircle,
  ReceiptText,
  RotateCcw,
  Send,
  ShieldCheck,
  Tag,
  ThumbsUp,
  TicketPercent,
  Truck,
  UserPlus,
  UserRoundCheck,
  UsersRound,
  UserX,
  XCircle
} from "lucide-react";

const iconMap = {
  archive: Archive,
  badge: BadgeCheck,
  bell: Bell,
  box: Boxes,
  calendar: CalendarCheck,
  chart: ClipboardList,
  check: CheckCircle2,
  clipboard: ClipboardList,
  clock: Clock3,
  card: CreditCard,
  database: Database,
  eyeOff: EyeOff,
  file: FileText,
  fileUpload: FileUp,
  folder: FolderOpen,
  gift: Gift,
  grid: Boxes,
  globe: Globe,
  image: Image,
  lock: LockKeyhole,
  map: MapPin,
  message: MessageSquareText,
  pause: PauseCircle,
  percent: TicketPercent,
  receipt: ReceiptText,
  refresh: RotateCcw,
  rupee: IndianRupee,
  send: Send,
  shield: ShieldCheck,
  tag: Tag,
  thumbsUp: ThumbsUp,
  ticket: TicketPercent,
  truck: Truck,
  user: UserRoundCheck,
  userPlus: UserPlus,
  userX: UserX,
  warning: AlertTriangle,
  users: UsersRound,
  x: XCircle
};

const colorMap = {
  blue: "bg-blue-50 text-upchar-blue",
  cyan: "bg-cyan-50 text-cyan-600",
  green: "bg-green-50 text-upchar-green",
  orange: "bg-orange-50 text-upchar-orange",
  purple: "bg-violet-50 text-upchar-purple",
  red: "bg-red-50 text-upchar-red"
};

function AdminStatsGrid({ stats }) {
  return (
    <section className={`grid gap-5 ${stats.length === 5 ? "sm:grid-cols-2 xl:grid-cols-5" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] || FlaskConical;
        const textClass =
          stat.tone === "red"
            ? "text-upchar-red"
            : stat.tone === "green" || stat.text?.startsWith("Up ")
              ? "text-upchar-green"
              : "text-navy-700";
        return (
          <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm" key={stat.title}>
            <div className="flex items-center gap-5">
              <span className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl ${colorMap[stat.color] || colorMap.green}`}>
                <Icon className="h-10 w-10" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black text-navy-600">{stat.title}</span>
                <span className="mt-2 block break-words text-3xl font-black leading-tight text-navy-950">{stat.value}</span>
                <span className={`mt-2 block text-sm font-semibold ${textClass}`}>{stat.text}</span>
                {stat.progress ? (
                  <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <span className={`block h-full rounded-full ${stat.progressClass || "bg-upchar-green"}`} style={{ width: stat.progress }} />
                  </span>
                ) : null}
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default AdminStatsGrid;
