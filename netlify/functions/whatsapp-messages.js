/**
 * GET /api/whatsapp-messages - Listar mensajes entrantes
 * Query: accountId (opcional, filtra por cuenta), limit, skip
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

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Método no permitido' }) };
  }

  const userId = getUserId(event);
  if (!userId) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'No autorizado' }) };
  }

  try {
    const params = event.queryStringParameters || {};
    const accountId = params.accountId;
    const limit = Math.min(parseInt(params.limit || '50', 10), 100);
    const skip = parseInt(params.skip || '0', 10);

    const db = await getDb();
    let query = {};

    if (accountId) {
      const account = await db.collection('whatsapp_accounts').findOne({
        _id: new ObjectId(accountId),
        userId
      });
      if (!account) {
        return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Cuenta no encontrada' }) };
      }
      query.accountId = accountId;
    }

    const messages = await db.collection('whatsapp_messages')
      .find(query)
      .sort({ receivedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const accounts = await db.collection('whatsapp_accounts')
      .find({ userId })
      .project({ _id: 1, name: 1 })
      .toArray();
    const accountMap = Object.fromEntries(accounts.map(a => [a._id.toString(), a.name]));

    const list = messages.map(m => ({
      id: m._id.toString(),
      accountId: m.accountId,
      accountName: accountMap[m.accountId] || 'Desconocida',
      from: m.from,
      fromName: m.fromName,
      type: m.type,
      text: m.text || m.caption || '',
      receivedAt: m.receivedAt,
      messageId: m.messageId,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messages: list,
        total: await db.collection('whatsapp_messages').countDocuments(query)
      })
    };
  } catch (err) {
    console.error('whatsapp-messages:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Error interno' }) };
  }
};
