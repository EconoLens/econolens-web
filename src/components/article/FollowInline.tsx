import FollowLinks from '@/components/FollowLinks'

// Mid-article prompt. Replaces NewsletterInline (2026-10-10): the newsletter form
// collected emails but nothing was ever sent to them, so asking for an address
// promised something we could not deliver. Following a channel is the honest ask.
export default function FollowInline() {
  return (
    <aside
      aria-label="Follow EconoLens"
      style={{ margin: '28px 0', padding: '18px 20px', border: '0.5px solid var(--ink-border)', borderLeft: '3px solid var(--gold)', background: 'var(--ink-mid)' }}
    >
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.5 }}>
        Get the next analysis the moment it is published.
      </p>
      <FollowLinks placement="article_inline" variant="compact" />
    </aside>
  )
}
