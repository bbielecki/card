# Kierunek wizualny i zachowanie

Spokojny granat, biel, jasne niebieskoszare tła, lokalnie serwowany Manrope. Hero łączy krótką prezentację z miejscem na portret na tle zdjęcia gabinetu. Bez zdjęć widoczne są opisane grafiki zastępcze. Duże nagłówki, otwarte przestrzenie i numeracja porządkują dłuższą stronę.

Desktop od 1024 px: zdjęcie zajmuje 75% szerokości układu pierwszego ekranu. Na wszystkich ekranach menu jest początkowo ukryte. Scroll zmniejsza wysokość zdjęcia, a osiem zakładek pod nim odsłania się gradientem i podjeżdża pod nagłówek. Menu jest częścią strony, bez popupu, przycisku zamykania i blokady przewijania. Powrót na górę odwraca efekt. Pinezka prowadzi do mapy. Link pod zdjęciem umożliwia przejście klawiaturą do menu. Nagłówek nie dubluje zakładek.

Na telefonach zachowano duże zdjęcie z tekstem na delikatnym gradiencie. Pasek zakładek przewija się poziomo, a treści pozostają w naturalnym układzie strony. Dolny pasek kontaktu pojawia się po scrollu.

Po schowaniu zdjęcia dalszy scroll wysuwa nagłówek poza ekran, a menu dochodzi do górnej krawędzi i pozostaje tam także przy niższych sekcjach. Po lewej stronie zakładek jest logo ŁW+ prowadzące do początku strony. Wybranie zakładki podczas czytania niższych sekcji przenosi do jej treści. Powrót na górę przywraca pierwotny nagłówek i zdjęcie.

Wszystkie osiem zakładek obsługuje strzałki lewo/prawo, Home i End. Linki prowadzą do pełnych sekcji i ustawiają na nich fokus. Bez JavaScriptu dostępne są klasyczne menu, skróty i wszystkie sekcje.

Zdjęcie i gradient menu reagują na pozycję przewijania. `prefers-reduced-motion` wyłącza animacje, przejścia i płynne przewijanie. Bez JavaScriptu dostępne są wszystkie sekcje strony.

Wersja robocza jest jawnie oznaczona w stopce i przy proponowanych treściach. Puste dane kontaktowe renderują informację o oczekiwaniu, a nie niedziałające linki. Sekcja lokalizacji korzysta z adresu i osadzonej mapy dodanych przez użytkownika. Przyciski telekonsultacji i wizyty domowej są wyrównane do góry, bez rozciągania do wysokości mapy; na desktopie mają około 104 px wysokości.
