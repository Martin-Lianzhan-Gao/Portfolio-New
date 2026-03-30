'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitText from 'gsap/SplitText'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Dynamically import to prevent SSR issues with Three.js WebGL context
const SphereCluster = dynamic(() => import('../components/models/SphereCluster'), {
    ssr: false,
})

const Skills = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const speedRef = useRef(0);

    useGSAP(() => {
        if (!containerRef.current || !titleRef.current || !textRef.current) return

        // Title entry animation (bottom-up reveal, matching Description's title)
        const titleSplit = new SplitText(titleRef.current, {
            type: "lines,chars",
            linesClass: "overflow-hidden"
        });

        const titleTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        titleTl.fromTo(titleSplit.chars,
            { y: "100%", opacity: 0, filter: 'blur(10px)', scale: 1.05 },
            { y: "0%", opacity: 1, filter: 'blur(0px)', scale: 1, stagger: 0.02, duration: 1.6, ease: 'power3.out' }
        );

        // Set initial state for text panel (pushed below the sticky viewport, clipped by overflow-hidden)
        gsap.set(textRef.current, { y: '100%' });

        // Text panel is pushed below the sticky viewport, clipped by overflow-hidden
        gsap.set(textRef.current, { y: '100%' });

        // Master timeline for the entire scrolling container
        // Container height is 400dvh, Sticky element is 100dvh.
        // "top top" to "bottom bottom" means total scroll distance is 300dvh.
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

        // 1) Sphere cluster animation (Headless Proxy Tween)
        // Animates a dummy proxy object over the first 2 "time" units (maps to first 2/3 of 300dvh = 200dvh scroll)
        // This avoids expensive DOM reflows like clipPath and sizing, pure numerical update!
        const proxy = { progress: 0 };
        tl.to(proxy, {
            progress: 1,
            duration: 2,
            ease: "power1.Out",
            onUpdate: () => {
                progressRef.current = proxy.progress;
            }
        }, 0)

        // 2) Text phase: starts at time unit 2, lasts 1 "time" unit (maps to last 1/3 of 300dvh = 100dvh)
        // Text panel rises from below, title pushed off the top
        tl.to(textRef.current, { y: '0%', ease: 'none', duration: 1 }, 2)
        tl.to(titleRef.current, { y: '-40dvh', ease: 'none', duration: 1 }, 2)

        return () => {
            titleSplit.revert();
        }
    }, { scope: containerRef })

    const frontEndSkills = ['React', 'Next.js', 'TypeScript', 'GSAP', 'Three.js', 'WebGL', 'Tailwind CSS']
    const backEndSkills = ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL', 'Redis']
    const otherSkills = ['Git', 'Figma', 'Docker', 'Agile / Scrum', 'Linux', 'CI/CD']

    return (
        <div ref={containerRef} className="relative w-full h-[400dvh] bg-[#F5F5F7]" id="skills-section">
            <div className="sticky top-0 w-full h-[100dvh] overflow-hidden bg-[#F5F5F7] rounded-t-[2rem] flex flex-col">
                { /* Title */}
                <div className='w-full max-w-vw-safe mx-auto mt-20 relative z-10'>
                    <h1
                        className='ml-6 mr-6 md:mr-12 md:ml-12 font-inter font-medium text-[min(14vw,15dvh)] uppercase'
                        ref={titleRef}
                    >
                        skillsnapshot
                    </h1>
                </div>

                {/* Sphere cluster */}
                <div className="absolute inset-0 z-20 overflow-hidden flex items-center justify-center will-change-transform bg-transparent">
                    <div className="shrink-0 w-full h-full flex items-center justify-center pointer-events-none">
                        <SphereCluster progressRef={progressRef} speedRef={speedRef} />
                    </div>
                </div>

                {/* Initially translated 100% down (off-screen), clipped by parent overflow-hidden */}
                <div
                    ref={textRef}
                    className="absolute inset-x-0 bottom-0 h-[100dvh] z-30 flex flex-col"
                    style={{ backgroundColor: 'rgba(245, 245, 247, 0.8)' }}
                >
                    {/* Divider top */}
                    <hr className="border-t-2 border-black w-full shrink-0" />

                    {/* Front End */}
                    <div className="w-full max-w-vw-safe mx-auto flex-1 flex items-center px-6 md:px-12 gap-8 md:gap-16">
                        <div className="w-1/4 shrink-0">
                            <p className="font-inter text-xl md:text-3xl font-medium uppercase tracking-tight">
                                Front<br />End
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {frontEndSkills.map(skill => (
                                <span
                                    key={skill}
                                    className="font-inter border-2 border-black rounded-full px-3 py-1 md:px-5 md:py-2 text-xs md:text-base font-regular"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t-2 border-black w-full shrink-0" />

                    {/* Back End */}
                    <div className="w-full max-w-vw-safe mx-auto flex-1 flex items-center px-6 md:px-12 gap-8 md:gap-16">
                        <div className="w-1/4 shrink-0">
                            <p className="font-inter text-xl md:text-3xl font-medium uppercase tracking-tight">
                                Back<br />End
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {backEndSkills.map(skill => (
                                <span
                                    key={skill}
                                    className="font-inter border-2 border-black rounded-full px-3 py-1 md:px-5 md:py-2 text-xs md:text-base font-regular"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t-2 border-black w-full shrink-0" />

                    {/* Others */}
                    <div className="w-full max-w-vw-safe mx-auto flex-1 flex items-center px-6 md:px-12 gap-8 md:gap-16">
                        <div className="w-1/4 shrink-0">
                            <p className="font-inter text-xl md:text-3xl font-medium uppercase tracking-tight">
                                Others
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {otherSkills.map(skill => (
                                <span
                                    key={skill}
                                    className="font-inter border-2 border-black rounded-full px-3 py-1 md:px-5 md:py-2 text-xs md:text-base font-regular"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Divider bottom */}
                    <hr className="border-t-2 border-black w-full shrink-0" />
                </div>

            </div>
        </div>
    )
}

export default Skills;
