// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";              // initializeApp :초기화 하는 것
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};   // 웹 앱을 만들 때 필요한 설정값들이다.

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export default app  하나만 내보낼 수 있다.
export const authService = getAuth(app);  // 하나 이상으로 내보내 줄 수 있다.
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);