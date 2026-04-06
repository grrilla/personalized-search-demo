import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { SearchPane } from './components/SearchPane';
import { suggest, preflight } from './api';
import './app.css';

const PERSONAS = [
  {
    id: 'morgan',
    label: 'Morgan',
    tagline: 'Studio & Yoga Enthusiast',
    bio: 'Starts every morning with a flow class and lives in her leggings. Shops for performance studio wear, yoga accessories, and elevated athleisure she can take from mat to coffee.',
    params: {
      shopper: 'MORGAN-STUDIO-001',
      lastViewed: 'VW1982-AYM-LA,VW1982-LLE-CH,VW1982-LSK-WH,VW1982-ACR-OL,VW1982-FLE-AS,VW1982-FDR-OL,VW1982-ULE-CH,VW1982-SLE-BL,VW1982-HCR-OL,VW1982-HLE-BL,VW1982-LTA-CH,VW1982-ESK-CH',
    },
  },
  {
    id: 'jordan',
    label: 'Jordan',
    tagline: 'Trail Runner & Outdoor Adventurer',
    bio: 'Weekend trail runner and avid hiker. Needs gear that performs in the backcountry and looks sharp at the trailhead. Gravitates toward technical outerwear, running shoes, and versatile bottoms.',
    params: {
      shopper: 'JORDAN-OUTDOOR-001',
      lastViewed: 'VW1982-RSO-WH,VW1982-MAN-BL,VW1982-UCP-SA,VW1982-VHI-SI,VW1982-RJO-AS,VW1982-SJO-SA,VW1982-MQZ-SA,VW1982-RQZ-CH,VW1982-MTE-OL,VW1982-LTP-SA,VW1982-MSO-SA,VW1982-STP-NA',
    },
  },
];

const NAV_COLLECTIONS = [
  { handle: 'new-arrivals',  label: 'New Arrivals' },
  { handle: 'best-sellers', label: 'Best Sellers' },
  { handle: 'his',          label: 'His' },
  { handle: 'hers',         label: 'Hers' },
  { handle: 'tops',         label: 'Tops' },
  { handle: 'outerwear',    label: 'Outerwear' },
  { handle: 'shoes-1',      label: 'Shoes' },
  { handle: 'running',      label: 'Running' },
  { handle: 'hiking',       label: 'Hiking' },
  { handle: 'yoga',         label: 'Yoga' },
  { handle: 'accessories',  label: 'Accessories' },
];

function computeDiffs(a, b) {
  const aPos = new Map(a.map((r, i) => [r.uid ?? r.id, i]));
  const bPos = new Map(b.map((r, i) => [r.uid ?? r.id, i]));
  const diffA = new Set([...aPos.keys()].filter((id) => aPos.get(id) !== bPos.get(id)));
  const diffB = new Set([...bPos.keys()].filter((id) => bPos.get(id) !== aPos.get(id)));
  return [diffA, diffB];
}

export function App() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [activeCollection, setActiveCollection] = useState(null);
  const [paneResults, setPaneResults] = useState([[], []]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  const isActive = submittedQuery || activeCollection;

  // Warm personalization cache on load and every 60s
  useEffect(() => {
    PERSONAS.forEach(preflight);
    const interval = setInterval(() => PERSONAS.forEach(preflight), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const results = await suggest(query.trim());
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setActiveIndex(-1);
    }, 150);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e) {
      if (!containerRef.current?.contains(e.target)) setShowSuggestions(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function commitSearch(term) {
    setQuery(term);
    setSubmittedQuery(term);
    setActiveCollection(null);
    setPaneResults([[], []]);
    setShowSuggestions(false);
    setSuggestions([]);
  }

  function commitCollection(handle) {
    setActiveCollection(handle);
    setSubmittedQuery('');
    setQuery('');
    setPaneResults([[], []]);
    setShowSuggestions(false);
    setSuggestions([]);
  }

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const term = activeIndex >= 0 ? suggestions[activeIndex] : query.trim();
    if (term) commitSearch(term);
  }, [query, activeIndex, suggestions]);

  function handleKeyDown(e) {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }

  const activeCollectionLabel = NAV_COLLECTIONS.find((c) => c.handle === activeCollection)?.label;

  return (
    <div class="app">
      <header class="app-header">
        <div class="app-header__inner">
          <div class="app-header__brand">
            <img src="https://athoscommerce.com/wp-content/uploads/2025/08/Athos-logo-scaled.png" alt="Athos Commerce" class="app-header__logo" />
            <div class="app-header__titles">
              <span class="app-header__name">Athos Commerce</span>
              <span class="app-header__subtitle">Personalized Search Demo</span>
            </div>
          </div>
          <form class="search-form" onSubmit={handleSubmit} ref={containerRef}>
            <div class="search-form__input-wrap">
              <input
                class="search-form__input"
                type="search"
                placeholder="Search products…"
                value={query}
                onInput={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                aria-label="Search"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                autocomplete="off"
              />
              {showSuggestions && (
                <ul class="suggestions" role="listbox">
                  {suggestions.map((s, i) => (
                    <li
                      key={s}
                      class={`suggestions__item ${i === activeIndex ? 'suggestions__item--active' : ''}`}
                      role="option"
                      aria-selected={i === activeIndex}
                      onMouseDown={() => commitSearch(s)}
                      onMouseEnter={() => setActiveIndex(i)}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button class="search-form__btn" type="submit">Search</button>
          </form>
        </div>
        <nav class="collection-nav" aria-label="Browse collections">
          <ul class="collection-nav__list">
            {NAV_COLLECTIONS.map((col) => (
              <li key={col.handle}>
                <button
                  class={`collection-nav__item ${activeCollection === col.handle ? 'collection-nav__item--active' : ''}`}
                  onClick={() => commitCollection(col.handle)}
                >
                  {col.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main class="app-body">
        {!isActive && (
          <div class="app-empty">
            <div class="persona-preview">
              {PERSONAS.map((p) => (
                <div key={p.id} class="persona-preview__card">
                  <img
                    class="persona-preview__avatar"
                    src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(p.label)}&backgroundColor=d0e0f3&radius=50`}
                    alt={p.label}
                    width="64"
                    height="64"
                  />
                  <strong>{p.label}</strong>
                  <span>{p.tagline}</span>
                </div>
              ))}
            </div>
            <p>Search or browse a collection above to compare results.</p>
          </div>
        )}
        {isActive && (
          <>
            {activeCollectionLabel && (
              <h1 class="collection-heading">{activeCollectionLabel}</h1>
            )}
            <div class="pane-layout">
              {(() => {
                const [uniqueA, uniqueB] = computeDiffs(paneResults[0], paneResults[1]);
                return PERSONAS.map((persona, i) => (
                  <SearchPane
                    key={persona.id}
                    persona={persona}
                    query={submittedQuery}
                    collection={activeCollection}
                    onResults={(r) => setPaneResults((prev) => {
                      const next = [...prev];
                      next[i] = r;
                      return next;
                    })}
                    uniqueIds={i === 0 ? uniqueA : uniqueB}
                  />
                ));
              })()}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
