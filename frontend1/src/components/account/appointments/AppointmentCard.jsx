import { CalendarDays, Clock3, Home, MapPin, UsersRound } from "lucide-react";
import StatusBadge from "../StatusBadge.jsx";

function AppointmentCard({ appointment, onAction }) {
  return (
    <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_1.2fr_190px] xl:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-xl font-black text-upchar-blue">
            {appointment.avatar}
          </span>
          <div>
            <h3 className="text-lg font-black text-navy-900">{appointment.member}</h3>
            <StatusBadge label={appointment.relation} color="green" />
            <p className="mt-4 text-base font-black text-navy-900">{appointment.test}</p>
            <p className="mt-1 text-sm font-semibold text-upchar-blue">Appointment ID: {appointment.appointmentId}</p>
          </div>
        </div>

        <div className="grid gap-3 text-sm font-semibold text-navy-700 sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <UsersRound className="h-4 w-4 text-upchar-blue" />
            <b className="text-navy-900">Collection Type</b> {appointment.collectionType}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-upchar-blue" />
            <b className="text-navy-900">Date</b> {appointment.date}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-upchar-blue" />
            <b className="text-navy-900">Time</b> {appointment.time}
          </span>
          <span className="inline-flex items-center gap-2">
            {appointment.collectionType === "Home Collection" ? <Home className="h-4 w-4 text-upchar-blue" /> : <MapPin className="h-4 w-4 text-upchar-blue" />}
            <b className="text-navy-900">Address</b> {appointment.address}
          </span>
        </div>

        <div className="grid gap-2">
          <div className="mb-2">
            <StatusBadge label={appointment.status} />
          </div>
          {appointment.actions.map((action) => (
            <button
              type="button"
              className={`h-10 rounded-md border px-4 text-sm font-black transition ${
                action === "Cancel"
                  ? "border-upchar-red text-upchar-red hover:bg-red-50"
                  : action === "Track Collection"
                    ? "border-green-200 text-upchar-green hover:bg-green-50"
                    : "border-blue-100 text-upchar-blue hover:bg-blue-50"
              }`}
              key={action}
              onClick={() => onAction(action)}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export default AppointmentCard;
