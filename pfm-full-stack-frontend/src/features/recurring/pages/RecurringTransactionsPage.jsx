import { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import RecurringTransactionForm from '../components/RecurringTransactionForm';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../../utils/errorHandler';
import { formatCurrency } from '../../../utils/formatting';

import {
    getRecurringTransactions,
    deleteRecurringTransaction,
    createRecurringTransaction,
    updateRecurringTransaction
} from '../api/recurringApi';

const RecurringTransactionsPage = () => {
    const [recurring, setRecurring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecurring, setEditingRecurring] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [recurringToDelete, setRecurringToDelete] = useState(null);

    const fetchRecurring = async () => {
        try {
            setLoading(true);
            const response = await getRecurringTransactions();
            setRecurring(response.data);
        } catch (error) {
            console.error('Erro ao buscar transações recorrentes:', error);
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecurring();
    }, []);

    const handleDeleteClick = (rec) => {
        setRecurringToDelete(rec);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!recurringToDelete) return;

        const promise = deleteRecurringTransaction(recurringToDelete.id);
        toast.promise(promise, {
            loading: 'A apagar regra...',
            success: () => {
                fetchRecurring();
                return <b>Regra recorrente apagada!</b>;
            },
            error: <b>Não foi possível apagar a regra.</b>,
        });
        closeConfirmModal();
    };

    const handleSave = async (recurringData) => {
        try {
            if (editingRecurring) {
                await updateRecurringTransaction(editingRecurring.id, recurringData);
            } else {
                await createRecurringTransaction(recurringData);
            }
            closeModal();
            fetchRecurring();
        } catch (error) {
            console.error("Erro ao salvar regra recorrente", error);
            alert("Falha ao salvar. Verifique os dados.");
        }
    };

    const handleEdit = (rec) => {
        setEditingRecurring(rec);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingRecurring(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRecurring(null);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setRecurringToDelete(null);
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
    <div className="content-card">
      <div className="page-header">
        <h2>Transações Recorrentes</h2>
        <button onClick={handleAddNew} className="primary-button">
          Adicionar Nova
        </button>
      </div>

      <Modal open={isModalOpen} onClose={closeModal}>
        <RecurringTransactionForm 
            onSave={handleSave}
            onClose={closeModal}
            recurringToEdit={editingRecurring}
        />
      </Modal>

      <ConfirmationModal
                open={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Tem a certeza que quer apagar a regra recorrente "${recurringToDelete?.description}"?`}
            />

      <table className="custom-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Período</th>
            <th>Data de Início</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {recurring.map((r) => (
            <tr key={r.id}>
              <td>{r.description}</td>
              <td style={{ color: r.type === 'EXPENSE' ? 'var(--error-color)' : 'var(--success-color)' }}>
                  {formatCurrency(r.amount)}
              </td>
              <td>{r.type === 'EXPENSE' ? 'Despesa' : 'Receita'}</td>
              <td>{periodMapping[r.period]}</td>
              <td>{new Date(r.startDate).toLocaleDateString('pt-PT')}</td>
              <td className="actions-cell">
                <button onClick={() => handleEdit(r)} className="edit-button">Editar</button>
                <button onClick={() => handleDeleteClick(r)} className="delete-button">Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecurringTransactionsPage;