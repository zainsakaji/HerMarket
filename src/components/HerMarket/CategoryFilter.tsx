import { CATEGORIES } from "@/lib/types";

interface CategoryFilterProps {
  selected: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 py-6 animate-fade-up stagger-3">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`
            px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200
            active:scale-[0.96]
            ${
              selected === cat
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-warm-white text-foreground hover:bg-sand/50 border border-sand/60"
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
