// ===============================================
// GEOMETRICAL PATTERN BACKGROUND ANIMATION
// Professional Cyan Color Theme
// ===============================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let shapes = [];
let shapeCount;
let animationId;

// Color palette for geometric shapes
const colors = {
    primary: 'rgba(0, 188, 212, ',
    accent: 'rgba(0, 229, 255, ',
    light: 'rgba(77, 208, 225, ',
    grid: 'rgba(0, 188, 212, 0.04)'
};

// Resize canvas with debouncing
let resizeTimeout;
function resizeCanvas() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Adjust shape count based on screen size - optimized for performance
        shapeCount = Math.min(Math.floor((canvas.width * canvas.height) / 25000), 50);
        initShapes();
    }, 100);
}

// Shape class for geometrical patterns
class GeometricShape {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 35 + 15;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.008;
        this.opacity = Math.random() * 0.25 + 0.08;
        this.type = Math.floor(Math.random() * 4); // 0: hexagon, 1: square, 2: triangle, 3: circle
        this.colorType = Math.floor(Math.random() * 3);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Wrap around edges for seamless movement
        if (this.x < -this.size * 2) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size * 2) this.x = -this.size;
        if (this.y < -this.size * 2) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size * 2) this.y = -this.size;
    }

    getColor() {
        const colorKeys = ['primary', 'accent', 'light'];
        return colors[colorKeys[this.colorType]] + this.opacity + ')';
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = this.getColor();
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        if (this.type === 0) {
            // Hexagon
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = this.size * Math.cos(angle);
                const y = this.size * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        } else if (this.type === 1) {
            // Square
            const half = this.size / 2;
            ctx.rect(-half, -half, this.size, this.size);
        } else if (this.type === 2) {
            // Triangle
            const half = this.size / 2;
            ctx.moveTo(0, -half);
            ctx.lineTo(half, half);
            ctx.lineTo(-half, half);
            ctx.closePath();
        } else {
            // Circle
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        }

        ctx.stroke();
        ctx.restore();
    }
}

// Initialize shapes
function initShapes() {
    shapes = [];
    for (let i = 0; i < shapeCount; i++) {
        shapes.push(new GeometricShape());
    }
}

// Draw grid pattern
function drawGrid() {
    const gridSize = 60;
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Animation loop with performance optimization
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid
    drawGrid();

    // Update and draw shapes
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].update();
        shapes[i].draw();
    }

    animationId = requestAnimationFrame(animate);
}

// Handle visibility change to pause animation when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animate();
    }
});

// Resize event with passive listener
window.addEventListener('resize', resizeCanvas, { passive: true });

// Initialize
resizeCanvas();
animate();

// ===============================================
// MOBILE MENU TOGGLE
// ===============================================
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        if (mainNav.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            document.body.style.overflow = '';
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            document.body.style.overflow = '';
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ===============================================
// ACTIVE MENU HIGHLIGHTING ON SCROLL
// ===============================================
const sections = document.querySelectorAll('section');
const allNavLinks = document.querySelectorAll('.nav-link');

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

const handleScroll = throttle(() => {
    let current = '';
    const scrollPos = window.scrollY + 120;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });

// ===============================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// Enhanced with easing for professional feel
// ===============================================
function smoothScrollTo(targetId) {
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;
    
    const headerOffset = 90;
    const elementPosition = targetSection.getBoundingClientRect().top;
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
        smoothScrollTo(targetId);
    });
});

// ===============================================
// SCROLL TO TOP BUTTON
// ===============================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    // Show/hide button on scroll with throttle
    const handleScrollToTop = throttle(() => {
        if (window.scrollY > 400) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScrollToTop, { passive: true });

    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// Professional staggered animations
// ===============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay for cards
            const delay = entry.target.dataset.delay || 0;
            entry.target.style.animationDelay = `${delay * 0.1}s`;
            entry.target.style.animation = 'fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with staggered delays
document.querySelectorAll('.skill-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.dataset.delay = index;
    fadeInObserver.observe(el);
});

document.querySelectorAll('.project-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.dataset.delay = index;
    fadeInObserver.observe(el);
});

document.querySelectorAll('.about-content, .contact-content').forEach(el => {
    el.style.opacity = '0';
    fadeInObserver.observe(el);
});

// ===============================================
// CURRENT YEAR IN FOOTER
// ===============================================
const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ===============================================
// HEADER SCROLL EFFECT
// ===============================================
const header = document.querySelector('.site-header');

const handleHeaderScroll = throttle(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 100);

window.addEventListener('scroll', handleHeaderScroll, { passive: true });

// ===============================================
// PROJECT IMAGE ERROR HANDLING
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    const projectImages = document.querySelectorAll('.project-thumbnail');
    
    projectImages.forEach(img => {
        // Handle image loading errors
        img.addEventListener('error', function() {
            // Hide the image on error using CSS class
            this.classList.add('hidden');
            // Show the placeholder emoji using CSS class
            const placeholder = this.nextElementSibling;
            if (placeholder && placeholder.classList.contains('project-placeholder')) {
                placeholder.classList.add('visible');
            }
        });
    });
});