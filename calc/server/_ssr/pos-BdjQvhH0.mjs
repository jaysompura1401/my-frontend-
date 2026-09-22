import { n as __toESM } from "../_runtime.mjs";
import { O as isRedirect, _ as useNavigate, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { i as stringType, n as numberType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { r as logout } from "./auth-service-DyClV9WR.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as CreditCard, C as Mic, F as Banknote, I as Ban, M as Check, N as ChartColumn, O as FileText, S as Minus, T as LoaderCircle, _ as ReceiptText, a as WifiOff, b as Pause, d as Sparkles, f as Smartphone, g as RotateCcw, h as ScanLine, i as Wifi, j as Clock, k as Delete, m as Search, n as ZapOff, o as Wallet, r as X, s as User, t as Zap, u as Trash2, v as Printer, w as LogOut, x as Package, y as Plus } from "../_libs/lucide-react.mjs";
import { a as saveSale, i as removeHeldBill, n as getHeldBills, o as seedDemoProducts, t as findProductByBarcode } from "./pos-api-Bz-cMzwg.mjs";
import { n as haptic, r as money, t as beep } from "./pos-ui-DlwcW6qV.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BGzkeE7z.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pos-BdjQvhH0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var SAFE = /^[0-9+\-*/.() ]*$/;
function evaluate(expr) {
	const clean = expr.replace(/×/g, "*").replace(/÷/g, "/").trim();
	if (!clean || !SAFE.test(clean)) return null;
	try {
		const val = Function(`"use strict";return (${clean})`)();
		return typeof val === "number" && isFinite(val) ? val : null;
	} catch {
		return null;
	}
}
function round2(n) {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}
function useCart() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [buffer, setBuffer] = (0, import_react.useState)("");
	const [discount, setDiscount] = (0, import_react.useState)(0);
	const [customerName, setCustomerName] = (0, import_react.useState)("");
	const [gstEnabled, setGstEnabled] = (0, import_react.useState)(true);
	const [heldId, setHeldId] = (0, import_react.useState)(null);
	const totals = (0, import_react.useMemo)(() => {
		const subtotal = round2(items.reduce((a, i) => a + i.price * i.qty, 0));
		const afterDisc = Math.max(0, subtotal - discount);
		const tax = gstEnabled ? round2(afterDisc * .18) : 0;
		const total = round2(afterDisc + tax);
		const count = items.reduce((a, i) => a + i.qty, 0);
		return {
			subtotal,
			discount: round2(discount),
			tax,
			total,
			count
		};
	}, [
		items,
		discount,
		gstEnabled
	]);
	const numericBuffer = (0, import_react.useCallback)(() => {
		const v = evaluate(buffer);
		return v == null ? null : v;
	}, [buffer]);
	return {
		items,
		buffer,
		discount,
		customerName,
		gstEnabled,
		heldId,
		totals,
		numericBuffer,
		setCustomerName,
		setGstEnabled,
		setDiscount,
		pressKey: (0, import_react.useCallback)((k) => {
			setBuffer((b) => {
				if (k === "÷" || k === "×" || k === "-" || k === "+") {
					if (!b) return b === "" && k === "-" ? "-" : b;
					const last = b.slice(-1);
					if ("÷×-+".includes(last)) return b.slice(0, -1) + k;
					return b + k;
				}
				if (k === ".") {
					const seg = b.split(/[÷×\-+]/).pop() ?? "";
					if (seg.includes(".")) return b;
					return b + (seg === "" ? "0." : ".");
				}
				return b + k;
			});
		}, []),
		evaluateBuffer: (0, import_react.useCallback)(() => {
			const v = evaluate(buffer);
			if (v != null) setBuffer(String(round2(v)));
		}, [buffer]),
		clearBuffer: (0, import_react.useCallback)(() => setBuffer(""), []),
		backspace: (0, import_react.useCallback)(() => setBuffer((b) => b.slice(0, -1)), []),
		addProduct: (0, import_react.useCallback)((p, qty = 1) => {
			setItems((cur) => {
				const idx = cur.findIndex((i) => i.productId === p.id);
				if (idx >= 0) {
					const copy = [...cur];
					copy[idx] = {
						...copy[idx],
						qty: copy[idx].qty + qty
					};
					return copy;
				}
				return [...cur, {
					productId: p.id,
					name: p.name,
					price: Number(p.price),
					qty,
					taxRate: Number(p.tax_rate)
				}];
			});
			setBuffer("");
		}, []),
		addCustomLine: (0, import_react.useCallback)((amount) => {
			setItems((cur) => [...cur, {
				productId: null,
				name: "Custom amount",
				price: amount,
				qty: 1,
				taxRate: 0
			}]);
			setBuffer("");
		}, []),
		addNamedLine: (0, import_react.useCallback)((name, price, qty = 1, taxRate = 0) => {
			setItems((cur) => [...cur, {
				productId: null,
				name,
				price,
				qty,
				taxRate
			}]);
			setBuffer("");
		}, []),
		setLastQty: (0, import_react.useCallback)(() => {
			const v = numericBuffer();
			if (v == null || v <= 0) return;
			setItems((cur) => {
				if (cur.length === 0) return cur;
				const copy = [...cur];
				copy[copy.length - 1] = {
					...copy[copy.length - 1],
					qty: Math.round(v)
				};
				return copy;
			});
			setBuffer("");
		}, [numericBuffer]),
		setLastPrice: (0, import_react.useCallback)(() => {
			const v = numericBuffer();
			if (v == null || v < 0) return;
			setItems((cur) => {
				if (cur.length === 0) return cur;
				const copy = [...cur];
				copy[copy.length - 1] = {
					...copy[copy.length - 1],
					price: round2(v)
				};
				return copy;
			});
			setBuffer("");
		}, [numericBuffer]),
		applyDiscountPercent: (0, import_react.useCallback)(() => {
			const v = numericBuffer();
			if (v == null || v < 0) return;
			const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
			setDiscount(round2(subtotal * v / 100));
			setBuffer("");
		}, [numericBuffer, items]),
		updateQty: (0, import_react.useCallback)((index, qty) => {
			setItems((cur) => cur.map((i, idx) => idx === index ? {
				...i,
				qty
			} : i).filter((i) => i.qty > 0));
		}, []),
		removeAt: (0, import_react.useCallback)((index) => {
			setItems((cur) => cur.filter((_, idx) => idx !== index));
		}, []),
		removeLast: (0, import_react.useCallback)(() => {
			setItems((cur) => cur.slice(0, -1));
		}, []),
		reset: (0, import_react.useCallback)(() => {
			setItems([]);
			setBuffer("");
			setDiscount(0);
			setCustomerName("");
			setHeldId(null);
		}, []),
		loadSale: (0, import_react.useCallback)((sale) => {
			setItems(sale.items ?? []);
			setDiscount(Number(sale.discount) || 0);
			setCustomerName(sale.customer_name ?? "");
			setHeldId(sale.id);
			setBuffer("");
		}, [])
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var variants = {
	num: "glass text-foreground hover:bg-secondary/60 active:scale-[0.96]",
	op: "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 active:scale-[0.96]",
	equals: "bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 active:scale-[0.96]",
	smart: "glass text-muted-foreground hover:text-foreground hover:bg-secondary/60 active:scale-[0.95]",
	danger: "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25 active:scale-[0.96]",
	accent: "bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 active:scale-[0.96]"
};
function CalcButton({ children, onTap, onHold, variant = "num", className, sub }) {
	let timer = null;
	let held = false;
	const start = () => {
		held = false;
		if (onHold) timer = setTimeout(() => {
			held = true;
			haptic([
				10,
				30,
				10
			]);
			onHold();
		}, 450);
	};
	const end = () => {
		if (timer) clearTimeout(timer);
		if (!held) {
			haptic(8);
			onTap();
		}
	};
	const cancel = () => {
		if (timer) clearTimeout(timer);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onPointerDown: start,
		onPointerUp: end,
		onPointerLeave: cancel,
		className: cn("relative flex select-none flex-col items-center justify-center rounded-2xl font-display text-2xl font-semibold transition-all duration-100 touch-manipulation", variants[variant], className),
		children: [children, sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute bottom-1 text-[9px] font-medium uppercase tracking-wider opacity-50",
			children: sub
		})]
	});
}
function BarcodeScanner({ onDetected, onClose }) {
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [flashOn, setFlashOn] = (0, import_react.useState)(false);
	const [supportsFlash, setSupportsFlash] = (0, import_react.useState)(false);
	const lastRef = (0, import_react.useRef)({
		code: "",
		at: 0
	});
	(0, import_react.useEffect)(() => {
		let raf = 0;
		let detector = null;
		let active = true;
		const start = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
				streamRef.current = stream;
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					await videoRef.current.play();
				}
				const caps = stream.getVideoTracks()[0].getCapabilities?.();
				setSupportsFlash(Boolean(caps?.torch));
				const BD = window.BarcodeDetector;
				if (!BD) {
					setError("Barcode scanning isn't supported in this browser. Use Chrome on Android, or type the barcode.");
					return;
				}
				detector = new BD({ formats: [
					"ean_13",
					"ean_8",
					"upc_a",
					"upc_e",
					"code_128",
					"code_39",
					"qr_code"
				] });
				const scan = async () => {
					if (!active || !videoRef.current || !detector) return;
					try {
						const codes = await detector.detect(videoRef.current);
						if (codes.length) {
							const code = codes[0].rawValue;
							const now = Date.now();
							if (code && (code !== lastRef.current.code || now - lastRef.current.at > 1200)) {
								lastRef.current = {
									code,
									at: now
								};
								beep();
								haptic([
									12,
									40,
									12
								]);
								onDetected(code);
							}
						}
					} catch {}
					raf = requestAnimationFrame(scan);
				};
				scan();
			} catch {
				setError("Camera access denied. Allow camera permission to scan.");
			}
		};
		start();
		return () => {
			active = false;
			cancelAnimationFrame(raf);
			streamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, [onDetected]);
	const toggleFlash = async () => {
		const track = streamRef.current?.getVideoTracks()[0];
		if (!track) return;
		try {
			await track.applyConstraints({ advanced: [{ torch: !flashOn }] });
			setFlashOn((v) => !v);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-black",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				playsInline: true,
				muted: true,
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center justify-between p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "glass rounded-full p-3 text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				}), supportsFlash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: toggleFlash,
					className: "glass rounded-full p-3 text-white",
					children: flashOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZapOff, { className: "h-5 w-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex flex-1 items-center justify-center",
				children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-8 text-center text-sm text-white/90",
					children: error
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-48 w-72 rounded-3xl border-2 border-white/70",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 right-0 top-1/2 h-0.5 animate-pulse bg-accent" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative pb-10 text-center text-sm font-medium text-white/80",
				children: "Point at a barcode — continuous scan"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var searchProducts = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("44cbe103d6bc3f41bc95173f044e78c211a41ad1bfcf96d063e2af81a451046a"));
function SearchSheet({ initialQuery = "", onPick, onClose }) {
	const run = useServerFn(searchProducts);
	const [q, setQ] = (0, import_react.useState)(initialQuery);
	const [results, setResults] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		inputRef.current?.focus();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!q.trim()) {
			setResults([]);
			return;
		}
		setLoading(true);
		const t = setTimeout(async () => {
			try {
				const r = await run({ data: { q } });
				setResults(r);
			} catch {
				setResults([]);
			} finally {
				setLoading(false);
			}
		}, 180);
		return () => clearTimeout(t);
	}, [q, run]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-background/80 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass m-3 flex items-center gap-2 rounded-2xl px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 shrink-0 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search name, brand, SKU, barcode…",
					className: "w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto px-3 pb-6",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-4 text-center text-sm text-muted-foreground",
					children: "Searching…"
				}),
				!loading && q && results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-4 text-center text-sm text-muted-foreground",
					children: "No products found."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: results.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							onPick(p);
							onClose();
						},
						className: "glass flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left active:scale-[0.99]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: [[p.brand, p.category].filter(Boolean).join(" · "), Number(p.stock) <= 5 ? " · Low stock" : ""]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display font-semibold tabnum",
								children: money(Number(p.price))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary/15 p-1.5 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
							})]
						})]
					}, p.id))
				})
			]
		})]
	});
}
var methods = [
	{
		id: "Cash",
		icon: Banknote
	},
	{
		id: "UPI",
		icon: Smartphone
	},
	{
		id: "Card",
		icon: CreditCard
	},
	{
		id: "Wallet",
		icon: Wallet
	},
	{
		id: "Credit",
		icon: Wallet
	},
	{
		id: "Split",
		icon: Wallet
	}
];
function PaymentSheet({ total, defaultName = "", onConfirm, onInvoice, onClose }) {
	const [method, setMethod] = (0, import_react.useState)("Cash");
	const [tendered, setTendered] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)(defaultName);
	const [phone, setPhone] = (0, import_react.useState)("");
	const change = method === "Cash" && tendered ? Math.max(0, Number(tendered) - total) : 0;
	const details = () => ({
		method,
		customerName: name.trim(),
		customerPhone: phone.trim()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex flex-col justify-end bg-background/70 backdrop-blur-md",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass animate-in slide-in-from-bottom max-h-[92dvh] overflow-y-auto rounded-t-3xl p-5 pb-9",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Payment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-full p-1 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 rounded-2xl bg-primary/10 p-4 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						children: "Amount due (incl. 18% GST)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl font-bold tabnum text-gradient-primary",
						children: money(total)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Customer name",
						className: "glass col-span-2 w-full rounded-2xl px-4 py-3 text-sm outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "tel",
						inputMode: "tel",
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						placeholder: "Phone number",
						className: "glass col-span-2 w-full rounded-2xl px-4 py-3 text-sm tabnum outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid grid-cols-3 gap-2",
					children: methods.map((m) => {
						const Icon = m.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								haptic();
								setMethod(m.id);
							},
							className: `flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs font-medium transition-all ${method === m.id ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), m.id]
						}, m.id);
					})
				}),
				method === "Cash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						inputMode: "decimal",
						value: tendered,
						onChange: (e) => setTendered(e.target.value),
						placeholder: "Cash tendered",
						className: "glass w-full rounded-2xl px-4 py-3 text-lg tabnum outline-none"
					}), tendered && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-center text-sm",
						children: ["Change: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold tabnum text-success",
							children: money(change)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							haptic();
							onInvoice("proforma", details());
						},
						className: "flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/5 py-3 text-sm font-semibold text-primary active:scale-[0.98]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), "Proforma"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							haptic();
							onInvoice("gst", details());
						},
						className: "flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/5 py-3 text-sm font-semibold text-primary active:scale-[0.98]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "h-4 w-4" }), "GST Invoice"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						haptic([
							10,
							30,
							10
						]);
						onConfirm(details());
					},
					className: "gradient-primary flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-display text-lg font-semibold text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.98]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-5 w-5" }),
						"Complete · ",
						money(total)
					]
				})
			]
		})
	});
}
function HeldBillsSheet({ onPick, onClose }) {
	const [bills, setBills] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = () => {
		setLoading(true);
		setBills(getHeldBills());
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex flex-col justify-end bg-background/70 backdrop-blur-md",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass max-h-[75vh] overflow-y-auto rounded-t-3xl p-5 pb-9",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Held Bills"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-full p-1 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-6 text-center text-sm text-muted-foreground",
					children: "Loading…"
				}),
				!loading && bills.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-6 text-center text-sm text-muted-foreground",
					children: "No held bills."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: bills.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass flex items-center justify-between rounded-2xl px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => onPick(b),
								className: "min-w-0 flex-1 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium",
									children: b.customer_name || "Walk-in"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
										new Date(b.created_at).toLocaleTimeString("en-IN", {
											hour: "2-digit",
											minute: "2-digit"
										}),
										" · ",
										b.items?.length ?? 0,
										" items"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-3 font-display font-semibold tabnum",
								children: money(Number(b.total))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									removeHeldBill(b.id);
									load();
								},
								className: "rounded-full p-2 text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}, b.id))
				})
			]
		})
	});
}
var parseVoiceOrder = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ transcript: stringType() }).parse(d)).handler(createSsrRpc("079f03386dd13317194cc41290cfadc9e9ac2165239066176a529d2f6102bb4e"));
var billingAssistant = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ items: arrayType(objectType({
	name: stringType(),
	qty: numberType()
})) }).parse(d)).handler(createSsrRpc("9e24f24623e933dd507e61bff8a41983a213eeae67304dbf024ed882c99e144a"));
function printReceipt({ items, totals, customerName, paymentMethod, shopName = "My Store" }) {
	const rows = items.map((i) => `<tr><td>${i.name}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">${(i.price * i.qty).toFixed(2)}</td></tr>`).join("");
	const html = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt</title>
  <style>
    *{font-family:'Courier New',monospace}
    body{width:280px;margin:0 auto;padding:12px;color:#000}
    h1{font-size:18px;text-align:center;margin:0 0 2px}
    .muted{text-align:center;font-size:11px;color:#444;margin:0}
    table{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px}
    td,th{padding:3px 0}
    thead th{border-bottom:1px dashed #000;text-align:left}
    .tot td{font-weight:bold}
    hr{border:none;border-top:1px dashed #000;margin:8px 0}
    .row{display:flex;justify-content:space-between;font-size:12px}
  </style></head><body>
    <h1>${shopName}</h1>
    <p class="muted">${(/* @__PURE__ */ new Date()).toLocaleString("en-IN")}</p>
    ${customerName ? `<p class="muted">Customer: ${customerName}</p>` : ""}
    <table>
      <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Amt</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <hr/>
    <div class="row"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
    ${totals.discount ? `<div class="row"><span>Discount</span><span>-${totals.discount.toFixed(2)}</span></div>` : ""}
    ${totals.tax ? `<div class="row"><span>GST</span><span>${totals.tax.toFixed(2)}</span></div>` : ""}
    <hr/>
    <div class="row" style="font-size:15px;font-weight:bold"><span>TOTAL</span><span>₹${totals.total.toFixed(2)}</span></div>
    ${paymentMethod ? `<p class="muted" style="margin-top:8px">Paid via ${paymentMethod}</p>` : ""}
    <p class="muted" style="margin-top:10px">Thank you! Visit again.</p>
    <script>window.onload=function(){window.print();}<\/script>
  </body></html>`;
	const w = window.open("", "_blank", "width=320,height=600");
	if (!w) return;
	w.document.write(html);
	w.document.close();
}
var GST_RATE = 18;
function printInvoice({ items, totals, type, customerName, customerPhone, paymentMethod, shopName = "My Store", gstin = "22AAAAA0000A1Z5" }) {
	const isGst = type === "gst";
	const title = isGst ? "TAX INVOICE (GST)" : "PROFORMA INVOICE";
	const taxable = Math.max(0, totals.subtotal - totals.discount);
	const cgst = isGst ? totals.tax / 2 : 0;
	const sgst = isGst ? totals.tax / 2 : 0;
	const invoiceNo = `${isGst ? "INV" : "PI"}-${Date.now().toString().slice(-8)}`;
	const rows = items.map((i, idx) => `<tr>
        <td>${idx + 1}</td>
        <td>${i.name}</td>
        <td class="r">${i.price.toFixed(2)}</td>
        <td class="c">${i.qty}</td>
        <td class="r">${(i.price * i.qty).toFixed(2)}</td>
      </tr>`).join("");
	const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    *{font-family:'Segoe UI',Arial,sans-serif;box-sizing:border-box}
    body{max-width:780px;margin:0 auto;padding:32px;color:#1a1a1a}
    .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #ea6a1e;padding-bottom:16px}
    .brand{font-size:26px;font-weight:800;background:linear-gradient(135deg,#f59e0b,#ea580c);-webkit-background-clip:text;background-clip:text;color:transparent}
    .doc{text-align:right}
    .doc h2{margin:0;font-size:20px;color:#ea580c;letter-spacing:1px}
    .doc p{margin:2px 0;font-size:12px;color:#555}
    .meta{display:flex;justify-content:space-between;margin:20px 0;font-size:13px}
    .meta .box{background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px 16px;min-width:240px}
    .meta h4{margin:0 0 6px;font-size:11px;text-transform:uppercase;color:#ea580c;letter-spacing:.5px}
    table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px}
    th{background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;padding:10px 8px;text-align:left}
    td{padding:9px 8px;border-bottom:1px solid #eee}
    .r{text-align:right}.c{text-align:center}
    .totals{margin-top:16px;margin-left:auto;width:300px;font-size:13px}
    .totals .row{display:flex;justify-content:space-between;padding:5px 0}
    .totals .grand{border-top:2px solid #ea6a1e;margin-top:6px;padding-top:10px;font-size:18px;font-weight:800;color:#ea580c}
    .note{margin-top:24px;font-size:11px;color:#777;text-align:center;border-top:1px dashed #ddd;padding-top:14px}
    @media print{body{padding:10px}}
  </style></head><body>
    <div class="top">
      <div>
        <div class="brand">${shopName}</div>
        ${isGst ? `<p style="margin:4px 0;font-size:12px;color:#555">GSTIN: ${gstin}</p>` : ""}
      </div>
      <div class="doc">
        <h2>${title}</h2>
        <p>No: ${invoiceNo}</p>
        <p>${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}</p>
      </div>
    </div>
    <div class="meta">
      <div class="box">
        <h4>Billed To</h4>
        <div>${customerName || "Walk-in Customer"}</div>
        ${customerPhone ? `<div>${customerPhone}</div>` : ""}
      </div>
      <div class="box">
        <h4>Payment</h4>
        <div>${paymentMethod || (isGst ? "—" : "Not paid (Proforma)")}</div>
      </div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Item</th><th class="r">Rate</th><th class="c">Qty</th><th class="r">Amount</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <div class="row"><span>Subtotal</span><span>₹${totals.subtotal.toFixed(2)}</span></div>
      ${totals.discount ? `<div class="row"><span>Discount</span><span>-₹${totals.discount.toFixed(2)}</span></div>` : ""}
      ${isGst ? `<div class="row"><span>Taxable Value</span><span>₹${taxable.toFixed(2)}</span></div>
             <div class="row"><span>CGST @ ${GST_RATE / 2}%</span><span>₹${cgst.toFixed(2)}</span></div>
             <div class="row"><span>SGST @ ${GST_RATE / 2}%</span><span>₹${sgst.toFixed(2)}</span></div>` : `<div class="row" style="color:#999"><span>GST (added on invoice)</span><span>₹${totals.tax.toFixed(2)}</span></div>`}
      <div class="row grand"><span>Total</span><span>₹${totals.total.toFixed(2)}</span></div>
    </div>
    <p class="note">${isGst ? "This is a computer-generated GST tax invoice. Thank you for your business!" : "This is a Proforma Invoice and not a valid tax invoice for GST purposes."}</p>
    <script>window.onload=function(){window.print();}<\/script>
  </body></html>`;
	const win = window.open("", "_blank", "width=820,height=900");
	if (!win) return;
	win.document.write(html);
	win.document.close();
}
function PosPage() {
	const navigate = useNavigate();
	const cart = useCart();
	const voiceFn = useServerFn(parseVoiceOrder);
	const assistFn = useServerFn(billingAssistant);
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [online, setOnline] = (0, import_react.useState)(true);
	const [scanOpen, setScanOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	const [recallOpen, setRecallOpen] = (0, import_react.useState)(false);
	const [listening, setListening] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [tips, setTips] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3 * 20);
		return () => clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		const up = () => setOnline(true);
		const down = () => setOnline(false);
		setOnline(navigator.onLine);
		window.addEventListener("online", up);
		window.addEventListener("offline", down);
		return () => {
			window.removeEventListener("online", up);
			window.removeEventListener("offline", down);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (cart.items.length === 0) {
			setTips([]);
			return;
		}
		const t = setTimeout(async () => {
			try {
				const r = await assistFn({ data: { items: cart.items.map((i) => ({
					name: i.name,
					qty: i.qty
				})) } });
				setTips(r);
			} catch {}
		}, 900);
		return () => clearTimeout(t);
	}, [cart.items]);
	const handleBarcode = async (code) => {
		try {
			const p = await findProductByBarcode(code);
			if (p) {
				cart.addProduct(p);
				toast.success(`${p.name} added`);
			} else toast.error(`No product for ${code}`);
		} catch {
			toast.error("Lookup failed");
		}
	};
	const startVoice = () => {
		const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SR) {
			toast.error("Voice not supported in this browser.");
			return;
		}
		const rec = new SR();
		rec.lang = "en-IN";
		rec.interimResults = false;
		rec.onstart = () => setListening(true);
		rec.onerror = () => setListening(false);
		rec.onend = () => setListening(false);
		rec.onresult = async (e) => {
			const transcript = e.results[0][0].transcript;
			toast.message(`Heard: "${transcript}"`);
			try {
				const items = await voiceFn({ data: { transcript } });
				if (items.length === 0) {
					toast.error("Couldn't understand the order.");
					return;
				}
				items.forEach((it) => cart.addNamedLine(it.name, Number(it.price) || 0, Number(it.qty) || 1, 5));
				toast.success(`Added ${items.length} item(s)`);
			} catch {
				toast.error("Voice parse failed");
			}
		};
		rec.start();
	};
	const finalize = async (details) => {
		setBusy(true);
		const name = details.customerName || cart.customerName || null;
		try {
			await saveSale({
				id: cart.heldId ?? void 0,
				customerName: name,
				customerMobile: details.customerPhone || null,
				items: cart.items,
				subtotal: cart.totals.subtotal,
				discount: cart.totals.discount,
				tax: cart.totals.tax,
				total: cart.totals.total,
				paymentMethod: details.method,
				status: "paid"
			});
			printInvoice({
				items: cart.items,
				totals: cart.totals,
				type: "gst",
				customerName: name ?? void 0,
				customerPhone: details.customerPhone || void 0,
				paymentMethod: details.method
			});
			toast.success(`Sale completed · ${money(cart.totals.total)}`);
			cart.reset();
			setPayOpen(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save sale");
		} finally {
			setBusy(false);
		}
	};
	const handleInvoice = (type, details) => {
		if (details.customerName) cart.setCustomerName(details.customerName);
		printInvoice({
			items: cart.items,
			totals: cart.totals,
			type,
			customerName: details.customerName || cart.customerName || void 0,
			customerPhone: details.customerPhone || void 0,
			paymentMethod: type === "gst" ? details.method : void 0
		});
		toast.success(type === "gst" ? "GST invoice generated" : "Proforma invoice generated");
	};
	const holdBill = async () => {
		if (cart.items.length === 0) return;
		setBusy(true);
		try {
			await saveSale({
				id: cart.heldId ?? void 0,
				customerName: cart.customerName || null,
				items: cart.items,
				subtotal: cart.totals.subtotal,
				discount: cart.totals.discount,
				tax: cart.totals.tax,
				total: cart.totals.total,
				paymentMethod: null,
				status: "held"
			});
			toast.success("Bill held");
			cart.reset();
		} catch {
			toast.error("Could not hold bill");
		} finally {
			setBusy(false);
		}
	};
	const openPayment = () => {
		if (cart.items.length === 0) {
			toast.error("Cart is empty");
			return;
		}
		setPayOpen(true);
	};
	const doPrint = () => {
		if (cart.items.length === 0) return;
		printReceipt({
			items: cart.items,
			totals: cart.totals,
			customerName: cart.customerName
		});
	};
	const editCustomer = () => {
		const name = window.prompt("Customer name", cart.customerName);
		if (name !== null) cart.setCustomerName(name);
	};
	const signOut = () => {
		logout();
		navigate({ to: "/auth" });
	};
	const seed = async () => {
		setBusy(true);
		try {
			const r = await seedDemoProducts();
			toast.success(r.inserted ? `Added ${r.inserted} sample products` : "Products already exist");
		} catch {
			toast.error("Seed failed");
		} finally {
			setBusy(false);
		}
	};
	const touchStart = (0, import_react.useRef)(null);
	const onTouchStart = (e) => {
		touchStart.current = {
			x: e.touches[0].clientX,
			y: e.touches[0].clientY
		};
	};
	const onTouchEnd = (e) => {
		if (!touchStart.current) return;
		const dx = e.changedTouches[0].clientX - touchStart.current.x;
		const dy = e.changedTouches[0].clientY - touchStart.current.y;
		if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) if (dx < 0) {
			cart.removeLast();
			haptic(15);
		} else openPayment();
		touchStart.current = null;
	};
	const t = cart.totals;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[100dvh] flex-col overflow-hidden bg-background p-3 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass mb-2 rounded-2xl px-4 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: editCustomer,
						className: "flex items-center gap-1 font-medium text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }), cart.customerName || "Walk-in"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => cart.setGstEnabled(!cart.gstEnabled),
								className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${cart.gstEnabled ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`,
								children: ["GST 18% ", cart.gstEnabled ? "ON" : "OFF"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabnum",
								children: now.toLocaleTimeString("en-IN", {
									hour: "2-digit",
									minute: "2-digit"
								})
							}),
							online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-3.5 w-3.5 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "h-3.5 w-3.5 text-warning" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => navigate({ to: "/dashboard" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4 text-muted-foreground" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: signOut,
								"aria-label": "Log out",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 text-muted-foreground" })
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] uppercase tracking-wide text-muted-foreground",
						children: [
							t.count,
							" item",
							t.count === 1 ? "" : "s"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-bold tabnum",
						children: money(t.total)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right text-[11px] text-muted-foreground tabnum",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Sub ", money(t.subtotal)] }),
							t.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-destructive",
								children: ["Disc -", money(t.discount)]
							}),
							t.tax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["GST ", money(t.tax)] })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass mb-2 flex min-h-0 flex-1 flex-col rounded-2xl p-2",
				onTouchStart,
				onTouchEnd,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto",
						children: cart.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-8 w-8 opacity-40" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: "Scan, search or type to start billing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: seed,
									className: "rounded-full bg-secondary px-4 py-1.5 text-xs font-medium",
									children: "Load sample products"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5 p-1",
							children: cart.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-xl bg-secondary/40 px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: item.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground tabnum",
											children: [
												money(item.price),
												" × ",
												item.qty
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => cart.updateQty(idx, item.qty - 1),
												className: "rounded-full bg-background/60 p-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-5 text-center text-sm font-semibold tabnum",
												children: item.qty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => cart.updateQty(idx, item.qty + 1),
												className: "rounded-full bg-background/60 p-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-16 text-right text-sm font-semibold tabnum",
										children: money(item.price * item.qty)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => cart.removeAt(idx),
										className: "text-destructive/70",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							}, idx))
						})
					}),
					tips.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5 border-t border-border/50 px-1 pt-2",
						children: tips.map((tip, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 rounded-full bg-accent/15 px-2 py-1 text-[10px] font-medium text-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), tip]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center justify-between rounded-xl px-2 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl font-semibold tabnum text-foreground",
							children: cart.buffer || "0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: cart.clearBuffer,
								className: "rounded-lg bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground",
								children: "AC"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: cart.backspace,
								className: "rounded-lg bg-secondary px-2 py-1 text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delete, { className: "h-4 w-4" })
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 grid grid-cols-3 gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartKey, {
						icon: ScanLine,
						label: "Scan",
						onTap: () => setScanOpen(true)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartKey, {
						icon: Search,
						label: "Search",
						onTap: () => setSearchOpen(true)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartKey, {
						icon: listening ? LoaderCircle : Mic,
						label: listening ? "Listening" : "Voice",
						spin: listening,
						onTap: startVoice
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartKey, {
						icon: Package,
						label: "Qty",
						onTap: cart.setLastQty
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartKey, {
						icon: CreditCard,
						label: "Price",
						onTap: cart.setLastPrice
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartKey, {
						icon: Sparkles,
						label: "Disc %",
						onTap: cart.applyDiscountPercent
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartKey, {
						icon: Pause,
						label: "Hold",
						onTap: holdBill
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartKey, {
						icon: RotateCcw,
						label: "Recall",
						onTap: () => setRecallOpen(true)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartKey, {
						icon: Ban,
						label: "Void",
						onTap: cart.reset
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-4 gap-1.5",
				style: { height: "min(34vh, 280px)" },
				children: [
					[
						"7",
						"8",
						"9"
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcButton, {
						onTap: () => cart.pressKey(n),
						children: n
					}, n)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcButton, {
						variant: "op",
						onTap: () => cart.pressKey("÷"),
						children: "÷"
					}),
					[
						"4",
						"5",
						"6"
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcButton, {
						onTap: () => cart.pressKey(n),
						children: n
					}, n)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcButton, {
						variant: "op",
						onTap: () => cart.pressKey("×"),
						children: "×"
					}),
					[
						"1",
						"2",
						"3"
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcButton, {
						onTap: () => cart.pressKey(n),
						children: n
					}, n)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcButton, {
						variant: "op",
						onTap: () => cart.pressKey("-"),
						onHold: cart.applyDiscountPercent,
						sub: "hold disc",
						children: "−"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcButton, {
						onTap: () => cart.pressKey("."),
						children: "."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcButton, {
						onTap: () => cart.pressKey("0"),
						children: "0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcButton, {
						variant: "equals",
						onTap: cart.evaluateBuffer,
						onHold: doPrint,
						sub: "hold print",
						children: "="
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcButton, {
						variant: "op",
						onTap: () => cart.pressKey("+"),
						onHold: holdBill,
						sub: "hold hold",
						children: "+"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-4 gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							const v = cart.numericBuffer();
							if (v) cart.addCustomLine(Math.abs(v));
						},
						className: "glass flex items-center justify-center gap-1 rounded-2xl py-3 text-sm font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add ₹"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: doPrint,
						className: "glass flex items-center justify-center gap-1 rounded-2xl py-3 text-sm font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4" }), " Print"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: openPayment,
						disabled: busy,
						className: "gradient-primary col-span-2 flex items-center justify-center gap-2 rounded-2xl py-3 font-display text-base font-semibold text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.98] disabled:opacity-60",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5" }), "Pay"]
					})
				]
			}),
			scanOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeScanner, {
				onDetected: handleBarcode,
				onClose: () => setScanOpen(false)
			}),
			searchOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchSheet, {
				initialQuery: cart.buffer,
				onPick: (p) => cart.addProduct(p),
				onClose: () => setSearchOpen(false)
			}),
			payOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentSheet, {
				total: t.total,
				defaultName: cart.customerName,
				onConfirm: finalize,
				onInvoice: handleInvoice,
				onClose: () => setPayOpen(false)
			}),
			recallOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeldBillsSheet, {
				onPick: (s) => {
					cart.loadSale({
						id: s.id,
						items: s.items,
						discount: Number(s.discount),
						customer_name: s.customer_name
					});
					setRecallOpen(false);
				},
				onClose: () => setRecallOpen(false)
			})
		]
	});
}
function SmartKey({ icon: Icon, label, onTap, spin }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => {
			haptic();
			onTap();
		},
		className: "glass flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-semibold text-muted-foreground transition-all active:scale-[0.96]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${spin ? "animate-spin" : ""}` }), label]
	});
}
//#endregion
export { PosPage as component };
