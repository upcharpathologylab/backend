import { Award, Headphones, LockKeyhole, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "24/7 Support",
    description: "Our team is available round the clock to assist you.",
    icon: Headphones,
    tone: "bg-green-50 text-upchar-green"
  },
  {
    title: "Quick Response",
    description: "We respond to all queries within 24 hours.",
    icon: ShieldCheck,
    tone: "bg-blue-50 text-upchar-blue"
  },
  {
    title: "Data Privacy",
    description: "Your information is safe and secure with us.",
    icon: LockKeyhole,
    tone: "bg-violet-50 text-upchar-purple"
  },
  {
    title: "Trusted Care",
    description: "Delivering accurate reports with trusted care.",
    icon: Award,
    tone: "bg-orange-50 text-upchar-orange"
  }
];

function ContactFeatures() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <article className="grid gap-4 rounded-lg border border-blue-100 bg-white p-6 shadow-sm sm:grid-cols-[70px_1fr] sm:items-center" key={feature.title}>
            <span className={`flex h-16 w-16 items-center justify-center rounded-full ${feature.tone}`}>
              <Icon className="h-9 w-9" />
            </span>
            <div>
              <h3 className="text-lg font-black text-upchar-blue">{feature.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">{feature.description}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ContactFeatures;
