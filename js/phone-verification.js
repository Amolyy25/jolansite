import { auth, db } from './firebase-config.js';
import { 
    PhoneAuthProvider,
    RecaptchaVerifier,
    updatePhoneNumber
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { 
    doc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const phoneInput = document.querySelector('#phone');
    const sendCodeBtn = document.querySelector('#sendCode');
    const verificationCodeDiv = document.querySelector('.verification-code');
    const verifyCodeBtn = document.querySelector('#verifyCode');
    
    // Récupérer le numéro de téléphone stocké
    let phoneNumber = sessionStorage.getItem('phoneToVerify');
    if (!phoneNumber) {
        window.location.href = './inscription.html';
        return;
    }
    
    // Formater le numéro de téléphone au format international
    function formatPhoneNumber(phone) {
        // Supprimer tous les caractères non numériques
        phone = phone.replace(/\D/g, '');
        
        // Si le numéro commence par '0', le remplacer par '+33'
        if (phone.startsWith('0')) {
            phone = '+33' + phone.substring(1);
        }
        // Si le numéro ne commence pas par '+', ajouter '+33'
        else if (!phone.startsWith('+')) {
            phone = '+33' + phone;
        }
        
        return phone;
    }

    phoneNumber = formatPhoneNumber(phoneNumber);
    phoneInput.value = phoneNumber;

    // Initialiser reCAPTCHA
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': () => {
            sendCodeBtn.disabled = false;
        },
        'expired-callback': () => {
            sendCodeBtn.disabled = true;
            alert('Le reCAPTCHA a expiré. Veuillez réessayer.');
        }
    });

    let verificationId = null;

    // Envoi du code
    sendCodeBtn.addEventListener('click', async () => {
        try {
            sendCodeBtn.disabled = true;
            sendCodeBtn.textContent = 'Envoi en cours...';

            const phoneProvider = new PhoneAuthProvider(auth);
            verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                window.recaptchaVerifier
            );

            verificationCodeDiv.style.display = 'block';
            sendCodeBtn.textContent = 'Code envoyé';
            console.log('Code envoyé avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du code:', error);
            alert('Erreur lors de l\'envoi du code: ' + 
                  (error.code === 'auth/invalid-phone-number' ? 
                   'Format du numéro invalide. Utilisez le format: +33612345678' : 
                   error.message));
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = 'Renvoyer le code';
        }
    });

    // Vérification du code
    verifyCodeBtn.addEventListener('click', async () => {
        const code = document.querySelector('#verificationCode').value;
        if (!code) {
            alert('Veuillez entrer le code reçu');
            return;
        }

        try {
            verifyCodeBtn.disabled = true;
            verifyCodeBtn.textContent = 'Vérification...';

            const credential = PhoneAuthProvider.credential(verificationId, code);
            await updatePhoneNumber(auth.currentUser, credential);

            // Mettre à jour Firestore
            const userRef = doc(db, "user", auth.currentUser.uid);
            await updateDoc(userRef, {
                phoneVerified: true,
                updatedAt: new Date()
            });

            alert('Numéro de téléphone vérifié avec succès!');
            sessionStorage.removeItem('phoneToVerify');
            window.location.href = './dashboard.html';
        } catch (error) {
            console.error('Erreur de vérification:', error);
            alert('Code incorrect ou expiré. Veuillez réessayer.');
            verifyCodeBtn.disabled = false;
            verifyCodeBtn.textContent = 'Vérifier';
        }
    });
});