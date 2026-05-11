'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { skillsData } from '../data/skillsData'

gsap.registerPlugin(ScrollTrigger)

// Flatten all skills into individual row pools
const allSkills = skillsData.flatMap(category => category.skills)

// Split skills into rows for marquee display
const rows = [
    allSkills.slice(0, 9),   // Core Frontend
    allSkills.slice(9, 14),  // Creative & Interactive
    allSkills.slice(14, 26), // Backend & Infrastructure
    allSkills.slice(26),     // Workflow & Engineering
]

const MARQUEE_DURATION = 120

const COPIES = 4

// 提取到组件外部，避免每次渲染重建函数引用导致 React 卸载/重挂载子树
const SkillItem = ({ skill }: { skill: string }) => (
    <div className="flex items-center shrink-0">
        <span className="font-inter text-[2rem] md:text-[3rem] lg:text-[4rem] xl:text-[5rem] 2xl:text-[6rem] font-light text-[#0a0a0a] tracking-wide px-4 md:px-6 lg:px-8 xl:px-10">
            {skill}
        </span>
        <span className="font-inter text-[2rem] md:text-[3rem] lg:text-[4rem] xl:text-[5rem] 2xl:text-[6rem] font-extralight text-[#0a0a0a]/20 select-none">
            +
        </span>
    </div>
)

const SkillSet = ({ skills }: { skills: string[] }) => (
    <div className="flex items-center shrink-0">
        {skills.map((skill, i) => (
            <SkillItem key={i} skill={skill} />
        ))}
    </div>
)

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const rowRefs = useRef<(HTMLDivElement | null)[]>([])

    useGSAP(() => {
        const tweens: gsap.core.Tween[] = []

        rowRefs.current.forEach((row, idx) => {
            if (!row) return

            const goesLeft = idx % 2 === 0

            const tween = goesLeft
                ? gsap.fromTo(row,
                    { xPercent: 0 },
                    { xPercent: -50, repeat: -1, duration: MARQUEE_DURATION, ease: "none", paused: true }
                )
                : gsap.fromTo(row,
                    { xPercent: -50 },
                    { xPercent: 0, repeat: -1, duration: MARQUEE_DURATION, ease: "none", paused: true }
                )

            tweens.push(tween)
        })

        // 离屏暂停所有 marquee 动画
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            onEnter: () => tweens.forEach(t => t.play()),
            onLeave: () => tweens.forEach(t => t.pause()),
            onEnterBack: () => tweens.forEach(t => t.play()),
            onLeaveBack: () => tweens.forEach(t => t.pause()),
        })

    }, { scope: containerRef })

    return (
        <section
            ref={containerRef}
            data-header-theme="dark"
            className="relative z-20 w-full bg-[#f5f5f7] overflow-hidden pt-16 sm:pt-20 md:pt-28 lg:pt-40 xl:pt-48 pb-20 md:pb-28 lg:pb-16 xl:pb-28 2xl:pb-36 flex flex-col justify-center"
        >
            <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
                {rows.map((skills, rowIdx) => (
                    <div
                        key={rowIdx}
                        ref={(el) => { rowRefs.current[rowIdx] = el }}
                        className="flex w-max whitespace-nowrap will-change-transform"
                    >
                        {Array.from({ length: COPIES }).map((_, copyIdx) => (
                            <SkillSet key={copyIdx} skills={skills} />
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Skills
