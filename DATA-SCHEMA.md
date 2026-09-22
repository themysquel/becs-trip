# accommodations.json – rövid séma

```json
{
  "id": "egyedi-id",
  "shortName": "Rövid név",
  "name": "Teljes név",
  "provider": "Booking",
  "url": "https://...",
  "area": "10. kerület · Favoriten",
  "address": "14 Quellenstraße, 1100 Wien",
  "guests": 5,
  "nights": 2,
  "capacity": 6,
  "roomType": "2 hálószobás apartman erkéllyel",
  "rating": {
    "score": 8.4,
    "count": 147
  },
  "price": {
    "total": 334.66,
    "currency": "EUR",
    "verified": false,
    "note": "Ár megjegyzés"
  },
  "beds": {
    "separateSleepingSurfaces": 3,
    "details": [
      "1× franciaágy",
      "1× franciaágy",
      "1× kanapéágy"
    ],
    "note": "5 főre elfér, de nem 5 külön ágy."
  },
  "outdoor": ["erkély"],
  "transport": {
    "primary": "6-os villamos ~100 m",
    "detail": "Részletes közlekedési infó."
  },
  "amenities": ["légkondicionáló", "konyha", "lift"],
  "images": [
    "./assets/placeholders/living-room.svg"
  ],
  "note": "Saját megjegyzés.",
  "status": "unknown",
  "checkedAt": "2026-09-22T20:10:00+02:00"
}
```

## státusz

- `available` = elérhető
- `unknown` = ellenőrizendő
- `unavailable` = nem elérhető

## ár

A `price.total` + `price.currency` bármilyen valutát kezel, pl.:

```json
"price": {
  "total": 145000,
  "currency": "HUF"
}
```

vagy:

```json
"price": {
  "total": 334.66,
  "currency": "EUR"
}
```

Az oldal automatikusan számolja az ár/főt.
