import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
    name: string;
    email: string;
    avatarId: string | null;
    roles: string;
    gender: string;
    isVerified: boolean;
    isActive: boolean;
    imgs: string | null;
}

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

interface TokenResponse {
    accessToken: string,
    refreshToken: string
}

interface AuthContextType {
    user: User | null;
    tokens: Tokens | null;
    login: (tokens: TokenResponse) => void;
    logout: () => void;
    info: (user: User) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<Tokens | null>(null);
    

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        const storedToken = localStorage.getItem('tokens');
        if (storedToken) {
            setTokens(JSON.parse(storedToken))
        }
    }, []);

    const login = (tokens: TokenResponse) => {
        setTokens(tokens);
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
    };

    const info = (user: User) => {
        const userData = {
            name: user.name,
            email: user.email,
            avatarId: user.avatarId,
            roles: user.roles,
            gender: user.gender,
            isVerified: user.isVerified,
            isActive: user.isActive,
            imgs: user.imgs
        }
        console.log('helo')
        setUser(user)
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{ tokens, user, info, login, logout, isAuthenticated: !!user && !!tokens }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};