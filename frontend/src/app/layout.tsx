import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "../components/mainLayout/Navbar";

const font = Open_Sans({ weight: "500", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "To Do App",
    description:
        "a Fun To Do App, experimenting with nextjs, golang, mysql and docker",
    icons: { icon: "/favicon.ico", href: "/favicon.ico" },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={font.className}>
                <Navbar />
                {children}
                <footer className="w-[100%] p-2 fixed left-0 bottom-0 flex justify-center items-center bg-[#f4f4f4] shadow shadow-slate-400">
                    <small>
                        &copy; Copyright {new Date().getFullYear()} Chen Zadik.
                        All Rights Reserved
                    </small>
                </footer>
                <Toaster
                    position="top-center"
                    richColors
                    pauseWhenPageIsHidden
                />
            </body>
        </html>
    );
}

