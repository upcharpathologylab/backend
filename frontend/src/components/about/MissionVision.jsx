import { Eye, Target } from "lucide-react";

function MissionVision() {
  return (
    <section className="bg-white py-5">
      <div className="container-page">
        <div className="grid gap-8 rounded-lg border border-blue-100 bg-white p-7 shadow-card md:grid-cols-2 lg:p-9">
          <article className="grid gap-6 sm:grid-cols-[110px_1fr] sm:items-center lg:px-10">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-upchar-green">
              <Target className="h-14 w-14" strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="text-3xl font-black text-upchar-green">Our Mission</h2>
              <p className="mt-3 text-lg font-semibold leading-8 text-navy-800">
                To provide accurate, reliable and timely diagnostic services using advanced technology and a
                customer-first approach.
              </p>
            </div>
          </article>

          <article className="grid gap-6 border-t border-blue-100 pt-8 sm:grid-cols-[110px_1fr] sm:items-center md:border-l md:border-t-0 md:pl-9 md:pt-0 lg:px-10">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-upchar-blue">
              <Eye className="h-14 w-14" strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="text-3xl font-black text-upchar-blue">Our Vision</h2>
              <p className="mt-3 text-lg font-semibold leading-8 text-navy-800">
                To be India's most trusted platform for diagnostic services, known for quality, transparency and
                innovation.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default MissionVision;
