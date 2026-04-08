import { useState } from 'preact/hooks';

export function ProductCard({ result, isUnique, isPinned }) {
  const { name, price, image, variants, url } = result;

  const swatches = variants?.data ?? [];
  const hasSwatches =
    variants?.optionConfig?.color?.type === 'swatches' && swatches.length > 1;

  const [activeImage, setActiveImage] = useState(image);
  const [activeColor, setActiveColor] = useState(
    swatches[0]?.options?.color?.value ?? null
  );

  function handleSwatchHover(variant) {
    setActiveImage(variant.mappings.core.imageUrl);
    setActiveColor(variant.options.color?.value);
  }

  function handleSwatchLeave() {
    setActiveImage(image);
    setActiveColor(swatches[0]?.options?.color?.value ?? null);
  }

  const formattedPrice = price != null
    ? `$${Number(price).toFixed(2)}`
    : null;

  return (
    <div class={`product-card${isUnique ? ' product-card--unique' : ''}`}>
      <div class="product-card__image-wrap">
        <img
          src={activeImage}
          alt={name}
          class="product-card__image"
          loading="lazy"
        />
        {isPinned && (
          <span class="pin-badge" title="Position pinned by Campaign">
            <svg viewBox="0 0 16 16" fill="currentColor" width="9" height="9" aria-hidden="true">
              <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z"/>
            </svg>
            Pinned
          </span>
        )}
      </div>
      <div class="product-card__info">
        <p class="product-card__name">{name}</p>
        {formattedPrice && (
          <p class="product-card__price">{formattedPrice}</p>
        )}
        {hasSwatches && (
          <div class="product-card__swatches">
            {swatches.map((v) => {
              const color = v.options?.color?.value;
              const swatchImage = v.mappings?.core?.thumbnailImageUrl;
              return (
                <button
                  key={v.mappings.core.uid}
                  class={`swatch ${activeColor === color ? 'swatch--active' : ''}`}
                  title={color}
                  onMouseEnter={() => handleSwatchHover(v)}
                  onMouseLeave={handleSwatchLeave}
                  aria-label={color}
                >
                  {swatchImage
                    ? <img src={swatchImage} alt={color} />
                    : <span style={{ background: color?.toLowerCase() }} />
                  }
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
