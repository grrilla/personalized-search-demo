export function PersonaCard({ persona }) {
  const avatarUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(persona.label)}&backgroundColor=d0e0f3&radius=50`;

  return (
    <div class="persona-card">
      <img
        class="persona-card__avatar"
        src={avatarUrl}
        alt={persona.label}
        width="52"
        height="52"
      />
      <div class="persona-card__info">
        <span class="persona-card__name">{persona.label}</span>
        <span class="persona-card__tagline">{persona.tagline}</span>
        <p class="persona-card__bio">{persona.bio}</p>
      </div>
    </div>
  );
}
