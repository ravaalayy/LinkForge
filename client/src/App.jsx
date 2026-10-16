import React from 'react';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <Dashboard />
    </div>
  );
}