'use client'

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import OrganicNebula from '../components/models/OrganicNebula';
import { useCursorStore } from "@/hooks/useCursorStore"

gsap.registerPlugin(ScrollTrigger);

const Intro = () => {
    const particleSphereContainerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const introTopRef = useRef<HTMLDivElement>(null);
    const introBottomRef = useRef<HTMLDivElement>(null);

    const setHovering = useCursorStore(state => state.setHovering);

    // Initial Appearance Animation
    useGSAP(() => {
        const tl = gsap.timeline();

        if (particleSphereContainerRef.current) {
            // 1. Scene appears slowly from darkness
            tl.fromTo(particleSphereContainerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 2.8, ease: "power2.inOut", delay: 0.5 }
            );

            // 2. Editorial Top Layer Entrance
            tl.fromTo([titleRef.current, introTopRef.current].filter(Boolean),
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", stagger: 0.1 },
                "-=1.5"
            );

            // 3. Editorial Bottom Layer Entrance
            if (introBottomRef.current) {
                tl.fromTo(introBottomRef.current,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
                    "-=1.0"
                );
            }
        }
    }, []);

    // Handle Mobile Height Jitter (Fix for iOS Chrome/Safari URL bar hide/show)
    useGSAP(() => {
        ScrollTrigger.config({
            ignoreMobileResize: true
        });

        const setFixedMobileHeight = () => {
            const el = document.getElementById('top');
            if (!el) return;

            if (window.innerWidth < 768) {
                gsap.set(el, {
                    height: window.innerHeight
                });
            } else {
                gsap.set(el, { clearProps: "height" });
            }
        };

        setFixedMobileHeight();
        window.addEventListener('resize', setFixedMobileHeight);
        return () => window.removeEventListener('resize', setFixedMobileHeight);
    }, []);

    return (
        <div id="top" className="relative z-20 w-full h-[100dvh] overflow-hidden bg-[#0a0a0a]">
            {/* Grid Layer with Fade-out Mask */}
            <div className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '4rem 4rem',
                    backgroundPosition: 'center center',
                    maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
                }}
            />

            {/* Field Organism Nebula Background */}
            <div
                ref={particleSphereContainerRef}
                className="absolute inset-0 w-full h-full z-10 opacity-0 pointer-events-none"
            >
                <OrganicNebula />
            </div>

            {/* Depth Content Layer (Title) - Z-index 0 to sit behind the Nebula */}
            <div className="absolute top-0 left-0 w-full h-[100dvh] flex flex-col items-center pointer-events-none z-0">
                <div className="w-full max-w-vw-safe px-6 md:px-12 pt-[20vh] md:pt-[14vh] flex flex-col items-center text-center">
                    <h1 ref={titleRef} className="font-inria-sans font-medium text-[17vw] lg:text-[14vw] 2xl:text-[12vw] min-[1800px]:text-[10vw] uppercase tracking-tight text-[#f5f5f7]/80 leading-none">
                        MARTINGAO<span className="text-[#e67b4e]">.</span>
                    </h1>
                    <div ref={introTopRef} className="mt-4 md:mt-6">
                        <p className="font-inter font-light text-[14px] md:text-[18px] xl:text-[20px] uppercase tracking-[0.3em] text-[#f5f5f7]/70 ml-[0.3em]">
                            ENGINEER <span className="text-[#e67b4e]/60 mx-2">•</span> VISUALS
                        </p>
                    </div>
                </div>
            </div>

            {/* Interactive Content Layer (Bottom) - Z-index 30 to sit in front of the Nebula */}
            <div className="absolute top-0 left-0 w-full h-[100dvh] flex flex-col items-center pointer-events-none z-30">
                <div className="w-full h-full max-w-vw-safe px-6 md:px-12 pb-8 md:pb-12 flex flex-col justify-end">
                    {/* BOTTOM LAYER: Grounding Metadata & Scroll */}
                    <div ref={introBottomRef} className="w-full flex flex-row justify-between items-end font-inter font-light text-[12px] md:text-[13px] xl:text-[15px] uppercase tracking-[0.2em] text-[#f5f5f7]/50 pointer-events-auto">

                        {/* Bottom Left: Location / Status */}
                        <div className="text-left">
                            <p className="leading-[1.6]">
                                BASED IN BNE, AUS <br />
                                <span className="text-[#f5f5f7]/40">WORKING WORLDWIDE</span>
                            </p>
                        </div>

                        {/* Bottom Right: Scroll Action */}
                        <div className="group flex flex-row items-center gap-3 cursor-pointer ml-auto" 
                             onPointerEnter={() => setHovering(true)}
                             onPointerLeave={() => setHovering(false)}
                             onClick={() => {
                            const descSection = document.getElementById('about');
                            if (descSection) {
                                setHovering(false); // Reset hovering on click as page scrolls
                                descSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}>
                            <span className="hidden md:block text-[#f5f5f7]/50 group-hover:text-[#f5f5f7] transition-colors duration-500">DISCOVER</span>
                            <div className="relative overflow-hidden w-4 h-4 flex items-center justify-center">
                                {/* First Arrow (Flies down and out) */}
                                <ArrowDown
                                    strokeWidth={3}
                                    className="absolute w-4 h-4 text-[#f5f5f7]/50 transition-all duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:text-[#e67b4e] group-hover:translate-y-[150%]"
                                />
                                {/* Second Arrow (Flies down and in from top) */}
                                <ArrowDown
                                    strokeWidth={3}
                                    className="absolute w-4 h-4 text-[#e67b4e] -translate-y-[150%] transition-all duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Intro;