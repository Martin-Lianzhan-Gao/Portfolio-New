'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Dynamically import to prevent SSR issues with Three.js WebGL context
const SphereCluster = dynamic(() => import('../components/models/SphereCluster'), {
    ssr: false,
})

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const windowRef = useRef<HTMLDivElement>(null)

    const [scrollProgress, setScrollProgress] = useState(0)

    useGSAP(() => {
        if (!containerRef.current || !windowRef.current) return

        const mm = gsap.matchMedia()

        mm.add({
            isPortrait: '(orientation: portrait)',
            isLandscape: '(orientation: landscape)'
        }, (context) => {
            const { isLandscape } = context.conditions as { isLandscape: boolean }

            gsap.set(windowRef.current, {
                width: isLandscape ? '25vw' : '40vw',
                aspectRatio: '1/1',
                borderRadius: '9999px', // capsule
                opacity: 0,
                scale: 0.5,
                left: isLandscape ? '-20vw' : '-30vw',
                xPercent: isLandscape ? 0 : -50,
                top: '40%',
                yPercent: -50,
            })

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: 1.5, // smooth transition
                    onUpdate: (self) => setScrollProgress(self.progress)
                }
            })

            // Emerge window
            tl.to(windowRef.current, {
                opacity: 1,
                scale: 1,
                left: isLandscape ? '3rem' : '50%',
                xPercent: isLandscape ? 0 : -50,

                duration: 1.5,
                ease: "power2.out"
            })

                // Pause on hold
                .to({}, { duration: 2.5 })

                // Expand to full screen
                .to(windowRef.current, {
                    width: "100%",
                    height: "100dvh",
                    aspectRatio: "auto",
                    borderRadius: "0px",
                    left: "50%",
                    xPercent: -50,
                    top: "50%",
                    yPercent: -50,
                    duration: 2.5,
                    ease: "power1.inOut"
                })
        })

        return () => mm.revert()
    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="relative w-full h-[300vh] bg-[#0d0d0d]" id="skills-section">
            {/* 
              Sticky container traps the view while scrolling the outer 200vh container.
              The animation finishes at 50% of the scroll (when top hits top), 
              leaving 100vh for the user to interact with the expanded full screen. 
            */}
            <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex items-center bg-[#0d0d0d]">
                <div
                    ref={windowRef}
                    className="absolute border-black z-10 overflow-hidden flex items-center justify-center will-change-transform bg-[#111111]"
                >
                    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                        <SphereCluster />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Skills
