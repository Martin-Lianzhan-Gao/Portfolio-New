'use client'

import { forwardRef, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ScrollDown = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className = "", ...props }, ref) => {
    const leftBracketRef = useRef<HTMLSpanElement>(null);
    const rightBracketRef = useRef<HTMLSpanElement>(null);

    const { contextSafe } = useGSAP();

    const handleMouseEnter = contextSafe(() => {
        gsap.to(leftBracketRef.current, {
            x: -8,
            duration: 0.8,
            ease: "power2.out",
        });
        gsap.to(rightBracketRef.current, {
            x: 8,
            duration: 0.8,
            ease: "power2.out",
        });
    });

    const handleMouseLeave = contextSafe(() => {
        gsap.to([leftBracketRef.current, rightBracketRef.current], {
            x: 0,
            duration: 0.8,
            ease: "power2.out",
        });
    });

    return (
        <p
            ref={ref}
            className={`cursor-pointer pointer-events-auto inline-block ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            <span ref={leftBracketRef} className="inline-block will-change-transform">(</span>
            <span className="whitespace-pre"> SCROLL DOWN </span>
            <span ref={rightBracketRef} className="inline-block will-change-transform">)</span>
        </p>
    );
});

ScrollDown.displayName = 'ScrollDown';

export default ScrollDown;
