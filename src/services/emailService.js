import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const CLUB_NAME = import.meta.env.VITE_CLUB_NAME || 'zull';

// Obtener credenciales según la asociación
const getEmailConfig = () => {
  if (CLUB_NAME === 'elipse') {
    return {
      SERVICE_ID: import.meta.env.VITE_ELIPSE_EMAILJS_SERVICE_ID,
      TEMPLATE_ID: import.meta.env.VITE_ELIPSE_EMAILJS_TEMPLATE_ID,
      PUBLIC_KEY: import.meta.env.VITE_ELIPSE_EMAILJS_PUBLIC_KEY,
      CLUB_DISPLAY_NAME: 'Asociación Elipse'
    };
  }
  // Por defecto: Zull The Club
  return {
    SERVICE_ID: import.meta.env.VITE_ZULL_EMAILJS_SERVICE_ID,
    TEMPLATE_ID: import.meta.env.VITE_ZULL_EMAILJS_TEMPLATE_ID,
    PUBLIC_KEY: import.meta.env.VITE_ZULL_EMAILJS_PUBLIC_KEY,
    CLUB_DISPLAY_NAME: 'Zull The Club'
  };
};

const config = getEmailConfig();

// Inicializar EmailJS
emailjs.init(config.PUBLIC_KEY);

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
      club_name: config.CLUB_DISPLAY_NAME,
      message: `¡Bienvenido a ${config.CLUB_DISPLAY_NAME}! Tu número de socio es: ${memberId}. Guarda este código QR para acceder al club.`
    };

    const response = await emailjs.send(
      config.SERVICE_ID,
      config.TEMPLATE_ID,
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
