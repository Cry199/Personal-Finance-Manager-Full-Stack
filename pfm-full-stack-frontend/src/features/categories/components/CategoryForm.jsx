import { useState, useEffect } from 'react';

const CategoryForm = ({ onSave, onClose, categoryToEdit }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        // Se estivermos a editar, preenche o campo com o nome atual
        if (categoryToEdit) {
            setName(categoryToEdit.name);
        } else {
            setName(''); // Limpa o campo para uma nova categoria
        }
    }, [categoryToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({ name });
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <h3>{categoryToEdit ? 'Editar Categoria' : 'Nova Categoria'}</h3>
            
            <div className="form-field">
                <label htmlFor="category-name">Nome da Categoria</label>
                <input 
                    id="category-name" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="input-field" 
                    required 
                />
            </div>

            <div className="form-actions">
                <button type="button" onClick={onClose} className="secondary-button">
                    Cancelar
                </button>
                <button type="submit" className="primary-button">
                    Salvar
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;