
'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Works = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!marqueeRef.current) return;

        // GSAP infinite horizontal scroll loop
        // The container holds exactly two duplicated sets of content.
        // It shifts precisely from 0% to -50% (revealing the 2nd clone loop seamlessly), then resets.
        gsap.to(marqueeRef.current, {
            xPercent: -50,
            repeat: -1,
            duration: 20, // Lower = faster
            ease: "none"
        });
    }, { scope: containerRef });

    const MarqueeItem = () => (
        <div className="flex items-center gap-[min(4vw,6vh)] shrink-0 px-[min(2vw,3vh)] font-inria-sans text-[min(24vw,34vh)] leading-none font-bold uppercase tracking-tight">
            <span className="text-[#f5f5f7]">WORKS</span>
            <span className="text-[#333333]">+</span>
            <span className="text-[#f5f5f7]">PROJECTS.</span>
            {/* The separator dot matching the font sizing using em units */}
            <span className="inline-flex w-[0.2em] h-[0.2em] bg-[#f5f5f7] rounded-full mx-[min(2vw,3vh)]" />
        </div>
    );

    return (
        // Added the card-stacking negative margin and rounded top just like the Skills section, but placed over Skills with z-40
        <div ref={containerRef} className="relative z-40 w-full min-h-[100dvh] bg-[#0d0d0d] rounded-t-[2rem] -mt-8 md:-mt-12 overflow-hidden flex flex-col justify-center py-20 md:py-32" id="works-section">
            <div className="w-full flex whitespace-nowrap will-change-transform" ref={marqueeRef}>
                {/* 
                  First Full Set 
                  We repeat it enough times to ensure it spans much further than any ultra-wide monitor, preventing gaps before looping.
                */}
                <div className="flex items-center shrink-0">
                    <MarqueeItem />
                    <MarqueeItem />
                    <MarqueeItem />
                    <MarqueeItem />
                </div>
                {/* 
                  Second Full Set (Identical Clone for seamless teleporting) 
                */}
                <div className="flex items-center shrink-0">
                    <MarqueeItem />
                    <MarqueeItem />
                    <MarqueeItem />
                    <MarqueeItem />
                </div>
            </div>
        </div>
    )
}

export default Works;