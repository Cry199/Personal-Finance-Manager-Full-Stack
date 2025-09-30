import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getIncomeVsExpenseSummary } from '../../dashboard/api/dashboardApi';
import { Bar } from 'react-chartjs-2';
import Spinner from '../../../components/common/Spinner';

const IncomeVsExpenseChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getIncomeVsExpenseSummary();
        const data = response.data;
        setChartData({
          labels: data.map(d => d.monthName),
          datasets: [
            { label: 'Receitas', data: data.map(d => d.totalIncome), backgroundColor: 'rgba(75, 192, 192, 0.6)' },
            { label: 'Despesas', data: data.map(d => d.totalExpense), backgroundColor: 'rgba(255, 99, 132, 0.6)' }
          ]
        });
      } catch (error) {
        toast.error("Não foi possível carregar o resumo mensal.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="report-chart-container">
      <h3>Receitas vs. Despesas (Últimos 12 Meses)</h3>
      {chartData ? (
        <div className="chart-wrapper">
          <Bar data={chartData} options={{ maintainAspectRatio: false, responsive: true }} />
        </div>
      ) : <p>Sem dados.</p>}
    </div>
  );
};

export default IncomeVsExpenseChart;