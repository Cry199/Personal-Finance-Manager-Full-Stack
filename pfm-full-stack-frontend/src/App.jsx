import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import TransactionsPage from './features/transactions/pages/TransactionsPage';
import CategoriesPage from './features/categories/pages/CategoriesPage';
import RecurringTransactionsPage from './features/recurring/pages/RecurringTransactionsPage';

// Componentes
import MainLayout from './components/layout/MainLayout';
import Spinner from './components/common/Spinner'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <Spinner />;
  }
  return user ? <Navigate to="/dashboard" /> : children;
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
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

        {/* Rotas Protegidas - Todas dentro do MainLayout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* A página inicial da secção privada é o dashboard */}
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="recurring-transactions" element={<RecurringTransactionsPage />} />
        </Route>

        {/* Redirecionamento para utilizadores já logados que tentam aceder a uma rota inexistente */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

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