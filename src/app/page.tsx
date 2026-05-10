'use client';

import Intro from "./pages/Intro";
import Description from "./pages/Description";
import Works from "./pages/Works";
import Skills from "./pages/Skills";
import MegaFooter from "./pages/MegaFooter";

export default function Home() {
    return (
        <main className="font-inter">
            <Intro />
            <Description />
            <Works />
            <Skills />
            <MegaFooter />
        </main>
    );
}
