import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    const baseStyle = 'text-xl font-semibold text-white';

    return (
        <header className="w-full bg-white border-b shadow-sm z-50 relative">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="text-xl font-bold text-blue-700">
                    <NavLink to="/">
                        QR System
                    </NavLink>
                </div>

                {/* Botão Hamburguer */}
                <button
                    className="md:hidden z-50 focus:outline-none relative w-8 h-8"
                    onClick={toggleMenu}
                >
                    <div className="absolute inset-0 flex flex-col justify-center items-center gap-1.5">
                        <span
                            className={`h-0.5 w-6 bg-gray-800 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''
                                }`}
                        />
                        <span
                            className={`h-0.5 w-6 bg-gray-800 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'
                                }`}
                        />
                        <span
                            className={`h-0.5 w-6 bg-gray-800 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''
                                }`}
                        />
                    </div>
                </button>

                {/* Menu Desktop */}
                <nav className="hidden md:flex gap-4">
                    <NavLink to="/" className={({ isActive }) =>
                        `px-4 py-2 rounded text-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`
                    }>
                        Início
                    </NavLink>
                    <NavLink to="/dashboard" className={({ isActive }) =>
                        `px-4 py-2 rounded text-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`
                    }>
                        Dashboard
                    </NavLink>
                    <NavLink to="/gerar" className={({ isActive }) =>
                        `px-4 py-2 rounded text-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`
                    }>
                        Gerar QR Code
                    </NavLink>
                    <NavLink to="/leitor" className={({ isActive }) =>
                        `px-4 py-2 rounded text-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`
                    }>
                        Leitor
                    </NavLink>
                    <NavLink to="/participantes" className={({ isActive }) =>
                        `px-4 py-2 rounded text-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`
                    }>
                        Participantes
                    </NavLink>
                    <NavLink to="/configuracoes" className={({ isActive }) =>
                        `px-4 py-2 rounded text-md font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`
                    }>
                        Configurações
                    </NavLink>
                </nav>
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
                        <NavLink to="/" onClick={closeMenu} className={baseStyle}>Início</NavLink>
                        <NavLink to="/dashboard" onClick={closeMenu} className={baseStyle}>Dashboard</NavLink>
                        <NavLink to="/gerar" onClick={closeMenu} className={baseStyle}>Gerar QR Code</NavLink>
                        <NavLink to="/leitor" onClick={closeMenu} className={baseStyle}>Leitor</NavLink>
                        <NavLink to="/participantes" onClick={closeMenu} className={baseStyle}>Participantes</NavLink>
                        <NavLink to="/configuracoes" onClick={closeMenu} className={baseStyle}>Configurações</NavLink>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};
