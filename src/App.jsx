import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/ToastContainer';
import { useNotifications } from './hooks/useNotifications';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AttendancePage from './pages/AttendancePage';
import './index.css';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', end: true },
  { path: '/employees', label: 'Karyawan' },
  { path: '/attendance', label: 'Absensi' },
];

function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="empty-state" style={{ paddingTop: 80 }}>Memuat...</div>;
  return admin ? children : <Navigate to="/login" replace />;
}

function AppLayout({ children }) {
  const { admin, logout } = useAuth();
  const { toasts, dismiss } = useNotifications();

  return (
    <div className="app-layout">
      <Sidebar
        user={admin}
        navItems={NAV_ITEMS}
        onLogout={logout}
        brandName="WFH Admin"
        brandSub="HR Management"
      />
      <main className="main-content">{children}</main>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><AppLayout><Employees /></AppLayout></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><AppLayout><AttendancePage /></AppLayout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
