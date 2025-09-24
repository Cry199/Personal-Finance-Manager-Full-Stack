import api from '../../../api/axiosConfig';

export const getDashboardSummary = () => {
  return api.get('/dashboard/summary');
};