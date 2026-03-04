'use client'

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import ScrollDown from "../components/elements/ScrollDown";

gsap.registerPlugin(SplitText);

const Intro = () => {
    const ambientSphereRef = useRef<HTMLDivElement>(null);
    const glassLayerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    const scrollDownRef = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Ambient Sphere (Starts at 0s)
        tl.to(ambientSphereRef.current, {
            opacity: 0.6,
            duration: 3,
            ease: "power1.inOut"
        }, 0);

        // Optional: Infinite yoyo float to the sphere
        gsap.to(ambientSphereRef.current, {
            y: "-=120", // Much larger vertical drift
            scale: 1.2, // Subtle breathing effect
            duration: 6, // Slower, heavier movement
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 3 // Starts after the entrance animation finishes
        });

        // 2. Glass Condensation (Starts at 0.5s)
        tl.to(glassLayerRef.current, {
            opacity: 1,
            duration: 2.5,
            ease: "power2.inOut"
        }, 0.5);

        // 3. The Monolith Title using SplitText (Starts at 1.0s)
        const split = new SplitText(titleRef.current, { type: 'chars' });

        // Pre-computation: Force GPU Hardware Acceleration
        gsap.set(split.chars, { willChange: 'transform, filter, opacity' });

        tl.fromTo(split.chars,
            { y: 50, opacity: 0, filter: 'blur(10px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.05, duration: 1.5, ease: 'power3.out' },
            1.0
        );


        const secondaryElements = [scrollDownRef.current].filter(Boolean); // Filter out any nulls

        if (secondaryElements.length > 0) {
            tl.fromTo(secondaryElements,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", stagger: 0.15 },
                "-=1.0" // Overlap value to start BEFORE the Title animation fully completes
            );
        }

        // Strict Cleanup Discipline
        return () => {
            split.revert();
        };
    });

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden bg-white">
            {/* 1. Ambient Sphere Background (z-0) */}
            <div className="absolute z-0 w-[150vw] h-[150vw] top-1/2 right-0 translate-x-1/2 -translate-y-1/2 md:w-[150vh] md:h-[150vh] md:top-0 md:left-1/2 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 pointer-events-none">
                <div
                    ref={ambientSphereRef}
                    className="w-full h-full opacity-0"
                    style={{
                        background: "radial-gradient(circle closest-side, rgba(255, 69, 0, 0.95) 0%, rgba(255, 69, 0, 0.8) 30%, rgba(255, 69, 0, 0.3) 65%, rgba(255, 69, 0, 0) 100%)",
                        borderRadius: "50%",
                        transform: "scale(0.95)"
                    }}
                />
            </div>

            {/* 2. Glass Condensation Layer (z-10) */}
            <div
                ref={glassLayerRef}
                className="absolute inset-0 z-10 bg-white/30 backdrop-blur-xl opacity-0 pointer-events-none"
            />

            {/* 3. Foreground Content Layer (z-20) */}
            <div className="relative z-20 w-full h-full flex flex-col pointer-events-none items-center">
                <div className="w-full h-full flex flex-col justify-around max-w-vw-safe">
                    {/* Title */}
                    <div className="w-full h-full flex flex-col justify-center md:gap-6 md:h-auto @container">
                        <div className="ml-6 mr-6 w-full font-inria-sans text-[14cqh] font-bold wrap-break-word md:text-[18cqw] md:ml-12">
                            <h1 ref={titleRef} className="tracking-tight m-0 uppercase">
                                MARTIN GAO.
                            </h1>
                        </div>
                    </div>


                    {/* Scroll Down Nav */}
                    <div className="hidden md:h-auto font-semibold text-3xl md:flex md:flex-row md:justify-end md:w-full md:items-center">
                        <ScrollDown ref={scrollDownRef} className="mr-12 will-change-transform" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Intro;