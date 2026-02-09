'use client'

const Intro = () => {
    return (
        <div className="flex flex-col md:flex-row w-full h-[100vh] overflow-x-hidden ">
            <div className="h-[20vh]"></div>
            <div className="w-full h-[50vh] flex flex-row items-center">
                <h1 className="ml-6 font-inria-sans text-9xl font-bold max-w-full break-words">PORT<br />FOL<br />IO.</h1>
            </div>
            <div className="font-medium h-[30vh] flex flex-col justify-center items-end mr-6">
                <p>AESTHETIC.</p>
                <p>EXPERIENCE.</p>
                <p>INNOVATION.</p>
            </div>
        </div>
    )
}

export default Intro;