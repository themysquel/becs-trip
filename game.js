const DRINK_GAME_LEVELS = [
  {
    playerRank: "Kezdő kortyoló",
    name: "Bemelegítés",

    enemy: {
      name: "Bulcsú",
      rank: "Csöves alkesz",
    },

    rules: ["basic"],

    ruleLabels: [
      "🍺 Normál kortyok",
    ],

    cpuInterval: 275,
  },

  {
    playerRank: "Kezdő alkesz",
    name: "Piros lámpa",

    enemy: {
      name: "Koppány",
      rank: "Kisfröccs-bandita",
    },

    rules: ["red"],

    ruleLabels: [
      "✋ STOP jelzésnél ne nyomd",
    ],

    cpuInterval: 255,
  },

  {
    playerRank: "Pultpajtás",
    name: "Átkozott korsó",

    enemy: {
      name: "Géza",
      rank: "Pultszéli veterán",
    },

    rules: ["second"],

    ruleLabels: [
      "↩️ Minden második korty visszatölt",
    ],

    cpuInterval: 245,
  },

  {
    playerRank: "Habharcos",
    name: "Ne spameld!",

    enemy: {
      name: "Árpád",
      rank: "Korsóharcos",
    },

    rules: ["fast"],

    ruleLabels: [
      "⚠️ A túl gyors dupla nyomás büntet",
    ],

    cpuInterval: 235,
  },

  {
    playerRank: "Korsókirály-jelölt",
    name: "Tartsd a tempót",

    enemy: {
      name: "Levente",
      rank: "Sörcápa",
    },

    rules: ["slow"],

    ruleLabels: [
      "⏱️ Ha sokáig vársz, visszatölt",
    ],

    cpuInterval: 225,
  },

  {
    playerRank: "Kocsmai veterán",
    name: "Ritmuszavar",

    enemy: {
      name: "Botond",
      rank: "Kocsma bajnoka",
    },

    rules: [
      "red",
      "fast",
    ],

    ruleLabels: [
      "✋ STOP jelzés",
      "⚠️ Ne spameld",
    ],

    cpuInterval: 215,
  },

  {
    playerRank: "Bécsi sörcápa",
    name: "Kocsmai káosz",

    enemy: {
      name: "Tas",
      rank: "Pultkirály",
    },

    rules: [
      "second",
      "slow",
    ],

    ruleLabels: [
      "↩️ Minden második visszatölt",
      "⏱️ Nem állhatsz le",
    ],

    cpuInterval: 205,
  },

  {
    playerRank: "Legendás májlovag",
    name: "A VÉGSŐ PRÓBA",

    enemy: {
      name: "Vajk",
      rank: "VÉGSŐ FŐALKESZ · BOSS",
    },

    rules: [
      "red",
      "second",
      "fast",
      "slow",
    ],

    ruleLabels: [
      "✋ STOP",
      "↩️ Minden 2. visszatölt",
      "⚠️ Ne spameld",
      "⏱️ Ne lassíts",
    ],

    cpuInterval: 190,
  },
];


const DRINK_GAME_MISTAKE_TAUNTS = [
  "CSICSKA VAGY 😭",
  "Még a hab is jobban teljesít.",
  "Ez korty volt vagy rendszerhiba?",
  "A korsó konkrétan kinevetett.",
  "A pultos inkább elfordult.",
  "Ezt még Bulcsú is szégyellné.",
  "A korsó több lett, nem kevesebb. Gratulálok.",
  "Így a büfékocsiban sem kapsz rangot.",
  "Ez a technika bíróság elé kívánkozik.",
  "A kocsma kezd elveszíteni benned a hitét.",
];


const DRINK_GAME_WIN_TAUNTS = [
  "Na jó, ezt el kell ismerni. 🔥",
  "A következő ellenfél már ideges.",
  "Pultmester energia.",
  "Ez már ranghoz méltó volt.",
  "A korsó fél tőled.",
  "Szép volt. De ne bízd el magad.",
];


let drinkGame = {
  level: 0,

  player: 100,
  enemy: 100,

  wins: 0,

  taps: 0,
  penalties: 0,
  combo: 0,

  active: false,
  trap: false,
  gameOver: false,

  lastTap: 0,
  lastGoodTap: 0,

  cpuTimer: null,
  trapTimer: null,
  slowTimer: null,
  countdownTimer: null,
};


function drinkGameRandom(items) {
  return items[
    Math.floor(Math.random() * items.length)
  ];
}


function drinkGameLevel() {
  return DRINK_GAME_LEVELS[
    drinkGame.level
  ];
}


function drinkGameHasRule(rule) {
  return drinkGameLevel()
    .rules
    .includes(rule);
}


function drinkGameClamp(value) {
  return Math.max(
    0,
    Math.min(100, value)
  );
}


function initDrinkGame() {
  const mount =
    document.querySelector("#drinkGame");

  if (!mount) {
    return;
  }


  /* =========================================
     TEASER
     ========================================= */

  mount.innerHTML = `
    <div class="drink-game-teaser">

      <div class="drink-game-teaser__content">

        <div class="drink-game-teaser__icon">
          🍺
        </div>

        <div class="drink-game-teaser__text">

          <p class="section-kicker">
            KOCSMAI KIHÍVÁS
          </p>

          <h2>
            Kiissza előbb?
          </h2>

          <p>
            8 ellenfél · egy élet ·
            ha kikapsz, kezdheted elölről.
          </p>

        </div>

      </div>


      <button
        class="drink-game-launch"
        id="openDrinkGame"
        type="button"
      >
        <span>
          JÁTÉK INDÍTÁSA
        </span>

        <strong>
          🍺 VS 🍺
        </strong>
      </button>

    </div>
  `;


  /* =========================================
     MODAL
     ========================================= */

  const modal =
    document.createElement("div");

  modal.id = "drinkGameModal";
  modal.className = "drink-game-modal";
  modal.hidden = true;

  modal.setAttribute(
    "role",
    "dialog"
  );

  modal.setAttribute(
    "aria-modal",
    "true"
  );

  modal.setAttribute(
    "aria-label",
    "Kiissza előbb játék"
  );


  modal.innerHTML = `
    <div class="drink-game-screen">

      <div class="drink-game-topbar">

        <div>
          <span class="drink-game-topbar__small">
            KIISSZA ELŐBB?
          </span>

          <strong>
            Kocsmai ranglétra
          </strong>
        </div>


        <button
          id="closeDrinkGame"
          class="drink-game-close"
          type="button"
          aria-label="Játék bezárása"
        >
          ×
        </button>

      </div>


      <main class="drink-game-content">

        <section class="drink-game-rank">

          <div>

            <span>
              Jelenlegi rang
            </span>

            <strong id="drinkPlayerRank">
              Kezdő kortyoló
            </strong>

          </div>


          <div class="drink-game-level">
            LVL
            <strong id="drinkLevelNumber">
              1
            </strong>
          </div>


          <div class="drink-game-progress">

            <div
              id="drinkRankProgress"
              class="drink-game-progress__fill"
            ></div>

          </div>


          <small id="drinkNextRank">
            Következő rang:
            Kezdő alkesz
          </small>

        </section>


        <section class="drink-game-challenge">

          <div>
            <span>
              AKTÍV KIHÍVÁS
            </span>

            <strong id="drinkChallengeName">
              Bemelegítés
            </strong>
          </div>

          <div
            id="drinkRules"
            class="drink-game-rules"
          ></div>

        </section>


        <section class="drink-game-versus">

          <!-- PLAYER -->

          <article class="drink-player-card">

            <div class="drink-game-person">

              <div>
                <span>
                  TE
                </span>

                <strong>
                  Játékos
                </strong>
              </div>

              <small id="drinkPlayerWins">
                0 győzelem
              </small>

            </div>


            <div
              id="drinkPlayerGlass"
              class="drink-glass"
            >

              <div
                id="drinkPlayerLiquid"
                class="drink-liquid"
              >
                <div class="drink-foam"></div>
              </div>

              <strong
                id="drinkPlayerPercent"
                class="drink-glass-percent"
              >
                100%
              </strong>

            </div>

          </article>


          <div class="drink-game-vs">
            VS
          </div>


          <!-- ENEMY -->

          <article class="drink-enemy-card">

            <div class="drink-game-person">

              <div>

                <span>
                  ELLENFÉL
                </span>

                <strong id="drinkEnemyName">
                  Bulcsú
                </strong>

              </div>

            </div>


            <div
              id="drinkEnemyRank"
              class="drink-enemy-rank"
            >
              Csöves alkesz
            </div>


            <div class="drink-glass">

              <div
                id="drinkEnemyLiquid"
                class="drink-liquid"
              >
                <div class="drink-foam"></div>
              </div>

              <strong
                id="drinkEnemyPercent"
                class="drink-glass-percent"
              >
                100%
              </strong>

            </div>

          </article>

        </section>


        <section
          id="drinkStatus"
          class="drink-game-status"
          aria-live="polite"
        >

          <strong id="drinkSignal">
            KÉSZ?
          </strong>

          <span id="drinkStatusText">
            Egy vereség és visszaesel
            az első szintre.
          </span>

        </section>


        <section
          id="drinkTauntBox"
          class="drink-game-taunt"
          aria-live="polite"
        >

          <strong id="drinkTaunt">
            A kocsma még hisz benned.
          </strong>

        </section>


        <section class="drink-game-stats">

          <div>
            <strong id="drinkTapCount">
              0
            </strong>

            <span>
              korty
            </span>
          </div>


          <div>
            <strong id="drinkPenaltyCount">
              0
            </strong>

            <span>
              hiba
            </span>
          </div>


          <div>
            <strong id="drinkCombo">
              0×
            </strong>

            <span>
              combo
            </span>
          </div>

        </section>


        <button
          id="drinkSipButton"
          class="drink-sip-button"
          type="button"
          disabled
        >
          KORTY! 🍺
        </button>


        <button
          id="drinkStartButton"
          class="drink-start-button"
          type="button"
        >
          KÖR INDÍTÁSA
        </button>

      </main>

    </div>
  `;


  document.body.appendChild(modal);


  bindDrinkGameEvents();
  resetDrinkGame(false);
}


function bindDrinkGameEvents() {
  document
    .querySelector("#openDrinkGame")
    ?.addEventListener(
      "click",
      openDrinkGame
    );


  document
    .querySelector("#closeDrinkGame")
    ?.addEventListener(
      "click",
      closeDrinkGame
    );


  document
    .querySelector("#drinkStartButton")
    ?.addEventListener(
      "click",
      handleDrinkGameStart
    );


  document
    .querySelector("#drinkSipButton")
    ?.addEventListener(
      "click",
      handleDrinkSip
    );


  document.addEventListener(
    "keydown",
    (event) => {
      const modal =
        document.querySelector(
          "#drinkGameModal"
        );

      if (
        event.key === "Escape" &&
        modal &&
        !modal.hidden
      ) {
        closeDrinkGame();
      }
    }
  );
}


function openDrinkGame() {
  const modal =
    document.querySelector(
      "#drinkGameModal"
    );

  if (!modal) {
    return;
  }

  modal.hidden = false;

  document.body.classList.add(
    "drink-game-open"
  );

  resetDrinkGame(false);

  requestAnimationFrame(() => {
    document
      .querySelector(
        "#closeDrinkGame"
      )
      ?.focus();
  });
}


function closeDrinkGame() {
  clearDrinkGameTimers();

  drinkGame.active = false;

  const modal =
    document.querySelector(
      "#drinkGameModal"
    );

  if (modal) {
    modal.hidden = true;
  }

  document.body.classList.remove(
    "drink-game-open"
  );
}


function clearDrinkGameTimers() {
  clearInterval(
    drinkGame.cpuTimer
  );

  clearTimeout(
    drinkGame.trapTimer
  );

  clearInterval(
    drinkGame.slowTimer
  );

  clearInterval(
    drinkGame.countdownTimer
  );


  drinkGame.cpuTimer = null;
  drinkGame.trapTimer = null;
  drinkGame.slowTimer = null;
  drinkGame.countdownTimer = null;
}


function renderDrinkGame() {
  const level =
    drinkGameLevel();


  const playerLiquid =
    document.querySelector(
      "#drinkPlayerLiquid"
    );

  const enemyLiquid =
    document.querySelector(
      "#drinkEnemyLiquid"
    );


  playerLiquid.style.height =
    `${drinkGame.player}%`;

  enemyLiquid.style.height =
    `${drinkGame.enemy}%`;


  document.querySelector(
    "#drinkPlayerPercent"
  ).textContent =
    `${Math.ceil(drinkGame.player)}%`;


  document.querySelector(
    "#drinkEnemyPercent"
  ).textContent =
    `${Math.ceil(drinkGame.enemy)}%`;


  document.querySelector(
    "#drinkPlayerWins"
  ).textContent =
    `${drinkGame.wins} győzelem`;


  document.querySelector(
    "#drinkTapCount"
  ).textContent =
    drinkGame.taps;


  document.querySelector(
    "#drinkPenaltyCount"
  ).textContent =
    drinkGame.penalties;


  document.querySelector(
    "#drinkCombo"
  ).textContent =
    `${drinkGame.combo}×`;


  document.querySelector(
    "#drinkPlayerRank"
  ).textContent =
    level.playerRank;


  document.querySelector(
    "#drinkLevelNumber"
  ).textContent =
    drinkGame.level + 1;


  document.querySelector(
    "#drinkChallengeName"
  ).textContent =
    level.name;


  document.querySelector(
    "#drinkEnemyName"
  ).textContent =
    level.enemy.name;


  document.querySelector(
    "#drinkEnemyRank"
  ).textContent =
    level.enemy.rank;


  const progress =
    (
      (drinkGame.level + 1) /
      DRINK_GAME_LEVELS.length
    ) * 100;


  document.querySelector(
    "#drinkRankProgress"
  ).style.width =
    `${progress}%`;


  const next =
    DRINK_GAME_LEVELS[
      drinkGame.level + 1
    ];


  document.querySelector(
    "#drinkNextRank"
  ).textContent =
    next
      ? `Következő rang: ${next.playerRank}`
      : "MAX RANG";


  const rules =
    document.querySelector(
      "#drinkRules"
    );


  rules.innerHTML =
    level.ruleLabels
      .map(
        (rule) => `
          <span>
            ${rule}
          </span>
        `
      )
      .join("");
}


function setDrinkStatus(
  headline,
  text
) {
  document.querySelector(
    "#drinkSignal"
  ).textContent =
    headline;

  document.querySelector(
    "#drinkStatusText"
  ).textContent =
    text;
}


function showDrinkTaunt(text) {
  const box =
    document.querySelector(
      "#drinkTauntBox"
    );

  document.querySelector(
    "#drinkTaunt"
  ).textContent =
    text;


  box.classList.remove(
    "is-popping"
  );

  void box.offsetWidth;

  box.classList.add(
    "is-popping"
  );
}


function drinkPenalty(
  message,
  amount
) {
  drinkGame.penalties += 1;
  drinkGame.combo = 0;

  drinkGame.player =
    drinkGameClamp(
      drinkGame.player + amount
    );


  const glass =
    document.querySelector(
      "#drinkPlayerGlass"
    );

  glass.classList.remove(
    "is-shaking"
  );

  void glass.offsetWidth;

  glass.classList.add(
    "is-shaking"
  );


  setDrinkStatus(
    "HIBA!",
    message
  );


  showDrinkTaunt(
    drinkGameRandom(
      DRINK_GAME_MISTAKE_TAUNTS
    )
  );


  renderDrinkGame();
}


function scheduleDrinkTrap() {
  clearTimeout(
    drinkGame.trapTimer
  );


  if (
    !drinkGame.active ||
    !drinkGameHasRule("red")
  ) {
    return;
  }


  drinkGame.trapTimer =
    setTimeout(
      () => {
        if (!drinkGame.active) {
          return;
        }


        drinkGame.trap = true;


        setDrinkStatus(
          "NE NYOMD! ✋",
          "Piros lámpa!"
        );


        setTimeout(
          () => {
            if (!drinkGame.active) {
              return;
            }


            drinkGame.trap = false;


            setDrinkStatus(
              "KORTY!",
              "Mehet tovább."
            );


            scheduleDrinkTrap();
          },
          650 +
            Math.random() * 650
        );
      },
      1200 +
        Math.random() * 2000
    );
}


function startDrinkSlowRule() {
  clearInterval(
    drinkGame.slowTimer
  );


  if (
    !drinkGameHasRule("slow")
  ) {
    return;
  }


  drinkGame.slowTimer =
    setInterval(
      () => {
        if (!drinkGame.active) {
          return;
        }


        if (
          performance.now() -
            drinkGame.lastGoodTap >
          1400
        ) {
          drinkPenalty(
            "Túl sokat tököltél: +4%",
            4
          );


          drinkGame.lastGoodTap =
            performance.now();
        }
      },
      500
    );
}


function startDrinkEnemy() {
  const level =
    drinkGameLevel();


  drinkGame.cpuTimer =
    setInterval(
      () => {
        if (!drinkGame.active) {
          return;
        }


        drinkGame.enemy =
          drinkGameClamp(
            drinkGame.enemy -
              (
                1.45 +
                Math.random() * 1.45
              )
          );


        renderDrinkGame();


        if (
          drinkGame.enemy <= 0
        ) {
          loseDrinkGame();
        }
      },
      level.cpuInterval
    );
}


function beginDrinkRound() {
  clearDrinkGameTimers();


  drinkGame.player = 100;
  drinkGame.enemy = 100;

  drinkGame.taps = 0;
  drinkGame.penalties = 0;
  drinkGame.combo = 0;

  drinkGame.trap = false;
  drinkGame.active = false;
  drinkGame.gameOver = false;

  drinkGame.lastTap = 0;
  drinkGame.lastGoodTap =
    performance.now();


  const button =
    document.querySelector(
      "#drinkSipButton"
    );

  const startButton =
    document.querySelector(
      "#drinkStartButton"
    );


  button.disabled = true;
  startButton.disabled = true;


  renderDrinkGame();


  showDrinkTaunt(
    `${drinkGameLevel().enemy.name} vár rád.`
  );


  let countdown = 3;


  setDrinkStatus(
    countdown,
    drinkGameLevel().name
  );


  drinkGame.countdownTimer =
    setInterval(
      () => {
        countdown -= 1;


        if (countdown > 0) {
          setDrinkStatus(
            countdown,
            drinkGameLevel().name
          );

          return;
        }


        clearInterval(
          drinkGame.countdownTimer
        );


        drinkGame.countdownTimer =
          null;


        drinkGame.active = true;

        drinkGame.lastGoodTap =
          performance.now();


        setDrinkStatus(
          "KORTY!",
          `${drinkGameLevel().enemy.name} ellen rajta!`
        );


        button.disabled = false;


        startDrinkEnemy();
        scheduleDrinkTrap();
        startDrinkSlowRule();
      },
      650
    );
}


function handleDrinkSip() {
  if (!drinkGame.active) {
    return;
  }


  const now =
    performance.now();


  drinkGame.taps += 1;


  /* STOP */

  if (drinkGame.trap) {
    drinkPenalty(
      "STOP-nál nyomtál: +10%",
      10
    );

    drinkGame.lastTap = now;

    return;
  }


  /* TÚL GYORS */

  if (
    drinkGameHasRule("fast") &&
    drinkGame.lastTap &&
    now - drinkGame.lastTap < 165
  ) {
    drinkPenalty(
      "Úgy vered a gombot, mint a liftet: +7%",
      7
    );

    drinkGame.lastTap = now;

    return;
  }


  /* MINDEN MÁSODIK */

  if (
    drinkGameHasRule("second") &&
    drinkGame.taps % 2 === 0
  ) {
    drinkPenalty(
      "A második korty átkozott: +5%",
      5
    );

    drinkGame.lastTap = now;

    drinkGame.lastGoodTap = now;

    return;
  }


  /* JÓ KORTY */

  let drain =
    3.4 +
    Math.random() * 1.8;


  drinkGame.combo += 1;


  if (
    drinkGame.combo >= 6
  ) {
    drain += 1.5;
  }


  if (
    drinkGame.combo >= 12
  ) {
    drain += 1.5;
  }


  drinkGame.player =
    drinkGameClamp(
      drinkGame.player - drain
    );


  drinkGame.lastTap = now;
  drinkGame.lastGoodTap = now;


  if (
    drinkGame.combo === 6 ||
    drinkGame.combo === 12 ||
    drinkGame.combo === 18
  ) {
    showDrinkTaunt(
      drinkGameRandom(
        DRINK_GAME_WIN_TAUNTS
      )
    );
  }


  renderDrinkGame();


  if (
    drinkGame.player <= 0
  ) {
    winDrinkRound();
  }
}


function winDrinkRound() {
  if (!drinkGame.active) {
    return;
  }


  drinkGame.active = false;
  drinkGame.wins += 1;


  clearDrinkGameTimers();


  document.querySelector(
    "#drinkSipButton"
  ).disabled = true;


  const level =
    drinkGameLevel();


  /* BOSS LEGYŐZVE */

  if (
    drinkGame.level ===
    DRINK_GAME_LEVELS.length - 1
  ) {
    drinkGame.gameOver = true;


    setDrinkStatus(
      "LEGENDÁS MÁJLOVAG 👑",
      `${level.enemy.name}, a ${level.enemy.rank} is elbukott.`
    );


    showDrinkTaunt(
      "A PULT HIVATALOSAN A TIÉD. 👑"
    );


    const button =
      document.querySelector(
        "#drinkStartButton"
      );


    button.disabled = false;

    button.textContent =
      "ÚJ MENET";


    renderDrinkGame();

    return;
  }


  const next =
    DRINK_GAME_LEVELS[
      drinkGame.level + 1
    ];


  setDrinkStatus(
    "SZINT TELJESÍTVE! 🏆",
    `${level.enemy.name} elbukott. Következik ${next.enemy.name}.`
  );


  showDrinkTaunt(
    drinkGameRandom(
      DRINK_GAME_WIN_TAUNTS
    )
  );


  document.querySelector(
    "#drinkStartButton"
  ).disabled = false;


  document.querySelector(
    "#drinkStartButton"
  ).textContent =
    "KÖVETKEZŐ SZINT";


  renderDrinkGame();
}


function loseDrinkGame() {
  if (!drinkGame.active) {
    return;
  }


  drinkGame.active = false;
  drinkGame.gameOver = true;


  clearDrinkGameTimers();


  document.querySelector(
    "#drinkSipButton"
  ).disabled = true;


  const level =
    drinkGameLevel();


  setDrinkStatus(
    "MEGBUKTÁL. 💀",
    `${level.enemy.name}, a ${level.enemy.rank} elvert.`
  );


  showDrinkTaunt(
    `SZÉGYELLD MAGAD. ${level.enemy.name.toUpperCase()} ELVERT. VISSZA AZ ELSŐ SZINTRE. 😭`
  );


  const button =
    document.querySelector(
      "#drinkStartButton"
    );


  button.disabled = false;

  button.textContent =
    "ÚJRAKEZDEM AZ ELEJÉRŐL";


  renderDrinkGame();
}


function handleDrinkGameStart() {
  if (drinkGame.active) {
    return;
  }


  /* bukás vagy teljes végigjátszás */

  if (drinkGame.gameOver) {
    resetDrinkGame(true);

    return;
  }


  /* következő szint */

  if (
    drinkGame.wins > 0
  ) {
    drinkGame.level += 1;
  }


  beginDrinkRound();
}


function resetDrinkGame(
  autoStart = false
) {
  clearDrinkGameTimers();


  drinkGame.level = 0;

  drinkGame.player = 100;
  drinkGame.enemy = 100;

  drinkGame.wins = 0;

  drinkGame.taps = 0;
  drinkGame.penalties = 0;
  drinkGame.combo = 0;

  drinkGame.active = false;
  drinkGame.trap = false;
  drinkGame.gameOver = false;

  drinkGame.lastTap = 0;
  drinkGame.lastGoodTap = 0;


  const sip =
    document.querySelector(
      "#drinkSipButton"
    );


  const start =
    document.querySelector(
      "#drinkStartButton"
    );


  if (sip) {
    sip.disabled = true;
  }


  if (start) {
    start.disabled = false;

    start.textContent =
      "KÖR INDÍTÁSA";
  }


  setDrinkStatus(
    "KÉSZ?",
    "Egy vereség és visszaesel az első szintre."
  );


  showDrinkTaunt(
    "A kocsma még hisz benned."
  );


  renderDrinkGame();


  if (autoStart) {
    beginDrinkRound();
  }
}


initDrinkGame();