import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

import { firebaseConfig } from "./credentials";

import { User } from "./controllers/user";

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

// Collections
export const userCollection = collection(FIREBASE_DB, "user");
export const machineCollection = collection(FIREBASE_DB, "machine");
