import { useState, useCallback, useRef } from 'preact/hooks';
import { SearchPane } from './components/SearchPane';
import './app.css';

// Persona configs — add shopper, cart, lastViewed etc. here when ready
const PERSONAS = [
  { id: 'a', label: 'Shopper A', params: {} },
  { id: 'b', label: 'Shopper B', params: {} },
];

export function App() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSubmittedQuery(query.trim());
  }, [query]);

  return (
    <div class="app">
      <header class="app-header">
        <div class="app-header__inner">
          <span class="app-header__logo">Athos</span>
          <form class="search-form" onSubmit={handleSubmit}>
            <input
              class="search-form__input"
              type="search"
              placeholder="Search products…"
              value={query}
              onInput={(e) => setQuery(e.target.value)}
              aria-label="Search"
            />
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
