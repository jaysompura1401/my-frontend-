import { useEffect, useState } from "react";

export type OrderStatus = "new" | "cooking" | "ready" | "served";
export type OrderItem = { name: string; qty: number; note?: string };
export type Order = {
  id: string;
  table: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
  readyNotified?: boolean;
};

const ORDERS_KEY = "tk_orders";
const EVENT = "tk_orders_change";

function read(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function write(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(read());
    const sync = () => setOrders(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return orders;
}

export function addOrder(order: Omit<Order, "id" | "createdAt" | "status">) {
  const orders = read();
  orders.unshift({
    ...order,
    id: `K-${Math.floor(Math.random() * 900 + 100)}`,
    createdAt: Date.now(),
    status: "new",
  });
  write(orders);
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const orders = read().map((o) => (o.id === id ? { ...o, status } : o));
  write(orders);
}

export function markNotified(id: string) {
  const orders = read().map((o) => (o.id === id ? { ...o, readyNotified: true } : o));
  write(orders);
}

export function seedIfEmpty() {
  if (read().length > 0) return;
  write([
    { id: "K-103", table: 7, status: "cooking", createdAt: Date.now() - 4 * 60000, items: [{ name: "Butter Chicken", qty: 2 }, { name: "Jeera Rice", qty: 2 }] },
    { id: "K-102", table: 1, status: "cooking", createdAt: Date.now() - 6 * 60000, items: [{ name: "Dal Makhani", qty: 1 }, { name: "Tandoori Roti", qty: 3 }] },
  ]);
}
