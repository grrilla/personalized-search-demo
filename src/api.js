const SITE_ID = 'atdtdp';
const BASE_URL = `https://${SITE_ID}.a.athoscommerce.net/api/search/search.json`;

export async function search({ query, page = 1, perPage = 24, persona = {} }) {
  const params = new URLSearchParams({
    siteId: SITE_ID,
    q: query,
    resultsFormat: 'native',
    page,
    resultsPerPage: perPage,
    ...persona,
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}
