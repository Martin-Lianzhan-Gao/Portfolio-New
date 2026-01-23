import GetInTouchButton from "../components/GetInTouchButton";

const Intro = () => {
    return (
        <div className="flex flex-row">
            <div className="text-9xl flex flex-col items-start justify-center h-[100vh] w-[50vw] pl-20">
                <h1>MARTIN GAO</h1>
                <h1 className="text-[#A4A4A4]">LIANZHAN.</h1>
                <p className="ml-2 text-xl font-semibold">Engineered for Exceptional Experiences ©2026</p>
                <GetInTouchButton />
            </div>
            <div className="flex flex-col h-[100vh] w-[50vw] items-end justify-around pr-20">
                <div className="h-[300px] w-[400px] bg-black rounded-4xl"></div>
                <p className="text-right text-md">A Computer Science graduate dedicated to building high-performance web interfaces. Merging technical precision with user-centered design to create scalable applications. Driven by curiosity and a constant pursuit of innovation.</p>
            </div>
        </div>
    )
}

export default Intro;