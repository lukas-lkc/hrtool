//import { initializeApp } from ".../firebase/app";
import { getAuth } from ".../firebase/auth";
//import { getFirestore } from ".../firebase/firestore";
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

const auth = getAuth(app);

export { app};

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('logged in!');
  } else {
    console.log('no user');
  }
});