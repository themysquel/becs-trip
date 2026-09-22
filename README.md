# Vienna Stays – V4

GitHub Pages-kompatibilis, statikus, mobil- és desktopbarát bécsi szállás-shortlist.

## V3 újdonságok

- teljes dark mode;
- az árak elsődlegesen forintban jelennek meg;
- ha a JSON-ban az ár EUR, az oldal a Frankfurter API-ból kér aktuális EUR→HUF árfolyamot;
- API-hiba esetére van fallback árfolyam;
- a JSON-ban az eredeti Booking/Airbnb ár megmaradhat EUR-ban;
- a képekhez most biztosan működő helyi PNG placeholder van;
- továbbra is egy szállás van fókuszban;
- mobil swipe, desktop nyilak és felső szállásváltó;
- Bécs időjárása Open-Meteo API-ról.

## GitHub Pages

Igen, az egész frontendből fut. Nincs Node/backend szükség.

1. Töltsd fel a projekt tartalmát a GitHub repo gyökerébe.
2. Settings → Pages.
3. Deploy from a branch.
4. `main` és `/ (root)`.
5. Save.

## Helyi futtatás

```bash
py -m http.server 8000
```

majd:

`http://localhost:8000`

## Képek

A Booking oldal fotóit nem sikerült stabil, közvetlenül újrafelhasználható URL-ként kinyerni,
ezért most helyi placeholder PNG-k vannak.

A legstabilabb későbbi megoldás:

```text
assets/stays/stadtparadies-q14/01.jpg
assets/stays/stadtparadies-q14/02.jpg
...
```

és a JSON-ban:

```json
"images": [
  "./assets/stays/stadtparadies-q14/01.jpg",
  "./assets/stays/stadtparadies-q14/02.jpg"
]
```

Így GitHub Pages-ről mindig megjelennek a képek.


## V4

- az egész felület egységes dark mode;
- nincs világos aktív szállás-chip vagy világos fő gomb;
- Bécs / Semmering / Schneeberg időjárásváltó;
- Semmering kb. 950 m-es hegyi ponttal;
- Schneeberg felső, kb. 2000 m-es hegyi ponttal;
- a három időjárás külön cache-elődik a böngészőben az oldal megnyitása alatt;
- `styles.css?v=4` és `app.js?v=4` cache-busting, hogy a böngésző ne tartsa bent a régi világos CSS-t.


## V5

- mobilon a Bécs / Semmering / Schneeberg időjárás-választó már nem vízszintesen görgethető;
- mindhárom helyszín mindig egyszerre látszik egy 3 oszlopos választóban;
- kattintással ugyanazon a helyen vált a 3 napos előrejelzés;
- `styles.css?v=5` és `app.js?v=5` cache-busting.
