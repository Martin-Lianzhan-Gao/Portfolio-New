'use client'

import { useRef, PointerEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import ScrollDown from "../components/elements/ScrollDown";
import ParticleSphere from "../components/elements/ParticleSphere";

gsap.registerPlugin(SplitText);

const Intro = () => {
    const particleSphereContainerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    const emailRef = useRef<HTMLAnchorElement>(null);
    const copyrightRef = useRef<HTMLParagraphElement>(null);
    const scrollDownRef = useRef<HTMLParagraphElement>(null);

    const underlineRef = useRef<HTMLSpanElement>(null);

    const { contextSafe } = useGSAP();

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Particle Sphere (Starts at 0s)
        tl.to(particleSphereContainerRef.current, {
            opacity: 1, // Full opacity for the black particles
            duration: 4,
            ease: "power2.inOut"
        }, 0);



        // 3. The Monolith Title using SplitText
        const split = new SplitText(titleRef.current, { type: 'chars' });

        // Pre-computation: Force GPU Hardware Acceleration
        gsap.set(split.chars, { willChange: 'transform, filter, opacity' });

        tl.fromTo(split.chars,
            { y: 50, opacity: 0, filter: 'blur(10px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.05, duration: 1.5, ease: 'power3.out' },
            1.0
        );


        const secondaryElements = [emailRef.current, copyrightRef.current, scrollDownRef.current].filter(Boolean); // Filter out any nulls

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

    const handleUnderlineHover = contextSafe((e: PointerEvent<HTMLAnchorElement>) => {
        if (e.pointerType !== 'mouse') return;
        gsap.to(underlineRef.current, {
            scaleX: 1,
            duration: 0.8,
            ease: "expo.out"
        });
    });

    const handleUnderlineLeave = contextSafe((e: PointerEvent<HTMLAnchorElement>) => {
        if (e.pointerType !== 'mouse') return;
        gsap.to(underlineRef.current, {
            scaleX: 0,
            duration: 0.8,
            ease: "expo.out"
        });
    });

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden bg-white">
            {/* Particle Sphere Background */}
            <div
                ref={particleSphereContainerRef}
                className="absolute z-10 opacity-0 pointer-events-none 
                    portrait:w-[160vw] portrait:h-[160vw] portrait:top-1/2 portrait:right-0 portrait:translate-x-1/2 portrait:-translate-y-1/2 
                    landscape:w-[80vw] landscape:h-[80vw] landscape:top-0 landscape:left-1/2 landscape:-translate-x-1/2 landscape:-translate-y-1/3 lg:landscape:-translate-y-1/2"
            >
                <ParticleSphere />
            </div>

            {/* Foreground Content Layer */}
            <div className="relative z-20 w-full h-full flex flex-col pointer-events-none items-center">
                <div className="w-full h-full flex flex-col justify-center max-w-vw-safe relative">
                    {/* Title */}
                    <div className="w-full flex flex-col justify-center -translate-y-[5vh] md:-translate-y-[8vh]">
                        <div className="ml-6 mr-6 font-inria-sans text-[min(15.5vw,22vh)] leading-[0.85] font-bold wrap-break-word md:ml-12 md:mr-12">
                            <h1 ref={titleRef} className="tracking-tight m-0 uppercase">
                                MARTIN GAO.
                            </h1>
                        </div>
                    </div>

                    {/* Scroll Down Nav and Secondary Information */}
                    <div className="absolute bottom-0 left-0 w-full h-auto font-semibold text-md lg:text-2xl flex flex-row justify-between items-center mb-6 pointer-events-auto">
                        <a href="mailto:gaolianzhan@gmail.com" ref={emailRef} target="_blank"
                            rel="noopener noreferrer"
                            className="relative group hidden md:ml-12 md:block"
                            onPointerEnter={handleUnderlineHover}
                            onPointerLeave={handleUnderlineLeave}>
                            gaolianzhan@gmail.com
                            <span ref={underlineRef} className="absolute left-0 -bottom-1 w-full h-[3px] bg-black" style={{ transformOrigin: 'left center', transform: 'scaleX(0)' }}></span>
                        </a>
                        <p ref={copyrightRef} className="ml-6">©2026</p>
                        <ScrollDown ref={scrollDownRef} className="mr-6 md:mr-12" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Intro;