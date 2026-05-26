export const handleDownloadCV = async ({
  fileName,
  setIsDownloading,
}: {
  fileName: string;
  setIsDownloading?: (isDownloading: boolean) => void;
}) => {
  const element = document.getElementById("cv-document");
  console.log("element", element);
  if (!element) return;

  setIsDownloading?.(true);
  try {
    const html2pdfModule = await import("html2pdf.js");
    const html2pdf = (html2pdfModule.default ??
      html2pdfModule) as () => Html2PdfInstance;

    await html2pdf()
      .set({
        filename: fileName,
        margin: 0,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: element.scrollWidth,
          onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
            clonedEl.style.boxShadow = "none";
            if (clonedDoc.documentElement) {
              clonedDoc.documentElement.style.background = "#ffffff";
              clonedDoc.documentElement.style.color = "#000000";
            }
            if (clonedDoc.body) {
              clonedDoc.body.style.background = "#ffffff";
              clonedDoc.body.style.color = "#000000";
            }
            patchStylesheetsForHtml2Canvas(clonedDoc);
            normalizeColorsForHtml2Canvas(element, clonedEl);
          },
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(element)
      .save();
  } finally {
    setIsDownloading?.(false);
  }
};

/**
 * Convert any CSS color value (oklch/lab/lch/color()/hsl/etc.) to sRGB
 * by round-tripping it through a canvas 2D fillStyle. Browsers always
 * normalize fillStyle to "#rrggbb" or "rgba(...)" when read back.
 */
function makeSRGBConverter() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  return (value: string): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    if (
      trimmed === "" ||
      trimmed === "transparent" ||
      trimmed === "none" ||
      trimmed === "currentColor" ||
      trimmed === "inherit" ||
      trimmed === "initial" ||
      trimmed === "unset"
    ) {
      return null;
    }
    if (!ctx) return null;
    try {
      ctx.fillStyle = "#000";
      ctx.fillStyle = trimmed;
      const normalized = ctx.fillStyle;
      if (typeof normalized === "string" && /^(#|rgb)/i.test(normalized)) {
        return normalized;
      }
      return null;
    } catch {
      return null;
    }
  };
}

/**
 * Walk every stylesheet in the cloned document and rewrite any rule that
 * uses a modern color function so the cascade html2canvas sees only contains
 * sRGB rgb()/rgba() values. This catches inherited colors that inline styles
 * on the target element can't override.
 */
function patchStylesheetsForHtml2Canvas(doc: Document) {
  const toSRGB = makeSRGBConverter();
  const COLOR_FN_RE = /\b(?:oklch|oklab|lab|lch|color)\([^)]*\)/gi;
  const HAS_COLOR_FN_RE = /\b(?:oklch|oklab|lab|lch|color)\(/i;

  const rewriteCssValue = (value: string): string => {
    if (!HAS_COLOR_FN_RE.test(value)) return value;
    COLOR_FN_RE.lastIndex = 0;
    return value.replace(COLOR_FN_RE, (match) => toSRGB(match) ?? "#000000");
  };

  const rewriteCssText = (cssText: string): string => {
    if (!HAS_COLOR_FN_RE.test(cssText)) return cssText;
    return rewriteCssValue(cssText);
  };

  const processStyleDeclaration = (style: CSSStyleDeclaration) => {
    for (let i = 0; i < style.length; i++) {
      const prop = style.item(i);
      const value = style.getPropertyValue(prop);
      if (value && HAS_COLOR_FN_RE.test(value)) {
        const priority = style.getPropertyPriority(prop);
        style.setProperty(prop, rewriteCssValue(value), priority);
      }
    }
  };

  const walkRules = (rules: CSSRuleList | undefined) => {
    if (!rules) return;
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (!rule) continue;
      const styleRule = rule as CSSRule & { style?: CSSStyleDeclaration };
      const nestedRule = rule as CSSRule & { cssRules?: CSSRuleList };

      if (styleRule.style) {
        processStyleDeclaration(styleRule.style);
      }

      if (nestedRule.cssRules) {
        walkRules(nestedRule.cssRules);
      } else {
        const rewritten = rewriteCssText(rule.cssText);
        if (rewritten !== rule.cssText) {
          try {
            const parent = rule.parentStyleSheet;
            parent?.deleteRule(i);
            parent?.insertRule(rewritten, i);
          } catch {
            // Some rule types cannot be replaced; stylesheet text fallback below handles inline styles.
          }
        }
      }
    }
  };

  Array.from(doc.styleSheets).forEach((sheet) => {
    try {
      walkRules(sheet.cssRules);
    } catch {
      // cross-origin stylesheet — skip silently
    }
  });

  doc.querySelectorAll<HTMLStyleElement>("style").forEach((styleEl) => {
    if (!styleEl.textContent) return;
    if (!HAS_COLOR_FN_RE.test(styleEl.textContent)) return;
    styleEl.textContent = rewriteCssText(styleEl.textContent);
  });

  doc.querySelectorAll<HTMLElement | SVGElement>("*").forEach((el) => {
    processStyleDeclaration(el.style);
  });
}

/**
 * html2canvas can't parse modern color functions (oklch/lab/lch/color()).
 * Walk both the live and cloned trees in lock-step, read every computed
 * color value, normalize it to sRGB via a canvas, and apply it as an
 * inline style on the clone so html2canvas only sees rgb()/rgba() values.
 */
function normalizeColorsForHtml2Canvas(
  liveRoot: HTMLElement,
  clonedRoot: HTMLElement,
) {
  const COLOR_PROPS = [
    "color",
    "background-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "outline-color",
    "text-decoration-color",
    "fill",
    "stroke",
  ];

  const toSRGB = makeSRGBConverter();

  const apply = (live: Element, clone: Element) => {
    if (!(clone instanceof HTMLElement) && !(clone instanceof SVGElement)) {
      return;
    }
    const computed = window.getComputedStyle(live);
    COLOR_PROPS.forEach((css) => {
      const raw = computed.getPropertyValue(css);
      const normalized = toSRGB(raw);
      if (normalized) {
        (clone as HTMLElement).style.setProperty(css, normalized);
      }
    });
  };

  apply(liveRoot, clonedRoot);
  const liveNodes = liveRoot.querySelectorAll("*");
  const clonedNodes = clonedRoot.querySelectorAll("*");
  for (let i = 0; i < liveNodes.length && i < clonedNodes.length; i++) {
    apply(liveNodes[i]!, clonedNodes[i]!);
  }
}

type Html2PdfOptions = {
  filename?: string;
  margin?: number | number[];
  image?: { type?: string; quality?: number };
  html2canvas?: Record<string, unknown>;
  jsPDF?: Record<string, unknown>;
  pagebreak?: { mode?: string[] };
};

type Html2PdfInstance = {
  set: (opts: Html2PdfOptions) => Html2PdfInstance;
  from: (element: HTMLElement) => Html2PdfInstance;
  save: () => Promise<void>;
};
