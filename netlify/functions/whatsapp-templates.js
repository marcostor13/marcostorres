/**
 * WhatsApp Templates
 * GET /api/whatsapp-templates?accountId=xxx - Listar templates desde Meta API
 * POST /api/whatsapp-templates - Crear template (envía a Meta para aprobación)
 * Doc: https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates
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

  const userId = getUserId(event);
  if (!userId) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'No autorizado' }) };
  }

  try {
    const db = await getDb();

    if (event.httpMethod === 'GET') {
      const accountId = event.queryStringParameters?.accountId;
      const wabaId = event.queryStringParameters?.wabaId;
      if (!accountId && !wabaId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'accountId o wabaId requerido'
          })
        };
      }

      let account;
      if (accountId) {
        account = await db.collection('whatsapp_accounts').findOne({
          _id: new ObjectId(accountId),
          userId
        });
      } else {
        account = await db.collection('whatsapp_accounts').findOne({
          wabaId,
          userId
        });
      }
      if (!account) {
        return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Cuenta no encontrada' }) };
      }

      const waba = account.wabaId;
      if (!waba) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'La cuenta debe tener WABA ID para listar templates. Añádelo en la configuración de la cuenta.'
          })
        };
      }
      const templatesUrl = `https://graph.facebook.com/v21.0/${waba}/message_templates`;
      console.log('Fetching templates for WABA:', waba);
      const res = await fetch(templatesUrl, {
        headers: { 'Authorization': `Bearer ${account.accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        // Error común: usar Phone Number ID en lugar de WABA ID
        let userMessage = data.error?.message || 'Error al listar templates';
        if (data.error?.code === 100 && userMessage.includes('message_templates')) {
          userMessage = 'Error de configuración: El WABA ID parece ser incorrecto (posiblemente pusiste el Phone Number ID en su lugar). Revisa la configuración de la cuenta.';
        }
        return {
          statusCode: res.status >= 400 ? res.status : 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: userMessage,
            details: data.error
          })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          templates: data.data || []
        })
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { accountId, name, language, category, components } = body;
      if (!accountId || !name || !language || !category || !components?.length) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'accountId, name, language, category y components son obligatorios'
          })
        };
      }

      const account = await db.collection('whatsapp_accounts').findOne({
        _id: new ObjectId(accountId),
        userId
      });
      if (!account) {
        return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Cuenta no encontrada' }) };
      }

      const waba = account.wabaId;
      if (!waba) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'La cuenta debe tener wabaId para crear templates'
          })
        };
      }

      const payload = {
        name: name.replace(/\s/g, '_').toLowerCase(),
        language,
        category,
        components,
      };

      const createUrl = `${WA_API}/${waba}/message_templates`;
      const res = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          statusCode: res.status >= 400 ? res.status : 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: data.error?.message || 'Error al crear template',
            details: data.error
          })
        };
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          id: data.id,
          message: 'Template enviado para aprobación'
        })
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Método no permitido' }) };
  } catch (err) {
    console.error('whatsapp-templates:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Error interno' }) };
  }
};
