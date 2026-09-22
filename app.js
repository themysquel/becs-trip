const TRIP = {
  dates: ["2026-10-03", "2026-10-04", "2026-10-05"],
  guests: 5,
  nights: 2,
};

const WEATHER_LOCATIONS = {
  vienna: {
    name: "Bécs",
    detail: "városi előrejelzés",
    latitude: 48.2082,
    longitude: 16.3738,
    elevationLabel: "~170 m",
  },
  semmering: {
    name: "Semmering",
    detail: "hágó / település, alpesi kirándulás",
    latitude: 47.6333,
    longitude: 15.8300,
    elevationLabel: "~950 m",
  },
  schneeberg: {
    name: "Schneeberg",
    detail: "felső hegyvidék, a Hochschneeberg környéke",
    latitude: 47.7667,
    longitude: 15.8042,
    elevationLabel: "~2000 m",
  },
};

const FX_FALLBACK = {
  EUR_HUF: 364.37,
};

const state = {
  stays: [],
  index: 0,
  stageTouchStartX: null,
  rates: {
    EUR_HUF: FX_FALLBACK.EUR_HUF,
  },
  fxLive: false,
  fxDate: null,
  weatherLocation: "vienna",
  weatherCache: new Map(),
};

const el = {
  stage: document.querySelector("#stayStage"),
  viewport: document.querySelector("#stayViewport"),
  switcher: document.querySelector("#staySwitcher"),
  current: document.querySelector("#currentStayNumber"),
  count: document.querySelector("#stayCount"),
  prev: document.querySelector("#prevStay"),
  next: document.querySelector("#nextStay"),
  prevTop: document.querySelector("#prevStayTop"),
  nextTop: document.querySelector("#nextStayTop"),
  weather: document.querySelector("#weatherDays"),
  weatherNotice: document.querySelector("#weatherNotice"),
  weatherLocations: document.querySelector("#weatherLocations"),
  weatherLocationName: document.querySelector("#weatherLocationName"),
  weatherLocationDetail: document.querySelector("#weatherLocationDetail"),
  weatherElevation: document.querySelector("#weatherElevation"),
  fxStatus: document.querySelector("#fxStatus"),
};

const formatters = new Map();

function currency(value, code = "HUF") {
  if (value == null || Number.isNaN(Number(value))) return "Ár nincs megadva";
  if (!formatters.has(code)) {
    formatters.set(code, new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: code,
      maximumFractionDigits: code === "HUF" ? 0 : 2,
    }));
  }
  return formatters.get(code).format(Number(value));
}

function toHuf(value, code) {
  if (value == null || Number.isNaN(Number(value))) return null;
  const amount = Number(value);
  if (code === "HUF") return amount;
  if (code === "EUR") return amount * state.rates.EUR_HUF;
  return null;
}

function formatDateTime(value) {
  if (!value) return "nincs megadva";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function normalizeStay(s) {
  const guests = Number(s.guests ?? TRIP.guests);
  const total = Number(s?.price?.total ?? 0);

  return {
    ...s,
    guests,
    nights: Number(s.nights ?? TRIP.nights),
    price: {
      total,
      currency: s?.price?.currency || "HUF",
      verified: Boolean(s?.price?.verified),
      note: s?.price?.note || "",
      perPerson: total ? total / guests : null,
    },
    beds: {
      separateSleepingSurfaces: Number(s?.beds?.separateSleepingSurfaces ?? 0),
      details: Array.isArray(s?.beds?.details) ? s.beds.details : [],
      note: s?.beds?.note || "",
    },
    transport: {
      primary: s?.transport?.primary || "Nincs megadva",
      detail: s?.transport?.detail || "",
    },
    outdoor: Array.isArray(s.outdoor) ? s.outdoor : [],
    images: Array.isArray(s.images) && s.images.length
      ? s.images
      : ["./assets/placeholders/apartment.png"],
    amenities: Array.isArray(s.amenities) ? s.amenities : [],
  };
}

function statusMeta(status) {
  if (status === "available") return ["Elérhető", "status--available"];
  if (status === "unavailable") return ["Nem elérhető", "status--unavailable"];
  return ["Ellenőrizendő", "status--unknown"];
}

function currentHashId() {
  return decodeURIComponent(location.hash.replace(/^#/, ""));
}

function setIndex(nextIndex, { updateHash = true } = {}) {
  if (!state.stays.length) return;
  state.index = (nextIndex + state.stays.length) % state.stays.length;
  renderStay();

  if (updateHash) {
    const id = state.stays[state.index].id;
    history.replaceState(null, "", `#${encodeURIComponent(id)}`);
  }
}

function stayPriceHuf(stay) {
  return toHuf(stay.price.total, stay.price.currency);
}

function renderSwitcher() {
  el.switcher.innerHTML = "";

  state.stays.forEach((stay, index) => {
    const button = document.createElement("button");
    button.className = "stay-chip";
    button.type = "button";
    button.dataset.index = index;

    const name = document.createElement("span");
    name.className = "stay-chip__name";
    name.textContent = stay.shortName || stay.name;

    const price = document.createElement("span");
    price.className = "stay-chip__price";
    const hufTotal = stayPriceHuf(stay);
    price.textContent = hufTotal
      ? `${currency(hufTotal / stay.guests, "HUF")} / fő`
      : "ár nélkül";

    button.append(name, price);
    button.addEventListener("click", () => setIndex(index));
    el.switcher.appendChild(button);
  });
}

function createGallery(stay) {
  const gallery = document.createElement("div");
  gallery.className = "gallery";

  const track = document.createElement("div");
  track.className = "gallery__track";

  const badge = document.createElement("div");
  badge.className = "gallery__badge";
  badge.textContent = stay.provider || "Szállás";

  const position = document.createElement("div");
  position.className = "gallery__position";

  const dots = document.createElement("div");
  dots.className = "gallery__dots";

  const prev = document.createElement("button");
  prev.className = "gallery__button gallery__button--prev";
  prev.type = "button";
  prev.setAttribute("aria-label", "Előző kép");
  prev.textContent = "‹";

  const next = document.createElement("button");
  next.className = "gallery__button gallery__button--next";
  next.type = "button";
  next.setAttribute("aria-label", "Következő kép");
  next.textContent = "›";

  stay.images.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "gallery__slide";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `${stay.name} – ${i + 1}. kép`;
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";

    if (/^https?:\/\//i.test(src)) {
      img.referrerPolicy = "no-referrer";
    }

    img.addEventListener("error", () => {
      img.src = "./assets/placeholders/apartment.png";
    }, { once: true });

    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement("span");
    dot.className = "gallery__dot";
    dots.appendChild(dot);
  });

  let imageIndex = 0;
  let touchStartX = null;
  const dotList = [...dots.children];

  function goImage(nextIndex) {
    imageIndex = (nextIndex + stay.images.length) % stay.images.length;
    track.style.transform = `translateX(-${imageIndex * 100}%)`;
    position.textContent = `${imageIndex + 1} / ${stay.images.length}`;
    dotList.forEach((dot, i) => dot.classList.toggle("is-active", i === imageIndex));
  }

  prev.addEventListener("click", (event) => {
    event.stopPropagation();
    goImage(imageIndex - 1);
  });

  next.addEventListener("click", (event) => {
    event.stopPropagation();
    goImage(imageIndex + 1);
  });

  gallery.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  gallery.addEventListener("touchend", (event) => {
    if (touchStartX == null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) {
      event.stopPropagation();
      goImage(imageIndex + (delta < 0 ? 1 : -1));
    }
    touchStartX = null;
  }, { passive: true });

  if (stay.images.length <= 1) {
    prev.hidden = true;
    next.hidden = true;
    dots.hidden = true;
  }

  gallery.append(track, prev, next, badge, dots, position);
  goImage(0);
  return gallery;
}

function renderStay() {
  const stay = state.stays[state.index];
  if (!stay) return;

  el.current.textContent = String(state.index + 1);
  el.count.textContent = String(state.stays.length);

  [...el.switcher.children].forEach((chip, index) => {
    chip.classList.toggle("is-active", index === state.index);
    chip.setAttribute("aria-current", index === state.index ? "true" : "false");

    const priceNode = chip.querySelector(".stay-chip__price");
    const hufTotal = stayPriceHuf(state.stays[index]);
    priceNode.textContent = hufTotal
      ? `${currency(hufTotal / state.stays[index].guests, "HUF")} / fő`
      : "ár nélkül";

    if (index === state.index) {
      chip.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  });

  const card = document.createElement("article");
  card.className = "stay-card";

  const gallery = createGallery(stay);
  const info = document.createElement("div");
  info.className = "stay-info";

  const [statusText, statusClass] = statusMeta(stay.status);
  const outdoorText = stay.outdoor.length ? stay.outdoor.join(" · ") : "nincs megadva";
  const ratingText = stay.rating?.score
    ? `<span class="rating">${Number(stay.rating.score).toFixed(1)}</span> · ${stay.rating.count ?? "?"} értékelés`
    : "Nincs értékelés megadva";

  const bedTags = stay.beds.details.length
    ? stay.beds.details.map(item => `<span class="bed-tag">${escapeHtml(item)}</span>`).join("")
    : `<span class="bed-tag">Nincs megadva</span>`;

  const amenities = stay.amenities.length
    ? stay.amenities.slice(0, 5).join(" · ")
    : "";

  const totalHuf = stayPriceHuf(stay);
  const perPersonHuf = totalHuf ? totalHuf / stay.guests : null;

  const originalPrice = stay.price.currency !== "HUF"
    ? `<span class="price__original">eredeti ár: ${currency(stay.price.total, stay.price.currency)}</span>`
    : "";

  info.innerHTML = `
    <div class="stay-info__top">
      <div>
        <p class="area">${escapeHtml(stay.area || "Bécs")}</p>
        <h3 class="stay-name">${escapeHtml(stay.name)}</h3>
      </div>
      <span class="status ${statusClass}">${statusText}</span>
    </div>

    <div class="rating-row">
      ${ratingText}
      ${stay.roomType ? `<span>·</span><span>${escapeHtml(stay.roomType)}</span>` : ""}
    </div>

    <div class="price">
      <div>
        <span class="price__label">Ár / fő / ${stay.nights} éj</span>
        <div class="price__main">${currency(perPersonHuf, "HUF")}</div>
      </div>
      <div class="price__total">
        ${currency(totalHuf, "HUF")} összesen<br>
        ${stay.guests} fő
        ${originalPrice}
      </div>
    </div>
    ${stay.price.note ? `<p class="price__note">${escapeHtml(stay.price.note)}</p>` : ""}

    <div class="facts">
      <div class="fact">
        <span class="fact__label">Külön fekvőfelület</span>
        <div class="fact__value">🛏️ ${stay.beds.separateSleepingSurfaces} db</div>
      </div>
      <div class="fact">
        <span class="fact__label">Maximum</span>
        <div class="fact__value">👥 ${stay.capacity ?? stay.guests} fő</div>
      </div>
      <div class="fact">
        <span class="fact__label">Erkély / terasz</span>
        <div class="fact__value">🌿 ${escapeHtml(outdoorText)}</div>
      </div>
      <div class="fact">
        <span class="fact__label">Közlekedés</span>
        <div class="fact__value">🚋 ${escapeHtml(stay.transport.primary)}</div>
      </div>
      ${stay.sizeM2 ? `
        <div class="fact">
          <span class="fact__label">Lakás mérete</span>
          <div class="fact__value">📐 ${stay.sizeM2} m²</div>
        </div>
      ` : ""}
    </div>

    <div class="beds">
      <p class="beds__title">Ágyelosztás</p>
      <div class="bed-tags">${bedTags}</div>
      ${stay.beds.note ? `<p class="note">${escapeHtml(stay.beds.note)}</p>` : ""}
    </div>

    ${stay.transport.detail ? `<p class="note"><strong>Közlekedés:</strong> ${escapeHtml(stay.transport.detail)}</p>` : ""}
    ${stay.note ? `<p class="note">${escapeHtml(stay.note)}</p>` : ""}
    ${amenities ? `<p class="note"><strong>Főbb extrák:</strong> ${escapeHtml(amenities)}</p>` : ""}

    <div class="meta">
      ${stay.address ? `📍 ${escapeHtml(stay.address)}<br>` : ""}
      Utolsó manuális ellenőrzés: ${formatDateTime(stay.checkedAt)}
    </div>

    <div class="actions">
      <a class="btn btn--primary" href="${escapeAttribute(stay.url)}" target="_blank" rel="noopener noreferrer">
        Megnyitás – ${escapeHtml(stay.provider || "forrás")}
      </a>
      <button class="btn btn--secondary" id="copyStayLink" type="button">Link másolása</button>
    </div>
  `;

  card.append(gallery, info);
  el.stage.replaceChildren(card);

  info.querySelector("#copyStayLink").addEventListener("click", async (event) => {
    const url = `${location.origin}${location.pathname}#${encodeURIComponent(stay.id)}`;
    try {
      await navigator.clipboard.writeText(url);
      const button = event.currentTarget;
      button.textContent = "Másolva ✓";
      setTimeout(() => button.textContent = "Link másolása", 1300);
    } catch {
      location.hash = stay.id;
    }
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function bindStayNavigation() {
  const previous = () => setIndex(state.index - 1);
  const next = () => setIndex(state.index + 1);

  el.prev.addEventListener("click", previous);
  el.prevTop.addEventListener("click", previous);
  el.next.addEventListener("click", next);
  el.nextTop.addEventListener("click", next);

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") previous();
    if (event.key === "ArrowRight") next();
  });

  el.stage.addEventListener("touchstart", (event) => {
    if (event.target.closest(".gallery")) return;
    state.stageTouchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  el.stage.addEventListener("touchend", (event) => {
    if (state.stageTouchStartX == null) return;
    const delta = event.changedTouches[0].clientX - state.stageTouchStartX;
    if (Math.abs(delta) > 60) setIndex(state.index + (delta < 0 ? 1 : -1));
    state.stageTouchStartX = null;
  }, { passive: true });
}

async function loadFxRate() {
  try {
    const response = await fetch("https://api.frankfurter.dev/v2/rate/eur/huf");
    if (!response.ok) throw new Error(`FX HTTP ${response.status}`);
    const data = await response.json();

    if (!data.rate || Number.isNaN(Number(data.rate))) {
      throw new Error("Invalid FX response");
    }

    state.rates.EUR_HUF = Number(data.rate);
    state.fxLive = true;
    state.fxDate = data.date || null;
    el.fxStatus.textContent = `1 € = ${state.rates.EUR_HUF.toFixed(2)} Ft`;

    if (state.stays.length) {
      renderSwitcher();
      renderStay();
    }
  } catch (error) {
    console.warn("FX fallback:", error);
    state.fxLive = false;
    el.fxStatus.textContent = `1 € ≈ ${FX_FALLBACK.EUR_HUF.toFixed(2)} Ft`;
  }
}

const WEATHER = {
  0: ["☀️", "Derült"],
  1: ["🌤️", "Többnyire derült"],
  2: ["⛅", "Részben felhős"],
  3: ["☁️", "Borult"],
  45: ["🌫️", "Köd"],
  48: ["🌫️", "Zúzmarás köd"],
  51: ["🌦️", "Enyhe szitálás"],
  53: ["🌦️", "Szitálás"],
  55: ["🌧️", "Erős szitálás"],
  61: ["🌦️", "Enyhe eső"],
  63: ["🌧️", "Eső"],
  65: ["🌧️", "Erős eső"],
  71: ["🌨️", "Enyhe havazás"],
  73: ["🌨️", "Havazás"],
  75: ["❄️", "Erős havazás"],
  80: ["🌦️", "Záporok"],
  81: ["🌧️", "Záporok"],
  82: ["⛈️", "Erős zápor"],
  95: ["⛈️", "Zivatar"],
  96: ["⛈️", "Zivatar, jég"],
  99: ["⛈️", "Erős zivatar"],
};

function weatherLocationMeta(key) {
  return WEATHER_LOCATIONS[key] || WEATHER_LOCATIONS.vienna;
}

function syncWeatherLocationUI() {
  const meta = weatherLocationMeta(state.weatherLocation);

  el.weatherLocationName.textContent = meta.name;
  el.weatherLocationDetail.textContent = meta.detail;
  el.weatherElevation.textContent = meta.elevationLabel;

  if (el.weatherLocations) {
    el.weatherLocations.querySelectorAll("[data-weather-location]").forEach(button => {
      const active = button.dataset.weatherLocation === state.weatherLocation;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
      if (active) {
        button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    });
  }
}

function renderWeatherRows(rows) {
  el.weather.innerHTML = "";

  rows.forEach(row => {
    const [icon, desc] = WEATHER[row.code] || ["🌡️", "Időjárás"];
    const date = new Date(`${row.date}T12:00:00`);
    const dateLabel = new Intl.DateTimeFormat("hu-HU", {
      month: "short",
      day: "numeric",
      weekday: "short",
    }).format(date);

    const card = document.createElement("article");
    card.className = "weather-day";
    card.innerHTML = `
      <div class="weather-day__icon">${icon}</div>
      <div>
        <div class="weather-day__date">${dateLabel}</div>
        <div class="weather-day__desc">${desc}</div>
      </div>
      <div class="weather-day__temp">
        ${Math.round(row.max)}° / ${Math.round(row.min)}°
        <span class="weather-day__rain">☔ ${row.rainChance ?? "?"}% · 💨 ${Math.round(row.wind)} km/h</span>
      </div>
    `;
    el.weather.appendChild(card);
  });
}

async function fetchWeather(locationKey) {
  const cached = state.weatherCache.get(locationKey);
  if (cached) return cached;

  const location = weatherLocationMeta(locationKey);
  const url = new URL("https://api.open-meteo.com/v1/forecast");

  url.search = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "precipitation_sum",
      "wind_speed_10m_max",
    ].join(","),
    timezone: "Europe/Vienna",
    forecast_days: "16",
  }).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather HTTP ${response.status}`);

  const data = await response.json();
  const rows = TRIP.dates.map(date => {
    const i = data.daily.time.indexOf(date);
    if (i < 0) return null;

    return {
      date,
      code: data.daily.weather_code[i],
      max: data.daily.temperature_2m_max[i],
      min: data.daily.temperature_2m_min[i],
      rainChance: data.daily.precipitation_probability_max[i],
      precipitation: data.daily.precipitation_sum[i],
      wind: data.daily.wind_speed_10m_max[i],
    };
  }).filter(Boolean);

  state.weatherCache.set(locationKey, rows);
  return rows;
}

async function loadWeather(locationKey = state.weatherLocation) {
  state.weatherLocation = locationKey;
  syncWeatherLocationUI();

  const location = weatherLocationMeta(locationKey);
  el.weather.innerHTML = `<div class="weather__loading">${location.name} előrejelzésének betöltése…</div>`;

  try {
    const rows = await fetchWeather(locationKey);

    if (!rows.length) {
      throw new Error("Trip dates are not inside the available forecast window.");
    }

    renderWeatherRows(rows);

    if (rows.length < TRIP.dates.length) {
      el.weatherNotice.textContent =
        "A távolabbi napokra még nincs előrejelzés. A panel automatikusan kiegészül, ahogy közeledik az utazás.";
    } else if (locationKey === "schneeberg") {
      el.weatherNotice.textContent =
        "Schneeberg: magashegyi előrejelzés. Fent jóval hidegebb és szelesebb lehet, mint Puchbergben.";
    } else if (locationKey === "semmering") {
      el.weatherNotice.textContent =
        "Semmering: kb. 950 m-es hegyi előrejelzés. Indulás előtt érdemes ugyanaznap újra ellenőrizni.";
    } else {
      el.weatherNotice.textContent =
        "Bécs városi előrejelzése. A Semmering és Schneeberg füleken külön a hegyi időjárást látjátok.";
    }
  } catch (error) {
    console.warn(error);
    el.weather.innerHTML = `
      <div class="weather__loading">
        ${location.name} október 3–5-i előrejelzése jelenleg nem érhető el.
        Az oldal következő megnyitáskor automatikusan újrapróbálja.
      </div>
    `;
  }
}

function bindWeatherLocations() {
  if (!el.weatherLocations) return;

  el.weatherLocations.addEventListener("click", event => {
    const button = event.target.closest("[data-weather-location]");
    if (!button) return;
    loadWeather(button.dataset.weatherLocation);
  });
}

async function init() {
  bindStayNavigation();
  bindWeatherLocations();
  loadFxRate();
  loadWeather("vienna");

  try {
    const response = await fetch("./data/accommodations.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.stays = data.accommodations.map(normalizeStay);
    el.count.textContent = String(state.stays.length);

    renderSwitcher();

    const hash = currentHashId();
    const fromHash = state.stays.findIndex(stay => stay.id === hash);
    setIndex(fromHash >= 0 ? fromHash : 0, { updateHash: false });
  } catch (error) {
    console.error(error);
    el.stage.innerHTML = `
      <div style="padding:28px;border:1px solid #2b323d;border-radius:20px;background:#141820;color:#f3f5f7">
        Nem sikerült betölteni a <code>data/accommodations.json</code> fájlt.
        GitHub Pages-en ez működni fog; helyi teszthez indíts egyszerű webszervert.
      </div>
    `;
  }
}

init();
