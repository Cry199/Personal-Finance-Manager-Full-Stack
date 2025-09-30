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

        <footer className="home-footer">
          <p>
            Este projeto é feito como material de estudo por {' '}
            <a href="https://github.com/Cry199" target="_blank" rel="noopener noreferrer">
              Cry199
            </a>
            .
          </p>
          <p>
            Link do Repositório: {' '}
            <a href="https://github.com/Cry199/Personal-Finance-Manager-Full-Stack" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
          <p>
            Backend (API): {' '}
            <a href="https://pfm-full-stack-api-faw777jkuq-rj.a.run.app/swagger-ui/index.html" target="_blank" rel="noopener noreferrer">
              Swagger UI
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;