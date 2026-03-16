'use client';

import Intro from "./pages/Intro";
import Description from "./pages/Description";
import Skills from "./pages/Skills";

export default function Page() {

    return (
        <div className="font-inter">
            <Intro />
            <Description />
            <Skills />
        </div>
    );
}
