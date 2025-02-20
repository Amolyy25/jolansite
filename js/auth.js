import { auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
    // Gestion de l'affichage/masquage du mot de passe
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;

            // Simulation de connexion (à remplacer par votre logique d'authentification)
            console.log('Tentative de connexion:', { email, password, remember });
            // Redirection vers le tableau de bord après connexion réussie
            window.location.href = './dashboard.html';
        });
    }

    // Gestion du formulaire d'inscription
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nom = document.getElementById('nom').value;
            const prenom = document.getElementById('prenom').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password-confirm').value;
            const terms = document.getElementById('terms').checked;

            if (password !== passwordConfirm) {
                alert('Les mots de passe ne correspondent pas');
                return;
            }

            if (!terms) {
                alert('Veuillez accepter les conditions d\'utilisation');
                return;
            }

            // Simulation d'inscription (à remplacer par votre logique d'inscription)
            console.log('Tentative d\'inscription:', { nom, prenom, email, password });
            // Redirection vers la page de connexion après inscription réussie
            window.location.href = './connexion.html';
        });
    }
});

// Connexion
export const handleSignIn = async (email, password, remember = false) => {
    try {
        if (remember) {
            await setPersistence(auth, browserLocalPersistence);
        }
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Connexion réussie:", userCredential);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Erreur de connexion:", error);
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

// Déconnexion
export const handleSignOut = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
