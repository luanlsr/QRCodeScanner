import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../superbase';

export function useProtectRoute() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
                return;
            }

            console.log('user', user);
            if (!user) {
                await supabase.auth.signOut();
                navigate('/login');
                return;
            }

            setIsLoading(false);
        };

        verifyUser();
    }, [navigate]);

    return isLoading;
}
