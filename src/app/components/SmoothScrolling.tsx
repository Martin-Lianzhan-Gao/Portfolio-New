"use client";

import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<any>(null);

    useEffect(() => {
        // Sync Lenis RAF with GSAP Ticker
        // This stops the 1-frame delay between Lenis scroll updates and ScrollTrigger animations.
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        gsap.ticker.add(update);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true, touchMultiplier: 2 }} ref={lenisRef} autoRaf={false}>
            {children}
        </ReactLenis>
    );
}
