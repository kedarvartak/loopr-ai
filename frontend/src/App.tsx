import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import '@fontsource/outfit';

function App() {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  return (
      <>
        {user ? (
          <div className="flex">
            <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
            <Dashboard />
          </div>
        ) : <LoginPage />}
      </>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#FFFFFF',
            padding: '16px',
            color: '#1a1c2c',
          },
          success: {
            style: {
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
            },
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: '#FFFFFF',
            },
          },
          error: {
            style: {
              border: '1px solid #e5484d',
              color: '#e5484d',
            },
            iconTheme: {
              primary: '#e5484d',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <App />
    </AuthProvider>
  )
}

export default AppWrapper;
