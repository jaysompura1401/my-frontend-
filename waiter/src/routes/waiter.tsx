import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus, Minus, Search, Bell, ClipboardList, Send, Users, Coffee, Pizza, IceCream, Beer, CheckCircle2 } from "lucide-react";
import { addOrder, markNotified, useOrders } from "@/lib/orders-store";

export const Route = createFileRoute("/waiter")({
  component: WaiterApp,
  head: () => ({
    meta: [
      { title: "Waiter App — Total Karo" },
      { name: "description", content: "Take orders, manage tables and send to kitchen — Total Karo waiter app." },
    ],
  }),
});

const tableMeta = Array.from({ length: 16 }).map((_, i) => ({ id: i + 1 }));

const categories = [
  { name: "Starters", icon: Coffee },
  { name: "Mains", icon: Pizza },
  { name: "Desserts", icon: IceCream },
  { name: "Drinks", icon: Beer },
];

const menu = [
  { name: "Paneer Tikka", price: 280, cat: "Starters" },
  { name: "Veg Spring Roll", price: 220, cat: "Starters" },
  { name: "Butter Chicken", price: 380, cat: "Mains" },
  { name: "Dal Makhani", price: 260, cat: "Mains" },
  { name: "Garlic Naan", price: 60, cat: "Mains" },
  { name: "Gulab Jamun", price: 120, cat: "Desserts" },
  { name: "Masala Chai", price: 40, cat: "Drinks" },
];

function WaiterApp() {
  const [view, setView] = useState<"tables" | "menu">("tables");
  const [activeTable, setActiveTable] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState("Starters");
  const [cart, setCart] = useState<Record<string, number>>({});
  const orders = useOrders();

  // Notify when an order goes ready
  useEffect(() => {
    orders.forEach((o) => {
      if (o.status === "ready" && !o.readyNotified) {
        toast.success(`Table ${o.table} — Order ready to serve`, {
          description: `${o.id} · ${o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}`,
          icon: <CheckCircle2 className="h-5 w-5" />,
          duration: 8000,
        });
        markNotified(o.id);
        if (typeof window !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(200);
      }
    });
  }, [orders]);

  const tableStatus = (id: number) => {
    const live = orders.filter((o) => o.table === id && o.status !== "served");
    if (live.some((o) => o.status === "ready")) return "ready" as const;
    if (live.length > 0) return "active" as const;
    return "free" as const;
  };
  const tableTotal = (id: number) =>
    orders
      .filter((o) => o.table === id && o.status !== "served")
      .reduce((s, o) => s + o.items.reduce((a, b) => a + b.qty * (menu.find((m) => m.name === b.name)?.price ?? 0), 0), 0);

  const total = Object.entries(cart).reduce((s, [n, q]) => s + (menu.find((m) => m.name === n)?.price ?? 0) * q, 0);
  const inc = (n: string) => setCart((c) => ({ ...c, [n]: (c[n] ?? 0) + 1 }));
  const dec = (n: string) => setCart((c) => ({ ...c, [n]: Math.max(0, (c[n] ?? 0) - 1) }));

  const sendToKot = () => {
    if (!activeTable || total === 0) return;
    const items = Object.entries(cart).filter(([, q]) => q > 0).map(([name, qty]) => ({ name, qty }));
    addOrder({ table: activeTable, items });
    toast(`Sent to kitchen — Table ${activeTable}`, { description: `${items.length} item(s) · ₹${total}` });
    setCart({});
    setView("tables");
  };

  const activeCount = orders.filter((o) => o.status !== "served").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col" style={{ background: "var(--gradient-warm)" }}>
      <header className="px-5 pt-6 pb-5 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
        <div className="flex items-center justify-between">
          <Link to="/" className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="text-center">
            <p className="text-xs opacity-80">Total Karo · Waiter</p>
            <p className="font-bold">Rohan S.</p>
          </div>
          <button className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center relative">
            <Bell className="h-4 w-4" />
            {readyCount > 0 && <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-warning text-foreground text-[9px] font-bold flex items-center justify-center">{readyCount}</span>}
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <Stat n={String(activeCount)} l="Active" />
          <Stat n={String(readyCount)} l="Ready" />
          <Stat n={String(16 - new Set(orders.filter((o) => o.status !== "served").map((o) => o.table)).size)} l="Free" />
        </div>
      </header>

      <div className="px-5 -mt-3 z-10">
        <div className="bg-card rounded-2xl p-1 flex shadow-[var(--shadow-card)]">
          <button onClick={() => setView("tables")} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${view === "tables" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Tables</button>
          <button onClick={() => setView("menu")} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${view === "menu" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Menu</button>
        </div>
      </div>

      <main className="flex-1 px-5 pt-5 pb-32">
        {view === "tables" ? (
          <div className="grid grid-cols-3 gap-3">
            {tableMeta.map((t) => {
              const status = tableStatus(t.id);
              const amt = tableTotal(t.id);
              const color =
                status === "free" ? "bg-card border-border text-muted-foreground"
                : status === "ready" ? "bg-success/15 border-success text-foreground animate-pulse"
                : "bg-primary/10 border-primary/30 text-foreground";
              return (
                <button
                  key={t.id}
                  onClick={() => { setActiveTable(t.id); setView("menu"); }}
                  className={`aspect-square rounded-2xl border-2 p-2 flex flex-col items-center justify-center ${color}`}
                >
                  <ClipboardList className="h-4 w-4 mb-1 opacity-60" />
                  <p className="font-black text-lg">T{t.id}</p>
                  {status === "free" ? (
                    <p className="text-[10px] uppercase tracking-wide">Free</p>
                  ) : status === "ready" ? (
                    <p className="text-[9px] font-bold uppercase text-success">Ready!</p>
                  ) : (
                    <p className="text-[10px] font-bold">₹{amt}</p>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            {activeTable && (
              <div className="mb-3 flex items-center justify-between bg-accent rounded-xl px-3 py-2">
                <p className="text-sm font-semibold text-accent-foreground">Order for Table {activeTable}</p>
                <button onClick={() => setView("tables")} className="text-xs font-semibold text-primary">Change</button>
              </div>
            )}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input className="w-full bg-card rounded-xl border border-border pl-9 pr-3 py-2.5 text-sm" placeholder="Search dishes" />
            </div>
            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-2 mb-3">
              {categories.map((c) => (
                <button key={c.name} onClick={() => setActiveCat(c.name)} className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${activeCat === c.name ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "bg-card text-muted-foreground border border-border"}`}>
                  <c.icon className="h-3.5 w-3.5" /> {c.name}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {menu.filter((m) => m.cat === activeCat).map((m) => (
                <div key={m.name} className="bg-card rounded-2xl p-3 flex items-center justify-between shadow-[var(--shadow-card)]">
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-sm text-primary font-bold">₹{m.price}</p>
                  </div>
                  {cart[m.name] ? (
                    <div className="flex items-center gap-2 bg-primary/10 rounded-full px-1 py-1">
                      <button onClick={() => dec(m.name)} className="h-7 w-7 rounded-full bg-card flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                      <span className="font-bold w-5 text-center text-sm">{cart[m.name]}</span>
                      <button onClick={() => inc(m.name)} className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                    </div>
                  ) : (
                    <button onClick={() => inc(m.name)} className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[var(--shadow-soft)]"><Plus className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {total > 0 && activeTable && (
        <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto p-4">
          <button onClick={sendToKot} className="w-full rounded-2xl px-5 py-4 flex items-center justify-between text-primary-foreground shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-primary)" }}>
            <div className="text-left">
              <p className="text-xs opacity-80">{Object.values(cart).reduce((a, b) => a + b, 0)} items · Table {activeTable}</p>
              <p className="font-bold text-lg">₹{total}</p>
            </div>
            <div className="flex items-center gap-2 font-semibold"><Send className="h-4 w-4" /> Send to KOT</div>
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-xl py-2">
      <p className="font-black text-lg leading-none">{n}</p>
      <p className="text-[10px] opacity-80 mt-0.5 uppercase tracking-wide">{l}</p>
    </div>
  );
}
