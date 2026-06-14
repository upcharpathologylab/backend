const CACHE_TTL_MS = 18 * 60 * 60 * 1000;
const reviewsCache = new Map();

const extractPlaceId = (value = "") => {
  const text = String(value).trim();
  if (!text) return "";

  const queryPlaceId = text.match(/[?&]place_id=([^&]+)/i)?.[1];
  if (queryPlaceId) return decodeURIComponent(queryPlaceId);

  return text.match(/\bChI[A-Za-z0-9_-]+\b/)?.[0] || (!/^https?:\/\//i.test(text) ? text : "");
};

const extractPlaceQuery = (value = "") => {
  try {
    const url = new URL(value);
    const query = url.searchParams.get("q");
    if (query && !query.startsWith("place_id:")) return query;
    const placeName = url.pathname.match(/\/place\/([^/]+)/i)?.[1];
    return placeName ? decodeURIComponent(placeName).replaceAll("+", " ") : value;
  } catch {
    return value;
  }
};

async function resolvePlaceId(value, apiKey) {
  const directPlaceId = extractPlaceId(value);
  if (directPlaceId) return directPlaceId;

  let resolvedUrl = value;
  try {
    const response = await fetch(value, { method: "HEAD", redirect: "follow" });
    resolvedUrl = response.url || value;
  } catch {
    resolvedUrl = value;
  }

  const redirectedPlaceId = extractPlaceId(resolvedUrl);
  if (redirectedPlaceId) return redirectedPlaceId;

  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id"
    },
    body: JSON.stringify({ textQuery: extractPlaceQuery(resolvedUrl) })
  });

  if (!response.ok) throw new Error("Unable to resolve Google Place ID.");
  const data = await response.json();
  return data.places?.[0]?.id || "";
}

const mapReview = (review, index) => ({
  id: `google-${review.name || index}`,
  name: review.authorAttribution?.displayName || "Google User",
  customerName: review.authorAttribution?.displayName || "Google User",
  image: review.authorAttribution?.photoUri || "",
  customerPhoto: review.authorAttribution?.photoUri || "",
  rating: Number(review.rating || 0),
  comment: review.text?.text || review.originalText?.text || "",
  content: review.text?.text || review.originalText?.text || "",
  reviewDate: review.publishTime || new Date().toISOString(),
  googleReview: true
});

export async function getGoogleReviews(placeValue) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY is not configured.");
  if (!placeValue) return [];

  const cacheKey = String(placeValue).trim();
  const cached = reviewsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const placeId = await resolvePlaceId(cacheKey, apiKey);
  if (!placeId) return [];

  const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "reviews"
    }
  });

  if (!response.ok) throw new Error("Unable to fetch Google reviews.");
  const place = await response.json();
  const reviews = (place.reviews || [])
    .filter((review) => Number(review.rating) >= 4)
    .map(mapReview)
    .filter((review) => review.comment);

  reviewsCache.set(cacheKey, { data: reviews, expiresAt: Date.now() + CACHE_TTL_MS });
  return reviews;
}
