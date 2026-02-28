/**
 * Cliente MongoDB compartido para Netlify Functions
 */
const { MongoClient } = require('mongodb');

let cachedClient = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI no configurada');
  cachedClient = await MongoClient.connect(uri, {
    maxPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
  });
  return cachedClient;
}

async function getDb() {
  const client = await getMongoClient();
  return client.db();
}

module.exports = { getMongoClient, getDb };
