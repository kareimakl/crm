import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pilgrims from './pages/Pilgrims';
import Supplies from './pages/Supplies';
import Tickets from './pages/Tickets';
import Invoices from './pages/Invoices';
import BusDrivers from './pages/BusDrivers';
import Hotels from './pages/Hotels';
import Products from './pages/Products';
import Loyalty from './pages/Loyalty';
import HR from './pages/HR';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Blocked from './pages/Blocked';

// New pages
import Warehouses from './pages/Warehouses';
import Trips from './pages/Trips';
import Employees from './pages/Employees';
import Users from './pages/Users';

// Import constants
import { SECTIONS } from './constants/permissions';

// Main App Component
const AppContent = () => {
  const { currentUser, loading, userData } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (userData && userData.isActive === false) {
    return <Blocked />;
  }

  return (
      <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      
      {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Warehouses Management */}
      <Route 
        path="/warehouses" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.WAREHOUSES} requiredPermission="view">
            <Warehouses />
          </ProtectedRoute>
        } 
      />

      {/* Trips Management */}
      <Route 
        path="/trips" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.TRIPS} requiredPermission="view">
            <Trips />
          </ProtectedRoute>
        } 
      />

      {/* Employees Management */}
      <Route 
        path="/employees" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.EMPLOYEES} requiredPermission="view">
            <Employees />
          </ProtectedRoute>
        } 
      />

      {/* Pilgrims Management */}
      <Route 
        path="/pilgrims" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.PILGRIMS} requiredPermission="view">
            <Layout>
              <Pilgrims />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Supplies Management */}
      <Route 
        path="/supplies" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.SUPPLIES} requiredPermission="view">
            <Layout>
              <Supplies />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Tickets Management */}
      <Route 
        path="/tickets" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.TICKETS} requiredPermission="view">
            <Layout>
              <Tickets />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Invoices Management */}
      <Route 
        path="/invoices" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.INVOICES} requiredPermission="view">
            <Layout>
              <Invoices />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Bus Drivers Management */}
      <Route 
        path="/bus-drivers" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.BUS_DRIVERS} requiredPermission="view">
            <Layout>
              <BusDrivers />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Hotels Management */}
      <Route 
        path="/hotels" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.HOTELS} requiredPermission="view">
            <Layout>
              <Hotels />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Products Management */}
      <Route 
        path="/products" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.PRODUCTS} requiredPermission="view">
            <Layout>
              <Products />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Loyalty Management */}
      <Route 
        path="/loyalty" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.LOYALTY} requiredPermission="view">
            <Layout>
              <Loyalty />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* HR Management */}
      <Route 
        path="/hr" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.HR} requiredPermission="view">
            <Layout>
              <HR />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Reports */}
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.REPORTS} requiredPermission="view">
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Settings */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute requiredSection={SECTIONS.SETTINGS} requiredPermission="view">
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* User Management */}
      <Route 
        path="/users" 
        element={
          <ProtectedRoute>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Blocked Page */}
      <Route path="/blocked" element={<Blocked />} />

      {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
  );
};

// App Component with Auth Provider
const App = () => {
  return <AppContent />;
};

export default App; 