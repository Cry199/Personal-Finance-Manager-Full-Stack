import { useState, useEffect } from 'react';
import { getRecurringTransactions, deleteRecurringTransaction } from '../api/recurringApi';

const RecurringTransactionsPage = () => {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecurring = async () => {
    try {
      setLoading(true);
      const response = await getRecurringTransactions();
      setRecurring(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações recorrentes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem a certeza que quer apagar esta regra recorrente?')) {
      try {
        await deleteRecurringTransaction(id);
        fetchRecurring();
      } catch (error) {
        console.error('Erro ao apagar regra recorrente:', error);
      }
    }
  };

  const periodMapping = {
    DAILY: 'Diária',
    WEEKLY: 'Semanal',
    MONTHLY: 'Mensal',
    YEARLY: 'Anual'
  };

  if (loading) {
    return <div>A carregar...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Transações Recorrentes</h2>
        <button onClick={() => alert('Abrir modal para nova regra')}>Adicionar Nova</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Período</th>
            <th>Próxima Ocorrência</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {recurring.map((r) => (
            <tr key={r.id}>
              <td>{r.description}</td>
              <td style={{ color: r.type === 'EXPENSE' ? 'red' : 'green' }}>
                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(r.amount)}
              </td>
              <td>{r.type === 'EXPENSE' ? 'Despesa' : 'Receita'}</td>
              <td>{periodMapping[r.period]}</td>
              <td>{new Date(r.startDate).toLocaleDateString('pt-PT')}</td>
              <td>
                <button onClick={() => alert('Editar ' + r.id)}>Editar</button>
                <button onClick={() => handleDelete(r.id)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecurringTransactionsPage;