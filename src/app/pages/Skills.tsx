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
                    +<br/>+<br/>+
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
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 px-6 md:px-12 py-16 md:py-24 max-w-vw-safe mx-auto items-center">
                                
                                {/* IDX + Title Block (Col 1 to 5) */}
                                <div className="lg:col-span-5 flex flex-col md:flex-row gap-6 lg:gap-12 items-start md:items-center lg:items-start">
                                    <span className="text-xs font-mono text-black/40 group-hover:text-[#E67B4E]/80 mt-1 md:mt-0 lg:mt-3 transition-colors duration-500 shrink-0">
                                        [0{index + 1}]
                                    </span>
                                    <div className="flex flex-col gap-4">
                                        <h2 className="font-inria-sans font-bold text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5rem] uppercase tracking-tighter text-black group-hover:text-white transition-colors duration-500 leading-none">
                                            {category.title}
                                        </h2>
                                        <p className="font-inter text-sm md:text-base font-light text-black/60 group-hover:text-white/60 max-w-md leading-relaxed transition-colors duration-500 pt-2 lg:pt-4">
                                            {category.introduction.en}
                                        </p>
                                    </div>
                                </div>

                                {/* Skills Block (Col 6 to 12) */}
                                <div className="lg:col-span-7 flex flex-wrap items-center content-center gap-y-4 md:gap-y-6">
                                    {category.skills.map((skill, sIdx) => (
                                        <div key={skill} className="flex items-center shrink-0">
                                            <span className="font-inria-sans text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-[0.2em] text-black group-hover:text-[#E67B4E] transition-colors duration-500">
                                                {skill}
                                            </span>
                                            {sIdx !== category.skills.length - 1 && (
                                                <span className="inline-flex w-[0.25em] h-[0.25em] bg-[#E67B4E] group-hover:bg-white/30 rounded-full mx-4 md:mx-6 shrink-0 transition-colors duration-500" />
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
