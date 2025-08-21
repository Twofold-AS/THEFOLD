import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import DotGridShader from "@/components/DotGridShader"
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";

import ProjectCard from "@/components/project-card"
import AnimatedHeading from "@/components/animated-heading"
import RevealOnView from "@/components/reveal-on-view"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Logo from "@/components/ui/logo/Logo"

export default function Page() {
  const projects = [
    {
      title: "The total solution for Yamaha",
      subtitle: "AI-powered booking solution",
      imageSrc: "/images/yamaha.png",
      tags: ["AI", "Booking", "UI/UX"],
      href: "#project-1",
      priority: true,
    },
    {
      title: "Nimbus — SaaS analytics",
      subtitle: "Design system & web app",
      imageSrc: "/images/project-2.webp",
      tags: ["SaaS", "Design System", "Web"],
      href: "#project-2",
      priority: false,
    },
    {
      title: "Arcade — E‑commerce for streetwear",
      subtitle: "Mobile‑first storefront",
      imageSrc: "/images/project-3.webp",
      tags: ["Commerce", "Mobile", "Brand"],
      href: "#project-3",
      priority: false,
    },
    {
      title: "CareConnect — Patient portal",
      subtitle: "Accessibility‑first UI",
      imageSrc: "/images/project-4.webp",
      tags: ["A11y", "Web App", "Health"],
      href: "#project-4",
      priority: false,
    },
    {
      title: "Aurora — Creative portfolio",
      subtitle: "Motion & interaction design",
      imageSrc: "/images/project-5.webp",
      tags: ["Portfolio", "Animation", "UI/UX"],
      href: "#project-5",
      priority: false,
    },
    {
      title: "Hydra — AI assistant",
      subtitle: "Conversational product UX",
      imageSrc: "/images/project-6.webp",
      tags: ["AI", "SaaS", "Product"],
      href: "#project-6",
      priority: false,
    },
  ]

  return (
    <main className="bg-neutral-950 text-white">
      {/* HERO: full-viewport row. Left is sticky; right scrolls internally. */}
      <section className="px-4 pt-4 pb-16 lg:pb-4">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
          {/* LEFT: sticky and full height, no cut off */}
          <aside className="lg:sticky lg:top-4 lg:h-[calc(100svh-2rem)]">
            <RevealOnView
              as="div"
              intensity="hero"
              className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 p-6 sm:p-8"
              staggerChildren
            >
              {/* Texture background */}
              <div className="pointer-events-none absolute inset-0 opacity-5 mix-blend-soft-light">
                <StarsBackground className="absolute inset-0 flex items-center justify-center rounded-xl" />
              </div>
              <div>
                {/* Wordmark */}
                <div className="mb-8 flex items-center gap-2">
                  <Logo/>
                </div>

                {/* Headline with intro blur effect */}
                <AnimatedHeading
                  className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl"
                  lines={["Innovation, seen twofold"]}
                />

                <p className="mt-4 max-w-[42ch] text-lg text-white/70">
                  We design AI-driven solutions that shape tomorrow — bridging creativity and technology to unlock new possibilities.
                </p>

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                {/* Pop-up */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="rounded-full cursor-pointer">Let's talk<ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>
                        This is a dialog description.
                      </DialogDescription>
                    </DialogHeader>
                    <p>Dialog content goes here.</p>
                  </DialogContent>
                </Dialog>
                    <Button asChild size="lg" variant="ghost" className="rounded-full">
                    <Link href="mailto:brandon@portfolio.dev">
                      Support
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Trusted by */}
                <div className="mt-10">
                  <p className="mb-3 text-xs font-semibold tracking-widest text-white/50">COMPANIES I'VE WORKED WITH</p>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-2xl font-black text-white/25 sm:grid-cols-3">
                    <li>Space Y</li>
                    <li>Melta</li>
                    <li>ClosedAI</li>
                    <li>Booble</li>
                    <li>Lentflix</li>
                    <li>Xwitter</li>
                  </ul>
                </div>
              </div>
            </RevealOnView>
          </aside>

          {/* RIGHT: simplified, no internal card or horizontal carousel */}
          <div className="space-y-4">
            {projects.map((p, idx) => (
              <ProjectCard
                key={p.title}
                title={p.title}
                subtitle={p.subtitle}
                imageSrc={p.imageSrc}
                tags={p.tags}
                href={p.href}
                priority={p.priority}
                imageContainerClassName="lg:h-full"
                containerClassName="lg:h-[calc(100svh-2rem)]"
                revealDelay={idx * 0.06}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
