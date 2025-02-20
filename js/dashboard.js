import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

class DashboardManager {
    constructor() {
        this.userNameElements = document.querySelectorAll('.user-name');
        console.log("🔍 Éléments trouvés avec la classe user-name:", this.userNameElements.length);
    }

    async initialize() {
        console.log("🚀 Initialisation du dashboard...");
        onAuthStateChanged(auth, async (user) => {
            console.log("👤 État de l'authentification changé:", user ? "Connecté" : "Déconnecté");
            if (user) {
                console.log("📧 Email de l'utilisateur:", user.email);
                await this.updateUserInfo(user.email);
            } else {
                console.log("❌ Utilisateur non connecté, redirection vers connexion.html");
                window.location.href = './connexion.html';
            }
        });
    }

    async updateUserInfo(userEmail) {
        try {
            console.log("🔎 Recherche de l'utilisateur avec l'email:", userEmail);
            // Créer une requête pour trouver l'utilisateur par email
            const usersRef = collection(db, "user");
            const q = query(usersRef, where("email", "==", userEmail));
            const querySnapshot = await getDocs(q);

            console.log("📊 Nombre de documents trouvés:", querySnapshot.size);

            if (!querySnapshot.empty) {
                // Prendre le premier document correspondant
                const userData = querySnapshot.docs[0].data();
                console.log("✅ Données utilisateur trouvées:", userData);

                if (userData.firstName) {
                    this.userNameElements.forEach(element => {
                        console.log("✏️ Mise à jour de l'élément avec le prénom:", userData.firstName);
                        element.textContent = userData.firstName;
                        console.log("✨ Nouveau contenu de l'élément:", element.textContent);
                    });
                } else {
                    console.error("❌ Le champ firstName est manquant dans les données utilisateur");
                }
            } else {
                console.error("❌ Aucun utilisateur trouvé avec cet email");
            }
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des données:", error);
        }
    }
}

// Initialiser le gestionnaire de tableau de bord
document.addEventListener('DOMContentLoaded', () => {
    console.log("📱 DOM chargé, initialisation du DashboardManager");
    const dashboardManager = new DashboardManager();
    dashboardManager.initialize();
});

function updateStats() {
    // Simuler des statistiques dynamiques (à remplacer par des données réelles)
    const stats = {
        sessions: Math.floor(Math.random() * 20) + 5,
        calories: Math.floor(Math.random() * 3000) + 1000,
        duration: `${Math.floor(Math.random() * 12) + 4}h${Math.floor(Math.random() * 60)}`
    };

    document.querySelector('.stat-number.sessions').textContent = stats.sessions;
    document.querySelector('.stat-number.calories').textContent = stats.calories;
    document.querySelector('.stat-number.duration').textContent = stats.duration;
}

function updateProgress() {
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-card p');
    
    // Simuler une progression (à remplacer par des données réelles)
    const current = 6;
    const target = 10;
    const percentage = (current / target) * 100;
    
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${current}kg / ${target}kg`;
}

function loadUpcomingSessions() {
    const sessionsList = document.querySelector('.sessions-list');
    // Exemple de séances (à remplacer par des données réelles)
    const sessions = [
        { date: '15', month: 'Mai', title: 'Séance Full Body', time: '10:00 - 11:30' },
        { date: '17', month: 'Mai', title: 'Cardio Intensif', time: '14:00 - 15:00' },
        { date: '20', month: 'Mai', title: 'Yoga Flow', time: '09:00 - 10:00' }
    ];

    sessionsList.innerHTML = sessions.map(session => `
        <div class="session-card">
            <div class="session-date">
                <span class="day">${session.date}</span>
                <span class="month">${session.month}</span>
            </div>
            <div class="session-info">
                <h3>${session.title}</h3>
                <p>${session.time}</p>
            </div>
            <div class="session-actions">
                <button class="btn-modifier">Modifier</button>
                <button class="btn-annuler">Annuler</button>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Gérer les clics sur les boutons Modifier
    document.querySelectorAll('.btn-modifier').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sessionCard = e.target.closest('.session-card');
            const sessionTitle = sessionCard.querySelector('.session-info h3').textContent;
            alert(`Modification de la séance : ${sessionTitle}`);
        });
    });

    // Gérer les clics sur les boutons Annuler
    document.querySelectorAll('.btn-annuler').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sessionCard = e.target.closest('.session-card');
            if (confirm('Êtes-vous sûr de vouloir annuler cette séance ?')) {
                sessionCard.remove();
            }
        });
    });
} 