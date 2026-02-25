'use client'

import { forwardRef } from 'react'

interface LogoProps {
    color?: string
}

// 用 forwardRef 把 ref 转发给 path 元素，让 GSAP 可以直接插值颜色
const Logo = forwardRef<SVGPathElement, LogoProps>(({ color = 'currentColor' }, ref) => {
    return (
        <div>
            <svg viewBox="0 0 47 21" fill="none">
                <path
                    ref={ref}
                    d="M28.6149 18.3548H43.6149C20.8649 -7.42402 3.36493 -0.549673 1.61493 18.3548C21.2466 22.8024 22.6149 13.4806 24.1149 4.49556"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="square"
                // 删除了 tailwind 的 transition-colors，把控制权交给 GSAP
                />
            </svg>
        </div>
    )
})

// 添加 display name 以避免 ESLint/React 警告
Logo.displayName = 'Logo'

export default Logo;
