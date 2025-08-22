'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import TwofoldParticleLoader from '@/components/twofold-loader'
import clsx from 'clsx'

type Props = {
  pattern?: 'orbit' | 'figure8' | 'scan' | 'noise' | 'bursts'
  minimumMs?: number
  fadeMs?: number
  brandColor?: string
  speedRps?: number
  /** true = blokker klikk/scroll mens loader vises. false = la siden under være scrollbar. */
  blockInteractions?: boolean
}

export default function LoaderOverlay({
  pattern = 'figure8',
  minimumMs = 900,
  fadeMs = 400,
  brandColor = '#00DCFF',
  speedRps = 0.6,
  blockInteractions = false, // <- default: ikke blokkér
}: Props) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const [opaque, setOpaque] = useState(true)
  const timersRef = useRef<number[]>([])
  const active = visible && opaque // aktiv visning (før fade/av)

  const showThenHide = () => {
    // vis
    setVisible(true)
    setOpaque(true)

    const t1 = window.setTimeout(() => setOpaque(false), minimumMs)
    const t2 = window.setTimeout(() => setVisible(false), minimumMs + fadeMs)
    timersRef.current.push(t1, t2)
  }

  // Første last (refresh)
  useEffect(() => {
    showThenHide()
    return () => {
      timersRef.current.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-trigger på client-side navigasjon
  useEffect(() => {
    if (pathname === undefined) return
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setVisible(true)
    setOpaque(true)
    showThenHide()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // 🔒 Scroll-lås kun når aktiv OG du ønsker å blokkere interaksjoner
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const lock = () => { root.classList.add('overflow-hidden'); body.classList.add('overflow-hidden') }
    const unlock = () => { root.classList.remove('overflow-hidden'); body.classList.remove('overflow-hidden') }

    if (active && blockInteractions) lock()
    else unlock()

    return unlock
  }, [active, blockInteractions])

  if (!visible) return null

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[100] transition-opacity bg-black', // ⬅️ la overlayen selv ha svart bakgrunn
        opaque ? 'opacity-100' : 'opacity-0',
        // ⬇️ La interaksjoner boble gjennom by default:
        blockInteractions ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      style={{ transitionDuration: `${fadeMs}ms` }}
      aria-hidden // ren visuell overlay
    >
      <TwofoldParticleLoader
        pattern={pattern}
        autoStopAfterMs={0}
        brandColor={brandColor}
        speedRps={speedRps}
      />
      {/* footer beholdt uendret */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
            <p className="text-center font-mono text-gray-400 text-xs sm:text-base md:text-sm">
          Join the{' '}
          <a
            href="https://vercel.fyi/v0-reinvent"
            target="_blank"
            className="invite-link text-gray-300 hover:text-cyan-400 transition-colors duration-300"
          >
            v0 Happy Hour
          </a>{' '}
          <span>at</span>
          <span className="transition-colors duration-300">
            {' '}aws re:invent
          </span>{' '}
          <br />
          <a
            href="https://v0.dev/chat/RqstUbkUVcB?b=b_BoU5qmQ0ehp"
            className="text-gray-500 text-xs mt-2.5 inline-block"
            target="_blank"
          >
            (fork this v0)
          </a>
          <style>{`
            a.invite-link:hover + span + span { color: #FF9900; }
          `}</style>
        </p>
        </div>
    </div>
  )
}
