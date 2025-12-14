import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ReactQueryProvider } from './lib/react-query';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import InvoiceDetails from './pages/InvoiceDetails';
import PublicInvoicePayment from './pages/PublicInvoicePayment';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Layout from './components/Layout';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pay/invoice/:invoiceId" element={<PublicInvoicePayment />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="clients" element={<Clients />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/:id" element={<InvoiceDetails />} />
              <Route path="users" element={<Users />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;

