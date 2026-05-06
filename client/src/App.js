import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import HealthWorkerDashboard from './pages/healthworker/HealthWorkerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-blue-600 text-xl">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/patient/dashboard" element={
          <PrivateRoute roles={['patient']}><PatientDashboard /></PrivateRoute>
        } />
        <Route path="/healthworker/dashboard" element={
          <PrivateRoute roles={['healthworker']}><HealthWorkerDashboard /></PrivateRoute>
        } />
        <Route path="/admin/dashboard" element={
          <PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;