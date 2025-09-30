import { useEffect, useState } from 'react';
import { getTransactions } from '../../transactions/api/transactionApi';
import { Link } from 'react-router-dom';
import Spinner from '../../../components/common/Spinner';
import { formatCurrency } from '../../../utils/formatting';

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            try {
                // Pedir a primeira página com 5 itens
                const response = await getTransactions(0, 5); 
                setTransactions(response.data.content);
            } catch (error) {
                console.error("Erro ao buscar transações recentes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentTransactions();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="recent-transactions-container">
            <h3>Transações Recentes</h3>
            {transactions.length > 0 ? (
                <ul className="transaction-list">
                    {transactions.map((t) => (
                        <li key={t.id} className="transaction-item">
                            <div className="transaction-info">
                                <span>{t.description}</span>
                                <small>{new Date(t.date).toLocaleDateString('pt-PT')}</small>
                            </div>
                            <span className={`transaction-amount ${t.type.toLowerCase()}`}>
                                {t.type === 'EXPENSE' ? '-' : '+'}
                                {formatCurrency(t.amount)}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma transação registada ainda.</p>
            )}
            <Link to="/dashboard/transactions" className="view-all-link">
                Ver Todas as Transações
            </Link>
        </div>
    );
};

export default RecentTransactions;