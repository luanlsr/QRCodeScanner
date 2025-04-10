import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../superbase';

export const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            setAuthenticated(!!data.session);
            setLoading(false);
        };

        checkAuth();

        // Listener para mudanças de autenticação (login/logout)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthenticated(!!session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <div className="text-center mt-10 text-gray-700 dark:text-white">Carregando...</div>;
    }

    return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
