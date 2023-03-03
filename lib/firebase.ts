import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase.config";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firestore = getFirestore(app);
