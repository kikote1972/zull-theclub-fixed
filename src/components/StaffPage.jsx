import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../firebase';

function StaffPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const membersRef = ref(database, 'members');
    const logsRef = ref(database, 'accessLogs');

    const unsubscribeMembers = onValue(membersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const membersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMembers(membersList);
      }
      setLoading(false);
    });

    const unsubscribeLogs = onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const logsList = Object.values(data);
        setAccessLogs(logsList.slice(-10).reverse());
      }
    });

    return () => {
      unsubscribeMembers();
      unsubscribeLogs();
    };
  }, []);

  const handleDelete = async (memberId) => {
    if (window.confirm('¿Eliminar este socio?')) {
      try {
        await remove(ref(database, `members/${memberId}`));
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="staff-container">
      <button onClick={() => navigate('/')}>Volver</button>
      <h2>Panel del Personal</h2>
      
      <section>
        <h3>Miembros Registrados ({members.length})</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>{member.memberId}</td>
                  <td>{member.nombre}</td>
                  <td>{member.email}</td>
                  <td>{member.activo ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <button onClick={() => handleDelete(member.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h3>Últimos Accesos</h3>
        <ul>
          {accessLogs.map((log, index) => (
            <li key={index}>
              {log.nombre} - {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default StaffPage;
