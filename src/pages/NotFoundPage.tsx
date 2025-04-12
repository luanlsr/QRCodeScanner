import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DinoGame from 'react-chrome-dino-ts';
import 'react-chrome-dino-ts/index.css';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
            {/* Coloca o jogo do Dino no topo */}
            <div className="mb-8">
                <DinoGame />
            </div>

            {/* Centraliza o conteúdo do 404 */}
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-2xl font-semibold mb-2">{t('notFound.notFound')}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('notFound.pageNotFound') || 'A página que você está procurando não existe.'}
                </p>
                <Link
                    to="/"
                    className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                    {t('notFound.goHome') || 'Voltar para a página inicial'}
                </Link>
            </div>
        </div>
    );
}
