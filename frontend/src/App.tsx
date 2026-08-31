import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Cases } from './pages/Cases';
import { CaseInvestigation } from './pages/CaseInvestigation';
import { Accounts } from './pages/Accounts';
import { NetworkExplorer } from './pages/NetworkExplorer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cases" element={<Cases />} />
          <Route path="cases/:id" element={<CaseInvestigation />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="network" element={<NetworkExplorer />} />
          
          {/* Fallback routes for uncompleted sections */}
          <Route path="transactions" element={<Navigate to="/" replace />} />
          <Route path="reports" element={<Navigate to="/" replace />} />
          <Route path="settings" element={<Navigate to="/" replace />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
