import { useState, useEffect } from 'react';
import { getCategories } from '../../categories/api/categoryApi';

const TransactionForm = ({ onSave, onClose, transactionToEdit }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [type, setType] = useState('EXPENSE');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (transactionToEdit) {
            setDescription(transactionToEdit.description);
            setAmount(transactionToEdit.amount);
            setDate(new Date(transactionToEdit.date).toISOString().slice(0, 10));
            setType(transactionToEdit.type);
            setCategoryId(transactionToEdit.category?.id || '');
        } else {
            // Resetar formulário ao criar uma nova transação
            setDescription('');
            setAmount('');
            setDate(new Date().toISOString().slice(0, 10));
            setType('EXPENSE');
            setCategoryId('');
        }
    }, [transactionToEdit]);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const baseData = {
            description,
            amount: parseFloat(amount),
            date,
            type,
        };

        if (!transactionToEdit) {
            baseData.categoryId = categoryId || null;
        }

        onSave(baseData);
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
                    <input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" required />
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
                    <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field" disabled={!!transactionToEdit}>
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