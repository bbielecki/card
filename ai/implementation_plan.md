Poniżej masz **plan implementacji dla agentów AI**. Możesz go wkleić praktycznie jako `IMPLEMENTATION_PLAN.md` / `AGENTS_PLAN.md` do repo i zlecać agentom etapami.

Zakładam stack:

```txt
Astro + TypeScript + SCSS
Hosting: Netlify albo Cloudflare Pages
Brak backendu w MVP
Treść: Markdown/JSON
Animacje: najpierw CSS/TS, GSAP tylko jeśli będzie potrzebny
```

# Plan implementacji strony dr Łukasza Wilgockiego

## Zasady wspólne dla wszystkich agentów

Każdy agent pracuje tylko w zakresie swojego etapu. Nie powinien przebudowywać całej aplikacji, zmieniać struktury bez potrzeby ani mieszać się w zadania innych agentów.

### Główne założenia projektu

Strona ma być nowoczesną, responsywną wizytówką fizjoterapeuty. Ma prezentować osobę Łukasza Wilgockiego, jego specjalizacje, miejsca przyjmowania, kontakt, telekonsultacje, wizyty domowe, współpracę oraz informacje RODO.

Strona ma działać jako statyczny landing page z lekką interakcją. Nie tworzymy backendu w pierwszej wersji. Formularz kontaktowy może być zrealizowany przez Netlify Forms, zewnętrzny formularz albo zwykłe linki `mailto:` i `tel:`.

### Priorytety techniczne

```txt
1. Mobile-first responsiveness
2. Szybkie ładowanie
3. Czytelny HTML i SEO
4. Dobre zdjęcia i układ wizualny
5. Proste, eleganckie animacje
6. Łatwość edycji treści
7. Możliwość rozwoju o backend/CMS później
```

### Zakaz dla agentów

Agenci nie powinni:

```txt
- dodawać ciężkiego SPA bez potrzeby
- używać Reacta/Next.js, jeśli Astro wystarcza
- hardcodować wszystkich tekstów w komponentach, jeśli można użyć danych
- dodawać backendu w MVP
- dodawać bibliotek animacyjnych bez uzasadnienia
- psuć dostępności przez animacje
- tworzyć formularza zbierającego dane osobowe bez sekcji RODO/polityki prywatności
- wrzucać prywatnych danych kontaktowych bez potwierdzenia
```

### Proponowana struktura repozytorium

```txt
/
  public/
    images/
      hero/
      services/
      locations/
      icons/
    favicon/
  src/
    components/
      common/
      sections/
      interactive/
    content/
      site.json
      services.json
      locations.json
      cooperation.json
      rodo.md
    layouts/
      BaseLayout.astro
    pages/
      index.astro
      rodo.astro
    scripts/
      heroPanel.ts
      navigation.ts
    styles/
      global.scss
      variables.scss
      mixins.scss
      typography.scss
      animations.scss
  astro.config.mjs
  package.json
  README.md
  IMPLEMENTATION_PLAN.md
```

---

# Etap 1 — Ustalenie zakresu i koncepcji

## Agent 1: Product Scope Agent

### Cel

Przygotować jasny zakres MVP, żeby późniejsze agenty nie musiały zgadywać, co ma znaleźć się na stronie.

### Wejście

Agent dostaje wymagania klienta:

```txt
- pierwsza strona prezentująca osobę
- zdjęcie główne + krótki opis
- tło/zdjęcie z pracy
- animacja cofania zdjęcia w tło
- wysuwane zakładki
- sekcje: Kontakt, Gdzie przyjmuję, Czym się zajmuję, Rehabilitacja, Telekonsultacja, Wizyta domowa, Współpraca, RODO
- wersja mobilna
- kolorystyka: granat + biały
- domena: drlukaszwilgocki.pl albo lukaszwilgocki.pl
```

### Zadania

1. Zdefiniuj cel strony.

```txt
Główny cel:
- zbudowanie profesjonalnego wizerunku
- ułatwienie kontaktu
- pokazanie zakresu usług
- pokazanie lokalizacji przyjęć
- umożliwienie kontaktu w sprawie telekonsultacji, wizyt domowych i współpracy
```

2. Zdefiniuj zakres MVP.

MVP zawiera:

```txt
- hero section
- o mnie
- czym się zajmuję
- rehabilitacja
- gdzie przyjmuję
- telekonsultacja
- wizyta domowa
- współpraca
- kontakt
- RODO/polityka prywatności
- mapa Google lub link do mapy
- wersja mobile
- podstawowe animacje
- SEO techniczne
- deployment
```

3. Zdefiniuj rzeczy poza MVP.

Poza MVP:

```txt
- rezerwacja wizyt online
- konto pacjenta
- płatności online
- blog
- panel administratora
- pełny CMS
- integracja z kalendarzem
- zaawansowany backend
```

4. Przygotuj listę danych potrzebnych od klienta.

```txt
- zdjęcie główne
- zdjęcia z pracy/gabinetu
- aktualny telefon
- aktualny e-mail
- aktualny Instagram
- miejsca przyjmowania
- adresy gabinetów
- zakres wizyt domowych
- zakres telekonsultacji
- opis usług
- treść RODO/polityki prywatności
- preferowana domena
```

### Wynik pracy

Agent tworzy plik:

```txt
docs/01-scope.md
```

Plik ma zawierać:

```txt
- cel strony
- zakres MVP
- poza zakresem
- lista sekcji
- lista danych potrzebnych od klienta
- założenia domeny
- główne CTA
```

### Kryteria akceptacji

Etap jest zakończony, gdy:

```txt
- wiadomo, co dokładnie powstaje w MVP
- wiadomo, czego nie robimy
- lista sekcji jest zamknięta
- lista brakujących materiałów od klienta jest jawna
```

---

# Etap 2 — Struktura treści i architektura strony

## Agent 2: Content Architecture Agent

### Cel

Przygotować logiczną strukturę strony i model danych pod treści, zanim powstaną komponenty.

### Zadania

1. Zaprojektuj strukturę strony jako landing page.

Proponowana kolejność:

```txt
1. Hero
2. O mnie
3. Czym się zajmuję
4. Rehabilitacja
5. Gdzie przyjmuję
6. Telekonsultacja
7. Wizyta domowa
8. Współpraca
9. Kontakt
10. RODO / Polityka prywatności
```

2. Zdefiniuj główne CTA.

Przykładowe CTA:

```txt
- Umów wizytę
- Zadzwoń
- Napisz wiadomość
- Sprawdź lokalizację
- Dowiedz się więcej
```

3. Zaprojektuj dane treści.

Utwórz pliki:

```txt
src/content/site.json
src/content/services.json
src/content/locations.json
src/content/cooperation.json
src/content/rodo.md
```

4. Przygotuj strukturę `site.json`.

```json
{
  "name": "dr Łukasz Wilgocki",
  "title": "Fizjoterapeuta",
  "subtitle": "Rehabilitacja ortopedyczna, fizjoterapia sportowa i diagnostyka funkcjonalna",
  "description": "Pomagam pacjentom wracać do sprawności po urazach, przeciążeniach i zabiegach ortopedycznych.",
  "phone": "",
  "email": "",
  "instagramUrl": "",
  "primaryCta": {
    "label": "Umów wizytę",
    "href": "#kontakt"
  }
}
```

5. Przygotuj strukturę `services.json`.

```json
[
  {
    "id": "rehabilitacja-ortopedyczna",
    "title": "Rehabilitacja ortopedyczna",
    "shortDescription": "Powrót do sprawności po urazach, przeciążeniach i zabiegach.",
    "description": "Opis do uzupełnienia przez klienta.",
    "image": "/images/services/rehabilitacja.jpg"
  }
]
```

6. Przygotuj strukturę `locations.json`.

```json
[
  {
    "id": "legionowo",
    "name": "Legionowo",
    "address": "Adres do potwierdzenia",
    "description": "Przyjęcia po wcześniejszej rejestracji.",
    "googleMapsUrl": "",
    "embedUrl": ""
  }
]
```

### Wynik pracy

Agent tworzy:

```txt
docs/02-content-architecture.md
src/content/site.json
src/content/services.json
src/content/locations.json
src/content/cooperation.json
src/content/rodo.md
```

### Kryteria akceptacji

Etap jest zakończony, gdy:

```txt
- wszystkie sekcje mają opis celu
- wszystkie dane treści mają swoje miejsce
- komponenty nie muszą hardcodować tekstów
- brakujące dane są oznaczone jako placeholdery
```

---

# Etap 3 — Projekt UX/UI

## Agent 3: UX/UI Design Agent

### Cel

Przygotować szczegółowy opis layoutu, zachowania strony i wersji mobilnej.

To nie musi być pełny projekt w Figmie, ale musi być na tyle konkretne, żeby agent implementujący front wiedział, co ma zbudować.

### Zadania

1. Zaprojektuj hero section.

Hero powinno zawierać:

```txt
- duże zdjęcie Łukasza
- krótki opis
- tytuł: dr Łukasz Wilgocki
- podtytuł: fizjoterapeuta
- CTA: Umów wizytę / Kontakt
- opcjonalne ikonki: lokalizacja, rehabilitacja, telekonsultacja, współpraca
```

2. Zaprojektuj interakcję hero.

Wymagane zachowanie desktop:

```txt
Stan domyślny:
- zdjęcie Łukasza jest głównym elementem
- w tle delikatne zdjęcie z pracy/gabinetu
- widoczne krótkie bio i CTA

Po kliknięciu elementu/pinezki/kafelka:
- zdjęcie główne lekko się cofa
- zdjęcie staje się półprzezroczyste
- tło lub panel wysuwa się na pierwszy plan
- pokazuje się zawartość wybranej zakładki
- użytkownik może zamknąć panel
```

3. Zaprojektuj interakcję paneli.

Panele:

```txt
- Kontakt
- Gdzie przyjmuję
- Czym się zajmuję
- Rehabilitacja
- Telekonsultacja
- Wizyta domowa
- Współpraca
- RODO
```

Każdy panel powinien mieć:

```txt
- tytuł
- krótki opis
- opcjonalne zdjęcie
- CTA
- zamknięcie
```

4. Zaprojektuj mobile UX.

Na mobile nie kopiować 1:1 desktopowej animacji.

Mobile powinien działać jako:

```txt
- klasyczny scroll landing page
- sticky CTA: Zadzwoń / Kontakt
- sekcje jedna pod drugą
- zakładki jako accordion albo bottom sheet
- bez agresywnych animacji
```

5. Zdefiniuj kolorystykę.

Kolory bazowe:

```scss
$color-navy: #0b1f3a;
$color-navy-light: #16385f;
$color-white: #ffffff;
$color-off-white: #f7f9fc;
$color-gray: #667085;
$color-accent: #6ea8fe;
```

6. Zdefiniuj typografię.

Założenie:

```txt
- font bezszeryfowy
- elegancki, medyczny, profesjonalny wygląd
- duże nagłówki
- dużo oddechu
- brak przeładowania treścią
```

Można użyć:

```txt
- Inter
- Manrope
- Plus Jakarta Sans
```

7. Zdefiniuj breakpointy.

```scss
$breakpoint-sm: 480px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

### Wynik pracy

Agent tworzy:

```txt
docs/03-ux-ui.md
```

Plik ma opisywać:

```txt
- layout desktop
- layout mobile
- zachowanie hero
- zachowanie paneli
- kolory
- typografię
- breakpointy
- zasady animacji
```

### Kryteria akceptacji

Etap jest zakończony, gdy:

```txt
- wiadomo, jak ma wyglądać pierwsza sekcja
- wiadomo, jak mają działać zakładki
- wiadomo, jak strona zachowuje się na mobile
- wiadomo, jakie komponenty trzeba zaimplementować
```

---

# Etap 4 — Setup techniczny

## Agent 4: Project Setup Agent

### Cel

Postawić czysty projekt Astro z gotową strukturą, stylingiem bazowym i pierwszym deploymentem.

### Zadania

1. Utwórz projekt Astro.

```bash
npm create astro@latest
```

Konfiguracja:

```txt
- TypeScript: yes
- minimal template
- install dependencies
```

2. Dodaj SCSS.

```bash
npm install sass
```

3. Utwórz strukturę folderów.

```txt
src/
  components/
    common/
    sections/
    interactive/
  content/
  layouts/
  pages/
  scripts/
  styles/
public/
  images/
    hero/
    services/
    locations/
    icons/
```

4. Utwórz podstawowe pliki stylów.

```txt
src/styles/variables.scss
src/styles/mixins.scss
src/styles/typography.scss
src/styles/animations.scss
src/styles/global.scss
```

5. Utwórz `BaseLayout.astro`.

Layout powinien zawierać:

```txt
- html lang="pl"
- meta charset
- viewport
- title
- description
- Open Graph placeholder
- global styles
- slot
```

6. Utwórz `index.astro`.

Na razie powinien renderować placeholdery:

```txt
- Hero
- O mnie
- Usługi
- Lokalizacje
- Kontakt
```

7. Dodaj podstawowy `package.json`.

Skrypty:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

8. Dodaj `.gitignore`.

```txt
node_modules
dist
.astro
.env
.DS_Store
```

9. Dodaj `README.md`.

README ma zawierać:

```txt
- jak uruchomić projekt
- jak budować projekt
- jak edytować treści
- jak wygląda deployment
```

10. Przygotuj deployment.

Dla Netlify:

```txt
Build command: npm run build
Publish directory: dist
```

Dla Cloudflare Pages:

```txt
Build command: npm run build
Output directory: dist
```

### Wynik pracy

Agent tworzy działający projekt Astro.

### Kryteria akceptacji

Etap jest zakończony, gdy:

```txt
- npm install działa
- npm run dev działa
- npm run build działa
- strona renderuje placeholdery
- struktura folderów jest gotowa
- style globalne są podpięte
```

---

# Etap 5 — Implementacja MVP

## Agent 5: Frontend Components Agent

### Cel

Zaimplementować komplet sekcji strony na podstawie przygotowanej architektury treści.

### Zadania

1. Utwórz komponenty wspólne.

```txt
src/components/common/Button.astro
src/components/common/Container.astro
src/components/common/SectionHeader.astro
src/components/common/IconLink.astro
src/components/common/Card.astro
```

2. Utwórz komponenty sekcji.

```txt
src/components/sections/HeroSection.astro
src/components/sections/AboutSection.astro
src/components/sections/ServicesSection.astro
src/components/sections/RehabilitationSection.astro
src/components/sections/LocationsSection.astro
src/components/sections/TeleconsultationSection.astro
src/components/sections/HomeVisitSection.astro
src/components/sections/CooperationSection.astro
src/components/sections/ContactSection.astro
src/components/sections/Footer.astro
```

3. Utwórz komponent interaktywnych paneli.

```txt
src/components/interactive/HeroInteractivePanel.astro
src/scripts/heroPanel.ts
```

Panel powinien obsługiwać:

```txt
- otwieranie panelu
- zamykanie panelu
- zmianę aktywnej zakładki
- Escape zamyka panel
- kliknięcie poza panelem zamyka panel
- aria-expanded
- aria-controls
```

4. Zaimplementuj hero.

Hero musi zawierać:

```txt
- imię i nazwisko
- tytuł zawodowy
- krótki opis
- główne zdjęcie
- zdjęcie tła
- CTA
- skróty do sekcji/paneli
```

5. Zaimplementuj sekcję „O mnie”.

Treść z placeholderem:

```txt
Dr Łukasz Wilgocki to fizjoterapeuta specjalizujący się w rehabilitacji ortopedycznej, fizjoterapii sportowej i diagnostyce funkcjonalnej narządu ruchu.
```

6. Zaimplementuj sekcję „Czym się zajmuję”.

Jako karty:

```txt
- Rehabilitacja ortopedyczna
- Fizjoterapia sportowa
- Diagnostyka funkcjonalna
- Terapia manualna i ćwiczenia
```

7. Zaimplementuj sekcję „Rehabilitacja”.

Układ:

```txt
1. Diagnostyka
2. Plan terapii
3. Terapia i ćwiczenia
4. Powrót do aktywności
```

Opcjonalnie 3 zdjęcia/karty.

8. Zaimplementuj sekcję „Gdzie przyjmuję”.

Musi zawierać:

```txt
- lista lokalizacji
- adres
- przycisk „Pokaż trasę”
- mapa Google iframe, jeśli embedUrl jest dostępny
- informacja o rejestracji
```

9. Zaimplementuj sekcję „Telekonsultacja”.

Musi zawierać:

```txt
- dla kogo
- jak wygląda
- kiedy ma sens
- CTA do kontaktu
```

10. Zaimplementuj sekcję „Wizyta domowa”.

Musi zawierać:

```txt
- dla kogo
- obszar dojazdu
- zasady umawiania
- CTA
```

11. Zaimplementuj sekcję „Współpraca”.

Musi zawierać:

```txt
- współpraca z klubami sportowymi
- współpraca z lekarzami
- współpraca szkoleniowa/edukacyjna
- CTA
```

12. Zaimplementuj kontakt.

Kontakt powinien zawierać:

```txt
- telefon
- e-mail
- Instagram
- adresy
- link do mapy
- przycisk tel:
- przycisk mailto:
```

13. Zaimplementuj RODO.

W MVP:

```txt
- osobna sekcja lub osobna podstrona /rodo
- placeholder do podmiany przez klienta/prawnika
- link w footerze
```

14. Dodaj responsywność.

Minimalne wymagania:

```txt
- poprawnie działa na 360px szerokości
- poprawnie działa na 768px
- poprawnie działa na 1024px+
- brak poziomego scrolla
- CTA są łatwe do kliknięcia
- mapa nie rozwala layoutu
```

### Wynik pracy

Agent dostarcza kompletną stronę MVP.

### Kryteria akceptacji

Etap jest zakończony, gdy:

```txt
- wszystkie sekcje są widoczne
- strona działa na desktopie i mobile
- dane są pobierane z plików content
- kontakt działa jako tel/mailto
- mapa działa lub jest bezpieczny fallback
- RODO jest dostępne z footera
- npm run build przechodzi
```

---

# Etap 6 — Animacje, dopracowanie i optymalizacja

## Agent 6: Animation & Polish Agent

### Cel

Dodać profesjonalne, ale lekkie animacje oraz dopracować stronę wizualnie i wydajnościowo.

### Zadania

1. Dopracuj animację hero.

Wymagane zachowanie:

```txt
Po otwarciu panelu:
- zdjęcie główne zmniejsza się, np. scale(0.92)
- opacity spada, np. do 0.35–0.55
- panel wjeżdża z boku lub dołu
- tło delikatnie się rozmywa lub przyciemnia
```

2. Dodaj klasy stanów.

Przykładowo:

```scss
.hero {
  &.is-panel-open {
    .hero__portrait {
      transform: scale(0.92);
      opacity: 0.45;
    }

    .hero__background {
      opacity: 1;
      transform: scale(1.02);
    }

    .hero__panel {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }
  }
}
```

3. Dodaj animacje wejścia sekcji.

Proste animacje:

```txt
- fade-in
- slide-up
- subtle scale
```

Zasada:

```txt
Animacje mają być subtelne, nie teatralne.
```

4. Obsłuż `prefers-reduced-motion`.

Jeżeli użytkownik ogranicza animacje w systemie, strona nie powinna odpalać mocnych przejść.

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

5. Dopracuj mobile.

Na mobile:

```txt
- panel nie powinien wjeżdżać jako skomplikowana warstwa
- użyj accordion/bottom sheet
- najważniejsze CTA mają być widoczne
- telefon i e-mail mają być łatwe do kliknięcia
```

6. Zoptymalizuj zdjęcia.

Zadania:

```txt
- używać formatów webp/avif, jeśli dostępne
- ustawić width/height
- dodać alt
- lazy loading dla zdjęć poniżej hero
- nie ładować ogromnych zdjęć 4000px na mobile
```

7. Dopracuj SEO.

Wymagane:

```txt
- title
- meta description
- Open Graph
- canonical URL
- sitemap.xml
- robots.txt
- sensowne nagłówki H1/H2/H3
```

8. Dopracuj dostępność.

Wymagane:

```txt
- jeden H1
- buttony jako buttony, linki jako linki
- aria-expanded dla paneli
- aria-label dla ikon
- focus visible
- panel zamykany klawiaturą
- kontrast tekstu
```

9. Sprawdź Lighthouse.

Cele:

```txt
Performance: 90+
Accessibility: 90+
Best Practices: 90+
SEO: 90+
```

### Wynik pracy

Agent dostarcza dopracowaną wersję wizualną i techniczną.

### Kryteria akceptacji

Etap jest zakończony, gdy:

```txt
- animacja hero działa płynnie
- mobile UX jest wygodny
- strona nie ma poziomego scrolla
- obrazy są zoptymalizowane
- Lighthouse nie pokazuje dużych problemów
- build przechodzi
```

---

# Etap 7 — Publikacja i przekazanie klientowi

## Agent 7: Deployment & Handover Agent

### Cel

Przygotować stronę do publikacji, skonfigurować hosting, domenę i dokumentację przekazania.

### Zadania

1. Przygotuj konfigurację deploymentu.

Dla Netlify utwórz:

```txt
netlify.toml
```

Przykład:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Uwaga: redirect SPA nie zawsze jest potrzebny, jeśli mamy statyczne podstrony Astro. Agent ma sprawdzić, czy `/rodo` działa jako osobna strona i nie dodać niepotrzebnego redirectu, który ukryje 404.

2. Przygotuj `robots.txt`.

```txt
User-agent: *
Allow: /

Sitemap: https://drlukaszwilgocki.pl/sitemap-index.xml
```

3. Przygotuj sitemapę.

Zainstaluj integrację, jeśli potrzebna:

```bash
npx astro add sitemap
```

4. Przygotuj konfigurację domeny.

Domena rekomendowana:

```txt
drlukaszwilgocki.pl
```

Alternatywa:

```txt
lukaszwilgocki.pl
```

DNS do ustawienia zależy od hostingu.

Dla Netlify zwykle:

```txt
- apex/root domain przez A records albo ALIAS/ANAME
- www przez CNAME
```

Dla Cloudflare Pages:

```txt
- CNAME do projektu Cloudflare Pages
- SSL/TLS ustawione w Cloudflare
```

5. Przygotuj checklistę przed publikacją.

```txt
- telefon działa
- mailto działa
- Instagram prowadzi do właściwego profilu
- mapa prowadzi do właściwego adresu
- RODO zaakceptowane przez klienta
- zdjęcia zaakceptowane przez klienta
- teksty zaakceptowane przez klienta
- mobile sprawdzony na realnym telefonie
- SEO title i description ustawione
- favicon działa
- domena działa z www i bez www
- SSL działa
```

6. Przygotuj dokument przekazania.

Utwórz:

```txt
docs/07-handover.md
```

Ma zawierać:

```txt
- gdzie jest repo
- gdzie jest hosting
- jak zrobić deploy
- gdzie edytować treści
- gdzie podmieniać zdjęcia
- jak zmienić numer telefonu
- jak zmienić lokalizację
- jak zmienić link do mapy
- jak dodać nową usługę
```

7. Przygotuj dokument utrzymania.

Utwórz:

```txt
docs/08-maintenance.md
```

Ma zawierać:

```txt
- jak aktualizować zależności
- jak odpalić stronę lokalnie
- jak sprawdzić build
- jak sprawdzić błędy po deploymentcie
- jak cofnąć deploy
```

### Wynik pracy

Agent dostarcza:

```txt
- działający deployment
- skonfigurowaną domenę albo instrukcję DNS
- dokument przekazania
- checklistę publikacji
```

### Kryteria akceptacji

Etap jest zakończony, gdy:

```txt
- strona działa publicznie
- SSL działa
- domena działa
- klient ma instrukcję obsługi
- repo jest uporządkowane
- deployment da się powtórzyć z repo
```

---

# Dodatkowy Agent 8 — QA Agent

Tego agenta warto uruchomić na końcu, niezależnie od etapów.

## Cel

Przejść po stronie jak tester i znaleźć błędy przed pokazaniem klientowi.

## Zadania

1. Test desktop.

Sprawdź:

```txt
- Chrome
- Edge
- Firefox
- szerokość 1440px
- szerokość 1280px
- szerokość 1024px
```

2. Test mobile.

Sprawdź:

```txt
- 360px
- 390px
- 430px
- 768px
```

3. Test interakcji.

Sprawdź:

```txt
- otwieranie paneli
- zamykanie paneli
- przełączanie zakładek
- Escape zamyka panel
- klik poza panelem zamyka panel
- linki kontaktowe działają
- mapa działa
```

4. Test treści.

Sprawdź:

```txt
- literówki
- zbyt długie linie tekstu
- błędne dane kontaktowe
- niespójne nazwy usług
- brakujące alty
- placeholdery pozostawione przypadkiem
```

5. Test SEO.

Sprawdź:

```txt
- H1 jest jeden
- meta title jest ustawiony
- meta description jest ustawione
- Open Graph działa
- favicon działa
- sitemap działa
- robots.txt działa
```

6. Test dostępności.

Sprawdź:

```txt
- nawigacja klawiaturą
- focus visible
- kontrast
- aria-label przy ikonach
- aria-expanded przy panelach
```

## Wynik pracy

Agent tworzy:

```txt
docs/09-qa-report.md
```

Raport ma zawierać:

```txt
- znalezione błędy
- poziom krytyczności
- rekomendowane poprawki
- status: ready / not ready
```

---

# Kolejność uruchamiania agentów

Najbezpieczniej:

```txt
1. Product Scope Agent
2. Content Architecture Agent
3. UX/UI Design Agent
4. Project Setup Agent
5. Frontend Components Agent
6. Animation & Polish Agent
7. QA Agent
8. Deployment & Handover Agent
```

Nie uruchamiaj równolegle agentów 4, 5 i 6 na tych samych plikach, bo będą sobie nadpisywać komponenty i style.

Równolegle można uruchomić:

```txt
- Agent 1 i Agent 2 częściowo razem
- Agent 3 po wstępnej strukturze treści
- Agent 7 może wcześniej przygotować dokumentację deploymentu
- Agent 8 tylko po implementacji
```

---

# Minimalne Definition of Done dla całego projektu

Projekt można uznać za skończony, kiedy:

```txt
- strona ma wszystkie ustalone sekcje
- działa dobrze na mobile i desktopie
- dane kontaktowe są poprawne
- zdjęcia są zoptymalizowane
- animacje są płynne i nie przeszkadzają
- użytkownik może łatwo zadzwonić, napisać lub sprawdzić lokalizację
- RODO/polityka prywatności jest dostępna
- build przechodzi bez błędów
- strona działa pod domeną
- klient zaakceptował finalny wygląd
```

---

# Najważniejsza rada organizacyjna

Nie zaczynaj od animacji. Najpierw każ agentom zrobić:

```txt
1. strukturę,
2. treści,
3. prosty layout,
4. mobile,
5. dopiero potem efekt hero.
```

W tym projekcie największe ryzyko nie jest techniczne. Największe ryzyko to rozjazd oczekiwań klienta: „chciałem coś jak na Behance, ale trochę inaczej”. Dlatego etap UX/UI i akceptacja kierunku wizualnego są ważniejsze niż sam wybór biblioteki.
