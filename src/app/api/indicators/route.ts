import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;

type Indicator = {
  id: string;
  seriesId: string;
  name: string;
  unit: string;
  description: string;
};

const INDICATORS: Indicator[] = [
  {
    id: "india-gdp",
    seriesId: "NYGDPMKTPCDINA",
    name: "India GDP",
    unit: "USD",
    description: "Gross Domestic Product, current USD",
  },
  {
    id: "india-cpi",
    seriesId: "INDCPIALLMINMEI",
    name: "India CPI",
    unit: "Index",
    description: "Consumer Price Index, all items",
  },
  {
    id: "india-policy-rate",
    seriesId: "INDIRSTCB01STM",
    name: "RBI Policy Rate",
    unit: "%",
    description: "Central bank policy rate, monthly",
  },
  {
    id: "india-unemployment",
    seriesId: "SLUEM1524ZSIND",
    name: "Youth Unemployment",
    unit: "%",
    description: "Unemployment rate, ages 15-24",
  },
  {
    id: "usd-inr",
    seriesId: "DEXINUS",
    name: "USD / INR",
    unit: "INR per USD",
    description: "Daily exchange rate",
  },
  {
    id: "wti-crude",
    seriesId: "DCOILWTICO",
    name: "WTI Crude Oil",
    unit: "USD / barrel",
    description: "Spot price, daily",
  },
];

type FredResponse = {
  observations?: Array<{ date: string; value: string }>;
  error_message?: string;
};

async function fetchSeries(seriesId: string, apiKey: string) {
  const url = new URL("https://api.stlouisfed.org/fred/series/observations");
  url.searchParams.set("series_id", seriesId);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("file_type", "json");
  url.searchParams.set("sort_order", "desc");
  url.searchParams.set("limit", "2");

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    return { value: null, previous: null, date: null, error: `HTTP ${res.status}` };
  }
  const data = (await res.json()) as FredResponse;
  const obs = (data.observations ?? []).filter((o) => o.value && o.value !== ".");
  const latest = obs[0];
  const prior = obs[1];

  return {
    value: latest ? Number(latest.value) : null,
    previous: prior ? Number(prior.value) : null,
    date: latest?.date ?? null,
    error: data.error_message ?? null,
  };
}

export async function GET() {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "FRED_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const results = await Promise.all(
      INDICATORS.map(async (ind) => {
        const data = await fetchSeries(ind.seriesId, apiKey);
        return { ...ind, ...data };
      }),
    );
    return NextResponse.json({ indicators: results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
