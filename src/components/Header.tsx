import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../hooks/darkMode';
import { Switch } from '@headlessui/react';
import { supabase } from '../superbase';
import { User } from '@supabase/supabase-js';
import { ChevronDown, Settings, LogOut } from 'lucide-react';

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [enabled, setEnabled] = useDarkMode();
    const [user, setUser] = useState<User | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userAvatar = user?.user_metadata?.avatar_url;
    const avatarSrc = userAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=User';

    const baseStyle = 'text-xl font-semibold text-white';

    return (
        <header className="w-full bg-white dark:bg-gray-900 border-b shadow-sm z-50 relative">
            <div className="px-5 py-4 flex items-center justify-between">
                <div className="text-xl font-bold text-blue-700">
                    <NavLink to="/">QR Evento</NavLink>
                </div>

                {/* Botão Hamburguer */}
                <button
                    className="md:hidden z-50 focus:outline-none relative w-8 h-8"
                    onClick={toggleMenu}
                >
                    <div className="absolute inset-0 flex flex-col justify-center items-center gap-1.5">
                        <span className={`h-0.5 w-6 bg-gray-800 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                        <span className={`h-0.5 w-6 bg-gray-800 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <span className={`h-0.5 w-6 bg-gray-800 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </div>
                </button>

                {/* Menu Desktop */}
                <nav className="hidden md:flex gap-4">
                    {[
                        ['/', 'Início'],
                        ['/dashboard', 'Dashboard'],
                        ['/gerar', 'Gerar QR Code'],
                        ['/leitor', 'Leitor'],
                        ['/participantes', 'Participantes']
                    ].map(([path, label]) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded text-md font-medium transition-colors ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Dark Mode + Avatar */}
                <div className="hidden md:flex items-center gap-3 relative">
                    <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${enabled ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                    >
                        <span className="sr-only">Alternar modo escuro</span>
                        <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-900 shadow transition duration-200 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-0.5'
                                }`}
                        />
                    </Switch>

                    {/* Avatar */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(prev => !prev)}
                            className="flex items-center gap-1"
                        >
                            <img
                                src={avatarSrc}
                                alt="Avatar"
                                className="w-9 h-9 rounded-full border-2 border-blue-600 object-cover"
                            />
                            <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded shadow-lg overflow-hidden z-50"
                                >
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            navigate('/configuracoes');
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <Settings className="w-4 h-4" /> Configurações
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                    >
                                        <LogOut className="w-4 h-4" /> Sair
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Menu Mobile Fullscreen */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute top-4 left-4">
                            <Switch
                                checked={enabled}
                                onChange={setEnabled}
                                className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${enabled ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span className="sr-only">Alternar modo escuro</span>
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}
                                />
                            </Switch>
                        </div>

                        {[
                            ['/', 'Início'],
                            ['/dashboard', 'Dashboard'],
                            ['/gerar', 'Gerar QR Code'],
                            ['/leitor', 'Leitor'],
                            ['/participantes', 'Participantes'],
                            ['/configuracoes', 'Configuracoes']
                        ].map(([path, label]) => (
                            <NavLink
                                key={path}
                                to={path}
                                onClick={closeMenu}
                                className={baseStyle}
                            >
                                {label}
                            </NavLink>
                        ))}

                        <button
                            onClick={() => {
                                handleLogout();
                                closeMenu();
                            }}
                            className="text-white mt-4 bg-red-500 hover:bg-red-600 px-6 py-2 rounded text-lg font-semibold"
                        >
                            Sair
                        </button>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};
