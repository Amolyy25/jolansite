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

    // Animation des compteurs statistiques
    const statsSection = document.querySelector('.stats-section');
    let hasAnimated = false;

    function animateValue(element, start, end, duration) {
        if (hasAnimated) return;
        
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

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                const countElements = document.querySelectorAll('.count-up');
                countElements.forEach(element => {
                    const endValue = parseInt(element.getAttribute('data-count'));
                    animateValue(element, 0, endValue, 2000);
                });
                hasAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }
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

// Nouveau carrousel de témoignages
class TestimonialsSlider {
    constructor() {
        this.slider = document.querySelector('.testimonials-slider');
        this.slides = document.querySelectorAll('.testimonial-card');
        if (this.slides.length <= 1) return;

        this.currentSlide = 0;
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.addNavigation();
        this.addIndicators();
        this.showSlide(0);
        this.startAutoSlide();
    }

    addNavigation() {
        const nav = document.createElement('div');
        nav.className = 'testimonials-nav';
        
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.className = 'nav-btn prev';
        prevBtn.addEventListener('click', () => this.prevSlide());

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.className = 'nav-btn next';
        nextBtn.addEventListener('click', () => this.nextSlide());

        nav.appendChild(prevBtn);
        nav.appendChild(nextBtn);
        this.slider.parentElement.appendChild(nav);
    }

    addIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'testimonials-indicators';
        
        for(let i = 0; i < this.slides.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'indicator';
            dot.addEventListener('click', () => this.goToSlide(i));
            indicators.appendChild(dot);
        }
        
        this.slider.parentElement.appendChild(indicators);
        this.indicators = indicators.children;
    }

    showSlide(index) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.transform = `translateX(-${index * 100}%)`;
        });

        this.slides[index].classList.add('active');
        
        Array.from(this.indicators).forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.showSlide(this.currentSlide);
    }

    startAutoSlide() {
        setInterval(() => {
            if (!document.hidden) {
                this.nextSlide();
            }
        }, 5000);
    }
}

// Initialise le carrousel de témoignages
new TestimonialsSlider();

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Animation du bouton
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';
        
        // Simule l'envoi du formulaire
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

// Animation des qualifications au survol
document.querySelectorAll('.qualification-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Navigation fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Effet parallaxe pour la section stats
window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        statsSection.style.backgroundPosition = `center ${rate}px`;
    }
});