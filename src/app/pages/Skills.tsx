'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitText from 'gsap/SplitText'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { skillsData } from '../data/skillsData'

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

        // 1) Phase 1: Sphere cluster amplifies (duration 2, time 0 -> 2)
        const proxy = { progress: 0 };
        tl.to(proxy, {
            progress: 1,
            duration: 1,
            ease: "power1.Out",
            onUpdate: () => {
                progressRef.current = proxy.progress;
            }
        }, 0)

        // 2) Phase 2: Text panel rises from below, title pushed off the top
        // With h-max and top-full, traveling -100% pulls its exact whole height up into view!
        tl.to(textRef.current, { y: '-100%', ease: 'none', duration: 2 }, 2)
        tl.to(titleRef.current, { y: '-80dvh', ease: 'none', duration: 2 }, 2)

        // 3) Phase 3: Text panel moves up by 2/3, Sphere shrinks to half of startScale
        tl.to(textRef.current, { y: '-115%', ease: 'none', duration: 1 }, 4)
        tl.to(proxy, {
            progress: -1.167,
            duration: 1,
            ease: "power1.inOut",
            onUpdate: () => {
                progressRef.current = proxy.progress;
            }
        }, 4)

        return () => {
            titleSplit.revert();
        }
    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="relative z-30 w-full h-[500dvh] bg-[#F5F5F7] rounded-t-[2rem] -mt-8 md:-mt-12" id="skills-section">
            <div className="sticky top-0 w-full h-[100dvh] overflow-hidden bg-[#F5F5F7] rounded-t-[2rem] flex flex-col">
                { /* Title */}
                <div className='w-full max-w-vw-safe mx-auto mt-24 relative z-10'>
                    <h1
                        className='ml-6 mr-6 md:mr-12 md:ml-12 font-inter font-medium text-[min(14vw,15dvh)] uppercase'
                        ref={titleRef}
                    >
                        skillsnapshot
                    </h1>
                </div>

                {/* Sphere Cluster Models */}
                <div className="absolute inset-0 z-20 overflow-hidden flex items-center justify-center will-change-transform bg-transparent">
                    <div className="shrink-0 w-full h-full flex items-center justify-center pointer-events-none">
                        <SphereCluster progressRef={progressRef} speedRef={speedRef} />
                    </div>
                </div>

                {/* Skills panel */}
                <div
                    ref={textRef}
                    className="absolute inset-x-0 top-full min-h-[150dvh] h-max z-30 flex flex-col bg-[#F5F5F7]/80 pb-12"
                >
                    {/* Divider top */}
                    <hr className="border-t-[1px] border-black w-full shrink-0" />

                    {skillsData.map((category) => (
                        <div key={category.title} className="contents">
                            <div className="w-full max-w-vw-safe mx-auto flex-1 flex flex-col justify-around md:justify-center px-6 md:px-12 py-8 lg:py-12">
                                <div className="w-full mb-4 md:mb-6">
                                    <span className="font-inter uppercase text-black/80 font-medium">{category.title}</span>
                                </div>
                                <div className="w-full flex flex-col md:flex-row items-center gap-6 md:gap-16">
                                    <div className="w-full md:w-1/2 shrink-0">
                                        <p className="font-inter text-lg leading-snug xl:text-xl 2xl:text-[1.5rem] tracking-tight text-black/90">
                                            {category.introduction.en}
                                        </p>
                                    </div>
                                    <div className="w-full md:w-1/2 flex flex-wrap gap-2 md:gap-3">
                                        {category.skills.map(skill => (
                                            <span
                                                key={skill}
                                                className="font-inter border-[1px] border-black rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-regular bg-transparent"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr className="border-t-[1px] border-black w-full shrink-0" />
                        </div>
                    ))}

                    {/* Additional Tail Section */}
                    <div className="w-full max-w-vw-safe mx-auto flex-1 flex flex-col justify-center px-6 md:px-12">
                        {/* Empty spacer or future content to maintain height consistency */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Skills;
