import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ display: 'flex', gap: '20px', padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transações</Link>
        <Link to="/categories">Categorias</Link>
        <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Sair</button>
      </nav>
      <main style={{ padding: '20px' }}>
        <Outlet /> {/* páginas da rota */}
      </main>
    </div>
  );
};

export default MainLayout;