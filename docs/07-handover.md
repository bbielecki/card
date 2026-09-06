# Przekazanie MVP

Kod znajduje się w katalogu `card`. Nie skonfigurowano zewnętrznego konta hostingu ani domeny.

## Treści i zdjęcia

| Zmiana                                                  | Plik                              |
| ------------------------------------------------------- | --------------------------------- |
| Nazwa, bio, telefon, e-mail, Instagram, nawigacja, hero | `src/content/site.json`           |
| Usługi                                                  | `src/content/services.json`       |
| Etapy rehabilitacji                                     | `src/content/rehabilitation.json` |
| Gabinety, adresy i mapy                                 | `src/content/locations.json`      |
| Telekonsultacja, wizyta domowa                          | `src/content/consultations.json`  |
| Współpraca                                              | `src/content/cooperation.json`    |
| Polityka prywatności                                    | `src/content/rodo.md`             |

Dodaj zdjęcia do `src/assets/photos/`. W `site.json` ustaw `hero.portrait` i `hero.background` na same nazwy plików, np. `portret.jpg`, `gabinet.jpg`, oraz odpowiednie alty. Astro generuje wersje WebP o szerokościach 360/640/960 px. Brak podanego pliku powoduje czytelny błąd kompilacji. Puste nazwy wyświetlają grafiki zastępcze.

Telefon jest przekształcany na `tel:`, e-mail na `mailto:`, Instagram otwiera nową kartę. W `locations.json` dodaj pełny `googleMapsUrl` do konkretnego gabinetu. `embedUrl` jest polem rezerwowym; MVP nie osadza map. Nową usługę lub gabinet można dodać jako kolejny obiekt w `items`.

## Publikacja

1. Uzupełnij i zaakceptuj brakujące materiały z `docs/01-scope.md`.
2. W `site.json` ustaw `isDraft: false` dopiero po zatwierdzeniu treści.
3. Ustaw zmienną środowiskową `SITE_URL` na potwierdzony pełny adres HTTPS. Można też użyć lokalnego `.env` na podstawie `.env.example`.
4. Uruchom `npm run check` i `npm run build`.
5. Netlify: ustaw katalog bazowy `card`, jeśli repo obejmuje katalog nadrzędny. Jeśli repo zaczyna się w `card`, katalog bazowy pozostaw pusty. `netlify.toml` definiuje build i `dist`.
6. Cloudflare Pages: ten sam katalog bazowy, build `npm run check && npm run build`, output `dist`, Node 22.22.0 lub nowsza zgodna wersja LTS.
7. Dodaj własną domenę w panelu hostingu i zastosuj wskazane tam rekordy DNS. Nie zakładaj, że sugerowana domena jest już zarejestrowana.
8. Sprawdź HTTPS, wariant www, kontakt, mapy, `/rodo/` i prawdziwe 404. Nie dodawaj przekierowania SPA.

Bez `SITE_URL` lub przy `isDraft: true` strona ma `noindex`, robots blokuje indeksowanie, a sitemap jest pusta. Przy potwierdzonej domenie canonical i Open Graph używają tej domeny. Po wyłączeniu trybu roboczego sitemap obejmuje stronę główną. `/rodo/` pozostaje z `noindex` (strona informacyjna), niezależnie od stanu strony głównej.

`public/social-card.png` to lokalna grafika udostępniania 1200×630; źródłem jest `src/assets/social-card.svg`. Przy zmianie nazwiska lub hasła zaktualizuj oba pliki.
