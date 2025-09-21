"use client";

import { ReactNode, JSX } from "react";
import styles from "./DocLayout.module.scss";
import {useGlobalContext} from "@/context/globalContext";
import {clsx} from "clsx";
import { FileText } from 'lucide-react';

const {
    wrap,
    light,
    dark,
    headingContainer,
    iconContainer,
    heading
} = styles;

export default function DocLayout({ children }: { children: ReactNode }): JSX.Element {
    const {theme} = useGlobalContext();

    return (
        <div className={clsx(wrap, {
            [light]: theme === 'light',
            [dark]: theme === 'dark'
        })}>
            <div className={headingContainer}>
                <div className={iconContainer}>
                    <FileText size={24}/>
                </div>
                <h1 className={heading}>Documentation</h1>
            </div>

            {children}
        </div>
    );
}