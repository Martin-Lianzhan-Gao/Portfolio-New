'use client'

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import Heart from "../components/icons/Heart";
import Star from "../components/icons/Star";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Description = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

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
        const inlineSpans = textRef.current.querySelectorAll('span.inline-block');
        const heartSpan = inlineSpans[0];
        const starSpan = inlineSpans[1];

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

        // Text animation executed on scroll
        scrubTl.fromTo(textSplit.words,
            {
                color: "rgba(255,255,255,0.15)",
                x: -15,
            },
            {
                color: "rgba(255,255,255,1)",
                x: 0,
                stagger: 0.02,
                ease: "power2.out",
            }, 0
        );

        // Initialize Icons
        if (heartSpan) {
            gsap.set(heartSpan, { color: "rgba(255,255,255,0.15)", scale: 0.5 });
            gsap.set(heartSpan.querySelector('svg'), { width: '1em', height: '1em', display: 'inline' });
        }
        if (starSpan) {
            gsap.set(starSpan, { color: "rgba(255,255,255,0.15)", scale: 0.5 });
            gsap.set(starSpan.querySelector('svg'), { width: '1em', height: '1em', display: 'inline' });
        }

        // Heart animation
        if (heartSpan) {
            scrubTl.to(heartSpan, {
                color: "#ff3366",
                scale: 1.2,
                ease: "power2.out",
            }, "<30%"); // approx middle of the text animation
        }
        // Star animation
        if (starSpan) {
            scrubTl.to(starSpan, {
                color: "#ffd700",
                scale: 1.2,
                rotation: 180, // slightly rotate it for emphasis
                ease: "power2.out",
            }, "<90%"); // towards the end of the text animation
        }

        return () => {
            titleSplit.revert();
            textSplit.revert();
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative z-20 overflow-x-hidden bg-black w-full pb-48 rounded-t-[2rem] flex flex-col items-center">
            <div className="text-white mt-12 pt-36 pb-36 w-full max-w-vw-safe flex flex-col justify-center min-h-[100dvh]">
                <div className="w-full ml-6 mr-6 md:ml-12 md:mr-12 mb-16">
                    <h1 ref={titleRef} className="uppercase text-[min(12vw,18vh)] font-inria-sans font-medium leading-[0.85] text-white">
                        More<br />About Me
                    </h1>
                </div>
                <div ref={textRef} className="font-inter text-3xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] uppercase font-light break-words w-full flex flex-col items-end justify-center pr-6 pl-6 md:pr-12 md:pl-12 gap-12 lg:gap-20 leading-snug">
                    <p className="w-full md:w-5/6 lg:w-4/5 xl:w-2/3">
                        A software engineer specializing in the end-to-end development of scalable web applications<span className="inline-block px-2 -translate-y-2"><Heart /></span>By merging robust full-stack architecture with precise UI/UX principles, I build high-performance, user-centered digital experiences<span className="inline-block px-2 translate-y-2"><Star /></span>
                    </p>
                    <p className="w-full md:w-5/6 lg:w-4/5 xl:w-2/3">
                        Bachelor of Computer Science, The University of Queensland (2019-2024).
                        Translated CS fundamentals into production-ready applications through real-world projects and industry internships.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Description;
