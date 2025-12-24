import { MongoClient, Db, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing URI');

const dbName = process.env.MONGODB_DBNAME || "fooddecider-dev-db";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let clientPromise: Promise<MongoClient> | null = null;
let cachedDb: Db | null = null;

export function getClient(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = client.connect(); // connect once
  }
  return clientPromise;
}

export async function getDb(name: string = dbName): Promise<Db> {
  if (cachedDb) return cachedDb;
  const connectedClient = await getClient();
  cachedDb = connectedClient.db(name);
  return cachedDb;
}