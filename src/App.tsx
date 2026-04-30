import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Shift from './pages/Shift';
import AIAssistant from './pages/AI';
import Calculator from './pages/Calculator';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Messages from './pages/Messages';

function AppRoutes() {
  const { usuario } = useApp();

  return (
    <Routes>
      <Route path="/" element={!usuario ? <Login /> : <Navigate to="/inicio" />} />
      
      <Route 
        path="/inicio" 
        element={
          usuario ? (
            <AppLayout>
              <Dashboard />
            </AppLayout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      
      <Route 
        path="/inventario" 
        element={
          usuario ? (
            <AppLayout>
              <Inventory />
            </AppLayout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />

      <Route 
        path="/turno" 
        element={
          usuario ? (
            <AppLayout>
              <Shift />
            </AppLayout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />

      <Route 
        path="/ventas" 
        element={
          usuario ? (
            <AppLayout>
              <Sales />
            </AppLayout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />

      <Route 
        path="/mensajes" 
        element={
          usuario ? (
            <AppLayout>
              <Messages />
            </AppLayout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />

      <Route 
        path="/ia" 
        element={
          usuario ? (
            <AppLayout>
              <AIAssistant />
            </AppLayout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />

      <Route 
        path="/calculadora" 
        element={
          usuario ? (
            <AppLayout>
              <Calculator />
            </AppLayout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />

      <Route 
        path="/reportes" 
        element={
          usuario ? (
            <AppLayout>
              <Reports />
            </AppLayout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />

      <Route 
        path="/ajustes" 
        element={
          usuario ? (
            <AppLayout>
              <Settings />
            </AppLayout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
