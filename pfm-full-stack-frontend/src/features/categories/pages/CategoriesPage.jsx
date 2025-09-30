import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import Modal from '../../../components/common/Modal';
import CategoryForm from '../components/CategoryForm';
import Spinner from '../../../components/common/Spinner';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Não foi possível carregar as categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = (categoryData) => {
    const promise = editingCategory
      ? updateCategory(editingCategory.id, categoryData)
      : createCategory(categoryData);

    toast.promise(promise, {
      loading: 'A salvar...',
      success: () => {
        closeFormModal();
        fetchCategories();
        return <b>Categoria salva com sucesso!</b>;
      },
      error: <b>Não foi possível salvar a categoria.</b>,
    });
  };
  
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    const deletePromise = deleteCategory(categoryToDelete.id);

    toast.promise(deletePromise, {
      loading: 'A apagar...',
      success: () => {
        fetchCategories();
        return <b>Categoria "{categoryToDelete.name}" apagada!</b>;
      },
      error: <b>Não foi possível apagar.</b>,
    });
    
    closeConfirmModal();
  };


  const openModalToEdit = (category) => {
    setEditingCategory(category);
    setIsFormModalOpen(true);
  };

  const openModalToCreate = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingCategory(null);
  };

  // 5. Função para fechar o modal de confirmação
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setCategoryToDelete(null);
  };


  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Gerir Categorias</h2>
        <button onClick={openModalToCreate} className="primary-button">
          Adicionar Nova
        </button>
      </div>

      <div className="content-card">
        <h3>Categorias Existentes</h3>
        {categories.length > 0 ? (
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.id} className="category-list-item">
                <span>{category.name}</span>
                <div className="actions-cell">
                  <button onClick={() => openModalToEdit(category)} className="edit-button">Editar</button>
                  <button onClick={() => handleDeleteClick(category)} className="delete-button">Apagar</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Ainda não tem categorias criadas.</p>
        )}
      </div>

      {/* Modal para criar/editar */}
      <Modal open={isFormModalOpen} onClose={closeFormModal}>
        <CategoryForm
          onSave={handleSave}
          onClose={closeFormModal}
          categoryToEdit={editingCategory}
        />
      </Modal>

      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem a certeza que quer apagar a categoria "${categoryToDelete?.name}"? Esta ação não pode ser revertida.`}
      />
    </div>
  );
};

export default CategoriesPage;