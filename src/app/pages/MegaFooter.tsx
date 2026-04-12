'use client'

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import EclipseMoon from '../components/models/EclipseMoon';

const MegaFooter = () => {
    const containerRef = useRef<HTMLElement>(null);
    const emailRef = useRef<HTMLAnchorElement>(null);
    const eclipseRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useGSAP(() => {
        // Subtle Mouse Parallax to separate the Email text Z-depth from the background Canvas
        const ctx = gsap.context(() => {
            // Skip parallax on touch devices — it's designed for continuous mouse tracking
            if (window.matchMedia('(pointer: coarse)').matches) return;

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

                if (eclipseRef.current) {
                    gsap.to(eclipseRef.current, {
                        x: -x * 0.5,
                        y: -y * 0.5,
                        duration: 4.5,
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
            <div ref={eclipseRef} className="absolute opacity-90 pointer-events-none mix-blend-screen z-0
                            portrait:w-[180vw] portrait:h-[180vw] portrait:top-1/2 portrait:right-0 portrait:translate-x-1/2 portrait:-translate-y-1/2
                            landscape:w-[130vh] landscape:h-[130vh] landscape:top-[-15vh] landscape:right-[-15vh] landscape:translate-x-0 landscape:translate-y-0">
                <div className="w-full h-full">
                    <EclipseMoon />
                </div>
            </div>

            {/* Macro Slogan Watermark (Joy Of Missing Out) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none z-0">
                <span className="font-inria-sans text-[12vw] font-bold text-[#f5f5f7]/[0.02] whitespace-nowrap tracking-tighter">
                    JOMO
                </span>
            </div>

            {/* Layout Grid (Z-index 10 / Safe area) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 pt-24 md:p-12 md:pt-32 lg:p-16 lg:pt-40">

                {/* Top Row: Navigation & Orbit */}
                <div className="flex w-full justify-between items-start md:items-center">

                    {/* Left: Swiss Grid Menu */}
                    <div className="flex gap-16 md:gap-32 items-start">
                        <span className="font-inter text-[11px] md:text-sm font-bold uppercase tracking-[0.2em] text-[#f5f5f7]/40">SOCIALS</span>
                        <div className="flex flex-col gap-4 font-inter text-[11px] md:text-sm font-bold uppercase tracking-[0.2em] text-[#f5f5f7]/70">
                            <a href="https://github.com/Martin-Lianzhan-Gao" target="_blank" rel="noopener noreferrer" className="hover:text-[#E67B4E] transition-colors duration-300 flex items-center gap-1 group/link max-w-fit cursor-pointer">
                                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 group-hover/link:-translate-y-[2px] group-hover/link:translate-x-[2px] transition-transform duration-300" strokeWidth={2.5} /> GitHub
                            </a>
                            <a href="https://www.linkedin.com/in/martin-lianzhan-gao" target="_blank" rel="noopener noreferrer" className="hover:text-[#E67B4E] transition-colors duration-300 flex items-center gap-1 group/link max-w-fit cursor-pointer">
                                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 group-hover/link:-translate-y-[2px] group-hover/link:translate-x-[2px] transition-transform duration-300" strokeWidth={2.5} /> LinkedIn
                            </a>
                        </div>
                    </div>

                    {/* Right: Circle Scroll Up (Rotary Simulation) */}
                    <div className="hidden md:flex flex-col items-center justify-center group cursor-pointer" onClick={(e) => scrollToSection('top', e)}>
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
                    <a ref={emailRef} href="mailto:gaolianzhan@gmail.com" className="font-inter font-light text-[12vw] tracking-tighter leading-[0.85] text-[#f5f5f7] hover:text-[#E67B4E] transition-colors duration-500 z-20">
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
