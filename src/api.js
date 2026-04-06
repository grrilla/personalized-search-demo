const SITE_ID = 'atdtdp';
const BASE_URL = `https://${SITE_ID}.a.athoscommerce.net/api/search/search.json`;
const SUGGEST_URL = `https://${SITE_ID}.a.athoscommerce.net/v1/suggest`;

export async function search({ query, page = 1, perPage = 24, persona = {} }) {
  const params = new URLSearchParams({
    siteId: SITE_ID,
    q: query,
    resultsFormat: 'native',
    test: 'true',   // suppress analytics — demo tool only
    page,
    resultsPerPage: perPage,
    ...persona,
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

export async function suggest(query, count = 6) {
  if (!query) return [];
  const params = new URLSearchParams({ siteId: SITE_ID, q: query, suggestionCount: count });
  const res = await fetch(`${SUGGEST_URL}?${params}`);
  if (!res.ok) return [];
  const data = await res.json();
  const results = [];
  if (data.suggested?.text) results.push(data.suggested.text);
  for (const alt of data.alternatives ?? []) {
    if (alt.text && !results.includes(alt.text)) results.push(alt.text);
  }
  return results.slice(0, count);
}
