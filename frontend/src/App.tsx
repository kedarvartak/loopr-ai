import './App.css'
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LoginPage from './pages/LoginPage';
import '@fontsource/outfit';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <Dashboard />
    </div>
  );
}

export default App
