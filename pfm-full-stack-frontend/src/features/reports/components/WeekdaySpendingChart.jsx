import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getExpenseByWeekday } from '../../dashboard/api/dashboardApi';
import { Bar } from 'react-chartjs-2';
import Spinner from '../../../components/common/Spinner';

const WeekdaySpendingChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getExpenseByWeekday();
        const data = response.data;

        const dayOrder = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        data.sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek));
        
        setChartData({
          labels: data.map(d => d.dayOfWeek), 
          datasets: [{
            label: 'Total Gasto',
            data: data.map(d => d.totalAmount),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          }]
        });
      } catch (error) {
        toast.error("Não foi possível carregar os gastos por dia da semana.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (loading) return <Spinner />;

  return (
    <div className="report-chart-container">
      <h3>Gastos por Dia da Semana (Ano Corrente)</h3>
      {chartData && chartData.labels.length > 0 ? (
        <div className="chart-wrapper">
          <Bar 
            data={chartData} 
            options={{ 
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

export default WeekdaySpendingChart;