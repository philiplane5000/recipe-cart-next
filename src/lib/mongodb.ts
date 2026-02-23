import { MongoClient, type MongoClient as TMongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: 'recipe-cart' };

function getMongoClient(): TMongoClient {
  // In development mode, use a global variable to preserve the value across HMR
  if (process.env.NODE_ENV === 'development') {
    const globalObject = global as typeof globalThis & {
      _mongoClient?: MongoClient;
    };

    globalObject._mongoClient ??= new MongoClient(uri, options);
    return globalObject._mongoClient;
  }

  // In production mode, avoid using a global variable
  return new MongoClient(uri, options);
}

export default getMongoClient();
