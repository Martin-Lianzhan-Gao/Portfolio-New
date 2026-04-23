import { create } from 'zustand'

interface CursorState {
  // 高频归一化坐标 (-1 到 1)，供 WebGL Raycaster 瞬态读取，严禁在组件中作为依赖订阅
  nx: number
  ny: number
  
  // 低频 UI 交互状态
  isHovering: boolean
  
  // 低频动作 setter
  setHovering: (hover: boolean) => void
}

export const useCursorStore = create<CursorState>((set) => ({
  nx: 0,
  ny: 0,
  
  isHovering: false,
  setHovering: (isHovering) => set({ isHovering }),
}))
