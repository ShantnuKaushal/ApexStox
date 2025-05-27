import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login       from './pages/Login';
import Signup      from './pages/Signup';
import Dashboard   from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<LandingPage />} />
      <Route path="/login"   element={<Login />} />
      <Route path="/signup"  element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*"        element={<Navigate to="/" replace />} />
    </Routes>
  );
}
