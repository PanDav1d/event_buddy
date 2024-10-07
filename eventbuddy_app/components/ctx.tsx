import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '@/components/useStorageState';
import NetworkClient from '@/api/NetworkClient';

interface UserSession
{
    username: string;
    userID: number;
    token: string;
}

const AuthContext = createContext<{
    signIn: (username: string, password: string) => Promise<boolean>;
    signUp: (username: string, email: string, password: string) => void;
    signOut: () => void;
    session?: UserSession | null;
    isLoading: boolean;
}>({
    signIn: async () => false,
    signUp: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

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
                            const response = await NetworkClient.login(username, password);
                            if (response?.user_id && response?.token)
                            {
                                setSession(JSON.stringify({
                                    username: username,
                                    userID: response.user_id,
                                    token: response.token
                                }));
                                return true;
                            }
                        } catch (error)
                        {
                            console.error('Login failed:', error);
                        }
                    }
                    return false;
                },
                signUp: (username: string, email: string, password: string) =>
                {
                    if (username && email && password)
                    {
                        NetworkClient.register(username, email, password).then(response =>
                        {
                            if (response?.user_id && response?.token)
                            {
                                setSession(JSON.stringify({
                                    username: username,
                                    userID: response.user_id,
                                    token: response.token
                                }));
                            }
                        });
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