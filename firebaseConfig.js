import { initializeApp } from "https://cdn.jsdelivr.net/npm/firebase@10.6.0/app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDykdiCuuMJksQvJ4y2tGkKKdIX3PprBw",
  authDomain: "hrtool-c763b.firebaseapp.com",
  databaseURL: "https://hrtool-c763b-default-rtdb.firebaseio.com",
  projectId: "hrtool-c763b",
  storageBucket: "hrtool-c763b.appspot.com",
  messagingSenderId: "443882727101",
  appId: "1:443882727101:web:54dd9ddd98ae6067d4f9d4",
  measurementId: "G-PGJTJVYZYN"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

export { app };
