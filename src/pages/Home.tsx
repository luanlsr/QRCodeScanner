import React from 'react';
import { useNavigate } from 'react-router-dom';
import Illustration from '../assets/undraw_apps.svg';
import { useProtectRoute } from '../hooks/useProtectRout';
import { useTranslation } from "react-i18next";

export const Home: React.FC = () => {
    const navigate = useNavigate();
    useProtectRoute();
    const { t } = useTranslation();

    return (
        <main
            className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8 text-center"
            style={{ height: 'calc(100vh - 73px)' }}
        >
            <img
                src={Illustration}
                alt="QR Code Illustration"
                className="w-64 h-64 mb-4"
            />
            <h1 className="text-3xl sm:text-4xl font-bold dark:text-white text-gray-800 mb-4">
                {t("home.title")}
            </h1>
            <p className="text-gray-600 mb-8 text-lg max-w-xl">
                {t("home.description")}
            </p>

            <div className="flex gap-4 flex-col sm:flex-row">

            </div>
        </main>
    );
};
