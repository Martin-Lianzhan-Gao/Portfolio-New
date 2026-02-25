'use client'
import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Logo from './elements/Logo'

const menuItems = ['ABOUT ME', 'WORKS', 'SKILLS', 'PROJECT', 'CONTACT']

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    // Refs for desktop header selection underline
    const underlineRefs = useRef<(HTMLSpanElement | null)[]>([])
    const prevSelectedRef = useRef<number | null>(0)

    // Refs for mobile menu animations
    const hamburgerTopRef = useRef<SVGLineElement>(null)
    const hamburgerBottomRef = useRef<SVGLineElement>(null)
    const xLine1Ref = useRef<SVGLineElement>(null)
    const xLine2Ref = useRef<SVGLineElement>(null)
    const rippleRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    // Refs for mobile menu content
    const menuItemRefs = useRef<(HTMLDivElement | null)[]>([])
    // Refs for mobile menu secondary text & links
    const secondaryTextRefs = useRef<(HTMLDivElement | HTMLParagraphElement | null)[]>([])

    const { contextSafe } = useGSAP()

    // Initialize desktop header selection underline
    useEffect(() => {
        underlineRefs.current.forEach((ref, index) => {
            if (ref) {
                gsap.set(ref, {
                    scaleX: index === 0 ? 1 : 0,
                    transformOrigin: 'left center'
                })
            }
        })
    }, [])

    // Initialize mobile menu close icon
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

    const handleItemClick = contextSafe((index: number) => {
        const prevIndex = prevSelectedRef.current

        if (prevIndex !== null && underlineRefs.current[prevIndex]) {
            gsap.to(underlineRefs.current[prevIndex], {
                scaleX: 0,
                transformOrigin: 'right center',
                duration: 0.3,
                ease: 'expo.out'
            })
        }

        if (underlineRefs.current[index]) {
            gsap.set(underlineRefs.current[index], { transformOrigin: 'left center' })
            gsap.to(underlineRefs.current[index], {
                scaleX: 1,
                duration: 0.6,
                ease: 'expo.out'
            })
        }

        prevSelectedRef.current = index;
    })

    // Toggle mobile menu with Orchestrated Timeline Strategy
    const toggleMenu = contextSafe(() => {
        const tl = gsap.timeline()

        if (!isMenuOpen) {
            // OPENING MENU

            // 1. Overlay (Fade in)
            if (overlayRef.current) {
                tl.fromTo(overlayRef.current,
                    { opacity: 0, visibility: 'visible' },
                    { opacity: 1, duration: 0.4, ease: 'power2.out' },
                    0 // Starts immediately
                )
            }

            // 2. Ripple effect & Hamburger exit
            if (rippleRef.current) {
                tl.fromTo(rippleRef.current,
                    { scale: 0, opacity: 1 },
                    { scale: 2.5, opacity: 0, duration: 0.4, ease: 'expo.out' },
                    0
                )
            }
            if (hamburgerTopRef.current && hamburgerBottomRef.current) {
                tl.to([hamburgerTopRef.current, hamburgerBottomRef.current], {
                    scaleX: 0,
                    duration: 0.24,
                    stagger: 0.08,
                    ease: 'expo.out'
                }, 0)
            }

            // 3. X Icon entrance
            if (xLine1Ref.current && xLine2Ref.current) {
                tl.to([xLine1Ref.current, xLine2Ref.current], {
                    scale: 1,
                    duration: 0.48,
                    stagger: 0.08,
                    ease: 'expo.out'
                }, 0.2) // Triggers as overlay is half-way complete
            }

            // 4. Nav items reveal (Starts at 0.2s to overlap with overlay)
            const navElements = menuItemRefs.current
                .map(item => item?.querySelector('.menu-text'))
                .filter(Boolean)

            if (navElements.length > 0) {

                gsap.set(navElements, { y: 30, opacity: 0, skewY: 2 })
                tl.to(navElements,
                    { y: 0, opacity: 1, skewY: 0, duration: 0.5, stagger: 0.06, ease: 'power4.out' },
                    0.2
                )
            }

            // 5. Secondary text reveal (Starts slightly after first nav item)
            const secElements = secondaryTextRefs.current.filter(Boolean)
            if (secElements.length > 0) {

                gsap.set(secElements, { y: 20, opacity: 0, filter: 'blur(4px)' })
                tl.to(secElements,
                    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.04, ease: 'power2.out' },
                    0.3 // Delay 0.1s after Nav items start
                )
            }

            setIsMenuOpen(true)
        } else {
            // CLOSING MENU
            // 1. All text elements exit (Nav + Secondary Text together)
            const navElements = menuItemRefs.current
                .map(item => item?.querySelector('.menu-text'))
                .filter(Boolean)
            const secElements = secondaryTextRefs.current.filter(Boolean)

            if (navElements.length > 0 || secElements.length > 0) {
                // define the closing animation
                tl.to([...navElements, ...secElements], {
                    y: -20,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.02,
                    ease: 'power2.inOut',
                }, 0)
            }

            // 2. X icon exit
            if (xLine1Ref.current && xLine2Ref.current) {
                tl.to([xLine1Ref.current, xLine2Ref.current], {
                    scale: 0,
                    duration: 0.24,
                    stagger: 0.08,
                    ease: 'expo.out'
                }, 0.1) // Start while text is exiting
            }

            // 3. Hamburger icon entrance
            if (hamburgerTopRef.current && hamburgerBottomRef.current) {
                tl.to([hamburgerTopRef.current, hamburgerBottomRef.current], {
                    scaleX: 1,
                    duration: 0.24,
                    stagger: 0.08,
                    ease: 'expo.out'
                }, 0.3)
            }

            // 4. Hide overlay
            if (overlayRef.current) {
                tl.to(overlayRef.current, {
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        if (overlayRef.current) {
                            overlayRef.current.style.visibility = 'hidden'
                        }
                    }
                }, 0.2) // Overlap overlay fading out with X exit
            }

            setIsMenuOpen(false)
        }
    })

    // Handle mobile menu item click
    const handleMobileMenuClick = contextSafe((index: number) => {
        toggleMenu()
        handleItemClick(index)
    })

    return (
        <>
            <div className="fixed top-0 w-full h-auto flex flex-row items-center justify-between mt-6 z-100 font-inter font-medium">
                {/* Logo and text */}
                <div className="w-auto h-auto ml-6 md:ml-12 flex flex-row items-center">
                    <div className='mr-2 w-[36px] h-[18px] md:w-[42px] md:h-[21px]'>
                        <Logo color={isMenuOpen ? 'white' : 'black'} />
                    </div>
                    <p className="hidden md:block font-montserrat font-medium text-3xl">
                        MG
                    </p>
                </div>
                { /* Menu Bar Items */}
                <div className='w-auto h-auto mr-6 md:mr-12'>
                    <div className='hidden md:flex md:text-base md:gap-8'>
                        {menuItems.map((item, index) => (
                            <div
                                key={item}
                                className='relative cursor-pointer'
                                onClick={() => handleItemClick(index)}
                            >
                                <p>{item}</p>
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
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="square"
                                />
                                <line
                                    ref={xLine2Ref}
                                    x1="23"
                                    y1="0"
                                    x2="0"
                                    y2="23"
                                    stroke="white"
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
                className='fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden'
                style={{ visibility: 'hidden', opacity: 0 }}
            >
                <div className='h-2/10'></div>
                <div className='flex flex-row flex-wrap justify-between h-4/10 pl-8 pr-8 gap-y-0'>
                    <div
                        ref={(el) => { if (el) secondaryTextRefs.current.push(el) }}
                        className='mb-2 w-full font-medium text-md tracking-tight text-[#CDCDCD]'
                    >
                        EXPLORE BY KEYWORDS
                    </div>
                    {menuItems.map((item, index) => (
                        <div
                            key={item}
                            ref={(el) => { menuItemRefs.current[index] = el }}
                            className={`flex cursor-pointer w-1/2 ${index % 2 === 1 ? 'justify-end' : 'justify-start'}`}
                            onClick={() => handleMobileMenuClick(index)}
                        >
                            <div className='menu-text text-white/50 font-regular text-2xl tracking-tight' style={{ transform: 'translateY(30px)', opacity: 0, clipPath: 'none' }}>
                                {item}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='h-1/10'></div>
                <div className="flex flex-col justify-around w-full h-3/10 px-8">
                    <div className="text-[#CDCDCD] w-full h-auto wrap-break-word flex flex-row justify-start">
                        <div
                            ref={(el) => { secondaryTextRefs.current[1] = el }}
                            className="w-1/2"
                        >
                            <p className='text-md font-medium'>ENGINEERED FOR EXCEPTIONAL EXPERIECNES.</p>
                        </div>
                    </div>
                    <div className="text-[#CDCDCD] w-full h-auto flex flex-col items-end text-md gap-2 font-medium">
                        <p ref={(el) => { secondaryTextRefs.current[2] = el }}>GITHUB</p>
                        <p ref={(el) => { secondaryTextRefs.current[3] = el }}>EMAIL</p>
                        <p ref={(el) => { secondaryTextRefs.current[4] = el }}>LINKEDIN</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;