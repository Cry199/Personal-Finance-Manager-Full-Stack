import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getDashboardSummary, getExpensesByCategory, getMonthlySummary } from '../api/dashboardApi';
import { useAuth } from '../../../hooks/useAuth';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Spinner from '../../../components/common/Spinner';
import RecentTransactions from '../components/RecentTransactions';
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

      {/* CARD DE RESUMO OCUPA A LARGURA TODA */}
      <div className="summary-card-full-width">
        <div className="summary-card">
          <div className="summary-item income">
            <div className="summary-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
              </svg>
            </div>
            <div className="summary-text">
              <p>Receita do Mês</p>
              <span>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(summary?.totalIncome || 0)}</span>
            </div>
          </div>
          <div className="summary-item expense">
            <div className="summary-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
              </svg>
            </div>
            <div className="summary-text">
              <p>Despesa do Mês</p>
              <span>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(summary?.totalExpense || 0)}</span>
            </div>
          </div>
          <div className="summary-item balance">
            <div className="summary-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-6.814-1.202L12 17.25m-2.62-10.726C8.384 6.417 7.384 6.243 6.375 6.1m-3-.52c-2.31.328-4.22.846-5.625 1.542l2.62 10.726c.483.174.966-.023 1.088-.522L12 17.25m-2.62-10.726l-2.62 10.726" />
              </svg>
            </div>
            <div className="summary-text">
              <p>Saldo Atual</p>
              <span>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(summary?.balance || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
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

        <div className="chart-container">
          <RecentTransactions />
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