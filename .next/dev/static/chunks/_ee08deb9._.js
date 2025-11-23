(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center px-6 [.border-t]:pt-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/medicines-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "medicinesData",
    ()=>medicinesData
]);
const medicinesData = [
    {
        id: "c5b9cf3d-db18-439c-9ecc-e678d04a6cbe",
        productId: "57229",
        slug: "empagen-t-10-5-1000mg-tab-14s",
        title: "Empagen Trio Tablets 10Mg/5Mg/1000Mg",
        productImage: "/diabetes-medicine-tablets.jpg",
        brand: "FEROZSONS LABORATORIES",
        usedFor: "Diabetes",
        childCategory: "Diabetes",
        productDetails: {
            howItWorks: "Empagliflozin : Sodium-glucose co-transporter 2 (SGLT2) is the predominant transporter responsible for reabsorption of glucose from the glomerular filtrate back into the circulation. Empagliflozin is an inhibitor of SGLT2. By inhibiting SGLT2, Empagliflozin reduces renal reabsorption of filtered glucose and lowers the renal threshold for glucose, and thereby increases urinary glucose excretion. Linagliptin : Linagliptin is an inhibitor of DPP-4, an enzyme that degrades the incretin hormones glucagon-like peptide-1 (GLP-1) and glucose-dependent insulinotropic polypeptide (GIP). Thus, Linagliptin increases the concentrations of active incretin hormones, stimulating the release of insulin in a glucose-dependent manner and decreasing the levels of glucagon in the circulation. Both incretin hormones are involved in the physiological regulation of glucose homeostasis. GLP-1 and GIP increase insulin biosynthesis and secretion from pancreatic beta cells in the presence of normal and elevated blood glucose levels. Furthermore, GLP-1 also reduces glucagon secretion from pancreatic alpha cells, resulting in a reduction in hepatic glucose output . Metformin : It is an antihyperglycemic agent which improves glucose tolerance in patients with type 2 diabetes, lowering both basal and postprandial plasma glucose. Its pharmacologic mechanisms of action are different from other classes of oral antihyperglycemic agents. Metformin decreases hepatic glucose production, decreases intestinal absorption of glucose and improves insulin sensitivity by increasing peripheral glucose uptake and utilization. Unlike sulfonylureas, metformin does not produce hypoglycemia in either patients with type 2 diabetes or normal subjects and does not cause hyperinsulinemia. With metformin therapy, insulin secretion remains unchanged while fasting insulin levels and day-long plasma insulin response may actually decrease.",
            description: "EMPAGEN T 10/5/1000MG TAB 14S",
            generics: "Empagliflozin + Linagliptin +Metformin HCl",
            usedFor: "Diabetes",
            requiresPrescriptionYesNo: "Yes",
            indication: "Empagliflozin + Linagliptin + Metformin HCl are indicated as an adjunct to diet and exercise in adults aged 18 years and older with type 2 diabetes mellitus: to improve glycemic control when metformin and/or sulphonylurea (SU) and monotherapy of either of Empagliflozin and Linagliptin do not provide adequate glycemic control . When already being treated with the free combination of Empagliflozin and Linagliptin. Empagliflozin is indicated to reduce the risk of cardiovascular death in adults with type 2 diabetes mellitus and established cardiovascular disease.",
            sideEffects: "Common: Urinary tract infection (including pyelonephritis and urosepsis), vaginal moniliasis, vulvovaginitis, balanitis and other genital infections, nasopharyngitis, hypoglycaemia (when used with sulphonylurea or insulin), thirst, cough, pruritus, rash, increased urination, amylase increased and lipase increased. Uncommon: Hypersensitivity, angioedema, urticarial, pancreatitis, volume depletion, dysuria, hematocrit increased, serum lipids increased and blood creatinine increased/glomerular filtration rate decreased. Not known: Necrotising fasciitis of the perineum (Fournier´s gangrene) and bullous pemphigoid.",
            whenNotToUse: "The combination of Empagliflozin + Linagliptin + Metformin HCl is contraindicated in patients with hypersensitivity to the active substances, to any other Sodium-Glucose-Co-Transporter-2 (SGLT2) inhibitor, to any other Dipeptidyl-Peptidase-4 (DPP-4) inhibitor, or to any of the excipients of the product.",
            dosage: "As recommended by your physician.",
            storageYesOrNo: "Store this medicine at room temperature, away from direct light and heat.",
            precautions: "Use of dipeptidyl peptidase-4 (DPP-4) inhibitors has been associated with a risk of developing acute pancreatitis. Acute pancreatitis has been observed in patients taking Linagliptin. If pancreatitis is suspected, Empagliflozin + Linagliptin Tablets should be discontinued; if acute pancreatitis is confirmed, Empagliflozin + Linagliptin should not be restarted. Caution should be exercised in patients with a history of pancreatitis.",
            warning1: "Caution should be exercised in patients for whom an Empagliflozin-induced drop in blood pressure could pose a risk, such as patients with known cardiovascular disease, patients on anti-hypertensive therapy (e.g. thiazide and loop diuretics with a history of hypotension or patients aged 75 years and older).",
            warning2: "An increase in cases of lower limb amputation (primarily of the toe) has been observed. Like for all diabetic patients it is important to counsel patients on routine preventative foot-care.",
            warning3: "Treatment with SGLT2 inhibitors increases the risk for urinary tract infections. Evaluate patients for signs and symptoms of urinary tract infections and treat promptly, if indicated .",
            pregnancyCategory: "Always consult your physician before using any medicine.",
            drugInteractions: "Diuretics : Coadministration of Empagliflozin with diuretics resulted in increased urine volume and frequency of voids, which might enhance the potential for volume depletion. Before initiating Empagliflozin + Linagliptin , assess volume status and renal function. In patients with volume depletion, correct this condition before initiating therapy. Monitor for signs and symptoms of volume depletion and renal function after initiating therapy. Interference with 1,5-anhydroglucitol (1,5-AG) Assay Measurements of 1,5-AG are unreliable in assessing glycemic control in patients taking SGLT2 inhibitors. Monitoring glycemic control with 1,5-AG assay is not recommended. Use alternative methods to monitor glycemic control. Inducers of P-glycoprotein or CYP3A4 Enzymes Rifampin decreased Linagliptin exposure, suggesting that the efficacy of Linagliptin may be reduced when administered in combination with a strong P-gp or CYP3A4 inducer. Use of alternative treatments is strongly recommended when Linagliptin is to be administered with a strong P-gp or CYP3A4 inducer. Metformin : Alcohol, Iodinated contrast agents , diuretics , corticosteroids , ACE inhibitors , sympathomimetics , NSAIDs , other hypoglycaemics . Inhibitors of OCT2 ( e.g , cimetidine, dolutegravir , ranolazine , trimethoprim ) ."
        },
        createdAt: "2025-11-23T01:10:45.330Z",
        updatedAt: "2025-11-23T01:10:45.330Z"
    },
    {
        id: "f81a6862-f735-4acb-9670-32ddec29e4d9",
        productId: "57227",
        slug: "nebinorm-5mg-tab-14s",
        title: "Nebinorm Tablet 5Mg",
        productImage: "/hypertension-medicine-beta-blocker.jpg",
        brand: "FEROZSONS LABORATORIES",
        usedFor: "Hypertension",
        childCategory: "Hypertension",
        productDetails: {
            howItWorks: "Nebivolol is a ß1 selective adrenoceptor antagonist whose hemodynamic effects differ from those of classical ß-adrenoceptor antagonist as a result of a vasodilating action. It has mild vasodilating properties attributed to its interaction with the L-arginine/nitric oxide path way, a property not shared by other ß-blockers. Nebivolol lacks intrinsic sympathomimetic and membrane stabilizing activity at therapeutically relevant concentrations. At clinically relevant doses, nebivolol does not demonstrate a1-adrenergic receptor blockade activity.",
            description: "NEBINORM 5MG TAB 14'S",
            generics: "Nebivolol HCl",
            usedFor: "Hypertension",
            requiresPrescriptionYesNo: "Yes",
            indication: "For the treatment of essential hypertension, stable, mild and moderate chronic heart failure in addition to standard therapies in elderly patients 70 years and may be used alone or in combination with other anti-hypertensive agents.",
            sideEffects: "Common: Headache, dizziness, paresthesia, dyspnea, constipation, nausea, diarrhea, tiredness, edema. Uncommon: Nightmares, depression, impaired vision, bradycardia, heart failure, slowed AV conduction/AV-block, hypotension, (increase of) intermittent claudication, bronchospasm, dyspepsia, flatulence, vomiting, pruritus, rash, erythematous, impotence . Rare: Syncope, psoriasis aggravated.",
            whenNotToUse: "Nebivolol is contraindicated in patients with : Hypersensitivity to the active substance or to any of the components . Severe hepatic insufficiency . Acute heart failure, cardiogenic shock or episodes of heart failure decompensation requiring I.V. inotropic therapy . Sick sinus syndrome, including sino-atrial block . Second and third degree heart block (without a pacemaker) . History of bronchospasm and bronchial asthma . Untreated phaeochromocytoma . Metabolic acidosis . Bradycardia (heart rate < 60bpm prior to start of therapy) . Hypotension (systoli c blood pressure < 90mmHg) . Severe peripheral circulatory disturbances .",
            dosage: "Hypertension - Adults : The dose is one tablet (5mg) daily, preferably at the same time of the day. Tablets may be taken with or without meals. The initial up titration should be done at 1-2 weekly intervals based on patient tolerability. The maximum recommended dose is 10mg nebivolol once daily . Elderly : In patients over 65 years, the recommended starting dose is 2.5mg daily. If needed, the daily dose may be increased to 5mg. Children : Not recommended. Or As directed by your physician.",
            storageYesOrNo: "Store this medicine at room temperature, away from direct light and heat.",
            precautions: "In patients who have compensated congestive heart failure, nebivolol should be administered cautiously. If heart failure worsens, discontinuation of nebivolol should be considered.",
            warning1: "Care should be taken in diabetic patients however, as nebivolol may mask certain symptoms of hypoglycemia (tachycardia, palpitations). ß-adrenergic blocking agents may mask tachycardic symptoms in hyperthyroidism. Abrupt withdrawal may intensify symptoms.",
            warning2: "The treatment with nebivolol is not recommended to be stopped abruptly since this might lead to a transitory worsening of heart failure. If discontinuation is necessary, the dose should be gradually decreased divided into halves weekly. If the angina worsens or acute coronary insufficiency develops, it is recommended that nebivolol be promptly reinstituted, at least temporarily.",
            warning3: "ß-blockers can precipitate or aggravate symptoms of arterial insufficiency in patients with peripheral vascular diseases. Caution should be exercised in these patients.",
            pregnancyCategory: "Always consult your physician before using any medicine.",
            drugInteractions: "Phenylalkylamine [verapamil] and benzothiazepine [diltiazem] classes) or antiarrhythmic agents such as disopyramide , digitalis glycosides and ß-blockers , reserpine or guanethidine , clonidine , CYP2D6 inhibitors (quinidine, propafenone, fluoxetine, paroxetine ) , Cimetidine , Sildenafil."
        },
        createdAt: "2025-11-23T01:10:45.287Z",
        updatedAt: "2025-11-23T01:10:45.287Z"
    },
    {
        id: "32605263-cab3-47b0-ace9-63f51ddff8dd",
        productId: "57119",
        slug: "cuziper-2-5mg-tab-14s",
        title: "Cuziper Tablets 2.5Mg",
        productImage: "/bisoprolol-blood-pressure-medication.jpg",
        brand: "HIGHNOON LABORATORIES LTD.",
        usedFor: "Hypertension",
        childCategory: "Hypertension",
        productDetails: {
            howItWorks: "Bisoprolol fumarate belongs to group of medicines called beta-blockers. Beta-blocker protects heart from too much activity. This medicine works by affecting the body's response to some nerve impulses, especially in the heart. As a result, Bisoprolol fumarate slows down the heart rate and makes the heart more efficient at pumping blood around the body.",
            description: "CUZIPER 2.5MG TAB 14'S",
            generics: "Bisoprolol Fumarate",
            usedFor: "Hypertension",
            requiresPrescriptionYesNo: "Yes",
            indication: "Bisoprolol are also used to treat high blood pressure (Hypertension) and angina pectoris .",
            sideEffects: "Tiredness , feeling weak (In patient with chronic heart failure) , dizziness, headache , Feeling of coldness or numbness in hands or feet , Low blood pressure, especially in patient with heart failure , Stomach or intestine problem such as nausea, vomiting, diarrhea or constipation , Sleep disturbances , Depression , Breathing problems in patients with asthma or chronic lung disease , Muscle weakness, muscle cramps. , feeling weak (In patient with hypertension or angina pectoris )",
            whenNotToUse: "Do not take if: - You are allergic to Bisoprolol fumarate or any of the other ingredients of this medicine . - You have severe asthma or sever chronic lung disease. - You have severe blood circulation problem in limbs (such as Raynaud's syndrome), which may cause your fingers and toes to tingle or turn pale or blue.",
            dosage: "Hypertension & Angina - Adults : Usually 10mg once daily , max 20mg daily. Children : Not recommended. Always consult your doctor or pharmacist for dose adjustment.",
            storageYesOrNo: "Store this medicine at room temperature, away from direct light and heat.",
            precautions: "This medicine may cause changes in your blood sugar levels. Also, this medicine may cover up signs of low blood sugar, such as a rapid pulse rate. Check with your doctor if you have these problems or if you notice a change in the results of your blood or urine sugar tests .",
            warning1: "Bisoprolol may cause heart failure in some patients. Check with your doctor right away if you are having chest pain or discomfort; dilated neck veins; extreme fatigue; irregular breathing; an irregular heartbeat; shortness of breath; swelling of the face, fingers, feet, or lower legs; weight gain; or wheezing .",
            warning2: "Make sure any doctor or dentist who treats you knows that you are using this medicine. You may need to stop using this medicine several days before having surgery .",
            warning3: "This medicine may cause some people to become less alert than they are normally. If this side effect occurs, do not drive, use machines, or do anything else that could be dangerous if you are not alert while taking bisoprolol .",
            pregnancyCategory: "Always consult your physician before using any medicine.",
            drugInteractions: "Amiodarone, amlodipine, clonidine, digitalis glycosides, diltiazem, disopyramide, felodipine, flecainide, lidocaine, methyldopa, moxonidine, phenytoin, propafenone, quinidine, rilmenidine, verapamil ,  imipramine, amitriptyline, moclobemide , phenothiazines , acetyl salicylic acid, diclofenac, indomethacin, ibuprofen, naproxen , adrenaline, dobutamine, noradrenaline , mefloquine , ergotamine derivatives"
        },
        createdAt: "2025-11-23T01:10:45.186Z",
        updatedAt: "2025-11-23T01:10:45.186Z"
    },
    {
        id: "734fc050-7f96-4ed6-983c-173032966f79",
        productId: "57037",
        slug: "lumatep-42mg-caps-20s",
        title: "Lumatep Capsules 42Mg",
        productImage: "/antipsychotic-capsule-schizophrenia-medication.jpg",
        brand: "GETZ PHARMA PAKISTAN",
        usedFor: "Schizophrenia",
        childCategory: "Schizophrenia",
        productDetails: {
            howItWorks: "Lumateperone works by uniquely modulating several key chemical messengers, or neurotransmitters, in the brain: serotonin, dopamine, and glutamate. The precise way it improves symptoms of schizophrenia and bipolar depression is not fully understood, but this multi-targeted approach is central to its effects",
            description: "Lumatep Capsules 42mg (1 Box = 2 Strips) (1 Strip = 10 Tablets)",
            generics: "Lumateperone",
            usedFor: "Schizophrenia",
            requiresPrescriptionYesNo: "Yes",
            indication: "Schizophrenia in adults . Depressive episodes associated with bipolar I or II disorder (bipolar depression) in adults , as monotherapy and as adjunctive therapy with lithium or valproate .",
            sideEffects: "Nausea , dry mouth , dizziness , somnolence/sedation .",
            whenNotToUse: "The medication is contraindicated in patients with a known hypersensitivity reaction to lumateperone or any of its components.",
            dosage: "Adults : 42mg once daily . Children : Not recommended . Or As directed by your physician .",
            storageYesOrNo: "Store this medicine at room temperature, away from direct light and heat.",
            precautions: "Lumateperone can cause or worsen high blood sugar (hyperglycemia), diabetes, and high cholesterol levels. Your doctor should monitor your blood sugar and lipid levels during treatment.",
            warning1: "Older adults with psychosis related to dementia who are treated with antipsychotic drugs like lumateperone have an increased risk of death. Lumateperone is not approved for use in this population.",
            warning2: "Antidepressants, including lumateperone, may increase the risk of suicidal thoughts and actions in young adults (up to age 24). Patients should be monitored closely, especially when treatment begins or dosage changes.",
            warning3: "Lumateperone can cause drowsiness, dizziness, and low blood pressure, increasing the risk of falls.",
            pregnancyCategory: "Always consult your physician before using any medicine.",
            drugInteractions: "CYP3A4 inducers e.g. Rifampin ; avoid. Strong and moderate CYP3A4 inhibitors e.g. Itraconazole and Diltiazem; reduce dose ."
        },
        createdAt: "2025-11-23T01:10:45.145Z",
        updatedAt: "2025-11-23T01:10:45.145Z"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/medicines/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MedicinesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$medicines$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/medicines-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function MedicinesPage() {
    _s();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const categories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MedicinesPage.useMemo[categories]": ()=>{
            const cats = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$medicines$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["medicinesData"].map({
                "MedicinesPage.useMemo[categories]": (m)=>m.usedFor
            }["MedicinesPage.useMemo[categories]"]));
            return Array.from(cats);
        }
    }["MedicinesPage.useMemo[categories]"], []);
    const filteredMedicines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MedicinesPage.useMemo[filteredMedicines]": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$medicines$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["medicinesData"].filter({
                "MedicinesPage.useMemo[filteredMedicines]": (medicine)=>{
                    const matchesSearch = medicine.title.toLowerCase().includes(searchTerm.toLowerCase()) || medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()) || medicine.productDetails.generics.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesCategory = !selectedCategory || medicine.usedFor === selectedCategory;
                    return matchesSearch && matchesCategory;
                }
            }["MedicinesPage.useMemo[filteredMedicines]"]);
        }
    }["MedicinesPage.useMemo[filteredMedicines]"], [
        searchTerm,
        selectedCategory
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-background py-12 px-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-bold text-foreground mb-4",
                            children: "Medicine Database"
                        }, void 0, false, {
                            fileName: "[project]/app/medicines/page.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg text-muted-foreground",
                            children: "Comprehensive information about medications, dosages, side effects, and interactions"
                        }, void 0, false, {
                            fileName: "[project]/app/medicines/page.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/medicines/page.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "absolute left-3 top-3 w-5 h-5 text-muted-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/app/medicines/page.tsx",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    placeholder: "Search medicines, brands, or generics...",
                                    value: searchTerm,
                                    onChange: (e)=>setSearchTerm(e.target.value),
                                    className: "pl-10 h-12 border-blue-200 focus:border-blue-600"
                                }, void 0, false, {
                                    fileName: "[project]/app/medicines/page.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/medicines/page.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-foreground mb-3",
                                    children: "Filter by Category"
                                }, void 0, false, {
                                    fileName: "[project]/app/medicines/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedCategory(null),
                                            className: `px-4 py-2 rounded-full transition ${selectedCategory === null ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`,
                                            children: "All"
                                        }, void 0, false, {
                                            fileName: "[project]/app/medicines/page.tsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this),
                                        categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSelectedCategory(cat),
                                                className: `px-4 py-2 rounded-full transition ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`,
                                                children: cat
                                            }, cat, false, {
                                                fileName: "[project]/app/medicines/page.tsx",
                                                lineNumber: 65,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/medicines/page.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/medicines/page.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/medicines/page.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 text-sm text-muted-foreground",
                    children: [
                        filteredMedicines.length,
                        " medicines found"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/medicines/page.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                    children: filteredMedicines.map((medicine)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/medicines/${medicine.id}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: "h-full hover:shadow-lg transition cursor-pointer border-blue-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full aspect-square bg-gray-100 overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: medicine.productImage || "/placeholder.svg",
                                            alt: medicine.title,
                                            width: 200,
                                            height: 200,
                                            className: "w-full h-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/app/medicines/page.tsx",
                                            lineNumber: 86,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/medicines/page.tsx",
                                        lineNumber: 85,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                className: "text-lg text-foreground line-clamp-2",
                                                children: medicine.title
                                            }, void 0, false, {
                                                fileName: "[project]/app/medicines/page.tsx",
                                                lineNumber: 95,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                className: "text-sm",
                                                children: medicine.brand
                                            }, void 0, false, {
                                                fileName: "[project]/app/medicines/page.tsx",
                                                lineNumber: 96,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/medicines/page.tsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground mb-1",
                                                        children: "Generic Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/medicines/page.tsx",
                                                        lineNumber: 100,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-medium text-foreground line-clamp-2",
                                                        children: medicine.productDetails.generics
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/medicines/page.tsx",
                                                        lineNumber: 101,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/medicines/page.tsx",
                                                lineNumber: 99,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-sm",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "bg-blue-100 text-blue-700 px-3 py-1 rounded-full",
                                                    children: medicine.usedFor
                                                }, void 0, false, {
                                                    fileName: "[project]/app/medicines/page.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/medicines/page.tsx",
                                                lineNumber: 105,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-muted-foreground",
                                                children: [
                                                    "Requires Prescription: ",
                                                    medicine.productDetails.requiresPrescriptionYesNo
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/medicines/page.tsx",
                                                lineNumber: 108,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                className: "w-full bg-blue-600 hover:bg-blue-700 text-white mt-4",
                                                children: "View Details →"
                                            }, void 0, false, {
                                                fileName: "[project]/app/medicines/page.tsx",
                                                lineNumber: 111,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/medicines/page.tsx",
                                        lineNumber: 98,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/medicines/page.tsx",
                                lineNumber: 84,
                                columnNumber: 15
                            }, this)
                        }, medicine.id, false, {
                            fileName: "[project]/app/medicines/page.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/medicines/page.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this),
                filteredMedicines.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-lg",
                        children: "No medicines found matching your search."
                    }, void 0, false, {
                        fileName: "[project]/app/medicines/page.tsx",
                        lineNumber: 120,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/medicines/page.tsx",
                    lineNumber: 119,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/medicines/page.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/medicines/page.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(MedicinesPage, "XJpetkiDbLHAXCPz22tj24iUWlU=");
_c = MedicinesPage;
var _c;
__turbopack_context__.k.register(_c, "MedicinesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_ee08deb9._.js.map