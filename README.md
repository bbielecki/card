# Wizytówka dr. Łukasza Wilgockiego

Statyczne MVP w Astro + TypeScript + SCSS. Jedna strona z sekcjami, interaktywnym hero na desktopie, mobilną nawigacją i podstroną RODO.

Na wszystkich ekranach przewijanie zmniejsza i przygasza zdjęcie, pozostawiając je w tle menu odsłanianego gradientem. Pinezka otwiera menu na pierwszej zakładce: Kontakt i gabinet. Menu zawiera sześć zakładek. Zdjęcie na desktopie zajmuje 75% szerokości układu. Powrót na górę przywraca pełne zdjęcie. Bez JavaScript pinezka prowadzi bezpośrednio do kontaktu.

Po dotarciu do górnej krawędzi menu z logo ŁW+ zastępuje nagłówek i pozostaje widoczne podczas dalszego przewijania.

## Uruchomienie

Etap 5: jedyna lokalizacja to Centrum Medyczne Kalinowska — Legionowo, ul. Jana III Sobieskiego 43, 05-120 Legionowo. Dane edytuje się w `src/content/locations.json`. Sekcja nie zawiera mapy Google, odnośnika do mapy ani godzin przyjęć. Kontakt i adres są dostępne we wspólnej sekcji „Kontakt i gabinet”.

Kontakt po etapie 4: pole `phone` w `src/content/site.json` zawiera numer rejestracji do gabinetu (539 381 744), a `email` służy do zgłoszeń na konsultacje online. Numer jest zwykłym odnośnikiem telefonicznym, bez przycisku „Zadzwoń”. Przyciski „Napisz wiadomość” w sekcji kontaktu, podglądzie menu i mobilnym pasku kierują na skonfigurowany adres e-mail. Instagram nie jest wyświetlany.

Adres kontaktowy do testów jest ustawiony w `src/content/site.json`, w polu `email`: `bartlomiejbielecki1@gmail.com`. Komponenty kontaktu pobierają go z tego jednego miejsca. Przed publikacją należy zastąpić go docelowym adresem klienta i ponownie zbudować stronę. Link `mailto:` otwiera program pocztowy użytkownika; aplikacja nie wysyła wiadomości samodzielnie.

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

Po potwierdzeniu treści ustaw `isDraft: false`. Domyślna domena w konfiguracji to `https://drlukaszwilgocki.pl`; `SITE_URL` pozwala ją nadpisać. W trybie roboczym indeksowanie jest wyłączone przez `noindex`, a sitemap pozostaje pusta. DNS ani publiczny hosting nie zostały skonfigurowane w ramach lokalnego MVP. Zakres SEO i kroki publikacji: [docs/10-seo.md](docs/10-seo.md).

Dokumenty: [kierunek UI](docs/03-ux-ui.md), [przekazanie](docs/07-handover.md), [utrzymanie](docs/08-maintenance.md), [raport QA](docs/09-qa-report.md).
