/**
 * Webhook WhatsApp Cloud API
 * GET: Verificación (hub.mode, hub.verify_token, hub.challenge)
 * POST: Recibir mensajes
 */
const { getDb } = require('./_shared/mongo');

const headers = { 'Content-Type': 'application/json' };

exports.handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    try {
      const params = event.queryStringParameters || {};
      const mode = params['hub.mode'];
      const token = (params['hub.verify_token'] || '').trim();
      const challenge = params['hub.challenge'];
      if (mode === 'subscribe' && challenge) {
        // 1. Fallback: token global desde variable de entorno (más fácil de configurar)
        const envToken = (process.env.WHATSAPP_VERIFY_TOKEN || '').trim();
        if (envToken && token === envToken) {
          return { statusCode: 200, headers: { 'Content-Type': 'text/plain' }, body: challenge };
        }
        // 2. Buscar cuenta por verifyToken en MongoDB
        const db = await getDb();
        const account = await db.collection('whatsapp_accounts').findOne({ verifyToken: token });
        if (account) {
          return { statusCode: 200, headers: { 'Content-Type': 'text/plain' }, body: challenge };
        }
      }
    } catch (e) {
      console.error('webhook verify:', e);
    }
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Forbidden' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    if (data.object !== 'whatsapp_business_account') {
      return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
    }

    const db = await getDb();
    const messagesColl = db.collection('whatsapp_messages');

    for (const entry of data.entry || []) {
      const wabaId = String(entry.id);
      for (const change of entry.changes || []) {
        if (change.field !== 'messages') continue;
        const value = change.value || {};
        const messages = value.messages || [];
        const contacts = value.contacts || [];
        const metadata = value.metadata || {};

        const account = await db.collection('whatsapp_accounts').findOne({
          $or: [{ wabaId }, { phoneNumberId: metadata.phone_number_id || '' }]
        });
        const accountId = account ? account._id.toString() : null;

        for (let i = 0; i < messages.length; i++) {
          const msg = messages[i];
          const contact = contacts[i] || {};
          await messagesColl.insertOne({
            accountId,
            wabaId,
            phoneNumberId: metadata.phone_number_id || '',
            messageId: msg.id,
            from: msg.from,
            fromName: (contact.profile || {}).name || '',
            type: msg.type || 'text',
            timestamp: msg.timestamp ? new Date(parseInt(msg.timestamp) * 1000) : new Date(),
            text: (msg.text || {}).body || '',
            caption: msg.caption || '',
            receivedAt: new Date(),
          });
        }
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('whatsapp-webhook:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
