import { useState, useRef, useEffect } from "react";
import Flag from "react-world-flags";
import i18n from "../i18n";
import { languages } from "../utils/languages";

export const LanguageSelector = () => {
    const [open, setOpen] = useState(false);
    const collapseRef = useRef<HTMLDivElement>(null);

    const current = languages.find(lang => lang.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (collapseRef.current && !collapseRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={collapseRef} className="relative w-full">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            >
                <div className="flex items-center gap-2">
                    <Flag code={current.country} style={{ width: "24px", height: "16px" }} />
                    {current.label}
                </div>
                <span className="ml-2">▼</span>
            </button>

            {open && (
                <div className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-10">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                i18n.changeLanguage(lang.code);
                                setOpen(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2 w-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Flag code={lang.country} style={{ width: "24px", height: "16px" }} />
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
