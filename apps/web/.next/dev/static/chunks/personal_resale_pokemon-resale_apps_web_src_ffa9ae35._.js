(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
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
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/button.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function Header({ onMenuClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-16 items-center px-6 gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    size: "icon",
                    className: "md:hidden",
                    onClick: onMenuClick,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                        className: "h-6 w-6"
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                        lineNumber: 20,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-10 w-10 rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#FF1744] flex items-center justify-center text-white font-bold shadow-lg shadow-[#DC143C]/20",
                            children: "P"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-bold text-xl bg-gradient-to-r from-[#DC143C] to-[#FF1744] bg-clip-text text-transparent hidden sm:inline-block",
                            children: "Pokemon Resale"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 ml-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center ring-2 ring-background shadow-sm cursor-pointer hover:shadow-md transition-shadow",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-semibold",
                            children: "U"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                            lineNumber: 32,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/providers/auth-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        name: "Inventory",
        href: "/inventory",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
    },
    {
        name: "Procurement",
        href: "/procurement",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"]
    }
];
function Sidebar({ isOpen, onClose }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { signOut, user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthContext"])();
    const handleSignOut = async ()=>{
        await signOut();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-200 md:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-4 md:hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold",
                                    children: "Menu"
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    onClick: onClose,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex-1 space-y-2 p-4",
                            children: navigation.map((item)=>{
                                const isActive = pathname === item.href;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    onClick: ()=>onClose(),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all", isActive ? "bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white shadow-lg shadow-[#DC143C]/20" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                            lineNumber: 73,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: item.name
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                            lineNumber: 74,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.name, true, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 62,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t p-4 space-y-4",
                            children: [
                                user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-muted-foreground truncate",
                                    children: user.email
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 82,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    className: "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                                    onClick: handleSignOut,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                            lineNumber: 91,
                                            columnNumber: 15
                                        }, this),
                                        "Sign Out"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Sidebar, "kxw0bbgu8GdUVN4SRmj+dkntl+w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthContext"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthGuard",
    ()=>AuthGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/providers/auth-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function AuthGuard({ children }) {
    _s();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthContext"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthGuard.useEffect": ()=>{
            if (!loading && !user) {
                router.push('/login');
            }
        }
    }["AuthGuard.useEffect"], [
        user,
        loading,
        router
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    if (!user) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AuthGuard, "z/Rv3UgWMq5Otb60R+rVeNJTmUg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthGuard;
var _c;
__turbopack_context__.k.register(_c, "AuthGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MainLayout",
    ()=>MainLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$auth$2f$auth$2d$guard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/auth/auth-guard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function MainLayout({ children }) {
    _s();
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$auth$2f$auth$2d$guard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthGuard"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {
                    onMenuClick: ()=>setSidebarOpen(!sidebarOpen)
                }, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                    isOpen: sidebarOpen,
                    onClose: ()=>setSidebarOpen(false)
                }, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "md:pl-64 pt-16",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "container mx-auto p-4 md:p-6 lg:p-8",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx",
                    lineNumber: 17,
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
_s(MainLayout, "5rGDkYpGQ8fHM9RkMWnKOwsxadk=");
_c = MainLayout;
var _c;
__turbopack_context__.k.register(_c, "MainLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border bg-card text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-2xl font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetricCard",
    ()=>MetricCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
function MetricCard({ title, value, icon: Icon, trend, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-none shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-background to-accent/10", className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl p-3 bg-gradient-to-br from-[#DC143C]/10 to-[#FF1744]/5 ring-1 ring-[#DC143C]/10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: "h-5 w-5 text-[#DC143C]"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                            lineNumber: 22,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-muted-foreground",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-3xl font-bold tracking-tight",
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this),
                        trend && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs font-medium flex items-center gap-1", trend.isPositive ? "text-green-600" : "text-red-600"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: trend.isPositive ? "↗" : "↘"
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                                    lineNumber: 33,
                                    columnNumber: 15
                                }, this),
                                trend.value
                            ]
                        }, void 0, true, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                            lineNumber: 29,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c = MetricCard;
var _c;
__turbopack_context__.k.register(_c, "MetricCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            outline: "text-foreground",
            success: "border-transparent bg-green-500 text-white",
            warning: "border-transparent bg-yellow-500 text-white",
            info: "border-transparent bg-blue-500 text-white"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/badge.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/lib/pokemon-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-inventory.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$pokemon$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/pokemon-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
async function getCurrentUserId() {
    const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return user.id;
}
function useInventoryItems(statusFilter) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'inventory',
            'items',
            statusFilter
        ],
        queryFn: {
            "useInventoryItems.useQuery": async ()=>{
                const userId = await getCurrentUserId();
                let query = __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select('*').eq('user_id', userId).order('created_at', {
                    ascending: false
                });
                if (statusFilter) {
                    query = query.eq('status', statusFilter);
                }
                const { data, error } = await query;
                if (error) throw error;
                return data;
            }
        }["useInventoryItems.useQuery"]
    });
}
_s(useInventoryItems, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useInventoryItem(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'inventory',
            'item',
            id
        ],
        queryFn: {
            "useInventoryItem.useQuery": async ()=>{
                const userId = await getCurrentUserId();
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select('*').eq('id', id).eq('user_id', userId).single();
                if (error) throw error;
                return data;
            }
        }["useInventoryItem.useQuery"],
        enabled: !!id
    });
}
_s1(useInventoryItem, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useAddInventoryItem() {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useAddInventoryItem.useMutation": async (data)=>{
                const userId = await getCurrentUserId();
                const insertData = {
                    user_id: userId,
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
                    procurement_id: data.procurement_id || null
                };
                const { data: result, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory').insert([
                    insertData
                ]).select().single();
                if (error) throw error;
                return result;
            }
        }["useAddInventoryItem.useMutation"],
        onSuccess: {
            "useAddInventoryItem.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'inventory'
                    ]
                });
            }
        }["useAddInventoryItem.useMutation"]
    });
}
_s2(useAddInventoryItem, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateInventoryItem() {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateInventoryItem.useMutation": async (data)=>{
                const userId = await getCurrentUserId();
                const { id, ...updateData } = data;
                const { data: result, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory').update(updateData).eq('id', id).eq('user_id', userId).select().single();
                if (error) throw error;
                return result;
            }
        }["useUpdateInventoryItem.useMutation"],
        onSuccess: {
            "useUpdateInventoryItem.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'inventory'
                    ]
                });
            }
        }["useUpdateInventoryItem.useMutation"]
    });
}
_s3(useUpdateInventoryItem, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteInventoryItem() {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteInventoryItem.useMutation": async (id)=>{
                const userId = await getCurrentUserId();
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory').delete().eq('id', id).eq('user_id', userId);
                if (error) throw error;
            }
        }["useDeleteInventoryItem.useMutation"],
        onSuccess: {
            "useDeleteInventoryItem.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'inventory'
                    ]
                });
            }
        }["useDeleteInventoryItem.useMutation"]
    });
}
_s4(useDeleteInventoryItem, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useRecentCards() {
    _s5();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'pokemon',
            'recent'
        ],
        queryFn: {
            "useRecentCards.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$pokemon$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pokemonApi"].getRecentCards()
        }["useRecentCards.useQuery"]
    });
}
_s5(useRecentCards, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useSearchCards(query) {
    _s6();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'pokemon',
            'search',
            query
        ],
        queryFn: {
            "useSearchCards.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$pokemon$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pokemonApi"].searchCards(query)
        }["useSearchCards.useQuery"],
        enabled: query.length > 2
    });
}
_s6(useSearchCards, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-analytics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnalytics",
    ()=>useAnalytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/supabase.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
async function getCurrentUserId() {
    const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return user.id;
}
function useAnalytics() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'analytics'
        ],
        queryFn: {
            "useAnalytics.useQuery": async ()=>{
                const userId = await getCurrentUserId();
                // Get all inventory items
                const { data: inventory, error: invError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select('*').eq('user_id', userId);
                if (invError) throw invError;
                // Get all sales
                const { data: sales, error: salesError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('sales').select('*').eq('user_id', userId);
                if (salesError) throw salesError;
                // Get pending procurements count
                const { count: pendingProcurements, error: procError } = await __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('procurements').select('*', {
                    count: 'exact',
                    head: true
                }).eq('user_id', userId).eq('status', 'PENDING');
                if (procError) throw procError;
                // Calculate inventory metrics
                const activeInventory = inventory?.filter({
                    "useAnalytics.useQuery": (item)=>item.status === 'IN_STOCK' || item.status === 'LISTED'
                }["useAnalytics.useQuery"]) || [];
                const totalInventoryValue = activeInventory.reduce({
                    "useAnalytics.useQuery.totalInventoryValue": (sum, item)=>sum + item.acquisition_cost * item.quantity
                }["useAnalytics.useQuery.totalInventoryValue"], 0);
                const totalItems = activeInventory.reduce({
                    "useAnalytics.useQuery.totalItems": (sum, item)=>sum + item.quantity
                }["useAnalytics.useQuery.totalItems"], 0);
                const totalInvested = inventory?.reduce({
                    "useAnalytics.useQuery": (sum, item)=>sum + item.acquisition_cost * item.quantity
                }["useAnalytics.useQuery"], 0) || 0;
                const itemsSold = inventory?.filter({
                    "useAnalytics.useQuery": (item)=>item.status === 'SOLD'
                }["useAnalytics.useQuery"]).length || 0;
                // Calculate sales metrics
                const totalRevenue = sales?.reduce({
                    "useAnalytics.useQuery": (sum, sale)=>sum + sale.sale_price
                }["useAnalytics.useQuery"], 0) || 0;
                const totalSalesFees = sales?.reduce({
                    "useAnalytics.useQuery": (sum, sale)=>sum + (sale.fees || 0) + (sale.shipping_cost || 0)
                }["useAnalytics.useQuery"], 0) || 0;
                // Get cost of sold items
                const soldItemIds = sales?.map({
                    "useAnalytics.useQuery": (s)=>s.inventory_id
                }["useAnalytics.useQuery"]).filter(Boolean) || [];
                const soldItemsCost = inventory?.filter({
                    "useAnalytics.useQuery": (item)=>soldItemIds.includes(item.id)
                }["useAnalytics.useQuery"]).reduce({
                    "useAnalytics.useQuery": (sum, item)=>sum + item.acquisition_cost
                }["useAnalytics.useQuery"], 0) || 0;
                const totalProfit = totalRevenue - soldItemsCost - totalSalesFees;
                // Inventory by status
                const inventoryByStatus = {
                    IN_STOCK: inventory?.filter({
                        "useAnalytics.useQuery": (i)=>i.status === 'IN_STOCK'
                    }["useAnalytics.useQuery"]).reduce({
                        "useAnalytics.useQuery": (s, i)=>s + i.quantity
                    }["useAnalytics.useQuery"], 0) || 0,
                    LISTED: inventory?.filter({
                        "useAnalytics.useQuery": (i)=>i.status === 'LISTED'
                    }["useAnalytics.useQuery"]).reduce({
                        "useAnalytics.useQuery": (s, i)=>s + i.quantity
                    }["useAnalytics.useQuery"], 0) || 0,
                    SOLD: inventory?.filter({
                        "useAnalytics.useQuery": (i)=>i.status === 'SOLD'
                    }["useAnalytics.useQuery"]).reduce({
                        "useAnalytics.useQuery": (s, i)=>s + i.quantity
                    }["useAnalytics.useQuery"], 0) || 0
                };
                // Inventory by condition
                const inventoryByCondition = {};
                inventory?.forEach({
                    "useAnalytics.useQuery": (item)=>{
                        const condition = item.condition || 'NM';
                        inventoryByCondition[condition] = (inventoryByCondition[condition] || 0) + item.quantity;
                    }
                }["useAnalytics.useQuery"]);
                // Recent activity (last 7 days)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const recentItems = inventory?.filter({
                    "useAnalytics.useQuery": (item)=>new Date(item.created_at) >= sevenDaysAgo
                }["useAnalytics.useQuery"]) || [];
                const activityByDate = {};
                recentItems.forEach({
                    "useAnalytics.useQuery": (item)=>{
                        const date = new Date(item.created_at).toISOString().split('T')[0];
                        if (!activityByDate[date]) {
                            activityByDate[date] = {
                                itemsAdded: 0,
                                value: 0
                            };
                        }
                        activityByDate[date].itemsAdded += item.quantity;
                        activityByDate[date].value += item.acquisition_cost * item.quantity;
                    }
                }["useAnalytics.useQuery"]);
                const recentActivity = Object.entries(activityByDate).map({
                    "useAnalytics.useQuery.recentActivity": ([date, data])=>({
                            date,
                            ...data
                        })
                }["useAnalytics.useQuery.recentActivity"]).sort({
                    "useAnalytics.useQuery.recentActivity": (a, b)=>a.date.localeCompare(b.date)
                }["useAnalytics.useQuery.recentActivity"]);
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
        }["useAnalytics.useQuery"]
    });
}
_s(useAnalytics, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$main$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/layout/main-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$metric$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/dashboard/metric-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-inventory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/hooks/use-analytics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personal/resale/pokemon-resale/apps/web/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
function DashboardPage() {
    _s();
    const { data: inventory } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryItems"])();
    const { data: analytics, isLoading: analyticsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalytics"])();
    const recentInventory = inventory?.slice(0, 5) || [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$main$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MainLayout"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-bold tracking-tight mb-2",
                            children: "Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground text-lg",
                            children: "Your business overview at a glance"
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$metric$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                            title: "Inventory Value",
                            value: analyticsLoading ? '...' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(analytics?.totalInventoryValue || 0),
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"],
                            trend: {
                                value: `${analytics?.totalItems || 0} items`,
                                isPositive: true
                            }
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$metric$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                            title: "Total Invested",
                            value: analyticsLoading ? '...' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(analytics?.totalInvested || 0),
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"]
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$metric$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                            title: "Items Sold",
                            value: analyticsLoading ? '...' : String(analytics?.itemsSold || 0),
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
                            trend: analytics?.totalProfit ? {
                                value: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(analytics.totalProfit)} profit`,
                                isPositive: analytics.totalProfit > 0
                            } : undefined
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$dashboard$2f$metric$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                            title: "Pending Orders",
                            value: analyticsLoading ? '...' : String(analytics?.pendingProcurements || 0),
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"]
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-6 lg:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "border-none shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "text-xl",
                                        children: "Inventory Status"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 62,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-3 w-3 rounded-full bg-green-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                                lineNumber: 68,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm",
                                                                children: "In Stock"
                                                            }, void 0, false, {
                                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                                lineNumber: 69,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 67,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold",
                                                        children: analytics?.inventoryByStatus?.IN_STOCK || 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 71,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 66,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-3 w-3 rounded-full bg-blue-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                                lineNumber: 75,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm",
                                                                children: "Listed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                                lineNumber: 76,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 74,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold",
                                                        children: analytics?.inventoryByStatus?.LISTED || 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 78,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 73,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-3 w-3 rounded-full bg-gray-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                                lineNumber: 82,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm",
                                                                children: "Sold"
                                                            }, void 0, false, {
                                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                                lineNumber: 83,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 81,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold",
                                                        children: analytics?.inventoryByStatus?.SOLD || 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 85,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 80,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 65,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "border-none shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "text-xl",
                                        children: "By Condition"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2",
                                        children: [
                                            analytics?.inventoryByCondition && Object.entries(analytics.inventoryByCondition).map(([condition, count])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "outline",
                                                    className: "rounded-lg px-3 py-1.5",
                                                    children: [
                                                        condition,
                                                        ": ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold ml-1",
                                                            children: count
                                                        }, void 0, false, {
                                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                            lineNumber: 100,
                                                            columnNumber: 34
                                                        }, this)
                                                    ]
                                                }, condition, true, {
                                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                    lineNumber: 99,
                                                    columnNumber: 19
                                                }, this)),
                                            (!analytics?.inventoryByCondition || Object.keys(analytics.inventoryByCondition).length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "No inventory yet"
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 104,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 97,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                analytics?.recentActivity && analytics.recentActivity.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "border-none shadow-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-xl flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 116,
                                        columnNumber: 17
                                    }, this),
                                    "Recent Activity (7 days)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 115,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 114,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
                                children: analytics.recentActivity.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl bg-accent/20 p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground mb-1",
                                                children: new Date(day.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 124,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold",
                                                children: [
                                                    day.itemsAdded,
                                                    " items"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 127,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[#DC143C]",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(day.value)
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 128,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, day.date, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 123,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 120,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 113,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "border-none shadow-sm bg-gradient-to-br from-background to-accent/5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "text-2xl",
                                        children: "Recent Inventory"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/inventory",
                                        className: "text-sm font-medium text-[#DC143C] hover:text-[#FF1744] transition-colors",
                                        children: "View all →"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 137,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            children: recentInventory.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: recentInventory.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4 p-4 rounded-2xl bg-background/50 hover:bg-background transition-colors border border-border/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-16 h-20 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden",
                                                children: item.card_image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: item.card_image,
                                                    alt: item.card_name,
                                                    width: 64,
                                                    height: 80,
                                                    className: "object-contain"
                                                }, void 0, false, {
                                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                    className: "h-6 w-6 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-semibold truncate",
                                                        children: item.card_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted-foreground truncate",
                                                        children: [
                                                            item.set_name,
                                                            " • ",
                                                            item.location || 'No location'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2 mt-1",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "outline",
                                                            className: "text-xs rounded-lg",
                                                            children: item.condition || 'NM'
                                                        }, void 0, false, {
                                                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                            lineNumber: 175,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 169,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-[#DC143C]",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.acquisition_cost)
                                                    }, void 0, false, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted-foreground",
                                                        children: [
                                                            "Qty: ",
                                                            item.quantity
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                                lineNumber: 180,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 152,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 150,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center py-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        className: "h-12 w-12 text-muted-foreground/50 mx-auto mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 189,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted-foreground mb-4",
                                        children: "No inventory yet"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/inventory",
                                        className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white font-medium hover:shadow-lg hover:shadow-[#DC143C]/20 transition-all",
                                        children: "Add your first item"
                                    }, void 0, false, {
                                        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                        lineNumber: 191,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                                lineNumber: 188,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/personal/resale/pokemon-resale/apps/web/src/app/page.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "/2EwZeBxJbVu6JZNwl2Uc6w8taQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryItems"],
        __TURBOPACK__imported__module__$5b$project$5d2f$personal$2f$resale$2f$pokemon$2d$resale$2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalytics"]
    ];
});
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=personal_resale_pokemon-resale_apps_web_src_ffa9ae35._.js.map