import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getTopExpenses } from '../../dashboard/api/dashboardApi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Spinner from '../../../components/common/Spinner';

ChartJS.register(ArcElement, Tooltip, Legend);

const TopExpensesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getTopExpenses(5); // Pede o Top 5
        const data = response.data;

        setChartData({
          labels: data.map(d => d.categoryName),
          datasets: [{
            label: 'Total Gasto',
            data: data.map(d => d.totalAmount),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
            ],
            borderColor: 'var(--surface-color)',
            borderWidth: 2,
          }]
        });
      } catch (error) {
        toast.error("Não foi possível carregar o relatório de top despesas.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="report-chart-container">
      <h3>Top 5 Categorias de Despesa (Ano Corrente)</h3>
      {chartData && chartData.labels.length > 0 ? (
        <div className="chart-wrapper">
          <Pie data={chartData} options={{ maintainAspectRatio: false, responsive: true }} />
        </div>
      ) : (
        <p>Não há dados suficientes para mostrar.</p>
      )}
    </div>
  );
};

export default TopExpensesChart;