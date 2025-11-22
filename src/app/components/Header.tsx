'use client'
import Logo from "./Logo";

const Header = () => {

    return (
        <div className="w-full h-auto flex flex-row items-center justify-between pt-6">
            <div className="w-fit ml-8 font-roboto-condensed flex flex-row items-center">
                <Logo />
                <p className="font-bold text-[28px] ml-4">MARTIN /
                    <span className="font-medium text-gray-400"> PORTFOLIO</span>
                </p>
            </div>
            <button className="mr-8">
                <svg
                    viewBox="0 0 40 40"
                    width={58}
                    height={58}
                >
                    <circle
                        cx={20}
                        cy={20}
                        r={18}
                        fill="none"
                    />  
                        <line
                            id="line-top"
                            x1={8}
                            y1={15}
                            x2={32}
                            y2={15}
                            stroke="#000"
                            strokeWidth={1.4}
                            strokeLinecap="round"
                    />
                    <line
                        id="line-middle"
                        x1={8}
                        y1={20}
                        x2={32}
                        y2={20}
                        stroke="#000"
                        strokeWidth={1.4}
                        strokeLinecap="round"
                    />
                    <line
                        id="line-bottom"
                        x1={8}
                        y1={25}
                        x2={32}
                        y2={25}
                        stroke="#000"
                        strokeWidth={1.4}
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </div>
    )
}

export default Header;