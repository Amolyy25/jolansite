import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCLHBbuvL54zueJH4R2FF6zOzZxUi_Ywu8",
    authDomain: "serenity-site.firebaseapp.com",
    projectId: "serenity-site",
    storageBucket: "serenity-site.appspot.com",
    messagingSenderId: "111321558295",
    appId: "1:111321558295:web:dcf9d6c5916da964ee1b52",
    measurementId: "G-KKR430ZQ61"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Activer la persistance pour Firestore
enableIndexedDbPersistence(db)
    .catch((err) => {
        console.error("Erreur de persistance:", err);
    });

// Vérification de l'initialisation
console.log("Firebase initialisé avec auth et Firestore:", !!app);
console.log("Firestore initialisé:", !!db);