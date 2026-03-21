import { Listing } from "@/lib/types";
import { useState } from "react";

interface AdminPanelProps {
  listings: Listing[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function AdminCard({
  listing,
  isPending,
  onApprove,
  onReject,
  flashId,
}: {
  listing: Listing;
  isPending: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  flashId: string | null;
}) {
  return (
    <div
      className={`bg-warm-white rounded-lg overflow-hidden border-l-4 shadow-sm transition-all duration-300
        ${isPending ? "border-l-accent" : "border-l-primary"}
        ${flashId === listing.id ? "animate-flash-green" : ""}
      `}
    >
      <div className="flex gap-4 p-4">
        {listing.image && (
          <img
            src={listing.image}
            alt={listing.title}
            className="w-20 h-20 rounded object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-heading text-lg font-semibold text-foreground truncate">
            {listing.title}
          </h4>
          <p className="text-sm text-muted-foreground font-body">
            📍 {listing.origin} · ${listing.price}
          </p>
          <p className="text-xs text-muted-foreground font-body mt-1 italic truncate">
            "{listing.sellerNote}"
          </p>
        </div>
      </div>
      {isPending && onApprove && onReject && (
        <div className="flex border-t border-sand/30">
          <button
            onClick={() => onApprove(listing.id)}
            className="flex-1 py-2.5 text-sm font-body font-medium text-primary-foreground bg-primary
              hover:bg-olive-light transition-colors active:scale-[0.97]"
          >
            ✓ Approve
          </button>
          <button
            onClick={() => onReject(listing.id)}
            className="flex-1 py-2.5 text-sm font-body font-medium text-muted-foreground bg-background
              hover:bg-sand/30 transition-colors active:scale-[0.97]"
          >
            ✕ Reject
          </button>
        </div>
      )}
      {!isPending && (
        <div className="px-4 pb-3">
          <span className="inline-flex items-center gap-1 text-xs font-body font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            ✓ Live
          </span>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel({ listings, onApprove, onReject }: AdminPanelProps) {
  const [flashId, setFlashId] = useState<string | null>(null);
  const pending = listings.filter((l) => !l.approved);
  const live = listings.filter((l) => l.approved);

  const handleApprove = (id: string) => {
    onApprove(id);
    setFlashId(id);
    setTimeout(() => setFlashId(null), 800);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-fade-up">
      <div>
        <h3 className="font-heading text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
          Pending
          <span className="bg-accent text-accent-foreground text-sm font-body px-2.5 py-0.5 rounded-full">
            {pending.length}
          </span>
        </h3>
        <div className="space-y-3">
          {pending.length === 0 && (
            <p className="text-muted-foreground font-body text-sm py-8 text-center">
              No pending listings — all caught up! 🎉
            </p>
          )}
          {pending.map((l) => (
            <AdminCard
              key={l.id}
              listing={l}
              isPending
              onApprove={handleApprove}
              onReject={onReject}
              flashId={flashId}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
          Live
          <span className="bg-primary/10 text-primary text-sm font-body px-2.5 py-0.5 rounded-full">
            {live.length}
          </span>
        </h3>
        <div className="space-y-3">
          {live.length === 0 && (
            <p className="text-muted-foreground font-body text-sm py-8 text-center">
              No live listings yet.
            </p>
          )}
          {live.map((l) => (
            <AdminCard key={l.id} listing={l} isPending={false} flashId={flashId} />
          ))}
        </div>
      </div>
    </div>
  );
}
