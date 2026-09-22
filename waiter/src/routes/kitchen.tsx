import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Flame, Timer, Bell } from "lucide-react";
import { seedIfEmpty, updateOrderStatus, useOrders, type OrderStatus } from "@/lib/orders-store";

export const Route = createFileRoute("/kitchen")({
  component: KitchenApp,
  head: () => ({
    meta: [
      { title: "Kitchen App — Total Karo" },
      { name: "description", content: "Live kitchen display: incoming orders, prep timers and one-tap ready — Total Karo." },
    ],
  }),
});

function KitchenApp() {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const orders = useOrders();
  const [, force] = useState(0);

  useEffect(() => { seedIfEmpty(); }, []);
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const visibleAll = orders.filter((o) => o.status !== "served");
  const counts = {
    all: visibleAll.length,
    new: visibleAll.filter((o) => o.status === "new").length,
    cooking: visibleAll.filter((o) => o.status === "cooking").length,
    ready: visibleAll.filter((o) => o.status === "ready").length,
  };
  const visible = filter === "all" ? visibleAll : visibleAll.filter((o) => o.status === filter);

  const advance = (id: string, status: OrderStatus) => {
    const next: OrderStatus = status === "new" ? "cooking" : status === "cooking" ? "ready" : "served";
    updateOrderStatus(id, next);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-foreground text-background flex flex-col">
      <header className="px-5 pt-6 pb-4 border-b border-background/10">
        <div className="flex items-center justify-between">
          <Link to="/" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="text-center">
            <p className="text-xs opacity-60">Total Karo · Kitchen</p>
            <p className="font-bold flex items-center gap-1.5"><Flame className="h-4 w-4 text-primary" /> KDS Live</p>
          </div>
          <button className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center relative">
            <Bell className="h-4 w-4" />
            {counts.new > 0 && <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center animate-pulse">{counts.new}</span>}
          </button>
        </div>
      </header>

      <div className="px-5 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {([
            ["all", "All"], ["new", "New"], ["cooking", "Cooking"], ["ready", "Ready"],
          ] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setFilter(k)} className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${filter === k ? "bg-primary text-primary-foreground" : "bg-background/10 text-background/70"}`}>
              {lbl}
              <span className={`h-5 min-w-5 px-1.5 rounded-full text-[10px] flex items-center justify-center ${filter === k ? "bg-white/25" : "bg-background/10"}`}>{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-5 py-4 space-y-3 pb-20">
        {visible.length === 0 && (
          <div className="text-center py-20 opacity-50 text-sm">No orders. Send one from the Waiter app.</div>
        )}
        {visible.map((o) => {
          const mins = Math.max(0, Math.floor((Date.now() - o.createdAt) / 60000));
          const statusColor =
            o.status === "new" ? "border-primary"
            : o.status === "cooking" ? "border-warning"
            : "border-success";
          const statusLabel = o.status === "new" ? "NEW" : o.status === "cooking" ? "COOKING" : "READY";
          const urgent = mins >= 8 && o.status !== "ready";
          return (
            <div key={o.id} className={`rounded-2xl border-l-4 p-4 bg-background/5 ${statusColor}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">{o.id}</p>
                  <p className="font-black text-xl">Table {o.table}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-full ${o.status === "new" ? "bg-primary text-primary-foreground" : o.status === "cooking" ? "bg-warning text-foreground" : "bg-success text-foreground"}`}>{statusLabel}</span>
                  <p className={`flex items-center justify-end gap-1 mt-1.5 text-xs ${urgent ? "text-primary font-bold" : "opacity-60"}`}>
                    <Timer className="h-3 w-3" /> {mins} min
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                {o.items.map((it, i) => (
                  <div key={i} className="flex items-start justify-between text-sm">
                    <div>
                      <span className="font-semibold">{it.name}</span>
                      {it.note && <p className="text-[11px] text-primary/80 italic">↳ {it.note}</p>}
                    </div>
                    <span className="font-black text-primary">×{it.qty}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => advance(o.id, o.status)}
                className="w-full rounded-xl py-2.5 font-bold text-sm flex items-center justify-center gap-2 text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Check className="h-4 w-4" />
                {o.status === "new" ? "Start Cooking" : o.status === "cooking" ? "Mark Ready" : "Mark Served"}
              </button>
            </div>
          );
        })}
      </main>
    </div>
  );
}
