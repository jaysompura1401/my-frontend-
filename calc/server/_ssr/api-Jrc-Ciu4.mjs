//#region node_modules/.nitro/vite/services/ssr/assets/api-Jrc-Ciu4.js
var API_BASE_URL = "https://api.totalkaro.com/api";
var TOKEN_KEY = "pos_auth_token";
var USER_KEY = "pos_auth_user";
var tokenStore = {
	get() {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(TOKEN_KEY);
	},
	set(token) {
		localStorage.setItem(TOKEN_KEY, token);
	},
	clear() {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
	},
	getUser() {
		if (typeof window === "undefined") return null;
		const raw = localStorage.getItem(USER_KEY);
		return raw ? JSON.parse(raw) : null;
	},
	setUser(user) {
		localStorage.setItem(USER_KEY, JSON.stringify(user));
	}
};
var ApiError = class extends Error {
	status;
	body;
	constructor(message, status, body) {
		super(message);
		this.status = status;
		this.body = body;
	}
};
async function request(path, options = {}) {
	const token = tokenStore.get();
	const headers = new Headers(options.headers);
	if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
	if (token) headers.set("Authorization", `Bearer ${token}`);
	const res = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers
	});
	if (res.status === 401) {
		tokenStore.clear();
		if (typeof window !== "undefined" && window.location.pathname !== "/auth") window.location.href = "/auth";
		throw new ApiError("Unauthorized", 401, null);
	}
	const body = (res.headers.get("content-type") || "").includes("application/json") ? await res.json().catch(() => null) : await res.text();
	if (!res.ok) throw new ApiError((body && typeof body === "object" && "message" in body ? body.message : null) || `Request failed (${res.status})`, res.status, body);
	return body;
}
var api = {
	get: (path) => request(path, { method: "GET" }),
	post: (path, data) => request(path, {
		method: "POST",
		body: data !== void 0 ? JSON.stringify(data) : void 0
	}),
	put: (path, data) => request(path, {
		method: "PUT",
		body: data !== void 0 ? JSON.stringify(data) : void 0
	}),
	delete: (path) => request(path, { method: "DELETE" })
};
//#endregion
export { api as n, tokenStore as r, ApiError as t };
