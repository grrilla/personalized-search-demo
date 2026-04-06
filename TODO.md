# TODO

## Personas
- [ ] Design 2 fake shopper personas (names, demographics, shopping style)
- [ ] Write short profile descriptions for each persona
- [ ] Create avatar/profile images for each persona
- [ ] Wire persona configs into the two panes (shopper ID, lastViewed, cart params)

## Header
- [ ] Add category nav links below the search bar (PLP-style browsing)
- [ ] Clicking a category fires a category page request to both panes simultaneously

## Personalization Data
- [ ] Decide on persona shopping profiles (product affinities, price range, categories)
- [ ] Generate `lastViewed` SKU lists per persona (simulating browse history)
- [ ] Generate `cart` SKU lists per persona (simulating active cart)
- [ ] Optionally generate shopper IDs and pre-warm via Preflight API
- [ ] Validate that results actually diverge between personas once data is wired up

## Polish
- [ ] Show persona profile card above each pane (avatar + name + description)
- [ ] Handle empty/no-results state with branded messaging
