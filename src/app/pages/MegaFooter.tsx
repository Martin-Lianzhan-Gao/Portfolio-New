'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import CursorTarget from '../components/ui/CursorTarget'

const MegaFooter = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer id='contact' className="relative w-full bg-[#f5f5f7] text-[#0a0a0a] flex flex-col items-center z-20">

            {/* Main CTA Section */}
            <div className="w-full max-w-vw-safe px-6 md:px-12 pt-16 md:pt-20 xl:pt-28 pb-20 md:pb-32 lg:pb-40 flex flex-col">

                {/* Top Row: Availability Label + Social Links */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-0 mb-12 md:mb-16 lg:mb-20">
                    <span className="font-inter text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#0a0a0a]/40">
                        Available for work
                    </span>

                    <div className="flex flex-row items-center gap-6 md:gap-8">
                        <CursorTarget mode="pointer">
                            <a
                                href="mailto:martingaoorglz@gmail.com"
                                className="font-inter text-xs md:text-sm uppercase tracking-[0.2em] text-[#0a0a0a]/50 hover:text-[#0a0a0a] transition-colors duration-500 flex items-center gap-1.5 group"
                            >
                                Email <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                            </a>
                        </CursorTarget>
                        <CursorTarget mode="pointer">
                            <a
                                href="https://github.com/Martin-Lianzhan-Gao"
                                target="_blank"
                                rel="noreferrer"
                                className="font-inter text-xs md:text-sm uppercase tracking-[0.2em] text-[#0a0a0a]/50 hover:text-[#0a0a0a] transition-colors duration-500 flex items-center gap-1.5 group"
                            >
                                GitHub <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                            </a>
                        </CursorTarget>
                    </div>
                </div>

                {/* Giant CTA Text — mailto anchor */}

                <a href="mailto:martingaoorglz@gmail.com" className="group block select-none">
                    <h2 className="font-inria-sans font-bold text-[14vw] md:text-[11vw] lg:text-[9.5vw] leading-[0.85] tracking-tighter uppercase cursor-pointer">
                        <CursorTarget mode="combo" label="Just Click" icon="arrow-up-right">
                            <span className="inline-block transition-colors duration-700 group-hover:text-[#0a0a0a]/80">LET'S TALK</span>
                        </CursorTarget>
                    </h2>
                </a>


            </div>

            {/* Bottom Divider */}
            <div className="w-full max-w-vw-safe px-6 md:px-12">
                <div className="w-full h-px bg-[#0a0a0a]/10" />
            </div>

            {/* Credits Bar */}
            <div className="w-full max-w-vw-safe px-6 md:px-12 py-6 md:py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
                <span className="font-inter text-[10px] md:text-xs text-[#0a0a0a]/25 uppercase tracking-[0.2em]">
                    © {currentYear} MARTINGAO
                </span>
                <span className="font-inter text-[10px] md:text-xs text-[#0a0a0a]/20 uppercase tracking-[0.2em]">
                    Based in Brisbane, AUS
                </span>
            </div>

        </footer >
    )
}

export default MegaFooter
