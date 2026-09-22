import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { r as listProducts } from "./pos-api-Bz-cMzwg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pos.functions-BbUA1jBN.js
var searchProducts_createServerFn_handler = createServerRpc({
	id: "44cbe103d6bc3f41bc95173f044e78c211a41ad1bfcf96d063e2af81a451046a",
	name: "searchProducts",
	filename: "src/lib/pos.functions.ts"
}, (opts) => searchProducts.__executeServer(opts));
var searchProducts = createServerFn({ method: "GET" }).validator((data) => data).handler(searchProducts_createServerFn_handler, async ({ data }) => {
	const q = data.q.trim().toLowerCase();
	if (!q) return [];
	return (await listProducts()).filter((p) => {
		return p.name.toLowerCase().includes(q) || (p.sku ?? "").toLowerCase().includes(q) || (p.barcode ?? "").toLowerCase().includes(q) || (p.brand ?? "").toLowerCase().includes(q) || (p.category ?? "").toLowerCase().includes(q);
	});
});
//#endregion
export { searchProducts_createServerFn_handler };
