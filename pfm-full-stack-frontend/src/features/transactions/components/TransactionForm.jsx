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
    <form onSubmit={handleSubmit}>
      <h3>{transactionToEdit ? 'Editar Transação' : 'Nova Transação'}</h3>
      <div>
        <label>Descrição</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Valor</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div>
        <label>Data</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label>Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="EXPENSE">Despesa</option>
          <option value="INCOME">Receita</option>
        </select>
      </div>
      <div>
        <label>Categoria</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Nenhuma</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Salvar</button>
      <button type="button" onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default TransactionForm;