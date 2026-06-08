/* ============================
   ElectroMelilla - Main JS
   ============================ */

// PARTICLES
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        const colors = ['rgba(0, 180, 216, 0.5)', 'rgba(0, 229, 160, 0.3)', 'rgba(212, 168, 83, 0.3)'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
    }
}
createParticles();

// NAVBAR SCROLL
const navbar = document.getElementById('navbar');
let lastScroll = 0;

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.style.background = 'rgba(10, 14, 26, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = 'none';
        }

        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// MOBILE MENU
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
    });
}

if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
}

document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) mobileMenu.classList.remove('open');
    });
});

// SCROLL REVEAL
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', () => {
    revealOnScroll();
    // Load projects preview if on homepage
    if (document.getElementById('projectsPreviewGrid')) {
        renderProjectsPreview('projectsPreviewGrid');
    }
    // Load full projects if on projects page
    if (document.getElementById('projectsFullGrid')) {
        renderProjects('projectsFullGrid');
        renderFilterButtons();
    }
});

// COUNTER ANIMATION
function animateCounters() {
    const counters = document.querySelectorAll('.counter-value');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            counter.textContent = current + (target === 98 ? '%' : '+');
            if (progress < 1) requestAnimationFrame(updateCounter);
        }
        requestAnimationFrame(updateCounter);
    });
}

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateCounters, 500);
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);

// Also animate counters on about/services pages that have them
document.querySelectorAll('.counter-value').forEach(c => {
    const parentSection = c.closest('section');
    if (parentSection && !heroSection) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    obs.disconnect();
                }
            });
        }, { threshold: 0.3 });
        obs.observe(parentSection);
    }
});

// LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');

function attachLightboxHandlers() {
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
        card.onclick = () => {
            const img = card.getAttribute('data-img');
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            if (lightboxImg) lightboxImg.src = img;
            if (lightboxImg) lightboxImg.alt = title;
            if (lightboxTitle) lightboxTitle.textContent = title;
            if (lightboxDesc) lightboxDesc.textContent = desc;
            if (lightbox) {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };
    });
}
attachLightboxHandlers();

function closeLightbox(e) {
    if (e && e.target !== lightbox && !e.target.closest('button')) return;
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// SMOOTH SCROLL for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// PARALLAX HERO (only vertical, no horizontal shift)
window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const scrolled = window.pageYOffset;
    const heroContent = hero.querySelector('.relative.z-10');
    if (heroContent && scrolled < window.innerHeight) {
        // Only translateY, never translateX to prevent any shift
        heroContent.style.transform = `translateY(${scrolled * 0.2}px) translateX(0)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
        // Ensure it stays centered
        heroContent.style.marginLeft = 'auto';
        heroContent.style.marginRight = 'auto';
    }
});

// GLOBAL ALIGNMENT FIX: Ensure all major containers are centered on page load
window.addEventListener('load', () => {
    document.querySelectorAll('section, header, footer').forEach(el => {
        el.style.marginLeft = 'auto';
        el.style.marginRight = 'auto';
    });
});

// PROJECT FILTERS
function renderFilterButtons() {
    const container = document.getElementById('filterButtons');
    if (!container) return;
    const categories = getCategories();
    container.innerHTML = categories.map((cat, i) => 
        `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${cat}">${cat}</button>`
    ).join('');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            renderProjects('projectsFullGrid', filter);
        });
    });
}

// CONTACT FORM (WhatsApp redirect)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        const text = `Hola, soy ${name}. ${message} (Tel: ${phone}, Email: ${email})`;
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/34600000000?text=${encoded}`, '_blank');
    });
}

// Set current year in footer
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
