import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, update, child } from 'firebase/database';
import { database } from '../firebase';

function AccessPage() {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    if (!memberId.trim()) return;
    
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'members'));
      
      if (snapshot.exists()) {
        const members = snapshot.val();
        const member = Object.values(members).find(m => m.memberId === memberId);
        
        if (member) {
          if (member.activo) {
            const accessLog = {
              timestamp: new Date().toISOString(),
              memberId: member.memberId,
              nombre: member.nombre
            };
            
            const accessRef = ref(database, `accessLogs/${Date.now()}`);
            await update(accessRef, accessLog);
            
            setResult({
              success: true,
              message: `Acceso concedido`,
              member: member
            });
          } else {
            setResult({
              success: false,
              message: 'Membresía inactiva'
            });
          }
        } else {
          setResult({
            success: false,
            message: 'Socio no encontrado'
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({
        success: false,
        message: 'Error al verificar'
      });
    }
    
    setTimeout(() => {
      setResult(null);
      setMemberId('');
    }, 3000);
  };

  return (
    <div className="access-container">
      <button onClick={() => navigate('/')}>Volver</button>
      <h2>Control de Acceso</h2>
      <p>Verificar QR de socio</p>
      
      <div className="access-input">
        <input
          type="text"
          placeholder="Introduce el Nº Socio"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          disabled={scanning}
        />
        <button onClick={handleVerify} disabled={scanning || !memberId}>
          Verificar
        </button>
      </div>
      
      <p>O</p>
      
      <button onClick={() => navigate('/scanner')}>
        Escanear con Cámara
      </button>
      
      {result && (
        <div className={`result ${result.success ? 'success' : 'error'}`}>
          <h3>{result.message}</h3>
          {result.member && (
            <div>
              <p><strong>Nombre:</strong> {result.member.nombre}</p>
              <p><strong>ID:</strong> {result.member.memberId}</p>
            </div>
          )}
        </div>
      )}
      
      {!result && <p>Esperando verificación...</p>}
    </div>
  );
}

export default AccessPage;
