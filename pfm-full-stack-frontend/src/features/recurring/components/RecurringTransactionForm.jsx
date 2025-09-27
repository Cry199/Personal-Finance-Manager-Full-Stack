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

        onSave(recurringData);
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <h3>{recurringToEdit ? 'Editar Regra Recorrente' : 'Nova Regra Recorrente'}</h3>

            <div className="form-field">
                <label htmlFor="rec-description">Descrição</label>
                <input id="rec-description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" required />
            </div>

            <div className="form-grid">
                <div className="form-field">
                    <label htmlFor="rec-amount">Valor</label>
                    <input id="rec-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" required />
                </div>
                <div className="form-field">
                    <label htmlFor="rec-start-date">Data de Início</label>
                    <input id="rec-start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" required />
                </div>
            </div>

            <div className="form-grid">
                <div className="form-field">
                    <label htmlFor="rec-type">Tipo</label>
                    <select id="rec-type" value={type} onChange={(e) => setType(e.target.value)} className="input-field">
                        <option value="EXPENSE">Despesa</option>
                        <option value="INCOME">Receita</option>
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor="rec-period">Repetir a cada</label>
                    <select id="rec-period" value={period} onChange={(e) => setPeriod(e.target.value)} className="input-field">
                        <option value="DAILY">Dia</option>
                        <option value="WEEKLY">Semana</option>
                        <option value="MONTHLY">Mês</option>
                        <option value="YEARLY">Ano</option>
                    </select>
                </div>
            </div>

            <div className="form-field">
                <label htmlFor="rec-category">Categoria</label>
                <select id="rec-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field">
                    <option value="">Nenhuma</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
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

export default RecurringTransactionForm;