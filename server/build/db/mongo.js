"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = getClient;
exports.getDb = getDb;
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI;
if (!uri)
    throw new Error('Missing URI');
const dbName = process.env.MONGODB_DBNAME || "fooddecider-dev-db";
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
let clientPromise = null;
let cachedDb = null;
function getClient() {
    if (!clientPromise) {
        clientPromise = client.connect(); // connect once
    }
    return clientPromise;
}
function getDb() {
    return __awaiter(this, arguments, void 0, function* (name = dbName) {
        if (cachedDb)
            return cachedDb;
        const connectedClient = yield getClient();
        cachedDb = connectedClient.db(name);
        return cachedDb;
    });
}
