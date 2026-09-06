# Utrzymanie

- Wymagany Node >=22.19.0; dla hostingu ustawiono 22.22.0. Starszy Node 22.17.0 z bieżącego środowiska może zgłaszać ostrzeżenie silnika zależności `undici`.
- Czysta instalacja: `npm ci`.
- Podgląd: `npm run dev` (skrypt uruchamia Astro w tle na 127.0.0.1); zarządzanie: `npm run astro -- dev status`, `npm run astro -- dev logs`, `npm run astro -- dev stop`.
- Walidacja: `npm run check`, `npm run build`, a następnie `npm run test:e2e` przy uruchomionym podglądzie.
- Testy domyślnie wykorzystują zainstalowanego Edge w trybie bez okna. Dla innego środowiska zainstaluj przeglądarkę Playwright (`npx playwright install chromium`) i ustaw `PLAYWRIGHT_CHANNEL=chromium`.
- Aktualizuj zależności świadomie, małymi zmianami. Zachowuj `package-lock.json`, sprawdzaj uwagi o wymaganej wersji Node i powtarzaj walidację.
- Po publikacji sprawdź główny adres, `/rodo/`, `/robots.txt`, `/sitemap.xml`, brakującą ścieżkę (404), linki i mobile na prawdziwym telefonie.
- W razie regresji przywróć ostatni poprawny deployment w panelu Netlify/Cloudflare, a następnie napraw kod w repo. Nie zmieniaj ręcznie plików w `dist`.

Nie ma backendu, bazy danych, kont pacjentów ani migracji danych.
