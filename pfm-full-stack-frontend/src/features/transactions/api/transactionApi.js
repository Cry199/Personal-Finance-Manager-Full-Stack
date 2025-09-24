import api from '../../../api/axiosConfig';

// Buscar transações com paginação e filtros
export const getTransactions = (page = 0, size = 10, filters = {}) => {
  const params = {
    page,
    size,
    ...filters, // ex: month, year, type, categoryId
  };
  return api.get('/transactions', { params });
};

// Criar uma nova transação
export const createTransaction = (transactionData) => {
  return api.post('/transactions', transactionData);
};

// Apagar uma transação
export const deleteTransaction = (id) => {
  return api.delete(`/transactions/${id}`);
};

// Atualizar uma transação
export const updateTransaction = (id, transactionData) => {
    return api.put(`/transactions/${id}`, transactionData);
}