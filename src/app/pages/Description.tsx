'use client'

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Description = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !contentRef.current) return;

        const copyBlocks = gsap.utils.toArray<HTMLElement>('.desc-copy', contentRef.current);
        const metaLabel = contentRef.current.querySelector<HTMLElement>('.desc-meta-label');
        const splits = copyBlocks.map(block => new SplitText(block, { type: "lines", linesClass: "desc-line" }));

        // Reset state
        splits.forEach(split => {
            gsap.set(split.lines, { opacity: 0, filter: 'blur(6px)', y: 18 });
        });
        if (metaLabel) {
            gsap.set(metaLabel, { opacity: 0, y: 8 });
        }

        if (imageRef.current) {
            // CSS variable controls the left-to-right mask position
            gsap.set(imageRef.current, { '--reveal-offset': '0%', filter: 'blur(8px)', opacity: 0 });
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 30%",
                toggleActions: "play none none reverse"
            }
        });

        // Image animation: left-to-right fog reveal
        if (imageRef.current) {
            // Fade in basic visibility and remove blur
            tl.to(imageRef.current, {
                opacity: 0.85,
                filter: 'blur(0px)',
                duration: 1.0,
                ease: "power2.out"
            }, 0);

            // Animate the mask to sweep from left to right
            tl.to(imageRef.current, {
                '--reveal-offset': '130%',
                duration: 2.2,
                ease: "power2.inOut"
            }, 0);
        }

        // Text animation: paragraph rhythm first, line-level texture second.
        splits.forEach((split, index) => {
            tl.to(split.lines, {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                stagger: 0.12,
                duration: 0.75,
                ease: "power3.out"
            }, 0.6 + index * 0.48);
        });

        if (metaLabel) {
            tl.to(metaLabel, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            }, 1.05);
        }

        return () => {
            splits.forEach(split => split.revert());
        };

    }, { scope: containerRef });

    return (
        <div ref={containerRef} id="about" data-theme="dark" className="relative z-20 overflow-hidden bg-[#0a0a0a] w-full pb-14 md:pb-0 md:pt-14 xl:pt-28 flex flex-col items-center">
            <div className="w-full max-w-vw-safe px-0 md:px-12 flex flex-col md:flex-row justify-center md:justify-between items-start md:items-start min-h-[100dvh] md:gap-20">

                {/* Left: Statue Image with Overlays */}
                <div className="relative w-full md:w-[55%] md:h-[100dvh] xl:w-[50%] 2xl:w-[40%] flex flex-col justify-center items-center md:items-start">
                    <div className="relative w-full max-w-full scale-[1.2] lg:scale-100 origin-top-left md:origin-left">
                        <img
                            ref={imageRef}
                            src="/images/statue.png"
                            alt="David Statue"
                            className="w-full h-auto object-contain mix-blend-lighten"
                            style={{
                                // CSS Custom Property for the GSAP sweeping mask animation
                                '--reveal-offset': '0%',
                                maskImage: 'linear-gradient(to right, black calc(var(--reveal-offset) - 30%), transparent var(--reveal-offset))',
                                WebkitMaskImage: 'linear-gradient(to right, black calc(var(--reveal-offset) - 30%), transparent var(--reveal-offset))'
                            } as React.CSSProperties}
                        />

                        {/* Overlay: Permanent left edge blur into darkness */}
                        <div className="absolute top-0 left-0 w-[30%] md:w-[20%] h-full bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

                        {/* Overlay: Permanent right edge blur into darkness */}
                        <div className="absolute top-0 right-0 w-[30%] md:w-[20%] h-full bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

                        {/* Overlay: Permanent top edge blur into darkness */}
                        <div className="absolute top-0 left-0 w-full h-[15%] md:h-[20%] bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

                        {/* Overlay: Permanent bottom edge blur into darkness */}
                        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                    </div>
                </div>

                {/* Right: Text Content */}
                <div
                    ref={contentRef}
                    className="relative z-20 font-inter font-light tracking-wide flex flex-col justify-center gap-8 lg:gap-12 2xl:gap-24 text-left w-full md:w-[45%] md:h-[100dvh] xl:w-[50%] 2xl:w-[60%] max-w-[800px] px-[8vw] md:px-0 -mt-[8vh] sm:-mt-[12vh] md:mt-0 md:translate-y-14 xl:translate-y-20"
                >
                    <p className="desc-copy text-[#f5f5f7]/90 text-[16px] md:text-[20px] xl:text-[22px] leading-[1.6]">
                        I work at the intersection of engineering and visual direction — treating them as one discipline, not two. The interfaces I build are designed to feel precise, responsive, and structurally deliberate.
                    </p>
                    <p className="desc-copy text-[#f5f5f7]/90 text-[16px] md:text-[20px] xl:text-[22px] leading-[1.6]">
                        Layout rhythm, motion timing, render performance, interaction feedback — these are the details I invest in. The goal is always an experience that feels coherent, not just functional.
                    </p>

                    {/* Minimalist Metadata Footer inside Description */}
                    <div className="flex flex-col pt-8 border-t border-[#f5f5f7]/10">
                        <span className="desc-meta-label font-inter text-[10px] md:text-xs font-bold text-[#f5f5f7]/40 uppercase tracking-[0.2em] mb-3">
                            Education
                        </span>
                        <p className="desc-copy font-inter text-sm lg:text-md xl:text-lg text-[#f5f5f7]/60 leading-[1.6]">
                            Bachelor of Computer Science, The University of Queensland (2019 - 2024).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Description;
