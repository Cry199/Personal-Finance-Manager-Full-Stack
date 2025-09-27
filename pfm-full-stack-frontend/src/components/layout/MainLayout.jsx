import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggleButton from '../common/ThemeToggleButton';

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/dashboard" className="nav-brand">PFM</Link>
          
          <div className="nav-links">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Transações
            </NavLink>
            <NavLink to="/categories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Categorias
            </NavLink>
            <NavLink to="/recurring-transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Recorrentes
            </NavLink>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ThemeToggleButton />
            <button onClick={handleLogout} className="primary-button" style={{width: 'auto', padding: '8px 16px'}}>
              Sair
            </button>
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        <Outlet /> {/* As suas páginas serão renderizadas aqui */}
      </main>
    </div>
  );
};

export default MainLayout;