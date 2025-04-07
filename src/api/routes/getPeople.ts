// src/routes/getParticipants.ts
import { createRoute } from '@bolt-rpc/server';
import { Person } from '../../types';
import clientPromise from '../../lib/mongodb';

export const getParticipants = createRoute<void, Person[]>({
    method: 'GET',
    handler: async () => {
        const client = await clientPromise;
        const db = client.db();

        const people = await db.collection('participants').find().toArray();

        return {
            status: 200,
            body: people as Person[],
        };
    }
});
