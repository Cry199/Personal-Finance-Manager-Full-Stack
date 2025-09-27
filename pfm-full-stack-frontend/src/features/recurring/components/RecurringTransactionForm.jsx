import { useState, useEffect } from 'react';
import { getCategories } from '../../categories/api/categoryApi';

const RecurringTransactionForm = ({ onSave, onClose, recurringToEdit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [period, setPeriod] = useState('MONTHLY');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  // Preencher o formulário se estivermos a editar
  useEffect(() => {
    if (recurringToEdit) {
      setDescription(recurringToEdit.description);
      setAmount(recurringToEdit.amount);
      setType(recurringToEdit.type);
      setPeriod(recurringToEdit.period);
      setStartDate(new Date(recurringToEdit.startDate).toISOString().slice(0, 10));
      setCategoryId(recurringToEdit.category?.id || '');
    }
  }, [recurringToEdit]);

  // Buscar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recurringData = {
      description,
      amount: parseFloat(amount),
      type,
      period,
      startDate,
      categoryId: categoryId || null,
    };

  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{recurringToEdit ? 'Editar Regra Recorrente' : 'Nova Regra Recorrente'}</h3>
      <div>
        <label>Descrição</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Valor</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
       <div>
        <label>Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="EXPENSE">Despesa</option>
          <option value="INCOME">Receita</option>
        </select>
      </div>
      <div>
        <label>Repetir a cada</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="DAILY">Dia</option>
          <option value="WEEKLY">Semana</option>
          <option value="MONTHLY">Mês</option>
          <option value="YEARLY">Ano</option>
        </select>
      </div>
       <div>
        <label>Data de Início</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </div>
      <div>
        <label>Categoria</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Nenhuma</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">Salvar</button>
      <button type="button" onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default RecurringTransactionForm;