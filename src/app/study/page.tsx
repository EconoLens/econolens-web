import Link from 'next/link'
import type { Metadata } from 'next'

import FollowLinks from '@/components/FollowLinks'
import { getStudyGuides } from '@/lib/sanity'
import { TRACKS, GROUPS, START_HERE_ORDER, readingMinutes, type Cover, type Topic } from '@/lib/study'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'Study Economics — From First Principles to the Frontier',
  description:
    'Ten tracks of economics study guides: micro, macro, mathematical economics, econometrics, advanced theory, and the applied fields of international, health, agricultural and environmental economics. Built on real data.',
  alternates: { canonical: 'https://www.econolens.co.in/study' },
}

interface Guide {
  _id: string
  title: string
  slug: string
  summary?: string[]
  words?: number
}

function CoverArt({ cover, big = false }: { cover?: Cover; big?: boolean }) {
  if (cover?.kind === 'wave') {
    return (
      <svg width="220" height="70" viewBox="0 0 220 70" role="img" aria-label="Wave showing expansion, peak, contraction and trough">
        <path d="M0 50 C30 50 40 10 70 10 S110 60 140 60 S190 15 220 15" fill="none" stroke="var(--gold-light)" strokeWidth="2" />
      </svg>
    )
  }
  if (cover?.kind === 'cross') {
    return (
      <svg width="160" height="90" viewBox="0 0 160 90" role="img" aria-label="Supply and demand curves crossing">
        <path d="M10 10 L150 80" stroke="var(--gold-light)" strokeWidth="2" />
        <path d="M10 80 L150 10" stroke="var(--text-secondary)" strokeWidth="2" />
        <circle cx="80" cy="45" r="4" fill="var(--cream)" />
      </svg>
    )
  }
  return <span className={big ? 'sg-cover-text sg-cover-text--big' : 'sg-cover-text'}>{cover?.kind === 'text' ? cover.text : 'EconoLens Study'}</span>
}

function learnPoints(topic: Topic | undefined, guide: Guide): string[] {
  if (topic?.learn?.length) return topic.learn
  return (guide.summary || []).slice(0, 2)
}

function GuideCard({ guide, topic }: { guide: Guide; topic?: Topic }) {
  const minutes = readingMinutes(guide.words)
  return (
    <Link href={`/news/${guide.slug}`} className="sg-card">
      <div className="sg-cover"><CoverArt cover={topic?.cover} /></div>
      {topic?.caption && <span className="sg-cap">Fig. {topic.caption}</span>}
      <div className="sg-body">
        {topic && <span className="sg-kick">{topic.level}</span>}
        <h3 className="sg-q">{topic?.question || guide.title}</h3>
        {topic?.question && <p className="sg-dek">{guide.title}</p>}
        <ul className="sg-learn">
          {learnPoints(topic, guide).map((p) => <li key={p}>{p}</li>)}
        </ul>
        <div className="sg-foot">
          <span>{minutes ? `${minutes} min read` : 'Study guide'}</span>
          <b>Read →</b>
        </div>
      </div>
    </Link>
  )
}

export default async function StudyPage() {
  let guides: Guide[] = []
  try {
    const rows: any[] = (await getStudyGuides()) || []
    guides = rows.map((r) => ({
      ...r,
      words: [...(r.t1 || []), ...(r.t2 || []), ...(r.t3 || [])]
        .filter((t: unknown) => typeof t === 'string')
        .join(' ')
        .split(/\s+/)
        .filter(Boolean).length,
    }))
  } catch (err) {
    console.error('[study] getStudyGuides failed', err)
    guides = []
  }
  const bySlug = new Map(guides.map((g) => [g.slug, g]))
  const plannedSlugs = new Set(TRACKS.flatMap((t) => t.topics.map((x) => x.slug)))
  const topicBySlug = new Map(TRACKS.flatMap((t) => t.topics.map((x) => [x.slug, x] as const)))

  const featuredSlug = START_HERE_ORDER.find((s) => bySlug.has(s))
  const featured = featuredSlug ? bySlug.get(featuredSlug)! : undefined
  const featuredTopic = featuredSlug ? topicBySlug.get(featuredSlug) : undefined
  const extras = guides.filter((g) => !plannedSlugs.has(g.slug))

  const tracks = TRACKS.map((t) => ({
    ...t,
    live: t.topics.filter((x) => bySlug.has(x.slug) && x.slug !== featuredSlug),
    liveCount: t.topics.filter((x) => bySlug.has(x.slug)).length,
    upcoming: t.topics.filter((x) => !bySlug.has(x.slug)),
  }))

  return (
    <>
      {/* ── Header ── */}
      <section className="sg-header">
        <div className="sg-wrap">
          <p className="sg-kick sg-kick--wide">Study · Economics for a changing world</p>
          <h1 className="sg-h1">
            Learn the economics of a new age — <em>from first principles to the frontier.</em>
          </h1>
          <p className="sg-lede">
            Ten tracks, from the foundations of micro, macro and mathematical economics to the fields shaping this century: health, food and agriculture, and the environment. Every guide moves from intuition to the formal model to a worked example on real data.
          </p>
          <nav aria-label="Jump to a track" className="sg-jump">
            {tracks.map((t) => (
              <a key={t.id} href={`#${t.id}`} className={t.liveCount ? '' : 'is-soon'}>
                {t.title}{t.liveCount ? ` · ${t.liveCount}` : ''}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ── Start here ── */}
      <section style={{ paddingBottom: '72px' }}>
        <div className="sg-wrap">
          {featured ? (
            <Link href={`/news/${featured.slug}`} className="sg-feat">
              <div className="sg-feat-art">
                <CoverArt cover={featuredTopic?.cover} big />
                {featuredTopic?.caption && <span className="sg-cap" style={{ padding: 0 }}>Fig. 1 — {featuredTopic.caption}</span>}
              </div>
              <div className="sg-feat-body">
                <span className="sg-kick">Start here{featuredTopic ? ` · ${featuredTopic.level}` : ''}</span>
                <h2 className="sg-q sg-q--big">{featuredTopic?.question || featured.title}</h2>
                {featuredTopic?.question && <p className="sg-dek" style={{ fontSize: '1rem' }}>{featured.title}</p>}
                <ul className="sg-learn" style={{ fontSize: '0.9375rem' }}>
                  {learnPoints(featuredTopic, featured).map((p) => <li key={p}>{p}</li>)}
                </ul>
                <span className="sg-feat-cta">Read the guide →</span>
              </div>
            </Link>
          ) : (
            <div className="sg-empty">
              <p style={{ margin: 0, fontSize: '1.0625rem', color: 'var(--text-primary)' }}>
                The library is being rebuilt guide by guide in a fuller, data-rich format. New guides are released track by track.
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Follow EconoLens to read each guide the day it is released.</p>
              <FollowLinks placement="study_empty" variant="compact" />
            </div>
          )}
        </div>
      </section>

      {/* ── Tracks, in three groups ── */}
      {GROUPS.map((g) => (
        <div key={g.id}>
          <div className="sg-wrap sg-group">
            <span className="sg-kick">{g.title}</span>
            <p className="sg-group-blurb">{g.blurb}</p>
          </div>
      {tracks.filter((t) => t.group === g.id).map((t) => (
        <section key={t.id} id={t.id} style={{ scrollMarginTop: '80px' }}>
          <div className="sg-wrap sg-track">
            <header className="sg-track-head">
              <span className="sg-kick">Track {t.number}</span>
              <h2 className="sg-h2">{t.title}</h2>
              <p className="sg-dek" style={{ fontSize: '0.9375rem' }}>{t.blurb}</p>
              <span className="sg-count">
                {t.liveCount === 0 ? `${t.topics.length} topics · first guides in progress` : `${t.liveCount} of ${t.topics.length} guides live`}
              </span>
            </header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {t.live.length > 0 && (
                <div className="sg-cards">
                  {t.live.map((x) => <GuideCard key={x.slug} guide={bySlug.get(x.slug)!} topic={x} />)}
                </div>
              )}
              {t.upcoming.length > 0 && (
                <div>
                  <span className="sg-cap" style={{ padding: 0 }}>{t.liveCount ? 'Coming next in this track' : 'What this track covers'}</span>
                  <ul className="sg-next">
                    {t.upcoming.map((x) => <li key={x.slug}>{x.label}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
        </div>
      ))}

      {/* ── Guides not yet placed in a track ── */}
      {extras.length > 0 && (
        <section>
          <div className="sg-wrap sg-track">
            <header className="sg-track-head">
              <span className="sg-kick">More</span>
              <h2 className="sg-h2">More guides</h2>
            </header>
            <div className="sg-cards">
              {extras.map((g) => <GuideCard key={g._id} guide={g} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Follow ── */}
      <section style={{ padding: '24px 0 96px' }}>
        <div className="sg-wrap">
          <div className="sg-follow">
            <div style={{ maxWidth: '560px' }}>
              <h2 className="sg-h2" style={{ fontSize: '2rem', marginBottom: '10px' }}>Be the first to read each new guide</h2>
              <p className="sg-dek" style={{ fontSize: '0.9375rem' }}>Every guide is shared on our channels the day it is released.</p>
            </div>
            <FollowLinks placement="study_page" variant="compact" />
          </div>
        </div>
      </section>
    </>
  )
}
