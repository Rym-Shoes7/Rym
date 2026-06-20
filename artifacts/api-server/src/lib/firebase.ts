import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore as adminGetFirestore } from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";

let _db: Firestore | null = null;

export function getFirestore(): Firestore {
  if (_db) return _db;

  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set");
    const serviceAccount = JSON.parse(raw) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };
    initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
    });
  }

  _db = adminGetFirestore();
  return _db;
}
