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

    // Système de filtrage des programmes
    const filterBtns = document.querySelectorAll('.filter-btn');
    const programmeCards = document.querySelectorAll('.programme-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retire la classe active de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Ajoute la classe active au bouton cliqué
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            programmeCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';

                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
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

// Animation des boutons CTA
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const x = e.clientX - e.target.offsetLeft;
        const y = e.clientY - e.target.offsetTop;

        const ripple = document.createElement('span');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
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

// Animation des images avant/après
const beforeAfterContainers = document.querySelectorAll('.before-after');

beforeAfterContainers.forEach(container => {
    const images = container.querySelectorAll('img');
    
    container.addEventListener('mouseenter', () => {
        images.forEach(img => {
            img.style.transform = 'scale(1.1)';
        });
    });

    container.addEventListener('mouseleave', () => {
        images.forEach(img => {
            img.style.transform = 'scale(1)';
        });
    });
});

// Lazy loading des images
const images = document.querySelectorAll('img[data-src]');
const imageOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px 50px 0px'
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
}, imageOptions);

images.forEach(img => imageObserver.observe(img));