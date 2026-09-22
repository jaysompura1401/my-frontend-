import { n as __toESM } from "../_runtime.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as api } from "./api-Jrc-Ciu4.mjs";
import { r as logout } from "./auth-service-DyClV9WR.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Flame, E as IndianRupee, L as ArrowLeft, c as TriangleAlert, l as TrendingUp, p as ShoppingBag, w as LogOut } from "../_libs/lucide-react.mjs";
import { r as listProducts } from "./pos-api-Bz-cMzwg.mjs";
import { r as money } from "./pos-ui-DlwcW6qV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CooPUTj3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LOW_STOCK_THRESHOLD = 5;
function today() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
async function getDashboard() {
	const day = today();
	const [todayData, monthData, products] = await Promise.all([
		api.get(`/dashboard?start=${day}&end=${day}`),
		api.get(`/dashboard?filter=month`),
		listProducts()
	]);
	return {
		todaySales: Number(todayData.totalRevenue) || 0,
		monthSales: Number(monthData.totalRevenue) || 0,
		orderCount: Number(monthData.totalOrders) || 0,
		lowStock: products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).map((p) => ({
			name: p.name,
			stock: p.stock
		})),
		fastMoving: (monthData.topProducts || []).map((p) => ({
			name: p.name,
			qty: p.totalSold
		}))
	};
}
function Dashboard() {
	const navigate = useNavigate();
	const [data, setData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getDashboard().then(setData).catch(() => setData(null));
	}, []);
	const signOut = () => {
		logout();
		navigate({ to: "/auth" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[100dvh] bg-background p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => navigate({ to: "/pos" }),
						className: "glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " POS"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-lg font-bold",
						children: "Dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: signOut,
						className: "glass rounded-full p-2.5 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: IndianRupee,
						label: "Today's Sales",
						value: money(data?.todaySales ?? 0),
						accent: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: TrendingUp,
						label: "This Month",
						value: money(data?.monthSales ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: ShoppingBag,
						label: "Orders (month)",
						value: String(data?.orderCount ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: TriangleAlert,
						label: "Low Stock Items",
						value: String(data?.lowStock.length ?? 0),
						warn: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Fast Moving",
				icon: Flame,
				children: data?.fastMoving.length ? data.fastMoving.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					left: p.name,
					right: `${p.qty} sold`
				}, p.name)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "No sales yet" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Low Stock",
				icon: TriangleAlert,
				children: data?.lowStock.length ? data.lowStock.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					left: p.name,
					right: `${p.stock} left`,
					warn: true
				}, p.name)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Stock levels healthy" })
			})
		]
	});
}
function Stat({ icon: Icon, label, value, accent, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `glass rounded-2xl p-4 ${accent ? "ring-1 ring-primary/40" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `mb-2 h-5 w-5 ${warn ? "text-warning" : accent ? "text-primary" : "text-muted-foreground"}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-wide text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl font-bold tabnum",
				children: value
			})
		]
	});
}
function Section({ title, icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
				" ",
				title
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass space-y-1 rounded-2xl p-2",
			children
		})]
	});
}
function Row({ left, right, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-xl bg-secondary/40 px-3 py-2 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: left
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-semibold tabnum ${warn ? "text-warning" : "text-muted-foreground"}`,
			children: right
		})]
	});
}
function Empty({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-4 text-center text-sm text-muted-foreground",
		children: text
	});
}
//#endregion
export { Dashboard as component };
