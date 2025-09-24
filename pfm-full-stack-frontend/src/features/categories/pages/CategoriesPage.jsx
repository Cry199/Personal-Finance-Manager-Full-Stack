import { useState, useEffect } from 'react';
import { getCategories, createCategory } from '../api/categoryApi';

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
      <h2>Gerir Categorias</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <h3>Criar Nova Categoria</h3>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nome da categoria"
        />
        <button type="submit">Adicionar</button>
      </form>

      <h3>Categorias Existentes</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;