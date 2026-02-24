'use client'

const Intro = () => {
    return (
        <div className="flex flex-col w-full h-[100dvh] overflow-x-hidden">
            <div className="w-full h-[70dvh] flex flex-col justify-center md:h-[60dvh] @container">
                <div className="ml-6 mr-6 w-auto font-inria-sans text-[14cqh] font-bold wrap-break-word md:text-[16cqw]
                md:ml-12">
                    <h1 className="tracking-tight">MARTIN GAO.</h1>
                </div>
            </div>
            <div className="font-semibold text-xl h-[30dvh] w-full flex flex-row justify-end items-center md:h-[20dvh] md:justify-start md:text-2xl">
                <div className="w-3/5 mr-6 md:ml-12 md:w-2/5">
                    EXPERIENCED FULL-STACK DEVELOPER WITH INNOVATION, CREATIVITY AND AESTHETICS.
                </div>
            </div>
            <div className="hidden md:h-[20dvh] font-semibold text-2xl md:flex md:flex-row md:justify-end md:w-full md:items-center">
                <p className="mr-12">( SCROLL DOWN )</p>
            </div>
        </div>
    )
}

export default Intro;