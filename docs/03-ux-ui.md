# Kierunek wizualny i zachowanie

Spokojny granat, biel, jasne niebieskoszare tła, lokalnie serwowany Manrope. Hero łączy krótką prezentację z miejscem na portret na tle zdjęcia gabinetu. Bez zdjęć widoczne są opisane grafiki zastępcze. Duże nagłówki, otwarte przestrzenie i numeracja porządkują dłuższą stronę.

Desktop od 1024 px: pinezka i cztery skróty otwierają natywny modalny dialog. Portret zmniejsza się do 92% i staje się półprzezroczysty. W dialogu dostępnych jest osiem tematów. Zakładki obsługują strzałki lewo/prawo, Home i End; Escape, przycisk zamknięcia i kliknięcie tła zamykają dialog. Fokus wraca do elementu otwierającego. Link do sekcji zamyka panel, ustawia fokus na sekcji i przewija stronę.

Poniżej 1024 px skróty są zwykłymi kotwicami do sekcji. Poniżej 768 px jest rozwijane menu oraz dolny pasek kontaktu uwzględniający safe area. Przełączenie rozmiaru ekranu zamyka aktywny modal. Bez JavaScriptu menu i kotwice działają natywnie.

Ruch ograniczono do krótkiego wejścia panelu, portretu i stanów hover. `prefers-reduced-motion` wyłącza animacje, przejścia i płynne przewijanie. Nie ukrywamy treści do czasu wykonania JavaScriptu.

Wersja robocza jest jawnie oznaczona w stopce i przy proponowanych treściach. Puste dane kontaktowe renderują informację o oczekiwaniu, a nie niedziałające linki. Mapy otwierają się wyłącznie jako link zewnętrzny po dodaniu potwierdzonego adresu; bez iframe i żądań do Google przy wejściu na stronę.
