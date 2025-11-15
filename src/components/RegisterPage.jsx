import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push, set } from 'firebase/database';
import { database } from '../firebase';
import QRCode from 'qrcode';
import { sendMembershipEmail } from '../services/emailService';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaNacimiento: ''
  });
  const [qrCode, setQrCode] = useState('');
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(false);

  const generateMemberId = () => {
    return 'ZTC-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newMemberId = generateMemberId();
      const memberData = {
        ...formData,
        memberId: newMemberId,
        fechaRegistro: new Date().toISOString(),
        activo: true
      };

      const membersRef = ref(database, 'members');
      const newMemberRef = push(membersRef);
      await set(newMemberRef, memberData);

      const qr = await QRCode.toDataURL(newMemberId);
      setQrCode(qr);
      setMemberId(newMemberId);

            // Enviar email con QR code
      const emailResult = await sendMembershipEmail({
        toEmail: formData.email,
        toName: formData.nombre,
        memberId: newMemberId,
        qrCodeDataURL: qr
      });
      
      if (emailResult.success) {
        console.log('Email enviado exitosamente');
      } else {
        console.error('Error al enviar email, pero el registro fue exitoso');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al registrar. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (qrCode) {
    return (
      <div className="register-success">
        <h2>¡Registro Exitoso!</h2>
        <p>ID de Socio: <strong>{memberId}</strong></p>
        <img src={qrCode} alt="QR Code" />
        <p>Guarda este código QR para acceder al club</p>
        <button onClick={() => navigate('/')}>Volver al Inicio</button>
      </div>
    );
  }

  return (
    <div className="register-container">
      <button onClick={() => navigate('/')}>Volver</button>
      <h2>Registro de Nuevo Socio</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
