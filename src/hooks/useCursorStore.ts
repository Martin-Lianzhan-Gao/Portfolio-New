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

export const useCursorStore = create<CursorState>((set) => ({
    nx: 0,
    ny: 0,

    mode: "default",
    label: "",
    icon: undefined,

    setCursor: ({ mode = "default", label = "", icon }) => set({
        mode,
        label,
        icon,
    }),

    resetCursor: () => set({
        mode: "default",
        label: "",
        icon: undefined,
    }),
}))
