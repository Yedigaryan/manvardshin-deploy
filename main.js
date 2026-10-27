document.documentElement.classList.add('js');

// Solid top bar once the hero is scrolled past
const topbar = document.querySelector('.topbar');
const onScroll = () => topbar.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.6);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const toggle = document.querySelector('.nav__toggle');
const list = document.getElementById('nav-list');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  list.classList.toggle('is-open', open);
  if (open) topbar.classList.add('is-solid'); else onScroll();
});
list.addEventListener('click', (e) => {
  if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); list.classList.remove('is-open'); onScroll(); }
});

// Reveal sections as they scroll in
const targets = document.querySelectorAll('.section-head, .about__body, .service, .tile, .contact__info, .form');
targets.forEach((el) => el.classList.add('on-scroll'));
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...el.parentElement.children];
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
    el.classList.add('is-in');
    io.unobserve(el);
  });
}, { threshold: 0.15 });
targets.forEach((el) => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

// Contact form: Formspree when configured, mailto fallback until then
const form = document.querySelector('.form');
const status = form.querySelector('.form__status');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  if (data.get('_gotcha')) return;

  if (form.action.includes('YOUR_FORM_ID')) {
    const body = `Անուն: ${data.get('name')}\nԿապ: ${data.get('contact')}\n\n${data.get('message')}`;
    window.location.href = `mailto:Manvardshin@gmail.com?subject=${encodeURIComponent('Հարցում կայքից')}&body=${encodeURIComponent(body)}`;
    return;
  }

  status.textContent = 'Ուղարկվում է...';
  try {
    const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(res.statusText);
    form.reset();
    status.textContent = 'Շնորհակալություն, մենք շուտով կկապվենք ձեզ հետ։';
  } catch {
    status.textContent = 'Չհաջողվեց ուղարկել։ Զանգահարեք +374 93 121243։';
  }
});
