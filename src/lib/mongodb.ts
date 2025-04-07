import { MongoClient } from 'mongodb';

const uri = import.meta.env.MONGO_URI || ''; // Defina no .env.local
const options = {};

const client = new MongoClient(uri, options);

const clientPromise = client.connect();

export default clientPromise;
