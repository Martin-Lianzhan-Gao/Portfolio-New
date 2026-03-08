'use client'

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Description = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!titleRef.current || !containerRef.current || !textRef.current) return;

        // 1. 标题光柱/遮罩浮现动画 (Clipping Mask Reveal)
        const titleSplit = new SplitText(titleRef.current, {
            type: "lines,words",
            linesClass: "overflow-hidden"
        });

        gsap.fromTo(titleSplit.words,
            {
                y: "100%",
                opacity: 0,
                filter: 'blur(10px)',
                scale: 1.05
            },
            {
                y: "0%",
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1,
                stagger: 0.04,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // 2. 段落光束洗刷 (文字变色 + 位移)
        const textSplit = new SplitText(textRef.current.querySelectorAll('p'), { type: "words" });

        gsap.fromTo(textSplit.words,
            {
                color: "rgba(255,255,255,0.15)", // 淡灰白
                x: -15, // 向左轻微偏移
            },
            {
                color: "rgba(255,255,255,1)", // 成为纯白
                x: 0, // 位移归位
                stagger: 0.02,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 85%",
                    end: "bottom 55%",
                    scrub: 1, // 增加 1 秒惯性的平顺连贯
                }
            }
        );

        return () => {
            titleSplit.revert();
            textSplit.revert();
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative z-20 overflow-x-hidden bg-black w-full max-w-vw-safe pb-48 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="text-white mt-12 pt-36 pb-36 w-full flex flex-col justify-center min-h-[100dvh]">
                <div className="w-full ml-6 mr-6 md:ml-12 md:mr-12 mb-16">
                    <h1 ref={titleRef} className="uppercase text-[min(12vw,18vh)] font-inria-sans font-medium leading-[0.85] text-white">
                        Hello, <br />I'm Lianzhan.
                    </h1>
                </div>
                <div ref={textRef} className="font-inter text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] uppercase font-light break-words w-full flex flex-col items-end justify-center pr-6 md:pr-12 gap-12 lg:gap-20 leading-snug">
                    <p className="w-full md:w-5/6 lg:w-4/5 xl:w-2/3">
                        A Computer Science graduate dedicated to building high-performance web interfaces.
                        Merging technical precision with user-centered design to create scalable applications. Driven by curiosity and a constant pursuit of innovation.
                    </p>
                    <p className="w-full md:w-5/6 lg:w-4/5 xl:w-2/3">
                        I specialize in the full-stack development of modern web applications, with a strong focus on front-end performance and user experience. My technical expertise spans across the entire development lifecycle, from initial concept and UI/UX design to deployment and maintenance.
                    </p>
                    <p className="w-full md:w-5/6 lg:w-4/5 xl:w-2/3 text-2xl md:text-3xl mt-8 lowercase text-gray-400">
                        Scroll down to learn more about my work and experience.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Description;
