import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggleButton from '../common/ThemeToggleButton';
import logo from '../../assets/logo.jpg';

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/dashboard" className="nav-brand">
            <img src={logo} alt="PFM Logo" className="navbar-logo" />
            <span>PFM</span>
          </Link>

          <div className="nav-links">
            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </NavLink>
            <NavLink to="/dashboard/transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Transações
            </NavLink>
            <NavLink to="/dashboard/categories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Categorias
            </NavLink>
            <NavLink to="/dashboard/recurring-transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Recorrentes
            </NavLink>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ThemeToggleButton />
            <button onClick={handleLogout} className="primary-button" style={{ width: 'auto', padding: '8px 16px' }}>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;