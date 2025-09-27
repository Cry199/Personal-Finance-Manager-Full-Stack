import { useEffect, useState } from 'react';
import { getDashboardSummary, getExpensesByCategory } from '../api/dashboardApi';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './DashboardPage.css';

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
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="summary-card">
          <h3>Resumo do Mês</h3>
          <p>
            Receita Total:{' '}
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(summary.totalIncome)}
          </p>
          <p>
            Despesa Total:{' '}
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(summary.totalExpense)}
          </p>
          <p>
            Saldo:{' '}
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(summary.balance)}
          </p>
        </div>

        <div className="md:col-span-2 chart-container">
          <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
          <div className="max-w-md mx-auto">
            {expenseData.labels.length > 0 ? (
              <Pie data={expenseData} />
            ) : (
              <p>Não há despesas com categoria para mostrar.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;