import { useEffect, useState } from 'preact/hooks';
import { search } from '../api';
import { ProductCard } from './ProductCard';
import { PersonaCard } from './PersonaCard';

function BannerPlaceholder() {
  return (
    <div class="banner-placeholder" aria-label="Campaign banner slot">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
      </svg>
      <span>Inline Banner</span>
    </div>
  );
}

function buildGridSlots(results, inlineSlots, perPage) {
  // Only insert placeholders when the API actually reserved a slot (total items === perPage)
  const slotReserved = inlineSlots.length > 0 && results.length + inlineSlots.length === perPage;
  if (!slotReserved) return results.map((r) => ({ type: 'product', result: r }));

  const positions = new Set(inlineSlots.map((s) => s.config?.position?.index).filter((i) => i != null));
  const slots = [];
  let pi = 0;
  for (let i = 0; slots.length < results.length + positions.size; i++) {
    if (positions.has(i)) {
      slots.push({ type: 'banner', key: `banner-${i}` });
    } else if (pi < results.length) {
      slots.push({ type: 'product', result: results[pi++] });
    }
  }
  return slots;
}

export function SearchPane({ persona, query, collection, page, onResults, onPagination, uniqueIds }) {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [elevatedIds, setElevatedIds] = useState(new Set());
  const [inlineSlots, setInlineSlots] = useState([]);

  useEffect(() => {
    if (!query && !collection) {
      setResults([]);
      setTotal(null);
      setElevatedIds(new Set());
      setInlineSlots([]);
      onResults?.([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setInlineSlots([]);

    search({ query, collection, persona: persona.params, page, perPage: 24 })
      .then((data) => {
        if (cancelled) return;
        const r = data.results ?? [];
        const slots = data.merchandising?.content?.inline ?? [];
        setResults(r);
        setTotal(data.pagination?.totalResults ?? 0);
        setElevatedIds(new Set(data.merchandising?.elevated ?? []));
        setInlineSlots(slots);
        onResults?.(r);
        onPagination?.({ totalPages: data.pagination?.totalPages ?? 1 });
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [query, collection, page, JSON.stringify(persona.params)]);

  const gridSlots = buildGridSlots(results, inlineSlots, 24);

  return (
    <div class={`search-pane search-pane--${persona.id}`}>
      <PersonaCard persona={persona} />

      <div class="search-pane__result-header">
        {total !== null && !loading && (
          <span class="search-pane__count">{total} results</span>
        )}
      </div>

      {loading && (
        <div class="search-pane__state">
          <div class="spinner" />
        </div>
      )}

      {error && !loading && (
        <div class="search-pane__state search-pane__state--error">
          Error: {error}
        </div>
      )}

      {!loading && !error && results.length === 0 && (query || collection) && (
        <div class="search-pane__state">No results found.</div>
      )}

      {!loading && !error && (
        <div class="product-grid">
          {gridSlots.map((slot) => {
            if (slot.type === 'banner') {
              return <BannerPlaceholder key={slot.key} />;
            }
            const uid = slot.result.uid ?? slot.result.id;
            return (
              <ProductCard
                key={uid}
                result={slot.result}
                isUnique={uniqueIds?.has(uid)}
                isPinned={elevatedIds.has(slot.result.parentId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
