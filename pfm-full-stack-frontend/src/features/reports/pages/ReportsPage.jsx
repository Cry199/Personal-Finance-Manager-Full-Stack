import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getIncomeVsExpenseSummary } from '../../dashboard/api/dashboardApi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Spinner from '../../../components/common/Spinner';
import './ReportsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsPage = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getIncomeVsExpenseSummary();
        const data = response.data;

        setChartData({
          labels: data.map(d => d.monthName),
          datasets: [
            {
              label: 'Receitas',
              data: data.map(d => d.totalIncome),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: 'Despesas',
              data: data.map(d => d.totalExpense),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }
          ]
        });
      } catch (error) {
        console.error('Erro ao buscar dados do relatório:', error);
        toast.error("Não foi possível carregar os dados do relatório.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comparação de Receitas vs. Despesas (Últimos 12 Meses)',
        font: {
          size: 16
        }
      },
    },
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="content-card">
      <div className="page-header">
        <h2>Relatórios Detalhados</h2>
      </div>

      <div className="report-container">
        {chartData ? (
          <div className="chart-wrapper">
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="no-data-message">Não há dados para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;