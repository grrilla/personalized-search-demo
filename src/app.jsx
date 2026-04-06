import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { SearchPane } from './components/SearchPane';
import { suggest } from './api';
import './app.css';

// Persona configs — add shopper, cart, lastViewed etc. here when ready
const PERSONAS = [
  { id: 'a', label: 'Shopper A', params: {} },
  { id: 'b', label: 'Shopper B', params: {} },
];

export function App() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Fetch suggestions with debounce
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

  // Close dropdown on outside click
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

  return (
    <div class="app">
      <header class="app-header">
        <div class="app-header__inner">
          <div class="app-header__logo">
            <img src="https://athoscommerce.com/wp-content/uploads/2025/08/Athos-logo-scaled.png" alt="Athos Commerce" />
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
      </header>

      <main class="app-body">
        {!submittedQuery && (
          <div class="app-empty">
            <p>Enter a search term above to compare results across personas.</p>
          </div>
        )}
        {submittedQuery && (
          <div class="pane-layout">
            {PERSONAS.map((persona) => (
              <SearchPane
                key={persona.id}
                label={persona.label}
                query={submittedQuery}
                persona={persona.params}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
