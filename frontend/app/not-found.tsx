"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    let starInterval: NodeJS.Timeout

    function createStar() {
      if (!container) return
      const right = Math.random() * 500
      const top = Math.random() * window.innerHeight
      const star = document.createElement("div")
      star.classList.add("star")
      star.style.top = top + "px"
      star.style.right = right + "px"
      
      let currentRight = right
      container.appendChild(star)

      const runStar = setInterval(() => {
        if (currentRight >= window.innerWidth) {
          star.remove()
          clearInterval(runStar)
        }
        currentRight += 3
        star.style.right = currentRight + "px"
      }, 10)

      // Store interval so we can clean it up on unmount
      ;(star as any)._runStar = runStar
    }

    starInterval = setInterval(createStar, 100)

    return () => {
      clearInterval(starInterval)
      if (container) {
        const stars = container.querySelectorAll('.star')
        stars.forEach(s => {
          clearInterval((s as any)._runStar)
          s.remove()
        })
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(to top, #2e1753, #1f1746, #131537, #0d1028, #050819)"
      }}
    >
      <style>{`
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fff;
          animation: starTwinkle 3s infinite linear;
        }
        .astronaut {
          width: 100px;
          position: absolute;
          top: 55%;
          animation: astronautFly 6s infinite linear;
        }
        @keyframes astronautFly {
          0% { left: -100px; }
          25% { top: 50%; transform: rotate(30deg); }
          50% { transform: rotate(45deg); top: 55%; }
          75% { top: 60%; transform: rotate(30deg); }
          100% { left: 110%; transform: rotate(45deg); }
        }
        @keyframes starTwinkle {
          0% { background: rgba(255,255,255,0.4); }
          25% { background: rgba(255,255,255,0.8); }
          50% { background: rgba(255,255,255,1); }
          75% { background: rgba(255,255,255,0.8); }
          100% { background: rgba(255,255,255,0.4); }
        }
      `}</style>

      <div className="absolute top-[10%] z-10 text-center text-white">
        <div className="font-sans text-2xl tracking-widest text-zinc-300">ERROR</div>
        <h1 className="font-display my-2 text-8xl font-bold tracking-tight md:text-9xl">404</h1>
        <hr className="mx-auto my-6 w-24 border-zinc-500/50" />
        <div className="font-sans text-xl text-zinc-300 md:text-2xl">Page Not Found</div>
        <Link 
          href="/" 
          className="mt-10 inline-block rounded-md bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
        >
          Return Home
        </Link>
      </div>

      <div className="pointer-events-none z-20">
        <img 
          src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png" 
          alt="Astronaut floating in space" 
          className="astronaut drop-shadow-2xl" 
        />
      </div>
    </div>
  )
}
