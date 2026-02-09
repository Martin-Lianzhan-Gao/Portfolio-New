'use client'

import Spline from "@splinetool/react-spline";

export default function BalloonDog() {
    return (
        <div className="bg-white w-full h-full">
            <Spline
                scene="/models/baloon_dog.spline" />
        </div>
    );
}