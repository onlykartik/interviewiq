import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Interviews from './pages/Interviews';
import Prepare from './pages/Prepare';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import InterviewDetail from './pages/InterviewDetail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddInterview from './pages/AddInterview';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function Layout({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <div style={{ padding: '16px' }}>
        {children}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>

            {/* Public route */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/interviews"
              element={
                <ProtectedRoute>
                  <Interviews />
                </ProtectedRoute>
              }
            />

            <Route
              path="/interviews/new"
              element={
                <ProtectedRoute>
                  <AddInterview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/interviews/:id"
              element={
                <ProtectedRoute>
                  <InterviewDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/prepare"
              element={
                <ProtectedRoute>
                  <Prepare />
                </ProtectedRoute>
              }
            />

            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);