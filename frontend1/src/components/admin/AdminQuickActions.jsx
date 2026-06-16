import { ClipboardList, FolderOpen, FlaskConical, Gift, Tag, TicketPercent, FileText } from "lucide-react";

const actions = [
  { title: "Add Test", icon: FlaskConical, color: "green" },
  { title: "Add Package", icon: Gift, color: "green" },
  { title: "Add Category", icon: FolderOpen, color: "blue" },
  { title: "Add Discount", icon: Tag, color: "purple" },
  { title: "Add Coupon", icon: TicketPercent, color: "orange" },
  { title: "Manage Orders", icon: ClipboardList, color: "green" },
  { title: "View Reports", icon: FileText, color: "blue" }
];

const colors = {
  blue: "bg-blue-50 text-upchar-blue",
  green: "bg-green-50 text-upchar-green",
  orange: "bg-orange-50 text-upchar-orange",
  purple: "bg-violet-50 text-upchar-purple"
};

function AdminQuickActions() {
  return (
    <section className="min-w-0 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <h2 className="text-xl font-black text-navy-950">Quick Actions</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <a href="#" className="flex items-center justify-center gap-4 rounded-lg border border-blue-100 bg-white px-5 py-4 text-sm font-black text-navy-900 transition hover:-translate-y-0.5 hover:shadow-card" key={action.title}>
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${colors[action.color]}`}>
                <Icon className="h-6 w-6" />
              </span>
              {action.title}
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default AdminQuickActions;
