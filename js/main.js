// Light/Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  
  // Reload particles with new theme colors
  loadParticles();
});

// Function to load particles with theme-appropriate colors
function loadParticles() {
  const isDark = document.body.dataset.theme === 'dark';
  const particleColor = isDark ? '#ffffff' : '#2563eb';
  const linkColor = isDark ? '#ffffff' : '#3b82f6';
  
  tsParticles.load("tsparticles", {
    background: {
      color: "transparent"
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        resize: true
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 }
      }
    },
    particles: {
      color: { value: particleColor },
      links: { 
        color: linkColor, 
        distance: 150, 
        enable: true, 
        opacity: 0.5, 
        width: 1 
      },
      move: { 
        enable: true, 
        speed: 2, 
        direction: "none", 
        random: false, 
        straight: false, 
        outModes: { default: "out" } 
      },
      number: { value: 60, density: { enable: true, area: 800 } },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 5 } }
    },
    detectRetina: true
  });
}

// Smooth Scrolling (Bootstrap handles scroll-behavior in CSS)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Fade-in on Scroll
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// Initialize particles on page load
loadParticles();

// Contact form handling moved to js/contact.js
