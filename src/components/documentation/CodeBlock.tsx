"use client";

import React, {useState, JSX} from "react";
import {
    CodeBlock,
    googlecode,
    hopscotch
} from "react-code-blocks";
import {ClipboardList, ClipboardCheck} from 'lucide-react';
import styles from "./CodeBlock.module.scss";
import {useGlobalContext} from "@/context/globalContext";

interface CodeBlockSnippetProps {
    language?: string;
    code: string;
}

const {
    wrap,
    copyBtn,
} = styles;

export default function CodeBlockSnippet({
    language = "tsx",
    code
}: CodeBlockSnippetProps): JSX.Element {
    const [copied, setCopied] = useState(false);
    const { theme } = useGlobalContext();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(String(code).trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className={wrap}>
            <button
                className={copyBtn}
                onClick={handleCopy}
            >
                {copied ? <ClipboardCheck size={24} color={"#22c55e"}/> : <ClipboardList size={24}/>}
            </button>
            <CodeBlock
                text={String(code).trim()}
                language={language}
                showLineNumbers={true}
                theme={theme === "light" ? {...googlecode, functionColor: "#e63030"} : {...hopscotch}}
                customStyle={{background: theme === "light" ? "#eff6ff" : "#2e3440", padding: " 10px 42px 10px 10px", borderRadius: "5px"}}
                codeBlockStyle={{}}
            />
        </div>
    );
}
