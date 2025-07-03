import { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const login = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/login', data);
      const userData = response.data;
      console.log('Raw server response:', userData); // Final debug log
      localStorage.setItem('userInfo', JSON.stringify(userData));
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
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      toast.success('Signup successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out successfully');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('AuthContext user object:', context.user); // Debug log
  return context;
}; 