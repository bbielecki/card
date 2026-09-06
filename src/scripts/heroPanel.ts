export {};

const hero = document.querySelector<HTMLElement>('.hero');
const panel = document.querySelector<HTMLElement>('#hero-panel');
const pin = document.querySelector<HTMLButtonElement>('[data-hero-reveal]');

if (hero && panel && pin) {
  const root = document.documentElement;
  const tabs = [...panel.querySelectorAll<HTMLButtonElement>('[data-panel-tab]')];
  const contents = [...panel.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
  const header = document.querySelector<HTMLElement>('.site-header');
  let open = false;
  let dismissed = false;
  let navigationRevealed = false;
  let framePending = false;
  let previousY = window.scrollY;

  const select = (id: string, focus = false) => {
    tabs.forEach(tab => {
      const active = tab.dataset.panelTab === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus({ preventScroll: true });
    });
    contents.forEach(content => { content.hidden = content.id !== 'panel-' + id; });
  };

  const updateNavigation = () => {
    root.classList.toggle('hero-revealed', navigationRevealed || open || window.scrollY > 24);
  };

  const reveal = (fromPin = false) => {
    if (open) return;
    open = true;
    navigationRevealed = true;
    panel.hidden = false;
    hero.classList.add('is-panel-open');
    pin.setAttribute('aria-expanded', 'true');
    updateNavigation();
    // Scroll reveals content without moving the user's keyboard focus.
    if (fromPin) panel.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus({ preventScroll: true });
  };

  const close = (restoreFocus = false, suppressReopen = true) => {
    if (!open) return;
    open = false;
    dismissed = suppressReopen;
    panel.hidden = true;
    hero.classList.remove('is-panel-open');
    pin.setAttribute('aria-expanded', 'false');
    updateNavigation();
    if (restoreFocus) pin.focus({ preventScroll: true });
  };

  const onScroll = () => {
    framePending = false;
    const y = window.scrollY;
    const movingDown = y > previousY;
    const returningToTop = y <= 12 && previousY > 12;
    previousY = y;
    const bounds = hero.getBoundingClientRect();
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const threshold = Math.min(96, window.innerHeight * .12);
    if (y <= 12) {
      dismissed = false;
      // Focusing the sticky header can scroll to the top; keep its menu usable.
      if (returningToTop && !header?.contains(document.activeElement)) {
        navigationRevealed = false;
        close(false, false);
      }
    }
    // Only reveal in the introductory scene, never while reading lower sections.
    const inScene = bounds.bottom > window.innerHeight * .65 && bounds.top < headerHeight;
    if (inScene && movingDown && y >= threshold && !dismissed) reveal();
    if (bounds.bottom <= headerHeight) close(false);
    updateNavigation();
  };

  hero.classList.add('is-enhanced');
  root.classList.add('has-interactive-hero');
  pin.hidden = false;
  const hint = hero.querySelector<HTMLElement>('.hero-scroll-hint');
  if (hint) hint.hidden = false;
  updateNavigation();

  pin.addEventListener('click', () => {
    if (open) close(true);
    else { dismissed = false; reveal(true); }
  });
  panel.querySelector('[data-panel-close]')?.addEventListener('click', () => close(true));

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.panelTab!));
    tab.addEventListener('keydown', event => {
      let next: number;
      switch (event.key) {
        case 'ArrowRight': next = (index + 1) % tabs.length; break;
        case 'ArrowLeft': next = (index - 1 + tabs.length) % tabs.length; break;
        case 'Home': next = 0; break;
        case 'End': next = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      select(tabs[next].dataset.panelTab!, true);
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open && !event.defaultPrevented) close(true);
  });
  document.addEventListener('click', event => {
    const target = event.target as Element;
    if (open && !panel.contains(target) && !pin.contains(target)) close(false);
  });
  panel.querySelectorAll<HTMLAnchorElement>('[data-panel-link]').forEach(link => link.addEventListener('click', () => {
    close(false);
    if (link.hash) {
      const section = document.getElementById(link.hash.slice(1));
      section?.setAttribute('tabindex', '-1');
      section?.focus({ preventScroll: true });
      section?.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
    }
  }));

  window.addEventListener('scroll', () => {
    if (!framePending) { framePending = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  window.addEventListener('pageshow', updateNavigation);
}
