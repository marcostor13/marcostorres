/**
 * Router único para /api/auth/* (login, register, me)
 * Evita problemas de redirect con POST en Netlify.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('./_shared/mongo');
const { ObjectId } = require('mongodb');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
// Duración de la sesión: 7 días
const JWT_EXPIRES = '7d';

function getPath(event) {
  const pathParam = event.queryStringParameters?.path || '';
  if (pathParam) return pathParam;
  
  const rawPath = event.path || '';
  return rawPath.split('/').pop() || 'login';
}

async function handleLogin(event) {
  const { email, password } = JSON.parse(event.body || '{}');
  if (!email?.trim() || !password) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Email y contraseña requeridos' }) };
  }
  const db = await getDb();
  const user = await db.collection('users').findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Credenciales inválidas' }) };
  }
  // Generar token con duración de 7 días
  const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name }
    })
  };
}

async function handleRegister(event) {
  const { email, password, name } = JSON.parse(event.body || '{}');
  if (!email?.trim() || !password || password.length < 6) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Email y contraseña (mín. 6 caracteres) requeridos' }) };
  }
  const db = await getDb();
  const existing = await db.collection('users').findOne({ email: email.trim().toLowerCase() });
  if (existing) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'El email ya está registrado' }) };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email.trim().toLowerCase(),
    name: (name || '').trim() || email.split('@')[0],
    passwordHash,
    createdAt: new Date(),
  };
  const result = await db.collection('users').insertOne(user);
  const token = jwt.sign({ userId: result.insertedId.toString(), email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      success: true,
      token,
      user: { id: result.insertedId.toString(), email: user.email, name: user.name }
    })
  };
}

async function handleMe(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Token requerido' }) };
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Usuario no encontrado' }) };
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        user: { id: user._id.toString(), email: user.email, name: user.name }
      })
    };
  } catch (err) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Token inválido o expirado' }) };
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };

  const segment = getPath(event).toLowerCase();
  console.log(`api-auth: segment="${segment}", method="${event.httpMethod}"`);

  try {
    if ((segment === 'login' || segment === 'api-auth') && event.httpMethod === 'POST') return await handleLogin(event);
    if (segment === 'register' && event.httpMethod === 'POST') return await handleRegister(event);
    if (segment === 'me' || segment === 'auth-me') return await handleMe(event);

    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: `Ruta "${segment}" no permitida` }) };
  } catch (err) {
    console.error('api-auth error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Error interno' }) };
  }
};
