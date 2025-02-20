import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword,
    updateProfile,
    PhoneAuthProvider,
    RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { 
    collection,
    doc, 
    setDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

export const sendPhoneVerification = async (phoneNumber) => {
    try {
        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
            phoneNumber, 
            window.recaptchaVerifier
        );
        return { success: true, verificationId };
    } catch (error) {
        console.error("Erreur d'envoi du code:", error);
        return { success: false, error: error.message };
    }
};

export const verifyPhoneCode = async (verificationId, code) => {
    try {
        const credential = PhoneAuthProvider.credential(verificationId, code);
        await auth.currentUser.linkWithCredential(credential);
        return { success: true };
    } catch (error) {
        console.error("Erreur de vérification:", error);
        return { success: false, error: error.message };
    }
};

export const handleSignUp = async (formData) => {
    try {
        console.log("Données reçues:", formData);
        
        // 1. Créer l'utilisateur dans Authentication
        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            formData.email, 
            formData.password
        );
        const user = userCredential.user;
        console.log("Utilisateur créé dans Auth:", user.uid);

        // 2. Mettre à jour le profil
        await updateProfile(user, {
            displayName: `${formData.firstName} ${formData.lastName}`
        });
        console.log("Profil mis à jour");

        // 3. Sauvegarder dans Firestore
        try {
            const userDocRef = doc(db, "user", user.uid);
            const userData = {
                uid: user.uid,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                postalCode: formData.postalCode,
                email: formData.email,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                phoneVerified: false
            };

            await setDoc(userDocRef, userData);
            console.log("Données sauvegardées dans Firestore");

            // Stocker le numéro de téléphone pour la vérification
            sessionStorage.setItem('phoneToVerify', formData.phone);
            
            return { success: true, redirect: './verify-phone.html' };
        } catch (firestoreError) {
            console.error("Erreur Firestore:", firestoreError);
            // Même si Firestore échoue, on continue avec la vérification du téléphone
            sessionStorage.setItem('phoneToVerify', formData.phone);
            return { success: true, redirect: './verify-phone.html' };
        }
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        return { 
            success: false, 
            error: error.code === 'auth/email-already-in-use' 
                ? "Cette adresse email est déjà utilisée."
                : "Une erreur est survenue lors de l'inscription."
        };
    }
}; 