/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
    email: string;
    name: string;
    isVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (email: string, password: string): Promise<boolean> => {
        // Mock authentication logic
        if (password === 'say my name') {
            if (email === 'verified@test.com') {
                const newUser = {
                    email,
                    name: 'Juan Dela Cruz',
                    isVerified: true
                };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                return true;
            } else if (email === 'unverified@test.com') {
                const newUser = {
                    email,
                    name: 'John Doe',
                    isVerified: false
                };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                return true;
            }
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
