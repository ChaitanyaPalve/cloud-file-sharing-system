import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkZyTFtgLpT2VIMaeGk9NhGJ3vnXMExm0",
  authDomain: "cloud-file-sharing-syste-1fd35.firebaseapp.com",
  projectId: "cloud-file-sharing-syste-1fd35",
  storageBucket: "cloud-file-sharing-syste-1fd35.firebasestorage.app",
  messagingSenderId: "797160392674",
  appId: "1:797160392674:web:5363ad1b2150e889395bbb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export async function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return signOut(auth);
}

export async function saveFileRecord(fileData) {
  return addDoc(collection(db, "files"), {
    ...fileData,
    createdAt: serverTimestamp()
  });
}
