import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Inter, Inria_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import SmoothScrolling from "./components/SmoothScrolling";
import MegaFooter from "./pages/MegaFooter";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic']
})

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic']
})

const inriaSans = Inria_Sans({
    variable: "--font-inria-sans",
    subsets: ["latin"],
    weight: ['300', '400', '700'],
    style: ['normal', 'italic']
})

const cormorantGaramond = Cormorant_Garamond({
    variable: "--font-cormorant-garamond",
    subsets: ["latin"],
    weight: ['300', '400', '700'],
    style: ['normal', 'italic']
})

export const metadata: Metadata = {
    title: "Martin's Portfolio",
    description: "Martin's experimental portfolio",
    icons: {
        icon: [{
            url: '/icon-dark.svg',
            media: '(prefers-color-scheme: light)',
        }, {
            url: '/icon-white.svg',
            media: '(prefers-color-scheme: dark)',
        }]
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${inter.variable} ${inriaSans.variable} ${cormorantGaramond.variable} antialiased bg-[#000000]`}
            >
                <div className="relative z-10 bg-[#0d0d0d] rounded-b-[2rem] md:rounded-b-[4rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] min-h-screen">
                    <Header />
                    {children}
                </div>

                <div className="theme-dark relative w-full h-[100dvh] pointer-events-none z-0"></div>

                <MegaFooter />
            </body>
        </html>
    );
}
