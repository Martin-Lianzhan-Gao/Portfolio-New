'use client'

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Intro = () => {
    const orbRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // unceasingly rotate the orb
        gsap.to(orbRef.current, {
            rotation: 360,
            duration: 25,
            ease: "linear",
            repeat: -1,
        });

        // unceasingly change the shape of the orb
        const tl = gsap.timeline({ repeat: -1 });

        tl.to(orbRef.current, {
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            scale: 1.1,
            duration: 3,
            ease: "sine.inOut",
        })
            .to(orbRef.current, {
                borderRadius: "70% 30% 50% 50% / 40% 60% 40% 60%",
                scale: 0.9,
                duration: 3,
                ease: "sine.inOut",
            })
            .to(orbRef.current, {
                borderRadius: "40% 60% 30% 70% / 60% 40% 70% 30%",
                scale: 1.05,
                duration: 3,
                ease: "sine.inOut",
            })
            .to(orbRef.current, {
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", // back to the initial state smoothly
                scale: 0.95,
                duration: 3,
                ease: "sine.inOut",
            });
    });

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden">
            {/* Orb container */}
            <div className="absolute z-0 w-[100vw] h-[100vw] top-1/2 right-0 translate-x-1/2 -translate-y-1/2 md:w-[100vh] md:h-[100vh] md:top-0 md:left-1/2 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2">
                <div
                    ref={orbRef}
                    className="w-full h-full bg-[#FF4500] blur-[80px] md:blur-[120px]"
                    style={{
                        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                        transform: "scale(0.95)"
                    }}
                />
            </div>

            {/* Glassmorphism Layer with content */}
            <div className="relative z-10 w-full h-full flex flex-col bg-white/30 backdrop-blur-2xl">
                <div className="w-full h-[70dvh] flex flex-col justify-center md:h-[60dvh] @container">
                    <div className="ml-6 mr-6 w-auto font-inria-sans text-[14cqh] font-bold wrap-break-word md:text-[16cqw] md:ml-12">
                        <h1 className="tracking-tight">MARTIN GAO.</h1>
                    </div>
                </div>
                <div className="font-semibold text-xl h-[30dvh] w-full flex flex-row justify-end items-center md:h-[20dvh] md:justify-start md:text-2xl">
                    <div className="w-3/5 mr-6 md:ml-12 md:w-2/5">
                        EXPERIENCED FULL-STACK DEVELOPER WITH INNOVATION, CREATIVITY AND AESTHETICS.
                    </div>
                </div>
                <div className="hidden md:h-[20dvh] font-semibold text-2xl md:flex md:flex-row md:justify-end md:w-full md:items-center">
                    <p className="mr-12">( SCROLL DOWN )</p>
                </div>
            </div>
        </div>
    )
}

export default Intro;