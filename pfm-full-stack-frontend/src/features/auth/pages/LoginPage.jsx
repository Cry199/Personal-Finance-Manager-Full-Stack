import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { getErrorMessage } from '../../../utils/errorHandler';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
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
        <div>
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
        <button type="submit" className="primary-button">
          Entrar
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Ainda não tem conta?{' '}
        <Link to="/register" style={{ color: 'var(--primary-color)' }}>
          Registe-se aqui
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;