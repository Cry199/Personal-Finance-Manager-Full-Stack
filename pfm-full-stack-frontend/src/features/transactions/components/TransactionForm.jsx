import { useState, useEffect } from 'react';
import { getCategories } from '../../categories/api/categoryApi';
import { createTransaction, updateTransaction } from '../api/transactionApi';

const TransactionForm = ({ onSave, onClose, transactionToEdit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Data de hoje
  const [type, setType] = useState('EXPENSE'); // 'EXPENSE' ou 'INCOME'
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  // Efeito para preencher o formulário se estivermos editando uma transação existente
  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      setAmount(transactionToEdit.amount);
      setDate(new Date(transactionToEdit.date).toISOString().slice(0, 10));
      setType(transactionToEdit.type);
      setCategoryId(transactionToEdit.category?.id || '');
    }
  }, [transactionToEdit]);

  // Buscar categorias quando o formulário é montado
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionData = {
      description,
      amount: parseFloat(amount),
      date,
      type,
      categoryId: categoryId || null,
    };

    try {
      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {transactionToEdit ? 'Editar Transação' : 'Nova Transação'}
      </h3>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
          <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Nenhuma</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;