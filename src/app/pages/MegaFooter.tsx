'use client'

import React from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import CursorTarget from '../components/ui/CursorTarget'

const MegaFooter = () => {
    const scrollToSection = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer id='contact' className="relative w-full bg-[#f5f5f7] text-[#0a0a0a] pt-12 md:pt-24 xl:pt-32 pb-8 flex flex-col items-center overflow-hidden z-10">
            <div className="w-full max-w-vw-safe px-6 md:px-12 flex flex-col justify-between min-h-[40vh] md:min-h-[70vh]">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 lg:gap-0">

                    {/* Left: Manifesto */}
                    <div className="flex flex-col w-full md:flex-1 lg:flex-none lg:w-5/12 gap-4 md:gap-6 pr-0 md:pr-12 lg:pr-0">
                        <span className="font-inter text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#0a0a0a]/60">
                            Engineering & Visual Direction
                        </span>
                        <p className="font-inter text-md md:text-lg xl:text-2xl leading-tight tracking-tight">
                            Crafting high-performance digital experiences where structural precision meets fluid motion.
                        </p>
                    </div>

                    {/* Right: Navigation Grid */}
                    <div className="flex w-full md:w-auto lg:w-5/12 flex-col md:flex-row md:justify-end gap-8 md:gap-24 xl:gap-32">
                        <div className="flex flex-row md:flex-col justify-start items-baseline md:items-start gap-12 md:gap-6">
                            <span className="font-inter text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#0a0a0a]/40 w-24 md:w-auto shrink-0">Menu</span>
                            <div className="flex flex-row md:flex-col gap-12 md:gap-6">
                                <div onClick={(e) => scrollToSection('about', e)} className="inline-flex items-center gap-1 font-inter text-sm lg:text-md 2xl:text-lg hover:opacity-50 transition-opacity cursor-pointer group">
                                    About <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <div onClick={(e) => scrollToSection('works', e)} className="inline-flex items-center gap-1 font-inter text-sm lg:text-md 2xl:text-lg hover:opacity-50 transition-opacity cursor-pointer group">
                                    Works <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row md:flex-col justify-start items-baseline md:items-start gap-12 md:gap-6">
                            <span className="font-inter text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#0a0a0a]/40 w-24 md:w-auto shrink-0">Socials</span>
                            <div className="flex flex-row md:flex-col gap-12 md:gap-6">
                                <a href="mailto:martingaoorglz@gmail.com" className="inline-flex items-center gap-1 font-inter text-sm lg:text-md 2xl:text-lg hover:opacity-50 transition-opacity group">
                                    Email <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                                <a href="https://github.com/Martin-Lianzhan-Gao" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-inter text-sm lg:text-md 2xl:text-lg hover:opacity-50 transition-opacity group">
                                    GitHub <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Massive Typographic Brand */}
                <div className="w-full mt-32 md:mt-10 lg:mt-24 2xl:mt-32 flex flex-col justify-end @container">
                    <CursorTarget mode="combo" label="LET'S TALK">
                        <h1 className="font-inria-sans font-bold text-[20cqw] md:text-[19.5cqw] leading-[0.8] tracking-tighter uppercase text-center md:text-left select-none cursor-pointer transition-opacity w-full whitespace-nowrap pb-2 md:pb-4">
                            MARTINGAO
                        </h1>
                    </CursorTarget>
                </div>

            </div>
        </footer>
    )
}

export default MegaFooter
