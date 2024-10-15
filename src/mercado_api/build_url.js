export const buildUrl = (searchParams) => {
  const { category, query, priceMin, priceMax, sort } = searchParams;
  let url = `https://api.mercadolibre.com/sites/MLM/search?category=${category}&q=${query}`;

  if (priceMin || priceMax) {
    url += `&price=${priceMin}-${priceMax || ''}`;
  }

  if (sort) {
    url += `&sort=${sort}`;
  }

  return url;
};
