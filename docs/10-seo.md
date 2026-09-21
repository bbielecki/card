# SEO lokalne — Legionowo i Warszawa

Wdrożone: title i description kierowane do pacjentów z Legionowa i Warszawy, jeden H1 z nazwiskiem i zawodem, opis pod hasłami wskazujący gabinet w Legionowie i pacjentów z obu miast, lokalny H2 w kontakcie, canonical bez parametrów, Open Graph i Twitter Card z istniejącą grafiką 1200 × 630. Graf JSON-LD opisuje stronę (WebSite), fizjoterapeutę (Person), miejsce przyjęć (Place) oraz usługę (Service) dla pacjentów z obu miast. Warszawa jest obszarem docelowym, a gabinet znajduje się w Legionowie. Graf nie oznacza fizjoterapeuty jako lekarza ani właściciela Centrum Medycznego Kalinowska. Telefon placówki pozostaje opisany jako rejestracja w widocznej treści. Testowy e-mail i fotografie nie trafiają do grafu.

Domyślna domena pochodzi z `src/content/site.json`: https://drlukaszwilgocki.pl. Opcjonalne `SITE_URL` nadpisuje adres przy budowie. Metadane, canonical i sitemap korzystają z tego samego adresu.

## Stan roboczy i publikacja

`isDraft: true` nadal ustawia `noindex, nofollow`; sitemap jest pusta. Robots.txt pozwala odczytać stronę, aby robot mógł zobaczyć noindex. Robots.txt nie stanowi zabezpieczenia dostępu. RODO i 404 mają niezależny noindex.

Przed publikacją należy podmienić testowy e-mail i zdjęcia, zatwierdzić treści oraz dokument prywatności. Następnie ustawić `isDraft: false` i ponownie zbudować stronę. Wtedy strona główna otrzyma `index, follow`, sitemap jej kanoniczny adres, a robots.txt odnośnik do sitemap. Podglądy z tym ustawieniem powinny być chronione przed indeksowaniem przez hosting.

## Kolejne kroki po uruchomieniu domeny

1. Zweryfikować domenę w Google Search Console rekordem TXT otrzymanym od Google. Przesłać `/sitemap.xml` i sprawdzić URL strony głównej.
2. Zweryfikować istniejący Profil Firmy w Google i uprawnienia do zarządzania nim; ujednolicić nazwę, adres, telefon i URL. Nie tworzyć duplikatu placówki.
3. Uzupełnić zaakceptowane informacje o wykształceniu i doświadczeniu oraz docelowe zdjęcia. Alty mają opisywać faktyczną zawartość obrazów.
4. Zmierzyć Core Web Vitals na wdrożonej stronie (PageSpeed Insights i Search Console). Obecne obrazy są responsywne i optymalizowane przez Astro; lokalne testy nie potwierdzają wyników rzeczywistych użytkowników.

Gabinet w Warszawie, terapia manualna, specjalizacja sportowa, godziny, opinie i ceny z przykładowego poradnika nie zostały dodane bez potwierdzenia. Osobne podstrony usług pozostają poza bieżącą wizytówką. Konfiguracja DNS, Search Console i Profilu Firmy nie została wykonana.

Źródła: [Google: dane lokalnej firmy](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Google: noindex i robots.txt](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
