//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-BGzkeE7z.js
var manifest = {
	"079f03386dd13317194cc41290cfadc9e9ac2165239066176a529d2f6102bb4e": {
		functionName: "parseVoiceOrder_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-C-1vc4tN.mjs")
	},
	"44cbe103d6bc3f41bc95173f044e78c211a41ad1bfcf96d063e2af81a451046a": {
		functionName: "searchProducts_createServerFn_handler",
		importer: () => import("./_ssr/pos.functions-BbUA1jBN.mjs")
	},
	"9e24f24623e933dd507e61bff8a41983a213eeae67304dbf024ed882c99e144a": {
		functionName: "billingAssistant_createServerFn_handler",
		importer: () => import("./_ssr/ai.functions-C-1vc4tN.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
