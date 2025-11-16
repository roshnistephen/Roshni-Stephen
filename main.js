// Mobile menu
document.getElementById('nav-toggle').addEventListener('click',()=>{
    document.getElementById('main-nav').classList.toggle('open');
    });
    
    
    // Highlight active menu while scrolling
    const sections=document.querySelectorAll('section');
    const navLinks=document.querySelectorAll('.nav-link');
    
    
    window.addEventListener('scroll',()=>{
    let current="";
    sections.forEach(sec=>{
    const top=sec.offsetTop-200;
    if(scrollY>=top) current=sec.getAttribute('id');
    });
    navLinks.forEach(a=>{
    a.classList.remove('active');
    if(a.getAttribute('href')==`#${current}`) a.classList.add('active');
    });
    });
    
    
    // Year
    document.getElementById('year').textContent=new Date().getFullYear();