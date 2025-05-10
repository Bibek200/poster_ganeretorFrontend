import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customer from './pages/Customer';
import Upload from './pages/Upload';
import Schedule from './pages/Schedule';
import PosterList from './pages/PosterList';
import CustomerList from './components/CustomerList';
import ScheduleList from './pages/ScheduleList';

// For protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-vh-100 d-flex flex-column">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
               <Route path="/posterList" element={
                <ProtectedRoute>
                  <PosterList/>
                </ProtectedRoute>
              } />
               
              <Route path="/customers" element={
                <ProtectedRoute>
                  <Customer />
                </ProtectedRoute>
              } />
              <Route path="/CustomersList" element={
                <ProtectedRoute>
                  <CustomerList/>
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute >
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path="/scheduleList" element={
                <ProtectedRoute >
                  <ScheduleList/>
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;