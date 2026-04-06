const SITE_ID = 'atdtdp';
const BASE_URL = `https://${SITE_ID}.a.athoscommerce.net/api/search/search.json`;
const SUGGEST_URL = `https://${SITE_ID}.a.athoscommerce.net/v1/suggest`;
const PREFLIGHT_URL = `https://${SITE_ID}.a.athoscommerce.net/v1/preflight`;

export async function search({ query, collection, page = 1, perPage = 24, persona = {} }) {
  const params = new URLSearchParams({
    siteId: SITE_ID,
    q: query ?? '',
    resultsFormat: 'native',
    test: 'true',
    page,
    resultsPerPage: perPage,
    ...persona,
  });
  if (collection) params.set('bgfilter.collection_handle', collection);

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

export function preflight(persona) {
  const { shopper, lastViewed, cart } = persona.params;
  const params = new URLSearchParams({ siteId: SITE_ID, userId: `demo-${shopper}` });
  if (shopper)     params.set('shopper', shopper);
  if (lastViewed)  params.set('lastViewed', lastViewed);
  if (cart)        params.set('cart', cart);
  // fire-and-forget, no need to await
  fetch(`${PREFLIGHT_URL}?${params}`).catch(() => {});
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
