import { create } from 'zustand'

export type CursorMode = "default" | "pointer" | "text" | "icon" | "combo"
export type CursorIcon = "arrow-down" | "arrow-right" | "arrow-up-right"

interface CursorConfig {
    mode?: CursorMode
    label?: string
    icon?: CursorIcon
}

interface CursorState {
    // 高频归一化坐标 (-1 到 1)，供 WebGL Raycaster 瞬态读取，严禁在组件中作为依赖订阅
    nx: number
    ny: number

    // 当前光标语义状态
    mode: CursorMode
    label: string
    icon?: CursorIcon

    setCursor: (config: CursorConfig) => void
    resetCursor: () => void
}

// 模块级延迟计时器，用于 resetCursor 的防抖
let _resetTimer: ReturnType<typeof setTimeout> | null = null

export const useCursorStore = create<CursorState>((set) => ({
    nx: 0,
    ny: 0,

    mode: "default",
    label: "",
    icon: undefined,

    setCursor: ({ mode = "default", label = "", icon }) => {
        // 有新的 setCursor 进来时，立刻取消任何待执行的 reset，避免中间态闪烁
        if (_resetTimer) {
            clearTimeout(_resetTimer)
            _resetTimer = null
        }
        set({ mode, label, icon })
    },

    resetCursor: () => {
        // 延迟 reset，给鼠标从一个 CursorTarget 滑到另一个的时间窗口
        if (_resetTimer) clearTimeout(_resetTimer)
        _resetTimer = setTimeout(() => {
            _resetTimer = null
            set({ mode: "default", label: "", icon: undefined })
        }, 50)
    },
}))
