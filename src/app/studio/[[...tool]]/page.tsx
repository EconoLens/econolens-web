'use client'

import dynamic from 'next/dynamic'
import config from '../../../../sanity.config'

const Studio = dynamic(
  () => import('sanity').then((mod) => mod.Studio),
  {
    ssr: false,
    loading: () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#666' }}>
        Loading EconoLens Studio...
      </div>
    ),
  }
)

export default function StudioPage() {
  return (
    <div style={{ height: '100vh' }}>
      <Studio config={config} />
    </div>
  )
}
