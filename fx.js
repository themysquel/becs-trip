const FX_API_URL =
  "https://api.frankfurter.dev/v2/rate/eur/huf";

window.FX_FALLBACK_RATE = 364.37;

let fxPromise = null;

async function fetchEurHufRate() {
  try {
    const response = await fetch(FX_API_URL, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`EUR/HUF HTTP ${response.status}`);
    }

    const data = await response.json();
    const rate = Number(data.rate);

    if (!Number.isFinite(rate)) {
      throw new Error("Érvénytelen EUR/HUF árfolyam.");
    }

    return {
      rate,
      date: data.date || null,
      live: true
    };
  } catch (error) {
    console.warn("EUR/HUF fallback:", error);

    return {
      rate: window.FX_FALLBACK_RATE,
      date: null,
      live: false
    };
  }
}

window.getEurHufRate = function () {
  if (!fxPromise) {
    fxPromise = fetchEurHufRate();
  }

  return fxPromise;
};

window.eurToHuf = async function (eurAmount) {
  const fx = await window.getEurHufRate();

  return Math.round(
    Number(eurAmount) * fx.rate
  );
};

function formatFxRate(rate) {
  return new Intl.NumberFormat("hu-HU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate);
}

function formatFxDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("hu-HU", {
    month: "short",
    day: "numeric"
  }).format(date);
}

async function renderFxHeader() {
  const element =
    document.querySelector("#fxStatus");

  if (!element) {
    return;
  }

  const fx =
    await window.getEurHufRate();

  const dateText =
    fx.date
      ? ` · ${formatFxDate(fx.date)}`
      : "";

  element.innerHTML = `
    <span class="fx-pill__label">
      EUR / HUF
    </span>

    <strong class="fx-pill__rate">
      1 € = ${formatFxRate(fx.rate)} Ft
    </strong>

    <span class="${
      fx.live
        ? "fx-pill__live"
        : "fx-pill__fallback"
    }">
      ${
        fx.live
          ? `● napi árfolyam${dateText}`
          : "● tartalék árfolyam"
      }
    </span>
  `;

  element.classList.toggle(
    "is-fallback",
    !fx.live
  );
}

document.addEventListener(
  "DOMContentLoaded",
  renderFxHeader
);