//#region node_modules/.nitro/vite/services/ssr/assets/pos-ui-DlwcW6qV.js
function haptic(pattern = 8) {
	if (typeof navigator !== "undefined" && "vibrate" in navigator) try {
		navigator.vibrate(pattern);
	} catch {}
}
function beep(freq = 880, ms = 90) {
	if (typeof window === "undefined") return;
	try {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.frequency.value = freq;
		osc.type = "sine";
		gain.gain.value = .08;
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		setTimeout(() => {
			osc.stop();
			ctx.close();
		}, ms);
	} catch {}
}
var INR = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 2
});
function money(n) {
	return INR.format(n || 0);
}
//#endregion
export { haptic as n, money as r, beep as t };
