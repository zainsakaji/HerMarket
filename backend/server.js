require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const axios = require("axios");
const Anthropic = require("@anthropic-ai/sdk");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const LISTINGS_FILE = path.join(__dirname, "listings.json");

const SEED_LISTINGS = [
  {
    id: "1", approved: true, seller: "Priya Sharma", timestamp: new Date().toISOString(),
    title: "Hand-Block Printed Cotton Scarf",
    description: "Crafted using century-old wooden stamps and natural indigo dye. Each piece carries the heritage of Rajasthan's artisan tradition.",
    tags: ["Textiles", "Cotton", "Handmade"], price: 28, origin: "Jaipur, India",
    sellerNote: "My mother taught me this craft — every stamp tells a story.",
    image: "https://images.unsplash.com/photo-1617627143233-ab93a9b37a1e?w=600",
  },
  {
    id: "2", approved: true, seller: "Meena Devi", timestamp: new Date().toISOString(),
    title: "Embroidered Cushion Cover",
    description: "Dense mirror-work embroidery on ivory cotton. Takes 3 days per piece.",
    tags: ["Embroidery", "Textiles", "Home Decor"], price: 22, origin: "Jaipur, India",
    sellerNote: "I learned this stitch from my grandmother as a young girl.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600",
  },
  {
    id: "3", approved: true, seller: "Amina Wanjiku", timestamp: new Date().toISOString(),
    title: "Hand-Woven Sisal Basket",
    description: "Coiled sisal dyed with natural plant pigments. Each basket takes 2 weeks to complete.",
    tags: ["Baskets", "Handmade", "Home Decor"], price: 35, origin: "Nairobi, Kenya",
    sellerNote: "I harvest the sisal myself near our village.",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600",
  },
  {
    id: "4", approved: true, seller: "Fatuma Osei", timestamp: new Date().toISOString(),
    title: "Dried Spice Bundle",
    description: "Sun-dried cardamom, cloves and cinnamon from Kenyan highland gardens. Intensely aromatic.",
    tags: ["Spices", "Food", "Organic"], price: 14, origin: "Nairobi, Kenya",
    sellerNote: "We dry these spices on our rooftop and bundle them by hand.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600",
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
  const listings = readListings();
  res.json(listings);
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
  const listings = readListings();
  const filtered = listings.filter((l) => l.id !== req.params.id);
  writeListings(filtered);
  res.json({ success: true });
});

app.post("/webhook", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const body = req.body.Body || "";
  const mediaUrl = req.body.MediaUrl0 || null;
  const from = req.body.From || "";

  console.log(`📱 Message from ${from}: "${body}" | Image: ${mediaUrl}`);

  try {
    const messageContent = [];

    if (mediaUrl) {
      console.log("🖼 Downloading image from Twilio...");
      const imageResponse = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID,
          password: process.env.TWILIO_AUTH_TOKEN,
        },
      });
      const base64Image = Buffer.from(imageResponse.data).toString("base64");
      const contentType = imageResponse.headers["content-type"] || "image/jpeg";
      messageContent.push({
        type: "image",
        source: { type: "base64", media_type: contentType, data: base64Image },
      });
    }

    messageContent.push({
      type: "text",
      text: `You are a marketplace listing assistant for rural artisan women selling handmade goods globally.

The seller sent this message: "${body || "No description provided"}"
${mediaUrl ? "Analyze the product image carefully." : "No image was provided."}

Generate a product listing. Return ONLY this exact JSON with no markdown, no explanation:
{
  "title": "short product title max 8 words",
  "description": "Two compelling sentences for international buyers that highlight craftsmanship and origin.",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "price": 25,
  "origin": "Region, Country",
  "sellerNote": "One warm sentence in first person from the seller about how they made this."
}

Tags must be from: Textiles, Embroidery, Baskets, Spices, Jewelry, Clothing, Home Decor, Food, Handmade, Organic, Silver, Cotton, Wool, Winter`,
    });

    console.log("🤖 Calling Claude API...");
    const aiResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: messageContent }],
    });

    const rawText = aiResponse.content.find((b) => b.type === "text")?.text || "";
    const clean = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

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
    console.error("❌ Error processing message:", err.message);
    twiml.message(
      "Sorry, something went wrong. Please try again! 🙏"
    );
  }

  res.set("Content-Type", "text/xml");
  res.send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌿 HerMarket backend running on port ${PORT}`));
