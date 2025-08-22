'use client'

import React, { useRef, useEffect, useState } from 'react'
import { TWOFOLD_LOGO_PATH, TWOFOLD_LOGO_VIEWBOX } from '@/components/ui/logo/LogoPaths'

type Props = {
  pattern?: 'orbit' | 'figure8' | 'scan' | 'noise' | 'bursts'
  autoStopAfterMs?: number
  speedRps?: number
  brandColor?: string
}

export default function TwofoldParticleLoader({
  pattern = 'figure8',
  autoStopAfterMs = 0,
  speedRps = 0.6,
  brandColor = '#00DCFF',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // CSS-størrelse (i layoutpx) + DPR
  const cssSizeRef = useRef({ w: 0, h: 0 })
  const dprRef = useRef(1)

  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  // simulert “peker”
  const simulateRef = useRef(true)
  const simStartRef = useRef(0)
  const logoDimsRef = useRef({ width: 0, height: 0 })
  const centerRef = useRef({ x: 0, y: 0 })

  // for 'bursts'
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
      // Mål faktisk størrelse i layout (tåler iOS safe areas)
      const rect = canvasEl.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width))
      const h = Math.max(1, Math.round(rect.height))
      cssSizeRef.current = { w, h }

      // DPR-skalering for skarphet
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      dprRef.current = dpr
      canvasEl.width = Math.floor(w * dpr)
      canvasEl.height = Math.floor(h * dpr)

      // 1 css-px = 1 enhet
      // @ts-ignore
      ctx2d.resetTransform?.()
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx2d.imageSmoothingEnabled = false

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
      const { w, h } = cssSizeRef.current

      ctx2d.fillStyle = 'white'
      ctx2d.save()

      // responsiv høyde
      const shortSide = Math.min(w, h)
      const mobilePct = 0.1
      const desktopPct = 0.12
      let logoHeight = isMobile
        ? Math.max(96, Math.round(shortSide * mobilePct))
        : Math.round(shortSide * desktopPct)
      logoHeight = Math.min(logoHeight, Math.round(h * 0.6))

      const scale = logoHeight / TWOFOLD_LOGO_VIEWBOX.height
      const logoWidth = TWOFOLD_LOGO_VIEWBOX.width * scale

      // sentrer i CSS-px
      ctx2d.translate(w / 2 - logoWidth / 2, h / 2 - logoHeight / 2)
      ctx2d.scale(scale, scale)

      // tegn pathene (TWOFOLD_LOGO_PATH må være string[])
      for (const d of TWOFOLD_LOGO_PATH) {
        ctx2d.fill(new Path2D(d))
      }

      // lagre senter/dimensjoner
      logoDimsRef.current = { width: logoWidth, height: logoHeight }
      centerRef.current = { x: w / 2, y: h / 2 }

      // init for 'bursts'
      simPointerRef.current = { x: centerRef.current.x, y: centerRef.current.y }
      burstTargetRef.current = pickPoint()
      lastSwitchRef.current = performance.now()

      ctx2d.restore()

      // ⬇️ CSS-px (ikke canvasEl.width/height)
      textImageData = ctx2d.getImageData(0, 0, w, h)
      ctx2d.clearRect(0, 0, w, h)
    }

    function createParticle() {
      if (!textImageData) return null
      const { w, h } = cssSizeRef.current
      const data = textImageData.data

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * w)
        const y = Math.floor(Math.random() * h)
        if (data[(y * w + x) * 4 + 3] > 128) {
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
      const { w, h } = cssSizeRef.current
      const base = 7000
      const count = Math.floor(base * Math.sqrt((w * h) / (1920 * 1080)))
      for (let i = 0; i < count; i++) {
        const p = createParticle()
        if (p) particles.push(p)
      }
    }

    function animate() {
      const { w, h } = cssSizeRef.current
      ctx2d.clearRect(0, 0, w, h)
      ctx2d.fillStyle = 'black'
      ctx2d.fillRect(0, 0, w, h)

      let pointerX = mousePositionRef.current.x
      let pointerY = mousePositionRef.current.y

      if (simulateRef.current) {
        const t = (performance.now() - simStartRef.current) / 1000
        const { width, height } = logoDimsRef.current

        let cx = centerRef.current.x
        let cy = centerRef.current.y

        // vertikal offset for “scan”
        const offsetYpx = 90
        cy += offsetYpx

        const A = width * 0.6
        const B = height * 0.4

        switch (pattern) {
          case 'scan': {
            // Triangelbølge 0..1..0 (glatt scanning)
            const tri = (x: number) => 2 * Math.abs(((x % 1) + 1) % 1 - 0.5)
            const speedMul = 0.45
            const widthMul = 0.6
            const jitterAmpMul = 0.08
            const jitterFreqMul = 0.6

            const scanW = A * widthMul
            const s = tri(t * speedRps * speedMul)
            const u = s * s * (3 - 2 * s) // smoothstep for myke ender

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
            const ease = 0.18
            simPointerRef.current.x += (burstTargetRef.current.x - simPointerRef.current.x) * ease
            simPointerRef.current.y += (burstTargetRef.current.y - simPointerRef.current.y) * ease
            pointerX = simPointerRef.current.x
            pointerY = simPointerRef.current.y
            break
          }
          default: { // orbit
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

      // topp opp (bruk CSS-px)
      const base = 7000
      const target = Math.floor(base * Math.sqrt((w * h) / (1920 * 1080)))
      while (particles.length < target) {
        const np = createParticle()
        if (np) particles.push(np)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // init
    createTextImage()
    simStartRef.current = performance.now()
    createInitialParticles()
    animate()

    // events
    const handleResize = () => {
      updateCanvasSize()
      createTextImage()
      particles = []
      createInitialParticles()
      // ekstra pass for iOS rotate
      setTimeout(() => {
        updateCanvasSize()
        createTextImage()
        particles = []
        createInitialParticles()
      }, 120)
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
  }, [isMobile, brandColor, speedRps, pattern])

  // valgfritt: auto-stopp simulert peker
  useEffect(() => {
    if (autoStopAfterMs > 0) {
      const id = setTimeout(() => { simulateRef.current = false }, autoStopAfterMs)
      return () => clearTimeout(id)
    }
  }, [autoStopAfterMs])

  return (
    // fyll hele området – tryggere enn h-dvh på iOS
    <div className="absolute inset-0 bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none pointer-events-none" />
    </div>
  )
}
