/**
 * Netlify Function: Registro de participantes del curso Productividad x10 IA
 * POST /api/course-registration
 * Persiste en MongoDB Atlas
 */

const { MongoClient } = require('mongodb');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

// Cache del cliente para reutilizar en invocaciones consecutivas (serverless)
let cachedClient = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI no está configurada en las variables de entorno');
  }
  cachedClient = await MongoClient.connect(uri, {
    maxPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
  });
  return cachedClient;
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Método no permitido' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, phone, skill1, skill2 } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Nombre, correo y teléfono son obligatorios',
        })
      };
    }

    const registration = {
      event: 'curso-productividad-ia',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      skill1: skill1?.trim() || '',
      skill2: skill2?.trim() || '',
      createdAt: new Date(),
    };

    const client = await getMongoClient();
    const db = client.db();
    const collection = db.collection('registrations');

    await collection.insertOne(registration);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ success: true, message: 'Registro recibido correctamente' })
    };
  } catch (err) {
    console.error('Error en course-registration:', err);

    const message =
      err.message?.includes('MONGODB_URI') || err.message?.includes('ENOTFOUND')
        ? 'Error de configuración o conexión a la base de datos'
        : 'Error interno del servidor';

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message })
    };
  }
};
