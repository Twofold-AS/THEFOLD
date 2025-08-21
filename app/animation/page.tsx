'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { TWOFOLD_LOGO_PATH, TWOFOLD_LOGO_VIEWBOX } from '@/components/ui/logo/LogoPaths'

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ikke-null aliaser
    const canvasEl = canvas as HTMLCanvasElement
    const ctx2d = ctx as CanvasRenderingContext2D

    const updateCanvasSize = () => {
      canvasEl.width = window.innerWidth
      canvasEl.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }
    updateCanvasSize()

    type Particle = {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
      isAWS: boolean
    }

    let particles: Particle[] = []
    let textImageData: ImageData | null = null

    function createTextImage() {
      ctx2d.fillStyle = 'white'
      ctx2d.save()

      const logoHeight = isMobile ? 60 : 120
      const scale = logoHeight / TWOFOLD_LOGO_VIEWBOX.height
      const logoWidth = TWOFOLD_LOGO_VIEWBOX.width * scale

      // Sentrer
      ctx2d.translate(
        canvasEl.width / 2 - logoWidth / 2,
        canvasEl.height / 2 - logoHeight / 2
      )
      ctx2d.scale(scale, scale)

      // Tegn ALLE path-ene
      for (const d of TWOFOLD_LOGO_PATH) {
        const p = new Path2D(d)
        ctx2d.fill(p)
      }

      ctx2d.restore()

      textImageData = ctx2d.getImageData(0, 0, canvasEl.width, canvasEl.height)
      ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height)
      return scale
    }

    function createParticle(scale: number) {
      if (!textImageData) return null
      const data = textImageData.data

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvasEl.width)
        const y = Math.floor(Math.random() * canvasEl.height)

        if (data[(y * canvasEl.width + x) * 4 + 3] > 128) {
          return {
            x,
            y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1 + 0.5,
            color: 'white',
            scatteredColor: '#00DCFF', // velg valgfri “hover”-farge
            isAWS: false,              // beholder feltet for kompatibilitet
            life: Math.random() * 100 + 50,
          } as Particle
        }
      }
      return null
    }

    function createInitialParticles(scale: number) {
      const baseParticleCount = 7000
      const particleCount = Math.floor(
        baseParticleCount * Math.sqrt((canvasEl.width * canvasEl.height) / (1920 * 1080))
      )
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId = 0
    function animate(scale: number) {
      ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height)
      ctx2d.fillStyle = 'black'
      ctx2d.fillRect(0, 0, canvasEl.width, canvasEl.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 240

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && (isTouchingRef.current || !('ontouchstart' in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 60
          const moveY = Math.sin(angle) * force * 60
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY
          ctx2d.fillStyle = p.scatteredColor
        } else {
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY - p.y) * 0.1
          ctx2d.fillStyle = p.color
        }

        ctx2d.fillRect(p.x, p.y, p.size, p.size)

        p.life--
        if (p.life <= 0) {
          const np = createParticle(scale)
          if (np) {
            particles[i] = np
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      const baseParticleCount = 7000
      const targetParticleCount = Math.floor(
        baseParticleCount * Math.sqrt((canvasEl.width * canvasEl.height) / (1920 * 1080))
      )
      while (particles.length < targetParticleCount) {
        const np = createParticle(scale)
        if (np) particles.push(np)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    const scale = createTextImage()
    createInitialParticles(scale)
    animate(scale)

    const handleResize = () => {
      updateCanvasSize()
      const newScale = createTextImage()
      particles = []
      createInitialParticles(newScale)
    }

    const handleMove = (x: number, y: number) => { mousePositionRef.current = { x, y } }
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
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
  }, [isMobile])

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label="Interactive particle effect with custom logo"
      />
      {/* footer beholdt uendret */}
      <div className="absolute bottom-[100px] text-center z-10">
        <p className="font-mono text-gray-400 text-xs sm:text-base md:text-sm ">
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
