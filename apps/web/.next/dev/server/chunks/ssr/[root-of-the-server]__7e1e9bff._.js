module.exports = [
"[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateMargin",
    ()=>calculateMargin,
    "calculateProfit",
    ()=>calculateProfit,
    "cn",
    ()=>cn,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDate",
    ()=>formatDate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatCurrency(amount, currency = 'CAD') {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: currency
    }).format(amount);
}
function formatDate(date) {
    return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}
function calculateProfit(revenue, cost) {
    return revenue - cost;
}
function calculateMargin(revenue, cost) {
    if (revenue === 0) return 0;
    return (revenue - cost) / revenue * 100;
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue focus-visible:ring-offset-2 focus-visible:ring-offset-vision-navy disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-gradient-to-r from-vision-blue to-vision-cyan text-white hover:shadow-lg hover:shadow-vision-blue/25",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-white/20 bg-transparent text-white hover:bg-white/10",
            secondary: "bg-white/10 text-white hover:bg-white/20",
            ghost: "text-white/60 hover:text-white hover:bg-white/10",
            link: "text-vision-cyan underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-xl px-3",
            lg: "h-11 rounded-xl px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/button.tsx",
        lineNumber: 40,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
;
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/providers/auth-provider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function Header({ onMenuClick }) {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthContext"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-30 w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-16 items-center px-6 gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    size: "icon",
                    className: "md:hidden text-white/60 hover:text-white hover:bg-white/10",
                    onClick: onMenuClick,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                        className: "h-6 w-6"
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden md:flex items-center gap-2 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white/40",
                            children: "Pages"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white/40",
                            children: "/"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white font-medium",
                            children: "Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 ml-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "h-4 w-4 text-white/40"
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Type here...",
                                    className: "bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40 w-40"
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                                    lineNumber: 38,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "icon",
                            className: "text-white/60 hover:text-white hover:bg-white/10 relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute top-1 right-1 h-2 w-2 rounded-full bg-vision-cyan"
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "icon",
                            className: "text-white/60 hover:text-white hover:bg-white/10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-10 rounded-xl bg-gradient-to-br from-vision-purple to-vision-pink flex items-center justify-center text-white font-semibold shadow-lg shadow-vision-purple/20 cursor-pointer hover:shadow-xl transition-shadow",
                                children: user?.email?.charAt(0).toUpperCase() || 'U'
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-organization.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentOrganizationId",
    ()=>getCurrentOrganizationId,
    "useAcceptInvite",
    ()=>useAcceptInvite,
    "useCreateInvite",
    ()=>useCreateInvite,
    "useCreateOrganization",
    ()=>useCreateOrganization,
    "useDeleteInvite",
    ()=>useDeleteInvite,
    "useJoinOrganization",
    ()=>useJoinOrganization,
    "useOrganization",
    ()=>useOrganization,
    "useOrganizationInvites",
    ()=>useOrganizationInvites,
    "useOrganizationMembers",
    ()=>useOrganizationMembers,
    "usePendingInvites",
    ()=>usePendingInvites,
    "useRegenerateInviteCode",
    ()=>useRegenerateInviteCode,
    "useRemoveMember",
    ()=>useRemoveMember,
    "useUpdateOrganization",
    ()=>useUpdateOrganization
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
;
// Helper to get current user ID
async function getCurrentUserId() {
    const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return user.id;
}
// Helper to get current user email
async function getCurrentUserEmail() {
    const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
    if (!user || !user.email) throw new Error('Not authenticated');
    return user.email;
}
// Generate an 8-character invite code
function generateInviteCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
async function getCurrentOrganizationId() {
    const userId = await getCurrentUserId();
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_members').select('organization_id').eq('user_id', userId).single();
    if (error || !data) return null;
    return data.organization_id;
}
function useOrganization() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'organization'
        ],
        queryFn: async ()=>{
            const userId = await getCurrentUserId();
            const { data: membership, error: memberError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_members').select('organization_id').eq('user_id', userId).single();
            if (memberError || !membership) return null;
            const { data: org, error: orgError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').select('*').eq('id', membership.organization_id).single();
            if (orgError) throw orgError;
            return org;
        }
    });
}
function useOrganizationMembers() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'organization',
            'members'
        ],
        queryFn: async ()=>{
            const orgId = await getCurrentOrganizationId();
            if (!orgId) return [];
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_members').select('*').eq('organization_id', orgId).order('joined_at', {
                ascending: true
            });
            if (error) throw error;
            return data;
        }
    });
}
function useOrganizationInvites() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'organization',
            'invites'
        ],
        queryFn: async ()=>{
            const orgId = await getCurrentOrganizationId();
            if (!orgId) return [];
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_invites').select('*').eq('organization_id', orgId).eq('status', 'PENDING').order('created_at', {
                ascending: false
            });
            if (error) throw error;
            return data;
        }
    });
}
function useCreateOrganization() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (name)=>{
            const userId = await getCurrentUserId();
            // Generate a unique invite code (retry if collision)
            let inviteCode = generateInviteCode();
            let attempts = 0;
            const maxAttempts = 10;
            // Create the organization
            let orgError = null;
            let org = null;
            while(attempts < maxAttempts){
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').insert({
                    name,
                    invite_code: inviteCode,
                    created_by: userId
                }).select().single();
                if (!error) {
                    org = data;
                    break;
                }
                // If it's a unique constraint violation, try a new code
                if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('duplicate')) {
                    inviteCode = generateInviteCode();
                    attempts++;
                    continue;
                }
                orgError = error;
                break;
            }
            if (orgError) {
                console.error('Error creating organization:', orgError);
                throw new Error(orgError.message || 'Failed to create organization');
            }
            if (!org) {
                throw new Error('Failed to create organization after multiple attempts');
            }
            // Add creator as first member
            const { error: memberError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_members').insert({
                organization_id: org.id,
                user_id: userId
            });
            if (memberError) {
                console.error('Error adding creator as member:', memberError);
                // Try to clean up the organization if member insert fails
                await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').delete().eq('id', org.id);
                throw new Error(memberError.message || 'Failed to add you as a member');
            }
            return org;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'organization'
                ]
            });
        }
    });
}
function useJoinOrganization() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (inviteCode)=>{
            const userId = await getCurrentUserId();
            // Find organization by invite code using the function
            const { data: orgs, error: lookupError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('get_organization_by_invite_code', {
                code: inviteCode.toUpperCase()
            });
            if (lookupError) throw lookupError;
            if (!orgs || orgs.length === 0) throw new Error('Invalid invite code');
            const org = orgs[0];
            // Check if already a member
            const { data: existing } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_members').select('id').eq('organization_id', org.id).eq('user_id', userId).single();
            if (existing) throw new Error('You are already a member of this organization');
            // Add as member
            const { error: joinError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_members').insert({
                organization_id: org.id,
                user_id: userId
            });
            if (joinError) throw joinError;
            return org;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'organization'
                ]
            });
        }
    });
}
function useCreateInvite() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (email)=>{
            const orgId = await getCurrentOrganizationId();
            if (!orgId) throw new Error('No organization');
            // Check if invite already exists
            const { data: existing } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_invites').select('id').eq('organization_id', orgId).eq('email', email.toLowerCase()).eq('status', 'PENDING').single();
            if (existing) throw new Error('An invite for this email already exists');
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_invites').insert({
                organization_id: orgId,
                email: email.toLowerCase()
            }).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'organization',
                    'invites'
                ]
            });
        }
    });
}
function useAcceptInvite() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (inviteId)=>{
            const userId = await getCurrentUserId();
            // Get the invite
            const { data: invite, error: inviteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_invites').select('*').eq('id', inviteId).single();
            if (inviteError || !invite) throw new Error('Invite not found');
            // Add as member
            const { error: memberError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_members').insert({
                organization_id: invite.organization_id,
                user_id: userId
            });
            if (memberError) throw memberError;
            // Update invite status
            await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_invites').update({
                status: 'ACCEPTED'
            }).eq('id', inviteId);
            return invite;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'organization'
                ]
            });
        }
    });
}
function usePendingInvites() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'organization',
            'pending-invites'
        ],
        queryFn: async ()=>{
            const email = await getCurrentUserEmail();
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_invites').select('*, organizations(name)').eq('email', email.toLowerCase()).eq('status', 'PENDING');
            if (error) throw error;
            return data;
        }
    });
}
function useDeleteInvite() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (inviteId)=>{
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_invites').delete().eq('id', inviteId);
            if (error) throw error;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'organization',
                    'invites'
                ]
            });
        }
    });
}
function useRemoveMember() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (memberId)=>{
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organization_members').delete().eq('id', memberId);
            if (error) throw error;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'organization',
                    'members'
                ]
            });
        }
    });
}
function useUpdateOrganization() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async ({ name })=>{
            const orgId = await getCurrentOrganizationId();
            if (!orgId) throw new Error('No organization');
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').update({
                name
            }).eq('id', orgId).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'organization'
                ]
            });
        }
    });
}
function useRegenerateInviteCode() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async ()=>{
            const orgId = await getCurrentOrganizationId();
            if (!orgId) throw new Error('No organization');
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').update({
                invite_code: generateInviteCode()
            }).eq('id', orgId).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'organization'
                ]
            });
        }
    });
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-ssr] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/providers/auth-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-organization.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const navigation = [
    {
        name: "Dashboard",
        href: "/",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: "Inventory",
        href: "/inventory",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
    },
    {
        name: "Procurement",
        href: "/procurement",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"]
    },
    {
        name: "Organization",
        href: "/organization",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"]
    }
];
function Sidebar({ isOpen, onClose }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { signOut, user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthContext"])();
    const { data: organization } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrganization"])();
    const handleSignOut = async ()=>{
        await signOut();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-40 bg-vision-navy/80 backdrop-blur-sm md:hidden",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed left-0 top-0 z-40 h-screen w-[280px] transition-transform duration-300 md:translate-x-0 p-4", isOpen ? "translate-x-0" : "-translate-x-full"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full flex-col glass-card rounded-2xl overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 p-6 pb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-10 w-10 rounded-xl icon-bg-blue flex items-center justify-center text-white font-bold shadow-lg shadow-vision-blue/30",
                                    children: "P"
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-lg text-white",
                                    children: "Pokemon Resale"
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "ml-auto md:hidden text-white/60 hover:text-white hover:bg-white/10",
                                    onClick: onClose,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        organization && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-6 mb-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/organization",
                                className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                        className: "h-4 w-4 text-vision-cyan"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                        lineNumber: 78,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-white truncate",
                                        children: organization.name
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                        lineNumber: 79,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                lineNumber: 74,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex-1 space-y-1 p-4 overflow-y-auto",
                            children: navigation.map((item)=>{
                                const isActive = pathname === item.href;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    onClick: ()=>onClose(),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all", isActive ? "bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25" : "text-white/60 hover:bg-white/5 hover:text-white"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center w-8 h-8 rounded-xl transition-all", isActive ? "bg-white/20" : "bg-vision-navy-light"),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                                lineNumber: 111,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                            lineNumber: 105,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: item.name
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                            lineNumber: 113,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.name, true, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 94,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-white/10 p-4 space-y-3",
                            children: [
                                user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 px-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 rounded-xl bg-gradient-to-br from-vision-purple to-vision-pink flex items-center justify-center text-white text-sm font-semibold",
                                            children: user.email?.charAt(0).toUpperCase()
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                            lineNumber: 123,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-white/60 truncate flex-1",
                                            children: user.email
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                            lineNumber: 126,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 122,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    className: "w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl",
                                    onClick: handleSignOut,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-center w-8 h-8 rounded-xl bg-vision-navy-light",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, this),
                                        "Sign Out"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthGuard",
    ()=>AuthGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/providers/auth-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-organization.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
"use client";
;
;
;
;
;
;
function AuthGuard({ children, requireOrganization = true }) {
    const { user, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthContext"])();
    const { data: organization, isLoading: orgLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrganization"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const loading = authLoading || user && requireOrganization && orgLoading;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [
        user,
        authLoading,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!authLoading && user && requireOrganization && !orgLoading && !organization) {
            router.push('/setup');
        }
    }, [
        user,
        authLoading,
        organization,
        orgLoading,
        requireOrganization,
        router
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "h-8 w-8 animate-spin text-vision-blue"
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-white/60",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this);
    }
    if (!user) {
        return null;
    }
    if (requireOrganization && !organization) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MainLayout",
    ()=>MainLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$auth$2f$auth$2d$guard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$auth$2f$auth$2d$guard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthGuard"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sidebar"], {
                    isOpen: sidebarOpen,
                    onClose: ()=>setSidebarOpen(false)
                }, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "md:pl-[280px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Header"], {
                            onMenuClick: ()=>setSidebarOpen(!sidebarOpen)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx",
                            lineNumber: 17,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "p-4 md:p-6 lg:p-8",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx",
                            lineNumber: 18,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle,
    "cardVariants",
    ()=>cardVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
;
;
;
;
const cardVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("rounded-xl text-card-foreground", {
    variants: {
        variant: {
            default: "glass-card",
            solid: "bg-vision-navy-light border border-white/10",
            transparent: "bg-transparent"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(cardVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight text-white", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
CardFooter.displayName = "CardFooter";
;
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetricCard",
    ()=>MetricCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const iconColorClasses = {
    blue: 'icon-bg-blue shadow-vision-blue/30',
    green: 'icon-bg-green shadow-vision-green/30',
    orange: 'icon-bg-orange shadow-vision-orange/30',
    purple: 'icon-bg-purple shadow-vision-purple/30',
    cyan: 'icon-bg-cyan shadow-vision-cyan/30'
};
function MetricCard({ title, value, icon: Icon, trend, iconColor = 'blue', className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("hover:shadow-lg hover:shadow-vision-blue/5 transition-all", className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-5",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-white/60 uppercase tracking-wider",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-2xl font-bold text-white",
                                        children: value
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                                        lineNumber: 40,
                                        columnNumber: 15
                                    }, this),
                                    trend && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xs font-semibold", trend.isPositive ? "text-vision-green" : "text-red-400"),
                                        children: [
                                            trend.isPositive ? "+" : "",
                                            trend.value
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                                        lineNumber: 42,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center w-12 h-12 rounded-xl shadow-lg", iconColorClasses[iconColor]),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: "h-5 w-5 text-white"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WelcomeBanner",
    ()=>WelcomeBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/providers/auth-provider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function WelcomeBanner() {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthContext"])();
    // Get first name from email or use a default
    const firstName = user?.email?.split('@')[0] || 'User';
    const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: "relative overflow-hidden bg-gradient-to-r from-[#0075FF] via-[#00A3FF] to-[#00E5FF]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-0",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-8 space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white/80 text-sm",
                                children: "Welcome back,"
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                lineNumber: 19,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl font-bold text-white",
                                children: displayName
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                lineNumber: 20,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white/70 text-sm max-w-xs",
                                children: "Glad to see you again! Track your Pokemon card inventory and monitor your sales."
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-2 text-white text-sm font-medium hover:gap-3 transition-all mt-4 group",
                                children: [
                                    "Tap to record",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        className: "h-4 w-4 group-hover:translate-x-1 transition-transform"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                        lineNumber: 26,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                lineNumber: 24,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-64 h-48 hidden md:block",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-8 top-1/2 -translate-y-1/2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    viewBox: "0 0 200 200",
                                    className: "w-48 h-48 opacity-80",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                                    id: "ballGradient",
                                                    x1: "0%",
                                                    y1: "0%",
                                                    x2: "100%",
                                                    y2: "100%",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                            offset: "0%",
                                                            stopColor: "rgba(255,255,255,0.4)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                                            lineNumber: 38,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                            offset: "100%",
                                                            stopColor: "rgba(255,255,255,0.1)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                                            lineNumber: 39,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                                    lineNumber: 37,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                                                    id: "glow",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                                            stdDeviation: "3",
                                                            result: "coloredBlur"
                                                        }, void 0, false, {
                                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                                            lineNumber: 42,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMerge", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                                                    in: "coloredBlur"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                                                    lineNumber: 44,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                                                    in: "SourceGraphic"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                                                    lineNumber: 45,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                                            lineNumber: 43,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                                    lineNumber: 41,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                            lineNumber: 36,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "100",
                                            cy: "100",
                                            r: "80",
                                            fill: "url(#ballGradient)",
                                            stroke: "rgba(255,255,255,0.3)",
                                            strokeWidth: "2",
                                            filter: "url(#glow)"
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                            lineNumber: 51,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "20",
                                            y1: "100",
                                            x2: "180",
                                            y2: "100",
                                            stroke: "rgba(255,255,255,0.4)",
                                            strokeWidth: "3"
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                            lineNumber: 54,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "100",
                                            cy: "100",
                                            r: "20",
                                            fill: "rgba(255,255,255,0.3)",
                                            stroke: "rgba(255,255,255,0.5)",
                                            strokeWidth: "3"
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                            lineNumber: 57,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "100",
                                            cy: "100",
                                            r: "10",
                                            fill: "white"
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                            lineNumber: 58,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "60",
                                            cy: "60",
                                            r: "4",
                                            fill: "rgba(255,255,255,0.8)"
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                            lineNumber: 61,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "140",
                                            cy: "50",
                                            r: "3",
                                            fill: "rgba(255,255,255,0.6)"
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                            lineNumber: 62,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "150",
                                            cy: "140",
                                            r: "5",
                                            fill: "rgba(255,255,255,0.7)"
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                            lineNumber: 63,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                    lineNumber: 34,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-4 right-20 w-3 h-3 bg-white/30 rounded-full animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-12 right-8 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-100"
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-8 right-16 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-200"
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SalesChart",
    ()=>SalesChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/recharts/es6/chart/AreaChart.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/recharts/es6/cartesian/Area.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/recharts/es6/cartesian/XAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/recharts/es6/cartesian/YAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/recharts/es6/component/Tooltip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/recharts/es6/component/ResponsiveContainer.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const defaultData = [
    {
        month: "Jan",
        sales: 200
    },
    {
        month: "Feb",
        sales: 300
    },
    {
        month: "Mar",
        sales: 250
    },
    {
        month: "Apr",
        sales: 400
    },
    {
        month: "May",
        sales: 350
    },
    {
        month: "Jun",
        sales: 450
    },
    {
        month: "Jul",
        sales: 380
    },
    {
        month: "Aug",
        sales: 420
    },
    {
        month: "Sep",
        sales: 500
    },
    {
        month: "Oct",
        sales: 480
    },
    {
        month: "Nov",
        sales: 520
    },
    {
        month: "Dec",
        sales: 600
    }
];
function SalesChart({ data = defaultData, title = "Sales overview", subtitle = "(+5) more in 2024" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                className: "pb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                        className: "text-xl",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-vision-green",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "pt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-[300px] w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                        width: "100%",
                        height: "100%",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AreaChart"], {
                            data: data,
                            margin: {
                                top: 10,
                                right: 10,
                                left: -20,
                                bottom: 0
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: "salesGradient",
                                        x1: "0",
                                        y1: "0",
                                        x2: "0",
                                        y2: "1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "0%",
                                                stopColor: "#0075FF",
                                                stopOpacity: 0.4
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                                                lineNumber: 60,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "100%",
                                                stopColor: "#0075FF",
                                                stopOpacity: 0
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                                                lineNumber: 61,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                                        lineNumber: 59,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                                    lineNumber: 58,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                    strokeDasharray: "3 3",
                                    stroke: "rgba(255,255,255,0.1)",
                                    vertical: false
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                    dataKey: "month",
                                    axisLine: false,
                                    tickLine: false,
                                    tick: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                                    lineNumber: 69,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                                    axisLine: false,
                                    tickLine: false,
                                    tick: {
                                        fill: 'rgba(255,255,255,0.5)',
                                        fontSize: 12
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                    contentStyle: {
                                        backgroundColor: '#0F1535',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    },
                                    labelStyle: {
                                        color: 'rgba(255,255,255,0.6)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Area"], {
                                    type: "monotone",
                                    dataKey: "sales",
                                    stroke: "#0075FF",
                                    strokeWidth: 3,
                                    fill: "url(#salesGradient)"
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                                    lineNumber: 89,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-vision-blue focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-vision-blue text-white",
            secondary: "border-transparent bg-white/10 text-white",
            destructive: "border-transparent bg-destructive text-white",
            outline: "border-white/20 text-white/80 bg-transparent",
            success: "border-transparent bg-vision-green text-white",
            warning: "border-transparent bg-vision-orange text-white",
            info: "border-transparent bg-vision-cyan text-white"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/badge.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/lib/pokemon-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pokemonApi",
    ()=>pokemonApi
]);
const POKEMON_API_BASE = 'https://api.pokemontcg.io/v2';
const pokemonApi = {
    async getRecentCards (page = 1, pageSize = 30) {
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
            orderBy: '-set.releaseDate'
        });
        const response = await fetch(`${POKEMON_API_BASE}/cards?${params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cards');
        }
        return response.json();
    },
    async searchCards (query, page = 1, pageSize = 30) {
        const params = new URLSearchParams({
            q: `name:${query}*`,
            page: String(page),
            pageSize: String(pageSize),
            orderBy: '-set.releaseDate'
        });
        const response = await fetch(`${POKEMON_API_BASE}/cards?${params}`);
        if (!response.ok) {
            throw new Error('Failed to search cards');
        }
        return response.json();
    },
    async getCard (id) {
        const response = await fetch(`${POKEMON_API_BASE}/cards/${id}`);
        if (!response.ok) {
            throw new Error('Failed to get card');
        }
        const data = await response.json();
        return data.data;
    },
    async getSets () {
        const response = await fetch(`${POKEMON_API_BASE}/sets`);
        if (!response.ok) {
            throw new Error('Failed to get sets');
        }
        return response.json();
    },
    getMarketPrice (card) {
        if (!card.tcgplayer?.prices) return null;
        const prices = card.tcgplayer.prices;
        // Try to get the most relevant price
        if (prices.holofoil?.market) return prices.holofoil.market;
        if (prices.reverseHolofoil?.market) return prices.reverseHolofoil.market;
        if (prices.normal?.market) return prices.normal.market;
        if (prices['1stEditionHolofoil']?.market) return prices['1stEditionHolofoil'].market;
        return null;
    },
    getPriceRange (card) {
        if (!card.tcgplayer?.prices) return null;
        const prices = card.tcgplayer.prices;
        let low = Infinity;
        let high = -Infinity;
        Object.values(prices).forEach((priceType)=>{
            if (priceType?.low && priceType.low < low) low = priceType.low;
            if (priceType?.high && priceType.high > high) high = priceType.high;
        });
        if (low === Infinity || high === -Infinity) return null;
        return {
            low,
            high
        };
    }
};
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/lib/onepiece-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Use our proxy to avoid CORS issues
__turbopack_context__.s([
    "onePieceApi",
    ()=>onePieceApi
]);
const OPTCG_API_BASE = '/api/onepiece';
const onePieceApi = {
    async searchCards (query) {
        const params = new URLSearchParams({
            card_name: query
        });
        const response = await fetch(`${OPTCG_API_BASE}/sets/filtered?${params}`);
        if (!response.ok) {
            throw new Error('Failed to search One Piece cards');
        }
        return response.json();
    },
    async getCard (cardSetId) {
        const response = await fetch(`${OPTCG_API_BASE}/sets/card/${cardSetId}`);
        if (!response.ok) {
            throw new Error('Failed to get One Piece card');
        }
        return response.json();
    },
    async getSets () {
        const response = await fetch(`${OPTCG_API_BASE}/allSets`);
        if (!response.ok) {
            throw new Error('Failed to get One Piece sets');
        }
        return response.json();
    },
    async getRecentCards () {
        const sets = await onePieceApi.getSets();
        if (sets.length === 0) return [];
        // Get the last set (most recent)
        const latestSet = sets[sets.length - 1];
        const response = await fetch(`${OPTCG_API_BASE}/sets/${latestSet.set_id}`);
        if (!response.ok) {
            throw new Error('Failed to get recent One Piece cards');
        }
        return response.json();
    },
    getMarketPrice (card) {
        return card.market_price ?? null;
    }
};
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/lib/card-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cardApi",
    ()=>cardApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$pokemon$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/pokemon-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$onepiece$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/onepiece-api.ts [app-ssr] (ecmascript)");
;
;
function fromPokemon(card) {
    return {
        id: card.id,
        gameType: 'pokemon',
        name: card.name,
        setName: card.set.name,
        imageSmall: card.images.small,
        imageLarge: card.images.large,
        rarity: card.rarity,
        marketPrice: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$pokemon$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pokemonApi"].getMarketPrice(card)
    };
}
function fromOnePiece(card) {
    return {
        id: card.card_image_id,
        gameType: 'onepiece',
        name: card.card_name,
        setName: card.set_name,
        imageSmall: card.card_image,
        rarity: card.rarity,
        marketPrice: card.market_price ?? null
    };
}
const cardApi = {
    async searchCards (query, gameType) {
        if (gameType === 'pokemon') {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$pokemon$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pokemonApi"].searchCards(query);
            return {
                data: response.data.map(fromPokemon),
                totalCount: response.totalCount
            };
        }
        const cards = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$onepiece$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onePieceApi"].searchCards(query);
        return {
            data: cards.map(fromOnePiece),
            totalCount: cards.length
        };
    },
    async getRecentCards (gameType) {
        if (gameType === 'pokemon') {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$pokemon$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pokemonApi"].getRecentCards();
            return {
                data: response.data.map(fromPokemon),
                totalCount: response.totalCount
            };
        }
        const cards = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$onepiece$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onePieceApi"].getRecentCards();
        return {
            data: cards.map(fromOnePiece),
            totalCount: cards.length
        };
    },
    async getCard (id, gameType) {
        if (gameType === 'pokemon') {
            const card = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$pokemon$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pokemonApi"].getCard(id);
            return fromPokemon(card);
        }
        const cards = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$onepiece$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onePieceApi"].getCard(id);
        if (cards.length === 0) throw new Error(`One Piece card not found: ${id}`);
        return fromOnePiece(cards[0]);
    }
};
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-inventory.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAddInventoryItem",
    ()=>useAddInventoryItem,
    "useDeleteInventoryItem",
    ()=>useDeleteInventoryItem,
    "useInventoryItem",
    ()=>useInventoryItem,
    "useInventoryItems",
    ()=>useInventoryItems,
    "useRecentCards",
    ()=>useRecentCards,
    "useSearchCards",
    ()=>useSearchCards,
    "useUpdateInventoryItem",
    ()=>useUpdateInventoryItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$card$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/card-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-organization.ts [app-ssr] (ecmascript)");
;
;
;
;
async function getCurrentUserId() {
    const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return user.id;
}
function useInventoryItems(statusFilter) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'inventory',
            'items',
            statusFilter
        ],
        queryFn: async ()=>{
            const orgId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentOrganizationId"])();
            if (!orgId) return [];
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select('*').eq('organization_id', orgId).order('created_at', {
                ascending: false
            });
            if (statusFilter) {
                query = query.eq('status', statusFilter);
            }
            const { data, error } = await query;
            if (error) throw error;
            return data;
        }
    });
}
function useInventoryItem(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'inventory',
            'item',
            id
        ],
        queryFn: async ()=>{
            const orgId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentOrganizationId"])();
            if (!orgId) throw new Error('No organization');
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select('*').eq('id', id).eq('organization_id', orgId).single();
            if (error) throw error;
            return data;
        },
        enabled: !!id
    });
}
function useAddInventoryItem() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (data)=>{
            const userId = await getCurrentUserId();
            const orgId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentOrganizationId"])();
            if (!orgId) throw new Error('No organization');
            const insertData = {
                user_id: userId,
                organization_id: orgId,
                card_id: data.card_id,
                card_name: data.card_name,
                card_image: data.card_image || null,
                set_name: data.set_name || null,
                location: data.location,
                condition: data.condition || 'NM',
                acquisition_cost: data.acquisition_cost,
                quantity: data.quantity || 1,
                status: data.status || 'IN_STOCK',
                notes: data.notes || null,
                procurement_id: data.procurement_id || null,
                game_type: data.game_type || 'pokemon'
            };
            const { data: result, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').insert([
                insertData
            ]).select().single();
            if (error) throw error;
            return result;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'inventory'
                ]
            });
        }
    });
}
function useUpdateInventoryItem() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (data)=>{
            const orgId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentOrganizationId"])();
            if (!orgId) throw new Error('No organization');
            const { id, ...updateData } = data;
            const { data: result, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').update(updateData).eq('id', id).eq('organization_id', orgId).select().single();
            if (error) throw error;
            return result;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'inventory'
                ]
            });
        }
    });
}
function useDeleteInventoryItem() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: async (id)=>{
            const orgId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentOrganizationId"])();
            if (!orgId) throw new Error('No organization');
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').delete().eq('id', id).eq('organization_id', orgId);
            if (error) throw error;
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'inventory'
                ]
            });
        }
    });
}
function useRecentCards(gameType = 'pokemon') {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'cards',
            'recent',
            gameType
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$card$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardApi"].getRecentCards(gameType)
    });
}
function useSearchCards(query, gameType = 'pokemon') {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'cards',
            'search',
            query,
            gameType
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$card$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardApi"].searchCards(query, gameType),
        enabled: query.length > 2
    });
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-analytics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnalytics",
    ()=>useAnalytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-organization.ts [app-ssr] (ecmascript)");
;
;
;
function useAnalytics() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'analytics'
        ],
        queryFn: async ()=>{
            const orgId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$organization$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentOrganizationId"])();
            // Return empty analytics if no organization
            if (!orgId) {
                return {
                    totalInventoryValue: 0,
                    totalItems: 0,
                    totalInvested: 0,
                    itemsSold: 0,
                    totalRevenue: 0,
                    totalProfit: 0,
                    pendingProcurements: 0,
                    inventoryByStatus: {
                        IN_STOCK: 0,
                        LISTED: 0,
                        SOLD: 0
                    },
                    inventoryByCondition: {},
                    recentActivity: []
                };
            }
            // Get all inventory items
            const { data: inventory, error: invError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select('*').eq('organization_id', orgId);
            if (invError) throw invError;
            // Get all sales
            const { data: sales, error: salesError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sales').select('*').eq('organization_id', orgId);
            if (salesError) throw salesError;
            // Get pending procurements count
            const { count: pendingProcurements, error: procError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('procurements').select('*', {
                count: 'exact',
                head: true
            }).eq('organization_id', orgId).eq('status', 'PENDING');
            if (procError) throw procError;
            // Calculate inventory metrics
            const activeInventory = inventory?.filter((item)=>item.status === 'IN_STOCK' || item.status === 'LISTED') || [];
            const totalInventoryValue = activeInventory.reduce((sum, item)=>sum + item.acquisition_cost * item.quantity, 0);
            const totalItems = activeInventory.reduce((sum, item)=>sum + item.quantity, 0);
            const totalInvested = inventory?.reduce((sum, item)=>sum + item.acquisition_cost * item.quantity, 0) || 0;
            const itemsSold = inventory?.filter((item)=>item.status === 'SOLD').length || 0;
            // Calculate sales metrics
            const totalRevenue = sales?.reduce((sum, sale)=>sum + sale.sale_price, 0) || 0;
            const totalSalesFees = sales?.reduce((sum, sale)=>sum + (sale.fees || 0) + (sale.shipping_cost || 0), 0) || 0;
            // Get cost of sold items
            const soldItemIds = sales?.map((s)=>s.inventory_id).filter(Boolean) || [];
            const soldItemsCost = inventory?.filter((item)=>soldItemIds.includes(item.id)).reduce((sum, item)=>sum + item.acquisition_cost, 0) || 0;
            const totalProfit = totalRevenue - soldItemsCost - totalSalesFees;
            // Inventory by status
            const inventoryByStatus = {
                IN_STOCK: inventory?.filter((i)=>i.status === 'IN_STOCK').reduce((s, i)=>s + i.quantity, 0) || 0,
                LISTED: inventory?.filter((i)=>i.status === 'LISTED').reduce((s, i)=>s + i.quantity, 0) || 0,
                SOLD: inventory?.filter((i)=>i.status === 'SOLD').reduce((s, i)=>s + i.quantity, 0) || 0
            };
            // Inventory by condition
            const inventoryByCondition = {};
            inventory?.forEach((item)=>{
                const condition = item.condition || 'NM';
                inventoryByCondition[condition] = (inventoryByCondition[condition] || 0) + item.quantity;
            });
            // Recent activity (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentItems = inventory?.filter((item)=>new Date(item.created_at) >= sevenDaysAgo) || [];
            const activityByDate = {};
            recentItems.forEach((item)=>{
                const date = new Date(item.created_at).toISOString().split('T')[0];
                if (!activityByDate[date]) {
                    activityByDate[date] = {
                        itemsAdded: 0,
                        value: 0
                    };
                }
                activityByDate[date].itemsAdded += item.quantity;
                activityByDate[date].value += item.acquisition_cost * item.quantity;
            });
            const recentActivity = Object.entries(activityByDate).map(([date, data])=>({
                    date,
                    ...data
                })).sort((a, b)=>a.date.localeCompare(b.date));
            return {
                totalInventoryValue,
                totalItems,
                totalInvested,
                itemsSold,
                totalRevenue,
                totalProfit,
                pendingProcurements: pendingProcurements || 0,
                inventoryByStatus,
                inventoryByCondition,
                recentActivity
            };
        }
    });
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$main$2d$layout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$metric$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$welcome$2d$banner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/welcome-banner.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$sales$2d$chart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/sales-chart.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-ssr] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$inventory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-inventory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
function DashboardPage() {
    const { data: inventory } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$inventory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInventoryItems"])();
    const { data: analytics, isLoading: analyticsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAnalytics"])();
    const recentInventory = inventory?.slice(0, 5) || [];
    // Transform recent activity for chart
    const salesData = analytics?.recentActivity?.map((day)=>({
            month: new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'short'
            }),
            sales: day.value
        })) || [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$main$2d$layout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MainLayout"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white/40",
                            children: "Pages"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white/40",
                            children: "/"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white font-medium",
                            children: "Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$metric$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MetricCard"], {
                            title: "Inventory Value",
                            value: analyticsLoading ? '...' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(analytics?.totalInventoryValue || 0),
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"],
                            iconColor: "blue",
                            trend: {
                                value: `${analytics?.totalItems || 0} items`,
                                isPositive: true
                            }
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$metric$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MetricCard"], {
                            title: "Total Invested",
                            value: analyticsLoading ? '...' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(analytics?.totalInvested || 0),
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
                            iconColor: "green"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$metric$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MetricCard"], {
                            title: "Items Sold",
                            value: analyticsLoading ? '...' : String(analytics?.itemsSold || 0),
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
                            iconColor: "orange",
                            trend: analytics?.totalProfit ? {
                                value: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(analytics.totalProfit)} profit`,
                                isPositive: analytics.totalProfit > 0
                            } : undefined
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$metric$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MetricCard"], {
                            title: "Pending Orders",
                            value: analyticsLoading ? '...' : String(analytics?.pendingProcurements || 0),
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
                            iconColor: "purple"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$welcome$2d$banner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WelcomeBanner"], {}, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-xl",
                                children: "Inventory Status"
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-3 w-3 rounded-full bg-vision-green"
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 83,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-white/80",
                                                        children: "In Stock"
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 84,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 82,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: analytics?.inventoryByStatus?.IN_STOCK || 0
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 86,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-3 w-3 rounded-full bg-vision-blue"
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 90,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-white/80",
                                                        children: "Listed"
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 91,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 89,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: analytics?.inventoryByStatus?.LISTED || 0
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 93,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-3 w-3 rounded-full bg-white/40"
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-white/80",
                                                        children: "Sold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 98,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 96,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-white",
                                                children: analytics?.inventoryByStatus?.SOLD || 0
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 100,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$sales$2d$chart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SalesChart"], {
                    data: salesData.length > 0 ? salesData : undefined,
                    title: "Sales overview",
                    subtitle: `(+${analytics?.itemsSold || 0}) items sold`
                }, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this),
                analytics?.recentActivity && analytics.recentActivity.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-xl flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "h-5 w-5 text-vision-cyan"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this),
                                    "Recent Activity (7 days)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 117,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 116,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
                                children: analytics.recentActivity.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl bg-white/5 p-4 border border-white/10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-white/60 mb-1",
                                                children: new Date(day.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 126,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white",
                                                children: [
                                                    day.itemsAdded,
                                                    " items"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 129,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-vision-cyan",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(day.value)
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 130,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, day.date, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 125,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 123,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 122,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 115,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "text-xl",
                                        children: "Recent Inventory"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/inventory",
                                        className: "text-sm font-medium text-vision-cyan hover:text-vision-blue transition-colors",
                                        children: "View all →"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            children: recentInventory.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: recentInventory.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-16 h-20 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden",
                                                children: item.card_image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: item.card_image,
                                                    alt: item.card_name,
                                                    width: 64,
                                                    height: 80,
                                                    className: "object-contain"
                                                }, void 0, false, {
                                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                    className: "h-6 w-6 text-white/40"
                                                }, void 0, false, {
                                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 159,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-semibold text-white truncate",
                                                        children: item.card_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-white/60 truncate",
                                                        children: [
                                                            item.set_name,
                                                            " • ",
                                                            item.location || 'No location'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2 mt-1",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "outline",
                                                            className: "text-xs rounded-lg border-white/20 text-white/80",
                                                            children: item.condition || 'NM'
                                                        }, void 0, false, {
                                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 172,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-vision-cyan",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.acquisition_cost)
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-white/60",
                                                        children: [
                                                            "Qty: ",
                                                            item.quantity
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 183,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 153,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center py-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        className: "h-12 w-12 text-white/20 mx-auto mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 192,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-white/60 mb-4",
                                        children: "No inventory yet"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 193,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/inventory",
                                        className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-vision-blue to-vision-cyan text-white font-medium hover:shadow-lg hover:shadow-vision-blue/20 transition-all",
                                        children: "Add your first item"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 194,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 191,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7e1e9bff._.js.map