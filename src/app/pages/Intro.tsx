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
        <div id="top" className="relative z-20 w-full h-[100dvh] overflow-hidden bg-[#0a0a0a]"
            style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '4rem 4rem',
                backgroundPosition: 'center center'
            }}>

            {/* Field Organism Nebula Background */}
            <div
                ref={particleSphereContainerRef}
                className="absolute inset-0 w-full h-full z-10 opacity-0 pointer-events-none"
            >
                <OrganicNebula />
            </div>

            {/* Foreground Content Layer - The Editorial Sandwich Layout */}
            <div className="relative z-20 w-full h-[100dvh] flex flex-col items-center pointer-events-none">
                <div className="w-full h-full max-w-vw-safe px-6 md:px-12 flex flex-col justify-between">

                    {/* 1. TOP LAYER: Masthead (approx 20%) */}
                    <div className="w-full pt-28 md:pt-36 flex flex-col md:flex-row md:justify-between items-start md:items-end z-30">
                        {/* Title Main */}
                        <div className="flex-shrink-0">
                            <h1 ref={titleRef} className="font-inria-sans text-[min(13.5vw,16vh)] md:text-[min(10vw,14vh)] leading-[0.82] font-medium uppercase tracking-tight m-0 text-[#f5f5f7]">
                                MARTINGAO
                            </h1>
                        </div>

                        {/* Editorial Support Text Right/Bottom */}
                        <div ref={introTopRef} className="mt-5 md:mt-0 md:pb-2 lg:pb-4 max-w-[320px] md:max-w-[360px] lg:max-w-[420px] text-left md:text-right">
                            <p className="font-inter font-medium text-[13px] sm:text-[14px] md:text-[16px] lg:text-[20px] uppercase tracking-[0.08em] text-[#f5f5f7]/80 leading-[1.3] md:leading-[1.16]">
                                Full-stack engineer with <br className="hidden md:block" />a visual point of view
                            </p>
                        </div>
                    </div>

                    {/* 2. CENTER STAGE: Deep Space (approx 60%) */}
                    <div className="flex-1 w-full pointer-events-none flex flex-col items-center justify-center">
                        {/* 
                            This negative space embraces the ParticleSphere rendered underneath. 
                            Left entirely empty allowing maximum contrast and uninterrupted visual focus onto the manifold fields.
                        */}
                    </div>

                    {/* 3. BOTTOM LAYER: Signoff Footer (approx 20%) */}
                    <div ref={introBottomRef} className="w-full pb-8 md:pb-12 flex flex-col md:flex-row md:justify-between items-start md:items-end font-inter font-medium text-[12px] sm:text-[13px] md:text-[16px] lg:text-[18px] text-[#f5f5f7]/80 uppercase tracking-[0.1em] z-30 pointer-events-auto">

                        <div className="hidden md:block">
                            <p>Working across code and visual systems</p>
                        </div>

                        {/* Interactive Editorial Scroll Cue */}
                        <div className="group flex flex-row items-center gap-2 lg:gap-3 cursor-pointer hover:text-[#f5f5f7] transition-colors duration-300 pointer-events-auto mt-auto md:mt-0" onClick={() => {
                            const descSection = document.getElementById('about');
                            if (descSection) descSection.scrollIntoView({ behavior: 'smooth' });
                        }}>
                            <span>Scroll to explore</span>
                            <ArrowDown
                                strokeWidth={3.5}
                                className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 group-hover:text-[#e67b4e] group-hover:translate-y-1"
                            />
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Intro;