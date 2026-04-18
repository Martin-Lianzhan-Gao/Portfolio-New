
'use client'

import React, { useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { worksData } from '../data/worksData';
import { skillsData } from '../data/skillsData';

const Works = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const footerMarqueeRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!marqueeRef.current) return;

        // GSAP infinite horizontal scroll loop
        gsap.to(marqueeRef.current, {
            xPercent: -50,
            repeat: -1,
            duration: 48,
            ease: "none"
        });

        // Footer Kinetic Marquee Wall Animation
        footerMarqueeRefs.current.forEach((marquee, idx) => {
            if (!marquee) return

            const direction = idx % 2 === 0 ? -1 : 1;
            const duration = 100 + (idx * 5); // Stagger speeds: 50s, 55s, 60s, 65s

            if (direction === -1) {
                // Scroll Left
                gsap.fromTo(marquee,
                    { xPercent: 0 },
                    { xPercent: -50, repeat: -1, duration, ease: "none" }
                );
            } else {
                // Scroll Right
                gsap.fromTo(marquee,
                    { xPercent: -50 },
                    { xPercent: 0, repeat: -1, duration, ease: "none" }
                );
            }
        })

        // Neo-Brutalist Ledger Entry Animations (The Gate & The Cut)
        const worksRows = gsap.utils.toArray<HTMLElement>('.works-row');
        worksRows.forEach((row) => {
            const divider = row.querySelector('.row-divider');
            const title = row.querySelector('.row-title');
            const fades = gsap.utils.toArray('.row-fade-up', row);

            // Init State
            gsap.set(divider, { scaleX: 0 });
            gsap.set(title, { yPercent: 120 });
            gsap.set(fades, { opacity: 0, y: 30 });

            const rowTl = gsap.timeline({
                scrollTrigger: {
                    trigger: row,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                }
            });

            rowTl.to(divider, {
                scaleX: 1,
                duration: 1.2,
                ease: "expo.inOut",
                transformOrigin: "left center" // Razor cut from left to right
            })
                .to(title, {
                    yPercent: 0,
                    duration: 1.2,
                    ease: "power4.out"
                }, "-=0.6") // Ascend monolithic text heavily before cut finishes
                .to(fades, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out"
                }, "-=1.0"); // Float up the dust (metadata)
        })

    }, { scope: containerRef });

    const MarqueeItem = () => (
        <div className="flex items-center gap-[min(4vw,6vh)] shrink-0 px-[min(2vw,3vh)] font-inter text-[min(24vw,34vh)] leading-none font-regular uppercase tracking-wide">
            <span className="text-[#f5f5f7]">WORKS</span>
            {/* The separator dot matching the font sizing using em units */}
            <span className="inline-flex w-[0.2em] h-[0.2em] bg-[#E67B4E] rounded-full mx-[min(2vw,3vh)]" />
        </div>
    );

    return (
        <div ref={containerRef} id="works" className="theme-dark relative z-20 w-full min-h-[100dvh] bg-[#0d0d0d] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col justify-start">
            <div className="flex w-max whitespace-nowrap will-change-transform mt-20 md:mt-32 xl:mt-40 2xl:mt-50 mb-24 md:mb-40 lg:mb-56" ref={marqueeRef}>
                {/* 
                  First Full Set 
                */}
                <div className="flex items-center shrink-0">
                    <MarqueeItem />
                    <MarqueeItem />
                    <MarqueeItem />
                    <MarqueeItem />
                </div>
                {/* 
                  Second Full Set
                */}
                <div className="flex items-center shrink-0">
                    <MarqueeItem />
                    <MarqueeItem />
                    <MarqueeItem />
                    <MarqueeItem />
                </div>
            </div>

            {/* Neo-Brutalist LEDGER / Works List */}
            <div className="w-full flex-col flex items-center relative z-20 pb-20 md:pb-32">
                {worksData.map((work, idx) => (
                    <div key={idx} className="works-row group relative w-full max-w-vw-safe mx-auto flex flex-col py-12 lg:py-24 px-6 md:px-12 hover:bg-[#f5f5f7]/[0.02] transition-colors duration-500 cursor-pointer">

                        {/* The Animated SVG Cut Line */}
                        <div className="row-divider absolute top-0 left-0 w-full h-[1px] bg-[#f5f5f7]/15"></div>

                        {/* Top Row: Metadata (Breathing Room) */}
                        <div className="row-fade-up w-full flex justify-start mb-8 lg:mb-16">
                            <span className="font-inter font-medium text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#f5f5f7]/40">
                                [ {work.date.startDate} - {work.date.endDate} ] / {work.type}
                            </span>
                        </div>

                        {/* Bottom Row: Title + Details (Vertically Centered) */}
                        <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-24">

                            {/* Left Box (The Visual Monolith) */}
                            <div className="w-full lg:w-auto shrink-0 flex items-center overflow-hidden py-1">
                                <h3 className="row-title font-inria-sans text-[4rem] sm:text-[5rem] md:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold text-[#f5f5f7] tracking-tighter uppercase leading-[0.85] m-0 mix-blend-difference">
                                    {work.title}
                                </h3>
                            </div>

                            {/* Right Box (Context & Action) */}
                            <div className="w-full lg:flex-1 max-w-[600px] flex flex-col gap-10 md:gap-14">
                                <div className="flex flex-col gap-4 md:gap-5">
                                    <p className="row-fade-up font-inter text-xs md:text-sm font-bold text-[#f5f5f7]/70 uppercase tracking-[0.15em]">
                                        {work.position}
                                    </p>

                                    {/* Skills with Orange Dot Separators */}
                                    <div className="row-fade-up font-inter text-[10px] md:text-xs text-[#f5f5f7]/40 uppercase tracking-[0.15em] leading-[2] flex flex-wrap items-center">
                                        {work.techStack.map((tech, i) => (
                                            <span key={i} className="flex items-center shrink-0">
                                                {tech}
                                                {i !== work.techStack.length - 1 && (
                                                    <span className="inline-flex w-[0.3em] h-[0.3em] bg-[#E67B4E] rounded-full mx-3 md:mx-4" />
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <a href="#resume" onClick={(e) => e.preventDefault()} className="row-fade-up font-inter font-semibold text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#f5f5f7]/60 group-hover:text-white transition-colors duration-300 flex items-center w-max">
                                    [ <ArrowDownRight className="w-3 h-3 md:w-3.5 md:h-3.5 transform transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-[#E67B4E] block mx-2" strokeWidth={2.5} /> DETAILS IN RESUME ]
                                </a>
                            </div>
                        </div>

                    </div>
                ))}

                {/* Final bottom border line wrapper to close the ledger */}
                <div className="w-full max-w-vw-safe mx-auto border-t border-[#f5f5f7]/15"></div>
            </div>

            {/* The Kinetic Marquee Wall (Footer) */}
            <div className="w-full flex flex-col gap-3 md:gap-4 lg:gap-5 mt-12 md:mt-24 pb-12 overflow-hidden relative z-20">
                {skillsData.map((category, idx) => {
                    const MarqueeContent = () => (
                        <div className="flex items-center shrink-0">
                            {/* Loop multiple times to ensure array is massive enough for extremely wide 4k screens given the small font size */}
                            {[...Array(12)].map((_, loopIndex) => (
                                <React.Fragment key={loopIndex}>
                                    {category.skills.map((skill, i) => (
                                        <div key={`${skill}-${i}`} className="flex items-center">
                                            <span className="font-inter text-base md:text-lg lg:text-xl font-medium tracking-wide text-white/40 leading-none whitespace-nowrap">
                                                {skill}
                                            </span>
                                            <span className="font-mono text-sm md:text-base font-light text-white/30 mx-5 md:mx-8 lg:mx-12">
                                                +
                                            </span>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    );

                    return (
                        <div key={category.title} className="flex w-max will-change-transform" ref={el => { footerMarqueeRefs.current[idx] = el }}>
                            {/* We duplicated MarqueeContent twice to perfectly satisfy the -50% CSS loop transition */}
                            <MarqueeContent />
                            <MarqueeContent />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Works;