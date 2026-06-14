import { assetUrl } from "../api/api.js";

export function getContentSection(content, sectionKey) {
  return (content?.sections || []).find((section) => section.sectionKey === sectionKey) || null;
}

export function textValue(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function imageValue(value, fallback) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  return assetUrl(value) || fallback;
}

const editableText = (value, fallback = "") => (typeof value === "string" ? value : fallback);

const numberValue = (value, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const normalized = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(normalized) && normalized > 0 ? normalized : fallback;
};

const discountValue = (originalPrice, discountedPrice, fallback = "") => {
  if (originalPrice > discountedPrice && discountedPrice > 0) {
    return `${Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}% OFF`;
  }

  return fallback;
};

const itemKey = (item = "") =>
  item.id || item.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "";

export function sectionCards(section, fallbackItems = []) {
  if (!section || section.hasCards === false || !Array.isArray(section.cards)) return null;

  const activeCards = section.cards.filter((card) => card.status !== "Inactive");

  return activeCards.map((card, index) => {
    const fallback = fallbackItems.find((item) => itemKey(item) === card.id) || fallbackItems[index] || fallbackItems[0] || {};
    const originalPrice = numberValue(card.oldPrice, fallback.originalPrice || 0);
    const discountedPrice = numberValue(card.newPrice, fallback.discountedPrice || fallback.price || originalPrice);
    const badge = editableText(card.badge, fallback.badge || "");

    return {
      ...fallback,
      id: card.id || fallback.id || `cms-package-${index + 1}`,
      name: textValue(card.title, fallback.name || `Package ${index + 1}`),
      description: editableText(card.description, fallback.description || ""),
      testCount: textValue(card.testCount, fallback.testCount || ""),
      originalPrice,
      discountedPrice,
      discount: discountValue(originalPrice, discountedPrice, fallback.discount || ""),
      badge,
      isPopular: Boolean(badge),
      image: assetUrl(editableText(card.image, fallback.image || "")) || fallback.image || "",
      buttonText: textValue(card.buttonText, fallback.buttonText || "Book Now"),
      buttonLink: textValue(card.buttonLink, fallback.buttonLink || "#booking"),
      isActive: true,
      icon: fallback.icon || "FileCheck2",
      color: fallback.color || "blue",
      category: fallback.category || "full-body",
      gender: fallback.gender || "all",
      homeCollection: fallback.homeCollection ?? true,
      reportTime: fallback.reportTime || "24 - 36 hrs",
      popularity: activeCards.length - index
    };
  });
}

export function applyHomeContentOverrides(data, content) {
  const hero = getContentSection(content, "hero");

  if (!hero) return data;

  return {
    ...data,
    hero: {
      ...data.hero,
      title: textValue(hero.title, data.hero.title),
      highlightText: textValue(hero.subtitle, data.hero.highlightText),
      subtitle: textValue(hero.description, data.hero.subtitle),
      image: imageValue(hero.imageUrl, data.hero.image)
    }
  };
}

export function applyListingHeroContent(hero, content) {
  const section = getContentSection(content, "hero");

  if (!section) return hero;

  return {
    ...hero,
    title: textValue(section.title, hero.title),
    subtitle: textValue(section.description || section.subtitle, hero.subtitle),
    image: imageValue(section.imageUrl, hero.image)
  };
}
