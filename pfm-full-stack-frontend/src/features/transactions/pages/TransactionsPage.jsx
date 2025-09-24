import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../api/transactionApi';
import { useAuth } from '../../../hooks/useAuth';
import Modal from '../../../components/common/Modal';
import TransactionForm from '../components/TransactionForm';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await getTransactions();
            setTransactions(response.data.content); // A API paginada retorna os dados em 'content'
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
    }, [user]);

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

    const handleSave = () => {
        setIsModalOpen(false); // Fechar o modal
        fetchTransactions(); // Atualizar a lista
    };

    if (loading) {
        return <div>A carregar transações...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Minhas Transações</h2>
                <button onClick={() => setIsModalOpen(true)}>Adicionar Nova Transação</button>
            </div>

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TransactionForm onSave={handleSave} onClose={() => setIsModalOpen(false)} />
            </Modal>

            <table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id}>
                            <td>{t.description}</td>
                            <td style={{ color: t.type === 'EXPENSE' ? 'red' : 'green' }}>
                                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(t.amount)}
                            </td>
                            <td>{new Date(t.date).toLocaleDateString('pt-PT')}</td>
                            <td>{t.type === 'EXPENSE' ? 'Despesa' : 'Receita'}</td>
                            <td>
                                <button onClick={() => alert('Editar ' + t.id)}>Editar</button>
                                <button onClick={() => handleDelete(t.id)}>Apagar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsPage;