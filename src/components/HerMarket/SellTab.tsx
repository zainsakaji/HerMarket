import { Listing } from "@/lib/types";

interface SellTabProps {
  recentListings: Listing[];
  sandboxCode: string;
}

const STEPS = [
  {
    num: "01",
    title: "Join the sandbox",
    desc: "Send the join code to our WhatsApp number to connect.",
  },
  {
    num: "02",
    title: "Snap a photo",
    desc: "Take a photo of your handmade product — any angle works.",
  },
  {
    num: "03",
    title: "Send a message",
    desc: 'Describe your product: "Cotton scarf, hand-dyed with indigo."',
  },
  {
    num: "04",
    title: "AI does the rest",
    desc: "We generate a beautiful listing, set fair pricing, and publish it.",
  },
];

export default function SellTab({ recentListings, sandboxCode }: SellTabProps) {
  return (
    <div className="animate-fade-up">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground text-balance">
          List your product in 30 seconds.
          <br />
          <span className="text-muted-foreground font-normal">No app needed.</span>
        </h2>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="bg-warm-white rounded-lg p-6 animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="font-heading text-5xl font-bold text-primary/20">{step.num}</span>
            <h4 className="font-heading text-xl font-semibold text-foreground mt-2">{step.title}</h4>
            <p className="font-body text-sm text-muted-foreground mt-1">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* WhatsApp Info */}
      <div className="flex flex-col items-center gap-4 mb-14">
        <p className="font-body text-sm text-muted-foreground uppercase tracking-wider">Send a message to</p>
        <div className="bg-primary text-primary-foreground font-body font-semibold text-lg px-8 py-3 rounded-full shadow-lg">
          whatsapp:+14155238886
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-body text-sm text-muted-foreground">Join code:</span>
          <span className="bg-accent text-accent-foreground font-body font-bold text-lg px-4 py-1 rounded-md">
            {sandboxCode || "join <code>"}
          </span>
        </div>
      </div>

      {/* Phone Mockup */}
      <div className="flex justify-center mb-14">
        <div className="w-72 bg-bark rounded-[2rem] p-3 shadow-2xl">
          <div className="bg-warm-white rounded-[1.5rem] overflow-hidden">
            <div className="bg-primary px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm">
                🌿
              </div>
              <div>
                <p className="text-primary-foreground font-body text-sm font-medium">HerMarket</p>
                <p className="text-primary-foreground/60 font-body text-xs">Online</p>
              </div>
            </div>
            <div className="p-4 space-y-3 min-h-[260px]">
              <div className="flex justify-end">
                <div className="bg-olive-light/20 rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                  <p className="text-xs font-body text-foreground">Cotton scarf, hand-dyed with natural indigo from Jaipur</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-olive-light/20 rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                  <div className="w-full h-16 bg-sand/40 rounded-md flex items-center justify-center text-xs text-muted-foreground">
                    📷 photo.jpg
                  </div>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-background rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%] border border-sand/30">
                  <p className="text-xs font-body text-foreground">
                    ✅ Listing created: 'Hand-Dyed Indigo Cotton Scarf' at $28 USD. It'll go live once approved by our team!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Listings Feed */}
      {recentListings.length > 0 && (
        <div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4 text-center">
            Recent listings received
          </h3>
          <div className="max-w-md mx-auto space-y-3">
            {recentListings.slice(0, 3).map((l, i) => (
              <div
                key={l.id}
                className="bg-warm-white rounded-lg p-4 flex gap-3 items-center border border-sand/30 animate-slide-in-right"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {l.image && (
                  <img src={l.image} alt={l.title} className="w-12 h-12 rounded object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-semibold text-foreground truncate">{l.title}</p>
                  <p className="text-xs text-muted-foreground font-body">📍 {l.origin} · ${l.price}</p>
                </div>
                <span className={`text-xs font-body px-2 py-0.5 rounded-full ${
                  l.approved
                    ? "bg-primary/10 text-primary"
                    : "bg-accent/10 text-accent"
                }`}>
                  {l.approved ? "Live" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
