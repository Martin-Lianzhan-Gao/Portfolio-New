'use client'

import React, { forwardRef, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from 'lucide-react';

const ScrollDown = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className = "", ...props }, ref) => {
    const text = "( SCROLL DOWN )";
    const characters = text.split("");

    // Arrays to hold refs for each letter and chevron
    const letterRefs = useRef<(HTMLSpanElement | null)[]>(new Array(characters.length).fill(null));
    const chevronRefs = useRef<(SVGSVGElement | null)[]>(new Array(characters.length).fill(null));

    const leftBracketRef = useRef<HTMLSpanElement>(null);
    const rightBracketRef = useRef<HTMLSpanElement>(null);
    const lastSelectedIndex = useRef<number>(-1);

    const { contextSafe } = useGSAP();

    // The indices that can be animated (excluding '(', ')', and spaces)
    const validIndices = characters.reduce((acc, char, index) => {
        if (char !== '(' && char !== ')' && char !== ' ') {
            acc.push(index);
        }
        return acc;
    }, [] as number[]);

    useGSAP(() => {
        if (validIndices.length === 0) return;

        let timer: gsap.core.Tween;

        const animateRandomLetter = contextSafe(() => {
            let randomIndex: number;

            // Ensure the same letter is not chosen twice in a row
            do {
                randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
            } while (randomIndex === lastSelectedIndex.current && validIndices.length > 1);

            lastSelectedIndex.current = randomIndex;

            const letterEl = letterRefs.current[randomIndex];
            const chevronEl = chevronRefs.current[randomIndex];

            if (letterEl && chevronEl) {
                const tl = gsap.timeline();

                // Phase 1: The Downward Swap
                tl.fromTo(letterEl, { y: '0%' }, { y: '150%', duration: 0.4, ease: 'back.out(1.5)' }, 0)
                    .fromTo(chevronEl, { y: '-150%' }, { y: '0%', duration: 0.4, ease: 'back.out(1.5)' }, 0);

                // Phase 2: The Hold & Revert
                // Wait for 1 second, then both continue their downward journey
                tl.to(chevronEl, { y: '150%', duration: 0.4, ease: 'back.out(1.5)' }, "+=1")
                    .fromTo(letterEl, { y: '-150%' }, { y: '0%', duration: 0.4, ease: 'back.out(1.5)' }, "<");
            }

            // Loop recursively every 2 seconds
            timer = gsap.delayedCall(2, animateRandomLetter);
        });

        // Start the loop
        timer = gsap.delayedCall(2, animateRandomLetter);

        return () => {
            if (timer) timer.kill();
        };
    });

    const handleMouseEnter = contextSafe(() => {
        if (leftBracketRef.current && rightBracketRef.current) {
            gsap.to(leftBracketRef.current, { x: -8, duration: 0.8, ease: "power2.out" });
            gsap.to(rightBracketRef.current, { x: 8, duration: 0.8, ease: "power2.out" });
        }
    });

    const handleMouseLeave = contextSafe(() => {
        if (leftBracketRef.current && rightBracketRef.current) {
            gsap.to([leftBracketRef.current, rightBracketRef.current], { x: 0, duration: 0.8, ease: "power2.out" });
        }
    });

    return (
        <p
            ref={ref}
            className={`cursor-pointer pointer-events-auto inline-flex items-center m-0 ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="SCROLL DOWN"
            {...props}
        >
            {characters.map((char, index) => {
                if (char === '(') {
                    return (
                        <span key={index} ref={leftBracketRef} className="inline-block will-change-transform" aria-hidden="true">
                            {char}
                        </span>
                    );
                }
                if (char === ')') {
                    return (
                        <span key={index} ref={rightBracketRef} className="inline-block will-change-transform" aria-hidden="true">
                            {char}
                        </span>
                    );
                }
                if (char === ' ') {
                    return (
                        <span key={index} className="whitespace-pre" aria-hidden="true">
                            {char}
                        </span>
                    );
                }

                return (
                    <span
                        key={index}
                        className="relative inline-flex overflow-hidden justify-center items-center"
                        aria-hidden="true"
                    >
                        <span
                            ref={(el) => { letterRefs.current[index] = el; }}
                            className="inline-block will-change-transform tracking-wide"
                        >
                            {char}
                        </span>
                        <ArrowDown
                            strokeWidth={3}
                            ref={(el) => { chevronRefs.current[index] = el as unknown as SVGSVGElement; }}
                            className="absolute w-[1em] h-[1em] will-change-transform"
                            style={{ transform: 'translateY(-150%)' }}
                        />
                    </span>
                );
            })}
        </p>
    );
});

ScrollDown.displayName = 'ScrollDown';

export default ScrollDown;
