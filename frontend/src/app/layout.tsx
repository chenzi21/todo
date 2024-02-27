import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "../components/mainLayout/Navbar";

const inter = Inter({ subsets: ["latin"] });

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
            <body className={inter.className}>
                <Navbar />
                {children}
                <footer className="w-[100%] p-2 absolute left-0 bottom-0 flex justify-center items-center bg-[#f4f4f4] shadow shadow-slate-400">
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

