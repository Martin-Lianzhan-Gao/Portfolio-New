'use client'
import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Logo from './ui/Logo'

gsap.registerPlugin(ScrollTrigger)

const menuItems = ['about', 'works', 'contact']

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    // Refs for desktop hover underline
    const underlineRefs = useRef<(HTMLSpanElement | null)[]>([])

    // Refs for mobile menu animations
    const hamburgerTopRef = useRef<SVGLineElement>(null)
    const hamburgerBottomRef = useRef<SVGLineElement>(null)
    const xLine1Ref = useRef<SVGLineElement>(null)
    const xLine2Ref = useRef<SVGLineElement>(null)
    const rippleRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    // Ref for mobile menu content
    const menuItemRefs = useRef<(HTMLDivElement | null)[]>([])
    // Refs for mobile strike lines
    const mobileStrikeRefs = useRef<(HTMLSpanElement | null)[]>([])
    // Ref for mobile footer text
    const secondaryTextRefs = useRef<(HTMLDivElement | null)[]>([])

    // Refs for desktop components to animate colors
    const mgTextRef = useRef<HTMLParagraphElement>(null)
    const menuItemTextRefs = useRef<(HTMLParagraphElement | null)[]>([])
    const isMenuOpenRef = useRef(isMenuOpen)
    const currentHeaderColor = useRef<string>("black")

    // Refs for header entering animation
    const headerRef = useRef<HTMLDivElement>(null)
    const brandRef = useRef<HTMLDivElement>(null)
    const navItemRefs = useRef<(HTMLDivElement | null)[]>([])
    const mobileMenuBtnRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        isMenuOpenRef.current = isMenuOpen
    }, [isMenuOpen])

    const logoRef = useRef<SVGPathElement>(null)

    const { contextSafe } = useGSAP()

    const updateHeaderColor = contextSafe((color: string) => {
        currentHeaderColor.current = color;
        if (!isMenuOpenRef.current) {
            const strokeTargets = [logoRef.current, hamburgerTopRef.current, hamburgerBottomRef.current].filter(Boolean);
            const colorTargets = [mgTextRef.current, ...menuItemTextRefs.current].filter(Boolean);
            const bgTargets = [...underlineRefs.current, rippleRef.current].filter(Boolean);

            gsap.to(strokeTargets, { stroke: color, duration: 0.4, ease: "power2.inOut" });
            gsap.to(colorTargets, { color: color, duration: 0.4, ease: "power2.inOut" });
            gsap.to(bgTargets, { backgroundColor: color, duration: 0.4, ease: "power2.inOut" });
        }
    });

    useGSAP(() => {
        const darkSections = document.querySelectorAll('.theme-dark');

        darkSections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: "top 50px",
                end: "bottom 50px",
                onEnter: () => updateHeaderColor("white"),
                onLeave: () => updateHeaderColor("black"),
                onEnterBack: () => updateHeaderColor("white"),
                onLeaveBack: () => updateHeaderColor("black"),
            });
        });

        const mm = gsap.matchMedia();
        const entranceDelay = 1.8;

        mm.add("(min-width: 768px)", () => {
            gsap.fromTo(
                [brandRef.current, ...navItemRefs.current].filter(Boolean),
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: entranceDelay
                }
            );
        });

        mm.add("(max-width: 767px)", () => {
            gsap.fromTo(
                [brandRef.current, mobileMenuBtnRef.current].filter(Boolean),
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15, // longer stagger for mobile
                    ease: "power3.out",
                    delay: entranceDelay
                }
            );
        });
    }, { dependencies: [], scope: headerRef });

    // Initialize desktop hover underline
    useEffect(() => {
        underlineRefs.current.forEach((ref) => {
            if (ref) {
                gsap.set(ref, {
                    scaleX: 0,
                    transformOrigin: 'left center'
                })
            }
        })
    }, [])

    // Initialize mobile menu close icon (hidden initially)
    useEffect(() => {
        if (xLine1Ref.current && xLine2Ref.current) {
            gsap.set(xLine1Ref.current, { scale: 0, transformOrigin: '0px 0px' })
            gsap.set(xLine2Ref.current, { scale: 0, transformOrigin: '0px 23px' })
        }
    }, [])

    // Prevent background scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isMenuOpen])

    const scrollToSection = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleItemClick = contextSafe((index: number, id: string, e: React.MouseEvent) => {
        // wipe away the underline on click for visual confirmation
        if (underlineRefs.current[index]) {
            gsap.set(underlineRefs.current[index], { transformOrigin: 'right center' })
            gsap.to(underlineRefs.current[index], {
                scaleX: 0,
                duration: 0.4,
                ease: 'power3.out'
            })
        }
        scrollToSection(id, e);
    })

    const handleMouseEnter = contextSafe((index: number) => {
        if (underlineRefs.current[index]) {
            gsap.set(underlineRefs.current[index], { transformOrigin: 'left center' })
            gsap.to(underlineRefs.current[index], {
                scaleX: 1,
                duration: 0.4,
                ease: 'power3.out'
            })
        }
    })

    const handleMouseLeave = contextSafe((index: number) => {
        if (underlineRefs.current[index]) {
            gsap.set(underlineRefs.current[index], { transformOrigin: 'right center' })
            gsap.to(underlineRefs.current[index], {
                scaleX: 0,
                duration: 0.4,
                ease: 'power3.out'
            })
        }
    })

    // Toggle mobile menu with Orchestrated Timeline Strategy
    const toggleMenu = contextSafe(() => {
        const tl = gsap.timeline()

        if (!isMenuOpen) {
            // Reset mobile strikes dynamically before reveal
            gsap.set(mobileStrikeRefs.current, { scaleX: 0 })

            // Opening Menu
            // 1. Overlay (Slide in from right) & Logo Color Interpolation
            if (overlayRef.current) {
                tl.fromTo(overlayRef.current,
                    { xPercent: 100, visibility: 'visible' },
                    { xPercent: 0, duration: 0.6, ease: 'power3.inOut' },
                    0 // Starts immediately
                )
            }
            // Organic color bleed into black accompanying the white overlay
            const strokeTargets = [logoRef.current, hamburgerTopRef.current, hamburgerBottomRef.current].filter(Boolean);
            const colorTargets = [mgTextRef.current, ...menuItemTextRefs.current].filter(Boolean);
            const bgTargets = [...underlineRefs.current, rippleRef.current].filter(Boolean);

            tl.to(strokeTargets, { stroke: "black", duration: 0.5, ease: "power2.inOut" }, 0)
            tl.to(colorTargets, { color: "black", duration: 0.5, ease: "power2.inOut" }, 0)
            tl.to(bgTargets, { backgroundColor: "black", duration: 0.5, ease: "power2.inOut" }, 0)

            // 2. Ripple effect & Hamburger exit (Organic Feel)
            if (rippleRef.current) {
                tl.fromTo(rippleRef.current,
                    { scale: 0, opacity: 1 },
                    { scale: 2.5, opacity: 0, duration: 0.6, ease: 'power2.out' },
                    0
                )
            }
            if (hamburgerTopRef.current && hamburgerBottomRef.current) {
                tl.to([hamburgerTopRef.current, hamburgerBottomRef.current], {
                    scaleX: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.inOut'
                }, 0)
            }

            // 3. X Icon entrance
            if (xLine1Ref.current && xLine2Ref.current) {
                tl.to([xLine1Ref.current, xLine2Ref.current], {
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.inOut'
                }, 0.2)
            }

            // 4. Nav items reveal (Starts as overlay is near deploying)
            const navElements = menuItemRefs.current
                .map(item => item?.querySelector('.menu-text'))
                .filter(Boolean)

            if (navElements.length > 0) {
                gsap.set(navElements, { x: 50, opacity: 0 })
                tl.to(navElements,
                    { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
                    0.4
                )
            }

            // 5. Footer text reveal
            if (secondaryTextRefs.current[0]) {
                gsap.set(secondaryTextRefs.current[0], { opacity: 0, y: 15 })
                tl.to(secondaryTextRefs.current[0],
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                    0.6
                )
            }

            setIsMenuOpen(true)
        } else {
            // Closing Menu
            // 1. All text elements exit (slide backwards/fade)
            const navElements = menuItemRefs.current
                .map(item => item?.querySelector('.menu-text'))
                .filter(Boolean)

            if (navElements.length > 0) {
                tl.to(navElements, {
                    x: -30,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.04,
                    ease: 'power3.in'
                }, 0)
            }

            if (secondaryTextRefs.current[0]) {
                tl.to(secondaryTextRefs.current[0], { opacity: 0, duration: 0.3 }, 0)
            }

            // 2. X icon exit
            if (xLine1Ref.current && xLine2Ref.current) {
                tl.to([xLine1Ref.current, xLine2Ref.current], {
                    scale: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'power2.inOut'
                }, 0.1)
            }

            // 3. Hamburger icon entrance
            if (hamburgerTopRef.current && hamburgerBottomRef.current) {
                tl.to([hamburgerTopRef.current, hamburgerBottomRef.current], {
                    scaleX: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.inOut'
                }, 0.2)
            }

            // 4. Hide overlay & Logo color revert
            if (overlayRef.current) {
                tl.to(overlayRef.current, {
                    xPercent: 100,
                    duration: 0.5,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        if (overlayRef.current) {
                            overlayRef.current.style.visibility = 'hidden'
                        }
                    }
                }, 0.2)
            }

            // Color bleed back to theme state
            const targetColor = currentHeaderColor.current;
            const strokeTargets = [logoRef.current, hamburgerTopRef.current, hamburgerBottomRef.current].filter(Boolean);
            const colorTargets = [mgTextRef.current, ...menuItemTextRefs.current].filter(Boolean);
            const bgTargets = [...underlineRefs.current, rippleRef.current].filter(Boolean);

            tl.to(strokeTargets, { stroke: targetColor, duration: 0.5, ease: "power2.inOut" }, 0.1)
            tl.to(colorTargets, { color: targetColor, duration: 0.5, ease: "power2.inOut" }, 0.1)
            tl.to(bgTargets, { backgroundColor: targetColor, duration: 0.5, ease: "power2.inOut" }, 0.1)

            setIsMenuOpen(false)
        }
    })

    // Handle mobile menu item click
    const handleMobileMenuClick = contextSafe((index: number, id: string, e: React.MouseEvent) => {
        // Brutalist strike-through feedback
        if (mobileStrikeRefs.current[index]) {
            gsap.set(mobileStrikeRefs.current[index], { transformOrigin: 'left center' });
            gsap.to(mobileStrikeRefs.current[index], {
                scaleX: 1,
                duration: 0.15,
                ease: 'power4.out'
            });
        }

        toggleMenu();
        handleItemClick(index, id, e);
    })

    return (
        <>
            <div ref={headerRef} className="fixed top-0 w-full h-auto flex flex-row items-center justify-center mt-6 z-100 font-inter font-medium">
                <div className='w-full max-w-vw-safe flex flex-row items-center justify-between'>
                    <div ref={brandRef} className="relative z-50 w-auto ml-6 md:ml-12 flex flex-row items-center">
                        <div className='mr-2 w-[36px] h-[18px] md:w-[42px] md:h-[21px]'>
                            <Logo ref={logoRef} color="black" />
                        </div>
                        <p ref={mgTextRef} className="hidden md:block font-montserrat font-medium text-3xl text-black">
                            MG
                        </p>
                    </div>

                    <div className='w-auto mr-6 md:mr-12'>
                        { /* Desktop Menu Nav Items */}
                        <div className='hidden md:flex md:gap-8 md:tracking-widest md:text-lg'>
                            {menuItems.map((item, index) => (
                                <div
                                    ref={(el) => { navItemRefs.current[index] = el }}
                                    key={item}
                                    className='relative cursor-pointer text-black uppercase'
                                    onClick={(e) => handleItemClick(index, item, e)}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={() => handleMouseLeave(index)}
                                >
                                    <p ref={(el) => { menuItemTextRefs.current[index] = el }}>{item}</p>
                                    <span
                                        ref={(el) => { underlineRefs.current[index] = el }}
                                        className='absolute bottom-0 left-0 w-full h-[2px] bg-black'
                                        style={{ transform: 'scaleX(0)' }}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Mobile Menu Button */}
                        <div
                            ref={mobileMenuBtnRef}
                            className='md:hidden relative z-50 w-[30px] h-[20px]'
                            onClick={toggleMenu}
                        >
                            {/* Ripple Effect Circle */}
                            <div
                                ref={rippleRef}
                                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black opacity-0 pointer-events-none'
                            />

                            {/* Hamburger Icon */}
                            <div className='absolute top-0 left-0 w-[30px] h-[15px]'>
                                <svg viewBox='0 0 40 20' fill='none'>
                                    <line
                                        ref={hamburgerTopRef}
                                        x1="2"
                                        y1="3"
                                        x2="40"
                                        y2="3"
                                        stroke="black"
                                        strokeWidth="3"
                                        strokeLinecap="square"
                                    />
                                    <line
                                        ref={hamburgerBottomRef}
                                        x1="2"
                                        y1="12"
                                        x2="40"
                                        y2="12"
                                        stroke="black"
                                        strokeWidth="3"
                                        strokeLinecap="square"
                                    />
                                </svg>
                            </div>

                            <div className='absolute top-0 left-0 w-[18px] h-[18px]'>
                                <svg viewBox='0 0 23 23' fill='none'>
                                    <line
                                        ref={xLine1Ref}
                                        x1="0"
                                        y1="0"
                                        x2="23"
                                        y2="23"
                                        stroke="black"
                                        strokeWidth="3"
                                        strokeLinecap="square"
                                    />
                                    <line
                                        ref={xLine2Ref}
                                        x1="23"
                                        y1="0"
                                        x2="0"
                                        y2="23"
                                        stroke="black"
                                        strokeWidth="3"
                                        strokeLinecap="square"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Screen Mobile Menu Overlay */}
                <div
                    ref={overlayRef}
                    className='fixed inset-0 z-40 bg-[#f5f5f7] flex flex-col justify-between px-8 py-10 md:hidden'
                    style={{ visibility: 'hidden' }}
                >
                    {/* Header spacing reserved area */}
                    <div className='h-24 w-full'></div>

                    <div className='flex flex-col gap-8 w-full items-start'>
                        {/* Mobile Menu Nav Items */}
                        {menuItems.map((item, index) => (
                            <div
                                key={item}
                                ref={(el) => { menuItemRefs.current[index] = el }}
                                className='w-fit cursor-pointer flex flex-col pb-1 relative uppercase'
                                onClick={(e) => handleMobileMenuClick(index, item, e)}
                            >
                                <div className="relative w-fit">
                                    <div
                                        className='menu-text font-montserrat font-normal text-5xl tracking-normal text-black'
                                        style={{ opacity: 0 }}
                                    >
                                        {item}
                                    </div>
                                    <span
                                        ref={(el) => { mobileStrikeRefs.current[index] = el }}
                                        className="absolute top-[52%] left-[-5%] w-[110%] h-[4px] bg-black -translate-y-1/2 pointer-events-none z-10"
                                        style={{ transform: 'scaleX(0)' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        ref={(el) => { if (el) secondaryTextRefs.current[0] = el }}
                        className="flex flex-col gap-1 w-full text-[#000000]/40 font-inter text-[11px] uppercase tracking-widest pb-4"
                        style={{ opacity: 0 }}
                    >
                        <span>© 2026</span>
                        <span>Martin Gao. All Rights Reserved.</span>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Header;