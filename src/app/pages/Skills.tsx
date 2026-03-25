'use client'

import { useRef } from 'react'
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
    const titleRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const speedRef = useRef(0);


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
                width: '100vw',
                height: isLandscape ? '30vw' : '100vw',
                left: '50%',
                xPercent: -50,
                top: isLandscape ? '70%' : '55%',
                yPercent: -50,
                backgroundColor: isLandscape ? '#F1F1F1' : 'transparent',
                borderRadius: '9999px'
            })

            // Set up timeline for the window animation on touch devices
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                    fastScrollEnd: true,
                    preventOverlaps: true,
                    onUpdate: (self) => {
                        speedRef.current = self.getVelocity() * 0.0001;
                    }
                }
            })

            tl.fromTo(windowRef.current, {
                clipPath: 'inset(0vw 35vw 0vw 35vw round 9999px)',
            }, {
                clipPath: 'inset(0vw 0vw 0vw 0vw round 9999px)',
                duration: 1,
                ease: "power1.Out",
                onUpdate: function () {
                    progressRef.current = this.progress();
                }
            })
        })

        return () => mm.revert()
    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="relative w-full h-[300vh] bg-[#F5F5F7]" id="skills-section">
            <div className="sticky top-0 w-full h-[100dvh] overflow-hidden bg-[#F5F5F7] rounded-t-[2rem] flex flex-col items-center">
                <div className='w-full max-w-vw-safe mt-20'>
                    <h1 className='ml-6 mr-6 md:mr-12 md:ml-12 font-cormorant-garamond text-[min(15.5vw,18vh)] uppercase' ref={titleRef}>My Skills</h1>
                </div>
                <div
                    ref={windowRef}
                    className="absolute z-10 overflow-hidden flex items-center justify-center will-change-transform bg-[#f1f1f1]"
                >
                    <div className="shrink-0 w-[100vw] h-full flex items-center justify-center pointer-events-none">
                        <SphereCluster progressRef={progressRef} speedRef={speedRef} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Skills;
