const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const header = $('[data-header]');
const progressBar = $('[data-progress-bar]');
const navToggle = $('[data-nav-toggle]');
const nav = $('[data-nav]');
const backTop = $('[data-back-top]');
const year = $('[data-year]');
if (year) year.textContent = new Date().getFullYear();

function updatePageState(){
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 10);
  if (backTop) backTop.classList.toggle('is-visible', window.scrollY > 600);
}
window.addEventListener('scroll', updatePageState, { passive: true });
window.addEventListener('resize', updatePageState);
updatePageState();

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = $(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const disclosureToggle = $('[data-disclosure-toggle]');
const disclosureCopy = $('[data-disclosure-copy]');
if (disclosureToggle && disclosureCopy) {
  disclosureToggle.addEventListener('click', () => {
    const hidden = disclosureCopy.classList.toggle('is-hidden');
    disclosureToggle.setAttribute('aria-expanded', String(!hidden));
    const symbol = disclosureToggle.querySelector('b');
    if (symbol) symbol.textContent = hidden ? '+' : '−';
  });
}

$$('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (!item) return;
    const open = item.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
  });
});

const revealEls = $$('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

const tocLinks = $$('[data-toc] a');
const tocTargets = tocLinks.map((link) => $(link.getAttribute('href'))).filter(Boolean);
if (tocLinks.length && 'IntersectionObserver' in window) {
  const tocObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      tocLinks.forEach((link) => link.classList.remove('active'));
      const active = tocLinks.find((link) => link.getAttribute('href') === `#${entry.target.id}`);
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-38% 0px -52% 0px', threshold: 0.01 });
  tocTargets.forEach((target) => tocObserver.observe(target));
}
