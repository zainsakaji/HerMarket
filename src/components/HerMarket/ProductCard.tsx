import { Listing } from "@/lib/types";
import { useState } from "react";

interface ProductCardProps {
  listing: Listing;
  onOrder: (listing: Listing) => void;
  index: number;
}

export default function ProductCard({ listing, onOrder, index }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article
      className="bg-warm-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col animate-fade-up"
      style={{ animationDelay: `${80 + index * 100}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand/30">
        {listing.image && (
          <img
            src={listing.image}
            alt={listing.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        )}
        {!listing.image && (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-heading text-xl">
            No image
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-xl font-semibold text-foreground leading-snug">
          {listing.title}
        </h3>
        <p className="text-sm text-muted-foreground font-body mt-1 italic">
          "{listing.sellerNote}"
        </p>
        <p className="text-sm text-muted-foreground font-body mt-2">
          📍 {listing.origin}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {listing.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-body font-medium bg-accent text-accent-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between">
          <span className="font-heading text-2xl font-semibold text-primary">
            ${listing.price}
          </span>
          <button
            onClick={() => onOrder(listing)}
            className="px-5 py-2 rounded-md bg-primary text-primary-foreground font-body font-medium text-sm
              hover:bg-olive-light transition-colors duration-200 active:scale-[0.96]"
          >
            Order
          </button>
        </div>
      </div>
    </article>
  );
}
