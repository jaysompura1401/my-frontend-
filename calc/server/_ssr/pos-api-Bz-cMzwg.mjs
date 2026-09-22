import { n as api } from "./api-Jrc-Ciu4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pos-api-Bz-cMzwg.js
function toProduct(row) {
	return {
		...row,
		id: String(row.id)
	};
}
/** GET /api/products/barcode/:code */
async function findProductByBarcode(code) {
	try {
		return toProduct(await api.get(`/products/barcode/${encodeURIComponent(code)}`));
	} catch {
		return null;
	}
}
/** GET /api/products */
async function listProducts() {
	return (await api.get("/products")).map(toProduct);
}
var HOLD_KEY = "pos_held_bills";
function readHeldBills() {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(localStorage.getItem(HOLD_KEY) || "[]");
	} catch {
		return [];
	}
}
function writeHeldBills(bills) {
	localStorage.setItem(HOLD_KEY, JSON.stringify(bills));
}
function getHeldBills() {
	return readHeldBills();
}
function removeHeldBill(id) {
	writeHeldBills(readHeldBills().filter((b) => b.id !== id));
}
async function saveSale(input) {
	if (input.status === "held") {
		const bills = readHeldBills();
		const id = input.id ?? crypto.randomUUID();
		const next = {
			id,
			customer_name: input.customerName,
			items: input.items,
			subtotal: input.subtotal,
			discount: input.discount,
			tax: input.tax,
			total: input.total,
			payment_method: input.paymentMethod,
			status: "held",
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		const idx = bills.findIndex((b) => b.id === id);
		if (idx >= 0) bills[idx] = next;
		else bills.push(next);
		writeHeldBills(bills);
		return {
			held: true,
			id
		};
	}
	const billingItems = input.items.filter((i) => i.productId != null).map((i) => ({
		product_id: Number(i.productId),
		qty: i.qty,
		custom_price: i.price
	}));
	const result = await api.post("/billing/create", {
		items: billingItems,
		payment_mode: input.paymentMethod ?? "cash",
		customer_name: input.customerName || "Walk-in Customer",
		customer_mobile: input.customerMobile || void 0,
		discount: input.discount,
		is_proforma: false,
		mark_as_paid: true
	});
	if (input.id) removeHeldBill(input.id);
	return result;
}
async function seedDemoProducts() {
	return { inserted: (await api.post("/products/bulk-import", [
		{
			name: "Sample Cola 250ml",
			price: 20,
			stock: 50,
			category: "Beverages"
		},
		{
			name: "Sample Chips 50g",
			price: 15,
			stock: 60,
			category: "Snacks"
		},
		{
			name: "Sample Water 1L",
			price: 20,
			stock: 80,
			category: "Beverages"
		}
	])).added };
}
//#endregion
export { saveSale as a, removeHeldBill as i, getHeldBills as n, seedDemoProducts as o, listProducts as r, findProductByBarcode as t };
