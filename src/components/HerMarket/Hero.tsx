import { useEffect, useRef, useState } from "react";

interface HeroProps {
  productCount: number;
  countryCount: number;
}

function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);

  return (
    <div className="text-center">
      <span className="font-heading text-3xl md:text-4xl font-semibold text-primary-foreground">
        {count}
        {label !== "Middlemen" && "+"}
      </span>
      <span className="block text-sm font-body text-primary-foreground/70 mt-1 tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}

export default function Hero({ productCount, countryCount }: HeroProps) {
  return (
    <section className="bg-primary px-6 py-20 md:py-28">
      <div className="container max-w-4xl mx-auto text-center">
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-semibold text-primary-foreground leading-[1.1] text-balance animate-fade-up">
          Artisan goods,{" "}
          <em className="text-accent-foreground not-italic" style={{ color: "hsl(346, 60%, 65%)" }}>
            directly
          </em>{" "}
          from the women who make them.
        </h1>
        <p className="font-body text-lg text-primary-foreground/70 mt-6 max-w-2xl mx-auto animate-fade-up stagger-1">
          A cooperative marketplace connecting rural artisans to conscious buyers worldwide. Fair prices, zero middlemen, real impact.
        </p>
      </div>

      <div className="container max-w-xl mx-auto mt-14">
        <div className="border-t border-primary-foreground/20 pt-8 flex justify-around animate-fade-up stagger-2">
          <AnimatedCounter target={countryCount} label="Countries" />
          <div className="w-px bg-primary-foreground/20" />
          <AnimatedCounter target={productCount} label="Products" />
          <div className="w-px bg-primary-foreground/20" />
          <AnimatedCounter target={0} label="Middlemen" />
        </div>
      </div>
    </section>
  );
}
