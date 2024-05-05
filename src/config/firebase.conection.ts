import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAKTsH7FwHSwlAf1lpZZ88L7ERi_Y610S8",
    authDomain: "tarefasplus-9ed78.firebaseapp.com",
    projectId: "tarefasplus-9ed78",
    storageBucket: "tarefasplus-9ed78.appspot.com",
    messagingSenderId: "7720840755",
    appId: "1:7720840755:web:3abe0daeaf3bf86cf2fd46"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };