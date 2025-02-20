import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Connexion
export const handleSignIn = async (email, password, remember = false) => {
    console.log("Tentative de connexion avec:", { email, remember });
    
    try {
        if (remember) {
            console.log("Configuration de la persistance...");
            await setPersistence(auth, browserLocalPersistence);
        }
        
        console.log("Authentification avec Firebase...");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Connexion réussie:", userCredential);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Erreur de connexion:", error.code, error.message);
        let errorMessage;
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = "L'adresse email n'est pas valide.";
                break;
            case 'auth/user-disabled':
                errorMessage = "Ce compte a été désactivé.";
                break;
            case 'auth/user-not-found':
                errorMessage = "Aucun compte ne correspond à cet email.";
                break;
            case 'auth/wrong-password':
                errorMessage = "Mot de passe incorrect.";
                break;
            default:
                errorMessage = "Une erreur est survenue lors de la connexion.";
        }
        return { success: false, error: errorMessage };
    }
}; 