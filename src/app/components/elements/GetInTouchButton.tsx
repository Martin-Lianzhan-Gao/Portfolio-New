'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';

const GetInTouchButton = () => {
    const containerRef = useRef<HTMLButtonElement>(null);
    const iconRef = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    /**
     * TODO:
     * 1. Make the size of icon as a state, for responsive calculation
     * 2. Make the move distance of text as a state, for responsive calculation
     * 3. For responsive calculation, should listen the window resize event, and update the state with useEffect as well.
     */

    const textMoveDistance = -6;

    /**
     * TODO: Design the onClick event animation
     */

    const handleMouseEnter = contextSafe(() => {

        gsap.to(iconRef.current, {
            width: 'auto',
            duration: 0.5,
            ease: 'expo.out'
        });

        gsap.to(iconRef.current, {
            x: 0,
            filter: 'blur(0px)',
            opacity: 1,
            duration: 0.7,
            marginLeft: '0.3rem',
            ease: 'expo.out'
        });

        gsap.to(textRef.current, {
            x: textMoveDistance,
            duration: 0.5,
            ease: 'expo.out'
        })

        gsap.to(containerRef.current, {
            paddingRight: 20,
            duration: 0.5,
            ease: 'expo.out'
        })
    });

    const handleMouseLeave = contextSafe(() => {

        gsap.to(iconRef.current, {
            x: -20,
            filter: 'blur(4px)',
            opacity: 0,
            duration: 0.5,
            marginLeft: 0,
            width: 0,
            ease: 'expo.out'
        });

        gsap.to(textRef.current, {
            x: 0,
            duration: 0.5,
            ease: 'expo.out'
        })

        gsap.to(containerRef.current, {
            paddingRight: 32, // 2 rem, back to the default padding
            duration: 0.5,
            ease: 'expo.out'
        })
    });

    // Initial setup
    useGSAP(() => {
        gsap.set(iconRef.current, {
            x: -20,
            filter: 'blur(4px)',
            opacity: 0,
            width: 0,
            marginLeft: 0
        });
    }, { scope: containerRef });

    return (
        <button
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="mt-16 text-xl text-white bg-black rounded-4xl px-8 py-4 flex flex-row items-center justify-center overflow-hidden"
        >
            <p ref={textRef}>Get in touch</p>
            <span ref={iconRef} className="flex items-center overflow-hidden h-6">
                <ChevronRight className="w-6 h-6" />
            </span>
        </button>
    );
};

export default GetInTouchButton;
