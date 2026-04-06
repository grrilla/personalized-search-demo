import { useState } from 'preact/hooks';

export function ProductCard({ result, isUnique }) {
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
