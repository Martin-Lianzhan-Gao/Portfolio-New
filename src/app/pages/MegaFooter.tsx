'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import EclipseMoon from '../components/models/EclipseMoon';

const MegaFooter = () => {
    const containerRef = useRef<HTMLElement>(null);
    const emailRef = useRef<HTMLAnchorElement>(null);

    useGSAP(() => {
        // Subtle Mouse Parallax to separate the Email text Z-depth from the background Canvas
        const ctx = gsap.context(() => {
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const x = (clientX / window.innerWidth - 0.5) * 30;
                const y = (clientY / window.innerHeight - 0.5) * 30;

                if (emailRef.current) {
                    gsap.to(emailRef.current, {
                        x: x,
                        y: y,
                        duration: 1.5,
                        ease: "power2.out"
                    });
                }
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }, containerRef);
        return () => ctx.revert();
    }, { scope: containerRef });

    return (
        <footer ref={containerRef} className="fixed bottom-0 left-0 w-full h-[100dvh] z-0 bg-[#000000] text-[#f5f5f7] flex flex-col justify-between overflow-hidden">

            {/* The Void: Cinematic Eclipse Asymmetric Anchor */}
            {/* Massively scaled and anchored to the top-right corner, clipping off-screen */}
            <div className="absolute top-[-10%] right-[-10%] w-[60vmax] h-[60vmax] opacity-90 pointer-events-none mix-blend-screen z-0 scale-[1.2]">
                <div className="w-full h-full transform translate-x-[5%] -translate-y-[5%]">
                    <EclipseMoon />
                </div>
            </div>

            {/* Macro Watermark (The Texture) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none z-0">
                <span className="font-inria-sans text-[12vw] font-bold text-[#f5f5f7]/[0.02] whitespace-nowrap tracking-tighter">
                    ARCHITECTURE
                </span>
            </div>

            {/* Layout Grid (Z-index 10 / Safe area) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 pt-24 md:p-12 md:pt-32 lg:p-16 lg:pt-40">

                {/* Top Row: Navigation & Orbit */}
                <div className="flex w-full justify-between items-start">

                    {/* Left: Swiss Grid Menu */}
                    <div className="flex gap-16 md:gap-32">
                        <span className="font-inter text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-[#f5f5f7]/40">Menu</span>
                        <div className="flex flex-col gap-3 font-inter text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-[#f5f5f7]/70">
                            <a href="#works" className="hover:text-[#E67B4E] transition-colors duration-300">↗ Work</a>
                            <a href="#about" className="hover:text-[#E67B4E] transition-colors duration-300">↗ About</a>
                            <a href="mailto:hello@martingao.com" className="hover:text-[#E67B4E] transition-colors duration-300">↗ Contact</a>
                        </div>
                    </div>

                    {/* Right: Circle Scroll Up (Rotary Simulation) */}
                    <div className="hidden md:flex flex-col items-center justify-center group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative w-24 h-24 flex items-center justify-center rounded-full border border-[#f5f5f7]/15 group-hover:border-[#E67B4E]/50 transition-colors duration-500 bg-[#f5f5f7]/[0.01] backdrop-blur-sm">
                            <span className="font-inria-sans text-xl font-light text-[#f5f5f7]/50 group-hover:text-[#E67B4E] group-hover:-translate-y-1 transition-all duration-500">↑</span>
                            {/* Curved Text Simulation via SVG */}
                            <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] opacity-30 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 100 100">
                                <path id="curve" d="M 50 10 A 40 40 0 1 1 49.9 10" fill="transparent" />
                                <text className="font-inter text-[9.5px] uppercase tracking-[0.25em]" fill="currentColor">
                                    <textPath href="#curve" startOffset="0%">
                                        BACK TO TOP • BACK TO TOP •
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                    </div>

                </div>

                {/* Center Row: Massive Email CTO */}
                <div className="flex w-full justify-start items-center flex-1 py-10 md:py-0">
                    <a ref={emailRef} href="mailto:[EMAIL_ADDRESS]" className="font-inter font-light text-[12vw] tracking-tighter leading-[0.85] text-[#f5f5f7] hover:text-[#E67B4E] transition-colors duration-500 z-20">
                        gaolianzhan<br />@gmail.com
                    </a>
                </div>

                {/* Bottom Row: Metadata Grid */}
                <div className="flex w-full flex-col md:flex-row justify-between items-start md:items-end gap-12 md:gap-0 pb-4 border-t border-[#f5f5f7]/15 pt-8 mt-12">

                    {/* Left Bottom */}
                    <div className="flex gap-16 md:gap-32 w-full md:w-auto">
                        <div className="flex flex-col gap-3">
                            <span className="font-inter text-[10px] md:text-[11px] font-bold text-[#f5f5f7]/40 uppercase tracking-[0.2em]">Local Time</span>
                            <span className="font-inter text-[10px] md:text-sm font-light text-[#f5f5f7]/70 uppercase tracking-[0.1em]">BNE, AUS</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="font-inter text-[10px] md:text-[11px] font-bold text-[#f5f5f7]/40 uppercase tracking-[0.2em]">Status</span>
                            <span className="font-inter text-[10px] md:text-sm font-light text-[#f5f5f7]/70 uppercase tracking-[0.1em] flex items-center gap-2">
                                <span className="inline-flex w-2 h-2 rounded-full bg-green-500/80 animate-pulse"></span>
                                Available
                            </span>
                        </div>
                    </div>

                    {/* Right Bottom */}
                    <div className="text-left md:text-right flex flex-col gap-3">
                        <span className="font-inter text-[10px] md:text-[11px] font-bold text-[#f5f5f7]/40 uppercase tracking-[0.2em]">© 2026</span>
                        <span className="font-inter text-[10px] md:text-sm font-light text-[#f5f5f7]/70 uppercase tracking-[0.1em]">Martin Gao. All Rights Reserved.</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default MegaFooter;
