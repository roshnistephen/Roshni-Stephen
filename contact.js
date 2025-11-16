// ===============================================
// CONTACT FORM HANDLING
// ===============================================
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

if (contactForm && formMsg) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = e.target.name.value.trim();
        const email = e.target.email.value.trim();
        const message = e.target.message.value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Create mailto link
        const subject = encodeURIComponent(`Message from ${name}`);
        const body = encodeURIComponent(`${message}\n\n---\nFrom: ${name}\nEmail: ${email}`);
        const mailtoLink = `mailto:roshni@example.com?subject=${subject}&body=${body}`;
        
        // Show success message
        showMessage('Opening your email client...', 'success');
        
        // Open mailto link
        setTimeout(() => {
            window.location.href = mailtoLink;
            
            // Clear form after short delay
            setTimeout(() => {
                contactForm.reset();
                showMessage('Thank you for reaching out! Your message has been prepared.', 'success');
            }, 1000);
        }, 500);
    });
    
    // Show message function
    function showMessage(text, type) {
        formMsg.textContent = text;
        formMsg.className = `form-message ${type}`;
        formMsg.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMsg.style.display = 'none';
        }, 5000);
    }
    
    // Clear message on input
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (formMsg.style.display === 'block') {
                formMsg.style.display = 'none';
            }
        });
    });
}