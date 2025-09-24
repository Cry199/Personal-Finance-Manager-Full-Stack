import { useState, useEffect } from 'react';
import { getCategories } from '../../categories/api/categoryApi';
import { createTransaction } from '../api/transactionApi';


const TransactionForm = ({ onSave, onClose }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Data de hoje
  const [type, setType] = useState('EXPENSE'); // 'EXPENSE' ou 'INCOME'
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

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
      await createTransaction(transactionData);
      onSave(); // Avisa o componente pai que a transação foi salva
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nova Transação</h3>
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