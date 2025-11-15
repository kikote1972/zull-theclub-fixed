import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Inicializar EmailJS
emailjs.init(PUBLIC_KEY);

/**
 * Envía un correo electrónico con el código QR al socio registrado
 * @param {Object} params - Parámetros del correo
 * @param {string} params.toEmail - Email del destinatario
 * @param {string} params.toName - Nombre del socio
 * @param {string} params.memberId - ID del socio
 * @param {string} params.qrCodeDataURL - QR code como Data URL
 * @returns {Promise} - Promesa que resuelve cuando el email se envía
 */
export const sendMembershipEmail = async ({ toEmail, toName, memberId, qrCodeDataURL }) => {
  try {
    const templateParams = {
      to_email: toEmail,
      to_name: toName,
      member_id: memberId,
      qr_code: qrCodeDataURL,
      club_name: 'Zull The Club',
      message: `¡Bienvenido a Zull The Club! Tu número de socio es: ${memberId}. Guarda este código QR para acceder al club.`
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    console.log('Email enviado exitosamente:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error al enviar email:', error);
    return { success: false, error };
  }
};

export default { sendMembershipEmail };
