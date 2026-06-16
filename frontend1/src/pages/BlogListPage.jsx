import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";
import { assetUrl, getPageContent } from "../api/api.js";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { fallbackHomeData } from "../data/homeData.js";

const slugify = (value, fallback) =>
  String(value || fallback || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const contentBlogs = (content) => {
  const section = content?.sections?.find((item) => item.sectionKey === "hero");
  return Array.isArray(section?.cards)
    ? section.cards
        .filter((blog) => blog.status !== "Inactive")
        .map((blog, index) => ({
          id: blog.id || `blog-${index + 1}`,
          slug: slugify(blog.id || blog.title, `blog-${index + 1}`),
          image: assetUrl(blog.image),
          title: blog.title,
          shortDescription: blog.description,
          content: blog.content || blog.description,
          category: blog.category,
          date: blog.date
        }))
    : [];
};

function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    document.title = "Blog | Upchar Pathology";

    getPageContent("blog")
      .then((data) => {
        if (mounted) setBlogs(contentBlogs(data));
      })
      .catch(() => {
        if (mounted) setBlogs([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        <section className="bg-gradient-to-b from-blue-50/70 to-white py-12 lg:py-16">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-black text-upchar-green">
                <NotebookPen className="h-4 w-4" />
                Health Blog
              </p>
              <h1 className="mt-5 text-4xl font-black text-navy-900 sm:text-5xl">Latest Health Articles</h1>
              <p className="mt-4 text-base font-semibold leading-7 text-navy-700">Helpful updates, guides, and lab-test awareness from Upchar Pathology.</p>
            </div>

            {loading ? (
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div className="h-96 animate-pulse rounded-xl border border-blue-100 bg-white shadow-card" key={item} />
                ))}
              </div>
            ) : blogs.length ? (
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {blogs.map((blog) => (
                  <article className="group overflow-hidden rounded-xl border border-blue-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft" key={blog.slug}>
                    <div className="h-56 overflow-hidden">
                      <SmartImage src={assetUrl(blog.image)} alt={blog.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-wide text-upchar-green">
                        <span>{blog.category}</span>
                        <span className="text-navy-300">|</span>
                        <span className="inline-flex items-center gap-1 text-navy-600">
                          <CalendarDays className="h-4 w-4" />
                          {blog.date}
                        </span>
                      </div>
                      <h2 className="mt-3 text-xl font-black leading-snug text-navy-900">{blog.title}</h2>
                      <p className="mt-3 text-sm font-semibold leading-7 text-navy-700">{blog.shortDescription}</p>
                      <Link to={`/blog/${blog.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-upchar-blue">
                        Read More <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-xl border border-dashed border-blue-100 bg-white p-10 text-center text-sm font-black text-navy-600 shadow-sm">
                No active blogs are available yet.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer data={fallbackHomeData} />
    </div>
  );
}

export default BlogListPage;
