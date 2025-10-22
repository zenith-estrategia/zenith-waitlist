import { MongoClient, ServerApiVersion } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

/**
 * Configuração global do MongoDB com singleton pattern
 * Evita múltiplas conexões ao banco de dados
 *
 * Utiliza @vercel/functions attachDatabasePool para otimizar
 * gerenciamento de conexões em ambientes serverless
 */

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Por favor, defina a variável de ambiente MONGODB_URI no arquivo .env.local"
  );
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Em desenvolvimento, usa uma variável global para preservar o cliente entre hot-reloads
// Em produção, cria uma nova instância
if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    attachDatabasePool(client);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  attachDatabasePool(client);
  clientPromise = client.connect();
}

/**
 * Exporta uma promise do MongoClient
 * Use isso para acessar o banco de dados em suas rotas API
 */
export default clientPromise;
