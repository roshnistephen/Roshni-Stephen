// ===============================================
// CONTACT FORM HANDLING - FormSubmit Integration
// ===============================================
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

if (contactForm && formMsg) {
    contactForm.addEventListener('submit', async (e) => {
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
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send via FormSubmit (free email service)
            const response = await fetch('https://formsubmit.co/ajax/roshnistephen4@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: `Portfolio Contact: Message from ${name}`
                })
            });
            
            const data = await response.json();
            
            if (data.success === 'true' || response.ok) {
                showMessage('Thank you! Your message has been sent successfully. 🎉', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            // Fallback to mailto if API fails
            const subject = encodeURIComponent(`Portfolio Contact: Message from ${name}`);
            const body = encodeURIComponent(`${message}\n\n---\nFrom: ${name}\nEmail: ${email}`);
            window.location.href = `mailto:roshnistephen4@gmail.com?subject=${subject}&body=${body}`;
            showMessage('Opening your email client as backup...', 'success');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
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