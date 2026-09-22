const DRINK_GAME_LEVELS = [
  {
    playerRank: "Kezdő kortyoló",
    name: "Bemelegítés",

    enemy: {
      name: "Bulcsú",
      rank: "Csöves alkesz",
      emoji: "🥴",
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
      emoji: "🧔",
    },

    rules: ["red"],
    ruleLabels: [
      "✋ STOP-nál ne nyomd",
    ],

    cpuInterval: 255,
  },

  {
    playerRank: "Pultpajtás",
    name: "Átkozott korsó",

    enemy: {
      name: "Géza",
      rank: "Pultszéli veterán",
      emoji: "👨‍🦳",
    },

    rules: ["second"],
    ruleLabels: [
      "↩️ Minden 2. korty visszatölt",
    ],

    cpuInterval: 245,
  },

  {
    playerRank: "Habharcos",
    name: "Ne spameld!",

    enemy: {
      name: "Árpád",
      rank: "Korsóharcos",
      emoji: "🧔‍♂️",
    },

    rules: ["fast"],
    ruleLabels: [
      "⚠️ Túl gyors nyomás büntet",
    ],

    cpuInterval: 235,
  },

  {
    playerRank: "Korsókirály-jelölt",
    name: "Tartsd a tempót",

    enemy: {
      name: "Levente",
      rank: "Sörcápa",
      emoji: "😈",
    },

    rules: ["slow"],
    ruleLabels: [
      "⏱️ Ha vársz, visszatölt",
    ],

    cpuInterval: 225,
  },

  {
    playerRank: "Kocsmai veterán",
    name: "Ritmuszavar",

    enemy: {
      name: "Botond",
      rank: "Kocsma bajnoka",
      emoji: "😤",
    },

    rules: [
      "red",
      "fast",
    ],

    ruleLabels: [
      "✋ STOP",
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
      emoji: "👹",
    },

    rules: [
      "second",
      "slow",
    ],

    ruleLabels: [
      "↩️ Minden 2. visszatölt",
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
      emoji: "👑",
    },

    rules: [
      "red",
      "second",
      "fast",
      "slow",
    ],

    ruleLabels: [
      "✋ STOP",
      "↩️ Minden 2.",
      "⚠️ Ne spameld",
      "⏱️ Ne lassíts",
    ],

    cpuInterval: 190,
  },
];


/* =========================================================
   BESZÓLÁSOK
   ========================================================= */

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
  "Anyád büszke lenne. Talán.",
  "Még egy ilyen és kapsz egy szívószálat.",
  "A korsó látványosan csalódott benned.",
];


const DRINK_GAME_GOOD_TAUNTS = [
  "Na jó, ez már emberes volt. 🔥",
  "Bécs kezd félni tőled.",
  "A pultos elismerően bólintott.",
  "Ez már nem turista tempó.",
  "A Railjet személyzete büszke lenne.",
  "Kezdesz veszélyessé válni.",
  "A korsó kezd megbánni mindent.",
  "Na végre, valami életjel.",
];


const DRINK_GAME_BANTER = [
  "Mire te végzel, a Railjet már visszaért Budapestre.",
  "A Práter óriáskereke gyorsabban forog nálad.",
  "Bécsbe kijutottál, a korsó aljáig már nem fogsz.",
  "Még a Wiener Linien is gyorsabb nálad.",
  "A Stephansdomot hamarabb felújítják.",
  "Schönbrunnban a sövény gyorsabban nő.",
  "Ennyi erővel rendelj egy pohár vizet.",
  "A bécsi pincér már hozná a számlát.",
  "Mire végzel, indul a másnapi Railjet.",
  "A korsó kezd unatkozni.",
  "Ez Bécs, nem wellness hétvége.",
  "A pultos már azt hiszi, csak fotózod.",
  "A sör lassan szobahőmérsékletű lesz.",
  "A Karlsplatzon gyorsabban találsz kijáratot.",
  "A Westbahnhof galambjai már fogadnak ellened.",
  "A Naschmarkton már bezárt három büfé.",
  "Mozogj, mert lekéssük az utolsó U-Bahnt.",
  "A schnitzeled kihűlt, mire ezt megiszod.",
  "Még a Semmeringre is felérünk előbb.",
];


const DRINK_GAME_LOSS_TAUNTS = [
  "TE CSICSKA. 😭",
  "SZÉGYELLD MAGAD.",
  "ENNYIT ÉRSZ.",
  "SENKI VAGY.",
  "A KORSÓ GYŐZÖTT. TE NEM.",
  "EZÉRT KÁR VOLT BÉCSIG ELJÖNNI.",
  "A PULTOS LETAGADJA, HOGY ISMER.",
  "HAZA LEHET MENNI.",
  "A RAILJETEN TÖBB TARTÁS VAN, MINT BENNED.",
  "BÉCS NEM VOLT FELKÉSZÜLVE EKKORA CSALÓDÁSRA.",
  "MÉG A WESTBAHNHOF GALAMBJA IS JOBB LENNE.",
  "EZT MÉG A SCHÖNBRUNNI LOVAK IS KIRÖHÖGTÉK.",
  "A KOCSMA VISSZAVONTA A BELÉPÉSI ENGEDÉLYEDET.",
  "ILYEN TELJESÍTMÉNNYEL MARAD A MÁLNASZÖRP.",
  "A BÉCSI PULTOS MOST KÉR BOCSÁNATOT A KORSÓTÓL.",
];


const DRINK_GAME_BOSS_TAUNTS = [
  "Vajk nem ellenfél. Vajk egy életforma.",
  "A főalkesz felébredt.",
  "Innen már nincs visszaút.",
  "Vajk eddig csak bemelegített.",
  "A pult elcsendesedett. Megérkezett a boss.",
];


/* =========================================================
   GAME STATE
   ========================================================= */

const drinkGame = {
  level: 0,

  player: 100,
  enemy: 100,

  active: false,
  trap: false,

  gameOver: false,
  roundWon: false,

  taps: 0,
  combo: 0,
  penalties: 0,

  lastTap: 0,
  lastGoodTap: 0,

  cpuTimer: null,
  trapTimer: null,
  slowTimer: null,
  countdownTimer: null,

  banterTimer: null,
  tauntHideTimer: null,
};


/* =========================================================
   HELPERS
   ========================================================= */

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


function drinkGameRandom(array) {
  return array[
    Math.floor(
      Math.random() * array.length
    )
  ];
}


function drinkGameClamp(value) {
  return Math.max(
    0,
    Math.min(100, value)
  );
}


/* =========================================================
   BUILD UI
   ========================================================= */

function initDrinkGame() {
  const mount =
    document.querySelector(
      "#drinkGame"
    );

  if (!mount) {
    return;
  }


  /* -------------------------------------------------------
     OLDALON LÉVŐ INDÍTÓ KÁRTYA
     ------------------------------------------------------- */

  mount.innerHTML = `
    <div class="drink-game-teaser">

      <div class="drink-game-teaser__main">

        <div class="drink-game-teaser__icon">
          🍺
        </div>

        <div>

          <span>
            KOCSMAI KIHÍVÁS
          </span>

          <h2>
            Kiissza előbb?
          </h2>

          <p>
            8 ellenfél · egy élet ·
            bukás = vissza az elejére
          </p>

        </div>

      </div>


      <button
        id="openDrinkGame"
        class="drink-game-launch"
        type="button"
      >

        <span>
          🎮 JÁTÉK INDÍTÁSA
        </span>

        <strong>
          🍺 VS 🍺
        </strong>

      </button>

    </div>
  `;


  /* -------------------------------------------------------
     FULLSCREEN MODAL
     ------------------------------------------------------- */

  const modal =
    document.createElement("div");

  modal.id =
    "drinkGameModal";

  modal.className =
    "drink-game-modal";

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

      <header class="drink-game-topbar">

        <div>

          <small>
            KIISSZA ELŐBB?
          </small>

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

      </header>


      <main class="drink-game-content">

        <!-- HUD -->

        <section class="drink-game-hud">

          <div class="drink-game-hud__level">

            <span>
              SZINT
            </span>

            <strong>
              <span id="drinkLevelNumber">
                1
              </span>
              / 8
            </strong>

          </div>


          <div class="drink-game-hud__middle">

            <span id="drinkPlayerRank">
              Kezdő kortyoló
            </span>

            <strong id="drinkChallengeName">
              Bemelegítés
            </strong>

          </div>


          <div
            id="drinkRules"
            class="drink-game-rules"
          ></div>


          <div class="drink-game-progress">

            <div
              id="drinkRankProgress"
              class="drink-game-progress__fill"
            ></div>

          </div>

        </section>


        <!-- ARENA -->

        <section
          id="drinkGameArena"
          class="drink-game-arena"
        >

          <!-- PLAYER -->

          <article class="drink-fighter">

            <div class="drink-fighter__head">

              <div class="drink-avatar">
                😎
              </div>

              <div>

                <span>
                  TE
                </span>

                <strong>
                  Játékos
                </strong>

              </div>

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

                <i class="drink-bubble drink-bubble--1"></i>
                <i class="drink-bubble drink-bubble--2"></i>
                <i class="drink-bubble drink-bubble--3"></i>
                <i class="drink-bubble drink-bubble--4"></i>

              </div>


              <strong
                id="drinkPlayerPercent"
                class="drink-glass-percent"
              >
                100%
              </strong>

            </div>

          </article>


          <!-- VS -->

          <div class="drink-game-vs">
            <span>
              VS
            </span>
          </div>


          <!-- ENEMY -->

          <article
            class="
              drink-fighter
              drink-fighter--enemy
            "
          >

            <div class="drink-fighter__head">

              <div
                id="drinkEnemyEmoji"
                class="
                  drink-avatar
                  drink-avatar--enemy
                "
              >
                🥴
              </div>

              <div>

                <span>
                  ELLENFÉL
                </span>

                <strong id="drinkEnemyName">
                  Bulcsú
                </strong>

                <small id="drinkEnemyRank">
                  Csöves alkesz
                </small>

              </div>

            </div>


            <div class="drink-glass">

              <div
                id="drinkEnemyLiquid"
                class="drink-liquid"
              >

                <div class="drink-foam"></div>

                <i class="drink-bubble drink-bubble--1"></i>
                <i class="drink-bubble drink-bubble--2"></i>
                <i class="drink-bubble drink-bubble--3"></i>
                <i class="drink-bubble drink-bubble--4"></i>

              </div>


              <strong
                id="drinkEnemyPercent"
                class="drink-glass-percent"
              >
                100%
              </strong>

            </div>

          </article>


          <!-- JÁTÉK KÖZBENI BESZÓLÁS -->

          <div
            id="drinkArenaTaunt"
            class="drink-arena-taunt"
            aria-live="polite"
          >
            <span
              id="drinkArenaTauntText"
            ></span>
          </div>


          <!-- START / NEXT / LOSS OVERLAY -->

          <div
            id="drinkActionOverlay"
            class="
              drink-action-overlay
              is-visible
            "
          >

            <div class="drink-action-box">

              <strong
                id="drinkActionTitle"
                class="drink-action-title"
                hidden
              ></strong>

              <span
                id="drinkActionHint"
                class="drink-action-hint"
              >
                EGY ÉLETED VAN
              </span>

              <button
                id="drinkStartButton"
                class="drink-start-button"
                type="button"
              >
                KÖR INDÍTÁSA
              </button>

            </div>

          </div>

        </section>


        <!-- MESSAGE BAR -->

        <section
          id="drinkMessage"
          class="drink-game-message"
          aria-live="polite"
        >

          <div>

            <strong id="drinkSignal">
              KÉSZ?
            </strong>

            <span id="drinkStatusText">
              Egy vereség és vissza az első szintre.
            </span>

          </div>


          <em id="drinkTaunt">
            A kocsma még hisz benned.
          </em>

        </section>


        <!-- KORTY -->

        <button
          id="drinkSipButton"
          class="drink-sip-button"
          type="button"
          disabled
        >
          KORTY! 🍺
        </button>

      </main>

    </div>
  `;


  document.body.appendChild(
    modal
  );


  bindDrinkGameEvents();

  resetDrinkGame();
}


/* =========================================================
   EVENTS
   ========================================================= */

function bindDrinkGameEvents() {
  document
    .querySelector(
      "#openDrinkGame"
    )
    ?.addEventListener(
      "click",
      openDrinkGame
    );


  document
    .querySelector(
      "#closeDrinkGame"
    )
    ?.addEventListener(
      "click",
      closeDrinkGame
    );


  document
    .querySelector(
      "#drinkStartButton"
    )
    ?.addEventListener(
      "click",
      handleDrinkGameStart
    );


  document
    .querySelector(
      "#drinkSipButton"
    )
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


/* =========================================================
   OPEN / CLOSE
   ========================================================= */

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


  resetDrinkGame();


  requestAnimationFrame(
    () => {
      document
        .querySelector(
          "#drinkStartButton"
        )
        ?.focus();
    }
  );
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


/* =========================================================
   TIMERS
   ========================================================= */

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

  clearTimeout(
    drinkGame.banterTimer
  );

  clearTimeout(
    drinkGame.tauntHideTimer
  );


  drinkGame.cpuTimer = null;
  drinkGame.trapTimer = null;
  drinkGame.slowTimer = null;
  drinkGame.countdownTimer = null;
  drinkGame.banterTimer = null;
  drinkGame.tauntHideTimer = null;
}


/* =========================================================
   RENDER
   ========================================================= */

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


  if (
    !playerLiquid ||
    !enemyLiquid
  ) {
    return;
  }


  playerLiquid.style.height =
    `${drinkGame.player}%`;


  enemyLiquid.style.height =
    `${drinkGame.enemy}%`;


  document.querySelector(
    "#drinkPlayerPercent"
  ).textContent =
    `${Math.ceil(
      drinkGame.player
    )}%`;


  document.querySelector(
    "#drinkEnemyPercent"
  ).textContent =
    `${Math.ceil(
      drinkGame.enemy
    )}%`;


  document.querySelector(
    "#drinkLevelNumber"
  ).textContent =
    drinkGame.level + 1;


  document.querySelector(
    "#drinkPlayerRank"
  ).textContent =
    level.playerRank;


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


  document.querySelector(
    "#drinkEnemyEmoji"
  ).textContent =
    level.enemy.emoji;


  const progress =
    (
      (
        drinkGame.level + 1
      ) /
      DRINK_GAME_LEVELS.length
    ) *
    100;


  document.querySelector(
    "#drinkRankProgress"
  ).style.width =
    `${progress}%`;


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


  const arena =
    document.querySelector(
      "#drinkGameArena"
    );


  arena.classList.toggle(
    "is-boss",
    drinkGame.level ===
      DRINK_GAME_LEVELS.length - 1
  );
}


/* =========================================================
   STATUS
   ========================================================= */

function setDrinkStatus(
  title,
  text
) {
  const signal =
    document.querySelector(
      "#drinkSignal"
    );

  const status =
    document.querySelector(
      "#drinkStatusText"
    );


  if (signal) {
    signal.textContent =
      title;
  }


  if (status) {
    status.textContent =
      text;
  }
}


/* =========================================================
   BESZÓLÁSOK
   ========================================================= */

function showDrinkTaunt(text) {
  const message =
    document.querySelector(
      "#drinkMessage"
    );

  const normalTaunt =
    document.querySelector(
      "#drinkTaunt"
    );


  if (normalTaunt) {
    normalTaunt.textContent =
      text;
  }


  if (message) {
    message.classList.remove(
      "is-popping"
    );

    void message.offsetWidth;

    message.classList.add(
      "is-popping"
    );
  }


  showDrinkArenaTaunt(text);
}


function showDrinkArenaTaunt(text) {
  const bubble =
    document.querySelector(
      "#drinkArenaTaunt"
    );

  const textElement =
    document.querySelector(
      "#drinkArenaTauntText"
    );


  if (
    !bubble ||
    !textElement
  ) {
    return;
  }


  clearTimeout(
    drinkGame.tauntHideTimer
  );


  textElement.textContent =
    text;


  bubble.classList.remove(
    "is-visible"
  );


  void bubble.offsetWidth;


  bubble.classList.add(
    "is-visible"
  );


  drinkGame.tauntHideTimer =
    setTimeout(
      () => {
        bubble.classList.remove(
          "is-visible"
        );
      },
      1900
    );
}


function scheduleDrinkBanter() {
  clearTimeout(
    drinkGame.banterTimer
  );


  if (!drinkGame.active) {
    return;
  }


  drinkGame.banterTimer =
    setTimeout(
      () => {
        if (!drinkGame.active) {
          return;
        }


        if (!drinkGame.trap) {
          const enemy =
            drinkGameLevel().enemy;


          const text =
            drinkGameRandom(
              DRINK_GAME_BANTER
            );


          showDrinkArenaTaunt(
            `${enemy.name}: „${text}”`
          );
        }


        scheduleDrinkBanter();
      },
      2300 +
        Math.random() * 2100
    );
}


/* =========================================================
   CENTRAL ACTION OVERLAY
   ========================================================= */

function showDrinkAction(
  label,
  hint = "",
  title = "",
  danger = false
) {
  const overlay =
    document.querySelector(
      "#drinkActionOverlay"
    );

  const titleElement =
    document.querySelector(
      "#drinkActionTitle"
    );

  const hintElement =
    document.querySelector(
      "#drinkActionHint"
    );

  const button =
    document.querySelector(
      "#drinkStartButton"
    );


  if (!overlay) {
    return;
  }


  if (titleElement) {
    titleElement.textContent =
      title;

    titleElement.hidden =
      !title;
  }


  if (hintElement) {
    hintElement.textContent =
      hint;
  }


  if (button) {
    button.textContent =
      label;
  }


  overlay.classList.toggle(
    "is-danger",
    danger
  );


  overlay.classList.add(
    "is-visible"
  );
}


function hideDrinkAction() {
  const overlay =
    document.querySelector(
      "#drinkActionOverlay"
    );


  if (!overlay) {
    return;
  }


  overlay.classList.remove(
    "is-visible",
    "is-danger"
  );
}


/* =========================================================
   KORTY BUTTON
   ========================================================= */

function setDrinkSipVisible(
  visible
) {
  const button =
    document.querySelector(
      "#drinkSipButton"
    );


  if (!button) {
    return;
  }


  button.disabled =
    !visible;


  button.classList.toggle(
    "is-visible",
    visible
  );
}


/* =========================================================
   PENALTY
   ========================================================= */

function drinkPenalty(
  message,
  amount
) {
  drinkGame.penalties += 1;

  drinkGame.combo = 0;


  drinkGame.player =
    drinkGameClamp(
      drinkGame.player +
        amount
    );


  const glass =
    document.querySelector(
      "#drinkPlayerGlass"
    );


  if (glass) {
    glass.classList.remove(
      "is-shaking"
    );

    void glass.offsetWidth;

    glass.classList.add(
      "is-shaking"
    );
  }


  setDrinkStatus(
    "HIBA! 💀",
    message
  );


  showDrinkTaunt(
    drinkGameRandom(
      DRINK_GAME_MISTAKE_TAUNTS
    )
  );


  renderDrinkGame();
}


/* =========================================================
   SIP ANIMATION
   ========================================================= */

function animateGoodSip() {
  const glass =
    document.querySelector(
      "#drinkPlayerGlass"
    );


  if (!glass) {
    return;
  }


  glass.classList.remove(
    "is-sipping"
  );


  void glass.offsetWidth;


  glass.classList.add(
    "is-sipping"
  );
}


/* =========================================================
   STOP RULE
   ========================================================= */

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


        const arena =
          document.querySelector(
            "#drinkGameArena"
          );


        arena?.classList.add(
          "is-stop"
        );


        setDrinkStatus(
          "NE NYOMD! ✋",
          "PIROS LÁMPA"
        );


        showDrinkArenaTaunt(
          "MOST NE NYOMD, TE ÁLLAT. ✋"
        );


        setTimeout(
          () => {
            if (!drinkGame.active) {
              return;
            }


            drinkGame.trap = false;


            arena?.classList.remove(
              "is-stop"
            );


            setDrinkStatus(
              "KORTY! 🍺",
              "Mehet tovább."
            );


            scheduleDrinkTrap();
          },
          650 +
            Math.random() *
              650
        );
      },
      1200 +
        Math.random() *
          2000
    );
}


/* =========================================================
   SLOW RULE
   ========================================================= */

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


/* =========================================================
   ENEMY
   ========================================================= */

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
                Math.random() *
                  1.45
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


/* =========================================================
   ROUND START
   ========================================================= */

function beginDrinkRound() {
  clearDrinkGameTimers();


  drinkGame.player = 100;
  drinkGame.enemy = 100;

  drinkGame.taps = 0;
  drinkGame.combo = 0;
  drinkGame.penalties = 0;

  drinkGame.trap = false;
  drinkGame.active = false;

  drinkGame.gameOver = false;
  drinkGame.roundWon = false;

  drinkGame.lastTap = 0;

  drinkGame.lastGoodTap =
    performance.now();


  const arena =
    document.querySelector(
      "#drinkGameArena"
    );


  arena?.classList.remove(
    "is-stop"
  );


  hideDrinkAction();

  setDrinkSipVisible(false);

  renderDrinkGame();


  const level =
    drinkGameLevel();

  const enemy =
    level.enemy;


  if (
    drinkGame.level ===
    DRINK_GAME_LEVELS.length - 1
  ) {
    showDrinkTaunt(
      drinkGameRandom(
        DRINK_GAME_BOSS_TAUNTS
      )
    );
  } else {
    showDrinkTaunt(
      `${enemy.name} már vár rád.`
    );
  }


  let countdown = 3;


  setDrinkStatus(
    countdown,
    `${enemy.name} · ${enemy.rank}`
  );


  drinkGame.countdownTimer =
    setInterval(
      () => {
        countdown -= 1;


        if (
          countdown > 0
        ) {
          setDrinkStatus(
            countdown,
            `${enemy.name} · ${enemy.rank}`
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
          "KORTY! 🍺",
          `${enemy.name} ellen rajta!`
        );


        setDrinkSipVisible(true);

        startDrinkEnemy();

        scheduleDrinkTrap();

        startDrinkSlowRule();

        scheduleDrinkBanter();
      },
      650
    );
}


/* =========================================================
   PLAYER TAP
   ========================================================= */

function handleDrinkSip() {
  if (!drinkGame.active) {
    return;
  }


  const now =
    performance.now();


  drinkGame.taps += 1;


  /* -------------------------------------------------------
     STOP
     ------------------------------------------------------- */

  if (drinkGame.trap) {
    drinkPenalty(
      "STOP-nál nyomtál: +10%",
      10
    );


    drinkGame.lastTap =
      now;


    return;
  }


  /* -------------------------------------------------------
     TÚL GYORS
     ------------------------------------------------------- */

  if (
    drinkGameHasRule("fast") &&
    drinkGame.lastTap &&
    now -
      drinkGame.lastTap <
      165
  ) {
    drinkPenalty(
      "Úgy vered, mint a liftgombot: +7%",
      7
    );


    drinkGame.lastTap =
      now;


    return;
  }


  /* -------------------------------------------------------
     MINDEN MÁSODIK
     ------------------------------------------------------- */

  if (
    drinkGameHasRule("second") &&
    drinkGame.taps %
      2 ===
      0
  ) {
    drinkPenalty(
      "Az átkozott második korty: +5%",
      5
    );


    drinkGame.lastTap =
      now;


    drinkGame.lastGoodTap =
      now;


    return;
  }


  /* -------------------------------------------------------
     JÓ KORTY
     ------------------------------------------------------- */

  let drain =
    3.4 +
    Math.random() *
      1.8;


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
      drinkGame.player -
        drain
    );


  drinkGame.lastTap =
    now;


  drinkGame.lastGoodTap =
    now;


  animateGoodSip();


  if (
    drinkGame.combo === 6 ||
    drinkGame.combo === 12 ||
    drinkGame.combo === 18
  ) {
    showDrinkTaunt(
      drinkGameRandom(
        DRINK_GAME_GOOD_TAUNTS
      )
    );
  }


  if (
    drinkGame.combo >= 12
  ) {
    setDrinkStatus(
      "🔥 ŐRÜLT TEMPÓ",
      "Ne állj le!"
    );
  } else if (
    drinkGame.combo >= 6
  ) {
    setDrinkStatus(
      "🔥 SZÉP",
      "Megvan a ritmus!"
    );
  }


  renderDrinkGame();


  if (
    drinkGame.player <= 0
  ) {
    winDrinkRound();
  }
}


/* =========================================================
   ROUND WIN
   ========================================================= */

function winDrinkRound() {
  if (!drinkGame.active) {
    return;
  }


  drinkGame.active = false;

  drinkGame.roundWon = true;


  clearDrinkGameTimers();

  setDrinkSipVisible(false);


  const level =
    drinkGameLevel();


  /* -------------------------------------------------------
     BOSS LEGYŐZVE
     ------------------------------------------------------- */

  if (
    drinkGame.level ===
    DRINK_GAME_LEVELS.length - 1
  ) {
    drinkGame.gameOver = true;


    setDrinkStatus(
      "GYŐZELEM 👑",
      `${level.enemy.name}, a ${level.enemy.rank} is elbukott.`
    );


    showDrinkTaunt(
      "A PULT HIVATALOSAN A TIÉD. 👑"
    );


    showDrinkAction(
      "ÚJ MENET",
      "🏆 MIND A 8 ELLENFÉL ELBUKOTT",
      "LEGENDÁS MÁJLOVAG 👑"
    );


    return;
  }


  const next =
    DRINK_GAME_LEVELS[
      drinkGame.level + 1
    ];


  setDrinkStatus(
    "ELVERTED! 🏆",
    `${level.enemy.name} kiesett.`
  );


  showDrinkTaunt(
    drinkGameRandom(
      DRINK_GAME_GOOD_TAUNTS
    )
  );


  showDrinkAction(
    "KÖVETKEZŐ SZINT",
    `KÖVETKEZIK: ${next.enemy.name.toUpperCase()}`,
    `${level.enemy.name.toUpperCase()} ELBUKOTT`
  );
}


/* =========================================================
   LOSS
   ========================================================= */

function loseDrinkGame() {
  if (!drinkGame.active) {
    return;
  }


  drinkGame.active = false;

  drinkGame.gameOver = true;

  drinkGame.roundWon = false;


  clearDrinkGameTimers();

  setDrinkSipVisible(false);


  const level =
    drinkGameLevel();


  const insult =
    drinkGameRandom(
      DRINK_GAME_LOSS_TAUNTS
    );


  setDrinkStatus(
    "KIKAPTÁL 💀",
    `${level.enemy.name}, a ${level.enemy.rank} elvert.`
  );


  const bubble =
    document.querySelector(
      "#drinkArenaTaunt"
    );


  bubble?.classList.remove(
    "is-visible"
  );


  showDrinkAction(
    "ÚJRAKEZDEM AZ ELEJÉRŐL",
    `${level.enemy.name.toUpperCase()} ELVERT · VISSZA AZ 1. SZINTRE`,
    `KIKAPTÁL 💀\n${insult}`,
    true
  );
}


/* =========================================================
   ACTION BUTTON
   ========================================================= */

function handleDrinkGameStart() {
  if (drinkGame.active) {
    return;
  }


  /* -------------------------------------------------------
     TELJES BUKÁS VAGY BOSS UTÁN
     ------------------------------------------------------- */

  if (drinkGame.gameOver) {
    resetDrinkGame();

    beginDrinkRound();

    return;
  }


  /* -------------------------------------------------------
     KÖVETKEZŐ SZINT
     ------------------------------------------------------- */

  if (drinkGame.roundWon) {
    drinkGame.level += 1;

    drinkGame.roundWon =
      false;
  }


  beginDrinkRound();
}


/* =========================================================
   RESET
   ========================================================= */

function resetDrinkGame() {
  clearDrinkGameTimers();


  drinkGame.level = 0;

  drinkGame.player = 100;
  drinkGame.enemy = 100;

  drinkGame.active = false;
  drinkGame.trap = false;

  drinkGame.gameOver = false;
  drinkGame.roundWon = false;

  drinkGame.taps = 0;
  drinkGame.combo = 0;
  drinkGame.penalties = 0;

  drinkGame.lastTap = 0;
  drinkGame.lastGoodTap = 0;


  const arena =
    document.querySelector(
      "#drinkGameArena"
    );


  arena?.classList.remove(
    "is-stop"
  );


  const arenaTaunt =
    document.querySelector(
      "#drinkArenaTaunt"
    );


  arenaTaunt?.classList.remove(
    "is-visible"
  );


  setDrinkSipVisible(false);


  setDrinkStatus(
    "KÉSZ?",
    "Egy vereség és vissza az első szintre."
  );


  const bottomTaunt =
    document.querySelector(
      "#drinkTaunt"
    );


  if (bottomTaunt) {
    bottomTaunt.textContent =
      "A kocsma még hisz benned.";
  }


  showDrinkAction(
    "KÖR INDÍTÁSA",
    "8 ELLENFÉL · EGY ÉLET",
    "KIISSZA ELŐBB?"
  );


  renderDrinkGame();
}


initDrinkGame();