require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const LISTINGS_FILE = path.join(__dirname, "listings.json");

const SEED_LISTINGS = [
  {
    id: "1",
    approved: true,
    seller: "Priya Sharma",
    timestamp: new Date().toISOString(),
    title: "Hand-Block Printed Cotton Scarf",
    description:
      "Crafted using century-old wooden stamps and natural indigo dye. Each piece carries the heritage of Rajasthan's artisan tradition.",
    tags: ["Textiles", "Cotton", "Handmade"],
    price: 28,
    origin: "Jaipur, India",
    sellerNote: "My mother taught me this craft — every stamp tells a story.",
    image: "https://images.unsplash.com/photo-1617627143233-ab93a9b37a1e?w=600",
  },
  {
    id: "2",
    approved: true,
    seller: "Meena Devi",
    timestamp: new Date().toISOString(),
    title: "Embroidered Cushion Cover",
    description:
      "Dense mirror-work embroidery on ivory cotton. Takes 3 days per piece.",
    tags: ["Embroidery", "Textiles", "Home Decor"],
    price: 22,
    origin: "Jaipur, India",
    sellerNote: "I learned this stitch from my grandmother as a young girl.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600",
  },
];

function readListings() {
  if (!fs.existsSync(LISTINGS_FILE)) {
    fs.writeFileSync(LISTINGS_FILE, JSON.stringify(SEED_LISTINGS, null, 2));
    return SEED_LISTINGS;
  }
  return JSON.parse(fs.readFileSync(LISTINGS_FILE, "utf8"));
}

function writeListings(listings) {
  fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings, null, 2));
}

app.get("/", (req, res) => res.json({ status: "HerMarket backend running ✅" }));

app.get("/listings", (req, res) => {
  res.json(readListings());
});

app.post("/approve/:id", (req, res) => {
  const listings = readListings();
  const idx = listings.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Listing not found" });
  listings[idx].approved = true;
  writeListings(listings);
  res.json(listings[idx]);
});

app.delete("/listing/:id", (req, res) => {
  const listings = readListings().filter((l) => l.id !== req.params.id);
  writeListings(listings);
  res.json({ success: true });
});

app.post("/webhook", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const body = req.body.Body || "";
  const mediaUrl = req.body.MediaUrl0 || null;
  const from = req.body.From || "";

  console.log(`📱 Message from ${from}: "${body}" | Image: ${mediaUrl}`);

  const prompt = `
You are a marketplace listing assistant for rural artisan women selling handmade goods globally.

The seller sent this message: "${body || "No description provided"}"
${
  mediaUrl ? "Analyze the product image carefully." : "No image was provided."
}

Generate a product listing. Return ONLY this exact JSON:
{
  "title": "short product title max 8 words",
  "description": "Two compelling sentences for international buyers that highlight craftsmanship and origin.",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "price": 25,
  "origin": "Region, Country",
  "sellerNote": "One warm sentence in first person from the seller about how they made this."
}

Tags must be from: Textiles, Embroidery, Baskets, Spices, Jewelry, Clothing, Home Decor, Food, Handmade, Organic, Silver, Cotton, Wool, Winter
`;

  try {
    // Declare rawText ONCE
    let rawText;

    const response = await axios.post(
      "https://openrouter.ai/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "user",
            content: mediaUrl ? `${prompt}\n\nImage URL: ${mediaUrl}` : prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Safely extract AI response
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      rawText = response.data.choices[0].message.content;
    } else {
      console.warn("⚠️ OpenRouter response missing choices, using fallback");
      rawText = JSON.stringify({
        title: "Handmade Artisan Product",
        description: body || "A beautiful handmade item crafted with care.",
        tags: ["Handmade"],
        price: 20,
        origin: "Unknown",
        sellerNote: "Made with love by hand.",
      });
    }

    // Parse the AI output safely
    let parsed;
    try {
      const clean = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      parsed = {
        title: "Handmade Artisan Product",
        description: body || "A beautiful handmade item crafted with care.",
        tags: ["Handmade"],
        price: 20,
        origin: "Unknown",
        sellerNote: "Made with love by hand.",
      };
    }

    const newListing = {
      id: uuidv4(),
      title: parsed.title,
      description: parsed.description,
      tags: parsed.tags,
      price: parsed.price,
      origin: parsed.origin,
      sellerNote: parsed.sellerNote,
      image: mediaUrl || null,
      approved: false,
      seller: "WhatsApp Seller",
      phone: from,
      timestamp: new Date().toISOString(),
    };

    const listings = readListings();
    listings.unshift(newListing);
    writeListings(listings);

    console.log(`✅ Listing saved: "${newListing.title}" at $${newListing.price}`);

    twiml.message(
      `✅ Your listing is created!\n\n*${newListing.title}*\n$${newListing.price} USD\n\n${newListing.description}\n\nIt'll go live on HerMarket once approved by our team. Thank you! 🌿`
    );
  } catch (err) {
    console.error("❌ OpenRouter call failed:", err.message);
    twiml.message("Sorry, something went wrong. Please try again! 🙏");
  }

  res.set("Content-Type", "text/xml");
  res.send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌿 HerMarket backend running on port ${PORT}`));
