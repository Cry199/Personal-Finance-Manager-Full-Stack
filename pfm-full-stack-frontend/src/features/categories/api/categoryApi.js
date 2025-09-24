import api from '../../../api/axiosConfig';

export const getCategories = () => {
  return api.get('/categories');
};