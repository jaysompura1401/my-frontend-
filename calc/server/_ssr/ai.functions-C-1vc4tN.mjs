import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { i as stringType, n as numberType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-C-1vc4tN.js
var parseVoiceOrder_createServerFn_handler = createServerRpc({
	id: "079f03386dd13317194cc41290cfadc9e9ac2165239066176a529d2f6102bb4e",
	name: "parseVoiceOrder",
	filename: "src/lib/ai.functions.ts"
}, (opts) => parseVoiceOrder.__executeServer(opts));
var parseVoiceOrder = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ transcript: stringType() }).parse(d)).handler(parseVoiceOrder_createServerFn_handler, async () => []);
var billingAssistant_createServerFn_handler = createServerRpc({
	id: "9e24f24623e933dd507e61bff8a41983a213eeae67304dbf024ed882c99e144a",
	name: "billingAssistant",
	filename: "src/lib/ai.functions.ts"
}, (opts) => billingAssistant.__executeServer(opts));
var billingAssistant = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ items: arrayType(objectType({
	name: stringType(),
	qty: numberType()
})) }).parse(d)).handler(billingAssistant_createServerFn_handler, async () => []);
//#endregion
export { billingAssistant_createServerFn_handler, parseVoiceOrder_createServerFn_handler };
