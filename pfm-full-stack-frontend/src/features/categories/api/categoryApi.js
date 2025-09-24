import api from '../../../api/axiosConfig';

// Função para buscar todas as categorias
export const getCategories = () => {
  return api.get('/categories');
};

// Função para criar uma nova categoria
export const createCategory = (categoryData) => {
  return api.post('/categories', categoryData);
};