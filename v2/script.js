// Shared JavaScript for all pages

// ==================
// MOBILE MENU
// ==================
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
    }

    if (closeMenuBtn && mobileMenu) {
        closeMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
    }

    revealOnScroll();
    initLightbox();
});

// ==================
// SCROLL REVEAL
// ==================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ==================
// LIGHTBOX (Portfolio)
// ==================
function initLightbox() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');

    if (!portfolioCards.length || !lightbox || !lightboxImg || !lightboxTitle || !lightboxDesc) {
        return;
    }

    portfolioCards.forEach((card) => {
        card.addEventListener('click', () => {
            const img = card.getAttribute('data-img') || '';
            const title = card.getAttribute('data-title') || '';
            const desc = card.getAttribute('data-desc') || '';

            lightboxImg.src = img;
            lightboxImg.alt = title;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
}

function closeLightbox(e) {
    const lightbox = document.getElementById('lightbox');
    const target = e ? e.target : null;
    const canCloseFromButton = target instanceof Element && target.closest('.close-btn');

    if (lightbox && (!e || target === lightbox || canCloseFromButton)) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

window.closeLightbox = closeLightbox;
