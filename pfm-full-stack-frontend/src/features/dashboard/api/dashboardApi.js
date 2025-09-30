import api from '../../../api/axiosConfig';

export const getDashboardSummary = () => {
  return api.get('/dashboard/summary');
};

export const getExpensesByCategory = () => {
  return api.get('/dashboard/expenses-by-category');
};

export const getMonthlySummary = () => {
  return api.get('/dashboard/monthly-summary');
};

export const getIncomeVsExpenseSummary = () => {
  return api.get('/dashboard/income-vs-expense');
};
