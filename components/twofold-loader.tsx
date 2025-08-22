'use client'

import React, { useRef, useEffect, useState } from 'react'
import { TWOFOLD_LOGO_PATH, TWOFOLD_LOGO_VIEWBOX } from '@/components/ui/logo/LogoPaths'

type Props = {
  pattern?: 'orbit' | 'figure8' | 'scan' | 'noise' | 'bursts'
  autoStopAfterMs?: number // 0 = aldri stopp (Next unmount'er selv når siden er klar)
  speedRps?: number        // runder per sekund for "spinneren"
  brandColor?: string      // farge når partiklene "aktiveres"
}

export default function TwofoldParticleLoader({
  pattern = 'figure8',   // <- velg standard
  autoStopAfterMs = 0,
  speedRps = 0.6,
  brandColor = '#00DCFF',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  // “usynlig mus” i sirkel
  const simulateRef = useRef(true)
  const simStartRef = useRef(0)
  const logoDimsRef = useRef({ width: 0, height: 0 })
  const centerRef = useRef({ x: 0, y: 0 })

  // 🆕 for 'bursts'
  const simPointerRef = useRef({ x: 0, y: 0 })
  const burstTargetRef = useRef({ x: 0, y: 0 })
  const lastSwitchRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const canvasEl = canvas as HTMLCanvasElement
    const ctx2d = ctx as CanvasRenderingContext2D

    const updateCanvasSize = () => {
      canvasEl.width = window.innerWidth
      canvasEl.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }
    updateCanvasSize()

    type Particle = {
      x: number; y: number; baseX: number; baseY: number
      size: number; color: string; scatteredColor: string
      life: number; isAWS: boolean
    }

    let particles: Particle[] = []
    let textImageData: ImageData | null = null
    let animationFrameId = 0

    function pickPoint() {
      const { width, height } = logoDimsRef.current
      const { x: cx, y: cy } = centerRef.current
      const angle = Math.random() * Math.PI * 2
      const R = Math.max(width, height) / 2 + 50 + Math.random() * 80
      return { x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R }
    }

    function createTextImage() {
      ctx2d.fillStyle = 'white'
      ctx2d.save()

      const logoHeight = isMobile ? 60 : 120
      const scale = logoHeight / TWOFOLD_LOGO_VIEWBOX.height
      const logoWidth = TWOFOLD_LOGO_VIEWBOX.width * scale

      // sentrer logoen
      ctx2d.translate(
        canvasEl.width / 2 - logoWidth / 2,
        canvasEl.height / 2 - logoHeight / 2
      )
      ctx2d.scale(scale, scale)

      for (const d of TWOFOLD_LOGO_PATH) {
        const p = new Path2D(d)
        ctx2d.fill(p)
      }

      // lagre senter/dimensjoner for spinner-bane
      logoDimsRef.current = { width: logoWidth, height: logoHeight }
      centerRef.current = { x: canvasEl.width / 2, y: canvasEl.height / 2 }

      simPointerRef.current = { x: centerRef.current.x, y: centerRef.current.y }
      burstTargetRef.current = pickPoint()
      lastSwitchRef.current = performance.now()

      ctx2d.restore()

      textImageData = ctx2d.getImageData(0, 0, canvasEl.width, canvasEl.height)
      ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height)
      return scale
    }

    function createParticle() {
      if (!textImageData) return null
      const data = textImageData.data

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvasEl.width)
        const y = Math.floor(Math.random() * canvasEl.height)
        if (data[(y * canvasEl.width + x) * 4 + 3] > 128) {
          return {
            x, y, baseX: x, baseY: y,
            size: Math.random() * 1 + 0.5,
            color: 'white',
            scatteredColor: brandColor,
            isAWS: false,
            life: Math.random() * 100 + 50,
          } as Particle
        }
      }
      return null
    }

    function createInitialParticles() {
      const base = 7000
      const count = Math.floor(base * Math.sqrt((canvasEl.width * canvasEl.height) / (1920 * 1080)))
      for (let i = 0; i < count; i++) {
        const p = createParticle()
        if (p) particles.push(p)
      }
    }

    function animate() {
      ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height)
      ctx2d.fillStyle = 'black'
      ctx2d.fillRect(0, 0, canvasEl.width, canvasEl.height)

let pointerX = mousePositionRef.current.x
let pointerY = mousePositionRef.current.y

if (simulateRef.current) {
const t = (performance.now() - simStartRef.current) / 1000
const { width, height } = logoDimsRef.current

// midtpunkt for animasjonen
let cx = centerRef.current.x
let cy = centerRef.current.y

// ⬇️ flytt "pointer-midtpunktet" nedover:
// bruk én av disse:
// 1) fast piksel-offset:
const offsetYpx = 0   // f.eks. 80px ned
// 2) relativt til logoens høyde:
const offsetYrel = height * 0.25 // 25% av logo-høyden

cy += offsetYpx // eller: cy += offsetYrel

const A = width
const B = height * 0.4


  switch (pattern) {
    case 'scan': {
  // Triangelbølge 0..1..0
  const tri = (x: number) => 2 * Math.abs(((x % 1) + 1) % 1 - 0.5)

  // Tweaks (juster tallene under):
  const speedMul = 0.30     // < 1 => tregere scanning (0.45 = 45% av speedRps)
  const widthMul = 0.7      // < 1 => smalere skan (60% av A)
  const jitterAmpMul = 0.15 // < 0.15 => mindre vertikal “vibrering”
  const jitterFreqMul = 0.1 // < 1 => saktere vertikal “vibrering”

  const scanW = A * widthMul
  const u = tri(t * speedRps * speedMul)

  pointerX = cx - scanW / 2 + u * scanW
  pointerY = cy + Math.sin(t * 2 * Math.PI * speedRps * jitterFreqMul) * (B * jitterAmpMul)
  break
    }
    case 'figure8': {
      pointerX = cx + A * Math.sin(t * 2 * Math.PI * speedRps)
      pointerY = cy + B * Math.sin(t * 4 * Math.PI * speedRps + Math.PI / 2)
      break
    }
    case 'noise': {
      // Kombinert sin-cos for organisk “drift”
      const nx = Math.sin(t * 1.73) + 0.5 * Math.sin(t * 0.47 + 1.2)
      const ny = Math.sin(t * 1.11 + 0.7) + 0.5 * Math.sin(t * 0.31 + 0.2)
      pointerX = cx + (A * 0.45) * nx
      pointerY = cy + (B * 0.45) * ny
      break
    }
    case 'bursts': {
      const now = performance.now()
      if (now - lastSwitchRef.current > 650) {
        burstTargetRef.current = pickPoint()
        lastSwitchRef.current = now
      }
      // myk følger mot neste burst-mål
      const ease = 0.18
      simPointerRef.current.x += (burstTargetRef.current.x - simPointerRef.current.x) * ease
      simPointerRef.current.y += (burstTargetRef.current.y - simPointerRef.current.y) * ease
      pointerX = simPointerRef.current.x
      pointerY = simPointerRef.current.y
      break
    }
    default: { // 'orbit'
      const R = Math.max(width, height) / 2 + 60
      pointerX = cx + Math.cos(t * 2 * Math.PI * speedRps) * R
      pointerY = cy + Math.sin(t * 2 * Math.PI * speedRps) * R
    }
  }
}

      const maxDistance = 240
      const active = simulateRef.current || isTouchingRef.current || !('ontouchstart' in window)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = pointerX - p.x
        const dy = pointerY - p.y
        const distance = Math.hypot(dx, dy)

        if (distance < maxDistance && active) {
          const force = (maxDistance - distance) / maxDistance
          const ang = Math.atan2(dy, dx)
          const moveX = Math.cos(ang) * force * 60
          const moveY = Math.sin(ang) * force * 60
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY
          ctx2d.fillStyle = p.scatteredColor
        } else {
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY - p.y) * 0.1
          ctx2d.fillStyle = p.color
        }

        ctx2d.fillRect(p.x, p.y, p.size, p.size)

        if (--p.life <= 0) {
          const np = createParticle()
          if (np) particles[i] = np
          else { particles.splice(i, 1); i-- }
        }
      }

      // topp opp
      const base = 7000
      const target = Math.floor(base * Math.sqrt((canvasEl.width * canvasEl.height) / (1920 * 1080)))
      while (particles.length < target) {
        const np = createParticle()
        if (np) particles.push(np)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const scale = createTextImage()
    simStartRef.current = performance.now()
    createInitialParticles()
    animate()

    const handleResize = () => {
      updateCanvasSize()
      createTextImage()
      particles = []
      createInitialParticles()
    }

    const handleMove = (x: number, y: number) => { mousePositionRef.current = { x, y } }
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY) }
    }
    const handleTouchStart = () => { isTouchingRef.current = true }
    const handleTouchEnd = () => { isTouchingRef.current = false; mousePositionRef.current = { x: 0, y: 0 } }
    const handleMouseLeave = () => { if (!('ontouchstart' in window)) mousePositionRef.current = { x: 0, y: 0 } }

    window.addEventListener('resize', handleResize)
    canvasEl.addEventListener('mousemove', handleMouseMove)
    canvasEl.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvasEl.addEventListener('mouseleave', handleMouseLeave)
    canvasEl.addEventListener('touchstart', handleTouchStart)
    canvasEl.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvasEl.removeEventListener('mousemove', handleMouseMove)
      canvasEl.removeEventListener('touchmove', handleTouchMove)
      canvasEl.removeEventListener('mouseleave', handleMouseLeave)
      canvasEl.removeEventListener('touchstart', handleTouchStart)
      canvasEl.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile, brandColor, speedRps])

  // Valgfritt: auto-stopp simulering etter X ms (ikke nødvendig i loading.tsx)
  useEffect(() => {
    if (autoStopAfterMs > 0) {
      const id = setTimeout(() => { simulateRef.current = false }, autoStopAfterMs)
      return () => clearTimeout(id)
    }
  }, [autoStopAfterMs])

  return (
    <div className="relative w-full h-dvh bg-black">
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 touch-none" />
    </div>
  )
}
