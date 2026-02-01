// Basic UI interactions: mobile nav, form handling, small animations
document.addEventListener('DOMContentLoaded', function() {
  // year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // add small parallax tilt effect for hero visual on mousemove
  const visual = document.querySelector('.card-visual');
  if (visual) {
    visual.addEventListener('mousemove', function(e){
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      visual.style.transform = `translateZ(0) rotateX(${y * 4}deg) rotateY(${x * 8}deg)`;
      const layers = visual.querySelectorAll('.card-layer');
      layers.forEach((layer, i) => {
        const depth = (i+1) * 6;
        layer.style.transform = `translate(${(i+1)*6}px, ${(i+1)*6}px) rotate(${(i-1)*2}deg) translate3d(${ -x * depth }px, ${ -y * depth }px, 0)`;
      });
    });
    visual.addEventListener('mouseleave', function(){
      visual.style.transform = '';
      visual.querySelectorAll('.card-layer').forEach((layer,i) => {
        layer.style.transform = '';
      });
    });
  }

  // Contact form (client-side only)
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = fd.get('name').trim();
      const email = fd.get('email').trim();
      const message = fd.get('message').trim();

      if (!name || !email || !message) {
        formMsg.textContent = 'Please complete all fields.';
        return;
      }
      // simple email check
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        formMsg.textContent = 'Please enter a valid email address.';
        return;
      }

      // Simulate submit (no backend). Replace this with fetch() to your endpoint.
      formMsg.textContent = 'Sending…';
      setTimeout(() => {
        formMsg.textContent = 'Thanks — your message has been received. We will contact you soon.';
        contactForm.reset();
      }, 900);
    });
  }

  // Subscribe form (client-side)
  const subscribeForm = document.querySelector('.subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = subscribeForm.querySelector('input').value.trim();
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      // simulate
      alert('Thanks for subscribing!');
      subscribeForm.reset();
    });
  }
});
