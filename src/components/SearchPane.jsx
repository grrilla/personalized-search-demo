import { useEffect, useState } from 'preact/hooks';
import { search } from '../api';
import { ProductCard } from './ProductCard';

export function SearchPane({ label, query, persona }) {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setTotal(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    search({ query, persona })
      .then((data) => {
        if (cancelled) return;
        setResults(data.results ?? []);
        setTotal(data.pagination?.totalResults ?? 0);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [query, JSON.stringify(persona)]);

  return (
    <div class="search-pane">
      <div class="search-pane__header">
        <h2 class="search-pane__label">{label}</h2>
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

      {!loading && !error && results.length === 0 && query && (
        <div class="search-pane__state">No results found.</div>
      )}

      {!loading && !error && (
        <div class="product-grid">
          {results.map((r) => (
            <ProductCard key={r.uid ?? r.id} result={r} />
          ))}
        </div>
      )}
    </div>
  );
}
