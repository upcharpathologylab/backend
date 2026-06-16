import { CheckCircle2, Star } from "lucide-react";
import SmartImage from "../components/SmartImage.jsx";
import { textValue } from "../utils/contentOverrides.js";

function StarRating({ rating }) {
  const stars = Math.max(1, Math.min(5, Number(rating) || 5));
  return (
    <div className="flex gap-1 text-amber-500" aria-label={`${stars} star rating`}>
      {Array.from({ length: stars }).map((_, index) => (
        <Star className="h-5 w-5 fill-current" key={index} />
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <span className="text-3xl font-black" aria-label="Google">
      <span className="text-blue-600">G</span>
    </span>
  );
}

function ReviewsSection({ reviews, content }) {
  const averageRating = reviews.length
    ? (reviews.reduce((total, review) => total + (Number(review.rating) || 0), 0) / reviews.length).toFixed(1)
    : "0.0";
  const settings = content?.settings || {};

  return (
    <section className="border-b border-blue-100 bg-white py-14 lg:py-20">
      <div className="container-page">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-soft lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.65fr]">
            <div>
              <h2 className="text-3xl font-black text-navy-900 sm:text-4xl">
                {textValue(content?.title, "")} <span className="text-upchar-green">{textValue(content?.subtitle, "")}</span>
              </h2>
              <p className="mt-2 text-lg text-navy-700">{textValue(content?.description, "")}</p>
              <div className="mt-8 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 p-8 text-center">
                <GoogleMark />
                <div className="mt-2 text-6xl font-black text-navy-900">{averageRating}</div>
                <div className="mt-3 flex justify-center">
                  <StarRating rating={averageRating} />
                </div>
                <p className="mt-2 text-base font-bold text-navy-700">({textValue(settings.totalReviewsText, `${reviews.length} Reviews`)})</p>
                <div className="mt-8 grid gap-4 border-t border-blue-100 pt-6 text-left">
                  {[
                    [textValue(settings.happyCustomersText, String(reviews.length)), "Happy Customers"],
                    [`${averageRating}/5`, "Average Rating"],
                    [textValue(settings.recommendPercentage, "0%"), "Recommend Us"]
                  ].map(([value, label]) => (
                    <div className="flex items-center gap-4" key={label}>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-upchar-green">
                        <CheckCircle2 className="h-6 w-6" />
                      </span>
                      <span>
                        <span className="block text-lg font-black text-upchar-green">{value}</span>
                        <span className="text-sm font-semibold text-navy-700">{label}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-w-0">
              {reviews.length ? (
                <div className="reviews-vertical-window max-h-[620px] overflow-hidden">
                  <div
                    className="reviews-vertical-track"
                    style={{ "--reviews-duration": `${Math.max(reviews.length * 5, 15)}s` }}
                  >
                    {[0, 1].map((group) => (
                      <div className="grid gap-5 pb-5" key={group} aria-hidden={group === 1}>
                        {reviews.map((review, index) => (
                          <article
                            className="w-full rounded-2xl border border-blue-100 bg-white p-5 shadow-soft"
                            key={`${group}-${review.id || review.name}-${index}`}
                          >
                            <div className="grid grid-cols-[64px_1fr_40px] items-start gap-4">
                              <div className="h-16 w-16 overflow-hidden rounded-full bg-blue-50">
                                <SmartImage src={review.image} alt={review.name} className="h-full w-full object-cover" fallbackClassName="h-16 min-h-0 rounded-full" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-xl font-black text-navy-900">{review.name}</h3>
                                <div className="mt-1">
                                  <StarRating rating={review.rating} />
                                </div>
                              </div>
                              <GoogleMark />
                            </div>
                            <p className="mt-4 text-base leading-7 text-navy-700">{review.comment}</p>
                            <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy-700">
                              <CheckCircle2 className="h-4 w-4 fill-upchar-green text-upchar-green" />
                              {review.reviewDate}
                            </span>
                          </article>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-blue-100 bg-blue-50/30 p-8 text-center">
                  <p className="text-base font-semibold text-navy-700">No published testimonials are available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .reviews-vertical-track {
          animation: reviews-vertical-scroll var(--reviews-duration) linear infinite;
          will-change: transform;
        }

        .reviews-vertical-window:hover .reviews-vertical-track {
          animation-play-state: paused;
        }

        @keyframes reviews-vertical-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .reviews-vertical-track { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default ReviewsSection;
