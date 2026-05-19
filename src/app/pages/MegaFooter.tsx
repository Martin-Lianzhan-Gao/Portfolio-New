'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { ArrowUpRight } from 'lucide-react'
import CursorTarget from '../components/ui/CursorTarget'

const FooterStatue = dynamic(() => import('../components/models/FooterStatue'), { ssr: false })

const MegaFooter = () => {

    return (
        <footer id='contact' data-header-theme="dark" className="relative w-full bg-[#f5f5f7] text-[#0a0a0a] flex flex-col items-center z-20">

            {/* Main CTA Section */}
            <div className="w-full max-w-vw-safe px-6 pb-14 md:px-12 pt-16 md:pt-20 xl:pt-28 md:pb-20 xl:pb-32 flex flex-col">

                {/* Top Row: Availability Label + Social Links */}
                <div className="flex flex-row justify-between items-center mb-14 md:mb-18 lg:mb-20">
                    <span className="font-inter text-[10px] md:text-xs xl:text-sm font-bold uppercase tracking-widest text-[#0a0a0a] border-2 border-[#0a0a0a] rounded-full px-4 py-2">
                        Available <span className='max-[400px]:hidden inline-block'>Now</span>
                    </span>

                    <div className="flex flex-row items-center gap-6 md:gap-8 font-bold">
                        <CursorTarget mode="pointer">
                            <a
                                href="mailto:martingaoorglz@gmail.com"
                                className="font-inter text-xs md:text-sm uppercase tracking-[0.2em] text-[#0a0a0a] flex items-center gap-1.5 group"
                            >
                                Email <ArrowUpRight strokeWidth={3} className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                            </a>
                        </CursorTarget>
                        <CursorTarget mode="pointer">
                            <a
                                href="https://github.com/Martin-Lianzhan-Gao"
                                target="_blank"
                                rel="noreferrer"
                                className="font-inter text-xs md:text-sm uppercase tracking-[0.2em] text-[#0a0a0a] flex items-center gap-1.5 group"
                            >
                                GitHub <ArrowUpRight strokeWidth={3} className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                            </a>
                        </CursorTarget>
                    </div>
                </div>

                {/* Giant CTA Text + 3D Statue */}
                <CursorTarget mode="combo" label="Let's Talk" icon="arrow-up-right" panelBg='#eaeaec' contentColor='#0a0a0a'>
                    <a href="mailto:martingaoorglz@gmail.com" className="group block select-none">
                        <div className="relative">
                            <h2 className="font-inria-sans font-bold text-[18vw] md:text-[16.5vw] lg:text-[18vw] 2xl:text-[13.5vw] leading-[0.85] tracking-tighter uppercase cursor-pointer">
                                <span className="inline-block transition-colors duration-700 group-hover:text-[#0a0a0a]/80">SAY HELLO</span>
                            </h2>

                            {/* 3D Socrates Statue — absolute overlay, vertically centered with title */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                <Suspense fallback={null}>
                                    <FooterStatue />
                                </Suspense>
                            </div>
                        </div>
                    </a>
                </CursorTarget>
            </div>

        </footer >
    )
}

export default MegaFooter

