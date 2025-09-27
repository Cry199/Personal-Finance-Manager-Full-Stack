import api from '../../../api/axiosConfig';

// Buscar todas as transações recorrentes do user
export const getRecurringTransactions = () => {
  return api.get('/recurring-transactions');
};

// Apagar uma transação recorrente
export const deleteRecurringTransaction = (id) => {
  return api.delete(`/recurring-transactions/${id}`);
};

// Criar uma transação recorrente
export const createRecurringTransaction = (data) => {
  return api.post('/recurring-transactions', data);
};

// Editar uma transação recorrente
export const updateRecurringTransaction = (id, data) => {
  return api.put(`/recurring-transactions/${id}`, data);
};