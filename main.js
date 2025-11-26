// ===============================================
// OPTIMIZED GEOMETRICAL PATTERN BACKGROUND
// ===============================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let shapes = [];
let shapeCount;
let animationId;
let resizeTimeout;
const CONFIG = { density: 25000, maxShapes: 50 };
const colors = ['rgba(0,188,212,', 'rgba(0,229,255,', 'rgba(77,208,225,'];

function resizeCanvas() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        shapeCount = Math.min(Math.floor((canvas.width * canvas.height) / CONFIG.density), CONFIG.maxShapes);
        initShapes();
    }, 100);
}

class Shape {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 35 + 15;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.008;
        this.opacity = Math.random() * 0.25 + 0.08;
        this.type = Math.floor(Math.random() * 4);
        this.colorIdx = Math.floor(Math.random() * 3);
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        const s2 = this.size * 2;
        if (this.x < -s2) this.x = canvas.width + this.size;
        if (this.x > canvas.width + s2) this.x = -this.size;
        if (this.y < -s2) this.y = canvas.height + this.size;
        if (this.y > canvas.height + s2) this.y = -this.size;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = colors[this.colorIdx] + this.opacity + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const h = this.size / 2;
        if (this.type === 0) {
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI / 3) * i, x = this.size * Math.cos(a), y = this.size * Math.sin(a);
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();
        } else if (this.type === 1) ctx.rect(-h, -h, this.size, this.size);
        else if (this.type === 2) { ctx.moveTo(0, -h); ctx.lineTo(h, h); ctx.lineTo(-h, h); ctx.closePath(); }
        else ctx.arc(0, 0, h, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

function initShapes() { shapes = Array.from({ length: shapeCount }, () => new Shape()); }

function drawGrid() {
    ctx.strokeStyle = 'rgba(0,188,212,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    shapes.forEach(s => { s.update(); s.draw(); });
    animationId = requestAnimationFrame(animate);
}

document.addEventListener('visibilitychange', () => document.hidden ? cancelAnimationFrame(animationId) : animate());
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();
animate();

// ===============================================
// MOBILE MENU & NAVIGATION
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
        const spans = navToggle.querySelectorAll('span');
        mainNav.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        spans[0].style.transform = open ? 'rotate(45deg) translate(6px, 6px)' : '';
        spans[1].style.opacity = open ? '0' : '1';
        spans[2].style.transform = open ? 'rotate(-45deg) translate(6px, -6px)' : '';
    };
    navToggle.addEventListener('click', () => toggleMenu(!mainNav.classList.contains('open')));
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('keydown', e => e.key === 'Escape' && mainNav.classList.contains('open') && toggleMenu(false));
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

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const id = a.getAttribute('href');
        if (id === '#') return;
        const el = document.querySelector(id);
        if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' });
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