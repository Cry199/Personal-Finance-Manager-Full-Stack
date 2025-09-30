import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getTopIncomeSources } from '../../dashboard/api/dashboardApi';
import { Bar } from 'react-chartjs-2';
import Spinner from '../../../components/common/Spinner';

const TopIncomeChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTopIncomeSources(5);
        const data = response.data;

        setChartData({
          labels: data.map(d => d.categoryName),
          datasets: [{
            label: 'Total Recebido',
            data: data.map(d => d.totalAmount), 
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        });
      } catch (error) {
        toast.error("Não foi possível carregar o relatório de top receitas.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (loading) return <Spinner />;

  return (
    <div className="report-chart-container">
      <h3>Top 5 Fontes de Rendimento (Ano Corrente)</h3>
      {chartData && chartData.labels.length > 0 ? (
        <div className="chart-wrapper">
          <Bar 
            data={chartData} 
            options={{ 
              indexAxis: 'y', // <-- Isto torna o gráfico de barras horizontal
              maintainAspectRatio: false, 
              responsive: true 
            }} 
          />
        </div>
      ) : (
        <p>Não há dados suficientes para mostrar.</p>
      )}
    </div>
  );
};

export default TopIncomeChart;