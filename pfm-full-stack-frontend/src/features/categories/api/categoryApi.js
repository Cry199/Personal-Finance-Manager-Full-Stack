import api from '../../../api/axiosConfig';

// Função para buscar todas as categorias
export const getCategories = () => {
  return api.get('/categories');
};

// Função para criar uma nova categoria
export const createCategory = (categoryData) => {
  return api.post('/categories', categoryData);
};

// Função para atualizar uma categoria
export const updateCategory = (id, categoryData) => {
  return api.put(`/categories/${id}`, categoryData);
};

// Função para apagar uma categoria
export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};