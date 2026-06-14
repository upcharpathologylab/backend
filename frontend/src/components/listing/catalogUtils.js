export const toggleValue = (values, value) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

export const normalizeText = (value = "") => value.toLowerCase().trim();

export const matchesSearch = (item, searchTerm) => {
  const query = normalizeText(searchTerm);
  if (!query) return true;
  return [item.name, item.subtitle, item.description, item.category, item.testCount]
    .filter(Boolean)
    .some((value) => normalizeText(String(value)).includes(query));
};

export const sortCatalogItems = (items, sort) => {
  const sorted = [...items];

  if (sort === "price-low") {
    return sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
  }

  if (sort === "price-high") {
    return sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
  }

  if (sort === "newest") {
    return sorted.reverse();
  }

  return sorted.sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0));
};
