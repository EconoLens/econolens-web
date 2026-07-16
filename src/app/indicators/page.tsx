import Link from 'next/link';

export const dynamic = 'force-dynamic';

type IndicatorRow = {
  id: string;
  slug: string;
  name: string;
  unit: string;
  country: string;
  category: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  date?: string;
};

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (typeof window !== 'undefined') return '';
  return 'https://econolens.co.in';
}

async function loadIndicators(): Promise<{ indicators: IndicatorRow[]; error: string | null }> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/indicators`, { cache: 'no-store' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { indicators: [], error: data.error ?? `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { indicators: data.indicators ?? [], error: null };
  } catch (err) {
    return { indicators: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

function formatValue(value: string, unit: string): string {
  if (!value || value === 'N/A') return '—';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (unit === 'Billions USD' && Math.abs(num) >= 1000)
    return `$${(num / 1000).toFixed(2)}T`;
  if (Math.abs(num) >= 1_000_000)
    return `${(num / 1_000_000).toFixed(2)}M`;
  if (Math.abs(num) >= 1_000)
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return num.toFixed(2);
}

function formatChange(change: number, trend: string) {
  if (!change || trend === 'stable') return { text: '—', cls: 'data-change-nil' };
  const sign = change > 0 ? '▲' : '▼';
  return {
    text: `${sign} ${Math.abs(change).toFixed(2)}`,
    cls: change > 0 ? 'data-change-pos' : 'data-change-neg',
  };
}

function formatDate(date?: string): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function IndicatorsPage() {
  const { indicators, error } = await loadIndicators();

  return (
    <>
      {/* Page header */}
      <div style={{ background: 'var(--ink)', borderBottom: '3px solid var(--accent)', padding: '40px 24px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
            Economic Indicators
          </p>
          <h1 className="font-display" style={{ fontSize: 42, fontWeight: 700, color: '#fff', lineHeight: 1.05, marginBottom: 12 }}>
            Global Macro Data
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15 }}>
            Live macroeconomic indicators from global data sources. Updated hourly.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {error && (
          <div style={{ background: 'var(--ink-mid)', border: '0.5px solid var(--ink-border)', borderLeft: '3px solid var(--negative)', padding: '14px 20px', marginBottom: 32, fontSize: 14, color: 'var(--text-secondary)' }}>
            Indicator data temporarily unavailable. Please check back shortly.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)' }}>
          {indicators.map((ind) => {
            const ch = formatChange(ind.change, ind.trend);
            return (
              <Link key={ind.id} href={`/indicators/${ind.slug}`} className="data-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
                  {ind.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <p className="data-number">{formatValue(ind.value, ind.unit)}</p>
                  <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: "'Space Mono', monospace" }}>{ind.unit}</span>
                </div>
                <p className={`font-mono-data ${ch.cls}`} style={{ fontSize: 13, marginBottom: 14 }}>
                  {ch.text} <span style={{ color: 'var(--muted)', fontSize: 11 }}>vs prior</span>
                </p>
                <p style={{ fontSize: 11, color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: 10, fontFamily: "'Space Mono', monospace" }}>
                  As of {formatDate(ind.date)}
                </p>
              </Link>
            );
          })}
          {indicators.length === 0 && !error && (
            <div style={{ gridColumn: '1/-1', padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
              Indicator data loading — please refresh in a moment.
            </div>
          )}
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: 'var(--muted)' }}>
          Data provided as-is for informational purposes only.
        </p>
      </div>
    </>
  );
}
