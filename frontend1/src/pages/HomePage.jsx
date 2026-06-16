import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assetUrl, getFeaturedServiceLocation, getHomeData, getHomepageBanners, getPackages, getPageContent, getTestimonials, getTests } from "../api/api.js";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import { fallbackHomeData, mergeHomeData } from "../data/homeData.js";
import { applyHomeContentOverrides, getContentSection } from "../utils/contentOverrides.js";
import BlogSection from "../sections/BlogSection.jsx";
import BookingMapSection from "../sections/BookingMapSection.jsx";
import HeroSection from "../sections/HeroSection.jsx";
import HowItWorksSection from "../sections/HowItWorksSection.jsx";
import ReviewsSection from "../sections/ReviewsSection.jsx";
import SearchSection from "../sections/SearchSection.jsx";
import SpecialCareSection from "../sections/SpecialCareSection.jsx";
import TrustedTestsSection from "../sections/TrustedTestsSection.jsx";
import VitalOrgansSection from "../sections/VitalOrgansSection.jsx";
import WhyChooseSection from "../sections/WhyChooseSection.jsx";

const normalizeHomePackage = (item, index) => ({
  ...item,
  id: item.id || item._id || item.packageCode || `home-package-${index + 1}`,
  name: item.packageName || item.name || "Health Package",
  testCount: item.testsIncluded || item.testCount || "",
  originalPrice: item.price ?? item.originalPrice ?? 0,
  discountedPrice: item.finalPrice ?? item.discountedPrice ?? item.price ?? item.originalPrice ?? 0,
  discount: item.discountPercent ? `${item.discountPercent}% OFF` : item.discount || "",
  image: assetUrl(item.packageImage || item.image || ""),
  icon: item.icon || "Gift",
  color: item.color || "green",
  buttonText: item.buttonText || "Book Now",
  buttonLink: item.buttonLink || (item.buttonUrl && item.buttonUrl !== "/cart" ? item.buttonUrl : ""),
  homeCollection: item.homeCollection ?? true,
  reportTime: item.reportTime || "24 - 36 hrs",
  badge: item.badge || (item.isPopular ? "Most Booked" : ""),
  isActive: item.isActive !== false && item.status !== "Inactive"
});

const normalizeHomeTest = (item, index) => ({
  ...item,
  id: item.id || item._id || item.testCode || `home-test-${index + 1}`,
  name: item.testName || item.name || "Pathology Test",
  subtitle: item.description || item.subtitle || item.category || "Pathology test",
  originalPrice: item.price ?? item.originalPrice ?? 0,
  discountedPrice: item.finalPrice ?? item.discountedPrice ?? item.price ?? item.originalPrice ?? 0,
  discount: item.discountPercent ? `${item.discountPercent}% OFF` : item.discount || "",
  image: assetUrl(item.testImage || item.image || ""),
  icon: item.icon || "TestTube2",
  color: item.badgeType || item.color || "green",
  badge: item.badge || "",
  homeCollection: item.homeCollection ?? true,
  reportTime: item.reportTime || "24 hrs",
  rating: item.rating ?? 4.6,
  isActive: item.isActive !== false && item.status !== "Inactive"
});

const fallbackPackages = fallbackHomeData.packages.map(normalizeHomePackage).filter((item) => item.isActive);
const fallbackTests = fallbackHomeData.tests.map(normalizeHomeTest).filter((item) => item.isActive);

const formatReviewDate = (value) => {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
};

const slugify = (value, fallback) =>
  String(value || fallback || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const extractBlogCards = (content) => {
  if (Array.isArray(content)) return content;

  const sectionCards = content?.sections?.find((section) => section.sectionKey === "hero" || section.sectionKey === "blog")?.cards;
  const candidates = [
    content?.blogCards,
    content?.cards,
    content?.data?.blogCards,
    content?.data?.cards,
    sectionCards
  ];

  return candidates.find(Array.isArray) || [];
};

const isActiveBlog = (blog = {}) => {
  const status = String(blog.status ?? "").trim().toLowerCase();
  return blog.isActive === true || blog.status === true || status === "active" || status === "published";
};

const bannerToHero = (banner, fallbackHero) => {
  if (!banner) return fallbackHero;

  const featureLabels = [banner.feature1, banner.feature2, banner.feature3, banner.feature4].filter(Boolean);
  const fallbackTrustPoints = fallbackHero.trustPoints || [];
  const trustPoints = (featureLabels.length ? featureLabels : fallbackTrustPoints.map((point) => point.label)).map((label, index) => ({
    label,
    icon: fallbackTrustPoints[index]?.icon || "BadgeCheck"
  }));
  const offerText = [banner.offerText, banner.offerHighlightText].filter(Boolean).join(" on ");

  return {
    ...fallbackHero,
    title: banner.headingLine1 || banner.bannerTitle || fallbackHero.title,
    highlightText: banner.headingHighlightText || "",
    subtitle: banner.description || banner.bannerDescription || fallbackHero.subtitle,
    trustPoints,
    buttons: [
      {
        label: banner.primaryButtonText || banner.buttonText || fallbackHero.buttons?.[0]?.label || "Book Test Now",
        href: banner.primaryButtonUrl || banner.linkUrl || fallbackHero.buttons?.[0]?.href || "#booking",
        variant: "primary"
      },
      {
        label: banner.secondaryButtonText || fallbackHero.buttons?.[1]?.label || "View Packages",
        href: banner.secondaryButtonUrl || fallbackHero.buttons?.[1]?.href || "#packages",
        variant: "outline"
      }
    ],
    offerText: offerText || fallbackHero.offerText,
    image: assetUrl(banner.bannerImage) || fallbackHero.image
  };
};

function SectionSkeleton({ className = "bg-white" }) {
  return (
    <section className={`border-b border-blue-100 py-12 ${className}`}>
      <div className="container-page">
        <div className="h-9 w-72 animate-pulse rounded-full bg-blue-100" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div className="h-72 animate-pulse rounded-xl border border-blue-100 bg-white shadow-sm" key={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const [homeData, setHomeData] = useState(null);
  const [homeContent, setHomeContent] = useState(null);
  const [blogContent, setBlogContent] = useState(null);
  const [homepageBanners, setHomepageBanners] = useState([]);
  const [homepageBannersLoaded, setHomepageBannersLoaded] = useState(false);
  const [homePackages, setHomePackages] = useState([]);
  const [packagesLoaded, setPackagesLoaded] = useState(false);
  const [homeTests, setHomeTests] = useState([]);
  const [testsLoaded, setTestsLoaded] = useState(false);
  const [blogsLoaded, setBlogsLoaded] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoaded, setTestimonialsLoaded] = useState(false);
  const [testimonialsFailed, setTestimonialsFailed] = useState(false);
  const [serviceLocation, setServiceLocation] = useState(null);
  const [serviceLocationLoaded, setServiceLocationLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let mounted = true;

    getHomeData()
      .then((apiData) => {
        if (mounted) {
          setHomeData(mergeHomeData(apiData));
          setUsingFallback(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setHomeData(fallbackHomeData);
          setUsingFallback(true);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    getPageContent("home")
      .then((content) => {
        if (mounted) setHomeContent(content);
      })
      .catch(() => {});

    getPageContent("blog")
      .then((content) => {
        if (mounted) setBlogContent(content);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setBlogsLoaded(true);
      });

    getHomepageBanners()
      .then((data) => {
        if (mounted && Array.isArray(data)) setHomepageBanners(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setHomepageBannersLoaded(true);
      });

    getPackages()
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          const packages = data.map(normalizeHomePackage).filter((item) => item.isActive);
          setHomePackages(packages);
        }
      })
      .catch(() => {
        if (mounted) setHomePackages(fallbackPackages);
      })
      .finally(() => {
        if (mounted) setPackagesLoaded(true);
      });

    getTests({ activeOnly: true, limit: 16, page: 1, sort: "popular" })
      .then((response) => {
        if (!mounted) return;
        const rows = Array.isArray(response) ? response : response?.data || [];
        const tests = rows.map(normalizeHomeTest).filter((item) => item.isActive);
        setHomeTests(tests);
      })
      .catch(() => {
        if (mounted) setHomeTests(fallbackTests);
      })
      .finally(() => {
        if (mounted) setTestsLoaded(true);
      });

    getTestimonials()
      .then((data) => {
        if (mounted && Array.isArray(data)) setTestimonials(data);
      })
      .catch(() => {
        if (mounted) setTestimonialsFailed(true);
      })
      .finally(() => {
        if (mounted) setTestimonialsLoaded(true);
      });

    getFeaturedServiceLocation()
      .then((data) => {
        if (mounted) setServiceLocation(data || null);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setServiceLocationLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const displayHomeData = useMemo(() => {
    const baseData = applyHomeContentOverrides(homeData || fallbackHomeData, homeContent);
    const topBanner = homepageBanners
      .filter((banner) => banner.status === "Active" && banner.isActive !== false)
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))[0];
    const bannerHero = bannerToHero(topBanner, baseData.hero);
    const reviewData = testimonials.length
      ? testimonials
        .filter((review) => review.isActive !== false && (!review.status || review.status === "Published"))
        .map((review) => ({
          ...review,
          id: review.id || review._id || review.customerName || review.name,
          name: review.name || review.customerName,
          comment: review.comment || review.content || review.testimonialContent,
          image: review.image || review.customerPhoto,
          rating: Number(review.rating || 5),
          reviewDate: formatReviewDate(review.reviewDate || review.addedOn || review.createdAt)
        }))
      : [];
    const blogData = extractBlogCards(blogContent)
      .filter(isActiveBlog)
      .map((blog, index) => ({
        id: blog.id || `blog-${index + 1}`,
        slug: slugify(blog.id || blog.slug || blog.title, `blog-${index + 1}`),
        image: assetUrl(blog.image),
        title: blog.title,
        shortDescription: blog.shortDescription || blog.description,
        content: blog.content || blog.shortDescription || blog.description,
        category: blog.category,
        date: blog.publishDate || blog.date,
        readTime: blog.readTime || "5 min read"
      }));

    return { ...baseData, hero: bannerHero, blogs: blogData, reviews: reviewData };
  }, [homeData, homeContent, blogContent, homepageBanners, testimonials, testimonialsFailed]);
  const packageContent = getContentSection(homeContent, "packages");
  const activePackages = useMemo(() => homePackages.filter((item) => item.isActive), [homePackages]);
  const activeTests = useMemo(() => homeTests.filter((item) => item.isActive), [homeTests]);

  return (
    <div className="min-h-screen overflow-hidden bg-white">
      <Header data={displayHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        {homepageBannersLoaded ? (
          <HeroSection data={displayHomeData} loading={loading} tests={activeTests} packages={activePackages} />
        ) : (
          <section className="relative min-h-[430px] overflow-hidden bg-navy-950 lg:h-[350px] lg:min-h-0">
            <div className="absolute inset-x-0 bottom-0 h-1 animate-pulse bg-upchar-green" />
          </section>
        )}
        <SearchSection
          quickCards={displayHomeData.quickCards}
          whatsappNumber={displayHomeData.siteSettings.whatsappNumber}
          tests={activeTests}
          packages={activePackages}
        />
        {packagesLoaded ? <SpecialCareSection packages={activePackages} content={packageContent} /> : <SectionSkeleton className="bg-gradient-to-b from-white to-blue-50/40" />}
        <VitalOrgansSection organs={displayHomeData.organs} />
        {testsLoaded ? <TrustedTestsSection tests={activeTests} content={getContentSection(homeContent, "trusted-tests")} /> : <SectionSkeleton className="bg-gradient-to-b from-blue-50/40 to-white" />}
        <WhyChooseSection features={displayHomeData.whyChoose} content={getContentSection(homeContent, "why-choose")} />
        <HowItWorksSection steps={displayHomeData.howItWorks} />
        {testimonialsLoaded ? <ReviewsSection reviews={displayHomeData.reviews} content={getContentSection(homeContent, "testimonials")} /> : <SectionSkeleton />}
        {blogsLoaded ? <BlogSection blogs={displayHomeData.blogs} content={getContentSection(blogContent, "hero") || getContentSection(homeContent, "blog")} /> : <SectionSkeleton className="bg-gradient-to-b from-blue-50/40 to-white" />}
        <BookingMapSection
          data={displayHomeData}
          content={getContentSection(homeContent, "cta")}
          tests={activeTests}
          packages={activePackages}
          serviceLocation={serviceLocation}
          serviceLocationLoaded={serviceLocationLoaded}
        />
      </main>
      <Footer data={displayHomeData} serviceLocation={serviceLocation} />

      <AnimatePresence>
        {usingFallback && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-blue-100 bg-white px-4 py-3 text-center text-sm font-semibold text-navy-700 shadow-soft"
          >
            Backend is offline, so demo home content is being shown.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HomePage;
