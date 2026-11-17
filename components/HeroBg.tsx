const H = [30, 70, 45, 90, 20, 60, 85, 25, 75, 40, 95, 35];

export default function HeroBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="pixels absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-coral/20 blur-3xl" style={{ animation: "drift 12s ease-in-out infinite" }} />
      <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-coral/10 blur-3xl" style={{ animation: "drift 16s ease-in-out infinite reverse" }} />
      <div className="absolute inset-x-0 bottom-0 flex h-64 items-end justify-around px-6">
        {H.map((h, i) => (
          <div key={i} className={`w-4 origin-bottom rounded-t-lg sm:w-6 ${h >= 50 ? "bg-coral/40" : "bg-line"}`}
            style={{ height: `${h}%`, animation: `pulseBar ${3 + (i % 4)}s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-32 border-t border-dashed border-coral/50" />
    </div>
  );
}
