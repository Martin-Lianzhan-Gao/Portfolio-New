'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { useCursorStore, CursorMode, CursorIcon, CursorVisualConfig } from '@/hooks/useCursorStore'

interface CursorTargetProps extends CursorVisualConfig {
    className?: string
    children: ReactNode
}

export default function CursorTarget({
    mode,
    label,
    icon,
    panelBg,
    contentColor,
    className = '',
    children
}: CursorTargetProps) {
    const setCursor = useCursorStore(state => state.setCursor)
    const resetCursor = useCursorStore(state => state.resetCursor)
    const isHovering = useRef(false)

    // 如果没有显式传入 mode，则根据内容推导
    const computedMode: CursorMode = mode || (
        (label && icon) ? 'combo' :
            label ? 'text' :
                icon ? 'icon' :
                    'pointer'
    )

    // 处理 Unmount 时的清理
    useEffect(() => {
        return () => {
            if (isHovering.current) {
                resetCursor()
            }
        }
    }, [resetCursor])

    const handlePointerEnter = () => {
        // coarse pointer（触摸屏等）不触发自定义光标逻辑
        if (window.matchMedia('(pointer: coarse)').matches) return

        isHovering.current = true
        setCursor({ mode: computedMode, label, icon, panelBg, contentColor })
    }

    const handlePointerLeave = () => {
        if (isHovering.current) {
            isHovering.current = false
            resetCursor()
        }
    }

    const handleClick = () => {
        if (isHovering.current) {
            isHovering.current = false
            resetCursor()
        }
    }

    return (
        <div
            className={className}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick}
            style={{ display: 'contents' }}
        >
            {children}
        </div>
    )
}
