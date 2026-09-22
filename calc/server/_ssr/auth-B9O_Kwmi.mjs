import { n as __toESM } from "../_runtime.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ApiError } from "./api-Jrc-Ciu4.mjs";
import { i as register, n as login, t as isAuthenticated } from "./auth-service-DyClV9WR.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { P as Calculator, T as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-B9O_Kwmi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [identifier, setIdentifier] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [mobile, setMobile] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isAuthenticated()) navigate({ to: "/pos" });
	}, [navigate]);
	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (mode === "signup") {
				await register({
					first_name: firstName,
					last_name: lastName,
					mobile,
					email,
					password
				});
				toast.success("Account created. An admin needs to approve it before you can sign in.");
				setMode("signin");
				setIdentifier(email);
				setPassword("");
			} else {
				await login(identifier, password);
				navigate({ to: "/pos" });
			}
		} catch (err) {
			const message = err instanceof ApiError ? err.message : "Authentication failed";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[100dvh] items-center justify-center bg-background px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "gradient-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl text-primary-foreground shadow-[var(--shadow-glow)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-8 w-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold text-gradient-primary",
						children: "Smart Calculator POS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Billing, inventory & payments — in a calculator."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-3xl p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-3",
					children: [
						mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: firstName,
								onChange: (e) => setFirstName(e.target.value),
								placeholder: "First name",
								className: "w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: lastName,
								onChange: (e) => setLastName(e.target.value),
								placeholder: "Last name",
								className: "w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "tel",
							required: true,
							value: mobile,
							onChange: (e) => setMobile(e.target.value),
							placeholder: "Mobile number",
							className: "w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: mode === "signup" ? "email" : "text",
							required: true,
							value: mode === "signup" ? email : identifier,
							onChange: (e) => mode === "signup" ? setEmail(e.target.value) : setIdentifier(e.target.value),
							placeholder: mode === "signup" ? "Email" : "Email or mobile",
							className: "w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							minLength: 6,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "Password",
							className: "w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: loading,
							className: "gradient-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-display font-semibold text-primary-foreground active:scale-[0.98] disabled:opacity-60",
							children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), mode === "signin" ? "Sign in" : "Create account"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
					className: "mt-4 w-full text-center text-xs text-muted-foreground",
					children: mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"
				})]
			})]
		})
	});
}
//#endregion
export { AuthPage as component };
