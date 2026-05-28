/**
 * components/article/FinancialDisclaimer.tsx
 *
 * Auto-appended to articles tagged with financial topics.
 * Text is HARDCODED — cannot be removed or changed via CMS.
 * Renders only when article tags include any FINANCIAL_TAGS.
 *
 * commit: "feat: financial disclaimer auto-append on tagged articles"
 */

// Tags that trigger mandatory financial disclaimer
export const FINANCIAL_TAGS = new Set([
  "markets",
  "investments",
  "stocks",
  "crypto",
  "mutual-funds",
  "monetary-policy",
  "interest-rates",
  "forex",
  "equities",
  "bonds",
  "derivatives",
  "commodities",
  "sebi",
  "rbi",
  "sensex",
  "nifty",
  "ipo",
  "nse",
  "bse",
]);

// HARDCODED legal text — do NOT make this editable via CMS or env var
const DISCLAIMER_TEXT =
  "This article is for experimental and informational purposes only. It does not constitute financial, investment, or securities advice. EconoLens is not a SEBI-registered investment advisor. Please consult a SEBI-registered advisor before making any investment decision.";

/**
 * Check if an article's tags require the financial disclaimer.
 */
export function requiresFinancialDisclaimer(tags: string[]): boolean {
  if (!tags || tags.length === 0) return false;
  return tags.some((tag) => FINANCIAL_TAGS.has(tag.toLowerCase()));
}

interface FinancialDisclaimerProps {
  /** Article tags — disclaimer renders only if a financial tag is present */
  tags: string[];
  className?: string;
}

export default function FinancialDisclaimer({
  tags,
  className = "",
}: FinancialDisclaimerProps) {
  // Guard: render nothing if no financial tags present
  if (!requiresFinancialDisclaimer(tags)) return null;

  return (
    <aside
      className={`mt-8 border-l-4 border-amber-400 bg-amber-50 rounded-r-lg px-5 py-4 ${className}`}
      role="note"
      aria-label="Financial disclaimer"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <svg
          className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>

        <div>
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
            Financial Disclaimer
          </p>
          {/* HARDCODED — do not replace with CMS field */}
          <p className="text-sm text-amber-900 leading-relaxed">{DISCLAIMER_TEXT}</p>
        </div>
      </div>
    </aside>
  );
}
