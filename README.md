# Wizytówka dr. Łukasza Wilgockiego

Statyczne MVP w Astro + TypeScript + SCSS. Jedna strona z sekcjami, interaktywnym hero na desktopie, mobilną nawigacją i podstroną RODO.

## Uruchomienie

Node.js >=22.19.0 (zalecany zgodny LTS).

```sh
npm ci
npm run dev
```

Podgląd: http://127.0.0.1:4321. Serwer działa w tle.

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
npm run check
npm run build
npm run preview
```

## Edycja

Treści znajdują się w `src/content/*.json`, a RODO w `src/content/rodo.md`. Szczegółowa mapa edycji i deploymentu: [docs/07-handover.md](docs/07-handover.md).

Zdjęcia umieść w `src/assets/photos/`, a ich nazwy ustaw w `hero.portrait` i `hero.background` w `site.json`. Komponent Photo generuje responsywne WebP. Bez zdjęć wyświetlają się oznaczone grafiki zastępcze.

Puste pola telefonu, e-maila, Instagrama i map nie generują pozornie działających linków. Strona jest wersją roboczą: `isDraft: true`. Lista danych wymagających potwierdzenia: [docs/01-scope.md](docs/01-scope.md).

## Testy

Przy uruchomionym serwerze:

```sh
npm run test:e2e
```

Playwright używa domyślnie Edge w trybie headless. Można ustawić `PLAYWRIGHT_CHANNEL=chromium` po `npx playwright install chromium`. Zmienna `PLAYWRIGHT_BASE_URL` pozwala testować inny adres, również podgląd produkcyjnego `dist`.

Testy obejmują 360/390/430/768/1024/1440 px, brak przewijania poziomego, axe WCAG AA, panel i klawiaturę, mobile, działanie bez JS, ograniczenie animacji, kotwice, RODO, metadane i 404. Zrzuty 390 i 1440 px zapisują się w ignorowanym `test-results/`.

## Hosting

Netlify: gotowy `netlify.toml`, output `dist`. Cloudflare Pages: build `npm run check && npm run build`, output `dist`. Bez adaptera i przekierowania SPA.

Po potwierdzeniu treści ustaw `isDraft: false` i zmienną `SITE_URL` na finalny adres HTTPS. Bez domeny lub w trybie roboczym indeksowanie jest wyłączone. Żadna domena ani publiczny hosting nie zostały skonfigurowane w ramach lokalnego MVP.

Dokumenty: [kierunek UI](docs/03-ux-ui.md), [przekazanie](docs/07-handover.md), [utrzymanie](docs/08-maintenance.md), [raport QA](docs/09-qa-report.md).
