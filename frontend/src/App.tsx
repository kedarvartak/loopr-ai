import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import TransactionsPage from './pages/TransactionsPage';
import MainLayout from './pages/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import WalletPage from './pages/WalletPage';
import AnalyticsPage from './pages/AnalyticsPage';
import '@fontsource/outfit';
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#101118] text-white">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-right" 
            reverseOrder={false}
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-surface-variant)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--color-primary)',
                  secondary: 'var(--color-surface)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--color-accent-negative)',
                  secondary: 'var(--color-surface)',
                },
              },
            }}
          />
          <App />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default AppWrapper;
