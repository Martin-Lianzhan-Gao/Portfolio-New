import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Inter, Inria_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

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
                className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${inter.variable} ${inriaSans.variable} antialiased`}
            >
                <Header />
                {children}
            </body>
        </html>
    );
}
