# AGENTS.md — Base Prompt dla agentów AI

## 1. Kontekst projektu

Budujemy nowoczesną, lekką stronę wizytówkę dla fizjoterapeuty: **dr Łukasza Wilgockiego**.

Strona ma prezentować jego osobę, kompetencje, zakres usług, lokalizacje przyjęć, telekonsultacje, wizyty domowe, współpracę oraz dane kontaktowe. Projekt ma wyglądać profesjonalnie, nowocześnie i medycznie, ale bez przesadnej „aplikacyjności”.

To nie jest duża aplikacja webowa. To ma być szybka, responsywna, statyczna strona z kilkoma przemyślanymi interakcjami.

Docelowy charakter strony:

- elegancka wizytówka personalna,
- landing page dla pacjentów,
- dobra prezentacja na mobile,
- szybki kontakt: telefon, e-mail, lokalizacja, Instagram,
- możliwość późniejszego rozwoju o CMS, formularz, backend albo rezerwacje.

---

## 2. Stack technologiczny

Preferowany stack:

```txt
Astro
TypeScript
SCSS
HTML/CSS/JavaScript
Netlify albo Cloudflare Pages
```

Nie używaj Reacta, Next.js, Vue ani innych cięższych frameworków, jeśli nie ma wyraźnej potrzeby.

Nie buduj klasycznego SPA, jeśli statyczny landing page z lekką interakcją wystarcza.

---

## 3. Główne wymagania funkcjonalne

Strona powinna zawierać następujące sekcje:

1. Hero / pierwsza sekcja
2. O mnie
3. Czym się zajmuję
4. Rehabilitacja
5. Gdzie przyjmuję
6. Telekonsultacja
7. Wizyta domowa
8. Współpraca
9. Kontakt
10. RODO / Polityka prywatności

### Hero

Hero ma być najważniejszą częścią strony.

Powinno zawierać:

- imię i nazwisko,
- tytuł zawodowy,
- krótkie bio,
- zdjęcie główne Łukasza,
- zdjęcie tła / zdjęcie z pracy,
- CTA: „Umów wizytę”, „Kontakt”, „Zadzwoń”,
- skróty do najważniejszych sekcji.

### Interakcja hero

Na desktopie można zastosować efekt:

- użytkownik klika ikonę, pinezkę, kartę albo zakładkę,
- zdjęcie główne delikatnie cofa się w tło,
- zdjęcie staje się półprzezroczyste,
- na pierwszy plan wysuwa się panel z treścią,
- panel można zamknąć,
- użytkownik może przełączać zakładki.

Na mobile nie kopiuj tej animacji 1:1. Na mobile UX ma być prostszy:

- sekcje jedna pod drugą,
- accordion,
- bottom sheet,
- proste CTA,
- bez ciężkich animacji.

---

## 4. Priorytety projektu

Priorytety są następujące:

```txt
1. Czytelność i profesjonalny wygląd
2. Bardzo dobra wersja mobilna
3. Szybkość ładowania
4. SEO i poprawna struktura HTML
5. Prosta edycja treści
6. Subtelne, eleganckie animacje
7. Łatwy deployment
8. Możliwość rozwoju w przyszłości
```

Animacje są dodatkiem. Nie mogą utrudniać korzystania ze strony.

---

## 5. Zasady pracy agentów

Każdy agent powinien pracować małymi, kontrolowanymi zmianami.

Nie przebudowuj całego projektu bez potrzeby.

Nie zmieniaj decyzji architektonicznych, jeśli zadanie dotyczy tylko jednej sekcji.

Nie dodawaj bibliotek bez mocnego uzasadnienia.

Nie hardcoduj treści, jeśli da się ją trzymać w `src/content`.

Nie usuwaj istniejących komponentów, jeśli można je poprawić.

Nie zostawiaj martwego kodu, nieużywanych klas i niepotrzebnych zależności.

Każda zmiana powinna przejść:

```bash
npm run build
```

Jeżeli istnieje `npm run check`, też powinno przejść:

```bash
npm run check
```

---

## 6. Zakres MVP

MVP zawiera:

- jedną responsywną stronę typu landing page,
- sekcje wymienione w wymaganiach,
- podstawowe dane kontaktowe,
- linki `tel:` i `mailto:`,
- link do Instagrama,
- Google Maps iframe albo link do mapy,
- RODO / politykę prywatności,
- podstawowe SEO,
- zoptymalizowane zdjęcia,
- deployment na Netlify albo Cloudflare Pages.

Poza MVP:

- system rezerwacji wizyt,
- backend,
- konto pacjenta,
- płatności online,
- blog,
- rozbudowany CMS,
- integracja z kalendarzem,
- panel administracyjny.

Nie implementuj rzeczy poza MVP bez wyraźnego polecenia.

---

## 7. Proponowana struktura projektu

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
        Button.astro
        Container.astro
        SectionHeader.astro
        Card.astro
        IconLink.astro
      sections/
        HeroSection.astro
        AboutSection.astro
        ServicesSection.astro
        RehabilitationSection.astro
        LocationsSection.astro
        TeleconsultationSection.astro
        HomeVisitSection.astro
        CooperationSection.astro
        ContactSection.astro
        Footer.astro
      interactive/
        HeroInteractivePanel.astro
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
  AGENTS.md
```

Nie traktuj tej struktury dogmatycznie, ale trzymaj projekt uporządkowany.

---

## 8. Model treści

Treści powinny być możliwie łatwe do edycji.

Preferuj:

- JSON dla danych strukturalnych,
- Markdown dla dłuższych treści,
- komponenty tylko do renderowania, nie do przechowywania tekstów.

### `src/content/site.json`

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

### `src/content/services.json`

```json
[
  {
    "id": "rehabilitacja-ortopedyczna",
    "title": "Rehabilitacja ortopedyczna",
    "shortDescription": "Powrót do sprawności po urazach, przeciążeniach i zabiegach.",
    "description": "Opis do uzupełnienia przez klienta.",
    "image": "/images/services/rehabilitacja.jpg"
  },
  {
    "id": "fizjoterapia-sportowa",
    "title": "Fizjoterapia sportowa",
    "shortDescription": "Wsparcie osób aktywnych fizycznie i sportowców.",
    "description": "Opis do uzupełnienia przez klienta.",
    "image": "/images/services/sport.jpg"
  }
]
```

### `src/content/locations.json`

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

Nie wpisuj niepotwierdzonych danych kontaktowych jako finalnych.

---

## 9. Zasady UI

Styl strony:

- nowoczesny,
- medyczny,
- spokojny,
- profesjonalny,
- premium, ale bez przesady,
- dużo oddechu,
- dobra typografia,
- brak przeładowania treścią.

Kolory bazowe:

```scss
$color-navy: #0B1F3A;
$color-navy-light: #16385F;
$color-white: #FFFFFF;
$color-off-white: #F7F9FC;
$color-gray: #667085;
$color-accent: #6EA8FE;
```

Typografia:

- preferuj `Inter`, `Manrope` albo `Plus Jakarta Sans`,
- nagłówki mają być wyraźne,
- tekst ma być łatwy do czytania na telefonie,
- nie używaj zbyt cienkich fontów dla treści.

Breakpointy:

```scss
$breakpoint-sm: 480px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

---

## 10. Zasady animacji

Animacje mają wspierać doświadczenie, nie dominować nad treścią.

Dopuszczalne animacje:

- fade-in,
- slide-up,
- subtelny scale,
- płynne otwieranie panelu,
- hover states,
- delikatne przejścia tła.

Nie używaj agresywnych animacji, które utrudniają czytanie.

Obsłuż `prefers-reduced-motion`:

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

Jeśli CSS wystarcza, nie dodawaj GSAP.

GSAP można dodać tylko wtedy, gdy animacja hero/panelu wymaga timeline’u trudnego do utrzymania w czystym CSS/TS.

---

## 11. Dostępność

Minimalne wymagania:

- jeden `h1` na stronie,
- logiczna hierarchia `h2`, `h3`,
- linki jako `<a>`, przyciski jako `<button>`,
- `aria-expanded` dla elementów otwierających panel,
- `aria-controls` dla paneli,
- `aria-label` dla ikon,
- panel zamykany przez `Escape`,
- widoczny focus,
- dobry kontrast,
- tekst alternatywny dla zdjęć,
- brak pułapek klawiatury.

---

## 12. SEO

Strona musi mieć:

- poprawny `title`,
- `meta description`,
- `canonical URL`,
- Open Graph,
- favicon,
- `robots.txt`,
- sitemapę,
- poprawną strukturę nagłówków,
- sensowne teksty alternatywne zdjęć,
- dane kontaktowe łatwe do znalezienia.

Przykładowy tytuł:

```txt
dr Łukasz Wilgocki — Fizjoterapeuta Warszawa i Legionowo
```

Przykładowy opis:

```txt
Rehabilitacja ortopedyczna, fizjoterapia sportowa i diagnostyka funkcjonalna. Wizyty w Warszawie i Legionowie, telekonsultacje oraz wizyty domowe.
```

Używaj finalnych lokalizacji tylko po ich potwierdzeniu.

---

## 13. Obrazy

Zdjęcia są kluczowe dla jakości strony.

Wymagania:

- optymalizować obrazy,
- nie ładować wielkich plików na mobile,
- preferować `.webp` albo `.avif`,
- ustawiać `width` i `height`,
- używać `loading="lazy"` poza hero,
- dodać sensowne `alt`,
- nie stosować zdjęć stockowych, jeśli są dostępne prawdziwe zdjęcia z pracy.

Zdjęcie hero może być ładowane priorytetowo.

---

## 14. Kontakt i dane osobowe

Kontakt powinien obsługiwać:

```txt
- telefon: tel:
- e-mail: mailto:
- Instagram: link zewnętrzny
- mapa: Google Maps URL lub iframe
```

Nie dodawaj formularza zbierającego dane osobowe bez:

- polityki prywatności,
- informacji o administratorze danych,
- zgody/klauzuli informacyjnej,
- jasnego celu przetwarzania danych.

Na start preferuj prostsze CTA:

- „Zadzwoń”,
- „Napisz wiadomość”,
- „Pokaż trasę”.

---

## 15. RODO / Polityka prywatności

RODO może być osobną podstroną `/rodo` albo sekcją linkowaną z footera.

Nie twórz finalnej treści prawnej jako pewnika.

Możesz dodać placeholder:

```txt
Treść polityki prywatności / klauzuli RODO do uzupełnienia i akceptacji przez właściciela strony.
```

Jeżeli dodajesz formularz, zaznacz, że treść RODO musi zostać zatwierdzona przez właściciela lub prawnika.

---

## 16. Deployment

Docelowy hosting:

- Netlify albo Cloudflare Pages.

Dla Netlify:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Dla Cloudflare Pages:

```txt
Build command: npm run build
Output directory: dist
```

Nie dodawaj bez potrzeby redirectu `/* -> /index.html`, jeśli Astro generuje statyczne podstrony. Taki redirect może ukrywać błędy 404.

---

## 17. Komendy projektu

Standardowe komendy:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Jeżeli dostępne:

```bash
npm run check
npm run lint
npm run format
```

Każdy agent po zmianach powinien uruchomić build.

---

## 18. Definition of Done

Projekt jest gotowy, gdy:

- wszystkie sekcje MVP są zaimplementowane,
- strona działa na desktopie i mobile,
- nie ma poziomego scrolla,
- CTA są łatwe do kliknięcia,
- dane kontaktowe są poprawne albo jawnie oznaczone jako placeholder,
- mapa działa albo ma fallback,
- RODO jest dostępne z footera,
- obrazy są zoptymalizowane,
- animacje są subtelne i nie psują UX,
- `prefers-reduced-motion` jest obsłużone,
- SEO jest uzupełnione,
- `npm run build` przechodzi,
- strona jest gotowa do deployu.

---

## 19. Sposób pracy nad zadaniami

Dla każdego zadania agent powinien:

1. Krótko opisać plan zmian.
2. Wprowadzić minimalny zestaw zmian.
3. Nie mieszać zadań niezwiązanych z poleceniem.
4. Uruchomić build/check, jeśli to możliwe.
5. Wypisać zmienione pliki.
6. Wypisać ryzyka lub rzeczy wymagające decyzji klienta.

---

## 20. Base prompt dla agenta implementującego

Użyj tego promptu przy pracy z agentem AI:

```txt
Jesteś agentem implementującym stronę wizytówkę dla dr Łukasza Wilgockiego, fizjoterapeuty pracującego m.in. w Warszawie i Legionowie.

Projekt ma być wykonany jako lekka, statyczna strona w Astro + TypeScript + SCSS. Nie buduj ciężkiego SPA i nie dodawaj backendu w MVP. Strona ma być responsywna, szybka, profesjonalna wizualnie i łatwa do późniejszej edycji.

Pracuj zgodnie z AGENTS.md i planem implementacji. Wykonuj tylko zakres aktualnego zadania. Nie przebudowuj projektu bez potrzeby. Preferuj dane w src/content zamiast hardcodowania treści w komponentach. Dbaj o mobile, dostępność, SEO i wydajność.

Po zmianach uruchom npm run build oraz npm run check, jeśli ta komenda istnieje. Na końcu podsumuj zmienione pliki, wykonane decyzje i rzeczy wymagające potwierdzenia przez klienta.
```

---

## 21. Prompt do code review

```txt
Zrób code review projektu Astro dla strony wizytówki fizjoterapeuty. Sprawdź:

- czy struktura projektu jest czytelna,
- czy komponenty są sensownie podzielone,
- czy treści nie są niepotrzebnie hardcodowane,
- czy strona jest responsywna,
- czy SEO jest poprawnie ustawione,
- czy dostępność jest zachowana,
- czy animacje nie psują UX,
- czy obrazy są zoptymalizowane,
- czy build przechodzi,
- czy nie ma niepotrzebnych zależności,
- czy strona nadaje się do deploymentu.

Zwróć listę problemów z priorytetami: critical, major, minor. Dla każdego problemu podaj konkretną rekomendację naprawy.
```

---

## 22. Prompt do QA

```txt
Przetestuj stronę wizytówkę fizjoterapeuty jak QA. Sprawdź desktop, mobile, linki, sekcje, animacje, dostępność, SEO i błędy wizualne.

Szczególnie sprawdź:

- szerokości 360px, 390px, 430px, 768px, 1024px, 1440px,
- czy nie ma poziomego scrolla,
- czy telefon i e-mail działają,
- czy mapa działa,
- czy panel hero da się otworzyć i zamknąć,
- czy Escape zamyka panel,
- czy fokus klawiatury jest widoczny,
- czy na stronie nie zostały placeholdery,
- czy RODO jest dostępne,
- czy teksty są czytelne.

Na końcu przygotuj raport z błędami, priorytetami i rekomendowanymi poprawkami.
```

---

## 23. Prompt do dalszego rozwoju

```txt
Zaproponuj rozwój strony wizytówki fizjoterapeuty bez przepisywania obecnego projektu. Oceń, które funkcje warto dodać jako pierwsze:

- CMS do edycji treści,
- formularz kontaktowy,
- blog ekspercki,
- rezerwacje wizyt,
- integracja z kalendarzem,
- sekcja opinii pacjentów,
- analityka,
- dodatkowe podstrony SEO.

Dla każdej funkcji podaj koszt techniczny, ryzyko, wpływ biznesowy i rekomendowaną kolejność wdrożenia.
```
