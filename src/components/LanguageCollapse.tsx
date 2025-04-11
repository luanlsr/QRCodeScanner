import { useState, useEffect, useRef } from "react";
import i18n from "../i18n";
import Flag from "react-world-flags"; // substitua pelo nome da sua lib, se for outro

const languages = [
    { code: "pt", label: "Português", country: "BR" },
    { code: "en", label: "English", country: "GB" },
    { code: "es", label: "Español", country: "ES" },
    { code: "fr", label: "Français", country: "FR" },
    { code: "de", label: "Deutsch", country: "DE" },
];

export const LanguageCollapse = () => {
    const [open, setOpen] = useState(false);
    const collapseRef = useRef<HTMLDivElement>(null);

    const current = languages.find((lang) => lang.code === i18n.language) || languages[0];

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
        <div ref={collapseRef} className="relative z-50">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <Flag code={current.country} style={{ width: "24px", height: "16px" }} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                    {languages.map((lang) => (
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
