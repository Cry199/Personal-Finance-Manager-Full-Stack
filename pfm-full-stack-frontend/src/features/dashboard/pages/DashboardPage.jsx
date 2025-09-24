import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../api/dashboardApi';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getDashboardSummary();
        setSummary(response.data);
      } catch (error) {
        console.error('Erro ao buscar o resumo do dashboard:', error);
      }
    };

    if (user) {
      fetchSummary();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!summary) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Receita Total: {summary.totalIncome}</p>
      <p>Despesa Total: {summary.totalExpense}</p>
      <p>Saldo: {summary.balance}</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default DashboardPage;