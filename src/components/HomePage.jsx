import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="logo">
        <div className="logo-circle">Z</div>
      </div>
      <h1>Zull The Club</h1>
      <p className="subtitle">Sistema de Gestión de Socios</p>
      
      <div className="button-group">
        <button className="btn btn-primary" onClick={() => navigate('/register')}>
          Registrarse como Socio
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/staff')}>
          Acceso Personal
        </button>
        <button className="btn btn-success" onClick={() => navigate('/access')}>
          Escanear Acceso
        </button>
      </div>
    </div>
  );
}

export default HomePage;
