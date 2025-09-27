import api from '../../../api/axiosConfig';

export const getDashboardSummary = () => {
  return api.get('/dashboard/summary');
};

export const getExpensesByCategory = () => {
  return api.get('/dashboard/expenses-by-category');
};