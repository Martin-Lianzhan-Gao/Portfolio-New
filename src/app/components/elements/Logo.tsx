'use client'

interface LogoProps {
    color?: string
}

const Logo = ({ color = 'black' }: LogoProps) => {
    return (
        <div>
            <svg viewBox="0 0 47 21" fill="none">
                <path
                    d="M28.6149 18.3548H43.6149C20.8649 -7.42402 3.36493 -0.549673 1.61493 18.3548C21.2466 22.8024 22.6149 13.4806 24.1149 4.49556"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="square"
                    className="transition-colors duration-300"
                />
            </svg>
        </div>
    )
}

export default Logo;
