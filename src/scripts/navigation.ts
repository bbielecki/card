export {};

const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#main-navigation');
if (toggle && navigation) {
  document.documentElement.classList.add('has-js');
  toggle.hidden = false;
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    navigation.classList.toggle('is-open', expanded);
  });
  navigation.addEventListener('click', event => {
    if ((event.target as Element).closest('a')) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!(event.target as Element).closest('.site-header')) close();
  });
  document.addEventListener('focusin', event => {
    if (!(event.target as Element).closest('.site-header')) close();
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', close);
}
