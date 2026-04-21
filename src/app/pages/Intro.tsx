'use client'

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import OrganicNebula from '../components/models/OrganicNebula';

gsap.registerPlugin(ScrollTrigger);

const Intro = () => {
    const particleSphereContainerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const introTopRef = useRef<HTMLDivElement>(null);
    const introBottomRef = useRef<HTMLDivElement>(null);

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

            {/* Depth Content Layer - Z-index 0 to sit behind the Nebula */}
            <div className="relative z-0 w-full h-[100dvh] flex flex-col items-center pointer-events-none">
                <div className="w-full h-full max-w-vw-safe px-6 md:px-12 flex flex-col justify-between">

                    {/* TOP LAYER: Big Title in the blank space */}
                    <div className="w-full pt-[20vh] md:pt-[14vh] flex flex-col items-center justify-center text-center">
                        <h1 ref={titleRef} className="font-inria-sans font-medium text-[17vw] lg:text-[14vw] 2xl:text-[12vw] min-[1800px]:text-[10vw] uppercase tracking-tight text-[#f5f5f7]/80 leading-none">
                            MARTINGAO<span className="text-[#e67b4e]">.</span>
                        </h1>
                        <div ref={introTopRef} className="mt-4 md:mt-6">
                            <p className="font-inter font-light text-[12px] md:text-[16px] uppercase tracking-[0.3em] text-[#f5f5f7]/60 ml-[0.3em]">
                                ENGINEER <span className="text-[#e67b4e]/60 mx-2">/</span> VISUALS
                            </p>
                        </div>
                    </div>

                    {/* BOTTOM LAYER: Grounding Metadata & Scroll */}
                    <div ref={introBottomRef} className="w-full pb-8 md:pb-12 flex flex-row justify-between items-end font-inter font-light text-[10px] md:text-[13px] uppercase tracking-[0.2em] text-[#f5f5f7]/50 pointer-events-auto">

                        {/* Bottom Left: Location / Status (Hidden on very small screens to avoid clutter) */}
                        <div className="text-left">
                            <p className="leading-[1.6]">
                                BASED IN BNE, AUS <br />
                                <span className="text-[#f5f5f7]/40">WORKING WORLDWIDE</span>
                            </p>
                        </div>

                        {/* Bottom Right: Scroll Action */}
                        <div className="group flex flex-row items-center gap-3 cursor-pointer hover:text-[#f5f5f7] transition-colors duration-300 ml-auto" onClick={() => {
                            const descSection = document.getElementById('about');
                            if (descSection) descSection.scrollIntoView({ behavior: 'smooth' });
                        }}>
                            <span className="hidden md:block">DISCOVER</span>
                            <ArrowDown
                                strokeWidth={2}
                                className="w-4 h-4 text-[#f5f5f7]/50 transition-all duration-300 group-hover:text-[#e67b4e] group-hover:translate-y-1"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Intro;