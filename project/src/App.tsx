import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import { AppProvider } from './context/AppContext';
import ToastContainer from './components/layout/ToastContainer';
import './index.css';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardLayout />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}

export default App;