'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useCursorStore } from '@/hooks/useCursorStore'

// --- 物理极值与运动常量配置 ---
const SQUASH_STRETCH_RATIO = 0.008   // 速度到形变的转换乘数
const MAX_SCALE_X = 1.8             // 运动方向拉伸上限
const MIN_SCALE_Y = 0.65             // 垂直方向挤压下限
const BASE_SCALE_NORMAL = 0.6       // 默认缩放倍率
const BASE_SCALE_HOVER = 2        // Hover命中缩放倍率
const SLEEP_THRESHOLD = 0.1         // 判定物理休眠的速度阈值

export default function Cursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const baseScaleRef = useRef({ value: BASE_SCALE_NORMAL })

    // 仅用于环境降级控制 (低频)
    const [isEnabled, setIsEnabled] = useState(false)

    // 纯内部变量缓存物理状态，彻底避开 React Render Loop
    const state = useRef({
        targetX: 0,
        targetY: 0,
        lastVisualX: 0,
        lastVisualY: 0,
        currentRotation: 0,
        isSleeping: true
    })

    useEffect(() => {
        // 1. 环境可用性监听：只负责维护启用开关
        const mediaCoarse = window.matchMedia('(pointer: coarse)')
        const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)')

        const handleMediaChange = () => {
            setIsEnabled(!(mediaCoarse.matches || mediaReduced.matches))
        }

        handleMediaChange() // Init
        mediaCoarse.addEventListener('change', handleMediaChange)
        mediaReduced.addEventListener('change', handleMediaChange)

        return () => {
            mediaCoarse.removeEventListener('change', handleMediaChange)
            mediaReduced.removeEventListener('change', handleMediaChange)
        }
    }, [])

    useEffect(() => {
        // 2. 运行时逻辑：仅在启用时初始化光标系统
        if (!isEnabled) return
        if (!cursorRef.current) return

        // 初始化强制居中
        gsap.set(cursorRef.current, {
            xPercent: -50,
            yPercent: -50,
            scaleX: BASE_SCALE_NORMAL,
            scaleY: BASE_SCALE_NORMAL,
        })
        baseScaleRef.current.value = BASE_SCALE_NORMAL

        // 核心：创建 GSAP 极速 Setter
        const setX = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" })
        const setY = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" })

        // 监听 Hover 状态变化，唤醒物理引擎 (修复问题 1)
        const unsubHover = useCursorStore.subscribe((storeState, prevStoreState) => {
            if (storeState.isHovering !== prevStoreState.isHovering) {
                state.current.isSleeping = false
                gsap.killTweensOf(baseScaleRef.current)
                gsap.to(baseScaleRef.current, {
                    value: storeState.isHovering ? BASE_SCALE_HOVER : BASE_SCALE_NORMAL,
                    duration: 0.22,
                    ease: "power2.out"
                })
            }
        })

        // DOM 原生捕获
        const onPointerMove = (e: PointerEvent) => {
            state.current.targetX = e.clientX
            state.current.targetY = e.clientY

            // 瞬态推送到 Zustand 供 WebGL 使用
            useCursorStore.setState({
                nx: (e.clientX / window.innerWidth) * 2 - 1,
                ny: -(e.clientY / window.innerHeight) * 2 + 1
            })

            if (state.current.isSleeping) state.current.isSleeping = false // 唤醒 Ticker
        }

        const onVisibilityChange = () => {
            if (document.hidden && cursorRef.current) {
                // 失焦安全重置
                gsap.killTweensOf(baseScaleRef.current)
                baseScaleRef.current.value = BASE_SCALE_NORMAL
                gsap.to(cursorRef.current, { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.2 })
                state.current.isSleeping = true
            }
        }

        // 修复问题 3 和 4：使用更严谨的边界事件，并在进入时瞬移坐标防止速度毛刺
        const onPointerLeave = () => gsap.to(cursorRef.current, { opacity: 0, duration: 0.2 })
        const onPointerEnter = (e: PointerEvent) => {
            if (cursorRef.current) {
                gsap.set(cursorRef.current, { x: e.clientX, y: e.clientY })
                setX(e.clientX)
                setY(e.clientY)
                state.current.lastVisualX = e.clientX
                state.current.lastVisualY = e.clientY
                gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 })
            }
        }

        window.addEventListener('pointermove', onPointerMove)
        document.addEventListener('visibilitychange', onVisibilityChange)
        document.documentElement.addEventListener('pointerleave', onPointerLeave)
        document.documentElement.addEventListener('pointerenter', onPointerEnter)

        // 全局时间轴 Ticker 运行物理算法
        const ticker = gsap.ticker
        const update = () => {
            if (state.current.isSleeping || !cursorRef.current) return

            // GSAP QuickTo 负责追赶鼠标位置
            setX(state.current.targetX)
            setY(state.current.targetY)

            // 读取被 GSAP 修改后的真实视觉坐标
            const visualX = gsap.getProperty(cursorRef.current, "x") as number
            const visualY = gsap.getProperty(cursorRef.current, "y") as number

            // 计算速度向量 (Velocity)
            const dx = visualX - state.current.lastVisualX
            const dy = visualY - state.current.lastVisualY
            state.current.lastVisualX = visualX
            state.current.lastVisualY = visualY
            const velocity = Math.sqrt(dx * dx + dy * dy)

            // transient 读取低频交互状态
            const isHovering = useCursorStore.getState().isHovering
            const targetBaseScale = isHovering ? BASE_SCALE_HOVER : BASE_SCALE_NORMAL
            const currentBaseScale = baseScaleRef.current.value

            // 4. 休眠判定 (短路高成本计算)
            if (velocity < SLEEP_THRESHOLD) {
                const currentScaleX = gsap.getProperty(cursorRef.current, "scaleX") as number
                if (
                    Math.abs(targetBaseScale - currentBaseScale) < 0.005 &&
                    Math.abs(targetBaseScale - currentScaleX) < 0.01
                ) {
                    state.current.isSleeping = true
                    // 平滑回正：消除挤压，角度归零
                    gsap.to(cursorRef.current, {
                        scaleX: targetBaseScale,
                        scaleY: targetBaseScale,
                        rotation: 0,
                        duration: 0.4,
                        ease: "power2.out"
                    })
                    return
                }
            }

            // 5. 形变与角度运算
            if (velocity > SLEEP_THRESHOLD) {
                state.current.currentRotation = Math.atan2(dy, dx) * (180 / Math.PI)
            }

            // Squash & Stretch 计算并施加极值限制 (Clamp)
            const stretch = isHovering ? 0 : velocity * SQUASH_STRETCH_RATIO
            let scaleX = currentBaseScale + stretch
            let scaleY = currentBaseScale - stretch
            scaleX = Math.min(Math.max(scaleX, MIN_SCALE_Y), MAX_SCALE_X)
            scaleY = Math.min(Math.max(scaleY, MIN_SCALE_Y), MAX_SCALE_X)

            // 统一应用 Transform
            gsap.set(cursorRef.current, {
                scaleX,
                scaleY,
                rotation: state.current.currentRotation
            })
        }

        ticker.add(update)

        return () => {
            unsubHover()
            window.removeEventListener('pointermove', onPointerMove)
            document.removeEventListener('visibilitychange', onVisibilityChange)
            document.documentElement.removeEventListener('pointerleave', onPointerLeave)
            document.documentElement.removeEventListener('pointerenter', onPointerEnter)
            ticker.remove(update)
        }
    }, [isEnabled])

    if (!isEnabled) return null

    // CSS 纪律：pointer-events: none 防命中阻断, will-change 开启 GPU 硬件加速
    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-3 h-3 bg-[#F5F5F7] rounded-full pointer-events-none z-[9999] mix-blend-difference opacity-0"
            style={{ willChange: 'transform' }}
        />
    )
}
