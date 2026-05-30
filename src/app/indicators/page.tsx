export const dynamic = 'force-dynamic';

type IndicatorRow = {
  id: string;
  name: string;
  unit: string;
  description: string;
  value: number | null;
  previous: number | null;
  date: string | null;
  error: string | null;
};

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (typeof window !== "undefined") return "";
  return "https://econolens.co.in";
}

async function loadIndicators(): Promise<{ indicators: IndicatorRow[]; error: string | null }> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/indicators`, { cache: "no-store" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { indicators: [], error: data.error ?? `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { indicators: data.indicators ?? [], error: null };
  } catch (err) {
    return { indicators: [], error: err instanceof Error ? err.message : "Network error" };
  }
}

function formatValue(value: number | null, unit: string): string {
  if (value === null || Number.isNaN(value)) return "—";
  if (unit === "USD" && Math.abs(value) >= 1_000_000_000)
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(value) >= 1000)
    return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  return value.toFixed(2);
}

function changeStr(value: number | null, previous: number | null) {
  if (value === null || previous === null || previous === 0)
    return { text: "—", cls: "data-change-nil" };
  const pct = ((value - previous) / Math.abs(previous)) * 100;
  const sign = pct >= 0 ? "▲" : "▼";
  return {
    text: `${sign} ${Math.abs(pct).toFixed(2)}%`,
    cls: pct >= 0 ? "data-change-pos" : "data-change-neg",
  };
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default async function IndicatorsPage() {
  const { indicators, error } = await loadIndicators();

  return (
    <>
      {/* Page header */}
      <div style={{ background: "var(--ink)", borderBottom: "3px solid var(--accent)", padding: "40px 24px 36px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
            Economic Indicators
          </p>
          <h1 className="font-display" style={{ fontSize: 42, fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 12 }}>
            India &amp; Global Macro Data
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }}>
            Live data from FRED (Federal Reserve Bank of St. Louis). Updated hourly.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderLeft: "4px solid var(--red)", padding: "14px 20px", marginBottom: 32, fontSize: 14, color: "#991B1B" }}>
            Could not load indicators: {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--border)" }}>
          {indicators.map((ind) => {
            const change = changeStr(ind.value, ind.previous);
            return (
              <div key={ind.id} className="data-card">
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
                  {ind.name}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <p className="data-number">{formatValue(ind.value, ind.unit)}</p>
                  <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "'Space Mono', monospace" }}>{ind.unit}</span>
                </div>
                <p className={`font-mono-data ${change.cls}`} style={{ fontSize: 13, marginBottom: 14 }}>
                  {change.text} <span style={{ color: "var(--muted)", fontSize: 11 }}>vs prior</span>
                </p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12 }}>{ind.description}</p>
                <p style={{ fontSize: 11, color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: 10, fontFamily: "'Space Mono', monospace" }}>
                  As of {formatDate(ind.date)}
                </p>
              </div>
            );
          })}
          {indicators.length === 0 && !error && (
            <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
              Add a FRED_API_KEY in Vercel environment variables to load live indicators.
            </div>
          )}
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: "var(--muted)" }}>
          Source: <a href="https://fred.stlouisfed.org" target="_blank" rel="noopener" style={{ color: "var(--accent)", textDecoration: "none" }}>FRED, Federal Reserve Bank of St. Louis</a>. Data provided as-is for informational purposes.
        </p>
      </div>
    </>
  );
}
