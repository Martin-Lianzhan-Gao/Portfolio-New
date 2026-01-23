'use client'

import Logo from './elements/Logo'

const Header = () => {

    return (
        <div className="absolute top-0 w-full h-auto flex flex-row items-center justify-between mt-6 z-10">
            <div className="w-auto h-auto ml-12 flex flex-row items-center">
                <div className='mr-2'>
                    <Logo />
                </div>
                <p className='font-montserrat font-medium text-3xl'>
                    Martin Gao
                </p>
            </div>
            {/* Header Menu */}
            <div className='w-auto h-auto mr-12'>
                <svg width={40} height={40} viewBox='0 0 40 15' fill='none'>
                    <line
                        id='line-top'
                        x1="2"
                        y1="3"
                        x2="40"
                        y2="3"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="square"
                    />
                    <line
                        id='line-bottom'
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
        </div>
    )
}

export default Header;