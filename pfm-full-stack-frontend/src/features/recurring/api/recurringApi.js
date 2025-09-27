import api from '../../../api/axiosConfig';

// Buscar todas as transações recorrentes do user
export const getRecurringTransactions = () => {
  return api.get('/recurring-transactions');
};

// Apagar uma transação recorrente
export const deleteRecurringTransaction = (id) => {
  return api.delete(`/recurring-transactions/${id}`);
};