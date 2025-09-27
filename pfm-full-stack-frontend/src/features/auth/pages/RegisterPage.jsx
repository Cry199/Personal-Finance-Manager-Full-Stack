import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            await register(name, email, password);
            toast.success('Conta criada com sucesso! Por favor, faça o login.');
            navigate('/login');
        } catch (error) {
            // O backend retorna uma mensagem de erro útil
            const errorMessage = error.response?.data || 'Não foi possível criar a conta.';
            toast.error(errorMessage);
            console.error('Erro no registo:', error);
        }
    };

    return (
        <div className="form-container">
            <h2>Criar Conta</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="name">Nome</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <button type="submit" className="primary-button" style={{ marginTop: '1rem' }}>
                    Registar
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Já tem uma conta?{' '}
                <Link to="/login" style={{ color: 'var(--primary-color)' }}>
                    Faça o login
                </Link>
            </p>
        </div>
    );
};

export default RegisterPage;