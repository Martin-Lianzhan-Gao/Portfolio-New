
'use client'

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Works = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!marqueeRef.current) return;

        // GSAP infinite horizontal scroll loop
        gsap.to(marqueeRef.current, {
            xPercent: -50,
            repeat: -1,
            duration: 48,
            ease: "none"
        });
    }, { scope: containerRef });

    const MarqueeItem = () => (
        <div className="flex items-center gap-[min(4vw,6vh)] shrink-0 px-[min(2vw,3vh)] font-inter text-[min(24vw,34vh)] leading-none font-regular uppercase tracking-wide">
            <span className="text-[#f5f5f7]">WORKS</span>
            {/* The separator dot matching the font sizing using em units */}
            <span className="inline-flex w-[0.2em] h-[0.2em] bg-[#E67B4E] rounded-full mx-[min(2vw,3vh)]" />
        </div>
    );

    return (
        <div ref={containerRef} className="relative z-40 w-full min-h-[100dvh] bg-[#0d0d0d] -mt-8 md:-mt-12 overflow-hidden flex flex-col justify-start" id="works-section">
            <div className="flex w-max whitespace-nowrap will-change-transform mt-20 md:mt-32 xl:mt-40 2xl:mt-50" ref={marqueeRef}>
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
        </div>
    )
}

export default Works;