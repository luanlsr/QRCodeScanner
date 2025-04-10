import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../superbase';

interface IdentityData {
    name?: string;
    email?: string;
    avatar_url?: string;
    [key: string]: any;
}

interface UserContextType {
    userData: IdentityData | null;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
    userData: null,
    isLoading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<IdentityData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            const identity = data.user?.identities?.[0]?.identity_data || null;
            setUserData(identity);
            setIsLoading(false);
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ userData, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};
