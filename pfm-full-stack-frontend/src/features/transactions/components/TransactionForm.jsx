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
    <form onSubmit={handleSubmit} className="modal-form">
      <h3>{transactionToEdit ? 'Editar Transação' : 'Nova Transação'}</h3>

      <div className="form-field">
        <label htmlFor="description">Descrição</label>
        <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" required />
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="amount">Valor</label>
          <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" required />
        </div>
        <div className="form-field">
          <label htmlFor="date">Data</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" required />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="type">Tipo</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="input-field">
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="category">Categoria</label>
          <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field">
            <option value="">Nenhuma</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose} className="secondary-button">
          Cancelar
        </button>
        <button type="submit" className="primary-button">
          Salvar
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;