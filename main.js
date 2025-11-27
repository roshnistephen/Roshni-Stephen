// ===============================================
// WEB TECHNOLOGY THEMED PARTICLE BACKGROUND
// Auto-animated network/code particles
// ===============================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let connections = [];
let animationId;
let resizeTimeout;
let backgroundGradient = null;

const CONFIG = {
    particleCount: 80,
    maxParticles: 120,
    connectionDistance: 150,
    particleSpeed: 0.8,
    mouseInfluence: 100,
    colors: {
        particles: ['#00bcd4', '#00e5ff', '#4dd0e1', '#80deea'],
        connections: 'rgba(0, 188, 212, 0.15)',
        glow: 'rgba(0, 229, 255, 0.3)'
    },
    codeFont: '12px monospace'
};

let mousePos = { x: -1000, y: -1000 };

function createBackgroundGradient() {
    backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    backgroundGradient.addColorStop(0, '#ffffff');
    backgroundGradient.addColorStop(1, '#e0f7fa');
}

function resizeCanvas() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const area = canvas.width * canvas.height;
        CONFIG.particleCount = Math.min(Math.floor(area / 15000), CONFIG.maxParticles);
        createBackgroundGradient();
        initParticles();
    }, 100);
}

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1.5;
        this.baseSize = this.size;
        
        // Random velocity with slight bias
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * CONFIG.particleSpeed + 0.2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        // Pulsing effect
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        
        // Color
        this.color = CONFIG.colors.particles[Math.floor(Math.random() * CONFIG.colors.particles.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
        
        // Type: 0 = circle, 1 = code bracket, 2 = dot, 3 = small ring
        this.type = Math.floor(Math.random() * 4);
    }
    
    update() {
        // Auto movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Pulsing
        this.pulse += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulse) * 0.5;
        
        // Boundary wrapping
        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;
        
        // Mouse interaction (subtle attraction)
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < CONFIG.mouseInfluence) {
            const force = (CONFIG.mouseInfluence - dist) / CONFIG.mouseInfluence * 0.02;
            this.vx += dx * force * 0.01;
            this.vy += dy * force * 0.01;
        }
        
        // Damping to prevent excessive speed
        const maxSpeed = 1.5;
        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentSpeed > maxSpeed) {
            this.vx = (this.vx / currentSpeed) * maxSpeed;
            this.vy = (this.vy / currentSpeed) * maxSpeed;
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        
        switch(this.type) {
            case 0: // Glowing circle
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                // Glow effect
                ctx.globalAlpha = this.opacity * 0.3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 1: // Code bracket < >
                ctx.font = CONFIG.codeFont;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('<>', this.x, this.y);
                break;
                
            case 2: // Small dot
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 3: // Ring
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
                ctx.stroke();
                break;
        }
        
        ctx.restore();
    }
}

function initParticles() {
    particles = Array.from({ length: CONFIG.particleCount }, () => new Particle());
}

function drawConnections() {
    ctx.strokeStyle = CONFIG.colors.connections;
    ctx.lineWidth = 1;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < CONFIG.connectionDistance) {
                const opacity = (1 - dist / CONFIG.connectionDistance) * 0.3;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;
}

function drawBackground() {
    // Subtle gradient background
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Subtle grid
    ctx.strokeStyle = 'rgba(0, 188, 212, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 80;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    
    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Draw connections
    drawConnections();
    
    animationId = requestAnimationFrame(animate);
}

// Mouse tracking for subtle interaction
canvas.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
});

canvas.addEventListener('mouseleave', () => {
    mousePos.x = -1000;
    mousePos.y = -1000;
});

// Visibility change handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animate();
    }
});

window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();
animate();

// ===============================================
// MENU & NAVIGATION (Desktop Fullscreen + Mobile)
// ===============================================
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

// Throttle function to limit execution frequency
const throttle = (fn, limit) => {
    let isThrottled = false;
    return function() {
        if (!isThrottled) {
            fn.apply(this, arguments);
            isThrottled = true;
            setTimeout(() => isThrottled = false, limit);
        }
    };
};

if (navToggle && mainNav) {
    const toggleMenu = (open) => {
        mainNav.classList.toggle('open', open);
        navToggle.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
        navToggle.setAttribute('aria-expanded', open);
    };
    
    navToggle.addEventListener('click', () => toggleMenu(!mainNav.classList.contains('open')));
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mainNav.classList.contains('open')) {
            toggleMenu(false);
        }
    });
    
    // Close menu when clicking outside (on the nav background)
    mainNav.addEventListener('click', (e) => {
        if (e.target === mainNav) {
            toggleMenu(false);
        }
    });
}

// Active menu on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const handleScroll = throttle(() => {
    const scrollPos = window.scrollY + 120;
    let current = '';
    sections.forEach(s => { if (scrollPos >= s.offsetTop && scrollPos < s.offsetTop + s.clientHeight) current = s.id; });
    navLinks.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === `#${current}`); });
}, 100);
window.addEventListener('scroll', handleScroll, { passive: true });

// Smooth scroll for all anchor links
function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    const headerOffset = 90;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        // Close mobile menu if open
        if (mainNav && mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            navToggle.setAttribute('aria-expanded', 'false');
        }
        
        smoothScrollTo(targetId);
    });
});

// Scroll to top
const scrollBtn = document.getElementById('scrollToTop');
if (scrollBtn) {
    const toggleScroll = throttle(() => scrollBtn.classList.toggle('visible', window.scrollY > 400), 100);
    window.addEventListener('scroll', toggleScroll, { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.animationDelay = `${(e.target.dataset.delay || 0) * 0.1}s`;
            e.target.style.animation = 'fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.skill-card').forEach((el, i) => { el.style.opacity = '0'; el.dataset.delay = i; observer.observe(el); });
document.querySelectorAll('.project-card').forEach((el, i) => { el.style.opacity = '0'; el.dataset.delay = i; observer.observe(el); });
document.querySelectorAll('.service-card').forEach((el, i) => { el.style.opacity = '0'; el.dataset.delay = i; observer.observe(el); });
document.querySelectorAll('.about-content, .contact-content').forEach(el => { el.style.opacity = '0'; observer.observe(el); });

// Footer year
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

// Header scroll effect
const header = document.querySelector('.site-header');
const headerScroll = throttle(() => header.classList.toggle('scrolled', window.pageYOffset > 50), 100);
window.addEventListener('scroll', headerScroll, { passive: true });

// Image error handling
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-thumbnail').forEach(img => {
        img.addEventListener('error', function() {
            this.classList.add('hidden');
            const ph = this.nextElementSibling;
            if (ph?.classList.contains('project-placeholder')) ph.classList.add('visible');
        });
    });
});