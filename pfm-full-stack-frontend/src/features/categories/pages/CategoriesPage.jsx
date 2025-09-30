import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import Modal from '../../../components/common/Modal';
import CategoryForm from '../components/CategoryForm';
import Spinner from '../../../components/common/Spinner';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

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
        closeModal();
        fetchCategories(); // Recarrega a lista de categorias
        return <b>Categoria salva com sucesso!</b>;
      },
      error: <b>Não foi possível salvar a categoria.</b>,
    });
  };

  const handleDelete = (id) => {
    // Usar um toast de confirmação para uma melhor experiência
    toast((t) => (
      <div className="confirmation-toast">
        <p>Tem a certeza que quer apagar?</p>
        <div>
          <button
            className="confirm-button"
            onClick={() => {
              const deletePromise = deleteCategory(id);
              toast.promise(deletePromise, {
                loading: 'A apagar...',
                success: () => {
                  fetchCategories();
                  return <b>Categoria apagada!</b>;
                },
                error: <b>Não foi possível apagar.</b>,
              });
              toast.dismiss(t.id);
            }}
          >
            Apagar
          </button>
          <button className="cancel-button" onClick={() => toast.dismiss(t.id)}>
            Cancelar
          </button>
        </div>
      </div>
    ));
  };

  const openModalToEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const openModalToCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
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
                  <button onClick={() => handleDelete(category.id)} className="delete-button">Apagar</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Ainda não tem categorias criadas.</p>
        )}
      </div>

      <Modal open={isModalOpen} onClose={closeModal}>
        <CategoryForm
          onSave={handleSave}
          onClose={closeModal}
          categoryToEdit={editingCategory}
        />
      </Modal>
    </div>
  );
};

export default CategoriesPage;