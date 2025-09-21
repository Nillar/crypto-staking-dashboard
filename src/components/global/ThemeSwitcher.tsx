"use client";

import {JSX} from 'react';
import {useGlobalContext} from "@/context/globalContext";
import clsx from "clsx";
import {Sun, Moon} from "lucide-react";
import styles from "./ThemeSwitcher.module.scss";

export default function ThemeSwitcher(): JSX.Element {
    const {theme, toggleTheme} = useGlobalContext();
    const {toggle, light, dark, iconWrap, slider, sliderLeft, sliderRight} = styles;

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={clsx(toggle, {
                [light]: theme === "light",
                [dark]: theme === "dark",
            })}
            aria-label="Toggle theme"
        >
            <div className={iconWrap}>
                <Sun size={16} />
                <Moon size={16} />
            </div>
            <div className={clsx(slider, {
                [sliderLeft]: theme === "light",
                [sliderRight]: theme === "dark"
            })}/>
        </button>
    );
}
