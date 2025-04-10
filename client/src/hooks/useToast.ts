// hooks/useToast.ts
import { toast } from 'react-hot-toast';

export const useToast = () => {
    const success = (message: string) => toast.success(message, { duration: 3000 });
    const error = (message: string) => toast.error(message, { duration: 4000 });

    return { success, error };
};
