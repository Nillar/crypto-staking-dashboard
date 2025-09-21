import {JSX} from "react";
import "@/assets/styles/globals.scss";
import {GlobalContext} from "@/context/globalContext";
import type {Metadata} from "next";
import Header from "@/components/global/Header";

export const metadata: Metadata = {
    title: "Crypto Staking Dashboard",
    description: "Track and simulate crypto staking returns with a clean, interactive dashboard.",
};

export default function RootLayout({
   children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    return (
        <html lang="en">
            <body>
                <GlobalContext>
                    <Header />
                    <main>{children}</main>
                </GlobalContext>
            </body>
        </html>
    );
}