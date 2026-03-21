# HerMarket 🌿

**AI-powered cooperative marketplace for rural women artisans.**

A full-stack application that enables rural women artisans to list handmade goods via WhatsApp, with AI-generated listings and a beautiful editorial marketplace frontend.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS (deployed via Lovable)
- **Backend**: Node.js/Express (deploy on Railway)
- **AI**: Claude API (Anthropic) for listing generation
- **Messaging**: Twilio WhatsApp for seller onboarding

## Quick Start

### Frontend (Lovable)

The frontend runs in Lovable with these environment variables:

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Your Railway backend URL (e.g. `https://hermarket.up.railway.app`) |
| `VITE_SANDBOX_CODE` | Twilio WhatsApp sandbox join code |

### Backend (Railway)

1. **Create a Railway project** and connect this repo (or push `server.js`)

2. **Add environment variables** in Railway dashboard:

| Variable | Description | Example |
|---|---|---|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | `ACxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | `xxxxxxxxxx` |
| `ANTHROPIC_API_KEY` | Anthropic API key | `sk-ant-xxxxxxxxxx` |
| `TWILIO_WHATSAPP_NUMBER` | Your Twilio WhatsApp number | `whatsapp:+14155238886` |
| `PORT` | Server port (Railway sets this automatically) | `3000` |

3. **Install dependencies** (Railway does this automatically):

```bash
npm install express twilio @anthropic-ai/sdk axios cors dotenv uuid
```

4. **Configure Twilio webhook**:
   - Go to [Twilio Console](https://console.twilio.com/) → Messaging → WhatsApp Sandbox
   - Set the webhook URL to: `https://your-railway-url.up.railway.app/webhook`
   - Method: POST

5. **Deploy**: Railway auto-deploys on push.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/webhook` | Twilio WhatsApp webhook — receives messages + images, generates AI listings |
| `GET` | `/listings` | Returns all listings |
| `POST` | `/approve/:id` | Approves a pending listing |
| `DELETE` | `/listing/:id` | Deletes a listing |

## How It Works

1. **Artisan sends a WhatsApp message** with a product photo and description
2. **Claude AI analyzes** the message and image, generating a structured listing
3. **Listing appears in Admin panel** as pending for review
4. **Admin approves** → listing goes live in the Shop
5. **Buyers browse and order** directly from the marketplace

## Design System

- **Colors**: Olive green, cream, burgundy, warm-white, bark, sand
- **Fonts**: Cormorant Garamond (headings) + Jost (body)
- **Aesthetic**: Editorial, premium artisan

## License

MIT
