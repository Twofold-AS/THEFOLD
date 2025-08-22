import type { Metadata } from 'next'
import './globals.css'
import LoaderOverlay from '@/components/LoaderOverlay'

export const metadata: Metadata = {
  title: 'THEFOLD',
  description: 'Made with <3'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <style>{`
:root {
  --font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
html { font-family: var(--font-sans); }
        `}</style>
      </head>
      <body>
        {/* Global loader overlay */}
        <LoaderOverlay pattern="scan" minimumMs={2500} fadeMs={400} brandColor="white" speedRps={0.6} blockInteractions={true}/>
        {children}
        </body>
    </html>
  )
}
