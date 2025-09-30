import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from '../assets/logo.jpg';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <header className="home-header">
          <img src={logo} alt="PFM Logo" className="logo" />
          <h1>
            Bem-vindo ao <span className="logo-text">PFM</span>
          </h1>
          <p className="subtitle">O seu Gestor de Finanças Pessoais simples e eficaz.</p>
        </header>

        <main className="home-main">
          <div className="features">
            <div className="feature-card">
              <h2>Registe Transações</h2>
              <p>Adicione as suas receitas e despesas de forma rápida e fácil.</p>
            </div>
            <div className="feature-card">
              <h2>Visualize Gráficos</h2>
              <p>Entenda para onde o seu dinheiro vai com gráficos intuitivos.</p>
            </div>
            <div className="feature-card">
              <h2>Automatize</h2>
              <p>Configure transações recorrentes e não se preocupe mais.</p>
            </div>
          </div>

          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">
              Comece Agora (É Grátis!)
            </Link>
            <Link to="/login" className="cta-button secondary">
              Já tenho conta
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;