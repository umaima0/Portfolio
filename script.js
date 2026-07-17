document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ===================================================
     SCROLL REVEAL
  =================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ===================================================
      HUD NAV — active section + progress
  =================================================== */
  const sections = document.querySelectorAll('.section');
  const hudLinks = document.querySelectorAll('.hud-list a');
  const hudProgress = document.getElementById('hudProgress');

  // Using rootMargin and a smaller threshold fixes the "tall section" bug
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = document.querySelector(`.hud-list a[data-target="${entry.target.id}"]`);
      if (!link) return;
      
      if (entry.isIntersecting) {
        hudLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { 
    // This triggers when the section occupies the center 40% of the viewport
    rootMargin: "-30% 0px -30% 0px", 
    threshold: 0 
  });
  
  sections.forEach(s => sectionObserver.observe(s));

  function onScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const pct = Math.min(1, Math.max(0, scrollTop / docHeight));
    hudProgress.style.height = (pct * 100) + '%';
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  hudLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
  
  /* ===================================================
     PROJECT CARD TILT
  =================================================== */
  if (!reduceMotion){
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ry', (px * 4) + 'deg');
        card.style.setProperty('--rx', (py * -4) + 'deg');
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

});