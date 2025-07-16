
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyDFQ6MowLWIqdhoOh5C32en8V_X9tHhf7o",
  authDomain: "budgetmate-c9bfd.firebaseapp.com",
  projectId: "budgetmate-c9bfd",
  storageBucket: "budgetmate-c9bfd.firebasestorage.app",
  messagingSenderId: "525714858871",
  appId: "1:525714858871:web:e22c86e3e5ef9f62d1b772"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
export {app, auth}