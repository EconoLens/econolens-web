import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 12_000;
const MAX_ITEMS_PER_FEED = 5;
const MAX_TOTAL_ITEMS = 30;

// Official government & institutional RSS feeds ONLY — no newspapers or media
const FEEDS = [
  // Central Banks
  { url: "https://www.federalreserve.gov/feeds/press_all.xml",       source: "US Federal Reserve",   category: "Central Bank" },
  { url: "https://www.ecb.europa.eu/rss/press.html",                 source: "European Central Bank", category: "Central Bank" },
  { url: "https://www.bankofengland.co.uk/rss/publications",         source: "Bank of England",       category: "Central Bank" },
  { url: "https://www.rba.gov.au/rss/rss-cb-communications.xml",     source: "Reserve Bank of Australia", category: "Central Bank" },
  // International Institutions
  { url: "https://www.imf.org/en/News/RSS?language=eng",             source: "IMF",                   category: "International Institution" },
  { url: "https://feeds.worldbank.org/worldbank/news",               source: "World Bank",            category: "International Institution" },
  { url: "https://news.un.org/feed/subscribe/en/news/topic/economic-development/feed/rss.xml", source: "United Nations", category: "International Institution" },
  { url: "https://www.wto.org/english/news_e/news_e.rss",            source: "WTO",                   category: "International Institution" },
  { url: "https://www.oecd.org/newsroom/rss/oecd-newsroom-rss.xml",  source: "OECD",                  category: "International Institution" },
  { url: "https://www.bis.org/doclist/rss/press_releases.htm",       source: "BIS",                   category: "International Institution" },
  // Government Press Releases
  { url: "https://www.gov.uk/search/news-and-communications.atom",   source: "UK Government",         category: "Government" },
  { url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",  source: "PIB India",             category: "Government" },
  { url: "https://www.whitehouse.gov/feed/",                         source: "White House",            category: "Government" },
  { url: "https://www.rbi.org.in/Scripts/RSSParser.aspx?Id=103",     source: "Reserve Bank of India", category: "Central Bank" },
];

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  category: string;
};

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = block.match(re);
  if (!match) return "";
  const raw = match[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  // Also handle Atom <link href="...">
  if (!match[1] && tag === "link") {
    const href = block.match(/<link[^>]+href=["']([^"']+)["']/i);
    return href ? href[1] : "";
  }
  return (cdata ? cdata[1] : raw).replace(/<[^>]*>/g, "").trim();
}

function extractLink(block: string): string {
  // Atom style: <link href="..." />
  const atom = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (atom) return atom[1];
  // RSS style: <link>url</link>
  const rss = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
  if (rss) {
    const raw = rss[1].trim();
    const cdata = raw.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
    return cdata ? cdata[1] : raw;
  }
  return "";
}

function extractPubDate(block: string): string {
  return (
    extractTag(block, "pubDate") ||
    extractTag(block, "published") ||
    extractTag(block, "updated") ||
    extractTag(block, "dc:date") ||
    ""
  );
}

function parseItems(xml: string, source: string, category: string): NewsItem[] {
  const items: NewsItem[] = [];
  // Try <item> (RSS) and <entry> (Atom)
  const itemRe = /<(?:item|entry)\b[^>]*>([\s\S]*?)<\/(?:item|entry)>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRe.exec(xml)) !== null && items.length < MAX_ITEMS_PER_FEED) {
    const block = match[1];
    const title = extractTag(block, "title");
    const link = extractLink(block);
    const pubDate = extractPubDate(block);
    const description =
      extractTag(block, "description") ||
      extractTag(block, "summary") ||
      extractTag(block, "content");
    if (title && link) {
      items.push({ title, link, pubDate, description, source, category });
    }
  }
  return items;
}

async function fetchFeed(feed: typeof FEEDS[0]): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "EconoLens/1.0 (https://www.econolens.co.in; press@econolens.co.in)",
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseItems(xml, feed.source, feed.category);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  try {
    // Fetch all feeds in parallel
    const results = await Promise.allSettled(FEEDS.map(fetchFeed));

    const allItems: NewsItem[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        allItems.push(...result.value);
      }
    }

    // Sort by date descending, take top MAX_TOTAL_ITEMS
    allItems.sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return db - da;
    });

    const items = allItems.slice(0, MAX_TOTAL_ITEMS);

    if (items.length === 0) {
      return NextResponse.json(
        { error: "No items returned from any official source" },
        { status: 503 },
      );
    }

    return NextResponse.json(items);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
