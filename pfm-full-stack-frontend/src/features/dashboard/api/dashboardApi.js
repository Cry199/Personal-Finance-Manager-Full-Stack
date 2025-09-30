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

export const getTopExpenses = (limit = 5) => {
  return api.get('/dashboard/top-expenses', { params: { limit } });
};

export const getTopIncomeSources = (limit = 5) => {
  return api.get('/dashboard/top-income', { params: { limit } });
};

export const getExpenseByWeekday = () => {
  return api.get('/dashboard/expense-by-weekday');
};
