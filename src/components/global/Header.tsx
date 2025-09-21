"use client"

import {JSX} from "react";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import styles from "./Header.module.scss";
import {useGlobalContext} from "@/context/globalContext";
import {clsx} from "clsx";

export default function Header(): JSX.Element {
    const {header, navContainer, nav, menuItem, active} = styles;
    const {theme, activePage} = useGlobalContext();

    return (
        <header className={clsx(header, {
            [styles.light]: theme === "light",
            [styles.dark]: theme === "dark",
        })}>
            <div className={navContainer}>
                <nav className={nav}>
                    <Link href="/">
                        <button
                            className={clsx(menuItem, {
                                [active]: activePage === "Dashboard"
                            })}
                            disabled={activePage === "Dashboard"}>
                            Dashboard
                        </button>
                    </Link>
                    <Link href="/documentation">
                        <button className={clsx(menuItem, {
                            [active]: activePage === "Documentation"
                        })} disabled={activePage === "Documentation"}>
                            Documentation
                        </button>
                    </Link>
                </nav>
                <ThemeSwitcher/>
            </div>
        </header>
    );
}
