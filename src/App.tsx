import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Survey } from './pages/Survey';
import { Progress } from './pages/Progress';
import { AdminDashboard } from './pages/AdminDashboard';
import './App.css';
import { AdminLogin } from './pages/AdminLogin';
import { AdminRoute } from './components/AdminRoute';
import { AdminAuthProvider } from './context/AdminAuthContext';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* NUEVAS: Rutas de RRHH */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/encuesta/:id"
              element={
                <ProtectedRoute>
                  <Survey />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progreso"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
