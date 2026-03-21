import { Listing } from "@/lib/types";

interface OrderModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export default function OrderModal({ listing, onClose }: OrderModalProps) {
  if (!listing) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bark/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-warm-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl animate-fade-up"
      >
        <div className="text-center">
          <span className="text-4xl">🧡</span>
          <h2 className="font-heading text-2xl font-semibold text-foreground mt-3">
            Thank you for your order!
          </h2>
          <p className="font-body text-muted-foreground mt-2">
            You're ordering <strong className="text-foreground">{listing.title}</strong> from{" "}
            <strong className="text-foreground">{listing.origin}</strong> for{" "}
            <strong className="text-primary">${listing.price} USD</strong>.
          </p>
          <div className="mt-5 p-4 rounded-md bg-background border border-sand/40">
            <p className="font-body text-sm text-foreground/80 italic">
              "Your money goes directly to the artisan — no middlemen, no markups. Just fair trade."
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-6 px-8 py-2.5 rounded-md bg-primary text-primary-foreground font-body font-medium
              hover:bg-olive-light transition-colors active:scale-[0.96]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
