import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/auth/Login';
import Register from './components/auth/RegisterNew';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Workouts from './pages/Workouts';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import GoalsPage from './pages/GoalsPage';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
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

            {/* Placeholder routes for navigation items */}
            <Route
              path="/exercises"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ExerciseLibrary />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Workouts />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProgressPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GoalsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Trainer Routes */}
            <Route
              path="/trainer/clients"
              element={
                <ProtectedRoute requireRole="TRAINER">
                  <Layout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900">My Clients</h2>
                      <p className="mt-4 text-gray-600">Coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireRole="ADMIN">
                  <Layout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                      <p className="mt-4 text-gray-600">Coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/system"
              element={
                <ProtectedRoute requireRole="ADMIN">
                  <Layout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                      <p className="mt-4 text-gray-600">Coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
  );
}

export default App;
