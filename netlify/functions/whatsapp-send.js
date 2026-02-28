/**
 * WhatsApp Cloud API - Enviar mensaje
 * POST /api/whatsapp-send
 */
const jwt = require('jsonwebtoken');
const { getDb } = require('./_shared/mongo');
const { ObjectId } = require('mongodb');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const WA_API = 'https://graph.facebook.com/v25.0';

function getUserId(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Método no permitido' }) };
  }

  const userId = getUserId(event);
  if (!userId) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'No autorizado' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { accountId, to, templateName, languageCode, components } = body;

    if (!accountId || !to || !templateName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'accountId, to y templateName son obligatorios'
        })
      };
    }

    const db = await getDb();
    const account = await db.collection('whatsapp_accounts').findOne({
      _id: new ObjectId(accountId),
      userId
    });

    if (!account) {
      return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Cuenta no encontrada' }) };
    }

    const phoneNumberId = account.phoneNumberId;
    console.log(`[WhatsApp] Intentando enviar desde la cuenta: "${account.name}"`);
    console.log(`[WhatsApp] Usando Phone Number ID: ${phoneNumberId}`);
    if (!phoneNumberId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'La cuenta no tiene phoneNumberId configurado'
        })
      };
    }

    // Limpiar el número de destino (quitar +, espacios, etc)
    const cleanTo = to.replace(/\D/g, '');

    const payload = {
      messaging_product: 'whatsapp',
      to: cleanTo,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode || 'es'
        }
      }
    };

    if (components && components.length > 0) {
      payload.template.components = components;
    }

    const sendUrl = `${WA_API}/${phoneNumberId}/messages`;
    console.log(`Intentando enviar mensaje con Phone Number ID: ${phoneNumberId}`);
    console.log(`URL de destino: ${sendUrl}`);
    
    const res = await fetch(sendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[WhatsApp] Error completo de Meta:', JSON.stringify(data, null, 2));
      // Manejar errores específicos de Meta
      let msg = data.error?.message || 'Error al enviar mensaje';
      const code = data.error?.code;

      if (code === 133010) {
        msg = 'Error de Meta: El número de teléfono no está registrado. Ve a tu Panel de Meta > WhatsApp > Configuración de la API y asegúrate de que el número esté registrado y diga "Conectado".';
      } else if (msg.includes('Object with ID') && msg.includes('@')) {
        msg = 'Error de configuración: Has puesto tu correo en el campo "Phone Number ID". Debes poner el identificador numérico de Meta.';
      } else if (code === 100 || data.error?.type === 'OAuthException') {
        if (msg.includes('message_templates')) {
          msg = 'Error de configuración: El WABA ID parece ser incorrecto (posiblemente pusiste el Phone Number ID en su lugar). Revisa la configuración de la cuenta.';
        }
      }
      return {
        statusCode: res.status >= 400 ? res.status : 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: msg,
          details: data.error
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messageId: data.messages?.[0]?.id,
        message: 'Mensaje enviado'
      })
    };
  } catch (err) {
    console.error('whatsapp-send:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Error interno' }) };
  }
};
