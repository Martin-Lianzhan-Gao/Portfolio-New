'use client'

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import Heart from "../components/icons/Heart";
import Star from "../components/icons/Star";
import { ArrowUpRight, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Description = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLAnchorElement>(null);

    useGSAP(() => {
        if (!titleRef.current || !containerRef.current || !textRef.current) return;

        // Title animation (Clipping Mask Reveal)
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
                stagger: 0.06,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Paragraph animation (Icon color transition and Text movement & scrubbing)
        // Split the text into words
        const textSplit = new SplitText(textRef.current.querySelectorAll('p'), { type: "words" });

        // Find the inline spans containing the icons
        const inlineSpans = textRef.current.querySelectorAll('span.inline-flex');
        const heartSpan = inlineSpans[0];
        const starSpan = inlineSpans[1];

        // Find the dot span
        const dotSpan = textRef.current.querySelector('span.bullet-dot');


        // Create a timeline for text scrubbing
        const scrubTl = gsap.timeline({
            scrollTrigger: {
                trigger: textRef.current,
                start: "top 85%",
                end: "bottom 55%",
                scrub: 1,
                fastScrollEnd: true,
                preventOverlaps: true
            }
        });

        scrubTl.fromTo(textSplit.words,
            {
                color: "rgba(255,255,255,0.15)",
                x: -25,
            },
            {
                x: 0,
                color: "rgba(255,255,255,1)",
                stagger: 0.02,
                ease: "power2.out",
            }, 0
        );

        // Initialize Icons
        if (heartSpan) {
            gsap.set(heartSpan, { color: "rgba(255,255,255,0.15)", scale: 0.5, opacity: 0 });
            gsap.set(heartSpan.querySelector('svg'), { width: '1em', height: '1em', display: 'inline' });
        }
        if (starSpan) {
            gsap.set(starSpan, { color: "rgba(255,255,255,0.15)", scale: 0.5, opacity: 0 });
            gsap.set(starSpan.querySelector('svg'), { width: '1em', height: '1em', display: 'inline' });
        }

        // Initialize Dot
        if (dotSpan) {
            gsap.set(dotSpan, { backgroundColor: "rgba(255,255,255,0.15)", scale: 0, opacity: 0 });
        }

        // Heart animation
        if (heartSpan) {
            scrubTl.to(heartSpan, {
                color: "#ff3366",
                scale: 1.1,
                opacity: 1,
                ease: "back.out(2)",
            }, "<30%");
        }
        // Star animation
        if (starSpan) {
            scrubTl.to(starSpan, {
                color: "#ffd700",
                scale: 1.1,
                rotation: 180,
                opacity: 1,
                ease: "power3.out",
            }, "<50%");
        }

        // Dot animation
        if (dotSpan) {
            scrubTl.to(dotSpan, {
                backgroundColor: "#E67B4E",
                scale: 1,
                opacity: 1,
                ease: "elastic.out(1.8, 0.4)",
            }, "<70%");
        }

        // Resume Button Entry Animation
        if (buttonRef.current) {
            gsap.fromTo(buttonRef.current,
                { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
                {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    duration: 0.8,
                    ease: "power3.in",
                    scrollTrigger: {
                        trigger: buttonRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        return () => {
            titleSplit.revert();
            textSplit.revert();
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative z-20 overflow-x-hidden bg-black w-full pb-16 md:pb-48 rounded-t-[2rem] flex flex-col items-center">
            <div className="text-white mt-12 pt-20 pb-20 md:pt-36 md:pb-36 w-full max-w-vw-safe flex flex-col justify-center min-h-[100dvh]">
                <div className="w-full ml-6 mr-6 md:ml-12 md:mr-12 mb-16">
                    <h1 ref={titleRef} className="uppercase text-[min(12vw,18vh)] font-inria-sans font-medium leading-[0.85] text-white">
                        More<br />About Me
                    </h1>
                </div>
                <div ref={textRef} className="font-inter text-3xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] uppercase font-light break-words w-full flex flex-col items-end justify-center pr-6 pl-6 md:pr-12 md:pl-12 gap-12 lg:gap-20 leading-snug">
                    <p className="w-full md:w-5/6 lg:w-4/5 xl:w-2/3">
                        A software engineer specializing in the end-to-end development of scalable web applications<span className="inline-flex items-center justify-center align-middle px-2 relative -top-[0.08em]"><Heart /></span>By merging robust full-stack architecture with precise UI/UX principles<span className="inline-flex items-center justify-center align-middle px-2 relative -top-[0.08em]"><Star /></span>I build high-performance, user-centered digital experiences.
                    </p>
                    <p className="w-full md:w-5/6 lg:w-4/5 xl:w-2/3">
                        Bachelor of Computer Science, The University of Queensland (2019-2024)<span className="bullet-dot inline-flex items-center justify-center align-middle w-[0.3em] h-[0.3em] rounded-full mx-2 relative -top-[0.05em]" /><br />
                        Translated CS fundamentals into production-ready applications through real-world projects and industry works.
                    </p>
                    <div className="mt-6 md:mt-12 w-full md:w-5/6 lg:w-4/5 xl:w-2/3">
                        <a ref={buttonRef} href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="border-2 border-white/70 px-4 py-2 md:px-6 md:py-3 xl:px-8 xl:py-4 inline-flex flex-row items-center gap-4 text-xl md:text-3xl lg:text-[1.3rem] xl:text-[1.8rem] text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer group">
                            <span className="font-regular tracking-wide font-inria-sans">DOWNLOAD RESUME</span>
                            <ArrowUpRight strokeWidth={1.8} strokeLinecap='butt'
                                strokeLinejoin='miter' className="w-[1em] h-[1em] translate-y-[0.03em] group-hover:translate-x-[0.1em] group-hover:-translate-y-[0.1em] transition-transform duration-300" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Description;
