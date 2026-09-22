import { createFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Total Karo — Restaurant POS for Waiters & Kitchen" },
      { name: "description", content: "Total Karo mobile app: streamlined order taking for waiters and live kitchen display for chefs." },
    ],
  }),
});

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{label}</span>
      <div className="relative w-[320px] h-[660px] rounded-[3rem] bg-foreground p-3 shadow-[0_30px_80px_-30px_oklch(0.72_0.19_50_/_0.45)]">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 h-6 w-32 rounded-b-2xl bg-foreground z-20" />
        <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-background">
          {children}
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-warm)" }}>
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-primary-foreground font-black" style={{ background: "var(--gradient-primary)" }}>T</div>
          <span className="text-xl font-black tracking-tight">Total Karo</span>
        </div>
        <nav className="flex gap-2">
          <Link to="/waiter" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-[var(--shadow-soft)]">Waiter App</Link>
          <Link to="/kitchen" className="px-4 py-2 rounded-full border border-border text-sm font-semibold">Kitchen App</Link>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-6 pb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          Run your restaurant <span className="text-primary">smoother</span>.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          One POS, two perfectly tuned mobile experiences — for the floor and the fire.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-12 place-items-center">
        <Link to="/waiter"><PhoneFrame label="Waiter"><WaiterPreview /></PhoneFrame></Link>
        <Link to="/kitchen"><PhoneFrame label="Kitchen"><KitchenPreview /></PhoneFrame></Link>
      </section>
    </div>
  );
}

function WaiterPreview() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-5 pt-10 pb-4" style={{ background: "var(--gradient-primary)" }}>
        <p className="text-primary-foreground/80 text-xs">Good evening, Rohan</p>
        <p className="text-primary-foreground text-xl font-bold">12 Active Tables</p>
      </div>
      <div className="p-4 grid grid-cols-3 gap-2 overflow-auto">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-xs font-bold ${i % 3 === 0 ? "bg-primary text-primary-foreground" : i % 4 === 0 ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}>
            <ClipboardList className="h-4 w-4 mb-1 opacity-70" />
            T{i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

function KitchenPreview() {
  return (
    <div className="h-full flex flex-col bg-foreground text-background">
      <div className="px-5 pt-10 pb-4 border-b border-background/10">
        <p className="text-background/60 text-xs">Kitchen Display</p>
        <p className="text-xl font-bold">6 Orders in Queue</p>
      </div>
      <div className="p-3 space-y-2 overflow-auto">
        {[
          { t: "T3", item: "Paneer Tikka", time: "2m" },
          { t: "T7", item: "Butter Naan x4", time: "4m" },
          { t: "T1", item: "Dal Makhani", time: "6m" },
        ].map((o, i) => (
          <div key={i} className="rounded-xl p-3 bg-background/5 border-l-4 border-primary">
            <div className="flex justify-between text-xs text-background/60">
              <span>Table {o.t}</span><span>{o.time}</span>
            </div>
            <p className="font-bold mt-1">{o.item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
