import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getDashboardSummary, getExpensesByCategory, getMonthlySummary } from '../api/dashboardApi';
import { useAuth } from '../../../hooks/useAuth';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Spinner from '../../../components/common/Spinner';
import './DashboardPage.css';
import { getErrorMessage } from '../../../utils/errorHandler'; 

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [summaryRes, expenseRes, monthlyRes] = await Promise.all([
          getDashboardSummary(),
          getExpensesByCategory(),
          getMonthlySummary()
        ]);

        setSummary(summaryRes.data);

        setPieData({
          labels: expenseRes.data.map(d => d.categoryName),
          datasets: [{
            data: expenseRes.data.map(d => d.totalAmount),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
          }]
        });

        setBarData({
          labels: monthlyRes.data.map(d => d.month),
          datasets: [
            {
              label: 'Receitas',
              data: monthlyRes.data.map(d => d.totalIncome),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: 'Despesas',
              data: monthlyRes.data.map(d => d.totalExpense),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }
          ]
        });

      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="dashboard-grid">
        <div className="summary-card">
          <h3>Resumo do Mês Atual</h3>
          <p>
            Receita Total:{' '}
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(summary?.totalIncome || 0)}
          </p>
          <p>
            Despesa Total:{' '}
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(summary?.totalExpense || 0)}
          </p>
          <p>
            Saldo:{' '}
            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(summary?.balance || 0)}
          </p>
        </div>

        <div className="chart-container">
          <h3>Despesas por Categoria</h3>
          {pieData && pieData.labels.length > 0 ? (
            <div className="chart-wrapper">
              <Pie data={pieData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          ) : (
            <p className="no-data-message">Não há despesas com categoria para mostrar.</p>
          )}
        </div>

        <div className="chart-container bar-chart-container">
          <h3>Receitas vs. Despesas (Últimos 6 Meses)</h3>
          {barData ? (
            <div className="chart-wrapper">
              <Bar data={barData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          ) : (
            <p className="no-data-message">Não há dados para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;