import { useState, useEffect, useCallback } from "react";
import { Listing } from "@/lib/types";
import { fetchListings, approveListing, deleteListing } from "@/lib/api";
import Hero from "@/components/HerMarket/Hero";
import CategoryFilter from "@/components/HerMarket/CategoryFilter";
import ProductCard from "@/components/HerMarket/ProductCard";
import OrderModal from "@/components/HerMarket/OrderModal";
import AdminPanel from "@/components/HerMarket/AdminPanel";
import SellTab from "@/components/HerMarket/SellTab";

type Tab = "shop" | "admin" | "sell";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "shop", label: "Shop", icon: "🛍" },
  { key: "admin", label: "Admin", icon: "📋" },
  { key: "sell", label: "Sell", icon: "📱" },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>("shop");
  const [listings, setListings] = useState<Listing[]>([]);
  const [category, setCategory] = useState("All");
  const [orderListing, setOrderListing] = useState<Listing | null>(null);

  const sandboxCode = import.meta.env.VITE_SANDBOX_CODE || "join example-code";

  const loadListings = useCallback(async () => {
    const data = await fetchListings();
    setListings(data);
  }, []);

  useEffect(() => {
    loadListings();
    const interval = setInterval(loadListings, tab === "sell" ? 10000 : 15000);
    return () => clearInterval(interval);
  }, [loadListings, tab]);

  const handleApprove = async (id: string) => {
    await approveListing(id);
    await loadListings();
  };

  const handleReject = async (id: string) => {
    await deleteListing(id);
    await loadListings();
  };

  const approved = listings.filter((l) => l.approved);
  const filtered =
    category === "All"
      ? approved
      : approved.filter((l) => l.tags.includes(category));

  const countries = new Set(approved.map((l) => l.origin.split(", ").pop())).size;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <span className="font-heading text-xl font-semibold text-primary-foreground tracking-tight">
            HerMarket
          </span>
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 active:scale-[0.96]
                  ${
                    tab === t.key
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "text-primary-foreground/60 hover:text-primary-foreground/80"
                  }
                `}
              >
                <span className="mr-1.5">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Shop Tab */}
      {tab === "shop" && (
        <>
          <Hero productCount={approved.length} countryCount={countries} />
          <main className="container max-w-6xl mx-auto px-4 pb-16">
            <CategoryFilter selected={category} onChange={setCategory} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((listing, i) => (
                <ProductCard
                  key={listing.id}
                  listing={listing}
                  onOrder={setOrderListing}
                  index={i}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground font-body py-16">
                No products in this category yet.
              </p>
            )}
          </main>
          <OrderModal listing={orderListing} onClose={() => setOrderListing(null)} />
        </>
      )}

      {/* Admin Tab */}
      {tab === "admin" && (
        <main className="container max-w-5xl mx-auto px-4 py-10">
          <h2 className="font-heading text-3xl font-semibold text-foreground mb-8 animate-fade-up">
            Marketplace Admin
          </h2>
          <AdminPanel
            listings={listings}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </main>
      )}

      {/* Sell Tab */}
      {tab === "sell" && (
        <main className="container max-w-5xl mx-auto px-4 py-10">
          <SellTab recentListings={listings} sandboxCode={sandboxCode} />
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-sand/40 py-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          HerMarket · A cooperative marketplace for women artisans · Fair trade, always.
        </p>
      </footer>
    </div>
  );
}
