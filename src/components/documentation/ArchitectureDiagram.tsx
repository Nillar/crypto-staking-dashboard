"use client";

import {JSX} from "react";
import {useGlobalContext} from "@/context/globalContext";
import clsx from "clsx";
import styles from "./ArchitectureDiagram.module.scss";

const {
    diagramWrapper,
    diagramSvg,
    foWrap,
    box,
    tooltip,
    arrow,
    arrowHead
} = styles;

export default function ArchitectureDiagram(): JSX.Element {
    const {theme} = useGlobalContext();

    const boxes = [
        { x: 300, y: 40, label: "Global Context", description: "Centralized state manager: handles theme, fiat currency, active page, and live crypto prices from CoinGecko" },
        { x: 25, y: 150, label: "Layout", description: "Root layout shared across pages: injects Header, provides consistent theming, and persists global state" },
        { x: 25, y: 250, label: "Header", description: "Top navigation bar: displays active page, switches theme, and provides quick access to Documentation" },
        { x: 25, y: 350, label: "ThemeSwitcher", description: "Interactive toggle inside Header: updates and reacts to the current theme from GlobalContext" },
        { x: 575, y: 150, label: "Dashboard (page.tsx)", description: "Main page for staking simulation: consumes global data and renders StakingForm and StakingChart" },
        { x: 350, y: 250, label: "StakingForm", description: "User input form: converts between fiat and crypto, debounced inputs, updates GlobalContext on change" },
        { x: 575, y: 250, label: "StakingChart", description: "Dynamic chart visualization: consumes fiat, crypto, and APY data from GlobalContext to display staking growth." },
    ];

    return (
        <div className={diagramWrapper}>
            <h3>Architecture Diagram</h3>

            <svg
                viewBox="0 0 800 450"
                className={diagramSvg}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Arrows */}
                {/* GlobalContext -> Layout */}
                <line x1="300" y1="85" x2="225" y2="150" className={arrow} markerEnd="url(#arrow)" />

                {/* GlobalContext -> Dashboard */}
                <line x1="500" y1="85" x2="575" y2="150" className={arrow} markerEnd="url(#arrow)" />

                {/* Layout -> Header */}
                <line x1="125" y1="200" x2="125" y2="245" className={arrow} markerEnd="url(#arrow)" />

                {/* Header -> ThemeSwitcher */}
                <line x1="125" y1="300" x2="125" y2="345" className={arrow} markerEnd="url(#arrow)" />

                {/* ThemeSwitcher <-> GlobalContext */}
                <line x1="330" y1="95" x2="225" y2="350" className={arrow} markerStart="url(#arrowStart)" markerEnd="url(#arrow)" />

                {/* Dashboard -> StakingChart */}
                <line x1="650" y1="200" x2="650" y2="250" className={arrow} markerEnd="url(#arrow)" />

                {/* Dashboard -> StakingForm */}
                <line x1="600" y1="200" x2="550" y2="250" className={arrow} markerEnd="url(#arrow)" />

                {/* GlobalContext -> StakingChart */}
                <line x1="450" y1="85" x2="600" y2="245" className={arrow} markerEnd="url(#arrow)" />

                {/* StakingForm <-> GlobalContext */}
                <line x1="400" y1="95" x2="450" y2="245" className={arrow} markerStart="url(#arrowStart)" markerEnd="url(#arrow)" />

                {/* Boxes */}
                {boxes.map((boxData, idx) => (
                    <foreignObject key={idx} x={boxData.x} y={boxData.y} width="200" height="60" className={foWrap}>
                        <div
                            className={clsx(box, {
                                [styles.light]: theme === "light",
                                [styles.dark]: theme === "dark",
                            })}
                        >
                            {boxData.label}
                            <span className={tooltip}>{boxData.description}</span>
                        </div>
                    </foreignObject>
                ))}

                {/* Arrow markers */}
                <defs>
                    {/* One-way arrow */}
                    <marker
                        id="arrow"
                        markerWidth="10"
                        markerHeight="10"
                        refX="8"
                        refY="5"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path d="M0,0 L10,5 L0,10 z" className={arrowHead} />
                    </marker>

                    {/* Two-way arrow*/}
                    <marker
                        id="arrowStart"
                        markerWidth="10"
                        markerHeight="10"
                        refX="2"
                        refY="5"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path d="M10,0 L0,5 L10,10 z" className={arrowHead} />
                    </marker>
                </defs>
            </svg>
        </div>
    );
}
