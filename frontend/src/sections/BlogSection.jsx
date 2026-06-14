import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import SmartImage from "../components/SmartImage.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import useAutoCarousel from "../hooks/useAutoCarousel.js";
import { textValue } from "../utils/contentOverrides.js";

const blogIcons = ["HeartPulse", "ShieldCheck", "Droplet", "ShieldCheck"];

function BlogSection({ blogs, content }) {
  const { sliderRef, scroll, handleScroll, pause, resume } = useAutoCarousel(blogs.length, 1000);
  const sliderBlogs = blogs.length > 1 ? [...blogs, ...blogs] : blogs;

  return (
    <section id="blog" className="border-b border-blue-100 bg-gradient-to-b from-blue-50/40 to-white py-12 lg:py-16">
      <div className="container-page">
        <SectionHeading
          title={textValue(content?.title, "From Our")}
          highlight={textValue(content?.subtitle, "Blog")}
          subtitle={textValue(content?.description, "Health tips, insights and guides to help you live a healthier life.")}
          centered={false}
          action={
            <Link
              to="/blog"
              className="inline-flex items-center gap-3 rounded-lg border border-blue-200 bg-white px-6 py-3 text-sm font-black text-upchar-blue shadow-card transition hover:-translate-y-0.5"
            >
              <NotebookPen className="h-5 w-5" />
              View All Blogs
              <ArrowRight className="h-5 w-5" />
            </Link>
          }
        />
        <div className="relative">
          <button type="button" onClick={() => scroll(-1)} className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-upchar-blue shadow-card lg:flex" aria-label="Previous blogs">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            onMouseEnter={pause}
            onMouseLeave={resume}
            className="hide-scrollbar flex snap-x items-stretch gap-6 overflow-x-auto pb-3"
          >
            {sliderBlogs.map((blog, index) => (
              <article
                data-carousel-card
                className="group w-full shrink-0 snap-start overflow-hidden rounded-xl border border-blue-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft md:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-4.5rem)/4)]"
                key={`${blog.slug}-${index}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <SmartImage src={blog.image} alt={blog.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-5 top-5 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white text-upchar-red shadow-card">
                    <Icon name={blogIcons[index] || "HeartPulse"} className="h-8 w-8" />
                  </span>
                  <span className={`absolute bottom-0 left-0 h-1 w-24 ${index === 0 || index === 2 ? "bg-upchar-red" : "bg-upchar-green"}`} />
                </div>
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-wide text-upchar-green">{blog.category}</p>
                  <h3 className="mt-2 min-h-20 text-xl font-black leading-snug text-navy-900">{blog.title}</h3>
                  <p className="mt-3 min-h-16 text-sm leading-7 text-navy-700">{blog.shortDescription}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-navy-700">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-upchar-red" />
                      {blog.date}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-upchar-blue" />
                      {blog.readTime}
                    </span>
                  </div>
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="mt-6 inline-flex items-center justify-center gap-3 rounded-lg border border-blue-200 px-8 py-3 text-base font-black text-upchar-blue transition hover:bg-blue-50"
                  >
                    Read More
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </article>
            ))}
            {!blogs.length ? (
              <div className="w-full rounded-xl border border-dashed border-blue-100 bg-white p-10 text-center text-sm font-black text-navy-600 shadow-sm">
                No active blogs are available yet.
              </div>
            ) : null}
          </div>
          <button type="button" onClick={() => scroll(1)} className="absolute -right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-upchar-blue shadow-card lg:flex" aria-label="Next blogs">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-9 flex justify-center gap-2">
          <span className="h-3 w-3 rounded-full bg-upchar-blue" />
          {[0, 1, 2].map((item) => (
            <span className="h-3 w-3 rounded-full bg-blue-100" key={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
