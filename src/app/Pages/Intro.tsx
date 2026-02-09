'use client'

const Intro = () => {
    return (
        <div className="flex flex-col md:flex-row w-full h-[100dvh] overflow-x-hidden ">
            <div className="h-[20dvh]"></div>
            <div className="w-full h-[50dvh] flex flex-row items-center">
                <h1 className="ml-6 font-inria-sans text-9xl font-bold max-w-full break-words">PORT<br />FOL<br />IO.</h1>
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