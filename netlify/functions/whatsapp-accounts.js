/**
 * WhatsApp Cloud API - Cuentas multicuenta
 * GET /api/whatsapp-accounts - Listar (requiere auth)
 * POST /api/whatsapp-accounts - Crear (requiere auth)
 * PUT /api/whatsapp-accounts/:id - Actualizar (requiere auth)
 * DELETE /api/whatsapp-accounts/:id - Eliminar (requiere auth)
 *
 * Credenciales según doc oficial:
 * - accessToken: Token de acceso de Meta (WhatsApp > API Setup)
 * - phoneNumberId: ID del número de teléfono en Cloud API
 * - wabaId: WhatsApp Business Account ID (opcional)
 * - appSecret: Para verificación de webhook (X-Hub-Signature-256)
 * - verifyToken: Token para verificación GET del webhook
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

async function requireAuth(event) {
  const userId = getUserId(event);
  if (!userId) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'No autorizado' }) };
  }
  return userId;
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };

  const userId = await requireAuth(event);
  if (typeof userId === 'object' && userId.statusCode) return userId;

  const db = await getDb();
  const coll = db.collection('whatsapp_accounts');

  try {
    if (event.httpMethod === 'GET') {
      const list = await coll.find({ userId }).sort({ createdAt: -1 }).toArray();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          accounts: list.map(a => ({
            id: a._id.toString(),
            name: a.name,
            phoneNumberId: a.phoneNumberId,
            wabaId: a.wabaId,
            phoneNumber: a.phoneNumber,
            hasAccessToken: !!a.accessToken,
            hasAppSecret: !!a.appSecret,
            verifyToken: a.verifyToken ? '***' : null,
            createdAt: a.createdAt,
          }))
        })
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { name, accessToken, phoneNumberId, wabaId, phoneNumber, appSecret, verifyToken } = body;
      if (!name?.trim() || !accessToken?.trim() || !phoneNumberId?.trim()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Nombre, accessToken y phoneNumberId son obligatorios'
          })
        };
      }
      // Validación básica: phoneNumberId y wabaId suelen ser solo números
      if (!/^\d+$/.test(phoneNumberId.trim())) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'El Phone Number ID debe ser numérico. No pongas tu correo aquí.'
          })
        };
      }
      const doc = {
        userId,
        name: name.trim(),
        accessToken: accessToken.trim(),
        phoneNumberId: phoneNumberId.trim(),
        wabaId: wabaId?.trim() || '',
        phoneNumber: phoneNumber?.trim() || '',
        appSecret: appSecret?.trim() || '',
        verifyToken: verifyToken?.trim() || '',
        createdAt: new Date(),
      };
      const result = await coll.insertOne(doc);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          id: result.insertedId.toString(),
          message: 'Cuenta creada'
        })
      };
    }

    if (event.httpMethod === 'PUT' || event.httpMethod === 'DELETE') {
      let id, body = {};
      try {
        body = JSON.parse(event.body || '{}');
        id = body.id || event.queryStringParameters?.id;
      } catch {
        id = event.queryStringParameters?.id;
      }
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'ID requerido' }) };
      }
      const existing = await coll.findOne({ _id: new ObjectId(id), userId });
      if (!existing) {
        return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Cuenta no encontrada' }) };
      }

      if (event.httpMethod === 'DELETE') {
        await coll.deleteOne({ _id: new ObjectId(id), userId });
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Cuenta eliminada' }) };
      }

      const update = {};
      if (body.name !== undefined) update.name = String(body.name).trim();
      if (body.accessToken !== undefined) update.accessToken = String(body.accessToken).trim();
      if (body.phoneNumberId !== undefined) {
        const pId = String(body.phoneNumberId).trim();
        if (!/^\d+$/.test(pId)) {
          return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'El Phone Number ID debe ser numérico.' }) };
        }
        update.phoneNumberId = pId;
      }
      if (body.wabaId !== undefined) update.wabaId = String(body.wabaId).trim();
      if (body.phoneNumber !== undefined) update.phoneNumber = String(body.phoneNumber).trim();
      if (body.appSecret !== undefined) update.appSecret = String(body.appSecret).trim();
      if (body.verifyToken !== undefined) update.verifyToken = String(body.verifyToken).trim();

      await coll.updateOne({ _id: new ObjectId(id), userId }, { $set: update });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Cuenta actualizada' }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Método no permitido' }) };
  } catch (err) {
    console.error('whatsapp-accounts:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Error interno' }) };
  }
};
