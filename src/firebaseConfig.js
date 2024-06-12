import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAM7VIgbMlTevLs9eVHRb9ujD3dfjuUwH4",
    authDomain: "electionapp-c5e67.firebaseapp.com",
    databaseURL: "https://electionapp-c5e67-default-rtdb.firebaseio.com",
    projectId: "electionapp-c5e67",
    storageBucket: "electionapp-c5e67.appspot.com",
    messagingSenderId: "616755474702",
    appId: "1:616755474702:web:0df2dfcd7b94b9f56d275f",
    measurementId: "G-PWJMWYC2XC"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { db, auth, storage };
