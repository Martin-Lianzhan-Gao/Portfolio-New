"use client";

import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
    // Use any type for lenisRef to avoid type errors
    const lenisRef = useRef<any>(null);

    useEffect(() => {
        const lenis = lenisRef.current?.lenis;
        if (!lenis) return;

        // Integrate requestAnimationFrame with GSAP Ticker
        function update(time: number) {
            lenis?.raf(time * 1000);
        }
        gsap.ticker.add(update);

        // Sync ScrollTrigger with Lenis scroll position calculation
        lenis.on('scroll', ScrollTrigger.update);

        return () => {
            gsap.ticker.remove(update);
            lenis.off('scroll', ScrollTrigger.update);
        };
    }, []);

    return (
        <ReactLenis
            root
            ref={lenisRef}
            // Disable Lenis's requestAnimationFrame loop
            // Use GSAP ticker to drive Lenis and all GSAP animations in the same frame as mentioned above
            autoRaf={false}
            options={{
                // Use lerp for smooth scrolling
                lerp: 0.1,

                // Use smoothWheel for smooth scrolling (by mouse wheel)
                smoothWheel: true,

                // Disable lerp for touch devices
                syncTouch: false,

            }}
        >
            {children}
        </ReactLenis>
    );
}
