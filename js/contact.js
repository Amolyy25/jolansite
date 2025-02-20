// Animation au défilement
document.addEventListener('DOMContentLoaded', function() {
    // Animation des éléments fade-in
    const fadeElems = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElems.forEach(elem => observer.observe(elem));

    // Validation et soumission du formulaire
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');

    // Fonction de validation d'email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Fonction de validation de téléphone français
    function isValidPhone(phone) {
        return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone);
    }

    // Validation en temps réel
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });

        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });

    function validateInput(input) {
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }

        let isValid = true;
        let message = '';

        switch(input.id) {
            case 'email':
                if (!isValidEmail(input.value)) {
                    isValid = false;
                    message = 'Veuillez entrer une adresse email valide';
                }
                break;
            case 'phone':
                if (!isValidPhone(input.value)) {
                    isValid = false;
                    message = 'Veuillez entrer un numéro de téléphone valide';
                }
                break;
            case 'name':
                if (input.value.length < 2) {
                    isValid = false;
                    message = 'Le nom doit contenir au moins 2 caractères';
                }
                break;
            case 'message':
                if (input.value.length < 10) {
                    isValid = false;
                    message = 'Le message doit contenir au moins 10 caractères';
                }
                break;
        }

        if (!isValid) {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = message;
            input.parentElement.appendChild(error);
            input.style.borderColor = 'var(--error-color)';
        } else {
            input.style.borderColor = 'var(--success-color)';
        }

        return isValid;
    }

    // Soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

            // Simulation d'envoi (à remplacer par votre logique d'envoi réelle)
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
                submitButton.style.backgroundColor = 'var(--success-color)';
                
                // Réinitialisation du formulaire
                form.reset();
                inputs.forEach(input => {
                    input.style.borderColor = 'var(--light-gray)';
                });

                // Restauration du bouton après 3 secondes
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                    submitButton.style.backgroundColor = '';
                }, 3000);
            }, 1500);
        }
    });
});

// FAQ Accordéon
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Ferme tous les items
        faqItems.forEach(faq => {
            faq.classList.remove('active');
            const answer = faq.querySelector('.faq-answer');
            answer.style.maxHeight = null;
        });

        // Si l'item n'était pas actif, l'ouvre
        if (!isActive) {
            item.classList.add('active');
            const answer = item.querySelector('.faq-answer');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// Header dynamique
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 80) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});
