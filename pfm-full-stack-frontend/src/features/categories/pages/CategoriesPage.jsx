import { useState, useEffect } from 'react';
import { getCategories, createCategory } from '../api/categoryApi';
import './CategoriesPage.css';
import { getErrorMessage } from '../../../utils/errorHandler'; 

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      const errorMessage = getErrorMessage(error);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return; // Não criar categorias vazias

    try {
      await createCategory({ name: newCategoryName });
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      alert('Não foi possível criar a categoria.');
    }
  };

  if (loading) {
    return <div>A carregar categorias...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Gerir Categorias</h2>
      </div>

      <div className="categories-container">
        {/* Coluna do Formulário */}
        <div className="category-form-card">
          <h3>Criar Nova Categoria</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="category-name">Nome da categoria</label>
              <input
                id="category-name"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="input-field"
              />
            </div>
            <button type="submit" className="primary-button" style={{ marginTop: '1rem' }}>
              Adicionar
            </button>
          </form>
        </div>

        {/* Coluna da Lista */}
        <div className="category-list-card">
          <h3>Categorias Existentes</h3>
          {categories.length > 0 ? (
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category.id} className="category-list-item">
                  <span>{category.name}</span>
                  {/* Aqui podemos adicionar botões de editar/apagar no futuro */}
                </li>
              ))}
            </ul>
          ) : (
            <p>Ainda não tem categorias criadas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;