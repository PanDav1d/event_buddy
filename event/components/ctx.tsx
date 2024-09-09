import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '@/components/useStorageState';

const AuthContext = createContext<{
    signIn: (email: string, password: string) => void;
    signUp: (email: string, password: string) => void;
    signOut: () => void;
    session?: UserSession | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signUp: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

interface UserSession
{
    username: string;
    token: string;
}

// This hook can be used to access the user info.
export function useSession()
{
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production')
    {
        if (!value)
        {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider({ children }: PropsWithChildren)
{
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <AuthContext.Provider
            value={{
                signIn: (email: string, password: string) =>
                {
                    // Perform sign-in logic here
                    // Evaluate email and password
                    if (email && password)
                    {
                        // Here you would typically make an API call to validate credentials
                        // For demonstration, we're just checking if both fields are non-empty
                        setSession(JSON.stringify({ username: email, token: 'xxx' }));
                    } else
                    {
                        console.error('Invalid email or password');
                    }
                },
                signUp: (email: string, password: string) =>
                {
                    // Perform sign-up logic here
                    // Evaluate email and password
                    if (email && password)
                    {
                        // Here you would typically make an API call to create a new user
                        // For demonstration, we're just checking if both fields are non-empty
                        setSession(JSON.stringify({ username: email, token: 'new-user-token' }));
                    } else
                    {
                        console.error('Invalid email or password for sign-up');
                    }
                },
                signOut: () =>
                {
                    setSession(null);
                },
                session: session ? JSON.parse(session) as UserSession : null,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
