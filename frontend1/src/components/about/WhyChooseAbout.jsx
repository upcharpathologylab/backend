import {
  Award,
  BadgeCheck,
  BadgeIndianRupee,
  FileCheck2,
  Headphones,
  Home,
  LockKeyhole,
  Truck
} from "lucide-react";

const features = [
  {
    title: "NABL Accredited Lab Network",
    description: "Partnered with top NABL accredited labs across India.",
    icon: Award
  },
  {
    title: "Affordable & Transparent Pricing",
    description: "Best prices with complete transparency and no hidden charges.",
    icon: BadgeIndianRupee
  },
  {
    title: "Accurate & Reliable Reports",
    description: "High-quality testing with accurate and timely reports.",
    icon: BadgeCheck
  },
  {
    title: "Home Sample Collection",
    description: "Convenient and hassle-free sample collection at home.",
    icon: Home
  },
  {
    title: "Expert Report Verification",
    description: "Reports verified by experienced doctors and lab experts.",
    icon: FileCheck2
  },
  {
    title: "Secure & Confidential",
    description: "Your data and reports are safe with the highest security.",
    icon: LockKeyhole
  },
  {
    title: "Fast Report Delivery",
    description: "Quick turnaround time for faster results.",
    icon: Truck
  },
  {
    title: "24/7 Customer Support",
    description: "Our support team is here to help you anytime.",
    icon: Headphones
  }
];

function WhyChooseAbout() {
  return (
    <section className="bg-white py-7">
      <div className="container-page">
        <div className="text-center">
          <h2 className="text-3xl font-black text-navy-900">Why Choose Upchar?</h2>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-upchar-green" />
        </div>

        <div className="mt-7 grid rounded-lg border border-blue-100 bg-white p-4 shadow-card sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                className={`px-4 py-5 text-center ${index !== features.length - 1 ? "xl:border-r xl:border-blue-100" : ""}`}
                key={feature.title}
              >
                <Icon className="mx-auto h-12 w-12 text-upchar-green" strokeWidth={2.1} />
                <h3 className="mt-5 text-base font-black leading-snug text-navy-900">{feature.title}</h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-navy-700">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseAbout;
