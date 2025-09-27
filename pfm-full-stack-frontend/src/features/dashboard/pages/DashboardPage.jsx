import { useEffect, useState } from 'react';
import { getDashboardSummary, getExpensesByCategory }  from '../api/dashboardApi';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await getDashboardSummary();
        setSummary(summaryRes.data);

        const expenseRes = await getExpensesByCategory();
        // Chart.js
        const chartData = {
          labels: expenseRes.data.map(d => d.categoryName),
          datasets: [{
            label: 'Despesas por Categoria',
            data: expenseRes.data.map(d => d.totalAmount),
            backgroundColor: [ // Cores aleatórias para o gráfico
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ],
            hoverBackgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ]
          }]
        };
        setExpenseData(chartData);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!summary || !expenseData) {
    return <div>A carregar...</div>;
  }

  if (!summary) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <h3>Resumo do Mês</h3>
          <p>Receita Total: {summary.totalIncome}</p>
          <p>Despesa Total: {summary.totalExpense}</p>
          <p>Saldo: {summary.balance}</p>
        </div>
        <div style={{ width: '400px', height: '400px' }}>
          <h3>Despesas por Categoria</h3>
          <Pie data={expenseData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;