'use client'

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Description = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !contentRef.current) return;

        // Fetch all paragraphs for sequential fade-in
        const paragraphs = gsap.utils.toArray('.desc-paragraph', contentRef.current);

        // Reset state
        gsap.set(paragraphs, { opacity: 0, y: 30 });

        // Simple and elegant entrance animation
        gsap.to(paragraphs, {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%", // Triggers when the top of Description hits 60% of viewport height
                toggleActions: "play none none reverse"
            }
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} id="about" data-theme="dark" className="relative z-20 overflow-x-hidden bg-[#0a0a0a] w-full pb-20 md:pb-48 pt-24 md:pt-40 flex flex-col items-center">
            <div className="w-full max-w-vw-safe px-6 md:px-12 flex flex-col justify-center min-h-[60dvh]">
                <div 
                    ref={contentRef} 
                    className="font-inter font-light tracking-wide flex flex-col gap-8 lg:gap-12 text-left w-full max-w-[800px] mx-auto"
                >
                    <p className="desc-paragraph text-[#f5f5f7]/90 text-[1.2rem] sm:text-2xl md:text-3xl lg:text-4xl leading-[1.6] md:leading-[1.6] lg:leading-[1.6]">
                        I engineer digital experiences without separating logic from aesthetics. In my workflow, the architecture of a system and its visual fidelity are not independent variables, but a singular pursuit of uncompromising execution.
                    </p>
                    
                    <p className="desc-paragraph text-[#f5f5f7]/90 text-[1.2rem] sm:text-2xl md:text-3xl lg:text-4xl leading-[1.6] md:leading-[1.6] lg:leading-[1.6]">
                        The interfaces I build are exact. They scale gracefully, perform flawlessly under pressure, and leave no room for arbitrary design choices. Every transition and layout is treated as a strict mathematical constraint.
                    </p>
                    
                    {/* Minimalist Metadata Footer inside Description */}
                    <div className="desc-paragraph flex flex-col mt-6 md:mt-10 pt-8 border-t border-[#f5f5f7]/10">
                        <span className="font-inter text-[10px] md:text-xs font-bold text-[#f5f5f7]/40 uppercase tracking-[0.2em] mb-3">
                            Education
                        </span>
                        <p className="font-inter text-sm md:text-base lg:text-lg text-[#f5f5f7]/60 leading-[1.6]">
                            Bachelor of Computer Science, The University of Queensland (2019-2024). <br className="hidden sm:block" />Theory provided the baseline — the execution is entirely my own.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Description;
