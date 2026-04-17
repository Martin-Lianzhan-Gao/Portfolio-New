'use client'

import { useRef, PointerEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollDown from "../components/ui/ScrollDown";
import ParticleSphere from "../components/models/ParticleSphere";

gsap.registerPlugin(SplitText, ScrollTrigger);

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

        // Particle Sphere (Starts at 0s)
        tl.to(particleSphereContainerRef.current, {
            opacity: 1, // Full opacity for the black particles
            duration: 4,
            ease: "power2.inOut"
        }, 0);

        // The Monolith Title using SplitText
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
                "-=2.0" // Overlap value to start BEFORE the Title animation fully completes
            );
        }

        // Strict Cleanup Discipline
        return () => {
            split.revert();
        };
    });

    // Handle Mobile Height Jitter (Fix for iOS Chrome/Safari URL bar hide/show)
    useGSAP(() => {
        // Prevent ScrollTrigger from recalculating too aggressively on fast mobile scrolls
        ScrollTrigger.config({
            ignoreMobileResize: true // true ignores resize events triggered by UI bar hide/show
        });

        const setFixedMobileHeight = () => {
            const el = particleSphereContainerRef.current?.parentElement;
            if (!el) return;

            if (window.innerWidth < 768) { // Only apply to mobile devices
                gsap.set(el, {
                    height: window.innerHeight // Snap to exact absolute pixel height to avoid 100dvh changing
                });
            } else {
                gsap.set(el, { clearProps: "height" }); // revert to CSS on desktop
            }
        };

        setFixedMobileHeight();
        window.addEventListener('resize', setFixedMobileHeight);
        return () => window.removeEventListener('resize', setFixedMobileHeight);
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
        <div id="top" className="sticky top-0 z-10 w-full h-[100dvh] overflow-hidden bg-white">
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
                    <div className="w-full px-6 md:px-12 text-center -translate-y-[5vh] md:-translate-y-[8vh]">
                        <h1 ref={titleRef} className="font-inria-sans text-[min(15.5vw,22vh)] leading-[0.85] font-bold uppercase tracking-tight m-0 break-words">
                            MARTIN GAO.
                        </h1>
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