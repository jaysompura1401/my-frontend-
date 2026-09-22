import { n as api, r as tokenStore } from "./api-Jrc-Ciu4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-service-DyClV9WR.js
async function login(identifier, password) {
	const res = await api.post("/auth/login", {
		identifier,
		password
	});
	tokenStore.set(res.token);
	tokenStore.setUser(res.user);
	return res.user;
}
async function register(payload) {
	return api.post("/auth/register", payload);
}
function logout() {
	tokenStore.clear();
}
function isAuthenticated() {
	return !!tokenStore.get();
}
//#endregion
export { register as i, login as n, logout as r, isAuthenticated as t };
