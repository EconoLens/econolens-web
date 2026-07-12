import { NextResponse } from 'next/server'
import { getChannels } from '@/lib/buffer'

export async function GET() {
  try {
    const channels = await getChannels()
    return NextResponse.json({ ok: true, channels })
    } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message })
    }
  }
