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

    const progressRef = useRef(0)

    useGSAP(() => {
        if (!containerRef.current || !windowRef.current) return

        const mm = gsap.matchMedia()

        mm.add({
            isPortrait: '(orientation: portrait)',
            isLandscape: '(orientation: landscape)'
        }, (context) => {
            const { isLandscape } = context.conditions as { isLandscape: boolean }
            // Initialise the window size and position based on the orientation
            gsap.set(windowRef.current, {
                width: isLandscape ? '10vw' : '60vw',
                height: isLandscape ? '30vw' : '100vw',
                borderRadius: isLandscape ? '9999px' : '100px', // capsule
                left: '50%',
                xPercent: -50,
                top: '70%',
                yPercent: -50
            })
            // Set up timeline for the window animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: 1.5, // smooth transition
                    onUpdate: (self) => progressRef.current = self.progress
                }
            })

            // Step 1: Emerge window
            tl.to(windowRef.current, {
                width: isLandscape ? '30vw' : '100vw',
                duration: 2,
                ease: "power2.out"
            })

                // Expand to full screen
                .to(windowRef.current, {
                    width: "100%",
                    duration: 2.5,
                    ease: "power1.inOut"
                })
                // Pause on hold
                .to({}, { duration: 0.5 })
        })

        return () => mm.revert()
    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="relative w-full h-[300vh] bg-[#F5F5F7]" id="skills-section">
            <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex bg-[#F5F5F7] rounded-t-[2rem]">
                <div className='w-full max-w-vw-safe mt-20'>
                    <h1 className='ml-6 mr-6 md:mr-12 md:ml-12 font-cormorant-garamond text-[min(15.5vw,18vh)] uppercase'>My Skills</h1>
                </div>
                <div
                    ref={windowRef}
                    className="absolute z-10 overflow-hidden flex items-center justify-center will-change-transform bg-[#f1f1f1]"
                >
                    <div className="shrink-0 w-[100vw] h-full flex items-center justify-center pointer-events-none">
                        <SphereCluster progressRef={progressRef} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Skills
