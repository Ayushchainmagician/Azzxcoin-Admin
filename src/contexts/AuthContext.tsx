import type React from 'react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // 👈 add this

  const verifyToken = async (token: string): Promise<User> => {
    console.log('this is verifyToken')
    const res = await axios.get('https://harvesthubai.com/api/admin/verify-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("this is the response from verify token", res);

    if (res.status!==200) {
      throw new Error('Invalid credentials');
    }

    const data = await res.data;
    return data as User;
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    verifyToken(token)
      .then((user) => setUser(user))
      .catch(() => {
        localStorage.removeItem('auth_token');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    console.log('heeeeeeeee')
    setIsLoading(true);
    try {
      const res = await axios.post('https://harvesthubai.com/api/admin/login', { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log("this is admin login res", res);

      if (res.status!==200) {
        throw new Error('Invalid credentials');
      }

      const data = await res.data;

      // Save token and user info
      localStorage.setItem('auth_token', data.token);
      setUser(res.data.user);

      // 👇 Redirect after successful login
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


// HOC for protected routes
export const withAuth = (Component: React.ComponentType) => {
  return () => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) return <div>Loading...</div>;

    return isAuthenticated ? <Component /> : null;
  };
};
