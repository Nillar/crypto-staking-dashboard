"use client";

import {JSX, ReactNode} from "react";
import styles from "./DocSection.module.scss";
import {useGlobalContext} from "@/context/globalContext";
import {clsx} from "clsx";

interface DocSectionProps {
    title?: string;
    subtitle?: string;
    children?: ReactNode;
}
const {
    section,
    light,
    dark,
    heading,
    subheading,
    content
} = styles;

export default function DocSection({ title = "", subtitle = "", children }: DocSectionProps): JSX.Element {
    const {theme} = useGlobalContext();
    return (
        <section className={clsx(section, {
            [light]: theme === "light",
            [dark]: theme === "dark"
        })}>
            {title !== "" && <h2 className={heading}>{title}</h2>}
            {subtitle !== "" && <h3 className={subheading}>{subtitle}</h3>}
            {children !== null && children !== undefined && <div className={content}>{children}</div>}
        </section>
    );
}
