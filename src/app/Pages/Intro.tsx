'use client'

const Intro = () => {
    return (
        <div className="flex flex-col w-full h-[100dvh] overflow-x-hidden md:flex-row">
            <div className="w-full h-[70dvh]">
                <div className="h-[20dvh] w-full"></div>
                <div className="flex flex-row items-center h-[50dvh] max-w-full">
                    <h1 className="ml-6 mr-6 font-inria-sans text-9xl font-bold break-all">PORTFOLIO.</h1>
                </div>
            </div>
            <div className="font-medium h-[30dvh] flex flex-col justify-center items-end mr-6">
                <p>AESTHETIC.</p>
                <p>EXPERIENCE.</p>
                <p>INNOVATION.</p>
            </div>
        </div>
    )
}

export default Intro;