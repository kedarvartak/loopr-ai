import { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/users/profile');
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
    }
    };

    checkUserStatus();
  }, []);

  const login = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/login', data);
      const userData = response.data;
      setUser(userData);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred during login');
    }
  };

  const signup = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/register', data);
      const userData = response.data;
      setUser(userData);
      toast.success('Signup successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3001/api/users/logout');
    setUser(null);
    toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred during logout');
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // console.log('AuthContext user object:', context.user); 
  return context;
}; 