import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../api/transactionApi';
import { useAuth } from '../../../hooks/useAuth';
import Modal from '../../../components/common/Modal';
import TransactionForm from '../components/TransactionForm';
import Spinner from '../../../components/common/Spinner';

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

    if (loading) {
        return <Spinner />;
    }

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const response = await getTransactions(page, 10, filters);
                setTransactions(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Erro ao buscar transações:', error);
                toast.error('Não foi possível carregar as transações.');
            } finally {
                setLoading(false);
            }
        };

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


    // Função para salvar (criar ou atualizar) uma transação
    const handleSave = (transactionData) => {
        const promise = editingTransaction
            ? updateTransaction(editingTransaction.id, transactionData)
            : createTransaction(transactionData);

        toast.promise(
            promise,
            {
                loading: 'A salvar...',
                success: () => {
                    fetchTransactions();
                    closeModal();
                    return <b>Transação salva com sucesso!</b>;
                },
                error: <b>Não foi possível salvar.</b>,
            }
        );
    };

    const handleDelete = (id) => {
        const promise = deleteTransaction(id);

        toast.promise(
            promise,
            {
                loading: 'A apagar...',
                success: () => {
                    fetchTransactions();
                    return <b>Transação apagada!</b>;
                },
                error: <b>Não foi possível apagar.</b>,
            }
        );
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

            
            {loading ? (
                <Spinner />
            ) : transactions.length > 0 ? (
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
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Nenhuma transação encontrada para os filtros selecionados.</p>
                    <button onClick={handleAddNew} className="primary-button" style={{ marginTop: '1rem' }}>
                        Adicionar a sua primeira transação
                    </button>
                </div>
            )}

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