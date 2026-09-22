const TRAIN_PRICE_FILE =
  "./data/train-prices.json";

let trainOffers = [];
let trainPassengers = 1;
let eurHufRate = null;

let trainPeriod = "morning";
let trainSort = "departure";

function escapeTrainHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTrainType(trainName = "") {
  const value = trainName.trim().toLowerCase();

  if (value.startsWith("rjx")) {
    return {
      name: "Railjet Xpress",
      short: "RJX"
    };
  }

  if (value.startsWith("rj ")) {
    return {
      name: "Railjet",
      short: "RJ"
    };
  }

  if (value.startsWith("ec ")) {
    return {
      name: "EuroCity",
      short: "EC"
    };
  }

  if (value.startsWith("en ")) {
    return {
      name: "EuroNight",
      short: "EN"
    };
  }

  return {
    name: "Vonat",
    short: ""
  };
}

function getTrainNumber(trainName = "") {
  const parts = trainName.trim().split(/\s+/);

  if (parts.length < 2) {
    return trainName;
  }

  return parts.slice(1).join(" ");
}

function formatTime(dateString) {
  if (!dateString) {
    return "--:--";
  }

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function formatUpdatedAt(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function getDurationMinutes(departure, arrival) {
  const start = new Date(departure);
  const end = new Date(arrival);

  return Math.max(
    0,
    Math.round((end - start) / 60000)
  );
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} perc`;
  }

  if (mins === 0) {
    return `${hours} óra`;
  }

  return `${hours} óra ${mins} perc`;
}

function formatEuro(value) {
  return new Intl.NumberFormat("hu-HU", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatHuf(value) {
  return new Intl.NumberFormat("hu-HU", {
    maximumFractionDigits: 0
  }).format(Math.round(value));
}

function calculateHuf(eur) {
  if (!eurHufRate) {
    return null;
  }

  return eur * eurHufRate;
}

function removeDuplicateTrains(offers) {
  const cheapestByTrain = new Map();

  for (const offer of offers) {
    const trainName = offer.trains?.[0] ?? "";

    const key = [
      trainName.toLowerCase(),
      offer.departure,
      offer.arrival
    ].join("|");

    const existing = cheapestByTrain.get(key);

    if (
      !existing ||
      offer.price.amount < existing.price.amount
    ) {
      cheapestByTrain.set(key, offer);
    }
  }

  return [...cheapestByTrain.values()];
}

async function loadTrainOffers() {
  const root =
    document.querySelector("#trainOffers");

  if (!root) {
    return;
  }

  root.innerHTML = `
    <div class="train-loading">
      Vonatárak betöltése...
    </div>
  `;

  try {
    const [trainResponse, fx] =
      await Promise.all([
        fetch(TRAIN_PRICE_FILE, {
          cache: "no-store"
        }),
        window.getEurHufRate()
      ]);

    eurHufRate = fx.rate;

    if (!trainResponse.ok) {
      throw new Error(
        `train-prices.json HTTP ${trainResponse.status}`
      );
    }

    const data =
      await trainResponse.json();

    trainPassengers =
      Number(data.query?.passengers) || 1;

    trainOffers =
      removeDuplicateTrains(
        Array.isArray(data.offers)
          ? data.offers
          : []
      );

    if (trainOffers.length === 0) {
      throw new Error(
        "Nincsenek megjeleníthető vonatajánlatok."
      );
    }

    renderTrainSection(data);
  } catch (error) {
    console.error(error);

    root.innerHTML = `
      <div class="train-error">
        <strong>
          Nem sikerült betölteni a vonatárakat.
        </strong>

        <span>
          Ellenőrizd, hogy létezik-e a
          data/train-prices.json fájl.
        </span>
      </div>
    `;
  }
}

function getDepartureHour(dateString) {
  const date = new Date(dateString);

  return {
    hour: date.getHours(),
    minute: date.getMinutes()
  };
}

function filterTrainOffers(period = "morning") {
  return trainOffers.filter((offer) => {
    const departure = new Date(offer.departure);

    const minutes =
      departure.getHours() * 60 +
      departure.getMinutes();

    // 06:30 előtti járatok egyáltalán nem kellenek
    if (minutes < 6 * 60 + 30) {
      return false;
    }

    // Délelőtt: 06:30 – 12:59
    if (period === "morning") {
      return minutes < 13 * 60;
    }

    // Délután: 13:00-tól
    if (period === "afternoon") {
      return minutes >= 13 * 60;
    }

    // Összes: minden 06:30 utáni
    return true;
  });
}

function sortTrainOffers(
  offers,
  sortType = "departure"
) {
  const result = [...offers];

  if (sortType === "cheapest") {
    result.sort((a, b) => {
      if (a.price.amount !== b.price.amount) {
        return (
          Number(a.price.amount) -
          Number(b.price.amount)
        );
      }

      return (
        new Date(a.departure) -
        new Date(b.departure)
      );
    });

    return result;
  }

  // Alap: indulási idő
  result.sort(
    (a, b) =>
      new Date(a.departure) -
      new Date(b.departure)
  );

  return result;
}

function renderTrainSection(data) {
  const root = document.querySelector("#trainOffers");

  if (!root) {
    return;
  }

  const travelDate = formatDate(
    `${data.query.travelDate}T12:00:00`
  );

  root.innerHTML = `
    <section class="train-section">

      <div class="train-header">

        <div>
          <div class="train-eyebrow">
            🚆 VONATJEGYEK
          </div>

          <h2>
            Budapest → Bécs
          </h2>

          <p>
            ${escapeTrainHtml(travelDate)}
            ·
            ${trainPassengers} fő
            ·
            2. osztály
          </p>
        </div>


        <div class="train-filters">

          <div class="train-sort">
            <label for="trainPeriod">
              Időszak
            </label>

            <select id="trainPeriod">
              <option value="morning" selected>
                🌅 Délelőtt
              </option>

              <option value="afternoon">
                🌇 Délután
              </option>

              <option value="all">
                🚆 Összes
              </option>
            </select>
          </div>


          <div class="train-sort">
            <label for="trainSort">
              Rendezés
            </label>

            <select id="trainSort">
              <option value="departure" selected>
                🕐 Indulási idő
              </option>

              <option value="cheapest">
                💰 Legolcsóbb
              </option>
            </select>
          </div>

        </div>

      </div>


      <div class="train-carousel-wrapper">

        <button
          class="train-arrow train-arrow--left"
          id="trainPrev"
          type="button"
          aria-label="Előző vonat"
        >
          ‹
        </button>

        <div
          class="train-carousel"
          id="trainCarousel"
        ></div>

        <button
          class="train-arrow train-arrow--right"
          id="trainNext"
          type="button"
          aria-label="Következő vonat"
        >
          ›
        </button>

      </div>


      <div class="train-footer">

        <span>
          ${
            eurHufRate
              ? `💱 1 € ≈ ${formatHuf(eurHufRate)} Ft`
              : "💱 EUR/HUF árfolyam jelenleg nem elérhető"
          }
        </span>

        <span>
          Frissítve:
          ${escapeTrainHtml(
            formatUpdatedAt(data.generatedAt)
          )}
        </span>

      </div>

    </section>
  `;


  // Alapbeállítás
  trainPeriod = "morning";
  trainSort = "departure";

  renderTrainCards();


  document
    .querySelector("#trainPeriod")
    ?.addEventListener("change", (event) => {
      trainPeriod = event.target.value;

      renderTrainCards();
    });


  document
    .querySelector("#trainSort")
    ?.addEventListener("change", (event) => {
      trainSort = event.target.value;

      renderTrainCards();
    });


  document
    .querySelector("#trainPrev")
    ?.addEventListener("click", () => {
      scrollTrainCarousel(-1);
    });


  document
    .querySelector("#trainNext")
    ?.addEventListener("click", () => {
      scrollTrainCarousel(1);
    });
}

function renderTrainCards() {
  const carousel =
    document.querySelector("#trainCarousel");

  if (!carousel) {
    return;
  }

  const filtered =
    filterTrainOffers(trainPeriod);

  const sorted =
    sortTrainOffers(
      filtered,
      trainSort
    );

  if (sorted.length === 0) {
    carousel.innerHTML = `
      <div class="train-empty">
        Ebben az időszakban nincs megjeleníthető vonat.
      </div>
    `;

    return;
  }

  const cheapestPrice = Math.min(
    ...filtered
      .filter(
        (item) =>
          item?.price &&
          Number.isFinite(
            Number(item.price.amount)
          )
      )
      .map(
        (item) =>
          Number(item.price.amount)
      )
  );

  carousel.innerHTML = sorted
    .map((offer, index) => {
      const trainName =
        offer.trains?.[0] ?? "Vonat";

      const type =
        getTrainType(trainName);

      const number =
        getTrainNumber(trainName);

      const totalEuro =
        Number(offer.price.amount);

      const perPersonEuro =
        totalEuro / trainPassengers;

      const totalHuf =
        calculateHuf(totalEuro);

      const perPersonHuf =
        calculateHuf(perPersonEuro);

      const duration =
        getDurationMinutes(
          offer.departure,
          offer.arrival
        );

      const isCheapest =
        Math.abs(
          totalEuro - cheapestPrice
        ) < 0.001;

      return `
        <article class="train-card">

          <div class="train-card__top">

            <div>
              <div class="train-type">
                ${escapeTrainHtml(type.name)}
              </div>

              <div class="train-number">
                ${escapeTrainHtml(
                  type.short
                    ? `${type.short} ${number}`
                    : trainName
                )}
              </div>
            </div>

            ${
              isCheapest
                ? `
                  <div class="train-cheapest-badge">
                    💰 Legolcsóbb
                  </div>
                `
                : ""
            }

          </div>


          <div class="train-route">

            <div class="train-stop">

              <strong>
                ${formatTime(offer.departure)}
              </strong>

              <span>
                ${escapeTrainHtml(offer.origin)}
              </span>

            </div>


            <div class="train-route__middle">

              <span class="train-route__duration">
                ${formatDuration(duration)}
              </span>

              <div class="train-route__line">
                <span></span>
                <i></i>
                <span></span>
              </div>

              <span class="train-route__changes">
                ${
                  offer.changes === 0
                    ? "Közvetlen"
                    : `${offer.changes} átszállás`
                }
              </span>

            </div>


            <div class="train-stop train-stop--arrival">

              <strong>
                ${formatTime(offer.arrival)}
              </strong>

              <span>
                ${escapeTrainHtml(
                  offer.destination
                )}
              </span>

            </div>

          </div>


          <div class="train-price">

            <div class="train-price__total">

              <span>
                ${trainPassengers} fő összesen
              </span>

              <strong>
                ${formatEuro(totalEuro)} €
              </strong>

              ${
                totalHuf !== null
                  ? `
                    <em>
                      ≈ ${formatHuf(totalHuf)} Ft
                    </em>
                  `
                  : ""
              }

            </div>


            <div class="train-price__person">

              <span>
                Egy főre
              </span>

              <strong>
                ${formatEuro(perPersonEuro)} €
              </strong>

              ${
                perPersonHuf !== null
                  ? `
                    <em>
                      ≈ ${formatHuf(perPersonHuf)} Ft
                    </em>
                  `
                  : ""
              }

            </div>

          </div>


          <div class="train-card__bottom">

            <span>
              ${escapeTrainHtml(
                offer.price.name ?? ""
              )}
            </span>

            <span>
              ${
                offer.price.trainDependent
                  ? "Adott járathoz kötött"
                  : "Rugalmas"
              }
            </span>

          </div>


          <div class="train-card__position">
            ${index + 1} / ${sorted.length}
          </div>

        </article>
      `;
    })
    .join("");

  carousel.scrollTo({
    left: 0,
    behavior: "smooth"
  });
}

function scrollTrainCarousel(direction) {
  const carousel =
    document.querySelector("#trainCarousel");

  if (!carousel) {
    return;
  }

  const card =
    carousel.querySelector(".train-card");

  const amount = card
    ? card.offsetWidth + 18
    : 360;

  carousel.scrollBy({
    left: direction * amount,
    behavior: "smooth"
  });
}

loadTrainOffers();