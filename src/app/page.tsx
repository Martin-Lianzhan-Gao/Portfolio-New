'use client';

import Intro from "./pages/Intro";
import Description from "./pages/Description";
import Works from "./pages/Works";

export default function Home() {
  return (
    <main className="font-inter w-full flex flex-col">
        <Intro />
        <Description />
        <Works />
    </main>
  );
}
