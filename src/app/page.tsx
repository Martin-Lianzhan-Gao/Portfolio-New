'use client';

import Intro from "./pages/Intro";
import Description from "./pages/Description";
import Skills from "./pages/Skills";
import Works from "./pages/Works";

export default function Page() {

    return (
        <div className="font-inter">
            <Intro />
            <Description />
            <Skills />
            <Works />
        </div>
    );
}
