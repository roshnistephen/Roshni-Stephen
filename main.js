// ===============================================
// GEOMETRICAL PATTERN BACKGROUND ANIMATION
// ===============================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let shapes = [];
let shapeCount;

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Adjust shape count based on screen size
    shapeCount = Math.floor((canvas.width * canvas.height) / 20000);
    initShapes();
}

// Shape class for geometrical patterns
class GeometricShape {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 20;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.type = Math.floor(Math.random() * 3); // 0: hexagon, 1: square, 2: triangle
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Bounce off edges
        if (this.x < -this.size || this.x > canvas.width + this.size) this.vx = -this.vx;
        if (this.y < -this.size || this.y > canvas.height + this.size) this.vy = -this.vy;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(124, 58, 237, ${this.opacity})`;
        ctx.lineWidth = 2;
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
            ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
            // Triangle
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.closePath();
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
    const gridSize = 50;
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.05)';
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

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid
    drawGrid();

    // Update and draw shapes
    shapes.forEach(shape => {
        shape.update();
        shape.draw();
    });

    requestAnimationFrame(animate);
}

// Resize event
window.addEventListener('resize', resizeCanvas);

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
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        if (mainNav.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
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
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ===============================================
// ACTIVE MENU HIGHLIGHTING ON SCROLL
// ===============================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===============================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ===============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===============================================
// SCROLL TO TOP BUTTON
// ===============================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

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
// ===============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
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
let lastScroll = 0;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

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