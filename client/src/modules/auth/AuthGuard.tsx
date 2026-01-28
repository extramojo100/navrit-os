import type { ReactNode } from 'react';

// MOCK AUTHENTICATION GUARD
// In Production: Connect to Auth0 / Firebase / Supabase

interface AuthGuardProps {
    children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const isAuthenticated = true; // Hardcoded for Demo
    // const { user } = useAuth0();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">Navrit</div>
                    <div className="text-zinc-500">Please authenticate via Biometrics...</div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

// Hook for authentication status
export const useAuth = () => {
    return {
        isAuthenticated: true,
        user: {
            id: 'demo-user',
            name: 'Sales Executive',
            role: 'sales' as const,
        },
        login: () => console.log('Login triggered'),
        logout: () => console.log('Logout triggered'),
    };
};
