// Animation au défilement
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionne tous les éléments avec la classe fade-in
    const fadeElems = document.querySelectorAll('.fade-in');
    
    // Configuration de l'Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // Déclenche l'animation quand 10% de l'élément est visible
    });

    // Observe chaque élément fade-in
    fadeElems.forEach(elem => observer.observe(elem));
});

// Navigation fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Ajuste pour le header fixe
                behavior: 'smooth'
            });
        }
    });
});

// Header dynamique
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Ajoute/retire la classe 'scrolled' pour le style du header
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Cache/montre le header selon la direction du scroll
    if (currentScroll > lastScroll && currentScroll > 80) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Animation des prix au survol
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('popular')) {
            this.style.transform = 'translateY(-10px)';
        }
    });

    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('popular')) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// FAQ Accordéon
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('h3');
    const answer = item.querySelector('p');

    // Cache initialement toutes les réponses sauf la première
    if (!item.classList.contains('active')) {
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
    }

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Ferme tous les autres éléments
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('p');
                otherAnswer.style.maxHeight = '0';
                otherAnswer.style.opacity = '0';
            }
        });

        // Bascule l'état actif
        item.classList.toggle('active');
        
        if (!isActive) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.opacity = '1';
        } else {
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
        }
    });
});

// Validation du formulaire de contact
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupère les valeurs des champs
        const formData = new FormData(this);
        
        // Simule l'envoi du formulaire
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';
        
        // Simule une requête API
        setTimeout(() => {
            submitButton.textContent = 'Message envoyé !';
            submitButton.style.backgroundColor = '#28a745';
            
            // Réinitialise le formulaire
            this.reset();
            
            // Restaure le bouton après 3 secondes
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.style.backgroundColor = '';
            }, 3000);
        }, 1500);
    });
}

// Animation des compteurs pour les statistiques (si présents)
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Observer pour les statistiques
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const countElements = entry.target.querySelectorAll('.count-up');
            countElements.forEach(element => {
                const endValue = parseInt(element.getAttribute('data-count'));
                animateValue(element, 0, endValue, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe les sections de statistiques si elles existent
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
} 