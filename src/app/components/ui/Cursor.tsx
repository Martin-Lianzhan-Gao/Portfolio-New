'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { useCursorStore } from '@/hooks/useCursorStore'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'

// --- 物理极值与运动常量配置 ---
const SQUASH_STRETCH_RATIO = 0.008   // 速度到形变的转换乘数
const MAX_SCALE_X = 1.8             // 运动方向拉伸上限
const MIN_SCALE_Y = 0.45             // 垂直方向挤压下限
const BASE_SCALE_NORMAL = 0.5       // 默认缩放倍率
const BASE_SCALE_HOVER = 1.15       // Hover命中缩放倍率
const SLEEP_THRESHOLD = 0.1         // 判定物理休眠的速度阈值

// --- 面板视觉默认值 ---
const DEFAULT_PANEL_BG = '#f5f5f7'
const DEFAULT_CONTENT_COLOR = '#0a0a0a'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function Cursor() {
    const rootRef = useRef<HTMLDivElement>(null)
    const physicsRef = useRef<HTMLDivElement>(null)
    const bgRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const baseScaleRef = useRef({ value: BASE_SCALE_NORMAL })
    const morphTlRef = useRef<gsap.core.Timeline | null>(null)

    const mode = useCursorStore(state => state.mode)
    const label = useCursorStore(state => state.label)
    const icon = useCursorStore(state => state.icon)
    const panelBg = useCursorStore(state => state.panelBg)
    const contentColor = useCursorStore(state => state.contentColor)

    // 用 ref 同步 mode，避免 ticker 每帧调用 getState()
    const modeRef = useRef(mode)
    modeRef.current = mode

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
        if (!isEnabled || !rootRef.current || !physicsRef.current || !bgRef.current || !contentRef.current) return

        // 初始化默认状态
        gsap.set(rootRef.current, { xPercent: -50, yPercent: -50 })
        gsap.set(physicsRef.current, { scale: BASE_SCALE_NORMAL, force3D: true })
        gsap.set(contentRef.current, { opacity: 0, y: 3 })
        baseScaleRef.current.value = BASE_SCALE_NORMAL

        // 确保初始物理宽高为24px
        gsap.set(bgRef.current, { width: 24, height: 24 })

        // 核心：创建 GSAP 极速 Setter (单一根节点追踪)
        const setX = gsap.quickTo(rootRef.current, "x", { duration: 0.15, ease: "power3" })
        const setY = gsap.quickTo(rootRef.current, "y", { duration: 0.15, ease: "power3" })

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
            if (document.hidden && rootRef.current) {
                // 失焦安全重置
                gsap.killTweensOf(baseScaleRef.current)
                baseScaleRef.current.value = BASE_SCALE_NORMAL
                gsap.to(physicsRef.current, { scale: BASE_SCALE_NORMAL, duration: 0.2 })
                state.current.isSleeping = true
            }
        }

        // 边界事件：进出视口
        const onPointerLeave = () => {
            gsap.to(rootRef.current, { opacity: 0, duration: 0.2 })
        }
        const onPointerEnter = (e: PointerEvent) => {
            if (rootRef.current) {
                gsap.set(rootRef.current, { x: e.clientX, y: e.clientY })
                setX(e.clientX)
                setY(e.clientY)
                state.current.lastVisualX = e.clientX
                state.current.lastVisualY = e.clientY
                gsap.to(rootRef.current, { opacity: 1, duration: 0.2 })
            }
        }

        window.addEventListener('pointermove', onPointerMove)
        document.addEventListener('visibilitychange', onVisibilityChange)
        document.documentElement.addEventListener('pointerleave', onPointerLeave)
        document.documentElement.addEventListener('pointerenter', onPointerEnter)

        // 全局时间轴 Ticker 运行物理算法
        const ticker = gsap.ticker
        const update = () => {
            if (state.current.isSleeping || !rootRef.current || !physicsRef.current) return

            // GSAP QuickTo 负责追赶鼠标位置
            setX(state.current.targetX)
            setY(state.current.targetY)

            // 读取被 GSAP 修改后的真实视觉坐标
            const visualX = gsap.getProperty(rootRef.current, "x") as number
            const visualY = gsap.getProperty(rootRef.current, "y") as number

            // 计算速度向量 (Velocity)
            const dx = visualX - state.current.lastVisualX
            const dy = visualY - state.current.lastVisualY
            state.current.lastVisualX = visualX
            state.current.lastVisualY = visualY
            const velocity = Math.sqrt(dx * dx + dy * dy)

            // transient 读取低频交互状态（从 ref 而非 store）
            const currentMode = modeRef.current
            const isPointer = currentMode === "pointer"
            const isPanelModeActive = currentMode === 'text' || currentMode === 'icon' || currentMode === 'combo'

            const targetBaseScale = isPointer ? BASE_SCALE_HOVER : BASE_SCALE_NORMAL
            const currentBaseScale = baseScaleRef.current.value

            // 4. 休眠判定 (短路高成本计算)
            if (velocity < SLEEP_THRESHOLD) {
                const currentScaleX = gsap.getProperty(physicsRef.current, "scaleX") as number
                if (
                    Math.abs(targetBaseScale - currentBaseScale) < 0.005 &&
                    Math.abs(targetBaseScale - currentScaleX) < 0.01
                ) {
                    state.current.isSleeping = true
                    // 平滑回正：消除挤压，角度归零
                    gsap.to(physicsRef.current, {
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
            // 当处于大圆模式 (isPanelModeActive) 时，禁用物理拉伸，保持纯正的圆形
            const stretch = (isPointer || isPanelModeActive) ? 0 : velocity * SQUASH_STRETCH_RATIO
            let scaleX = currentBaseScale + stretch
            let scaleY = currentBaseScale - stretch
            scaleX = Math.min(Math.max(scaleX, MIN_SCALE_Y), MAX_SCALE_X)
            scaleY = Math.min(Math.max(scaleY, MIN_SCALE_Y), MAX_SCALE_X)

            // 统一应用 Transform 到 physicsRef (外层负责形变)
            gsap.set(physicsRef.current, {
                scaleX,
                scaleY,
                rotation: state.current.currentRotation
            })
        }

        ticker.add(update)

        return () => {
            if (morphTlRef.current) morphTlRef.current.kill()
            window.removeEventListener('pointermove', onPointerMove)
            document.removeEventListener('visibilitychange', onVisibilityChange)
            document.documentElement.removeEventListener('pointerleave', onPointerLeave)
            document.documentElement.removeEventListener('pointerenter', onPointerEnter)
            ticker.remove(update)
        }
    }, [isEnabled])

    useIsomorphicLayoutEffect(() => {
        if (!isEnabled || !bgRef.current || !contentRef.current || !physicsRef.current) return

        state.current.isSleeping = false

        // 基础物理缩放 (pointer 模式时放大光标)
        gsap.killTweensOf(baseScaleRef.current)
        gsap.to(baseScaleRef.current, {
            value: mode === "pointer" ? BASE_SCALE_HOVER : BASE_SCALE_NORMAL,
            duration: 0.22,
            ease: "power2.out"
        })

        // --- Morph Timeline 编排 ---
        const isPanel = mode === 'text' || mode === 'icon' || mode === 'combo'

        // 杀掉上一轮未完成的 morph
        if (morphTlRef.current) {
            morphTlRef.current.kill()
            morphTlRef.current = null
        }

        if (isPanel) {
            // 动态计算尺寸: 基于实际渲染的文本宽度动态决定 Scale
            const contentWidth = contentRef.current.offsetWidth
            // 补偿圆形的对角线截断，给予足够的视觉 Padding
            const paddingX = mode === 'icon' ? 24 : 52
            const targetDiameter = Math.max(contentWidth + paddingX, 48) // 保证最小尺寸

            // 因为 physicsRef 维持在 0.5 物理缩放，所以物理宽高要是视觉宽高的两倍
            const physicalDiameter = targetDiameter / BASE_SCALE_NORMAL

            // --- Entering / Updating: dot → large circle morph ---
            const tl = gsap.timeline()
            morphTlRef.current = tl

            // 进入 Panel 模式瞬间取消反色，让圆圈和文字保持正常实色
            tl.set(rootRef.current, { mixBlendMode: 'normal' }, 0)

            // 1. bgRef 直接进行真实的宽高动画，抛弃 Scale 的纹理模糊
            tl.to(bgRef.current, {
                width: physicalDiameter,
                height: physicalDiameter,
                duration: 0.42,
                ease: "expo.out",
            }, 0)

            // 2. 文本层淡入
            tl.fromTo(contentRef.current,
                { opacity: 0, y: 3, scale: 0.92 },
                { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power2.out" },
                0.1  // 在大圆膨胀期间淡入
            )

            // 3. 动态应用自定义颜色
            const bg = panelBg || DEFAULT_PANEL_BG
            const color = contentColor || DEFAULT_CONTENT_COLOR
            tl.to(bgRef.current, { backgroundColor: bg, duration: 0.3, ease: "power2.out" }, 0)
            tl.to(contentRef.current, { color: color, duration: 0.3, ease: "power2.out" }, 0)

        } else {
            // --- Exiting: large circle → dot morph ---
            const tl = gsap.timeline()
            morphTlRef.current = tl

            // 1. 文本先收起
            tl.to(contentRef.current, {
                opacity: 0,
                y: 2,
                scale: 0.96,
                duration: 0.12,
            }, 0)

            // 2. bgRef 回归真实的 24px 物理尺寸
            tl.to(bgRef.current, {
                width: 24,
                height: 24,
                duration: 0.28,
                ease: "power3.out",
            }, 0)

            // 缩回小圆后恢复反色模式、还原默认颜色
            tl.set(rootRef.current, { mixBlendMode: 'difference' })
            tl.set(bgRef.current, { backgroundColor: DEFAULT_PANEL_BG })
            tl.set(contentRef.current, { color: '' })
        }
    }, [isEnabled, mode, label, icon, panelBg, contentColor])

    if (!isEnabled) return null

    const IconComponent = icon === 'arrow-down' ? ArrowDown :
        icon === 'arrow-right' ? ArrowRight :
            icon === 'arrow-up-right' ? ArrowUpRight : null

    // CSS 纪律：pointer-events: none 防命中阻断, will-change 开启 GPU 硬件加速
    return (
        <div
            ref={rootRef}
            className="will-change-transform fixed top-0 left-0 pointer-events-none z-9999 opacity-0 mix-blend-difference flex items-center justify-center"
        >
            {/* Physics Layer: 只负责根据鼠标速度形变和小幅拉伸 */}
            <div ref={physicsRef} className="absolute flex items-center justify-center will-change-transform">
                {/* Background Layer: 默认色圆。抛弃 Scale，直接动画宽高，保证边缘永远是矢量级的绝对锐利 */}
                <div
                    ref={bgRef}
                    className="w-6 h-6 rounded-full will-change-transform flex items-center justify-center"
                    style={{ backgroundColor: DEFAULT_PANEL_BG }}
                />
            </div>

            {/* Content Layer */}
            <div
                ref={contentRef}
                className="absolute z-10 flex items-center justify-center gap-2 whitespace-nowrap tracking-[0.02em]"
                style={{ color: DEFAULT_CONTENT_COLOR }}
            >
                {(mode === 'text' || mode === 'combo') && label && <span className="text-[16px] font-medium">{label}</span>}
                {(mode === 'icon' || mode === 'combo') && IconComponent && <IconComponent className="h-4 w-4" strokeWidth={2.5} />}
            </div>
        </div>
    )
}
