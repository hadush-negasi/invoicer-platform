import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  email: string;
  name?: string;
  role: 'admin' | 'staff';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    authService.setToken(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      try {
        const decoded = jwtDecode<any>(storedToken);

        // Optional: check expiration
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setToken(storedToken);
          setUser({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
          });
          authService.setToken(storedToken);
        }
      } catch (error) {
        logout();
      }
    }

    setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    authService.setToken(response.token);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

