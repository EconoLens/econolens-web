/**
 * EconoLens — Buffer API client
 *
 * Buffer's GraphQL API (https://api.buffer.com). Verified against
 * https://developers.buffer.com (Quick Start / Your First Post / Hosting Media)
 * on 2026-07-08. Requires BUFFER_ACCESS_TOKEN — generate at
 * https://publish.buffer.com/settings/api (an "EconoLens" key already exists
 * there, created 2026-05-30 — copy its value into Vercel env vars).
 *
 * Free plan limits: 3 connected channels, 10 queued posts per channel,
 * 100 requests / 15 min, 250 / 24h, 3,000 / 30 days. Plenty for a
 * few-articles-a-week publishing cadence.
 */

const BUFFER_API_URL = 'https://api.buffer.com'

type BufferChannel = {
  id: string
  name: string
  service: string // e.g. "instagram", "linkedin", "twitter"
}

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string }[]
}

async function bufferRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const token = process.env.BUFFER_ACCESS_TOKEN
  if (!token) {
    throw new Error('BUFFER_ACCESS_TOKEN is not configured')
  }

  const res = await fetch(BUFFER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  })

  const json = (await res.json()) as GraphQLResponse<T>

  if (json.errors?.length) {
    throw new Error(`Buffer API error: ${json.errors.map((e) => e.message).join('; ')}`)
  }
  if (!json.data) {
    throw new Error('Buffer API returned no data')
  }

  return json.data
}

// ─── ORGANIZATION + CHANNELS ────────────────────────────────────────────────

async function getOrganizationId(): Promise<string> {
  const data = await bufferRequest<{
    account: { organizations: { id: string; name: string }[] }
  }>(
    `query GetOrganizations {
      account { organizations { id name } }
    }`,
    {},
  )

  const org = data.account.organizations[0]
  if (!org) throw new Error('No Buffer organization found for this API key')
  return org.id
}

/**
 * Fetch all connected channels for the account. Cache the result yourself
 * if calling this often — it's a network round trip every time.
 */
export async function getChannels(): Promise<BufferChannel[]> {
  const organizationId = await getOrganizationId()

  const data = await bufferRequest<{ channels: BufferChannel[] }>(
    `query GetChannels($organizationId: String!) {
      channels(input: { organizationId: $organizationId }) {
        id
        name
        service
      }
    }`,
    { organizationId },
  )

  return data.channels
}

/**
 * Look up a connected channel's ID by service name (e.g. "instagram",
 * "linkedin", "twitter"). Returns null if that platform isn't connected
 * in Buffer yet.
 */
export async function getChannelIdByService(service: string): Promise<string | null> {
  const channels = await getChannels()
  const match = channels.find((c) => c.service.toLowerCase() === service.toLowerCase())
  return match?.id ?? null
}

// ─── POST CREATION ───────────────────────────────────────────────────────────

type CreatePostInput = {
  channelId: string
  text: string
  /** Publicly reachable, permanent, non-expiring image URL (Sanity CDN URLs work). */
  imageUrl?: string
  /** ISO 8601 UTC datetime. Omit to add to the next open queue slot instead. */
  dueAt?: string
}

type CreatePostResult =
  | { ok: true; postId: string; dueAt: string }
  | { ok: false; error: string }

/**
 * Create (queue or schedule) a post on a single Buffer-connected channel.
 * Call once per platform you want to post to (Instagram, LinkedIn, etc.)
 * — Buffer has no single "post everywhere" mutation, one createPost per channel.
 */
export async function createPost(input: CreatePostInput): Promise<CreatePostResult> {
  const query = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess {
          post { id text dueAt }
        }
        ... on MutationError {
          message
        }
      }
    }
  `

  const variables = {
    input: {
      text: input.text,
      channelId: input.channelId,
      schedulingType: 'automatic',
      mode: input.dueAt ? 'customScheduled' : 'addToQueue',
      ...(input.dueAt ? { dueAt: input.dueAt } : {}),
      ...(input.imageUrl
        ? { assets: [{ image: { url: input.imageUrl } }] }
        : {}),
    },
  }

  const data = await bufferRequest<{
    createPost: { post?: { id: string; dueAt: string }; message?: string }
  }>(query, variables)

  if (data.createPost.message) {
    return { ok: false, error: data.createPost.message }
  }
  if (!data.createPost.post) {
    return { ok: false, error: 'Buffer returned no post and no error — unexpected response shape' }
  }

  return { ok: true, postId: data.createPost.post.id, dueAt: data.createPost.post.dueAt }
}

/**
 * Post the same article to every connected channel whose service name is
 * in `services` (defaults to Instagram + LinkedIn — the two that are
 * genuinely free to automate; X/Twitter is deliberately excluded here
 * because X now charges per post at the API level — add "twitter" only
 * once that's a cost you've decided to accept).
 */
export async function postArticleToBuffer(article: {
  title: string
  url: string
  imageUrl?: string
}, services: string[] = ['instagram', 'linkedin']): Promise<Record<string, CreatePostResult | { ok: false; error: string }>> {
  const channels = await getChannels()
  const results: Record<string, CreatePostResult | { ok: false; error: string }> = {}

  for (const service of services) {
    const channel = channels.find((c) => c.service.toLowerCase() === service.toLowerCase())
    if (!channel) {
      results[service] = { ok: false, error: `No ${service} channel connected in Buffer` }
      continue
    }

    results[service] = await createPost({
      channelId: channel.id,
      text: `${article.title}\n\nRead the full analysis: ${article.url}`,
      imageUrl: article.imageUrl,
    })
  }

  return results
}
