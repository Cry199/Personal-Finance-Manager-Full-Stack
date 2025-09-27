import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../api/transactionApi';
import { useAuth } from '../../../hooks/useAuth';
import Modal from '../../../components/common/Modal';
import TransactionForm from '../components/TransactionForm';

const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + 1; i >= currentYear - 5; i--) {
        years.push(i);
    }
    return years;
};

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const { user } = useAuth();

    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1, // Mês em JS é 0-11, na API é 1-12
    });

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await getTransactions(page, 10, filters);
            setTransactions(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
    }, [user, filters, page]);


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value ? parseInt(value) : null
        }));
        setPage(0);
    };


    // Função para apagar uma transação
    const handleDelete = async (id) => {
        if (window.confirm('Tem a certeza que quer apagar esta transação?')) {
            try {
                await deleteTransaction(id);
                // Atualiza a lista após apagar
                fetchTransactions();
            } catch (error) {
                console.error('Erro ao apagar transação:', error);
            }
        }
    };

    // Função para salvar uma transação
    const handleSave = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
        fetchTransactions();
    };

    // Função para editar uma transação
    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    // Função para adicionar uma nova transação
    const handleAddNew = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    }

    if (loading) {
        return <div>A carregar transações...</div>;
    }

    return (
        <div className="content-card">
            <div className="page-header">
                <h2>Minhas Transações</h2>
                <button onClick={handleAddNew} className="primary-button">
                    Adicionar Nova
                </button>
            </div>

            <Modal open={isModalOpen} onClose={closeModal}>
                <TransactionForm
                    onSave={handleSave}
                    onClose={closeModal}
                    transactionToEdit={editingTransaction}
                />
            </Modal>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Categoria</th>
                        <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id}>
                            <td>{t.description}</td>
                            <td style={{ color: t.type === 'EXPENSE' ? 'var(--error-color)' : 'var(--success-color)' }}>
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(t.amount)}
                            </td>
                            <td>{new Date(t.date).toLocaleDateString('pt-PT')}</td>
                            <td>{t.type === 'EXPENSE' ? 'Despesa' : 'Receita'}</td>
                            <td>{t.category ? t.category.name : '-'}</td>
                            <td className="actions-cell">
                                <button onClick={() => handleEdit(t)} className="edit-button">Editar</button>
                                <button onClick={() => handleDelete(t.id)} className="delete-button">Apagar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                    Anterior
                </button>
                <span>Página {page + 1} de {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                    Próxima
                </button>
            </div>
        </div>
    );
};

export default TransactionsPage;