'use client'

const Intro = () => {
    return (
        <div className="flex flex-col w-full h-[100dvh] overflow-x-hidden md:flex-row">
            <div className="w-full h-[70dvh]">
                <div className="h-[20dvh] w-full"></div>
                <div className="flex flex-row items-center h-[50dvh] max-w-full">
                    <div className="ml-6 mr-6 font-inria-sans text-9xl font-bold">
                        <h1>PORT</h1>
                        <h1>FOL</h1>
                        <h1>IO.</h1>
                    </div>
                </div>
            </div>
            <div className="font-semibold h-[30dvh] flex flex-col justify-center">
                <div className="flex flex-col items-end mr-6">
                    <p>DEV WITH</p>
                    <p>AESTHETIC,</p>
                    <p>PASSION,</p>
                    <p>INNOVATION.</p>
                </div>
                {/* <div className="flex flex-row justify-start ml-6">
                    <p>(SCROLL DOWN)</p>
                </div> */}
            </div>
        </div>
    )
}

export default Intro;