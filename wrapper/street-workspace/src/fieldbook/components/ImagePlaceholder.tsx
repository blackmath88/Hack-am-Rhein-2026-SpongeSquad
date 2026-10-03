import { copy } from "../data/copy.en.ts";

/** Empty image slot. Stays legible and honest when no image is curated. */
export function ImagePlaceholder({ alt, src, credit, concept = false }: { alt: string; src?: string; credit?: string; concept?: boolean }) {
  return (
    <figure className="fb-image">
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <div className="fb-image-empty" role="img" aria-label={alt}>
          <span>{alt}</span>
        </div>
      )}
      <figcaption>
        {concept && <strong>{copy.imageDisclaimer} </strong>}
        {credit ?? "Image to be curated with credit."}
      </figcaption>
    </figure>
  );
}
