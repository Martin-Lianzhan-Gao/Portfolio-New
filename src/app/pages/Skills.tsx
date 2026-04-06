'use client'

import React from 'react'
import { skillsData } from '../data/skillsData'

const Skills = () => {
    return (
        <div className="relative z-30 w-full bg-[#F5F5F7] -mt-8 md:-mt-12 overflow-hidden flex" id="skills-section">

            {/* The structural border top separating from Description */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-black/10" />

            {/* Left Vertical Spine (Desktop only - builds spatial architecture) */}
            <div className="hidden md:flex w-24 border-r border-black/20 shrink-0 relative items-center justify-center z-10 pt-32 pb-32">
                {/* Crosshairs & Meta */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-black/30 font-mono text-xs text-center leading-[2] tracking-widest">
                    +<br />+<br />+
                </div>

                {/* Huge Vertical Rotated Text */}
                <div className="-rotate-90 origin-center whitespace-nowrap opacity-10">
                    <span className="font-inria-sans font-bold text-5xl lg:text-7xl uppercase tracking-[0.2em] text-black">
                        SKILLS / EXPERTISE
                    </span>
                </div>

                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 font-mono text-[10px] text-black/30 -rotate-90 origin-center whitespace-nowrap tracking-widest">
                    [SYS.READY_2026]
                </div>
            </div>

            {/* Right Data Matrix Grid */}
            <div className="flex-1 flex flex-col pb-0 md:pb-0 pt-0 md:pt-0">

                {/* Engineering Top Bar */}
                <div className="w-full border-b border-black/20 px-6 md:px-12 py-3 flex justify-between items-center text-[10px] md:text-sm font-mono uppercase tracking-widest text-black/50">
                    <span>Engineering_Log</span>
                    <span className="hidden md:inline">ARCHITECTURE / MANIFESTO</span>
                    <span>REV_02/2026</span>
                </div>

                {/* Categories */}
                <div className="w-full flex flex-col">
                    {skillsData.map((category, index) => (
                        <div key={category.title} className="group relative border-b border-black/20 hover:bg-[#0d0d0d] transition-colors duration-500 ease-out cursor-default">
                            {/* Rigid Grid logic: 1 col on mobile, 2 tracks on tablet (IDX + Content), 3 tracks on Desktop (IDX + Intro + Skills) */}
                            <div className="grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1.2fr)_minmax(0,1fr)] gap-x-6 lg:gap-x-12 gap-y-6 md:gap-y-10 lg:gap-y-0 px-6 md:px-12 py-16 lg:py-24 max-w-vw-safe mx-auto items-start lg:items-center">
                                
                                {/* 1. IDX Block - Fixed auto sizing */}
                                <div className="text-xs font-mono text-black/40 group-hover:text-[#E67B4E]/80 transition-colors duration-500 pt-1 lg:pt-0 shrink-0 md:col-start-1 md:row-start-1 lg:self-center">
                                    [0{index + 1}]
                                </div>

                                {/* 2. Title & Intro Block */}
                                {/* Forced to col 2 so it aligns perfectly next to the IDX instead of overlapping horizontally */}
                                <div className="flex flex-col gap-4 md:col-start-2 md:row-start-1 lg:col-start-2 lg:row-start-1 pr-0 lg:pr-8">
                                    {/* break-words and minmax grid track physically prevents INFRASTRUCTURE from blowing past the center split */}
                                    <h2 className="font-inria-sans font-bold text-3xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] 2xl:text-[4.5rem] uppercase tracking-tighter text-black group-hover:text-white transition-colors duration-500 leading-[1.05] break-words">
                                        {category.title}
                                    </h2>
                                    <p className="font-inter text-sm md:text-base font-light text-black/60 group-hover:text-white/60 max-w-xl leading-relaxed transition-colors duration-500 pt-2">
                                        {category.introduction.en}
                                    </p>
                                </div>

                                {/* 3. Skills Block */}
                                {/* On iPad (md): Drops to row 2, BUT stays explicitly in col 2! This guarantees it lines up perfectly under the Intro instead of hitting the absolute left screen edge! */}
                                <div className="flex flex-wrap items-center content-start lg:content-center gap-y-4 md:gap-y-6 pt-2 lg:pt-0 md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-1">
                                    {category.skills.map((skill, sIdx) => (
                                        <div key={skill} className="flex items-center shrink-0">
                                            <span className="font-inria-sans text-base md:text-lg lg:text-xl xl:text-2xl font-bold uppercase tracking-[0.2em] text-black group-hover:text-[#E67B4E] transition-colors duration-500">
                                                {skill}
                                            </span>
                                            {sIdx !== category.skills.length - 1 && (
                                                <span className="inline-flex w-[0.25em] h-[0.25em] bg-[#E67B4E] group-hover:bg-white/30 rounded-full mx-3 md:mx-5 shrink-0 transition-colors duration-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}

export default Skills
