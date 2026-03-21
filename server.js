// HerMarket Backend — server.js
// Deploy on Railway with env variables:
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, ANTHROPIC_API_KEY,
// TWILIO_WHATSAPP_NUMBER, PORT

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const LISTINGS_FILE = path.join(__dirname, "listings.json");
const PORT = process.env.PORT || 3000;

// --- Helpers ---
function readListings() {
  if (!fs.existsSync(LISTINGS_FILE)) {
    const seed = [
      {
        id: uuidv4(),
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
        id: uuidv4(),
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
        id: uuidv4(),
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
        id: uuidv4(),
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
    fs.writeFileSync(LISTINGS_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(fs.readFileSync(LISTINGS_FILE, "utf-8"));
}

function writeListings(listings) {
  fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings, null, 2));
}

// --- Anthropic Client ---
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// --- Endpoints ---

// Twilio WhatsApp Webhook
app.post("/webhook", async (req, res) => {
  const body = req.body.Body || "";
  const imageUrl = req.body.MediaUrl0 || null;

  try {
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a marketplace listing assistant for rural artisan women selling handmade goods globally.
The seller sent this message: "${body}"
${imageUrl ? "An image of the product was also sent — analyze it for context." : ""}
Generate a JSON listing with exactly these fields:
- title (short, max 8 words)
- description (2 compelling sentences for international buyers)
- tags (array of 3 from: Textiles, Embroidery, Baskets, Spices, Jewelry, Clothing, Home Decor, Food, Handmade, Organic, Silver, Cotton, Wool)
- price (fair trade USD price as a number)
- origin (region/country inferred from product)
- sellerNote (one warm sentence in first person from the seller)
Return ONLY valid JSON, no markdown.`,
          },
          ...(imageUrl
            ? [{ type: "image", source: { type: "url", url: imageUrl } }]
            : []),
        ],
      },
    ];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages,
    });

    const text = response.content[0].text;
    const listing = JSON.parse(text);

    const newListing = {
      id: uuidv4(),
      ...listing,
      image: imageUrl || null,
      approved: false,
      seller: "WhatsApp Seller",
      timestamp: new Date().toISOString(),
    };

    const listings = readListings();
    listings.push(newListing);
    writeListings(listings);

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>✅ Listing created: '${listing.title}' at $${listing.price} USD. It'll go live once approved by our team!</Message>
</Response>`;

    res.type("text/xml").send(twiml);
  } catch (err) {
    console.error("Webhook error:", err);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Sorry, something went wrong. Please try again!</Message>
</Response>`;
    res.type("text/xml").send(twiml);
  }
});

// Get all listings
app.get("/listings", (req, res) => {
  res.json(readListings());
});

// Approve listing
app.post("/approve/:id", (req, res) => {
  const listings = readListings();
  const listing = listings.find((l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: "Not found" });
  listing.approved = true;
  writeListings(listings);
  res.json(listing);
});

// Delete listing
app.delete("/listing/:id", (req, res) => {
  let listings = readListings();
  const idx = listings.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  listings.splice(idx, 1);
  writeListings(listings);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`HerMarket backend running on port ${PORT}`);
});
