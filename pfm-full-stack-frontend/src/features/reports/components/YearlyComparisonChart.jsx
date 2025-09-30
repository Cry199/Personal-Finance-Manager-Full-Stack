import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getYearlySummary } from '../../dashboard/api/dashboardApi';
import { Bar } from 'react-chartjs-2';
import Spinner from '../../../components/common/Spinner';

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 10; i--) {
    years.push(i);
  }
  return years;
};

const YearlyComparisonChart = () => {
  const yearOptions = useMemo(() => generateYearOptions(), []);
  const [year1, setYear1] = useState(yearOptions[0]); 
  const [year2, setYear2] = useState(yearOptions[1]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!year1 || !year2) return;

      setLoading(true);
      try {
        // Chamar a API para os dois anos em paralelo
        const [response1, response2] = await Promise.all([
          getYearlySummary(year1),
          getYearlySummary(year2),
        ]);

        // Função auxiliar para calcular os totais anuais
        const calculateTotals = (data) => {
          return data.reduce((acc, month) => {
            acc.income += month.totalIncome;
            acc.expense += month.totalExpense;
            return acc;
          }, { income: 0, expense: 0 });
        };

        const totals1 = calculateTotals(response1.data);
        const totals2 = calculateTotals(response2.data);
        const balance1 = totals1.income - totals1.expense;
        const balance2 = totals2.income - totals2.expense;

        setChartData({
          labels: ['Receitas', 'Despesas', 'Saldo'],
          datasets: [
            {
              label: `Total ${year1}`,
              data: [totals1.income, totals1.expense, balance1],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: `Total ${year2}`,
              data: [totals2.income, totals2.expense, balance2],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        });

      } catch (error) {
        toast.error("Não foi possível carregar a comparação anual.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year1, year2]);

  return (
    <div className="report-chart-container">
      <h3>Comparação Anual</h3>
      <div className="year-selectors">
        <div className="form-field">
          <label>Comparar</label>
          <select value={year1} onChange={(e) => setYear1(parseInt(e.target.value))} className="input-field">
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>com</label>
          <select value={year2} onChange={(e) => setYear2(parseInt(e.target.value))} className="input-field">
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="chart-wrapper">
          {chartData ? (
            <Bar 
              data={chartData} 
              options={{ maintainAspectRatio: false, responsive: true }} 
            />
          ) : <p>Não há dados para mostrar.</p>}
        </div>
      )}
    </div>
  );
};

export default YearlyComparisonChart;