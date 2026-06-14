import { useEffect, useState } from "react";
import { CalendarDays, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
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
          author: blog.author || "Upchar Team",
          date: blog.date
        }))
    : [];
};

function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getPageContent("blog")
      .then((data) => {
        if (mounted) {
          const selectedBlog = contentBlogs(data).find((item) => item.slug === slug);
          setBlog(selectedBlog || null);
          document.title = selectedBlog?.title ? `${selectedBlog.title} | Upchar Pathology` : "Blog | Upchar Pathology";
        }
      })
      .catch(() => {
        if (mounted) setBlog(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        <section className="bg-gradient-to-b from-blue-50/70 to-white py-12 lg:py-16">
          <div className="container-page">
            {loading ? (
              <div className="mx-auto max-w-4xl">
                <div className="h-10 w-56 animate-pulse rounded-full bg-blue-100" />
                <div className="mt-6 h-16 animate-pulse rounded-xl bg-blue-100" />
                <div className="mt-8 h-96 animate-pulse rounded-xl bg-white shadow-card" />
              </div>
            ) : blog ? (
              <article className="mx-auto max-w-4xl">
                <Link to="/blog" className="text-sm font-black text-upchar-blue">Back to Blog</Link>
                <p className="mt-6 text-sm font-black uppercase tracking-wide text-upchar-green">{blog.category}</p>
                <h1 className="mt-3 text-4xl font-black leading-tight text-navy-900 sm:text-5xl">{blog.title}</h1>
                <div className="mt-5 flex flex-wrap gap-5 text-sm font-bold text-navy-700">
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-upchar-green" />
                    {blog.author}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-upchar-blue" />
                    {blog.date}
                  </span>
                </div>
                <div className="mt-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-card">
                  <SmartImage src={assetUrl(blog.image)} alt={blog.title} className="h-80 w-full object-cover" />
                </div>
                <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 text-base font-semibold leading-8 text-navy-700 shadow-sm lg:p-8">
                  {(blog.content || blog.shortDescription).split("\n").filter(Boolean).map((paragraph) => (
                    <p className="mb-5 last:mb-0" key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ) : (
              <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-blue-100 bg-white p-10 text-center shadow-sm">
                <h1 className="text-2xl font-black text-navy-900">Blog not found</h1>
                <Link to="/blog" className="mt-5 inline-flex rounded-lg bg-upchar-green px-6 py-3 text-sm font-black text-white">View Blogs</Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer data={fallbackHomeData} />
    </div>
  );
}

export default BlogDetailPage;
