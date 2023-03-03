import { initFirestore } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import firebaseConfig from "../firebase.config";

export const db = initFirestore({
  credential: cert({
    ...firebaseConfig,
  }),
});
