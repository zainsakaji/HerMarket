import { Listing, SEED_LISTINGS } from "./types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// Use local state if no backend configured
let localListings: Listing[] = [...SEED_LISTINGS];

export async function fetchListings(): Promise<Listing[]> {
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/listings`);
      if (res.ok) return res.json();
    } catch {
      // fallback to local
    }
  }
  return localListings;
}

export async function approveListing(id: string): Promise<Listing | null> {
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/approve/${id}`, { method: "POST" });
      if (res.ok) return res.json();
    } catch {
      // fallback
    }
  }
  localListings = localListings.map((l) =>
    l.id === id ? { ...l, approved: true } : l
  );
  return localListings.find((l) => l.id === id) || null;
}

export async function deleteListing(id: string): Promise<boolean> {
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/listing/${id}`, { method: "DELETE" });
      if (res.ok) return true;
    } catch {
      // fallback
    }
  }
  localListings = localListings.filter((l) => l.id !== id);
  return true;
}
