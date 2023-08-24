import Dexie from "dexie";

export const db = new Dexie('localeDatabase');

db.version(1).stores({
    credentials: '&user, sk, rr',
    followedEvents: '&eventId',
    followedPeople: '&pubkey'
});