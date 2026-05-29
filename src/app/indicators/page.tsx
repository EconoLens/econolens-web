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
    const res = await fetch(`${getBaseUrl()}/api/indicators`, {
      cache: "no-store",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { indicators: [], error: data.error ?? `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { indicators: data.indicators ?? [], error: null };
  } catch (err) {
    return {
      indicators: [],
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

function formatValue(value: number | null, unit: string): string {
  if (value === null || Number.isNaN(value)) return "—";
  if (unit === "USD" && Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }
  return value.toFixed(2);
}

function changeStr(value: number | null, previous: number | null): {
  text: string;
  positive: boolean | null;
} {
  if (value === null || previous === null || previous === 0) {
    return { text: "—", positive: null };
  }
  const pct = ((value - previous) / Math.abs(previous)) * 100;
  const sign = pct >= 0 ? "+" : "";
  return { text: `${sign}${pct.toFixed(2)}%`, positive: pct >= 0 };
}

function formatDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function IndicatorsPage() {
  const { indicators, error } = await loadIndicators();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="border-b border-neutral-200 pb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Economic Indicators
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">
          India in numbers
        </h1>
        <p className="mt-3 text-neutral-600">
          Key macro series from FRED (Federal Reserve Bank of St. Louis). Updated hourly.
        </p>
      </header>

      {error && (
        <div className="mt-8 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Could not load indicators: {error}
        </div>
      )}

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map((ind) => {
          const change = changeStr(ind.value, ind.previous);
          return (
            <div
              key={ind.id}
              className="rounded-lg border border-neutral-200 bg-white p-6"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                {ind.name}
              </p>
              <p className="mt-3 text-3xl font-semibold text-neutral-900">
                {formatValue(ind.value, ind.unit)}
                <span className="ml-2 text-base font-normal text-neutral-500">
                  {ind.unit}
                </span>
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span
                  className={
                    change.positive === null
                      ? "text-neutral-500"
                      : change.positive
                        ? "text-emerald-700"
                        : "text-red-700"
                  }
                >
                  {change.text}
                </span>
                <span className="text-neutral-500">vs prior period</span>
              </div>
              <p className="mt-4 text-sm text-neutral-600">{ind.description}</p>
              <p className="mt-3 text-xs text-neutral-500">
                As of {formatDate(ind.date)}
              </p>
            </div>
          );
        })}
      </section>

      <p className="mt-10 text-xs text-neutral-500">
        Source: FRED, St. Louis Fed. Data is provided as-is for informational purposes.
      </p>
    </main>
  );
}
