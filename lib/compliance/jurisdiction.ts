/**
 * lib/compliance/jurisdiction.ts
 * Jurisdiction detection and compliance routing for EconoLens.
 * Reads Cloudflare CF-IPCountry header to determine applicable legal regime.
 */

export type Jurisdiction = "gdpr" | "ccpa" | "dpdpa" | "standard";

// EU member state ISO-3166-1 alpha-2 codes
export const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA additions
  "IS", "LI", "NO",
  // UK — post-Brexit but UK GDPR is functionally equivalent
  "GB",
]);

/**
 * Determine the applicable legal jurisdiction from a country code.
 * @param countryCode ISO-3166-1 alpha-2 country code (from CF-IPCountry header)
 * @returns The applicable jurisdiction string
 */
export function getJurisdiction(countryCode: string | null): Jurisdiction {
  if (!countryCode) return "standard";

  const code = countryCode.toUpperCase();

  if (EU_COUNTRIES.has(code)) return "gdpr";
  if (code === "US-CA" || code === "CA") {
    // Cloudflare sends "US" for all US states; California detection requires
    // additional signals. Default US to CCPA-aware standard for safety.
    return "ccpa";
  }
  if (code === "IN") return "dpdpa";

  return "standard";
}

/**
 * Service route prefixes that are controlled by kill switches.
 * Maps env Variable name → route prefix(es) guarded by that switch.
 */
export const SERVICE_ROUTES: Record<string, string[]> = {
  COMMUNITY_LIVE: ["/community"],
  AI_TOOL_LIVE: ["/research", "/ai-tool"],
  NEWS_PIPELINE_LIVE: ["/news", "/latest"],
  DECODING_LIVE: ["/decoding"],
  NEWSLETTER_LIVE: ["/newsletter"],
};

/**
 * Check if a given pathname is guarded by a kill switch that is currently OFF.
 * @param pathname The request pathname
 * @returns The env var name of the switch that is blocking it, or null if live
 */
export function getBlockingSwitch(pathname: string): string | null {
  for (const [envKey, prefixes] of Object.entries(SERVICE_ROUTES)) {
    for (const prefix of prefixes) {
      if (pathname.startsWith(prefix)) {
        const switchValue = process.env[envKey];
        if (switchValue !== "true") {
          return envKey;
        }
      }
    }
  }
  return null;
}
