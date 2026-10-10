// Single source of truth for EconoLens's follow channels (KP decision 2026-10-10:
// no subscription plan; visitors are converted into WhatsApp / LinkedIn / Instagram
// followers instead). Every placement builds its link through `channelUrl` so GA4
// can attribute follows by placement via UTM tags.

export type ChannelId = 'whatsapp' | 'linkedin' | 'instagram'

export interface Channel {
  id: ChannelId
  label: string
  cta: string
  blurb: string
  url: string
}

export const CHANNELS: Channel[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    cta: 'Follow on WhatsApp',
    blurb: 'New analysis lands on your phone the moment it is published.',
    url: 'https://whatsapp.com/channel/0029Vb7hxHZK5cDCOXI4ff1p',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    cta: 'Follow on LinkedIn',
    blurb: 'Data-backed takes on the global economy in your professional feed.',
    url: 'https://www.linkedin.com/company/econolens',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    cta: 'Follow on Instagram',
    blurb: 'Charts and concepts explained in a single scroll.',
    url: 'https://www.instagram.com/econolens.sm',
  },
]

/** Appends UTM tags so each placement is measurable in the destination platform and GA4. */
export function channelUrl(channel: Channel, placement: string): string {
  const u = new URL(channel.url)
  u.searchParams.set('utm_source', 'econolens.co.in')
  u.searchParams.set('utm_medium', 'website')
  u.searchParams.set('utm_campaign', placement)
  return u.toString()
}
