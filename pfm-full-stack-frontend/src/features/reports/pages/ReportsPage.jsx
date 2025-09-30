import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import IncomeVsExpenseChart from '../components/IncomeVsExpenseChart';
import TopExpensesChart from '../components/TopExpensesChart';
import TopIncomeChart from '../components/TopIncomeChart';
import WeekdaySpendingChart from '../components/WeekdaySpendingChart';
import YearlyComparisonChart from '../components/YearlyComparisonChart';
import './ReportsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ReportsPage = () => {
  return (
    <div className="content-card">
      <div className="page-header">
        <h2>Relatórios Detalhados</h2>
      </div>

      <div className="reports-grid">
        <div className="report-item full-width">
          <YearlyComparisonChart />
        </div>

        <div className="report-item full-width">
          <IncomeVsExpenseChart />
        </div>

        <div className="report-item">
          <TopExpensesChart />
        </div>

        <div className="report-item">
          <TopIncomeChart />
        </div>

        <div className="report-item full-width">
          <WeekdaySpendingChart />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;