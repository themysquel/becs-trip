import { mkdir, writeFile } from "node:fs/promises";
import { queryPrices } from "mav-prices";
import { readStations } from "mav-stations";

const TRAVEL_DATE = "2026-10-03";

// MOST CSAK TESZT:
// 1 fővel nézzük meg, hogy az előző 73 € tényleg 5 fő teljes ára volt-e.
const PASSENGERS = 1;

const travellers = Array.from({ length: PASSENGERS }, () => ({
  age: 30,
  discounts: []
}));

function normalizeName(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();
}

async function loadStations() {
  const result = [];

  for await (const station of readStations()) {
    result.push(station);
  }

  return result;
}

function findStation(stations, possibleNames) {
  const wanted = possibleNames.map(normalizeName);

  return stations.find((station) =>
    wanted.includes(normalizeName(station.name))
  );
}

function getRawField(journey, fieldName) {
  return (
    journey?.[fieldName] ??
    journey?.raw?.[fieldName] ??
    null
  );
}

console.log("Állomások betöltése...");

const stations = await loadStations();

const from =
  findStation(stations, ["BUDAPEST*"]) ||
  findStation(stations, ["Budapest-Keleti", "Budapest Keleti"]);

const to =
  findStation(stations, ["WIEN*"]) ||
  findStation(stations, ["Wien Hbf"]);

if (!from) {
  throw new Error(
    "Nem található Budapest állomás a MÁV állomáslistában."
  );
}

if (!to) {
  throw new Error(
    "Nem található Wien/Wien Hbf a MÁV állomáslistában."
  );
}

console.log(`Indulás: ${from.name} (${from.id})`);
console.log(`Érkezés: ${to.name} (${to.id})`);

const when = new Date(`${TRAVEL_DATE}T00:01:00+02:00`);

console.log(
  `MÁV árak lekérése: ${TRAVEL_DATE}, ${PASSENGERS} utas, 2. osztály...`
);

const journeys = await queryPrices(
  from.id,
  to.id,
  when,
  {
    class: 2,
    seatReservation: false,
    directConnection: false,

    // Egész napos keresés
    duration: 1440,

    // FONTOS:
    // foglalási folyamathoz használható nyers adatok kérése
    raw: true,

    travellers
  }
);

console.log(`Visszakapott ajánlatok: ${journeys.length}`);

if (journeys.length === 0) {
  throw new Error("A MÁV API egyetlen ajánlatot sem adott vissza.");
}

/*
 * Megnézzük, pontosan milyen mezőket adott vissza
 * a mav-prices raw módban.
 */
console.log("");
console.log("ELSŐ AJÁNLAT KULCSAI");
console.log("--------------------");
console.log(Object.keys(journeys[0]));

/*
 * Az első olyan ajánlat, amelyhez ár is tartozik.
 */
const firstPricedJourney = journeys.find(
  (journey) =>
    journey.price &&
    Number.isFinite(Number(journey.price.amount))
);

if (firstPricedJourney) {
  const offerIdentity = getRawField(
    firstPricedJourney,
    "offerIdentity"
  );

  const serializedOfferData = getRawField(
    firstPricedJourney,
    "serializedOfferData"
  );

  const trainIds = getRawField(
    firstPricedJourney,
    "trainIds"
  );

  console.log("");
  console.log("FOGLALÁSI / RAW ADATOK");
  console.log("----------------------");

  console.log(
    "offerIdentity:",
    offerIdentity ?? "NINCS"
  );

  console.log(
    "trainIds:",
    trainIds ?? "NINCS"
  );

  console.log(
    "serializedOfferData:",
    serializedOfferData ?? "NINCS"
  );

  if (firstPricedJourney.raw) {
    console.log("");
    console.log("TELJES RAW OBJEKTUM");
    console.log("------------------");
    console.log(
      JSON.stringify(firstPricedJourney.raw, null, 2)
    );
  }
}

const offers = journeys
  .filter((journey) => {
    return (
      journey.price &&
      Number.isFinite(Number(journey.price.amount))
    );
  })
  .map((journey) => {
    const legs = Array.isArray(journey.legs)
      ? journey.legs
      : [];

    const firstLeg = legs[0];
    const lastLeg = legs[legs.length - 1];

    const offerIdentity = getRawField(
      journey,
      "offerIdentity"
    );

    const serializedOfferData = getRawField(
      journey,
      "serializedOfferData"
    );

    const trainIds = getRawField(
      journey,
      "trainIds"
    );

    return {
      id: journey.id ?? null,

      departure:
        firstLeg?.departure ?? null,

      arrival:
        lastLeg?.arrival ?? null,

      origin:
        firstLeg?.origin?.name ?? from.name,

      destination:
        lastLeg?.destination?.name ?? to.name,

      changes:
        Math.max(0, legs.length - 1),

      trains: legs
        .map((leg) => leg.line?.name)
        .filter(Boolean),

      price: {
        amount:
          Number(journey.price.amount),

        currency:
          journey.price.currency ?? null,

        name:
          journey.price.name ?? null,

        refundable:
          journey.price.refundable ?? null,

        trainDependent:
          journey.price.trainDependent ?? null
      },

      bookingData: {
        offerIdentity,
        serializedOfferData,
        trainIds
      }
    };
  })
  .sort((a, b) => {
    if (
      a.price.amount !==
      b.price.amount
    ) {
      return (
        a.price.amount -
        b.price.amount
      );
    }

    return (
      new Date(a.departure) -
      new Date(b.departure)
    );
  });

/*
 * Duplikált ajánlatok kiszűrése.
 */
const uniqueOffers = [];
const seen = new Set();

for (const offer of offers) {
  const key = [
    offer.departure,
    offer.arrival,
    offer.price.amount,
    offer.price.currency
  ].join("|");

  if (seen.has(key)) {
    continue;
  }

  seen.add(key);
  uniqueOffers.push(offer);
}

if (uniqueOffers.length === 0) {
  throw new Error(
    "A MÁV API nem adott vissza árral rendelkező ajánlatot."
  );
}

const cheapest = uniqueOffers[0];

console.log("");
console.log("LEGOLCSÓBB TALÁLAT");
console.log("------------------");

console.log(
  `${cheapest.origin} → ${cheapest.destination}`
);

console.log(
  `${cheapest.departure} → ${cheapest.arrival}`
);

console.log(
  `${cheapest.price.amount} ${cheapest.price.currency} · ${cheapest.price.name}`
);

console.log(
  `Átszállások: ${cheapest.changes}`
);

console.log(
  `Vonatok: ${cheapest.trains.join(", ")}`
);

console.log("");
console.log("LEGOLCSÓBB AJÁNLAT FOGLALÁSI ADATAI");
console.log("-----------------------------------");

console.log(
  "offerIdentity:",
  cheapest.bookingData.offerIdentity ??
    "NINCS"
);

console.log(
  "trainIds:",
  cheapest.bookingData.trainIds ??
    "NINCS"
);

console.log(
  "serializedOfferData:",
  cheapest.bookingData.serializedOfferData ??
    "NINCS"
);

/*
 * JSON fájl, amit később a weboldal tud olvasni.
 */
const output = {
  generatedAt:
    new Date().toISOString(),

  query: {
    travelDate:
      TRAVEL_DATE,

    passengers:
      PASSENGERS,

    passengerAges:
      travellers.map(
        (traveller) =>
          traveller.age
      ),

    class: 2,

    from: {
      name: from.name,
      id: from.id
    },

    to: {
      name: to.name,
      id: to.id
    }
  },

  cheapest,

  offers:
    uniqueOffers
};

await mkdir(
  "data",
  {
    recursive: true
  }
);

await writeFile(
  "data/train-prices.json",
  JSON.stringify(
    output,
    null,
    2
  ),
  "utf8"
);

console.log("");
console.log(
  "Elmentve: data/train-prices.json"
);