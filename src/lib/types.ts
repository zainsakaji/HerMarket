export interface Listing {
  id: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  origin: string;
  sellerNote: string;
  image: string | null;
  approved: boolean;
  seller: string;
  timestamp: string;
}

export const CATEGORIES = [
  "All",
  "Textiles",
  "Embroidery",
  "Baskets",
  "Spices",
  "Jewelry",
  "Clothing",
  "Home Decor",
  "Food",
  "Handmade",
  "Organic",
  "Silver",
  "Cotton",
  "Wool",
] as const;

export const SEED_LISTINGS: Listing[] = [
  {
    id: "seed-1",
    title: "Hand-Block Printed Cotton Scarf",
    description: "Vibrant traditional block printing on soft organic cotton. Each piece carries centuries of Rajasthani artisan heritage.",
    tags: ["Textiles", "Cotton", "Handmade"],
    price: 28,
    origin: "Jaipur, India",
    sellerNote: "I print each scarf by hand using wooden blocks my grandmother carved.",
    image: "https://images.unsplash.com/photo-1617627143233-ab93a9b37a1e?w=600",
    approved: true,
    seller: "WhatsApp Seller",
    timestamp: new Date().toISOString(),
  },
  {
    id: "seed-2",
    title: "Embroidered Cushion Cover",
    description: "Intricate mirror-work embroidery on rich cotton canvas. A statement piece that brings warmth to any living space.",
    tags: ["Embroidery", "Textiles", "Home Decor"],
    price: 22,
    origin: "Jaipur, India",
    sellerNote: "Each stitch is done by hand — it takes me three days to finish one cover.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600",
    approved: true,
    seller: "WhatsApp Seller",
    timestamp: new Date().toISOString(),
  },
  {
    id: "seed-3",
    title: "Hand-Woven Sisal Basket",
    description: "Sustainably harvested sisal woven into a stunning geometric pattern. Perfect for storage or as a decorative centrepiece.",
    tags: ["Baskets", "Handmade", "Home Decor"],
    price: 35,
    origin: "Nairobi, Kenya",
    sellerNote: "I weave these baskets with sisal from our family farm in the highlands.",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600",
    approved: true,
    seller: "WhatsApp Seller",
    timestamp: new Date().toISOString(),
  },
  {
    id: "seed-4",
    title: "Dried Spice Bundle",
    description: "A curated selection of sun-dried, hand-ground spices from East African farms. Aromatic, pure, and preservative-free.",
    tags: ["Spices", "Food", "Organic"],
    price: 14,
    origin: "Nairobi, Kenya",
    sellerNote: "My mother taught me to dry these spices in the sun, just as her mother did.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600",
    approved: true,
    seller: "WhatsApp Seller",
    timestamp: new Date().toISOString(),
  },
];
