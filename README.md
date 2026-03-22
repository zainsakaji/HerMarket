# HerMarket 🌿

> AI-powered cooperative marketplace connecting rural women artisans directly to global buyers, no middlemen, fair prices, real impact.

## The Problem

Rural women in India, Bangladesh, Kenya, Nepal and beyond produce beautiful handmade goods: textiles, embroidery, baskets, spices, jewelry, clothing. But middlemen buy their products for almost nothing and resell for 10–50× the price in cities or online.

The women already have the skills. They just lack:
- Market access
- Logistics coordination
- Pricing knowledge
- Digital literacy

## The Solution

HerMarket removes every barrier between the artisan and the buyer using AI.

A rural woman sends a **WhatsApp photo + description**. Our AI automatically:
1. Generates a professional product listing
2. Suggests a fair trade price
3. Translates it for global buyers
4. Publishes it to the marketplace after admin approval

No e-commerce knowledge needed. No smartphone app. Just WhatsApp.

---

## How It Works
```
📱 Seller sends WhatsApp photo + description
        ↓
📡 Twilio receives the message
        ↓
🤖 AI analyzes image + generates listing
        ↓
💾 Saved as pending listing
        ↓
✅ Admin approves via dashboard
        ↓
🛍 Live on the marketplace
        ↓
💰 Revenue goes directly to the seller
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Messaging | Twilio WhatsApp API |
| AI | OpenRouter API (Gemini 2.0 Flash) |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| Storage | JSON file (listings.json) |

---

## Project Structure
```
HerMarket/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/              # Shop, Admin, Sell tabs
│   └── main.tsx            # Entry point
├── backend/
│   ├── server.js           # Express backend + Twilio webhook
│   └── package.json        # Backend dependencies
├── public/                 # Static assets
└── package.json            # Frontend dependencies
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- Twilio account
- OpenRouter API key
- Railway account (backend) 
- Vercel account (frontend)

---

### 1. Clone the repo
```bash
git clone https://github.com/zainsakaji/HerMarket.git
cd HerMarket
```

---

### 2. Set up the backend (Railway)

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select this repo
4. Set **Root Directory** to `backend`
5. Add environment variables (see below)
6. Click **Generate Domain** and copy your Railway URL

#### Backend Environment Variables

| Variable | Description | Example |
|---|---|---|
| `TWILIO_ACCOUNT_SID` | From twilio.com/console | `ACxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | From twilio.com/console | `xxxxxxxxxx` |
| `TWILIO_WHATSAPP_NUMBER` | Your Twilio sandbox number | `whatsapp:+14155238886` |
| `OPENROUTER_API_KEY` | From openrouter.ai | `sk-or-xxxxxxxxxx` |
| `PORT` | Server port | `3000` |

---

### 3. Connect Twilio WhatsApp Sandbox

1. Go to [twilio.com/console](https://twilio.com/console)
2. **Messaging → Try it out → Send a WhatsApp message**
3. Connect your phone by sending the join code to `+1 415 523 8886`
4. Go to **Sandbox Settings**
5. Set **"When a message comes in"** to:
```
https://your-app.up.railway.app/webhook
```
6. Method: **HTTP POST** → Save

---

### 4. Set up the frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project** → Import this repo
3. Add environment variables:

| Variable | Description | Example |
|---|---|---|
| `VITE_BACKEND_URL` | Your Railway URL | `https://hermarket.up.railway.app` |
| `VITE_TWILIO_NUMBER` | Twilio sandbox number | `+14155238886` |
| `VITE_SANDBOX_CODE` | Your sandbox join code | `silver-elephant` |

4. Click **Deploy**

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/listings` | Get all listings |
| `POST` | `/webhook` | Twilio WhatsApp webhook |
| `POST` | `/approve/:id` | Approve a pending listing |
| `DELETE` | `/listing/:id` | Delete a listing |

---

## Features

### 🛍 Marketplace (Shop)
- Browse approved artisan products
- Filter by category (Textiles, Jewelry, Spices, etc.)
- See seller stories and origin
- Order directly from the artisan

### 📋 Admin Dashboard
- Review pending listings from WhatsApp
- Approve or reject with one click
- Track live listings

### 📱 Seller Onboarding
- Step-by-step WhatsApp instructions
- Live feed of recently listed products
- No app download required

---

## Demo Flow

1. Open WhatsApp → message `+1 415 523 8886` with join code
2. Send a photo of any handmade product + a description
3. Receive an AI-generated listing reply in seconds
4. Go to the Admin tab → approve the listing
5. See it live on the Shop! 🌿

---

## Team

Built at **Global Hacks** — March 2026

- Harnoor Sagar
- Erjona Kalari
- Zain Al-Sakaji
- Zain Khalbous

---

## License

MIT
