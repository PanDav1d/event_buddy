import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '@/components/useStorageState';
import NetworkClient from '@/api/NetworkClient';

const AuthContext = createContext<{
    signIn: (username: string, password: string) => void;
    signUp: (username: string, email: string, password: string) => void;
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
    userID: number;
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
                signIn: async (username: string, password: string): Promise<boolean> =>
                {
                    if (username && password)
                    {
                        try
                        {
                            // Here you would typically make an API call to validate credentials
                            const response = await NetworkClient.login(username, password);
                            setSession(JSON.stringify({ username: username, userID: response?.user_id, token: 'xxx' }));
                            return true;
                        } catch (error)
                        {
                            console.error('Login failed:', error);
                            return false;
                        }
                    } else
                    {
                        console.error('Invalid username or password');
                        return false;
                    }
                }, signUp: (username: string, email: string, password: string) =>
                {
                    // Perform sign-up logic here
                    // Evaluate email and password
                    if (username && email && password)
                    {
                        // Here you would typically make an API call to create a new user
                        NetworkClient.register(username, email, password).then(response =>
                            setSession(JSON.stringify({ username: username, userID: response?.user_id, token: 'new-user-token' })));
                    } else
                    {
                        console.error('Invalid username, email or password for sign-up');
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
