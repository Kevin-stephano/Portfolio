/* =============================================
   KEVIN STEPHANO PORTFOLIO — JavaScript
   ============================================= */

// === Cursor Glow Effect ===
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    }
});

// === Particle Background ===
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrame;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() > 0.5 ? 270 : 190; // Purple or Cyan
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const opacity = (1 - dist / 150) * 0.12;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    animationFrame = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// === Navbar Scroll Effect ===
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section, .hero');

window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// === Mobile Navigation ===
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// Close mobile nav when clicking a link
navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
    });
});

// === Typewriter Effect ===
const typewriterTexts = [
    'Développeur Web',
    'Monteur Vidéo',
    'Créateur de Jeux',
    'Passionné d\'IA',
    'Étudiant ISPM'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterDelay = 100;
const typewriterElement = document.getElementById('typewriterText');

function typewrite() {
    const currentText = typewriterTexts[textIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typewriterDelay = 50;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typewriterDelay = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        typewriterDelay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typewriterTexts.length;
        typewriterDelay = 500;
    }

    setTimeout(typewrite, typewriterDelay);
}

typewrite();

// === Scroll Animations (Intersection Observer) ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

// === Counter Animation ===
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (target - start) * easeOut);
            counter.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// Trigger counter when hero stats become visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// === Video Player Controls ===
function toggleVideo(videoId, overlayId) {
    const video = document.getElementById(videoId);
    const overlay = document.getElementById(overlayId);
    const progressBar = document.getElementById('progress-' + videoId.split('-')[1]);

    if (video.paused) {
        // Pause all other videos first
        document.querySelectorAll('video').forEach(v => {
            if (v.id !== videoId) {
                v.pause();
                const otherOverlayId = 'overlay-' + v.id.split('-')[1];
                const otherOverlay = document.getElementById(otherOverlayId);
                if (otherOverlay) otherOverlay.classList.remove('hidden');
            }
        });

        video.play();
        overlay.classList.add('hidden');

        // Update progress bar
        video.addEventListener('timeupdate', function updateProgress() {
            if (progressBar && video.duration) {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = progress + '%';
            }
        });
    } else {
        video.pause();
        overlay.classList.remove('hidden');
    }
}

// Click video wrapper to toggle play
document.querySelectorAll('.video-wrapper video').forEach(video => {
    video.addEventListener('click', () => {
        const num = video.id.split('-')[1];
        toggleVideo(video.id, 'overlay-' + num);
    });

    // Show overlay when video ends
    video.addEventListener('ended', () => {
        const num = video.id.split('-')[1];
        const overlay = document.getElementById('overlay-' + num);
        if (overlay) overlay.classList.remove('hidden');
        const progressBar = document.getElementById('progress-' + num);
        if (progressBar) progressBar.style.width = '0%';
    });
});

// === Video Duration Display ===
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('loadedmetadata', () => {
        const num = video.id.split('-')[1];
        const durationEl = document.getElementById('duration-' + num);
        if (durationEl && video.duration) {
            const mins = Math.floor(video.duration / 60);
            const secs = Math.floor(video.duration % 60);
            durationEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    });
});

// === Contact Form ===
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('.btn-submit');
        const originalContent = btn.innerHTML;

        btn.innerHTML = `
            <span>Message envoyé !</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// === Smooth Scroll for Anchor Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === Parallax effect on hero image ===
const heroImage = document.querySelector('.hero-image-wrapper');
if (heroImage) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// === Keyboard accessibility for video controls ===
document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });
});

console.log('%c Portfolio Kevin Stephano %c Loaded Successfully ', 
    'background: #7c3aed; color: white; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #06b6d4; color: white; padding: 4px 8px; border-radius: 0 4px 4px 0;'
);
