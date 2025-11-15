import { useNavigate } from 'react-router-dom';

function ScannerPage() {
  const navigate = useNavigate();

  return (
    <div className="scanner-container">
      <button onClick={() => navigate('/access')}>Volver</button>
      <h2>Escanear Código QR</h2>
      <div className="scanner-placeholder">
        <p>Funcionalidad de escáner QR</p>
        <p>Requiere librería: react-qr-scanner o similar</p>
      </div>
    </div>
  );
}

export default ScannerPage;
