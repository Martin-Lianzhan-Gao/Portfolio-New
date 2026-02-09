'use client'

import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Logo from './elements/Logo'

const menuItems = ['ABOUT ME', 'WORKS', 'SKILLS', 'PROJECT', 'CONTACT']

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const underlineRefs = useRef<(HTMLSpanElement | null)[]>([])
    const prevSelectedRef = useRef<number | null>(0)

    // Refs for mobile menu animations
    const hamburgerTopRef = useRef<SVGLineElement>(null)
    const hamburgerBottomRef = useRef<SVGLineElement>(null)
    const xLine1Ref = useRef<SVGLineElement>(null)
    const xLine2Ref = useRef<SVGLineElement>(null)
    const rippleRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const menuItemRefs = useRef<(HTMLDivElement | null)[]>([])

    const { contextSafe } = useGSAP()

    // Initialize header selection
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

    // Initialize X icon (hidden initially)
    useEffect(() => {
        if (xLine1Ref.current && xLine2Ref.current) {
            // Line 1: from top-left (0,0) to bottom-right (23,23)
            gsap.set(xLine1Ref.current, {
                scale: 0,
                transformOrigin: '0px 0px'
            })
            // Line 2: from bottom-left (0,23) to top-right (23,0)
            gsap.set(xLine2Ref.current, {
                scale: 0,
                transformOrigin: '0px 23px'
            })
        }
    }, [])

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMenuOpen])

    const handleItemClick = contextSafe((index: number) => {
        const prevIndex = prevSelectedRef.current

        // Hide underline while previous item is unselected
        if (prevIndex !== null && underlineRefs.current[prevIndex]) {
            gsap.to(underlineRefs.current[prevIndex], {
                scaleX: 0,
                transformOrigin: 'right center',
                duration: 0.3,
                ease: 'expo.out'
            })
        }

        // Show underline while new item is selected
        if (underlineRefs.current[index]) {
            gsap.set(underlineRefs.current[index], {
                transformOrigin: 'left center'
            })
            gsap.to(underlineRefs.current[index], {
                scaleX: 1,
                duration: 0.6,
                ease: 'expo.out'
            })
        }

        prevSelectedRef.current = index;
    })

    // Toggle mobile menu with Sequential Swap & Stagger animation
    const toggleMenu = contextSafe(() => {
        const tl = gsap.timeline()

        if (!isMenuOpen) {
            // === OPENING MENU ===
            // 1. Ripple effect (80% = 0.4s)
            if (rippleRef.current) {
                tl.fromTo(rippleRef.current,
                    { scale: 0, opacity: 1 },
                    { scale: 2.5, opacity: 0, duration: 0.4, ease: 'expo.out' },
                    0
                )
            }

            // 2. Sequential hamburger exit (80% = 0.24s each, 0.08s stagger)
            if (hamburgerTopRef.current && hamburgerBottomRef.current) {
                tl.to(hamburgerTopRef.current, {
                    scaleX: 0,
                    duration: 0.24,
                    ease: 'expo.out'
                }, 0)
                tl.to(hamburgerBottomRef.current, {
                    scaleX: 0,
                    duration: 0.24,
                    ease: 'expo.out'
                }, 0.08)
            }

            // 3. Show overlay (starts at 0.15s, duration 0.4s)
            if (overlayRef.current) {
                tl.fromTo(overlayRef.current,
                    { opacity: 0, visibility: 'visible' },
                    { opacity: 1, duration: 0.4, ease: 'expo.out' },
                    0.15
                )
            }

            // 4. Sequential X entrance (starts at 0.35s, duration 0.48s each, 0.08s stagger)
            if (xLine1Ref.current && xLine2Ref.current) {
                tl.to(xLine1Ref.current, {
                    scale: 1,
                    duration: 0.48,
                    ease: 'expo.out'
                }, 0.35)
                tl.to(xLine2Ref.current, {
                    scale: 1,
                    duration: 0.48,
                    ease: 'expo.out'
                }, 0.43) // 0.08s stagger
            }

            // 5. Menu items reveal (starts at 0.6s, duration 0.32s, 0.06s stagger)
            menuItemRefs.current.forEach((item, index) => {
                if (item) {
                    const textEl = item.querySelector('.menu-text')
                    if (textEl) {
                        tl.fromTo(textEl,
                            { y: '100%' },
                            { y: '0%', duration: 0.32, ease: 'expo.out' },
                            0.6 + index * 0.06
                        )
                    }
                }
            })

            setIsMenuOpen(true)
        } else {
            // === CLOSING MENU ===
            // 1. Menu items exit (duration 0.32s, 0.05s stagger)
            menuItemRefs.current.forEach((item, index) => {
                if (item) {
                    const textEl = item.querySelector('.menu-text')
                    if (textEl) {
                        tl.to(textEl,
                            { y: '-100%', duration: 0.32, ease: 'expo.out' },
                            index * 0.05
                        )
                    }
                }
            })

            // 2. Sequential X exit (starts at 0.3s, duration 0.24s each, 0.08s stagger)
            if (xLine1Ref.current && xLine2Ref.current) {
                tl.to(xLine1Ref.current, {
                    scale: 0,
                    transformOrigin: '23px 23px',
                    duration: 0.24,
                    ease: 'expo.out'
                }, 0.3)
                tl.to(xLine2Ref.current, {
                    scale: 0,
                    transformOrigin: '23px 0px',
                    duration: 0.24,
                    ease: 'expo.out'
                }, 0.38) // 0.08s stagger
            }

            // 3. Hide overlay (starts at 0.4s, duration 0.32s)
            if (overlayRef.current) {
                tl.to(overlayRef.current,
                    {
                        opacity: 0, duration: 0.32, ease: 'expo.out', onComplete: () => {
                            if (overlayRef.current) {
                                overlayRef.current.style.visibility = 'hidden'
                            }
                        }
                    },
                    0.4
                )
            }

            // 4. Sequential hamburger entrance (starts at 0.6s, duration 0.24s, 0.08s stagger)
            if (hamburgerTopRef.current && hamburgerBottomRef.current) {
                tl.to(hamburgerTopRef.current, {
                    scaleX: 1,
                    duration: 0.24,
                    ease: 'expo.out'
                }, 0.6)
                tl.to(hamburgerBottomRef.current, {
                    scaleX: 1,
                    duration: 0.24,
                    ease: 'expo.out'
                }, 0.68)
            }

            setIsMenuOpen(false)
        }
    })

    // Handle mobile menu item click
    const handleMobileMenuClick = contextSafe((index: number) => {
        // Close menu first
        toggleMenu()
        // Then trigger the desktop selection logic
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
                    <p className={`font-montserrat font-medium text-2xl md:text-3xl transition-colors duration-300 ${isMenuOpen ? 'text-white' : 'text-black'}`}>
                        MG
                    </p>
                </div>
                { /* Menu Bar / Items */}
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
                className='fixed inset-0 z-40 bg-black/90 backdrop-blur-md md:hidden'
                style={{ visibility: 'hidden', opacity: 0 }}
            >
                <div className='flex flex-col justify-center h-full pl-8 gap-12'>
                    <div className='font-montserrat font-regular text-2xl tracking-tight text-[#D7D7D7]'>MENU</div>
                    {menuItems.map((item, index) => (
                        <div
                            key={item}
                            ref={(el) => { menuItemRefs.current[index] = el }}
                            className='overflow-hidden cursor-pointer'
                            onClick={() => handleMobileMenuClick(index)}
                        >
                            <div className='menu-text text-white/50 font-extralight text-4xl tracking-tight' style={{ transform: 'translateY(100%)' }}>
                                <span className='text-white/50 mr-2'>0{index + 1}.</span>
                                {item}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Header;