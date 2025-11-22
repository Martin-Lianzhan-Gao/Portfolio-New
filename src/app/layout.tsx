import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton, Roboto_Condensed } from "next/font/google";
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

// manually imported font style
const anton = Anton({
    variable: "--font-anton",
    subsets: ["latin"],
    weight: '400',
    style: 'normal'
})

const robotoCondensed = Roboto_Condensed({
    variable: "--font-roboto-condensed",
    subsets: ["latin"],
    weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic']
})

export const metadata: Metadata = {
    title: "Martin's Life Lab",
    description: "Martin's experimental portfolio",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${robotoCondensed.variable} ${anton.variable} antialiased`}
            >   
                <Header />
                {children}
            </body>
        </html>
    );
}
