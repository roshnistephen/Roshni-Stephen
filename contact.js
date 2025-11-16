document.getElementById('contactForm').addEventListener('submit',e=>{
    e.preventDefault();
    const name=e.target.name.value;
    const email=e.target.email.value;
    const message=e.target.message.value;
    document.getElementById('formMsg').textContent="Message ready to be sent via mail client";
    window.location.href=`mailto:you@example.com?subject=Message from ${name}&body=${message}%0A%0AFrom: ${email}`;
    });