export {};

const hero = document.querySelector<HTMLElement>(".hero");
const panel = document.querySelector<HTMLElement>("#hero-panel");

if (hero && panel) {
  const root = document.documentElement;
  const tabs = [...panel.querySelectorAll<HTMLButtonElement>("[data-panel-tab]")];
  const contents = [...panel.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
  const header = document.querySelector<HTMLElement>(".site-header");
  const main = hero.querySelector<HTMLElement>(".hero-main")!;
  const menuBar = panel.querySelector<HTMLElement>(".hero-menu-bar")!;
  let focusMenu = false;
  let framePending = false;

  const select = (id: string, focus = false) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.panelTab === id;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) {
        tab.focus({ preventScroll: true });
        const list = tab.parentElement!;
        list.scrollLeft = tab.offsetLeft - list.offsetLeft - 12;
      }
    });
    contents.forEach((content) => {
      content.hidden = content.id !== "panel-" + id;
    });
    if (root.classList.contains("menu-docked") && panel.getBoundingClientRect().top < 0) {
      const { start, distance, headerHeight } = geometry();
      window.scrollTo({ top: start + distance + headerHeight, behavior: "instant" });
    }
  };

  const geometry = () => {
    const headerHeight = header?.getBoundingClientRect().height ?? 88;
    const sceneHeight = Math.max(620, window.innerHeight - headerHeight);
    const start = hero.getBoundingClientRect().top + window.scrollY - headerHeight;
    return { sceneHeight, start, headerHeight, distance: sceneHeight * 0.85 };
  };

  const update = () => {
    const { sceneHeight, start, distance, headerHeight } = geometry();
    const progress = Math.max(0, Math.min(1, (window.scrollY - start) / distance));
    const headerShift = Math.max(0, Math.min(headerHeight, window.scrollY - start - distance));
    root.style.setProperty("--hero-header-shift", headerShift + "px");
    const docked = headerShift >= headerHeight - 1;
    root.classList.toggle("menu-docked", docked);
    if (header) header.inert = docked;
    root.style.setProperty(
      "--hero-header-height",
      (header?.getBoundingClientRect().height ?? 88) + "px"
    );
    hero.style.setProperty("--hero-scene-height", sceneHeight + "px");
    hero.style.setProperty("--hero-progress", String(progress));
    panel.hidden = progress <= 0.002;
    if (!panel.hidden) hero.style.setProperty("--hero-menu-height", menuBar.offsetHeight + "px");
    main.inert = progress >= 0.99;
    hero.classList.toggle("is-menu-revealed", !panel.hidden);
    root.classList.toggle("hero-revealed", !panel.hidden);
    if (progress >= 0.99 && focusMenu) {
      focusMenu = false;
      panel
        .querySelector<HTMLButtonElement>('[aria-selected="true"]')
        ?.focus({ preventScroll: true });
    }
  };

  hero.classList.add("is-enhanced");
  root.classList.add("has-interactive-hero");
  update();
  hero.querySelector<HTMLAnchorElement>("[data-hero-menu]")?.addEventListener("click", (event) => {
    event.preventDefault();
    const { start, distance, headerHeight } = geometry();
    focusMenu = true;
    window.scrollTo({
      top: start + distance + headerHeight + 1,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab.dataset.panelTab!));
    tab.addEventListener("keydown", (event) => {
      let next: number;
      switch (event.key) {
        case "ArrowRight":
          next = (index + 1) % tabs.length;
          break;
        case "ArrowLeft":
          next = (index - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = tabs.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      select(tabs[next].dataset.panelTab!, true);
    });
  });

  panel.querySelectorAll<HTMLAnchorElement>("[data-panel-link]").forEach((link) =>
    link.addEventListener("click", () => {
      if (link.hash) {
        const section = document.getElementById(link.hash.slice(1));
        section?.setAttribute("tabindex", "-1");
        section?.focus({ preventScroll: true });
        section?.addEventListener("blur", () => section.removeAttribute("tabindex"), {
          once: true,
        });
      }
    })
  );

  window.addEventListener(
    "scroll",
    () => {
      if (!framePending) {
        framePending = true;
        requestAnimationFrame(() => {
          framePending = false;
          update();
        });
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  window.addEventListener("pageshow", update);
}
