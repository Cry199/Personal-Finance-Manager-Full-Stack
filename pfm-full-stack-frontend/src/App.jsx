import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import TransactionsPage from './features/transactions/pages/TransactionsPage';
import MainLayout from './components/layout/MainLayout';
import CategoriesPage from './features/categories/pages/CategoriesPage';
import RecurringTransactionsPage from './features/recurring/pages/RecurringTransactionsPage';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  return (
    <Router>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface-color)',
            color: 'var(--primary-text-color)',
            border: '1px solid var(--border-color)',
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        {/* Rotas Protegidas com Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="recurring-transactions" element={<RecurringTransactionsPage />} />
          {/* Redirecionar a rota raiz para o dashboard */}
          <Route index element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;