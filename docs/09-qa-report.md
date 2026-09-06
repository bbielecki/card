# Raport QA — 2026-09-06

**Status: ready — lokalne MVP do oceny. Publikacja finalna: not ready — oczekiwanie na materiały i potwierdzenie treści.**

## Wyniki

| Sprawdzenie | Wynik |
| --- | --- |
| `npm run check` | 0 błędów, 0 ostrzeżeń, 0 uwag |
| `npm run build` | Poprawna statyczna kompilacja strony głównej, RODO, 404, robots i sitemap |
| Playwright, podgląd deweloperski | 11/11 testów zaliczonych |
| Playwright, produkcyjne `dist` na porcie 4322 | 11/11 testów zaliczonych |
| 360, 390, 430, 768, 1024, 1440 px | Sekcje widoczne, bez poziomego przewijania |
| axe WCAG 2 A/AA i 2.1 AA | Brak automatycznie wykrytych naruszeń na badanych szerokościach, w ośmiu zakładkach i na RODO |
| Hero | Zakładki, strzałki, Home/End, Escape, zamknięcie przyciskiem i tłem, powrót fokusu oraz przejście do sekcji działają |
| Mobile | Menu, Escape, kotwice, dolny pasek, przejście z otwartego panelu desktopowego działają |
| Bez JavaScriptu | Treść i nawigacja dostępne, skróty przewijają do sekcji |
| Reduced motion | Brak animacji panelu i przejść portretu |
| Linki i metadane | Jeden H1, język polski, title/description/OG, poprawne kotwice, brak pustych tel/mailto, RODO i 404 działają |
| Materiały SEO | Favicon SVG, lokalna grafika OG PNG, robots i sitemap dostępne; noindex wersji roboczej |
| Przegląd wizualny | Sprawdzone zrzuty desktop i mobile oraz pierwsze ekrany 1440 i 390 px |

Środowisko: Windows, Node 22.17.0, Edge/Chromium headless. Zależność `undici` wymaga Node >=22.19.0; pomimo ostrzeżenia instalacyjnego lokalne kontrole i testy przeszły. Projekt deklaruje >=22.19.0, a konfiguracja Netlify wybiera 22.22.0.

## Poprawione podczas weryfikacji

- Brak typów Node w konfiguracji TypeScript.
- Kolizja globalnej nazwy `navigation` z przeglądarkowym API; skrypty są modułami.
- Konfiguracja adresu podglądu: skrypt startuje w tle na 127.0.0.1.
- Pasek deweloperski Astro zakłócał selektory H1/Menu w testach; wyłączono go w podglądzie.
- Uspójniono odstępy liter w hero i usunięto materiały startowego szablonu Astro.

## Pozostałe kwestie

- **Major / przed publikacją:** zdjęcia, bio, zakres usług, kontakt, adresy i mapy wymagają uzupełnienia oraz potwierdzenia. Są jawnie oznaczone jako robocze. Nie testowano połączeń z rzeczywistym telefonem, skrzynką ani gabinetem, ponieważ danych nie dostarczono.
- **Major / przed publikacją:** RODO to oznaczony dokument w przygotowaniu. Konieczne dopasowanie do rzeczywistego administratora i hostingu.
- **Major / przed publikacją:** domena i hosting nie zostały skonfigurowane. `SITE_URL` jest nieustawiony, a indeksowanie wyłączone. Wariant opublikowany należy ponownie sprawdzić po konfiguracji.
- **Minor / dalsze QA:** nie wykonano testów na fizycznym telefonie, w Safari ani Firefox. Automatyczna kontrola axe nie zastępuje pełnego audytu dostępności.
- **Minor / wydajność:** nie wykonano Lighthouse. Nie deklarujemy wyników punktowych. HTML strony głównej ma około 35 kB, CSS około 21 kB przed kompresją; fonty są lokalne, interakcje to małe skrypty TypeScript bez frameworka klienckiego. Ostateczny pomiar należy powtórzyć z prawdziwymi zdjęciami i na docelowym hostingu.

Testy znajdują się w `tests/site.spec.ts`; zrzuty generują się w ignorowanym `test-results/`.

## Zmienione obszary

- `src/pages/`, `src/layouts/Layout.astro`: strona i statyczne podstrony/metadane.
- `src/components/common/`, `sections/`, `interactive/`: renderowanie treści i panel hero.
- `src/content/`: robocze, edytowalne JSON i Markdown.
- `src/scripts/`, `src/styles/`: interakcje, dostępność, responsywny SCSS.
- `src/assets/`, `public/`: miejsca na zdjęcia, grafika OG, favicon; usunięte grafiki startera.
- `package.json`, `package-lock.json`, `tsconfig.json`, `astro.config.mjs`, `playwright.config.ts`, `tests/`: zależności i walidacja.
- `netlify.toml`, `.env.example`, `.gitignore`, `README.md`, `docs/`: konfiguracja i dokumentacja.

Źródłowe dokumenty klienta w `ai/` pozostawiono bez zmian.
