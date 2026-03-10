import admin from 'firebase-admin';
import { env } from '../env';

admin.initializeApp({
  credential: admin.credential.cert(env.FIREBASE_CONFIG),
  storageBucket: "your-project-id.appspot.com"
});

export const bucket = admin.storage().bucket();