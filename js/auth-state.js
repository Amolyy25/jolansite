import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Fonction de déconnexion
window.handleSignOut = async () => {
    try {
        await signOut(auth);
        window.location.href = './index.html';
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
    }
};

// Gérer l'état de connexion
onAuthStateChanged(auth, (user) => {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    const currentPage = window.location.pathname;
    
    if (user) {
        // Mettre à jour les boutons d'authentification
        if (authButtons) {
            authButtons.innerHTML = `
                <a href="./dashboard.html" class="user-profile" title="Accéder au tableau de bord">
                    <i class="fas fa-user-circle"></i>
                </a>
                <button onclick="handleSignOut()" class="btn-deconnexion">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            `;
        }

        // Mettre à jour le menu utilisateur
        if (userMenu) {
            userMenu.innerHTML = `
                <a href="./profil.html" class="user-profile" title="Mon profil">
                    <i class="fas fa-user-circle"></i>
                </a>
                <button onclick="handleSignOut()" class="btn-deconnexion">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            `;
        }

        // Gérer les redirections
        if (currentPage.includes('connexion.html')) {
            window.location.href = './dashboard.html';
        }
    } else {
        // L'utilisateur est déconnecté
        if (authButtons) {
            authButtons.innerHTML = `
                <a href="./connexion.html" class="btn-connexion">Connexion</a>
                <a href="./inscription.html" class="btn-inscription">Inscription</a>
            `;
        }

        // Rediriger vers la connexion si on est sur une page protégée
        if (currentPage.includes('dashboard.html') || 
            currentPage.includes('mes-programmes.html') || 
            currentPage.includes('profil.html')) {
            window.location.href = './connexion.html';
        }
    }
});

// Vérifier l'état de connexion au chargement
document.addEventListener('DOMContentLoaded', () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("État de connexion:", user ? "Connecté" : "Déconnecté");
        unsubscribe(); // Se désabonner après la première vérification
    });
}); 