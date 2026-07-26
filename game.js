(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d", { alpha: false });
  const hpBar = document.getElementById("hpBar");
  const xpBar = document.getElementById("xpBar");
  const levelLabel = document.getElementById("levelLabel");
  const timeLabel = document.getElementById("timeLabel");
  const scoreLabel = document.getElementById("scoreLabel");
  const titleScreen = document.getElementById("titleScreen");
  const titleStory = titleScreen?.querySelector(".title-story");
  const levelScreen = document.getElementById("levelScreen");
  const gameOverScreen = document.getElementById("gameOverScreen");
  const endingScreen = document.getElementById("endingScreen");
  const shopScreen = document.getElementById("shopScreen");
  const recordsScreen = document.getElementById("recordsScreen");
  const encyclopediaScreen = document.getElementById("encyclopediaScreen");
  const resultStats = document.getElementById("resultStats");
  const resultTitle = document.getElementById("resultTitle");
  const recordsCard = document.getElementById("recordsCard");
  const encyclopediaList = document.getElementById("encyclopediaList");
  const encyclopediaTabs = document.getElementById("encyclopediaTabs");
  const upgradeChoices = document.getElementById("upgradeChoices");
  const startButton = document.getElementById("startButton");
  const shopButton = document.getElementById("shopButton");
  const recordsButton = document.getElementById("recordsButton");
  const encyclopediaButton = document.getElementById("encyclopediaButton");
  const saveResetButton = document.getElementById("saveResetButton");
  const shopCloseButton = document.getElementById("shopCloseButton");
  const recordsCloseButton = document.getElementById("recordsCloseButton");
  const encyclopediaCloseButton = document.getElementById("encyclopediaCloseButton");
  const titleMoney = document.getElementById("titleMoney");
  const shopMoney = document.getElementById("shopMoney");
  const shopStats = document.getElementById("shopStats");
  const shopItems = document.getElementById("shopItems");
  const saveSlots = document.getElementById("saveSlots");
  const characterSelect = document.getElementById("characterSelect");
  const restartButton = document.getElementById("restartButton");
  const endingRestartButton = document.getElementById("endingRestartButton");
  const itemDock = document.getElementById("itemDock");
  const pauseButton = document.getElementById("pauseButton");
  const pauseScreen = document.getElementById("pauseScreen");
  const pauseStats = document.getElementById("pauseStats");
  const pauseItems = document.getElementById("pauseItems");
  const pauseEncyclopediaButton = document.getElementById("pauseEncyclopediaButton");
  const pauseTitleButton = document.getElementById("pauseTitleButton");
  const resumeButton = document.getElementById("resumeButton");
  const touchStick = document.getElementById("touchStick");
  const touchKnob = document.getElementById("touchKnob");
  const toast = document.getElementById("toast");
  const enemyIntro = document.getElementById("enemyIntro");
  const bgmTrack = document.getElementById("bgmTrack");
  const endingBgmTrack = document.getElementById("endingBgmTrack");
  const catMeowTrack = document.getElementById("catMeowTrack");
  const catPainTrack = document.getElementById("catPainTrack");

  const TAU = Math.PI * 2;
  const ITEM_COLS = 5;
  const ITEM_ROWS = 8;
  const ACTIVE_LIMIT = 5;
  const PASSIVE_LIMIT = 5;
  const ITEM_MAX_LEVEL = 9;
  const ENDGAME_TIME = 600;
  const ENDING_TIME = 900;
  const CLEAR_TRANSITION_TIME = 2.8;
  const OVERLORD_START_TIME = 600;
  const TARGET_FPS = 30;
  const FIELD_CAMERA_ZOOM = 1.06;
  const FIELD_CAMERA_ZOOM_MOBILE = 0.72;
  const FIELD_CAMERA_ZOOM_TOUCH = 0.68;
  const FRAME_MS = 1000 / TARGET_FPS;
  const MAX_ENEMIES = 230;
  const MAX_PARTICLES = 120;
  const MAX_PROJECTILES = 96;
  const MAX_ENEMY_BULLETS = 32;
  const MAX_GEMS = 180;
  const MAX_FLOAT_TEXTS = 40;
  const FIELD_CHEST_LIMIT = 5;
  const SAVE_KEY = "nekoMushaSave.v1";
  const SAVE_SLOT_COUNT = 2;
  const ACTIVE_SAVE_SLOT_KEY = "nekoMushaActiveSlot.v1";

  const rand = (min, max) => min + Math.random() * (max - min);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const sqr = value => value * value;
  const d2 = (a, b) => sqr(a.x - b.x) + sqr(a.y - b.y);
  const chance = value => Math.random() < value;

  const MAP = { w: 4300, h: 2420, margin: 58 };
  const MAP_RECT = { x: -MAP.w / 2, y: -MAP.h / 2, w: MAP.w, h: MAP.h };
  const MARKUP_IMAGE = { w: 1114, h: 624 };
  const SKY_LINE_Y = MAP_RECT.y + MAP.h * 0.34;
  const WALKABLE_CENTER = imagePoint(560, 345);
  const WALKABLE_POLYGON = [
    imagePoint(828, 98),
    imagePoint(858, 98),
    imagePoint(858, 138),
    imagePoint(792, 138),
    imagePoint(735, 136),
    imagePoint(690, 154),
    imagePoint(646, 160),
    imagePoint(590, 160),
    imagePoint(560, 168),
    imagePoint(512, 168),
    imagePoint(484, 184),
    imagePoint(448, 168),
    imagePoint(410, 160),
    imagePoint(414, 194),
    imagePoint(365, 194),
    imagePoint(336, 216),
    imagePoint(298, 218),
    imagePoint(276, 236),
    imagePoint(232, 239),
    imagePoint(222, 258),
    imagePoint(185, 264),
    imagePoint(178, 306),
    imagePoint(148, 336),
    imagePoint(104, 360),
    imagePoint(64, 402),
    imagePoint(98, 426),
    imagePoint(174, 428),
    imagePoint(222, 456),
    imagePoint(264, 468),
    imagePoint(266, 494),
    imagePoint(314, 508),
    imagePoint(346, 592),
    imagePoint(628, 592),
    imagePoint(654, 528),
    imagePoint(744, 493),
    imagePoint(818, 428),
    imagePoint(870, 426),
    imagePoint(940, 384),
    imagePoint(988, 354),
    imagePoint(1038, 330),
    imagePoint(1082, 326),
    imagePoint(1082, 278),
    imagePoint(968, 278),
    imagePoint(934, 260),
    imagePoint(898, 232),
    imagePoint(878, 188),
    imagePoint(862, 160)
  ];
  const fixedChestSpots = [
    { ...imagePoint(420, 310), tier: "wood" },
    { ...imagePoint(702, 265), tier: "red" },
    { ...imagePoint(270, 430), tier: "silver" },
    { ...imagePoint(850, 420), tier: "wood" },
    { ...imagePoint(560, 500), tier: "gold" }
  ];
  const fixedSupplySpots = [
    { chest: imagePoint(448, 324), onigiri: imagePoint(482, 352), tier: "wood" },
    { chest: imagePoint(650, 300), onigiri: imagePoint(618, 336), tier: "red" },
    { chest: imagePoint(360, 430), onigiri: imagePoint(398, 452), tier: "silver" },
    { chest: imagePoint(760, 420), onigiri: imagePoint(724, 446), tier: "wood" },
    { chest: imagePoint(560, 490), onigiri: imagePoint(604, 512), tier: "gold" }
  ];

  function imagePoint(x, y) {
    return {
      x: MAP_RECT.x + x / MARKUP_IMAGE.w * MAP.w,
      y: MAP_RECT.y + y / MARKUP_IMAGE.h * MAP.h
    };
  }

  let W = 1280;
  let H = 720;
  let DPR = 1;
  let currentHudScale = 1;
  let last = performance.now();
  let frameCarry = 0;
  let state = "title";
  let encyclopediaReturnState = "title";
  let keys = new Set();
  let pointer = { x: 0, y: 0, startX: 0, startY: 0, id: null, active: false, mode: "screen", dx: 0, dy: 0 };
  let gamepadInput = { mx: 0, my: 0 };
  let gamepadPrev = { buttons: [], navX: 0, navY: 0 };
  let gamepadChoiceIndex = 0;
  let audio = null;
  let stars = [];
  let spriteCache = {};
  let toastTimer = 0;
  let enemyIntroTimer = 0;
  let enemyIntroHideTimeout = 0;
  let killSfxTimer = 0;
  let catVoiceTimer = 0;
  let clearDelay = 0;
  let clearMaxDelay = CLEAR_TRANSITION_TIME;
  let clearReason = "survive";
  let lastResult = null;
  let levelChoiceReadyAt = 0;
  let pauseReturnState = "playing";
  let maxedFallbackCount = 0;
  let lastJackpotAt = -999;
  let overlordSpawned = false;
  let testMode = false;
  let clearFallbackTimer = 0;

  const itemAtlas = new Image();
  itemAtlas.src = "assets/item-atlas.png";
  const stageImage = new Image();
  stageImage.src = "assets/sengoku-stage.png";
  const furyCutinImage = new Image();
  furyCutinImage.src = "assets/neko-fury-cutin.png";
  const denkichiFuryCutinImage = new Image();
  denkichiFuryCutinImage.src = "assets/denkichi-fury-cutin.png";
  const denkichiHandGlowRightImage = new Image();
  denkichiHandGlowRightImage.src = "assets/characters/denkichi-hand-glow-right.png";
  const denkichiHandGlowLeftImage = new Image();
  denkichiHandGlowLeftImage.src = "assets/characters/denkichi-hand-glow-left.png";
  const denkichiAttackRightImage = new Image();
  denkichiAttackRightImage.src = "assets/characters/denkichi-attack-right.png";
  const denkichiAttackLeftImage = new Image();
  denkichiAttackLeftImage.src = "assets/characters/denkichi-attack-left.png";
  const characterSpritePaths = {
    player: "assets/characters/hero-samurai.png",
    wraith: "assets/characters/wraith.png",
    ashigaru: "assets/characters/ashigaru.png",
    tengu: "assets/characters/tengu.png",
    shinobi: "assets/characters/shinobi.png",
    armored: "assets/characters/armored.png",
    senryoThief: "assets/characters/senryo-thief.png",
    denkichi: "assets/characters/denkichi.png",
    oniElite: "assets/characters/oni-elite.png",
    boss: "assets/characters/blue-horn-king.png",
    overlord: "assets/characters/overlord.png"
  };
  const characterFrameNames = {
    player: "hero-samurai",
    wraith: "wraith",
    ashigaru: "ashigaru",
    tengu: "tengu",
    shinobi: "shinobi",
    armored: "armored",
    senryoThief: "senryo-thief",
    denkichi: "denkichi",
    oniElite: "oni-elite",
    boss: "blue-horn-king",
    overlord: "overlord"
  };
  const CHARACTER_FRAME_COUNT = 4;
  const characterFrameCounts = {
    denkichi: 3
  };
  const characterBaseSprites = Object.fromEntries(Object.entries(characterSpritePaths).map(([key, src]) => {
    const img = new Image();
    img.src = src;
    return [key, img];
  }));
  const characterAnimations = Object.fromEntries(Object.entries(characterFrameNames).map(([key, name]) => [
    key,
    Array.from({ length: characterFrameCounts[key] || CHARACTER_FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = `assets/characters/frames/${name}-${i}.png`;
      return img;
    })
  ]));

  const playableCharacters = [
    {
      id: "piimaru",
      name: "ぴぃ丸",
      label: "隻眼の猫武者",
      spriteKey: "player",
      desc: "刀と秘宝を扱う標準型。扱いやすく、成長の伸びが素直。",
      unlocked: true
    },
    {
      id: "denkichi",
      name: "伝吉",
      label: "クリア報酬",
      spriteKey: "denkichi",
      desc: "前方レーザーを放つ高火力型。初期攻撃が強く、突破力に優れる。",
      unlocked: false
    }
  ];

  const enemyIntroDefs = {
    wraith: { name: "怨霊", line: "迷い子の匂いがする。魂ごと連れていくぞ。" },
    ashigaru: { name: "落武者足軽", line: "猫の武者だと？ 面白い、まずはその刀を折る。" },
    tengu: { name: "夜天狗", line: "空からなら、その片目では追えまい。" },
    shinobi: { name: "影忍", line: "背後はもらった。音もなく終わらせる。" },
    armored: { name: "鎧鬼", line: "小さき刃で、この鎧が裂けるものか。" },
    oniElite: { name: "赤角鬼将", line: "ここから先は鬼の陣。踏み越えられるか。" },
    boss: { name: "青角王", line: "弱き命を守るだと？ ならばその刃で証してみせよ。" },
    overlord: { name: "終焉の黒角王", line: "逃げ場はない。十五分の夜を、永遠に変えてやる。" }
  };

  enemyIntroDefs.senryoThief = {
    name: "千両泥棒",
    line: "へっへっへ、小判の匂いがするぜ。捕まえてみな！"
  };

  const enemyIntroDenkichiLines = {
    wraith: "その頭、月明かりがよく映るな…魂まで透けて見えるぞ。",
    ashigaru: "薄いのは髪だけか？ 腕まで薄くないことを祈るぞ。",
    tengu: "風で隠す髪もないとはな。空から笑ってやる。",
    shinobi: "闇より先に額が光ったぞ、伝吉。",
    armored: "その頭で兜なしとは、よほど覚悟があるらしい。",
    oniElite: "薄毛の剣士よ、鬼の陣を越えられるか。",
    boss: "青き角より、その額の光の方が眩しいぞ。",
    overlord: "頭上の月と額の光、どちらが先に沈むかな。",
    senryoThief: "へっへっへ、髪は盗らねえよ。もう残りが少ねえからな！"
  };

  const player = {
    character: "piimaru",
    x: 0,
    y: 0,
    r: 23,
    hp: 130,
    maxHp: 130,
    speed: 130,
    level: 1,
    xp: 0,
    need: 4,
    invuln: 0,
    dir: 0,
    poseTimer: 0,
    beamPoseTimer: 0,
    beamPoseDir: 0,
    shotTimer: 0,
    slashTimer: 0.8,
    drumTimer: 3.2,
    shurikenTimer: 2.3,
    regenCarry: 0,
    damage: 18,
    fireRate: 1.05,
    projectileCount: 1,
    magnet: 150,
    aura: 0,
    auraOrbs: [],
    slashPower: 1,
    crit: 0.04,
    xpGain: 1,
    luck: 0,
    regen: 0,
    drum: 0,
    shuriken: 0,
    coinBonus: 0,
    armor: 0,
    area: 1,
    duration: 1,
    projectileSpeed: 1,
    cooldownBonus: 0,
    might: 1,
    extraPierce: 0,
    orbit: 0,
    orbitOrbs: [],
    cranes: 0,
    arrows: 0,
    sutra: 0,
    smoke: 0,
    banner: 0,
    sickle: 0,
    sake: 0,
    sakeTimer: 2.6,
    fury: 0,
    furyTick: 0,
    furyPulse: 0,
    curse: 0,
    arrowTimer: 1.8,
    craneTimer: 2.4,
    smokeTimer: 4.2,
    bannerTimer: 2.8,
    sickleTimer: 2.1
  };

  const isPowerLevel = level => level === 1 || level % 2 === 1;
  const isCountLevel = level => level > 1 && level % 2 === 0;

  const shopUpgrades = [
    { id: "hp", icon: "甲", name: "丈夫な胴丸", desc: "最大HPが10増える。", max: 8, baseCost: 70, growth: 1.45 },
    { id: "damage", icon: "刀", name: "研ぎ師の砥石", desc: "基礎攻撃力が1上がる。", max: 8, baseCost: 90, growth: 1.5 },
    { id: "speed", icon: "足", name: "軽足の草履", desc: "移動速度が少し上がる。", max: 6, baseCost: 80, growth: 1.45 },
    { id: "magnet", icon: "招", name: "招き銭袋", desc: "経験値と拾い物を少し集めやすくなる。", max: 6, baseCost: 60, growth: 1.4 },
    { id: "armor", icon: "鈴", name: "守りの鈴", desc: "受ける接触ダメージを軽く抑える。", max: 5, baseCost: 120, growth: 1.65 },
    { id: "luck", icon: "福", name: "福招き札", desc: "良い拾い物が少し出やすくなる。", max: 5, baseCost: 140, growth: 1.7 }
  ];

  function defaultStats() {
    return {
      runs: 0,
      wins: 0,
      bestTime: 0,
      bestBossTime: 0,
      bestScore: 0,
      bestKills: 0,
      bestLevel: 1,
      bestReward: 0,
      totalEarned: 0,
      totalScore: 0,
      totalKills: 0
    };
  }

  function normalizeStats(stats = {}) {
    const fallback = defaultStats();
    return Object.fromEntries(Object.entries(fallback).map(([key, value]) => {
      const parsed = Number(stats[key]);
      return [key, Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : value];
    }));
  }

  function defaultSave() {
    return {
      money: 0,
      upgrades: {},
      selectedCharacter: "piimaru",
      unlockedCharacters: ["piimaru"],
      stats: defaultStats()
    };
  }

  function saveKeyForSlot(slot) {
    return `${SAVE_KEY}.slot${slot}`;
  }

  function loadActiveSaveSlot() {
    try {
      const slot = Math.floor(Number(localStorage.getItem(ACTIVE_SAVE_SLOT_KEY)) || 1);
      return clamp(slot, 1, SAVE_SLOT_COUNT);
    } catch (error) {
      return 1;
    }
  }

  function loadSave(slot = activeSaveSlot) {
    const fallback = defaultSave();
    try {
      const raw = localStorage.getItem(saveKeyForSlot(slot)) || (slot === 1 ? localStorage.getItem(SAVE_KEY) : null);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      const unlocked = Array.isArray(parsed.unlockedCharacters) ? parsed.unlockedCharacters.filter(Boolean) : ["piimaru"];
      if (!unlocked.includes("piimaru")) unlocked.unshift("piimaru");
      const selected = unlocked.includes(parsed.selectedCharacter) ? parsed.selectedCharacter : "piimaru";
      return {
        money: Math.max(0, Math.floor(Number(parsed.money) || 0)),
        upgrades: { ...(parsed.upgrades || {}) },
        selectedCharacter: selected,
        unlockedCharacters: [...new Set(unlocked)],
        stats: normalizeStats(parsed.stats || fallback.stats)
      };
    } catch (error) {
      return fallback;
    }
  }

  function saveMeta() {
    try {
      localStorage.setItem(saveKeyForSlot(activeSaveSlot), JSON.stringify(metaSave));
      localStorage.setItem(ACTIVE_SAVE_SLOT_KEY, String(activeSaveSlot));
    } catch (error) {
      // localStorage may be unavailable in strict browser privacy modes.
    }
  }

  function upgradeLevel(id) {
    return Math.max(0, Math.floor(Number(metaSave.upgrades[id]) || 0));
  }

  function upgradeCost(def) {
    return Math.floor(def.baseCost * Math.pow(def.growth, upgradeLevel(def.id)));
  }

  function applyShopUpgrades() {
    const hp = upgradeLevel("hp");
    const damage = upgradeLevel("damage");
    const speed = upgradeLevel("speed");
    const magnet = upgradeLevel("magnet");
    const armor = upgradeLevel("armor");
    const luck = upgradeLevel("luck");
    player.maxHp += hp * 10;
    player.damage += damage;
    player.speed += speed * 4;
    player.magnet += magnet * 12;
    player.armor += Math.ceil(armor * 0.55);
    player.luck += luck * 0.012;
    player.hp = player.maxHp;
  }

  function applyCharacterProfile() {
    const character = activeCharacterDef();
    player.character = character.id;
    if (character.id === "denkichi") {
      player.maxHp = 118;
      player.hp = player.maxHp;
      player.speed = 136;
      player.damage = 24;
      player.fireRate = 0.82;
      player.projectileSpeed = 1.16;
      player.crit = 0.07;
      player.magnet = 138;
    }
  }

  let activeSaveSlot = loadActiveSaveSlot();
  let metaSave = loadSave(activeSaveSlot);
  let runRewarded = false;
  let runUnlocks = [];

  let camera = { x: 0, y: 0, shake: 0 };
  let elapsed = 0;
  let score = 0;
  let kills = 0;
  let spawnTimer = 0;
  let bossTimer = 62;
  let fieldPickupTimer = 12;
  let thiefTimer = 48;
  let nextSupplyDropAt = ENDGAME_TIME;
  let supplyDropIndex = 0;
  let openedChestCount = 0;
  let projectiles = [];
  let enemyBullets = [];
  let enemies = [];
  let gems = [];
  let pickups = [];
  let particles = [];
  let texts = [];
  let slashes = [];
  let shockwaves = [];
  let killRingCooldown = 0;
  let puddles = [];
  let furyCutin = null;
  let acquiredItems = new Map();
  let evolvedItems = new Map();
  let introducedEnemyTypes = new Set();

  const itemDefs = [
    {
      id: "katana",
      type: "active",
      name: "猫又刀守",
      desc: "攻撃力と会心率が上がる。猫武者の基本火力。",
      sprite: 0,
      max: 5,
      apply(level) {
        if (isCountLevel(level)) player.projectileCount += 1;
        if (isPowerLevel(level)) {
          player.damage += 3.2 + level * 0.8;
          player.crit += 0.014 + level * 0.004;
        }
      }
    },
    {
      id: "magatama",
      type: "passive",
      name: "翡翠の勾玉",
      desc: "経験値の伸びが良くなり、秘宝選択が早く回る。",
      sprite: 1,
      max: 5,
      apply(level) {
        player.xpGain += 0.06 + level * 0.012;
        player.magnet += 6;
      }
    },
    {
      id: "taiko",
      type: "active",
      name: "鬼太鼓",
      desc: "一定間隔で範囲衝撃波。群れを押し返す。",
      sprite: 2,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) player.drum += 1;
        if (isPowerLevel(level)) player.damage += 1.5 + level * 0.45;
        player.drumTimer = Math.min(player.drumTimer, 3.35 - level * 0.12);
      }
    },
    {
      id: "fan",
      type: "passive",
      name: "日輪軍配",
      desc: "攻撃間隔を短縮し、弾幕の密度を上げる。",
      sprite: 3,
      max: 5,
      apply() {
        player.fireRate = Math.max(0.42, player.fireRate * 0.91);
      }
    },
    {
      id: "gourd",
      type: "passive",
      name: "三毛瓢箪",
      desc: "最大体力と自然回復。長い夜に強くなる。",
      sprite: 4,
      max: 5,
      apply(level) {
        player.maxHp += 12;
        player.hp = Math.min(player.maxHp, player.hp + 12 + level * 4);
        player.regen += 0.08;
      }
    },
    {
      id: "lantern",
      type: "active",
      name: "狐火灯籠",
      desc: "近くの敵を焼く狐火の輪を強化する。",
      sprite: 5,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) player.aura += 1;
        if (isPowerLevel(level)) player.damage += 1.1 + level * 0.35;
      }
    },
    {
      id: "shuriken",
      type: "active",
      name: "影手裏剣",
      desc: "周期的に全方位へ手裏剣を放つ。",
      sprite: 6,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) player.shuriken += 1;
        if (isPowerLevel(level)) player.damage += 1.4 + level * 0.35;
      }
    },
    {
      id: "onigiri",
      type: "passive",
      name: "肉球おにぎり",
      desc: "即時回復。さらに拾い物の回復量が上がる。",
      sprite: 7,
      max: 4,
      apply(level) {
        player.hp = Math.min(player.maxHp, player.hp + 20 + level * 6);
        player.regen += 0.04;
      }
    },
    {
      id: "bell",
      type: "passive",
      name: "招き鈴",
      desc: "経験値と拾い物を引き寄せる範囲が広がる。",
      sprite: 8,
      max: 5,
      apply(level) {
        player.magnet += 24 + level * 5;
        player.luck += 0.012;
      }
    },
    {
      id: "thunder",
      type: "passive",
      name: "雷鳴玉",
      desc: "同時に放つ雷弾が増える。",
      sprite: 9,
      max: 5,
      apply(level) {
        if (level === 1 || level === 3 || level === 5) player.projectileCount += 1;
        player.damage += 1;
      }
    },
    {
      id: "sakura",
      type: "active",
      name: "桜吹雪の札",
      desc: "居合の範囲と威力が上がる。前方を大きく掃く。",
      sprite: 10,
      max: 5,
      apply(level) {
        if (isCountLevel(level)) player.slashPower += 0.13;
        if (isPowerLevel(level)) {
          player.slashPower += 0.08;
          player.damage += 1.8 + level * 0.35;
        }
      }
    },
    {
      id: "koban",
      type: "passive",
      name: "黄金小判",
      desc: "得点と宝箱出現率が上がる。景気よく稼ぐ。",
      sprite: 11,
      max: 5,
      apply(level) {
        player.coinBonus += 0.08;
        player.luck += 0.015 + level * 0.003;
      }
    },
    {
      id: "beads",
      type: "active",
      name: "念珠の輪",
      desc: "周囲を回る念珠が敵を削る。聖書系の周回攻撃。",
      sprite: 12,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) player.orbit += 1;
        if (isPowerLevel(level)) player.damage += 1.1 + level * 0.3;
        player.area += 0.012 + level * 0.003;
      }
    },
    {
      id: "scroll",
      type: "passive",
      name: "忍び巻物",
      desc: "弾の持続時間と貫通が伸びる。手裏剣や雷弾と好相性。",
      sprite: 13,
      max: 5,
      apply(level) {
        player.duration += 0.07;
        if (level === 3 || level === 5) player.extraPierce += 1;
      }
    },
    {
      id: "mirror",
      type: "passive",
      name: "八咫鏡",
      desc: "被ダメージを軽減し、接触時に反撃の光を放つ。",
      sprite: 14,
      max: 5,
      apply(level) {
        player.armor += 1;
        player.maxHp += 8 + level * 2;
        player.hp = Math.min(player.maxHp, player.hp + 12);
      }
    },
    {
      id: "geta",
      type: "passive",
      name: "天狗下駄",
      desc: "移動速度と弾速が上がる。危険地帯を抜けやすい。",
      sprite: 15,
      max: 5,
      apply() {
        player.speed += 16;
        player.projectileSpeed += 0.045;
      }
    },
    {
      id: "mask",
      type: "passive",
      name: "鬼面",
      desc: "敵の圧も報酬も増える。リスク込みで稼ぐ呪物。",
      sprite: 16,
      max: 5,
      apply() {
        player.curse += 0.07;
        player.damage += 2;
        player.coinBonus += 0.05;
      }
    },
    {
      id: "crane",
      type: "active",
      name: "折鶴式神",
      desc: "敵を追う式神を周期的に飛ばす。",
      sprite: 17,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) player.cranes += 1;
        if (isPowerLevel(level)) player.damage += 1.5 + level * 0.35;
      }
    },
    {
      id: "arrow",
      type: "active",
      name: "火矢の束",
      desc: "上空から火矢が降る。斧系の落下攻撃。",
      sprite: 18,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) {
          player.arrows += 1;
          player.area += 0.02;
        }
        if (isPowerLevel(level)) player.damage += 1.5 + level * 0.4;
      }
    },
    {
      id: "sutra",
      type: "active",
      name: "退魔経典",
      desc: "札の結界が広がり、範囲攻撃が強くなる。",
      sprite: 19,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) player.sutra += 1;
        if (isPowerLevel(level)) player.damage += 1.2 + level * 0.35;
        player.area += 0.018;
        player.magnet += 6 + level * 2;
      }
    },
    {
      id: "smoke",
      type: "active",
      name: "忍び煙玉",
      desc: "一定間隔で煙幕を張り、近い敵を鈍らせる。",
      sprite: 20,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) player.smoke += 1;
        if (isPowerLevel(level)) player.damage += 1.1 + level * 0.3;
        player.duration += 0.02 + level * 0.006;
      }
    },
    {
      id: "pinwheel",
      type: "passive",
      name: "風車の護符",
      desc: "移動速度と攻撃間隔を少し改善する。",
      sprite: 21,
      max: 5,
      apply() {
        player.speed += 12;
        player.fireRate = Math.max(0.42, player.fireRate * 0.96);
      }
    },
    {
      id: "banner",
      type: "active",
      name: "虎の陣旗",
      desc: "時々、前方へ虎気の衝撃を放つ。",
      sprite: 22,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) player.banner += 1;
        if (isPowerLevel(level)) player.damage += 1.6 + level * 0.42;
      }
    },
    {
      id: "sickle",
      type: "active",
      name: "月影の鎌",
      desc: "大きな月刃が弧を描いて敵を裂く。",
      sprite: 23,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) player.sickle += 1;
        if (isPowerLevel(level)) player.damage += 1.4 + level * 0.38;
        player.area += 0.01 + level * 0.004;
      }
    },
    {
      id: "jadecat",
      type: "passive",
      name: "翡翠招き猫",
      desc: "幸運、得点、拾得範囲を少しずつ伸ばす。",
      sprite: 24,
      max: 5,
      apply(level) {
        player.luck += 0.025;
        player.coinBonus += 0.05;
        player.magnet += 10 + level * 3;
      }
    },
    {
      id: "pepper",
      type: "passive",
      name: "武者唐辛子",
      desc: "全ての攻撃の威力を底上げする。序盤は小さく、重ねるほど効く。",
      sprite: 25,
      max: 5,
      apply(level) {
        player.might += 0.045 + level * 0.006;
        player.damage += 0.8 + level * 0.25;
      }
    },
    {
      id: "warTome",
      type: "passive",
      name: "兵法空巻",
      desc: "武器の発動間隔を短縮する。攻撃密度を上げる定番の守具。",
      sprite: 26,
      max: 5,
      apply(level) {
        player.cooldownBonus = Math.min(0.36, player.cooldownBonus + 0.045 + level * 0.004);
        player.fireRate = Math.max(0.42, player.fireRate * 0.96);
      }
    },
    {
      id: "warCandle",
      type: "passive",
      name: "陣中蝋燭",
      desc: "攻撃範囲を広げる。円形、斬撃、落下系の当たりを太くする。",
      sprite: 27,
      max: 5,
      apply(level) {
        player.area += 0.055 + level * 0.006;
        player.magnet += 4;
      }
    },
    {
      id: "splitCharm",
      type: "passive",
      name: "分身札",
      desc: "弾数を増やす。複数発射系の武器と相性が良い。",
      sprite: 28,
      max: 3,
      apply(level) {
        if (level === 1 || level === 3) player.projectileCount += 1;
        if (level === 2) player.extraPierce += 1;
      }
    },
    {
      id: "sake",
      type: "active",
      name: "清め酒",
      desc: "敵の足元へ清めの沼を撒き、しばらく範囲ダメージを与える。",
      sprite: 29,
      max: 5,
      apply(level) {
        if (level === 1 || isCountLevel(level)) player.sake += 1;
        if (isPowerLevel(level)) player.damage += 1.2 + level * 0.35;
        player.area += 0.012;
      }
    }
  ];

  const pickupDefs = {
    heal: { name: "おにぎり", sprite: 7 },
    magnet: { name: "招き鈴", sprite: 8 },
    bomb: { name: "鬼太鼓", sprite: 2 },
    fury: { name: "猫神奥義札", sprite: 0 },
    chest: { name: "秘宝箱", sprite: 11 }
  };

  const chestTiers = {
    wood: { color: "#b87943", glow: "#ffbd72", jackpot: false, rewards: 1, name: "木箱" },
    red: { color: "#d82936", glow: "#ff6f70", jackpot: false, jackpotChance: 0.06, rewards: 2, name: "赤箱" },
    silver: { color: "#b8d7ff", glow: "#e8f4ff", jackpot: false, jackpotChance: 0.14, rewards: 3, name: "銀箱" },
    gold: { color: "#ffdf5a", glow: "#fff1a7", jackpot: false, jackpotChance: 0.32, rewards: 4, name: "金箱" }
  };

  itemDefs.forEach(def => {
    def.max = ITEM_MAX_LEVEL;
  });

  const evolutionRecipes = [
    {
      id: "eclipseFang",
      code: "A",
      name: "奥義・隻眼猫牙A",
      requires: ["katana", "pepper"],
      sprite: 30,
      desc: "主弾と斬撃の威力、会心率を大きく上げる。",
      apply() {
        player.might += 0.22;
        player.damage += 10;
        player.crit += 0.08;
      }
    },
    {
      id: "warThunder",
      code: "B",
      name: "奥義・戦雷太鼓B",
      requires: ["taiko", "warTome"],
      sprite: 31,
      desc: "太鼓の回転率と衝撃波数が増え、群れを押し返す力が増す。",
      apply() {
        player.drum += 2;
        player.cooldownBonus = Math.min(0.48, player.cooldownBonus + 0.06);
        player.damage += 8;
      }
    },
    {
      id: "shadowStorm",
      code: "C",
      name: "奥義・影千手裏剣C",
      requires: ["shuriken", "splitCharm"],
      sprite: 32,
      desc: "手裏剣の数と貫通が増え、全方位制圧力が跳ね上がる。",
      apply() {
        player.shuriken += 2;
        player.projectileCount += 1;
        player.extraPierce += 1;
      }
    },
    {
      id: "sakuraMoon",
      code: "D",
      name: "奥義・桜月一閃D",
      requires: ["sakura", "warCandle"],
      sprite: 33,
      desc: "居合の範囲と威力を大幅に拡張する。",
      apply() {
        player.slashPower += 1.4;
        player.area += 0.18;
        player.might += 0.08;
      }
    },
    {
      id: "greatSutra",
      code: "E",
      name: "奥義・大経輪E",
      requires: ["beads", "sutra"],
      sprite: 34,
      desc: "周回する経典と念珠が増え、接近戦の壁になる。",
      apply() {
        player.orbit += 3;
        player.sutra += 2;
        player.duration += 0.2;
      }
    },
    {
      id: "foxAegis",
      code: "F",
      name: "奥義・狐火八咫鏡F",
      requires: ["lantern", "mirror"],
      sprite: 35,
      desc: "狐火と防御を強化し、接触時の反撃性能を伸ばす。",
      apply() {
        player.aura += 3;
        player.armor += 3;
        player.maxHp += 40;
        player.hp = Math.min(player.maxHp, player.hp + 40);
      }
    },
    {
      id: "pureFlood",
      code: "G",
      name: "奥義・清酒霊泉G",
      requires: ["sake", "gourd"],
      sprite: 36,
      desc: "清め酒の沼が広がり、回復力も上がる。",
      apply() {
        player.sake += 3;
        player.area += 0.14;
        player.regen += 0.25;
      }
    },
    {
      id: "heavenVolley",
      code: "H",
      name: "奥義・天火連矢H",
      requires: ["arrow", "fan"],
      sprite: 37,
      desc: "火矢の数と発動間隔が改善される。",
      apply() {
        player.arrows += 3;
        player.cooldownBonus = Math.min(0.48, player.cooldownBonus + 0.04);
        player.area += 0.08;
      }
    }
  ];

  const encyclopediaItemCopy = {
    katana: { name: "猫又刀守", desc: "進行方向へ放つ基本武器。序盤は控えめだが、数と威力が伸びるほど主力になる。", accent: "#ff4058" },
    magatama: { name: "翡翠の勾玉", desc: "経験値の伸びと吸引力を支える守具。早めに育てるほど成長が速くなる。", accent: "#58f3e4" },
    taiko: { name: "鬼太鼓", desc: "一定間隔で衝撃波を鳴らし、群れを押し返す範囲武具。", accent: "#ff8f3a" },
    fan: { name: "日輪軍配", desc: "武具の発動間隔を短くする守具。手数を増やしたい時に効く。", accent: "#ffd35a" },
    gourd: { name: "三毛瓢箪", desc: "最大HPと自然回復を伸ばす守具。長期戦の土台になる。", accent: "#7be47d" },
    lantern: { name: "狐火灯籠", desc: "近くの敵を焼く狐火を展開する。壊れても少し待つと灯が戻る。", accent: "#ff7a31" },
    shuriken: { name: "影手裏剣", desc: "周囲へ手裏剣を散らす武具。数が増えるほど包囲に強くなる。", accent: "#9dd7ff" },
    onigiri: { name: "肉球おにぎり", desc: "回復力を高める守具。拾得おにぎりとの相性も良い。", accent: "#fff0bb" },
    bell: { name: "招き鈴", desc: "魂や拾得品を引き寄せる守具。テンポよくレベルを上げたい時に便利。", accent: "#ffd35a" },
    thunder: { name: "雷鳴玉", desc: "弾数と基礎火力を伸ばす守具。飛び道具主体の構成で輝く。", accent: "#9be8ff" },
    sakura: { name: "桜吹雪の札", desc: "刀の近接斬撃を強化する武具。育てるほど切り込み性能が増す。", accent: "#ff8fb8" },
    koban: { name: "黄金小判", desc: "報酬と幸運を底上げする守具。お店強化を早めたい時の味方。", accent: "#ffdf5a" },
    beads: { name: "念珠の輪", desc: "周囲を回る念珠を増やす武具。接近戦の守りにも攻めにも使える。", accent: "#d6c4ff" },
    scroll: { name: "忍び巻物", desc: "弾の持続と貫通を伸ばす守具。画面に残る攻撃ほど強くなる。", accent: "#d9b37a" },
    mirror: { name: "八咫鏡", desc: "防御と最大HPを伸ばし、接触ダメージへの耐性を作る守具。", accent: "#cfe8ff" },
    geta: { name: "天狗下駄", desc: "移動速度と弾速を伸ばす守具。間合い管理がしやすくなる。", accent: "#78d7ff" },
    mask: { name: "鬼面", desc: "敵の圧を高める代わりに火力と報酬を伸ばす危険な守具。", accent: "#ff4058" },
    crane: { name: "折鶴式神", desc: "敵を追う式神を飛ばす武具。逃げながらでも削れる。", accent: "#fff3d6" },
    arrow: { name: "火矢の束", desc: "上空から火矢を落とす武具。密集した敵に強い。", accent: "#ff9b45" },
    sutra: { name: "退魔経典", desc: "経典の結界で近づく敵を削る武具。一定回数当たると消え、復活する。", accent: "#78ffe6" },
    smoke: { name: "忍の煙玉", desc: "煙幕で敵を鈍らせる武具。囲まれた時の隙を作る。", accent: "#b8c5d6" },
    pinwheel: { name: "風車の護符", desc: "移動と発動間隔を少しずつ整える守具。扱いやすい万能補助。", accent: "#9dffcb" },
    banner: { name: "陣旗", desc: "前方へ士気の衝撃を放つ武具。進行方向を決めて押し込める。", accent: "#ffcc6a" },
    sickle: { name: "月影の鎌", desc: "大きな月刃で敵を裂く武具。範囲を育てると群れに刺さる。", accent: "#cfd8ff" },
    jadecat: { name: "翡翠招き猫", desc: "幸運、報酬、吸引をまとめて伸ばす守具。宝狙いの構成に合う。", accent: "#58f3a6" },
    pepper: { name: "武者唐辛子", desc: "全攻撃の威力を底上げする守具。単純だが強い火力札。", accent: "#ff5a4a" },
    warTome: { name: "兵法空巻", desc: "武具の再発動を早め、攻撃頻度を上げる守具。", accent: "#d8b878" },
    warCandle: { name: "陣中蝋燭", desc: "攻撃範囲を広げる守具。斬撃や範囲武具の当たりを伸ばす。", accent: "#ffc66d" },
    splitCharm: { name: "分身札", desc: "弾数と貫通を補助する守具。強いが育成は慎重に。", accent: "#b88cff" },
    sake: { name: "清め酒", desc: "清めの沼で敵の足元を焼く武具。狭い範囲に継続火力を置ける。", accent: "#74d3ff" }
  };

  const encyclopediaPickupCopy = [
    { id: "fieldOnigiri", name: "おにぎり", type: "拾得品", sprite: 7, desc: "拾うとHPを回復する。終盤の定時補給にも出現する。", accent: "#fff0bb" },
    { id: "fieldMagnet", name: "招き鈴", type: "拾得品", sprite: 8, desc: "周囲の魂を一気に引き寄せる。レベル上げのテンポを取り戻せる。", accent: "#ffd35a" },
    { id: "fieldChest", name: "秘宝箱", type: "拾得品", sprite: 11, desc: "拾うと秘宝選択へ。箱の色で報酬数や大当たり期待度が変わる。", accent: "#ffdf5a" },
    { id: "fieldFury", name: "猫神奥義札", type: "拾得品", sprite: 0, desc: "一定時間、操作方向へ超強力な奥義乱舞を放つ希少札。", accent: "#ff4058" }
  ];

  const encyclopediaEvolutionCopy = {
    eclipseFang: { name: "奥義・隻眼猫牙A", desc: "猫又刀守と武者唐辛子を融合。主弾と斬撃の火力を大きく引き上げる。", accent: "#ff4058" },
    warThunder: { name: "奥義・戦雷太鼓B", desc: "鬼太鼓と兵法空巻を融合。太鼓の回転と衝撃波数を増やす。", accent: "#ffb342" },
    shadowStorm: { name: "奥義・影千手裏剣C", desc: "影手裏剣と分身札を融合。手裏剣の数と貫通で全方位を制圧する。", accent: "#9dd7ff" },
    sakuraMoon: { name: "奥義・桜月一閃D", desc: "桜吹雪の札と陣中蝋燭を融合。刀の一閃をさらに広く鋭くする。", accent: "#ff8fb8" },
    greatSutra: { name: "奥義・大経輪E", desc: "念珠の輪と退魔経典を融合。周囲に厚い退魔の壁を作る。", accent: "#78ffe6" },
    foxAegis: { name: "奥義・狐火八咫鏡F", desc: "狐火灯籠と八咫鏡を融合。狐火と防御を同時に高める守りの奥義。", accent: "#ff8a3d" },
    pureFlood: { name: "奥義・清め霊泉G", desc: "清め酒と三毛瓢箪を融合。清めの範囲と回復力を伸ばす。", accent: "#74d3ff" },
    heavenVolley: { name: "奥義・天火連矢H", desc: "火矢の束と日輪軍配を融合。火矢の数と発動速度を引き上げる。", accent: "#ff9b45" }
  };

  const encyclopediaEnemyCopy = [
    { id: "player", name: "ぴぃ丸", type: "主人公", desc: "捨てられた過去を越え、刀を取った隻眼の猫武者。進行方向へ構え、妖怪の群れを切り開く。", hp: "操作キャラ", speed: "序盤は遅め", accent: "#ffdf5a" },
    { id: "denkichi", name: "伝吉", type: "クリア報酬", desc: "ぴぃ丸を救った心優しき青年。刀の修羅場を生き抜き、前方へ鋭い霊光レーザーを放つ。", hp: "解放キャラ", speed: "速め", accent: "#9be8ff" },
    { id: "wraith", name: "怨霊", type: "雑兵", desc: "夜の気配から湧く小型の霊。脆いが数で囲み、油断を削ってくる。", hp: "低", speed: "普通", accent: "#d82d61" },
    { id: "ashigaru", name: "落武者足軽", type: "雑兵", desc: "刀を引きずる亡者。怨霊より硬く、序盤の壁になる。", hp: "中", speed: "遅め", accent: "#d7a13e" },
    { id: "tengu", name: "夜天狗", type: "飛行敵", desc: "空から入り込む素早い敵。上空側から現れ、こちらの陣形を乱す。", hp: "低", speed: "速い", accent: "#46d8d2" },
    { id: "shinobi", name: "影忍", type: "俊足敵", desc: "距離を詰めるのが得意な忍び。後半は不意の接近に注意。", hp: "中", speed: "かなり速い", accent: "#c68cff" },
    { id: "armored", name: "骸鬼", type: "重装敵", desc: "重い鎧をまとった鬼。足は遅いが硬く、群れに混ざると押し返しにくい。", hp: "高", speed: "遅い", accent: "#f1b84b" },
    { id: "oniElite", name: "赤角鬼将", type: "中ボス", desc: "中盤以降に現れる鬼将。突進で陣形を崩し、倒すと宝箱を落とすことがある。", hp: "高", speed: "中", accent: "#ff4b38" },
    { id: "boss", name: "青角王", type: "中ボス", desc: "青い角を掲げる大鬼。冷たい気配をまとい、ぴぃ丸の前に立ちはだかる。", hp: "高", speed: "遅め", accent: "#2f9bff" },
    { id: "overlord", name: "終焉の黒角王", type: "最終ボス", desc: "8分以降に現れる別格の王。時折立ち止まり、六方向へ弾を放つ。", hp: "別格", speed: "中", accent: "#ff2438" },
    { id: "senryoThief", name: "千両泥棒", type: "希少敵", desc: "小判を抱えて中央付近を走り回る泥棒。倒せば両を稼げるが、逃げ足は速い。", hp: "やや高", speed: "速い", accent: "#ffdf5a" }
  ];

  const overlordEntry = encyclopediaEnemyCopy.find(enemy => enemy.id === "overlord");
  if (overlordEntry) {
    overlordEntry.desc = "10分以降に現れる別格の王。時折立ち止まり、六方向へ弾を放つ。";
  }

  function scaledDamage(value) {
    return value * player.might;
  }

  function cooldownTime(value, min = 0.42) {
    return Math.max(min, value * (1 - player.cooldownBonus));
  }

  function resize() {
    const rawDpr = window.devicePixelRatio || 1;
    W = Math.max(320, window.innerWidth);
    H = Math.max(320, window.innerHeight);
    const touch = navigator.maxTouchPoints > 0;
    const touchLandscape = touch && W > H;
    const compactScreen = Math.min(W, H) <= 720 || Math.max(W, H) <= 1180;
    const dprCap = touch ? (touchLandscape ? 1.18 : 1.28) : (compactScreen ? 1.5 : 1.75);
    DPR = Math.min(dprCap, rawDpr);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const shortSide = Math.min(W, H);
    const longSide = Math.max(W, H);
    const uiScale = touch
      ? clamp(shortSide / 560, 0.68, 0.94)
      : clamp(shortSide / 720, 0.86, 1);
    const hudScale = touch && W > H
      ? clamp(H / 560, 0.68, 0.92)
      : clamp(shortSide / 690, 0.72, 0.96);
    const menuScale = touch
      ? clamp(Math.min(shortSide / 540, longSide / 980), 0.66, 0.94)
      : clamp(shortSide / 720, 0.86, 1);
    document.documentElement.style.setProperty("--ui-scale", uiScale.toFixed(3));
    document.documentElement.style.setProperty("--hud-scale", hudScale.toFixed(3));
    document.documentElement.style.setProperty("--menu-scale", menuScale.toFixed(3));
    currentHudScale = hudScale;
    buildStars();
    spriteCache = buildSpriteCache();
  }

  function buildStars() {
    const count = Math.floor((W * H) / 13000);
    stars = Array.from({ length: count }, () => ({
      x: rand(-W, W),
      y: rand(-H, H),
      z: rand(0.2, 1),
      hue: Math.random() > 0.72 ? "#62f0d8" : "#ffd88d"
    }));
  }

  function makeSprite(size, draw) {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const g = c.getContext("2d");
    g.translate(size / 2, size / 2);
    draw(g, size);
    return c;
  }

  function buildSpriteCache() {
    return {
      player: makeSprite(96, drawPlayerSprite),
      wraith: makeSprite(76, g => drawEnemySprite(g, "#d82d61", "#fff6e8", "wraith")),
      ashigaru: makeSprite(84, g => drawEnemySprite(g, "#d7a13e", "#fff6e8", "ashigaru")),
      tengu: makeSprite(76, g => drawEnemySprite(g, "#46d8d2", "#fff6e8", "tengu")),
      boss: makeSprite(132, g => drawBossSprite(g))
    };
  }

  function drawPlayerSprite(g) {
    g.shadowColor = "#d82936";
    g.shadowBlur = 16;
    g.fillStyle = "#d82936";
    g.beginPath();
    g.moveTo(31, 0);
    g.lineTo(-8, -25);
    g.lineTo(-24, -9);
    g.lineTo(-24, 9);
    g.lineTo(-8, 25);
    g.closePath();
    g.fill();
    g.shadowBlur = 0;
    g.fillStyle = "#fff4df";
    g.beginPath();
    g.arc(-4, 0, 20, 0, TAU);
    g.fill();
    g.fillStyle = "#fff4df";
    g.beginPath();
    g.moveTo(-19, -14);
    g.lineTo(-25, -30);
    g.lineTo(-8, -19);
    g.moveTo(-19, 14);
    g.lineTo(-25, 30);
    g.lineTo(-8, 19);
    g.fill();
    g.fillStyle = "#1d1010";
    g.beginPath();
    g.arc(2, -6, 3.2, 0, TAU);
    g.arc(2, 6, 3.2, 0, TAU);
    g.fill();
    g.strokeStyle = "#efc84a";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(-18, -24);
    g.quadraticCurveTo(12, -38, 31, -12);
    g.stroke();
    g.strokeStyle = "#f5f0dd";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(8, 18);
    g.lineTo(34, 28);
    g.stroke();
  }

  function drawEnemySprite(g, body, eyes, type) {
    g.shadowColor = body;
    g.shadowBlur = 14;
    g.fillStyle = type === "ashigaru" ? "#33211b" : "#24151c";
    g.beginPath();
    g.ellipse(0, 0, 21, 28, 0, 0, TAU);
    g.fill();
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(0, -30);
    g.quadraticCurveTo(24, -5, 8, 30);
    g.quadraticCurveTo(-20, 8, 0, -30);
    g.fill();
    if (type === "ashigaru") {
      g.fillStyle = "#a43b26";
      g.fillRect(-18, -31, 36, 8);
    }
    if (type === "tengu") {
      g.strokeStyle = "#d9fff8";
      g.lineWidth = 4;
      g.beginPath();
      g.moveTo(-22, 0);
      g.lineTo(-36, -14);
      g.moveTo(-22, 8);
      g.lineTo(-38, 22);
      g.stroke();
    }
    g.shadowBlur = 0;
    g.fillStyle = eyes;
    g.beginPath();
    g.arc(-6, -3, 3, 0, TAU);
    g.arc(7, -3, 3, 0, TAU);
    g.fill();
  }

  function drawBossSprite(g) {
    g.shadowColor = "#d82936";
    g.shadowBlur = 22;
    g.fillStyle = "#2d1115";
    g.beginPath();
    for (let i = 0; i < 12; i++) {
      const r = i % 2 ? 42 : 60;
      const a = -Math.PI / 2 + i * TAU / 12;
      g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    g.closePath();
    g.fill();
    g.fillStyle = "#d82936";
    g.beginPath();
    g.arc(0, 0, 34, 0, TAU);
    g.fill();
    g.fillStyle = "#fff6e8";
    g.beginPath();
    g.arc(-10, -3, 5, 0, TAU);
    g.arc(12, -3, 5, 0, TAU);
    g.fill();
    g.strokeStyle = "#efc84a";
    g.lineWidth = 6;
    g.beginPath();
    g.arc(0, 0, 48, 0.1, TAU - 0.1);
    g.stroke();
  }

  function resetGame() {
    Object.assign(player, {
      x: 0,
      y: 0,
      hp: 130,
      maxHp: 130,
      speed: 130,
      level: 1,
      xp: 0,
      need: 4,
      invuln: 0,
      dir: 0,
      shotTimer: 0.25,
      slashTimer: 0.85,
      drumTimer: 3.2,
      shurikenTimer: 2.3,
      arrowTimer: 1.8,
      craneTimer: 2.4,
      regenCarry: 0,
      damage: 18,
      fireRate: 1.05,
      projectileCount: 1,
      magnet: 150,
      aura: 0,
      auraOrbs: [],
      slashPower: 1,
      crit: 0.04,
      xpGain: 1,
      luck: 0,
      regen: 0,
      drum: 0,
      shuriken: 0,
      coinBonus: 0,
      armor: 0,
      area: 1,
      duration: 1,
      projectileSpeed: 1,
      cooldownBonus: 0,
      might: 1,
      extraPierce: 0,
      orbit: 0,
      orbitOrbs: [],
      cranes: 0,
      arrows: 0,
      sutra: 0,
      smoke: 0,
      banner: 0,
      sickle: 0,
      sake: 0,
      sakeTimer: 2.6,
      fury: 0,
      furyTick: 0,
      furyPulse: 0,
      curse: 0,
      smokeTimer: 4.2,
      bannerTimer: 2.8,
      sickleTimer: 2.1,
      poseTimer: 0,
      beamPoseTimer: 0,
      beamPoseDir: 0
    });
    applyCharacterProfile();
    applyShopUpgrades();
    camera = { x: 0, y: 0, shake: 0 };
    elapsed = 0;
    score = 0;
    kills = 0;
    spawnTimer = 0;
    bossTimer = 62;
    fieldPickupTimer = 18;
    thiefTimer = rand(42, 86);
    nextSupplyDropAt = ENDGAME_TIME;
    supplyDropIndex = 0;
    openedChestCount = 0;
    maxedFallbackCount = 0;
    lastJackpotAt = -999;
    overlordSpawned = false;
    clearDelay = 0;
    clearMaxDelay = CLEAR_TRANSITION_TIME;
    clearReason = "survive";
    lastResult = null;
    projectiles = [];
    enemyBullets = [];
    enemies = [];
    gems = [];
    pickups = [];
    particles = [];
    texts = [];
    slashes = [];
    shockwaves = [];
    killRingCooldown = 0;
    puddles = [];
    furyCutin = null;
    acquiredItems = new Map();
    evolvedItems = new Map();
    introducedEnemyTypes = new Set();
    enemyIntroTimer = 0;
    clearEnemyIntroHideTimeout();
    runRewarded = false;
    runUnlocks = [];
    catVoiceTimer = 0;
    pointer.active = false;
    pointer.mode = "screen";
    pointer.id = null;
    pointer.dx = 0;
    pointer.dy = 0;
    gamepadInput.mx = 0;
    gamepadInput.my = 0;
    gamepadChoiceIndex = 0;
    centerTouchKnob();
    resetTouchStickPosition();
    toast.classList.add("hidden");
    enemyIntro.classList.add("hidden");
    if (!testMode) {
      spawnFixedChests();
      for (let i = 0; i < 22; i++) spawnEnemy(true);
    }
    updateHud();
    renderItemDock();
  }

  function makeSampledAudio() {
    const bgm = bgmTrack || new Audio("assets/japanese-fight-track.wav");
    bgm.loop = true;
    bgm.volume = 0.42;
    const jackpotLoop = new Audio("assets/sfx/slot-spin.ogg");
    jackpotLoop.loop = true;
    jackpotLoop.volume = 0.38;
    const samples = {
      hit: "assets/sfx/hit.ogg",
      kill: "assets/sfx/kill.ogg",
      hurt: "assets/sfx/hurt.ogg",
      level: "assets/sfx/confirm.ogg",
      slotStop: "assets/sfx/slot-stop.ogg",
      confirm: "assets/sfx/confirm.ogg",
      select: "assets/sfx/select.ogg"
    };
    const samplePool = Object.fromEntries(Object.entries(samples).map(([key, src]) => [key, Array.from({ length: 4 }, () => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = key === "kill" ? 0.5 : 0.72;
      return audio;
    })]));
    const sampleCursor = {};
    const AC = window.AudioContext || window.webkitAudioContext;
    const ac = AC ? new AC() : null;
    const delay = ac ? ac.createDelay() : null;
    const feedback = ac ? ac.createGain() : null;
    const master = ac ? ac.createGain() : null;
    if (ac) {
      delay.delayTime.value = 0.12;
      feedback.gain.value = 0.18;
      master.gain.value = 0.42;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(master);
      master.connect(ac.destination);
    }

    function blip(freq, dur, type, gain, destination = master) {
      if (!ac) return;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g);
      g.connect(destination);
      osc.start(t);
      osc.stop(t + dur + 0.03);
    }

    function noiseBurst(dur = 0.16, gain = 0.12) {
      if (!ac) return;
      const length = Math.max(1, Math.floor(ac.sampleRate * dur));
      const buffer = ac.createBuffer(1, length, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        const falloff = 1 - i / length;
        data[i] = (Math.random() * 2 - 1) * falloff * falloff;
      }
      const src = ac.createBufferSource();
      const filter = ac.createBiquadFilter();
      const g = ac.createGain();
      const t = ac.currentTime;
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(680, t);
      filter.Q.setValueAtTime(0.9, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.buffer = buffer;
      src.connect(filter);
      filter.connect(g);
      g.connect(delay || master);
      src.start(t);
      src.stop(t + dur + 0.02);
    }

    function sliceBurst() {
      if (!ac) return;
      const t = ac.currentTime;
      const length = Math.max(1, Math.floor(ac.sampleRate * 0.155));
      const buffer = ac.createBuffer(1, length, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        const x = i / length;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - x, 3.4);
      }
      const src = ac.createBufferSource();
      const filter = ac.createBiquadFilter();
      const g = ac.createGain();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(520, t);
      filter.Q.setValueAtTime(0.65, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.28, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.155);
      src.buffer = buffer;
      src.connect(filter);
      filter.connect(g);
      g.connect(delay || master);
      src.start(t);
      src.stop(t + 0.17);
      blip(rand(72, 96), 0.06, "sawtooth", 0.035);
    }

    function playSample(key, volume = 1) {
      const pool = samplePool[key];
      if (!pool) return false;
      const index = sampleCursor[key] = ((sampleCursor[key] || 0) + 1) % pool.length;
      const sound = pool[index];
      sound.pause();
      sound.currentTime = 0;
      sound.volume = Math.min(1, (key === "kill" ? 0.5 : 0.72) * volume);
      sound.play().catch(() => {});
      return true;
    }

    return {
      start() {
        if (ac && ac.state === "suspended") ac.resume();
        bgm.currentTime = bgm.paused ? 0 : bgm.currentTime;
        bgm.volume = 0.42;
        bgm.play().catch(() => {});
      },
      stop() {
        bgm.pause();
        jackpotLoop.pause();
      },
      startJackpot() {
        bgm.volume = 0.05;
        jackpotLoop.currentTime = 0;
        jackpotLoop.play().catch(() => {});
      },
      stopJackpot() {
        jackpotLoop.pause();
        bgm.volume = 0.42;
      },
      duck(value = true) {
        bgm.volume = value ? 0.16 : 0.42;
      },
      sfx(kind) {
        if (kind === "hit") playSample("hit", 0.55) || blip(rand(140, 220), 0.07, "sawtooth", 0.08);
        if (kind === "hurt") playSample("hurt", 0.85) || blip(120, 0.12, "sawtooth", 0.1);
        if (kind === "kill") {
          playSample("kill", 1.08);
          sliceBurst();
        }
        if (kind.startsWith("slotStop")) {
          const tier = Number(kind.replace("slotStop", "")) || 1;
          const pitch = 560 + tier * 165;
          const gain = Math.min(0.62, 0.34 + tier * 0.045);
          playSample("slotStop", 1);
          noiseBurst(0.07, 0.28 + tier * 0.035);
          blip(68 + tier * 22, 0.13, "sawtooth", 0.2 + tier * 0.022, delay || master);
          [0, 7, 12].forEach((semi, i) => {
            setTimeout(() => {
              blip(pitch * Math.pow(2, semi / 12), 0.18 - i * 0.018, i === 0 ? "square" : "triangle", gain - i * 0.04, delay || master);
            }, i * 52);
          });
          setTimeout(() => blip(pitch * 2.08, 0.14, "square", 0.26 + tier * 0.025, delay || master), 170);
          if (tier >= 3) setTimeout(() => noiseBurst(0.16 + tier * 0.012, 0.26 + tier * 0.035), 42);
          if (tier >= 5) {
            setTimeout(() => blip(pitch * 2.7, 0.17, "square", 0.34 + tier * 0.018, delay || master), 235);
            setTimeout(() => noiseBurst(0.24, 0.42), 260);
          }
          if (tier >= 7) {
            setTimeout(() => blip(pitch * 3.1, 0.2, "square", 0.44, delay || master), 330);
            setTimeout(() => blip(pitch * 3.6, 0.18, "triangle", 0.36, delay || master), 410);
          }
        }
        if (kind === "cutin") {
          playSample("confirm", 1);
          [220, 330, 660, 990, 1320].forEach((n, i) => setTimeout(() => blip(n, 0.22, i < 2 ? "sawtooth" : "square", 0.1, delay || master), i * 72));
          setTimeout(() => noiseBurst(0.28, 0.22), 120);
        }
        if (kind === "select") playSample("select", 0.7);
        if (kind === "confirm") playSample("confirm", 0.8);
        if (kind === "slash") blip(rand(360, 620), 0.12, "triangle", 0.08, delay || master);
        if (kind === "level") {
          playSample("level", 0.86);
          [440, 554, 660, 880].forEach((n, i) => setTimeout(() => blip(n, 0.16, "triangle", 0.09, delay || master), i * 42));
        }
        if (kind === "fury") {
          playSample("confirm", 1);
          noiseBurst(0.22, 0.32);
          [196, 294, 392, 588, 784, 1176].forEach((n, i) => {
            setTimeout(() => blip(n, 0.2, i < 2 ? "sawtooth" : "square", 0.11 + i * 0.018, delay || master), i * 46);
          });
        }
        if (kind === "chest") [330, 494, 660, 990].forEach((n, i) => setTimeout(() => blip(n, 0.18, "square", 0.07, delay || master), i * 55));
      }
    };
  }

  function makeAudio() {
    return makeSampledAudio();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ac = new AC();
    const master = ac.createGain();
    const delay = ac.createDelay();
    const feedback = ac.createGain();
    const drive = ac.createWaveShaper();
    const lowpass = ac.createBiquadFilter();
    master.gain.value = 0.32;
    delay.delayTime.value = 0.155;
    feedback.gain.value = 0.28;
    lowpass.type = "lowpass";
    lowpass.frequency.value = 9800;
    drive.curve = makeDistortionCurve(160);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(lowpass);
    lowpass.connect(master);
    master.connect(ac.destination);

    let step = 0;
    let next = ac.currentTime + 0.06;
    const tempo = 168;
    const unit = 60 / tempo / 2;
    const root = 55;
    const pentatonic = [0, 3, 5, 7, 10, 12, 15, 17].map(n => root * Math.pow(2, n / 12));
    const riff = [0, 0, 3, 0, 5, 7, 5, 3, 0, 10, 7, 5, 3, 5, 0, 0];

    function env(t, peak, attack, release) {
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + release);
      return g;
    }

    function tone(freq, t, dur, type, gain, destination = master) {
      const osc = ac.createOscillator();
      const g = env(t, gain, 0.006, dur);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      osc.connect(g);
      g.connect(destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    }

    function shamisen(freq, t) {
      const pluck = ac.createOscillator();
      const filter = ac.createBiquadFilter();
      const g = env(t, 0.11, 0.002, 0.18);
      pluck.type = "sawtooth";
      pluck.frequency.setValueAtTime(freq, t);
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq * 5.2, t);
      filter.Q.value = 8;
      pluck.connect(filter);
      filter.connect(g);
      g.connect(delay);
      pluck.start(t);
      pluck.stop(t + 0.22);
    }

    function guitar(freq, t, dur) {
      const mix = ac.createGain();
      const g = env(t, 0.06, 0.01, dur);
      [1, 1.5].forEach((ratio, i) => {
        const osc = ac.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq * ratio, t);
        osc.detune.value = i ? -7 : 7;
        osc.connect(mix);
        osc.start(t);
        osc.stop(t + dur + 0.04);
      });
      mix.connect(drive);
      drive.connect(g);
      g.connect(master);
    }

    function noise(t, dur, gain, hp) {
      const buffer = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource();
      const f = ac.createBiquadFilter();
      const g = env(t, gain, 0.003, dur);
      f.type = hp ? "highpass" : "bandpass";
      f.frequency.value = hp ? 6500 : 150;
      src.buffer = buffer;
      src.connect(f);
      f.connect(g);
      g.connect(master);
      src.start(t);
      src.stop(t + dur);
    }

    function kick(t) {
      const osc = ac.createOscillator();
      const g = env(t, 0.78, 0.003, 0.2);
      osc.type = "sine";
      osc.frequency.setValueAtTime(118, t);
      osc.frequency.exponentialRampToValueAtTime(43, t + 0.16);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.22);
    }

    function schedule() {
      while (next < ac.currentTime + 0.2) {
        const s = step % 16;
        if (s === 0 || s === 8) kick(next);
        if (s === 4 || s === 12) noise(next, 0.13, 0.32, false);
        if (s % 2 === 1) noise(next, 0.035, 0.12, true);
        if (s % 4 === 0) guitar(root * (s === 8 ? 1.335 : 1), next, unit * 3.4);
        if (s % 2 === 0) shamisen(pentatonic[riff[step % riff.length] % pentatonic.length] * 2, next);
        if (s === 14) tone(root * 4, next, unit * 1.7, "triangle", 0.06, delay);
        step++;
        next += unit;
      }
      audio.timer = setTimeout(schedule, 35);
    }

    return {
      ac,
      master,
      timer: 0,
      start() {
        if (ac.state === "suspended") ac.resume();
        clearTimeout(this.timer);
        master.gain.cancelScheduledValues(ac.currentTime);
        master.gain.setTargetAtTime(0.32, ac.currentTime, 0.05);
        if (next < ac.currentTime) next = ac.currentTime + 0.05;
        schedule();
      },
      stop() {
        clearTimeout(this.timer);
        master.gain.setTargetAtTime(0.0001, ac.currentTime, 0.08);
      },
      sfx(kind) {
        const t = ac.currentTime;
        if (kind === "hit") tone(rand(130, 190), t, 0.08, "sawtooth", 0.07);
        if (kind === "slash") shamisen(rand(320, 520), t);
        if (kind === "level") [440, 550, 660, 880].forEach((n, i) => shamisen(n, t + i * 0.04));
        if (kind === "chest") [330, 494, 660].forEach((n, i) => tone(n, t + i * 0.06, 0.16, "triangle", 0.09, delay));
      }
    };
  }

  function makeDistortionCurve(amount) {
    const samples = 256;
    const curve = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
      const x = i * 2 / samples - 1;
      curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  function playCatVoice(kind = "meow", volume = 0.58, force = false) {
    if (player.character === "denkichi") return;
    if (!force && catVoiceTimer > 0) return;
    const source = kind === "pain" ? catPainTrack : catMeowTrack;
    if (!source) return;
    catVoiceTimer = kind === "pain" ? 0.8 : 0.46;
    const voice = source.cloneNode();
    voice.volume = volume;
    voice.playbackRate = kind === "pain" ? rand(0.96, 1.04) : rand(0.92, 1.08);
    voice.play().catch(() => {});
  }

  function playEndingBgm() {
    if (!endingBgmTrack) return;
    try {
      endingBgmTrack.volume = 0.48;
      endingBgmTrack.currentTime = 0;
      endingBgmTrack.play().catch(() => {});
    } catch (error) {
      // Ending should never be blocked by audio seek/play failures on mobile browsers.
    }
  }

  function stopEndingBgm() {
    if (!endingBgmTrack) return;
    try {
      endingBgmTrack.pause();
      endingBgmTrack.currentTime = 0;
    } catch (error) {
      // Some mobile browsers reject currentTime changes before metadata is ready.
    }
  }

  function startGame(options = {}) {
    testMode = !!options.test;
    clearEndingFallbackTimer();
    stopEndingBgm();
    titleScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    endingScreen.classList.add("hidden");
    shopScreen.classList.add("hidden");
    recordsScreen.classList.add("hidden");
    encyclopediaScreen.classList.add("hidden");
    levelScreen.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    pauseButton.textContent = "ステータス";
    pauseReturnState = "playing";
    resetGame();
    if (testMode) spawnTestOverlord();
    state = "playing";
    if (!audio) audio = makeAudio();
    if (audio) audio.start();
    playCatVoice("meow", 0.42, true);
    last = performance.now();
    frameCarry = 0;
  }

  function updateTitleMoney() {
    if (titleMoney) titleMoney.textContent = `所持金 ${metaSave.money}両 / セーブ${activeSaveSlot}`;
    if (shopMoney) shopMoney.textContent = `${metaSave.money}両`;
    renderCharacterSelect();
  }

  function isCharacterUnlocked(id) {
    return id === "piimaru" || (metaSave.unlockedCharacters || []).includes(id);
  }

  function activeCharacterDef() {
    const selected = isCharacterUnlocked(metaSave.selectedCharacter) ? metaSave.selectedCharacter : "piimaru";
    return playableCharacters.find(character => character.id === selected) || playableCharacters[0];
  }

  function unlockCharacter(id) {
    if (!metaSave.unlockedCharacters) metaSave.unlockedCharacters = ["piimaru"];
    if (metaSave.unlockedCharacters.includes(id)) return false;
    metaSave.unlockedCharacters.push(id);
    return true;
  }

  function renderCharacterSelect() {
    if (!characterSelect) return;
    const unlocked = playableCharacters.filter(character => isCharacterUnlocked(character.id));
    if (unlocked.length <= 1) {
      characterSelect.innerHTML = "";
      characterSelect.classList.add("hidden");
      return;
    }
    characterSelect.classList.remove("hidden");
    const selected = activeCharacterDef().id;
    characterSelect.innerHTML = `
      <span>操作キャラ</span>
      ${unlocked.map(character => `
        <button class="${character.id === selected ? "active" : ""}" data-character-id="${character.id}">
          <img src="${characterSpritePaths[character.spriteKey]}" alt="">
          <b>${character.name}</b>
          <small>${character.label}</small>
        </button>
      `).join("")}
    `;
  }

  function selectCharacter(id) {
    if (!isCharacterUnlocked(id)) return;
    metaSave.selectedCharacter = id;
    saveMeta();
    renderCharacterSelect();
    const character = activeCharacterDef();
    showToast({ sprite: 11 }, `${character.name}を選択`);
  }

  function renderSaveSlots() {
    if (!saveSlots) return;
    saveSlots.innerHTML = "";
    for (let slot = 1; slot <= SAVE_SLOT_COUNT; slot++) {
      const button = document.createElement("button");
      button.className = `save-slot${slot === activeSaveSlot ? " active" : ""}`;
      button.dataset.saveSlot = slot;
      button.innerHTML = `<b>セーブ${slot}</b>`;
      saveSlots.appendChild(button);
    }
  }

  function switchSaveSlot(slot) {
    if (state !== "title" && state !== "shop") return;
    activeSaveSlot = clamp(Math.floor(Number(slot)) || 1, 1, SAVE_SLOT_COUNT);
    try {
      localStorage.setItem(ACTIVE_SAVE_SLOT_KEY, String(activeSaveSlot));
    } catch (error) {
      // localStorage may be unavailable in strict browser privacy modes.
    }
    metaSave = loadSave(activeSaveSlot);
    resetGame();
    renderSaveSlots();
    renderShop();
    updateTitleMoney();
    showToast({ sprite: 11 }, `セーブ${activeSaveSlot}を選択`);
  }

  function renderShop() {
    updateTitleMoney();
    renderSaveSlots();
    renderShopStats();
    if (!shopItems) return;
    shopItems.innerHTML = shopUpgrades.map(def => {
      const level = upgradeLevel(def.id);
      const maxed = level >= def.max;
      const cost = maxed ? 0 : upgradeCost(def);
      const affordable = metaSave.money >= cost;
      const label = maxed ? "最大" : `${cost}両`;
      return `
        <div class="shop-item${maxed ? " maxed" : ""}">
          <div class="shop-icon">${def.icon}</div>
          <div>
            <div class="shop-name">
          <span>${displayItemName(def)}</span>
              <span class="shop-level">Lv ${level}/${def.max}</span>
            </div>
            <p class="shop-desc">${def.desc}</p>
          </div>
          <button class="shop-buy" data-shop-id="${def.id}" ${maxed || !affordable ? "disabled" : ""}>${label}</button>
        </div>
      `;
    }).join("");
  }

  function renderShopStats() {
    if (!shopStats) return;
    const hp = upgradeLevel("hp") * 10;
    const damage = upgradeLevel("damage");
    const speed = upgradeLevel("speed") * 4;
    const magnet = upgradeLevel("magnet") * 12;
    const armor = Math.ceil(upgradeLevel("armor") * 0.55);
    const luck = upgradeLevel("luck") * 1.2;
    const rows = [
      { label: "最大HP", base: "130", bonus: `+${hp}`, value: `${130 + hp}` },
      { label: "基礎攻撃", base: "18", bonus: `+${damage}`, value: `${18 + damage}` },
      { label: "移動速度", base: "130", bonus: `+${speed}`, value: `${130 + speed}` },
      { label: "吸引範囲", base: "150", bonus: `+${magnet}`, value: `${150 + magnet}` },
      { label: "防御", base: "0", bonus: `+${armor}`, value: `${armor}` },
      { label: "運", base: "0%", bonus: `+${luck.toFixed(1)}%`, value: `${luck.toFixed(1)}%` }
    ];
    shopStats.innerHTML = `
      <div class="shop-stats-title">現在の強化</div>
      ${rows.map(row => `
        <div class="shop-stat">
          <span>${row.label}</span>
          <b>${row.value}</b>
          <i>基礎 ${row.base} / ${row.bonus}</i>
        </div>
      `).join("")}
    `;
  }

  function formatRecordNumber(value) {
    return Math.max(0, Math.floor(Number(value) || 0)).toLocaleString("ja-JP");
  }

  function formatBossRecordTime(value) {
    const time = Math.max(0, Math.floor(Number(value) || 0));
    return time > 0 ? formatClock(time) : "--:--";
  }

  function renderRecords() {
    if (!recordsCard) return;
    metaSave.stats = normalizeStats(metaSave.stats);
    const stats = metaSave.stats;
    const winRate = stats.runs ? Math.round(stats.wins / stats.runs * 100) : 0;
    const bossBest = formatBossRecordTime(stats.bestBossTime);
    const title = stats.bestBossTime > 0
      ? "黒角王討伐の証"
      : stats.bestTime >= ENDING_TIME
        ? "夜明けを越えし猫武者"
      : stats.bestKills >= 600
        ? "鬼哭の剣豪"
        : stats.runs > 0
          ? "戦場を知る者"
          : "初陣を待つ者";
    const rows = [
      ["ボス最速討伐", bossBest],
      ["最長生存", formatClock(stats.bestTime)],
      ["最高ソウル", formatRecordNumber(stats.bestScore)],
      ["最高撃破", `${formatRecordNumber(stats.bestKills)}体`],
      ["最高レベル", `Lv ${formatRecordNumber(stats.bestLevel)}`],
      ["最高報酬", `${formatRecordNumber(stats.bestReward)}両`],
      ["出陣回数", `${formatRecordNumber(stats.runs)}回`],
      ["討伐成功", `${formatRecordNumber(stats.wins)}回`],
      ["勝率", `${winRate}%`],
      ["累計ソウル", formatRecordNumber(stats.totalScore)],
      ["累計撃破", `${formatRecordNumber(stats.totalKills)}体`],
      ["累計獲得", `${formatRecordNumber(stats.totalEarned)}両`],
      ["所持金", `${formatRecordNumber(metaSave.money)}両`]
    ];
    recordsCard.innerHTML = `
      <div class="records-hero">
        <span>セーブ${activeSaveSlot}</span>
        <strong>${title}</strong>
        <b>${bossBest}</b>
      </div>
      <div class="records-feature">
        <div><span>ボス最速</span><b>${bossBest}</b></div>
        <div><span>最高撃破</span><b>${formatRecordNumber(stats.bestKills)}</b></div>
        <div><span>最高Lv</span><b>${formatRecordNumber(stats.bestLevel)}</b></div>
      </div>
      <div class="records-grid">
        ${rows.map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`).join("")}
      </div>
      <div class="records-footer">
        <span>猫武者 ぴぃ丸</span>
        <span>&copy;2026 HanaSaku</span>
      </div>
    `;
  }

  function openRecords() {
    state = "records";
    gamepadChoiceIndex = 0;
    titleScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    endingScreen.classList.add("hidden");
    levelScreen.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    shopScreen.classList.add("hidden");
    encyclopediaScreen.classList.add("hidden");
    recordsScreen.classList.remove("hidden");
    renderRecords();
  }

  function closeRecords() {
    state = "title";
    gamepadChoiceIndex = 0;
    recordsScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");
    renderSaveSlots();
    updateTitleMoney();
  }

  function encyclopediaItemCard(entry) {
    return `
      <article class="encyclopedia-card" style="--accent:${entry.accent || "#ffdf5a"}">
        <div class="encyclopedia-art">
          <span class="encyclopedia-item-icon" style="${spriteStyle(entry.sprite)}"></span>
        </div>
        <div class="encyclopedia-copy">
          ${entry.typeLabel && entry.showType ? `<span class="encyclopedia-type">${entry.typeLabel}</span>` : ""}
          <h3>${entry.name}</h3>
          <p>${entry.desc}</p>
          ${entry.materialsHtml || ""}
          ${entry.meta && entry.meta.length ? `<div class="encyclopedia-meta">${entry.meta.slice(0, 1).map(value => `<span>${value}</span>`).join("")}</div>` : ""}
        </div>
      </article>
    `;
  }

  function encyclopediaEnemyCard(enemy) {
    const src = characterSpritePaths[enemy.id] || characterSpritePaths.wraith;
    return `
      <article class="encyclopedia-card" style="--accent:${enemy.accent || "#ffdf5a"}">
        <div class="encyclopedia-art">
          <img class="encyclopedia-enemy-img" src="${src}" alt="${enemy.name}">
        </div>
        <div class="encyclopedia-copy">
          <span class="encyclopedia-type">${enemy.type}</span>
          <h3>${enemy.name}</h3>
          <p>${enemy.desc}</p>
        </div>
      </article>
    `;
  }

  function renderEncyclopedia(tab = "items") {
    if (!encyclopediaList || !encyclopediaTabs) return;
    encyclopediaTabs.querySelectorAll("button").forEach(button => {
      button.classList.toggle("active", button.dataset.encyclopediaTab === tab);
    });
    if (tab === "enemies") {
      encyclopediaList.innerHTML = encyclopediaEnemyCopy
        .filter(enemy => enemy.id !== "denkichi" || isCharacterUnlocked("denkichi"))
        .map(encyclopediaEnemyCard)
        .join("");
      return;
    }
    if (tab === "evolutions") {
      encyclopediaList.innerHTML = evolutionRecipes.map(recipe => {
        const copy = encyclopediaEvolutionCopy[recipe.id] || recipe;
        const materials = recipe.requires.map(id => {
          const def = findItemDef(id);
          const copy = encyclopediaItemCopy[id] || def || {};
          return {
            name: def ? displayItemName(def) : (copy.name || id),
            sprite: def?.sprite || copy.sprite || 0
          };
        });
        const materialsHtml = `
          <div class="encyclopedia-materials" aria-label="素材">
            ${materials.map((material, index) => `
              ${index ? `<span class="encyclopedia-material-plus">+</span>` : ""}
              <span class="encyclopedia-material-chip">
                <span class="encyclopedia-material-icon" style="${spriteStyle(material.sprite)}"></span>
                <span>${material.name}</span>
              </span>
            `).join("")}
          </div>
        `;
        return encyclopediaItemCard({
          name: copy.name,
          desc: copy.desc,
          sprite: recipe.sprite,
          typeLabel: "合成奥義",
          accent: copy.accent,
          materialsHtml,
          meta: ["最高Lv同士で候補"]
        });
      }).join("");
      return;
    }
    const itemCards = itemDefs.map(def => {
      const copy = encyclopediaItemCopy[def.id] || def;
      return {
        name: displayItemName(def),
        desc: copy.desc,
        sprite: def.sprite,
        typeLabel: def.type === "active" ? "武具" : "守具",
        accent: copy.accent,
        meta: []
      };
    });
    const pickupCards = encyclopediaPickupCopy.map(item => ({
      name: item.name,
      desc: item.desc,
      sprite: item.sprite,
      typeLabel: item.type,
      accent: item.accent,
      meta: []
    }));
    encyclopediaList.innerHTML = itemCards.concat(pickupCards).map(encyclopediaItemCard).join("");
  }

  function openEncyclopedia() {
    encyclopediaReturnState = state === "paused" ? "paused" : "title";
    state = "encyclopedia";
    gamepadChoiceIndex = 0;
    titleScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    endingScreen.classList.add("hidden");
    levelScreen.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    shopScreen.classList.add("hidden");
    recordsScreen.classList.add("hidden");
    encyclopediaScreen.classList.remove("hidden");
    renderEncyclopedia("items");
  }

  function closeEncyclopedia() {
    gamepadChoiceIndex = 0;
    encyclopediaScreen.classList.add("hidden");
    if (encyclopediaReturnState === "paused") {
      state = "paused";
      renderPausePanel();
      pauseScreen.classList.remove("hidden");
      pauseButton.textContent = "謌ｻ繧・";
      if (audio) audio.duck(true);
      return;
    }
    state = "title";
    titleScreen.classList.remove("hidden");
    renderSaveSlots();
    updateTitleMoney();
  }

  function openShop() {
    state = "shop";
    gamepadChoiceIndex = 0;
    titleScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    endingScreen.classList.add("hidden");
    levelScreen.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    recordsScreen.classList.add("hidden");
    encyclopediaScreen.classList.add("hidden");
    shopScreen.classList.remove("hidden");
    renderShop();
  }

  function closeShop() {
    state = "title";
    gamepadChoiceIndex = 0;
    shopScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");
    updateTitleMoney();
  }

  function buyShopUpgrade(id) {
    const def = shopUpgrades.find(item => item.id === id);
    if (!def) return;
    const level = upgradeLevel(id);
    if (level >= def.max) return;
    const cost = upgradeCost(def);
    if (metaSave.money < cost) return;
    metaSave.money -= cost;
    metaSave.upgrades[id] = level + 1;
    saveMeta();
    renderShop();
    if (audio) audio.sfx("chest");
  }

  function resetSaveData() {
    const firstOk = window.confirm("所持金・武器屋の強化・戦績をすべてリセットします。よろしいですか？");
    if (!firstOk) return;
    const secondOk = window.confirm("本当にセーブデータを消します。元には戻せません。");
    if (!secondOk) return;
    metaSave = defaultSave();
    saveMeta();
    resetGame();
    renderShop();
    updateTitleMoney();
    showToast({ sprite: 11 }, "セーブデータをリセットしました");
    if (audio) audio.sfx("select");
  }

  function setupTitleStoryScroll() {
    if (!titleStory || titleStory.querySelector(".title-story-scroll")) return;
    const scroller = document.createElement("div");
    scroller.className = "title-story-scroll";
    while (titleStory.firstChild) scroller.appendChild(titleStory.firstChild);
    titleStory.appendChild(scroller);
  }

  function calculateRunReward(win) {
    const timeReward = Math.floor(Math.min(elapsed, ENDING_TIME) / 12);
    const killReward = Math.floor(kills / 14);
    const scoreReward = Math.floor(score / 800);
    const winReward = win ? 130 : 0;
    const minimum = elapsed >= 20 ? 8 : 0;
    return Math.max(minimum, timeReward + killReward + scoreReward + winReward);
  }

  function grantRunReward(win = false, reason = clearReason) {
    if (runRewarded) return 0;
    runRewarded = true;
    if (testMode) return 0;
    const reward = calculateRunReward(win);
    metaSave.money += reward;
    metaSave.stats = normalizeStats(metaSave.stats);
    metaSave.stats.runs = (Number(metaSave.stats.runs) || 0) + 1;
    if (win) metaSave.stats.wins = (Number(metaSave.stats.wins) || 0) + 1;
    if (win && reason === "boss") {
      const bossTime = Math.max(1, Math.floor(elapsed));
      const previous = Number(metaSave.stats.bestBossTime) || 0;
      metaSave.stats.bestBossTime = previous > 0 ? Math.min(previous, bossTime) : bossTime;
    }
    metaSave.stats.bestTime = Math.max(Number(metaSave.stats.bestTime) || 0, Math.floor(elapsed));
    metaSave.stats.bestScore = Math.max(Number(metaSave.stats.bestScore) || 0, Math.floor(score));
    metaSave.stats.bestKills = Math.max(Number(metaSave.stats.bestKills) || 0, Math.floor(kills));
    metaSave.stats.bestLevel = Math.max(Number(metaSave.stats.bestLevel) || 0, Math.floor(player.level));
    metaSave.stats.bestReward = Math.max(Number(metaSave.stats.bestReward) || 0, reward);
    metaSave.stats.totalEarned = (Number(metaSave.stats.totalEarned) || 0) + reward;
    metaSave.stats.totalScore = (Number(metaSave.stats.totalScore) || 0) + Math.floor(score);
    metaSave.stats.totalKills = (Number(metaSave.stats.totalKills) || 0) + Math.floor(kills);
    if (win && unlockCharacter("denkichi")) runUnlocks.push("伝吉 解放");
    saveMeta();
    updateTitleMoney();
    renderSaveSlots();
    return reward;
  }

  function addItem(def, silent = false) {
    if (!canReceiveItem(def)) return false;
    const current = acquiredItems.get(def.id) || 0;
    const level = current + 1;
    acquiredItems.set(def.id, level);
    def.apply(level);
    reinforceEnemiesForScaling();
    renderItemDock();
    if (!silent) showToast(def, `${displayItemName(def)} Lv ${level}`);
    return true;
  }

  function itemMaxLevel(def) {
    return Math.min(ITEM_MAX_LEVEL, Math.max(1, Number(def.max) || ITEM_MAX_LEVEL));
  }

  function findItemDef(id) {
    return itemDefs.find(item => item.id === id);
  }

  function synthesisCodeForItem(id) {
    const recipe = evolutionRecipes.find(recipe => recipe.requires.includes(id));
    return recipe ? recipe.code : "";
  }

  function displayItemName(def) {
    if (!def) return "";
    return `${def.name}${synthesisCodeForItem(def.id)}`;
  }

  function isItemMaxed(def) {
    return (acquiredItems.get(def.id) || 0) >= itemMaxLevel(def);
  }

  function isMaterialOfEvolvedItem(id) {
    for (const recipe of evolvedItems.values()) {
      if (recipe.requires.includes(id)) return true;
    }
    return false;
  }

  function nextItemLevel(def) {
    return Math.min(itemMaxLevel(def), (acquiredItems.get(def.id) || 0) + 1);
  }

  function availableEvolutionRecipes() {
    return evolutionRecipes.filter(recipe => {
      if (evolvedItems.has(recipe.id)) return false;
      return recipe.requires.every(id => {
        const def = findItemDef(id);
        return def && (acquiredItems.get(id) || 0) >= itemMaxLevel(def);
      });
    });
  }

  function performSynthesis(recipe) {
    for (const id of recipe.requires) acquiredItems.delete(id);
    evolvedItems.set(recipe.id, recipe);
    recipe.apply();
    reinforceEnemiesForScaling();
    renderItemDock();
    showToast({ sprite: recipe.sprite }, `奥義融合: ${recipe.name}`);
    burst(player.x, player.y, "#ffdf5a", 82, 14);
    shockwaves.push({ x: player.x, y: player.y, r: 46, life: 0.78, max: 0.78, color: "#ffdf5a", power: 0 });
    if (audio) audio.sfx("chest");
  }

  function maybeOfferSynthesis() {
    const recipe = availableEvolutionRecipes()[0];
    if (!recipe) return false;
    showSynthesisPrompt(recipe);
    return true;
  }

  function showSynthesisPrompt(recipe) {
    const parts = recipe.requires.map(findItemDef).filter(Boolean);
    state = "level";
    gamepadChoiceIndex = 0;
    levelScreen.classList.remove("hidden");
    levelScreen.classList.remove("jackpot-screen");
    levelScreen.querySelector("h2").textContent = "奥義融合";
    upgradeChoices.classList.remove("slot-grid", "slot-sequential", "synthesis-grid");
    upgradeChoices.classList.add("synthesis-grid");
    upgradeChoices.innerHTML = "";

    const card = document.createElement("div");
    card.className = "synthesis-card";
    card.innerHTML = `
      <div class="synthesis-materials">
        ${parts.map(part => `<span><i class="choice-icon" style="${spriteStyle(part.sprite)}"></i><b>${displayItemName(part)}</b><small>Lv ${itemMaxLevel(part)}</small></span>`).join("<strong>+</strong>")}
      </div>
      <div class="synthesis-result">
        <span class="choice-icon" style="${spriteStyle(recipe.sprite)}"></span>
        <div><strong>${recipe.name}</strong><p>${recipe.desc}</p></div>
      </div>
      <p>「${parts.map(displayItemName).join("」と「")}」を融合して「${recipe.name}」にしますか？ 素材の武具・守具は奥義枠へ移ります。</p>
    `;
    upgradeChoices.appendChild(card);

    const yes = document.createElement("button");
    yes.className = "primary-button synthesis-yes";
    yes.textContent = "融合する";
    yes.disabled = true;
    yes.addEventListener("click", () => {
      if (state !== "level") return;
      performSynthesis(recipe);
      closeChoiceScreen();
      maybeOfferSynthesis();
    }, { once: true });

    const no = document.createElement("button");
    no.className = "primary-button secondary-button synthesis-no";
    no.textContent = "今はしない";
    no.disabled = true;
    no.addEventListener("click", () => {
      if (state !== "level") return;
      showToast({ sprite: recipe.sprite }, `${recipe.name}: 保留`);
      closeChoiceScreen();
    }, { once: true });

    upgradeChoices.appendChild(yes);
    upgradeChoices.appendChild(no);
    setTimeout(() => {
      if (state !== "level") return;
      yes.disabled = false;
      no.disabled = false;
    }, 900);
    if (audio) audio.sfx("level");
  }

  function itemTypeCount(type) {
    let count = 0;
    for (const id of acquiredItems.keys()) {
      const def = itemDefs.find(item => item.id === id);
      if (def && def.type === type) count++;
    }
    return count;
  }

  function isTypeFull(type) {
    return itemTypeCount(type) >= (type === "active" ? ACTIVE_LIMIT : PASSIVE_LIMIT);
  }

  function canReceiveItem(def) {
    if (isMaterialOfEvolvedItem(def.id)) return false;
    const current = acquiredItems.get(def.id) || 0;
    if (current >= itemMaxLevel(def)) return false;
    return current > 0 || !isTypeFull(def.type);
  }

  function canUpgradeOwnedItem(def) {
    if (isMaterialOfEvolvedItem(def.id)) return false;
    return acquiredItems.has(def.id) && !isItemMaxed(def);
  }

  function itemTypeLabel(def) {
    return def.type === "active" ? "武具" : "守具";
  }

  function renderChoiceCard(item, tag) {
    return `<span class="choice-icon" style="${spriteStyle(item.sprite)}"></span><span><span class="choice-type ${item.type}">${itemTypeLabel(item)}</span><strong>${displayItemName(item)} ${tag}</strong><span>${item.desc}</span></span>`;
  }

  function hasAnyChoice() {
    return getChoices().length > 0;
  }

  function getChoices() {
    const candidates = itemDefs.filter(canReceiveItem);
    const owned = candidates.filter(def => acquiredItems.has(def.id));
    const fresh = candidates.filter(def => !acquiredItems.has(def.id));
    const pool = [...owned, ...owned, ...fresh].sort(() => Math.random() - 0.5);
    const choices = [];
    const choiceCount = chance(0.12 + player.luck * 0.45) ? 4 : 3;
    for (const item of pool) {
      if (!choices.includes(item)) choices.push(item);
      if (choices.length === choiceCount) break;
    }
    while (choices.length < choiceCount && candidates.length) {
      const item = candidates[Math.floor(rand(0, candidates.length))];
      if (!choices.includes(item)) choices.push(item);
      else break;
    }
    return choices;
  }

  function getTreasureChoices(tier) {
    const choiceCount = tier === "wood" ? 3 : tier === "red" ? 4 : 5;
    const candidates = itemDefs.filter(canReceiveItem);
    const owned = candidates.filter(def => acquiredItems.has(def.id));
    const fresh = candidates.filter(def => !acquiredItems.has(def.id));
    const pool = tier === "gold" || tier === "silver"
      ? [...owned, ...owned, ...owned, ...fresh, ...fresh]
      : [...owned, ...owned, ...fresh];
    pool.sort(() => Math.random() - 0.5);
    const choices = [];
    for (const item of pool) {
      if (!choices.includes(item)) choices.push(item);
      if (choices.length >= choiceCount) break;
    }
    while (choices.length < choiceCount && candidates.length) {
      const item = candidates[Math.floor(rand(0, candidates.length))];
      if (!choices.includes(item)) choices.push(item);
      else break;
    }
    return choices;
  }

  function closeChoiceScreen() {
    levelScreen.classList.add("hidden");
    levelScreen.classList.remove("jackpot-screen");
    levelScreen.querySelector("h2").textContent = "秘宝を選択";
    upgradeChoices.classList.remove("slot-grid", "slot-sequential", "synthesis-grid");
    upgradeChoices.innerHTML = "";
    state = "playing";
    last = performance.now();
  }

  function grantChoiceMoney(amount = 10) {
    metaSave.money += amount;
    metaSave.stats.totalEarned = (Number(metaSave.stats.totalEarned) || 0) + amount;
    saveMeta();
    updateTitleMoney();
    score += amount * 24;
    texts.push({ x: player.x, y: player.y - player.r - 28, vy: -46, life: 1.25, max: 1.25, text: `+${amount}両`, color: "#ffe37a", size: 24 });
    burst(player.x, player.y - player.r, "#ffe37a", 18, 7);
    showToast({ sprite: 11 }, `小判袋 +${amount}両`);
    if (audio) audio.sfx("chest");
  }

  function grantChoiceOnigiri() {
    const before = player.hp;
    const heal = Math.max(54, Math.round(player.maxHp * 0.36 + player.regen * 10));
    player.hp = Math.min(player.maxHp, player.hp + heal);
    const gained = Math.max(0, Math.round(player.hp - before));
    texts.push({
      x: player.x,
      y: player.y - player.r - 28,
      vy: -46,
      life: 1.25,
      max: 1.25,
      text: gained > 0 ? `+${gained}HP` : "満腹",
      color: "#fff0bb",
      size: 24
    });
    burst(player.x, player.y - player.r, "#fff0bb", 20, 7);
    showToast({ sprite: 7 }, gained > 0 ? `おにぎり +${gained}HP` : "おにぎりで満腹");
    if (audio) audio.sfx("select");
    updateHud();
  }

  function showMaxedFallbackChoice(title = "秘宝満杯") {
    state = "level";
    levelScreen.classList.remove("hidden");
    levelScreen.classList.remove("jackpot-screen");
    levelScreen.querySelector("h2").textContent = title;
    upgradeChoices.classList.remove("slot-grid", "slot-sequential", "synthesis-grid");
    upgradeChoices.innerHTML = "";
    levelChoiceReadyAt = performance.now() + 1000;
    const lockedButtons = [];

    const choices = [
      {
        sprite: 7,
        type: "回復",
        name: "おにぎり",
        desc: "HPを大きく回復して戦場へ戻る。",
        action: grantChoiceOnigiri
      },
      {
        sprite: 11,
        type: "報酬",
        name: "小判袋 +10両",
        desc: "所持金に変えて次の出陣に備える。",
        action: () => grantChoiceMoney(10)
      }
    ];

    for (const choice of choices) {
      const button = document.createElement("button");
      button.className = choice.sprite === 11 ? "upgrade-card coin-card" : "upgrade-card";
      button.disabled = true;
      button.innerHTML = `<span class="choice-icon" style="${spriteStyle(choice.sprite)}"></span><span><span class="choice-type passive">${choice.type}</span><strong>${choice.name}</strong><span>${choice.desc}</span></span>`;
      button.addEventListener("click", () => {
        if (performance.now() < levelChoiceReadyAt) return;
        choice.action();
        closeChoiceScreen();
      });
      upgradeChoices.appendChild(button);
      lockedButtons.push(button);
    }

    setTimeout(() => {
      if (state !== "level") return;
      for (const button of lockedButtons) button.disabled = false;
    }, 1000);
    if (audio) audio.sfx("level");
  }

  function resolveMaxedFallbackReward(title = "秘宝満杯") {
    maxedFallbackCount += 1;
    if (maxedFallbackCount % 3 === 0) {
      showMaxedFallbackChoice(title);
      return;
    }
    grantChoiceMoney(10);
    state = "playing";
    last = performance.now();
  }

  function showTreasureChoice(tier, chest) {
    const choices = getTreasureChoices(tier);
    if (!choices.length) {
      resolveMaxedFallbackReward(`${chest.name}の秘宝`);
      return;
    }
    state = "level";
    levelScreen.classList.remove("hidden");
    levelScreen.classList.remove("jackpot-screen");
    levelScreen.querySelector("h2").textContent = `${chest.name}の秘宝`;
    upgradeChoices.classList.remove("slot-grid", "slot-sequential", "synthesis-grid");
    upgradeChoices.innerHTML = "";
    levelChoiceReadyAt = performance.now() + 1000;
    const lockedButtons = [];

    for (const item of choices) {
      const level = nextItemLevel(item);
      const tag = acquiredItems.has(item.id) ? `Lv ${level}` : "NEW";
      const button = document.createElement("button");
      button.className = "upgrade-card";
      button.disabled = true;
      button.innerHTML = renderChoiceCard(item, tag);
      button.addEventListener("click", () => {
        if (performance.now() < levelChoiceReadyAt) return;
        if (addItem(item)) {
          burst(player.x, player.y, chest.glow, 40, 10);
          shockwaves.push({ x: player.x, y: player.y, r: 28, life: 0.56, max: 0.56, color: chest.glow, power: 0 });
        }
        closeChoiceScreen();
        maybeOfferSynthesis();
      });
      upgradeChoices.appendChild(button);
      lockedButtons.push(button);
    }

    const skip = document.createElement("button");
    skip.className = "upgrade-card skip-card";
    skip.disabled = true;
    skip.innerHTML = `<span><strong>拾わない</strong><span>この宝箱の秘宝を見送って戦場へ戻る</span></span>`;
    skip.addEventListener("click", () => {
      if (performance.now() < levelChoiceReadyAt) return;
      showToast({ sprite: 11 }, `${chest.name}: 見送った`);
      if (audio) audio.sfx("select");
      closeChoiceScreen();
    });
    upgradeChoices.appendChild(skip);
    lockedButtons.push(skip);
    setTimeout(() => {
      if (state !== "level") return;
      for (const button of lockedButtons) button.disabled = false;
    }, 1000);
    if (audio) audio.sfx("level");
  }

  function pauseForLevel() {
    const choices = getChoices();
    if (!choices.length) {
      resolveMaxedFallbackReward("秘宝満杯");
      return;
    }
    state = "level";
    levelScreen.classList.remove("hidden");
    levelScreen.classList.remove("jackpot-screen");
    levelScreen.querySelector("h2").textContent = "秘宝を選択";
    levelScreen.querySelector("h2").textContent = "秘宝を選択";
    upgradeChoices.classList.remove("slot-grid", "slot-sequential", "synthesis-grid");
    upgradeChoices.innerHTML = "";
    levelChoiceReadyAt = performance.now() + 1000;
    const lockedButtons = [];
    for (const item of choices) {
      const level = nextItemLevel(item);
      const tag = acquiredItems.has(item.id) ? `Lv ${level}` : "NEW";
      const button = document.createElement("button");
      button.className = "upgrade-card";
      button.disabled = true;
      button.innerHTML = renderChoiceCard(item, tag);
      button.addEventListener("click", () => {
        if (performance.now() < levelChoiceReadyAt) return;
        addItem(item);
        levelScreen.classList.add("hidden");
        burst(player.x, player.y, "#ffdf5a", 34, 9);
        shockwaves.push({ x: player.x, y: player.y, r: 24, life: 0.5, max: 0.5, color: "#ffdf5a", power: 0 });
        state = "playing";
        last = performance.now();
        maybeOfferSynthesis();
      });
      upgradeChoices.appendChild(button);
      lockedButtons.push(button);
    }
    setTimeout(() => {
      if (state !== "level") return;
      for (const button of lockedButtons) button.disabled = false;
    }, 1000);
    if (audio) audio.sfx("level");
  }

  function convertLevelToBonus() {
    player.hp = Math.min(player.maxHp, player.hp + 18);
    score += 80 + player.level * 10;
    showToast({ sprite: 11 }, "秘宝満杯: 小判と回復に変換");
    state = "playing";
    levelScreen.classList.add("hidden");
    upgradeChoices.innerHTML = "";
    last = performance.now();
  }

  function canMultiUpgrade() {
    return itemDefs.filter(canUpgradeOwnedItem).length >= 3;
  }

  function canChestSlot() {
    return itemDefs.filter(canReceiveItem).length >= 3;
  }

  function canStartJackpot(minGap = 58) {
    return elapsed - lastJackpotAt >= minGap;
  }

  function triggerMultiUpgrade() {
    state = "level";
    levelScreen.classList.remove("hidden");
    levelScreen.classList.add("jackpot-screen");
    levelScreen.querySelector("h2").textContent = "猫箱大当たり";
    upgradeChoices.innerHTML = "";
    levelScreen.classList.add("jackpot-screen");
    levelScreen.querySelector("h2").textContent = "猫箱大当たり";
    const candidates = itemDefs
      .filter(canReceiveItem)
      .sort(() => Math.random() - 0.5);
    const count = Math.min(candidates.length, 3 + Math.floor(rand(0, 3)));
    const winners = candidates.slice(0, count);
    levelScreen.querySelector("h2").textContent = "猫箱大当たり";
    upgradeChoices.classList.add("slot-grid");
    const reels = [];
    for (let i = 0; i < count; i++) {
      const card = document.createElement("div");
      card.className = "upgrade-card slot-card spinning";
      upgradeChoices.appendChild(card);
      reels.push(card);
    }
    burst(player.x, player.y, "#ffdf5a", 70, 12);
    shockwaves.push({ x: player.x, y: player.y, r: 28, life: 0.68, max: 0.68, color: "#ffdf5a", power: 0 });
    if (audio) audio.sfx("chest");

    let ticks = 0;
    const spinPool = candidates.length ? candidates : itemDefs.filter(canUpgradeOwnedItem);
    const spin = setInterval(() => {
      ticks++;
      reels.forEach((card, index) => {
        const item = spinPool[(Math.floor(rand(0, spinPool.length)) + ticks + index) % spinPool.length];
        const level = nextItemLevel(item);
        card.innerHTML = `<span class="choice-icon" style="${spriteStyle(item.sprite)}"></span><span><strong>${displayItemName(item)}</strong><span>Lv ${level}</span></span>`;
      });
      if (ticks >= 18) {
        clearInterval(spin);
        winners.forEach((item, index) => {
          addItem(item, true);
          const level = acquiredItems.get(item.id) || 1;
          reels[index].classList.remove("spinning");
          reels[index].classList.add("slot-win");
          reels[index].innerHTML = `<span class="choice-icon" style="${spriteStyle(item.sprite)}"></span><span><strong>${displayItemName(item)} Lv ${level}</strong><span>強化確定</span></span>`;
        });
      }
    }, 72);

    setTimeout(() => {
      if (state !== "level") return;
      levelScreen.classList.add("hidden");
      levelScreen.querySelector("h2").textContent = "秘宝を選択";
      upgradeChoices.classList.remove("slot-grid", "slot-sequential", "synthesis-grid");
      upgradeChoices.innerHTML = "";
      state = "playing";
      last = performance.now();
      maybeOfferSynthesis();
    }, 3200);
  }

  function triggerMultiUpgrade() {
    state = "level";
    levelScreen.classList.remove("hidden");
    levelScreen.querySelector("h2").textContent = "猫箱大当たり";
    upgradeChoices.classList.add("slot-grid");
    upgradeChoices.innerHTML = "";
    levelScreen.classList.add("jackpot-screen");
    levelScreen.querySelector("h2").textContent = "猫箱大当たり";

    const candidates = itemDefs
      .filter(canUpgradeOwnedItem)
      .sort(() => Math.random() - 0.5);
    if (candidates.length < 3) {
      pauseForLevel();
      return;
    }

    const count = Math.min(candidates.length, 3 + Math.floor(rand(0, 3)));
    const winners = candidates.slice(0, count);
    const spinPool = candidates.length ? candidates : itemDefs.filter(canUpgradeOwnedItem);
    const reels = winners.map(() => {
      const card = document.createElement("div");
      card.className = "upgrade-card slot-card spinning";
      upgradeChoices.appendChild(card);
      return card;
    });

    burst(player.x, player.y, "#ffdf5a", 76, 12);
    shockwaves.push({ x: player.x, y: player.y, r: 28, life: 0.68, max: 0.68, color: "#ffdf5a", power: 0 });
    if (audio) audio.sfx("chest");
    if (audio) audio.startJackpot();

    let ticks = 0;
    let stopped = 0;
    let ready = false;
    const stopTicks = reels.map((_, index) => 30 + index * 13);
    const spin = setInterval(() => {
      ticks++;
      reels.forEach((card, index) => {
        if (ticks >= stopTicks[index]) {
          if (!card.classList.contains("slot-win")) {
            const item = winners[index];
            addItem(item, true);
            const level = acquiredItems.get(item.id) || 1;
            card.classList.remove("spinning");
            card.classList.add("slot-win");
            card.innerHTML = `<span class="choice-icon" style="${spriteStyle(item.sprite)}"></span><span><strong>${displayItemName(item)} Lv ${level}</strong><span>強化確定</span></span>`;
            card.innerHTML = `<span class="choice-icon" style="${spriteStyle(item.sprite)}"></span><span><strong>${displayItemName(item)} Lv ${level}</strong><span>強化確定</span></span>`;
            stopped++;
            if (audio) audio.sfx("slotStop");
            burst(player.x, player.y, index % 2 ? "#58f3e4" : "#ffdf5a", 56, 13);
            shockwaves.push({ x: player.x, y: player.y, r: 24 + index * 12, life: 0.7, max: 0.7, color: index % 2 ? "#58f3e4" : "#ffdf5a", power: 0 });
            camera.shake = Math.max(camera.shake, 18 + index * 2);
          }
          return;
        }
        const item = spinPool[(Math.floor(rand(0, spinPool.length)) + ticks + index) % spinPool.length];
        const level = nextItemLevel(item);
        card.innerHTML = `<span class="choice-icon" style="${spriteStyle(item.sprite)}"></span><span><strong>${displayItemName(item)}</strong><span>Lv ${level}</span></span>`;
      });

      if (stopped === reels.length && !ready) {
        ready = true;
        clearInterval(spin);
        const button = document.createElement("button");
        button.className = "primary-button slot-continue";
        button.textContent = "進軍";
        button.textContent = "進軍";
        upgradeChoices.appendChild(button);

        const resume = () => {
          if (state !== "level") return;
          document.removeEventListener("keydown", resume);
          levelScreen.classList.add("hidden");
          levelScreen.querySelector("h2").textContent = "秘宝を選択";
          levelScreen.classList.remove("jackpot-screen");
          levelScreen.querySelector("h2").textContent = "秘宝を選択";
          upgradeChoices.classList.remove("slot-grid", "slot-sequential", "synthesis-grid");
          upgradeChoices.innerHTML = "";
          if (audio) audio.stopJackpot();
          state = "playing";
          last = performance.now();
          maybeOfferSynthesis();
        };
        button.addEventListener("click", resume, { once: true });
        document.addEventListener("keydown", resume);
      }
    }, 80);
  }

  function triggerSequentialJackpot(options = {}) {
    state = "level";
    levelScreen.classList.remove("hidden");
    levelScreen.classList.add("jackpot-screen");
    levelScreen.querySelector("h2").textContent = "猫箱大当たり";
    upgradeChoices.classList.add("slot-grid", "slot-sequential");
    upgradeChoices.innerHTML = "";

    const candidates = itemDefs
      .filter(canUpgradeOwnedItem)
      .sort(() => Math.random() - 0.5);
    if (candidates.length < 3) {
      pauseForLevel();
      return;
    }
    lastJackpotAt = elapsed;

    const minCount = clamp(options.minCount || 3, 3, 5);
    const baseCount = Math.min(candidates.length, Math.max(minCount, 3 + Math.floor(rand(0, 3))));
    const winners = candidates.slice(0, Math.min(8, candidates.length));
    let targetCount = baseCount;
    let reelIndex = 0;
    let ready = false;
    const cutinAvailable = baseCount >= 5 && winners.length >= 8 && chance(0.34 + player.luck * 0.22);

    burst(player.x, player.y, "#ffdf5a", 76, 12);
    shockwaves.push({ x: player.x, y: player.y, r: 28, life: 0.68, max: 0.68, color: "#ffdf5a", power: 0 });
    if (audio) {
      audio.sfx("chest");
      audio.startJackpot();
    }

    const finish = () => {
      if (ready || state !== "level") return;
      ready = true;
      levelScreen.querySelector("h2").textContent = "大当たり確定";
      const button = document.createElement("button");
      button.className = "primary-button slot-continue";
      button.textContent = "進軍";
      upgradeChoices.appendChild(button);

      const resume = () => {
        if (state !== "level") return;
        document.removeEventListener("keydown", resume);
        levelScreen.classList.add("hidden");
        levelScreen.classList.remove("jackpot-screen");
        levelScreen.querySelector("h2").textContent = "秘宝を選択";
        upgradeChoices.classList.remove("slot-grid", "slot-sequential", "synthesis-grid");
        upgradeChoices.innerHTML = "";
        if (audio) audio.stopJackpot();
        state = "playing";
        last = performance.now();
        maybeOfferSynthesis();
      };
      button.addEventListener("click", resume, { once: true });
      document.addEventListener("keydown", resume);
    };

    const playCutin = next => {
      levelScreen.querySelector("h2").textContent = "まだ終わらぬ";
      const cutin = document.createElement("div");
      const cutinSrc = player.character === "denkichi" ? "assets/denkichi-jackpot-cutin.png" : "assets/jackpot-treasure-cutin.png";
      cutin.className = "jackpot-cutin jackpot-cutin-image";
      cutin.innerHTML = `<img src="assets/jackpot-treasure-cutin.png" alt=""><span class="cutin-badge">八連秘宝へ昇格</span>`;
      cutin.querySelector("img").src = cutinSrc;
      upgradeChoices.appendChild(cutin);
      if (audio) audio.sfx("cutin");
      burst(player.x, player.y, "#ff304f", 120, 16);
      shockwaves.push({ x: player.x, y: player.y, r: 54, life: 0.86, max: 0.86, color: "#ff304f", power: 0 });
      camera.shake = Math.max(camera.shake, 32);
      setTimeout(() => {
        if (state !== "level") return;
        cutin.remove();
        levelScreen.querySelector("h2").textContent = "超大当たり継続";
        targetCount = Math.min(8, winners.length);
        next();
      }, 1450);
    };

    const addNextReel = () => {
      if (state !== "level") return;
      if (reelIndex >= targetCount) {
        finish();
        return;
      }

      const index = reelIndex;
      const card = document.createElement("div");
      card.className = "upgrade-card slot-card spinning";
      card.innerHTML = `<span class="choice-icon"></span><span><strong>抽選中</strong><span>${index + 1}枠目</span></span>`;
      upgradeChoices.appendChild(card);

      let ticks = 0;
      const stopAt = 18 + index * 7;
      const spin = setInterval(() => {
        if (state !== "level") {
          clearInterval(spin);
          return;
        }
        ticks++;
        const item = candidates[(Math.floor(rand(0, candidates.length)) + ticks + index * 3) % candidates.length];
        const level = nextItemLevel(item);
        card.innerHTML = `<span class="choice-icon" style="${spriteStyle(item.sprite)}"></span><span><strong>${displayItemName(item)}</strong><span>Lv ${level}</span></span>`;
        if (ticks < stopAt) return;

        clearInterval(spin);
        const winner = winners[index];
        addItem(winner, true);
        const newLevel = acquiredItems.get(winner.id) || 1;
        card.classList.remove("spinning");
        card.classList.add("slot-win");
        card.innerHTML = `<span class="choice-icon" style="${spriteStyle(winner.sprite)}"></span><span><strong>${displayItemName(winner)} Lv ${newLevel}</strong><span>強化確定</span></span>`;
        if (audio) audio.sfx(`slotStop${index + 1}`);
        burst(player.x, player.y, index % 2 ? "#58f3e4" : "#ffdf5a", 56 + index * 8, 13);
        shockwaves.push({ x: player.x, y: player.y, r: 24 + index * 12, life: 0.7, max: 0.7, color: index % 2 ? "#58f3e4" : "#ffdf5a", power: 0 });
        camera.shake = Math.max(camera.shake, 18 + index * 3);

        reelIndex++;
        if (reelIndex === 5 && cutinAvailable) {
          setTimeout(() => playCutin(addNextReel), 620);
          return;
        }
        setTimeout(addNextReel, 520);
      }, Math.max(46, 78 - index * 4));
    };

    setTimeout(addNextReel, 380);
  }

  function showToast(def, text) {
    toast.innerHTML = `<span class="toast-icon" style="${spriteStyle(def.sprite)}"></span><span>${text}</span>`;
    toast.classList.remove("hidden");
    toastTimer = 2.1;
  }

  function clearEnemyIntroHideTimeout() {
    if (!enemyIntroHideTimeout) return;
    clearTimeout(enemyIntroHideTimeout);
    enemyIntroHideTimeout = 0;
  }

  function hideEnemyIntro() {
    enemyIntroTimer = 0;
    enemyIntro?.classList.add("hidden");
    clearEnemyIntroHideTimeout();
  }

  function showEnemyIntro(type) {
    if (!enemyIntro || introducedEnemyTypes.has(type)) return;
    const def = enemyIntroDefs[type];
    if (!def) return;
    introducedEnemyTypes.add(type);
    const src = characterSpritePaths[type] || characterSpritePaths[def.spriteKey] || characterSpritePaths.wraith;
    const line = player.character === "denkichi" ? (enemyIntroDenkichiLines[type] || def.line) : def.line;
    enemyIntro.innerHTML = `<img src="${src}" alt=""><div><b>${def.name}</b><p>${line}</p></div>`;
    enemyIntro.classList.remove("hidden");
    enemyIntroTimer = 5;
    clearEnemyIntroHideTimeout();
    enemyIntroHideTimeout = setTimeout(hideEnemyIntro, 5000);
    if (audio) audio.sfx("select");
  }

  function renderItemDock() {
    itemDock.innerHTML = "";
    const activeLimit = testMode ? Math.max(ACTIVE_LIMIT, itemTypeCount("active")) : ACTIVE_LIMIT;
    const passiveLimit = testMode ? Math.max(PASSIVE_LIMIT, itemTypeCount("passive")) : PASSIVE_LIMIT;
    itemDock.appendChild(makeDockColumn("active", "武具", activeLimit));
    itemDock.appendChild(makeDockColumn("passive", "守具", passiveLimit));
    itemDock.appendChild(makeEvolvedDockColumn());
    if (state === "paused") renderPausePanel();
  }

  function makeDockColumn(type, title, limit) {
    const column = document.createElement("div");
    column.className = `dock-column ${type}`;
    const label = document.createElement("span");
    label.className = "dock-title";
    label.textContent = title;
    column.appendChild(label);
    const items = itemEntriesByType(type);
    for (let i = 0; i < limit; i++) {
      const entry = items[i];
      const slot = document.createElement("span");
      slot.className = entry ? "dock-slot" : "dock-slot dock-empty";
      if (entry) {
        slot.title = `${displayItemName(entry.def)} Lv ${entry.level}`;
        slot.innerHTML = `<span class="dock-icon" style="${spriteStyle(entry.def.sprite)}"></span><span class="dock-level">${entry.level}</span>`;
      }
      column.appendChild(slot);
    }
    return column;
  }

  function makeEvolvedDockColumn() {
    const column = document.createElement("div");
    column.className = "dock-column evolved";
    const label = document.createElement("span");
    label.className = "dock-title dock-title-evolved";
    label.textContent = "奥義";
    column.appendChild(label);
    const entries = [...evolvedItems.values()];
    const slotCount = Math.max(3, Math.min(6, entries.length || 3));
    for (let i = 0; i < slotCount; i++) {
      const recipe = entries[i];
      const slot = document.createElement("span");
      slot.className = recipe ? "dock-slot dock-evolved-slot" : "dock-slot dock-empty dock-evolved-empty";
      if (recipe) {
        slot.title = recipe.name;
        slot.innerHTML = `<span class="dock-icon dock-evolved-icon" style="${spriteStyle(recipe.sprite)}"></span><span class="dock-level dock-evolved-mark">奥</span>`;
      }
      column.appendChild(slot);
    }
    return column;
  }

  function itemEntriesByType(type) {
    const entries = [];
    for (const [id, level] of acquiredItems.entries()) {
      const def = itemDefs.find(item => item.id === id);
      if (def && def.type === type) entries.push({ def, level });
    }
    return entries;
  }

  function formatClock(value) {
    const m = Math.floor(value / 60).toString().padStart(2, "0");
    const s = Math.floor(value % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function renderPausePanel() {
    if (!pauseStats || !pauseItems) return;
    const hpPct = clamp(player.hp / player.maxHp, 0, 1);
    const xpPct = clamp(player.xp / player.need, 0, 1);
    const activeCount = itemTypeCount("active");
    const passiveCount = itemTypeCount("passive");
    const bars = [
      ["攻撃", Math.round(player.damage), clamp(player.damage / 140, 0, 1), "#ff5a64"],
      ["火力倍率", `${Math.round(player.might * 100)}%`, clamp((player.might - 1) / 1.4, 0, 1), "#ffcf4b"],
      ["範囲", `${Math.round(player.area * 100)}%`, clamp((player.area - 1) / 1.2, 0, 1), "#58f3e4"],
      ["短縮", `${Math.round(player.cooldownBonus * 100)}%`, clamp(player.cooldownBonus / 0.5, 0, 1), "#8fb4ff"],
      ["移動", Math.round(player.speed), clamp((player.speed - 90) / 180, 0, 1), "#78e66f"],
      ["会心", `${Math.round(player.crit * 100)}%`, clamp(player.crit / 0.55, 0, 1), "#f3d0ff"]
    ];
    pauseStats.innerHTML = `
      <section class="pause-hero-card">
        <div class="pause-avatar"><span>猫</span></div>
        <div class="pause-main">
          <span class="kicker">STATUS</span>
          <h3>${activeCharacterDef().name} Lv ${player.level}</h3>
          <div class="pause-meta">
            <span>生存 ${formatClock(elapsed)}</span>
            <span>撃破 ${kills}</span>
            <span>小判 ${score}</span>
          </div>
        </div>
        <div class="pause-rings">
          ${renderPauseRing("HP", `${Math.ceil(player.hp)}/${player.maxHp}`, hpPct, "#ff3157")}
          ${renderPauseRing("XP", `${Math.floor(player.xp)}/${player.need}`, xpPct, "#49f7dc")}
        </div>
      </section>
      <section class="pause-gauge-panel">
        ${bars.map(([label, value, pct, color]) => renderPauseGauge(label, value, pct, color)).join("")}
      </section>
      <section class="pause-loadout-panel">
        ${renderPauseBadge("武器", `${activeCount}/${ACTIVE_LIMIT}`, activeCount / ACTIVE_LIMIT)}
        ${renderPauseBadge("守り", `${passiveCount}/${PASSIVE_LIMIT}`, passiveCount / PASSIVE_LIMIT)}
        ${renderPauseBadge("奥義", evolvedItems.size, clamp(evolvedItems.size / 5, 0, 1))}
        ${renderPauseBadge("幸運", `${Math.round(player.luck * 100)}%`, clamp(player.luck / 0.6, 0, 1))}
        ${renderPauseBadge("防御", player.armor, clamp(player.armor / 12, 0, 1))}
        ${renderPauseBadge("磁力", Math.round(player.magnet), clamp((player.magnet - 120) / 520, 0, 1))}
      </section>
    `;
    pauseItems.innerHTML = [
      renderPauseItemColumn("active", "武器"),
      renderPauseItemColumn("passive", "守り"),
      renderEvolvedItemColumn()
    ].join("");
    return;
    const stats = [
      ["生存時間", formatClock(elapsed)],
      ["レベル", player.level],
      ["体力", `${Math.ceil(player.hp)} / ${player.maxHp}`],
      ["撃破", kills],
      ["小判", score],
      ["攻撃", Math.round(player.damage)],
      ["威力", `${Math.round(player.might * 100)}%`],
      ["範囲", `${Math.round(player.area * 100)}%`],
      ["短縮", `${Math.round(player.cooldownBonus * 100)}%`],
      ["移動", Math.round(player.speed)],
      ["会心", `${Math.round(player.crit * 100)}%`],
      ["防御", player.armor],
      ["武具", `${itemTypeCount("active")} / ${ACTIVE_LIMIT}`],
      ["守具", `${itemTypeCount("passive")} / ${PASSIVE_LIMIT}`],
      ["奥義", evolvedItems.size],
      ["幸運", `${Math.round(player.luck * 100)}%`]
    ];
    pauseStats.innerHTML = stats.map(([label, value]) => `<div class="pause-stat"><span>${label}</span><b>${value}</b></div>`).join("");
    pauseItems.innerHTML = [
      renderPauseItemColumn("active", "武具"),
      renderPauseItemColumn("passive", "守具"),
      renderEvolvedItemColumn()
    ].join("");
  }

  function renderPauseItemColumn(type, title) {
    const entries = itemEntriesByType(type);
    const body = entries.length
      ? entries.map(({ def, level }) => `
        <div class="pause-item-row">
          <span class="dock-icon pause-item-icon" style="${spriteStyle(def.sprite)}"></span>
          <span><strong>${displayItemName(def)}</strong><span>${itemEffectText(def, level)}</span></span>
          <b>Lv ${level}/${def.max}</b>
        </div>
      `).join("")
      : `<div class="pause-item-empty">未装備</div>`;
    return `<section class="pause-item-column"><h3>${title}</h3><div class="pause-item-list">${body}</div></section>`;
  }

  function renderPauseRing(label, value, pct, color) {
    return `
      <div class="pause-ring" style="--pct:${Math.round(pct * 100)}%; --ring:${color}">
        <div><strong>${label}</strong><span>${value}</span></div>
      </div>
    `;
  }

  function renderPauseGauge(label, value, pct, color) {
    return `
      <div class="pause-gauge" style="--pct:${Math.round(pct * 100)}%; --bar:${color}">
        <span>${label}</span>
        <b>${value}</b>
        <i></i>
      </div>
    `;
  }

  function renderPauseBadge(label, value, pct) {
    return `
      <div class="pause-badge" style="--pct:${Math.round(clamp(pct, 0, 1) * 100)}%">
        <span>${label}</span>
        <b>${value}</b>
      </div>
    `;
  }

  function renderEvolvedItemColumn() {
    const entries = [...evolvedItems.values()];
    const body = entries.length
      ? entries.map(recipe => `
        <div class="pause-item-row evolved-row">
          <span class="dock-icon pause-item-icon" style="${spriteStyle(recipe.sprite)}"></span>
          <span><strong>${recipe.name}</strong><span>${recipe.desc}</span></span>
          <b>奥義</b>
        </div>
      `).join("")
      : `<div class="pause-item-empty">Lv9同士で合成</div>`;
    return `<section class="pause-item-column evolved-column"><h3>奥義</h3><div class="pause-item-list">${body}</div></section>`;
  }

  function itemEffectText(def, level) {
    return `Lv ${level}/${def.max}: ${def.desc}`;
  }

  function canOpenStatusFromLevel() {
    return state === "level" && !levelScreen.classList.contains("jackpot-screen");
  }

  function unlockReadyLevelChoiceButtons() {
    if (performance.now() < levelChoiceReadyAt) return;
    upgradeChoices.querySelectorAll("button").forEach(button => {
      if (!button.classList.contains("spinning")) button.disabled = false;
    });
  }

  function scheduleLevelChoiceUnlock() {
    const wait = Math.max(0, levelChoiceReadyAt - performance.now());
    setTimeout(() => {
      if (state === "level") unlockReadyLevelChoiceButtons();
    }, wait);
  }

  function togglePause(force = null) {
    const shouldPause = force === null ? state === "playing" || canOpenStatusFromLevel() : force;
    if (shouldPause) {
      if (state !== "playing" && !canOpenStatusFromLevel()) return;
      pauseReturnState = state === "level" ? "level" : "playing";
      if (pauseReturnState === "level") levelScreen.classList.add("hidden");
      state = "paused";
      keys.clear();
      pointer.active = false;
      pointer.id = null;
      pointer.dx = 0;
      pointer.dy = 0;
      centerTouchKnob();
      resetTouchStickPosition();
      renderPausePanel();
      pauseScreen.classList.remove("hidden");
      pauseButton.textContent = "戻る";
      if (resumeButton) resumeButton.textContent = pauseReturnState === "level" ? "秘宝選択へ戻る" : "戦場へ戻る";
      if (audio) audio.duck(true);
      return;
    }
    if (state !== "paused") return;
    pauseScreen.classList.add("hidden");
    state = pauseReturnState === "level" ? "level" : "playing";
    if (state === "level") {
      levelScreen.classList.remove("hidden");
      unlockReadyLevelChoiceButtons();
      scheduleLevelChoiceUnlock();
    }
    last = performance.now();
    frameCarry = 0;
    pauseButton.textContent = "ステータス";
    if (resumeButton) resumeButton.textContent = "戦場へ戻る";
    if (audio) audio.duck(false);
  }

  function confirmReturnToTitleFromPause() {
    if (state !== "paused") return;
    const ok = window.confirm("現在の出陣を終了してタイトルへ戻りますか？");
    if (!ok) return;
    returnToTitle();
  }

  function spriteStyle(index) {
    const col = index % ITEM_COLS;
    const row = Math.floor(index / ITEM_COLS);
    const x = ITEM_COLS === 1 ? 0 : col * 100 / (ITEM_COLS - 1);
    const y = ITEM_ROWS === 1 ? 0 : row * 100 / (ITEM_ROWS - 1);
    return `background-position:${x}% ${y}%`;
  }

  function gameOver() {
    pauseScreen.classList.add("hidden");
    pauseButton.textContent = "ステータス";
    const reward = grantRunReward(false);
    lastResult = makeResult(false, "defeat", reward);
    showResultScreen(lastResult);
    if (audio) audio.stop();
  }

  function makeResult(win, reason, reward) {
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60).toString().padStart(2, "0");
    return {
      win,
      reason,
      title: win ? reason === "boss" ? "終焉の黒角王討伐" : "夜明けまで生存" : "戦果",
      rows: [
        `生存 ${minutes}:${seconds}`,
        `撃破 ${kills}`,
        `獲得ソウル ${score}`,
        `報酬 +${reward}両`,
        `所持金 ${metaSave.money}両`,
        ...runUnlocks
      ]
    };
  }

  function showResultScreen(result) {
    state = "gameover";
    stopEndingBgm();
    pauseScreen.classList.add("hidden");
    levelScreen.classList.add("hidden");
    endingScreen.classList.add("hidden");
    titleScreen.classList.add("hidden");
    shopScreen.classList.add("hidden");
    recordsScreen.classList.add("hidden");
    encyclopediaScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
    if (resultTitle) resultTitle.textContent = result.title;
    resultStats.innerHTML = result.rows.map(row => `<span>${row}</span>`).join("");
  }

  function returnToTitle() {
    state = "title";
    testMode = false;
    pauseReturnState = "playing";
    clearEndingFallbackTimer();
    stopEndingBgm();
    gamepadChoiceIndex = 0;
    keys.clear();
    pointer.active = false;
    pointer.id = null;
    pointer.dx = 0;
    pointer.dy = 0;
    centerTouchKnob();
    resetTouchStickPosition();
    gameOverScreen.classList.add("hidden");
    endingScreen.classList.add("hidden");
    levelScreen.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    shopScreen.classList.add("hidden");
    recordsScreen.classList.add("hidden");
    encyclopediaScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");
    upgradeChoices.innerHTML = "";
    if (audio) audio.stop();
    resetGame();
    renderShop();
    updateTitleMoney();
  }

  function showEnding() {
    showEndingForClear("survive");
  }

  function clearEndingFallbackTimer() {
    if (!clearFallbackTimer) return;
    clearTimeout(clearFallbackTimer);
    clearFallbackTimer = 0;
  }

  function forceEndingScreen(reason = clearReason) {
    state = "ending";
    clearEndingFallbackTimer();
    let reward = 0;
    try {
      if (!runRewarded) reward = grantRunReward(true, reason);
      lastResult = lastResult || makeResult(true, reason, reward);
    } catch (error) {
      lastResult = { win: true, reason, title: "戦果", rows: ["クリア"] };
    }
    pauseScreen?.classList.add("hidden");
    levelScreen?.classList.add("hidden");
    gameOverScreen?.classList.add("hidden");
    titleScreen?.classList.add("hidden");
    shopScreen?.classList.add("hidden");
    recordsScreen?.classList.add("hidden");
    encyclopediaScreen?.classList.add("hidden");
    endingScreen?.classList.remove("hidden");
    try {
      if (audio) audio.stop();
    } catch (error) {
      audio = null;
    }
    playEndingBgm();
  }

  function showEndingForClear(reason = "survive") {
    clearEndingFallbackTimer();
    state = "ending";
    if (reason === "survive") elapsed = Math.max(elapsed, ENDING_TIME);
    let reward = 0;
    try {
      reward = grantRunReward(true, reason);
    } catch (error) {
      runRewarded = true;
    }
    lastResult = makeResult(true, reason, reward);
    pauseScreen?.classList.add("hidden");
    levelScreen?.classList.add("hidden");
    gameOverScreen?.classList.add("hidden");
    titleScreen?.classList.add("hidden");
    shopScreen?.classList.add("hidden");
    recordsScreen?.classList.add("hidden");
    encyclopediaScreen?.classList.add("hidden");
    if (upgradeChoices) upgradeChoices.innerHTML = "";
    if (pauseButton) pauseButton.textContent = "ステータス";
    endingScreen?.classList.remove("hidden");
    try {
      updateHud();
    } catch (error) {
      // HUD is secondary during ending transition.
    }
    try {
      if (audio) audio.stop();
    } catch (error) {
      audio = null;
    }
    playEndingBgm();
  }

  function purgeEnemiesForEnding() {
    for (const enemy of enemies) {
      if (particles.length < MAX_PARTICLES) burst(enemy.x, enemy.y, enemy.color || "#ffdf5a", enemy.type === "overlord" ? 28 : 12, enemy.type === "overlord" ? 10 : 6);
    }
    enemies = [];
    projectiles = [];
    enemyBullets = [];
    slashes = [];
    puddles = [];
    shockwaves.push({ x: player.x, y: player.y, r: 90, life: 1.0, max: 1.0, color: "#ffdf5a", power: 0 });
    shockwaves.push({ x: player.x, y: player.y, r: 180, life: 1.15, max: 1.15, color: "#58f3e4", power: 0 });
    camera.shake = Math.max(camera.shake, 14);
  }

  function beginClear(reason = "survive") {
    if (state === "clearing" || state === "ending" || state === "gameover") return;
    state = "clearing";
    clearReason = reason;
    clearMaxDelay = CLEAR_TRANSITION_TIME;
    clearDelay = clearMaxDelay;
    purgeEnemiesForEnding();
    clearEndingFallbackTimer();
    clearFallbackTimer = setTimeout(() => {
      if (state !== "clearing") return;
      try {
        showEndingForClear(clearReason);
      } catch (error) {
        forceEndingScreen(clearReason);
      }
    }, (clearMaxDelay + 0.55) * 1000);
    try {
      showToast({ sprite: 0 }, reason === "boss" ? "終焉の黒角王を討ち取った！" : "夜明けが訪れた！");
    } catch (error) {
      // Toasts are cosmetic; the clear timer above is the important part.
    }
    try {
      if (audio) audio.sfx("fury");
    } catch (error) {
      // Clear flow must continue even if a browser refuses an audio operation.
    }
  }

  function showEndingResult() {
    showResultScreen(lastResult || makeResult(true, clearReason, 0));
  }

  function getGearLevelTotal() {
    let total = 0;
    for (const level of acquiredItems.values()) total += level;
    total += evolvedItems.size * ITEM_MAX_LEVEL * 2;
    return total;
  }

  function getEnemyHpMultiplier(type, level = player.level, gearLevel = getGearLevelTotal()) {
    const levelOver = Math.max(0, level - 20);
    const levelMul = 1 + Math.min(1.55, levelOver * 0.03);
    const gearOver = Math.max(0, gearLevel - 12);
    const gearMul = 1 + Math.min(0.62, gearOver * 0.008);
    const bossMul = type === "oniElite" ? (elapsed > 420 ? 0.72 : 0.84) : 1;
    return type === "overlord" ? levelMul * gearMul * 4.2 : levelMul * gearMul * bossMul;
  }

  function reinforceEnemiesForScaling() {
    for (const enemy of enemies) {
      const nextMul = getEnemyHpMultiplier(enemy.type);
      const prevMul = enemy.levelHpMul || getEnemyHpMultiplier(enemy.type, player.level - 1);
      if (nextMul <= prevMul) continue;
      const gain = nextMul / prevMul;
      enemy.maxHp *= gain;
      enemy.hp *= gain;
      enemy.levelHpMul = nextMul;
    }
  }

  function countEnemiesByType(type) {
    let count = 0;
    for (const enemy of enemies) if (enemy.type === type) count++;
    return count;
  }

  function grantTestLoadout() {
    const loadout = [
      ["katana", 5],
      ["taiko", 4],
      ["shuriken", 4],
      ["sakura", 4],
      ["beads", 3],
      ["magatama", 4],
      ["gourd", 4],
      ["bell", 3],
      ["mirror", 4],
      ["pepper", 4]
    ];
    for (const [id, targetLevel] of loadout) {
      const def = findItemDef(id);
      if (!def) continue;
      const max = Math.min(itemMaxLevel(def), targetLevel);
      for (let level = 1; level <= max; level++) {
        acquiredItems.set(def.id, level);
        def.apply(level);
      }
    }
    player.hp = player.maxHp;
    reinforceEnemiesForScaling();
    renderItemDock();
  }

  function spawnTestOverlord() {
    enemies = [];
    projectiles = [];
    enemyBullets = [];
    gems = [];
    pickups = [];
    slashes = [];
    puddles = [];
    shockwaves = [];
    particles = [];
    texts = [];
    elapsed = OVERLORD_START_TIME + 12;
    score = 0;
    kills = 0;
    bossTimer = 9999;
    spawnTimer = 9999;
    fieldPickupTimer = 9999;
    thiefTimer = 9999;
    overlordSpawned = true;
    grantTestLoadout();
    player.hp = player.maxHp;
    player.damage = Math.max(player.damage, 72);
    player.fireRate = Math.max(0.42, player.fireRate);
    player.slashPower = Math.max(player.slashPower, 2.2);
    player.projectileCount = Math.max(player.projectileCount, 3);
    player.might = Math.max(player.might, 1.8);
    player.projectileSpeed = Math.max(player.projectileSpeed, 1.25);
    player.fury = 0;
    player.furyTick = 0;
    player.furyPulse = 0;
    furyCutin = null;
    enemies.push({
      type: "overlord",
      x: player.x + 360,
      y: player.y + 40,
      vx: 0,
      vy: 0,
      hp: 8800,
      maxHp: 8800,
      levelHpMul: 1,
      speed: 46,
      r: 76,
      value: 48,
      color: "#ff2438",
      sprite: "boss",
      spriteKey: "overlord",
      hit: 0,
      dashCd: 1.8,
      shootCd: 2.2,
      slow: 0,
      phase: rand(0, TAU)
    });
    showEnemyIntro("overlord");
    updateHud();
  }

  function getOverlordTargetCount() {
    if (elapsed < OVERLORD_START_TIME || overlordSpawned) return 0;
    return 1;
  }

  function shouldForceOverlord(roll) {
    if (elapsed < OVERLORD_START_TIME) return false;
    if (overlordSpawned) return false;
    if (countEnemiesByType("overlord") >= getOverlordTargetCount()) return false;
    const pressure = clamp((elapsed - OVERLORD_START_TIME) / 180, 0, 1);
    return roll > 0.86 - pressure * 0.12;
  }

  function spawnSenryoThief() {
    if (enemies.length >= MAX_ENEMIES || countEnemiesByType("senryoThief") > 0) return false;
    const spawn = spawnVisiblePointAroundPlayer();
    if (spawn.y < SKY_LINE_Y) spawn.y = SKY_LINE_Y + rand(70, 230);
    const hp = 128 + player.level * 7 + elapsed * 0.32;
    enemies.push({
      type: "senryoThief",
      x: spawn.x,
      y: spawn.y,
      vx: rand(-120, 120),
      vy: rand(-120, 120),
      hp,
      maxHp: hp,
      levelHpMul: 1,
      speed: 172 + clamp(elapsed / 600, 0, 1) * 34,
      r: 23,
      value: 8,
      color: "#ffcf4b",
      sprite: "ashigaru",
      spriteKey: "senryoThief",
      hit: 0,
      dashCd: rand(0.28, 0.72),
      shootCd: 0,
      slow: 0,
      phase: rand(0, TAU),
      visibleLife: 7.5,
      escapeLife: 23 + rand(0, 4),
      sparkleCd: 0,
      thiefWorth: Math.round(22 + player.level * 1.4 + Math.min(42, elapsed / 22))
    });
    showEnemyIntro("senryoThief");
    showToast({ sprite: 11 }, "千両泥棒が現れた！");
    if (audio) audio.sfx("select");
    return true;
  }

  function spawnVisiblePointAroundPlayer() {
    for (let tries = 0; tries < 24; tries++) {
      const angle = rand(0, TAU);
      const range = rand(210, Math.min(430, Math.max(W, H) * 0.42));
      const point = keepPointInMap(player.x + Math.cos(angle) * range, player.y + Math.sin(angle) * range, 80);
      if (point.y < SKY_LINE_Y) continue;
      if (pointInPolygon(point, WALKABLE_POLYGON)) return point;
    }
    return keepPointInMap(player.x + rand(-260, 260), player.y + rand(-190, 190), 80);
  }

  function spawnEnemy(initial = false) {
    if (enemies.length >= MAX_ENEMIES) return;
    const spawn = spawnPointAroundPlayer(initial);
    const boss = !initial && bossTimer <= 0;
    if (boss) bossTimer = elapsed >= OVERLORD_START_TIME
      ? Math.max(18, 42 - (elapsed - OVERLORD_START_TIME) * 0.055)
      : Math.max(34, 68 - elapsed * 0.055);
    const roll = Math.random();
    let type = "wraith";
    if (boss) type = elapsed >= OVERLORD_START_TIME && countEnemiesByType("overlord") < getOverlordTargetCount() ? "overlord" : elapsed > 420 ? "oniElite" : "boss";
    else if (shouldForceOverlord(roll)) type = "overlord";
    else if (elapsed >= ENDGAME_TIME) type = roll > 0.76 ? "oniElite" : roll > 0.5 ? "armored" : roll > 0.24 ? "shinobi" : "tengu";
    else if (elapsed > 420) type = roll > 0.82 ? "oniElite" : roll > 0.56 ? "armored" : roll > 0.32 ? "shinobi" : "tengu";
    else if (elapsed > 300) type = roll > 0.7 ? "armored" : roll > 0.42 ? "shinobi" : roll > 0.16 ? "tengu" : "ashigaru";
    else if (elapsed > 180) type = roll > 0.62 ? "shinobi" : roll > 0.32 ? "tengu" : "ashigaru";
    else if (elapsed > 90) type = roll > 0.68 ? "tengu" : roll > 0.36 ? "ashigaru" : "wraith";
    else type = roll > 0.72 ? "ashigaru" : "wraith";
    if (spawn.y < SKY_LINE_Y) {
      if (boss) spawn.y = SKY_LINE_Y + rand(90, 260);
      else type = elapsed > 90 && roll > 0.42 ? "tengu" : "wraith";
    }
    const specs = {
      wraith: { hp: 14 + elapsed * 0.16, speed: 62 + elapsed * 0.075, r: 17, value: 0.9, color: "#d82d61", sprite: "wraith", spriteKey: "wraith" },
      ashigaru: { hp: 36 + elapsed * 0.28, speed: 46 + elapsed * 0.055, r: 23, value: 2, color: "#d7a13e", sprite: "ashigaru", spriteKey: "ashigaru" },
      tengu: { hp: 24 + elapsed * 0.22, speed: 78 + elapsed * 0.09, r: 17, value: 1.7, color: "#46d8d2", sprite: "tengu", spriteKey: "tengu" },
      shinobi: { hp: 28 + elapsed * 0.24, speed: 106 + elapsed * 0.1, r: 16, value: 2.2, color: "#c68cff", sprite: "tengu", spriteKey: "shinobi" },
      armored: { hp: 145 + elapsed * 0.88, speed: 42 + elapsed * 0.045, r: 29, value: 6.5, color: "#f1b84b", sprite: "ashigaru", spriteKey: "armored" },
      oniElite: { hp: 410 + elapsed * 1.65, speed: 52 + elapsed * 0.035, r: 39, value: 15, color: "#ff4b38", sprite: "boss", spriteKey: "oniElite" },
      boss: { hp: 460 + elapsed * 2.85, speed: 36 + elapsed * 0.022, r: 50, value: 26, color: "#2f9bff", sprite: "boss", spriteKey: "boss" },
      overlord: { hp: 40000 + elapsed * 80, speed: 58, r: 76, value: 48, color: "#ff2438", sprite: "boss", spriteKey: "overlord" }
    };
    const s = specs[type];
    if (type === "overlord") overlordSpawned = true;
    const hpMul = getEnemyHpMultiplier(type);
    const hp = s.hp * hpMul;
    const openingSpeedMul = clamp(0.6 + elapsed / 300 * 0.4, 0.6, 1);
    if (!initial) showEnemyIntro(type);
    enemies.push({
      type,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      hp,
      maxHp: hp,
      levelHpMul: hpMul,
      speed: s.speed * openingSpeedMul,
      r: s.r,
      value: s.value,
      color: s.color,
      sprite: s.sprite,
      spriteKey: s.spriteKey,
      hit: 0,
      dashCd: rand(0.6, 1.8),
      shootCd: rand(1.0, 2.2),
      slow: 0,
      phase: rand(0, TAU)
    });
  }

  function shootDenkichiLaser() {
    const count = Math.max(1, player.projectileCount);
    const baseDir = player.dir;
    player.poseTimer = 0.22;
    player.beamPoseTimer = 0.24;
    player.beamPoseDir = baseDir;
    for (let i = 0; i < count; i++) {
      const spread = (i - (count - 1) / 2) * 0.08;
      const angle = baseDir + spread;
      const speed = 1080 * player.projectileSpeed;
      const crit = chance(player.crit);
      if (projectiles.length >= MAX_PROJECTILES) projectiles.shift();
      projectiles.push({
        x: player.x + Math.cos(angle) * player.r * 1.18,
        y: player.y + Math.sin(angle) * player.r * 1.18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: (crit ? 18 : 15) * Math.min(player.area, 1.42),
        life: 0.74 * player.duration,
        damage: scaledDamage(player.damage * (crit ? 2.05 : 1.48)),
        color: crit ? "#fff1a8" : "#9be8ff",
        pierce: 3 + player.extraPierce + (crit ? 1 : 0),
        kind: "laser"
      });
    }
    if (audio) audio.sfx("slash");
  }

  function shoot() {
    if (player.character === "denkichi") {
      shootDenkichiLaser();
      return;
    }
    const count = Math.max(1, player.projectileCount);
    for (let i = 0; i < count; i++) {
      const base = player.dir;
      const spread = (i - (count - 1) / 2) * 0.11;
      const angle = base + spread;
      const speed = 760 * player.projectileSpeed;
      const crit = chance(player.crit);
      if (projectiles.length >= MAX_PROJECTILES) projectiles.shift();
      projectiles.push({
        x: player.x + Math.cos(angle) * player.r * 1.12,
        y: player.y + Math.sin(angle) * player.r * 1.12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: (crit ? 13 : 11) * Math.min(player.area, 1.55),
        life: 0.92 * player.duration,
        damage: scaledDamage(player.damage * (crit ? 1.8 : 1)),
        color: crit ? "#ffdf5a" : "#5fe8e2",
        pierce: (crit ? 1 : 0) + player.extraPierce
      });
    }
    if (chance(0.3) && audio) audio.sfx("slash");
  }

  function nearestEnemies(count, range) {
    const limit = range * range;
    const found = [];
    for (const enemy of enemies) {
      const dd = d2(player, enemy);
      if (dd > limit) continue;
      if (found.length < count) {
        found.push({ enemy, dd });
        continue;
      }
      let worst = 0;
      for (let i = 1; i < found.length; i++) if (found[i].dd > found[worst].dd) worst = i;
      if (dd < found[worst].dd) found[worst] = { enemy, dd };
    }
    return found.sort((a, b) => a.dd - b.dd).map(item => item.enemy);
  }

  function doSlash() {
    const target = nearestEnemies(1, 820)[0];
    const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : player.dir;
    const radius = (58 + player.slashPower * 22) * player.area;
    player.poseTimer = 0.24;
    slashes.push({ x: player.x, y: player.y, angle, life: 0.18, max: 0.18, r: radius });
    for (const enemy of enemies) {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const dd = dx * dx + dy * dy;
      if (dd > sqr(radius + enemy.r)) continue;
      const da = Math.atan2(Math.sin(Math.atan2(dy, dx) - angle), Math.cos(Math.atan2(dy, dx) - angle));
      if (Math.abs(da) < 0.62 + player.slashPower * 0.04) {
        damageEnemy(enemy, scaledDamage(player.damage * (1.34 + player.slashPower * 0.18)), angle);
      }
    }
    camera.shake = Math.max(camera.shake, 1.6);
  }

  function doDrum() {
    if (!player.drum) return;
    const radius = (138 + player.drum * 32) * player.area;
    const damage = scaledDamage(player.damage * (0.95 + player.drum * 0.22));
    shockwaves.push({ x: player.x, y: player.y, r: 32, life: 0.44, max: 0.44, color: "#ffb93f", power: 0 });
    for (const enemy of enemies) {
      if (d2(player, enemy) < sqr(radius + enemy.r)) damageEnemy(enemy, damage, Math.atan2(enemy.y - player.y, enemy.x - player.x));
    }
    camera.shake = Math.max(camera.shake, 3.2);
  }

  function doShuriken() {
    if (!player.shuriken) return;
    const count = 2 + player.shuriken;
    for (let i = 0; i < count; i++) {
      const angle = i * TAU / count + elapsed * 0.5;
      if (projectiles.length >= MAX_PROJECTILES) projectiles.shift();
      projectiles.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 640 * player.projectileSpeed,
        vy: Math.sin(angle) * 640 * player.projectileSpeed,
        r: 7,
        life: 0.75 * player.duration,
        damage: scaledDamage(player.damage * (0.72 + player.shuriken * 0.08)),
        color: "#d8c8ff",
        pierce: 1 + player.extraPierce
      });
    }
  }

  function doCranes() {
    const count = 1 + player.cranes;
    const targets = nearestEnemies(count, 980);
    for (let i = 0; i < count; i++) {
      const target = targets[i % Math.max(1, targets.length)];
      const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : rand(0, TAU);
      if (projectiles.length >= MAX_PROJECTILES) projectiles.shift();
      projectiles.push({
        x: player.x + Math.cos(angle) * 18,
        y: player.y + Math.sin(angle) * 18,
        vx: Math.cos(angle) * 360 * player.projectileSpeed,
        vy: Math.sin(angle) * 360 * player.projectileSpeed,
        r: 10,
        life: 1.4 * player.duration,
        damage: scaledDamage(player.damage * (0.78 + player.cranes * 0.12)),
        color: "#ffd5ef",
        pierce: player.extraPierce,
        homing: true,
        kind: "crane"
      });
    }
  }

  function doFireArrows() {
    const count = 3 + player.arrows * 2;
    const targets = nearestEnemies(count, 980);
    for (let i = 0; i < count; i++) {
      const target = targets[i % Math.max(1, targets.length)];
      const tx = target ? target.x : player.x + rand(-360, 360);
      const ty = target ? target.y : player.y + rand(-260, 260);
      if (projectiles.length >= MAX_PROJECTILES) projectiles.shift();
      projectiles.push({
        x: tx + rand(-160, 160),
        y: ty - rand(360, 520),
        vx: rand(-40, 40),
        vy: (520 + player.arrows * 28) * player.projectileSpeed,
        r: 9,
        life: 1.25 * player.duration,
        damage: scaledDamage(player.damage * (0.9 + player.arrows * 0.18)),
        color: "#ff7438",
        pierce: 0,
        area: (44 + player.arrows * 8) * player.area,
        kind: "arrow"
      });
    }
  }

  function doOrbitDamage(dt) {
    const count = getOrbitOrbCount();
    if (!count) return;
    syncOrbitOrbs(count);
    const orbitRadius = getOrbitRadius();
    const speed = 1.7 + player.sutra * 0.12;
    const orbDamage = scaledDamage(player.damage * (0.28 + player.orbit * 0.035 + player.sutra * 0.055));
    const orbHits = getOrbitOrbHits();
    const reviveDelay = Math.max(1.8, 4.2 - (player.orbit + player.sutra) * 0.18);
    for (let i = 0; i < player.orbitOrbs.length; i++) {
      const orb = player.orbitOrbs[i];
      orb.cooldown = Math.max(0, orb.cooldown - dt);
      if (!orb.active) {
        orb.respawn -= dt;
        if (orb.respawn <= 0) {
          orb.active = true;
          orb.hits = orbHits;
          orb.cooldown = 0.08;
        }
        continue;
      }
      if (orb.cooldown > 0) continue;
      const a = elapsed * speed + i * TAU / player.orbitOrbs.length;
      const ox = player.x + Math.cos(a) * orbitRadius;
      const oy = player.y + Math.sin(a) * orbitRadius;
      const orbRadius = 8 + player.sutra * 1.2;
      for (const enemy of enemies) {
        const dx = enemy.x - ox;
        const dy = enemy.y - oy;
        if (dx * dx + dy * dy > sqr(enemy.r + orbRadius)) continue;
        damageEnemy(enemy, orbDamage, Math.atan2(enemy.y - player.y, enemy.x - player.x));
        orb.hits -= 1;
        orb.cooldown = 0.18;
        if (orb.hits <= 0) {
          orb.active = false;
          orb.respawn = reviveDelay;
          burst(ox, oy, orb.kind === "sutra" ? "#f3d0ff" : "#ffe8a8", 8, 4);
        }
        break;
      }
    }
  }

  function getOrbitOrbCount() {
    return Math.min(12, player.orbit + player.sutra);
  }

  function getOrbitRadius() {
    return (46 + player.orbit * 8 + player.sutra * 10) * Math.min(player.area, 1.45);
  }

  function getOrbitOrbHits() {
    return 3 + Math.floor((player.orbit + player.sutra) / 3);
  }

  function syncOrbitOrbs(count) {
    while (player.orbitOrbs.length < count) {
      const index = player.orbitOrbs.length;
      player.orbitOrbs.push({
        active: true,
        hits: getOrbitOrbHits(),
        respawn: 0,
        cooldown: 0,
        kind: index < player.orbit ? "beads" : "sutra"
      });
    }
    if (player.orbitOrbs.length > count) player.orbitOrbs.length = count;
    for (let i = 0; i < player.orbitOrbs.length; i++) {
      player.orbitOrbs[i].kind = i < player.orbit ? "beads" : "sutra";
      if (player.orbitOrbs[i].hits <= 0 && player.orbitOrbs[i].active) player.orbitOrbs[i].hits = getOrbitOrbHits();
    }
  }

  function doAuraDamage(dt) {
    const count = getAuraOrbCount();
    if (!count) return;
    syncAuraOrbs(count);
    const radius = getAuraRadius();
    const speed = 1.35 + player.aura * 0.05;
    const hitDamage = scaledDamage(player.damage * (0.34 + player.aura * 0.035));
    const energy = getAuraOrbEnergy();
    const reviveDelay = Math.max(2.4, 5.0 - player.aura * 0.22);
    for (let i = 0; i < player.auraOrbs.length; i++) {
      const orb = player.auraOrbs[i];
      orb.cooldown = Math.max(0, orb.cooldown - dt);
      if (!orb.active) {
        orb.respawn -= dt;
        if (orb.respawn <= 0) {
          orb.active = true;
          orb.energy = energy;
          orb.cooldown = 0.08;
          burst(player.x, player.y, "#58f3e4", 6, 3);
        }
        continue;
      }
      if (orb.cooldown > 0) continue;
      const a = -elapsed * speed + i * TAU / player.auraOrbs.length;
      const ox = player.x + Math.cos(a) * radius;
      const oy = player.y + Math.sin(a) * radius;
      const orbRadius = 12 + player.aura * 1.2;
      for (const enemy of enemies) {
        const dx = enemy.x - ox;
        const dy = enemy.y - oy;
        if (dx * dx + dy * dy > sqr(enemy.r + orbRadius)) continue;
        damageEnemy(enemy, hitDamage, Math.atan2(enemy.y - player.y, enemy.x - player.x));
        orb.energy -= hitDamage;
        orb.cooldown = 0.16;
        if (orb.energy <= 0) {
          orb.active = false;
          orb.respawn = reviveDelay;
          burst(ox, oy, "#58f3e4", 10, 5);
        }
        break;
      }
    }
  }

  function getAuraOrbCount() {
    return Math.min(8, player.aura);
  }

  function getAuraRadius() {
    return (42 + player.aura * 10) * Math.min(player.area, 1.35);
  }

  function getAuraOrbEnergy() {
    return scaledDamage(player.damage * (1.25 + player.aura * 0.22));
  }

  function syncAuraOrbs(count) {
    while (player.auraOrbs.length < count) {
      player.auraOrbs.push({
        active: true,
        energy: getAuraOrbEnergy(),
        respawn: 0,
        cooldown: 0
      });
    }
    if (player.auraOrbs.length > count) player.auraOrbs.length = count;
    for (const orb of player.auraOrbs) {
      if (orb.active && orb.energy <= 0) orb.energy = getAuraOrbEnergy();
    }
  }

  function doSmokeBomb() {
    const radius = 120 + player.smoke * 28;
    shockwaves.push({ x: player.x, y: player.y, r: 20, life: 0.46, max: 0.46, color: "#b8b8c8", power: 0 });
    burst(player.x, player.y, "#b8b8c8", 22, 7);
    for (const enemy of enemies) {
      if (d2(player, enemy) < sqr(radius + enemy.r)) {
        enemy.slow = Math.max(enemy.slow, 1.2 + player.smoke * 0.18);
        damageEnemy(enemy, scaledDamage(player.damage * (0.18 + player.smoke * 0.03)), Math.atan2(enemy.y - player.y, enemy.x - player.x));
      }
    }
  }

  function doTigerBanner() {
    const angle = player.dir;
    const reach = 170 + player.banner * 26;
    const width = 0.55 + player.banner * 0.04;
    slashes.push({ x: player.x, y: player.y, angle, life: 0.22, max: 0.22, r: reach });
    for (const enemy of enemies) {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const dd = dx * dx + dy * dy;
      if (dd > sqr(reach + enemy.r)) continue;
      const da = Math.atan2(Math.sin(Math.atan2(dy, dx) - angle), Math.cos(Math.atan2(dy, dx) - angle));
      if (Math.abs(da) < width) damageEnemy(enemy, scaledDamage(player.damage * (0.95 + player.banner * 0.16)), angle);
    }
    camera.shake = Math.max(camera.shake, 2.5);
  }

  function doMoonSickle() {
    const count = 1 + Math.floor(player.sickle / 2);
    for (let i = 0; i < count; i++) {
      const angle = player.dir + (i - (count - 1) / 2) * 0.65;
      if (projectiles.length >= MAX_PROJECTILES) projectiles.shift();
      projectiles.push({
        x: player.x + Math.cos(angle) * 32,
        y: player.y + Math.sin(angle) * 32,
        vx: Math.cos(angle) * 330 * player.projectileSpeed,
        vy: Math.sin(angle) * 330 * player.projectileSpeed,
        r: 18 + player.sickle * 2,
        life: 1.1 * player.duration,
        damage: scaledDamage(player.damage * (0.72 + player.sickle * 0.12)),
        color: "#d8d0ff",
        pierce: 2 + player.extraPierce,
        kind: "sickle"
      });
    }
  }

  function doPurifyingSake() {
    const count = 1 + Math.floor(player.sake / 2);
    const targets = nearestEnemies(count, 760);
    for (let i = 0; i < count; i++) {
      const target = targets[i];
      const x = target ? target.x + rand(-28, 28) : player.x + rand(-220, 220);
      const y = target ? target.y + rand(-28, 28) : player.y + rand(-220, 220);
      puddles.push({
        x,
        y,
        r: (34 + player.sake * 5) * Math.min(player.area, 1.38),
        life: 3.2 + player.sake * 0.22,
        max: 3.2 + player.sake * 0.22,
        tick: 0,
        damage: scaledDamage(player.damage * (0.28 + player.sake * 0.045)),
        color: "#6fc8ff"
      });
      shockwaves.push({ x, y, r: 16, life: 0.34, max: 0.34, color: "#6fc8ff", power: 0 });
    }
  }

  function activateFury() {
    player.fury = Math.max(player.fury, 8.5);
    player.furyTick = 0;
    player.furyPulse = 0;
    player.poseTimer = 0.36;
    furyCutin = { life: 1.55, max: 1.55, character: player.character };
    camera.shake = Math.max(camera.shake, 17);
    showToast({ sprite: 0 }, "猫神奥義札: 操作方向へ奥義乱舞");
    burst(player.x, player.y, "#ffdf5a", 86, 16);
    shockwaves.push({ x: player.x, y: player.y, r: 58, life: 0.82, max: 0.82, color: "#ffdf5a", power: 0 });
    if (audio) audio.sfx("fury");
    playCatVoice("meow", 0.72, true);
  }

  function doFuryStorm(dt) {
    player.furyTick -= dt;
    if (player.furyTick > 0) return;
    player.furyTick = 0.15;
    player.furyPulse += 1;

    const angle = player.dir;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const reach = 720 * Math.min(player.area, 1.42);
    const width = 74 * Math.min(player.area, 1.35);
    const damage = scaledDamage(player.damage * (1.9 + player.level * 0.028));
    const color = player.furyPulse % 2 ? "#ffdf5a" : "#ff304f";

    for (let i = 0; i < 3; i++) {
      const dist = 110 + i * 170;
      const sway = Math.sin(elapsed * 15 + i) * width * 0.32;
      slashes.push({
        x: player.x + ca * dist - sa * sway,
        y: player.y + sa * dist + ca * sway,
        angle,
        life: 0.24,
        max: 0.24,
        r: 105 + i * 32,
        color,
        edgeColor: i % 2 ? "#58f3e4" : "#ff304f"
      });
    }

    let hitCount = 0;
    for (const enemy of enemies) {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const forward = dx * ca + dy * sa;
      if (forward < -enemy.r || forward > reach + enemy.r) continue;
      const side = Math.abs(-dx * sa + dy * ca);
      const bladeWidth = width + forward * 0.085 + enemy.r;
      if (side > bladeWidth) continue;
      damageEnemy(enemy, damage, angle);
      hitCount++;
    }

    const tipX = player.x + ca * Math.min(reach, 540);
    const tipY = player.y + sa * Math.min(reach, 540);
    if (player.furyPulse % 3 === 0) {
      areaDamage(tipX, tipY, 150 * Math.min(player.area, 1.35), scaledDamage(player.damage * 1.45), "#ffdf5a");
      shockwaves.push({ x: tipX, y: tipY, r: 42, life: 0.42, max: 0.42, color: "#ffdf5a", power: 0 });
    }
    if (player.furyPulse % 2 === 0) {
      burst(player.x + ca * rand(120, 520), player.y + sa * rand(120, 520), color, Math.min(28, 12 + hitCount), 10);
      if (audio) audio.sfx("slash");
    }
    player.poseTimer = Math.max(player.poseTimer, 0.18);
    camera.shake = Math.max(camera.shake, hitCount ? 7 : 3.5);
  }

  function damageEnemy(enemy, amount, angle = 0) {
    enemy.hp -= amount;
    const unstoppable = enemy.type === "overlord" && chance(0.68);
    enemy.hit = unstoppable ? 0.045 : 0.11;
    const heavy = enemy.type === "armored" || enemy.type === "oniElite" || enemy.type === "boss" || enemy.type === "overlord";
    const knock = enemy.type === "overlord" ? (unstoppable ? 2 : 10) : heavy ? 24 : 62;
    enemy.vx += Math.cos(angle) * knock;
    enemy.vy += Math.sin(angle) * knock;
    if (texts.length < MAX_FLOAT_TEXTS && amount > 3) {
      texts.push({ x: enemy.x, y: enemy.y - enemy.r, vy: -36, life: 0.42, max: 0.42, text: Math.round(amount), color: "#fff0a3" });
    }
    if (chance(0.38)) burst(enemy.x, enemy.y, enemy.color, 3, 3);
    if (enemy.hp <= 0) killEnemy(enemy);
  }

  function killEnemy(enemy) {
    const idx = enemies.indexOf(enemy);
    if (idx >= 0) enemies.splice(idx, 1);
    kills++;
    const value = Math.round(enemy.value * 10 * (1 + player.coinBonus));
    score += value;
    const boss = enemy.type === "boss";
    const strongEnemy = enemy.type === "armored" || enemy.type === "oniElite" || enemy.type === "boss" || enemy.type === "overlord";
    const chestEnemy = enemy.type === "armored" || enemy.type === "oniElite" || enemy.type === "boss" || enemy.type === "overlord";
    if (strongEnemy) camera.shake = Math.max(camera.shake, enemy.type === "overlord" ? 12 : boss ? 10 : 4);
    if (audio && killSfxTimer <= 0) {
      try {
        audio.sfx("kill");
      } catch (error) {
        audio = null;
      }
      killSfxTimer = 0.045;
    }
    spawnKillEffect(enemy, boss, strongEnemy);
    const gemCount = boss ? 15 : Math.ceil(enemy.value + 1);
    for (let i = 0; i < gemCount && gems.length < MAX_GEMS; i++) {
      gems.push({
        x: enemy.x + rand(-16, 16),
        y: enemy.y + rand(-16, 16),
        vx: rand(-85, 85),
        vy: rand(-85, 85),
        r: 7,
        value: (boss ? 5 : enemy.value * 1.18) * player.xpGain,
        color: enemy.value > 1 ? "#ffdf5a" : "#65f0df"
      });
    }
    if (enemy.type === "senryoThief") {
      const reward = Math.max(12, enemy.thiefWorth || 24);
      metaSave.money += reward;
      metaSave.stats.totalEarned = (Number(metaSave.stats.totalEarned) || 0) + reward;
      saveMeta();
      updateTitleMoney();
      texts.push({ x: enemy.x, y: enemy.y - enemy.r - 18, vy: -42, life: 1.0, max: 1.0, text: `+${reward}両`, color: "#ffe37a" });
      showToast({ sprite: 11 }, `千両泥棒を捕縛！ +${reward}両`);
      if (audio) audio.sfx("chest");
      return;
    }
    if (enemy.type === "overlord") {
      beginClear("boss");
      return;
    }
    const dropMul = getLateDropMultiplier();
    const chestChance = getEnemyChestChance(enemy);
    if (chestEnemy && chance((chestChance + player.luck * 0.045) * dropMul)) {
      spawnPickup(enemy.x, enemy.y, "chest", { tier: rollChestTier(enemy.type) });
      return;
    }
    const pickupChance = (0.01 + player.luck * 0.06) * dropMul;
    if (chance(pickupChance)) spawnPickup(enemy.x, enemy.y, randomPickupType());
  }

  function randomPickupType() {
    const roll = Math.random();
    if (roll > 0.95) return "fury";
    if (roll < 0.44) return "heal";
    if (roll < 0.78) return "magnet";
    return "bomb";
  }

  function getEnemyChestChance(enemy) {
    if (enemy.type === "overlord") return 0.42;
    if (enemy.type === "boss") return elapsed > 480 ? 0.24 : 0.42;
    if (enemy.type === "oniElite") return elapsed > 480 ? 0.18 : 0.34;
    if (enemy.type === "armored") return elapsed > 480 ? 0.08 : 0.14;
    return 0;
  }

  function getLateDropMultiplier() {
    if (elapsed >= ENDGAME_TIME) return 0.22;
    if (elapsed > 480) return 0.38;
    if (elapsed > 420) return 0.58;
    return 1;
  }

  function spawnFixedChests() {
    for (const spot of fixedChestSpots) {
      spawnPickup(spot.x, spot.y, "chest", { tier: spot.tier, fixed: true });
    }
  }

  function spawnTimedSupplyDrop() {
    const spot = fixedSupplySpots[supplyDropIndex % fixedSupplySpots.length];
    supplyDropIndex++;
    const chestPoint = keepPointInMap(spot.chest.x, spot.chest.y, 24);
    const onigiriPoint = keepPointInMap(spot.onigiri.x, spot.onigiri.y, 18);
    if (fieldChestCount() >= FIELD_CHEST_LIMIT) {
      const oldestChest = pickups.findIndex(pickup => pickup.type === "chest");
      if (oldestChest >= 0) pickups.splice(oldestChest, 1);
    }
    const chestSpawned = spawnPickup(chestPoint.x, chestPoint.y, "chest", { tier: spot.tier, fixed: true, source: "supply" });
    spawnPickup(onigiriPoint.x, onigiriPoint.y, "heal", { fixed: true, source: "field" });
    showToast({ sprite: 11 }, chestSpawned ? "補給の宝箱とおにぎりが届いた" : "補給のおにぎりが届いた");
  }

  function fieldChestCount() {
    return pickups.filter(pickup => pickup.type === "chest").length;
  }

  function rollChestTier(source = "field") {
    const luck = player.luck * 0.18;
    const roll = Math.random() + luck;
    if (source === "overlord") {
      if (roll > 0.76) return "gold";
      if (roll > 0.48) return "silver";
      if (roll > 0.18) return "red";
      return "wood";
    }
    if (source === "boss" || source === "oniElite") {
      if (roll > 0.92) return "gold";
      if (roll > 0.72) return "silver";
      if (roll > 0.34) return "red";
      return "wood";
    }
    if (source === "armored") {
      if (roll > 0.96) return "gold";
      if (roll > 0.82) return "silver";
      if (roll > 0.52) return "red";
      return "wood";
    }
    if (roll > 0.95) return "gold";
    if (roll > 0.84) return "silver";
    if (roll > 0.62) return "red";
    return "wood";
  }

  function spawnPickup(x, y, type, options = {}) {
    if (type === "chest" && fieldChestCount() >= FIELD_CHEST_LIMIT) return false;
    const tier = type === "chest" ? (options.tier || rollChestTier(options.source)) : null;
    const fieldOnigiri = type === "heal" && options.source === "field";
    pickups.push({ x, y, type, tier, r: type === "chest" || type === "fury" ? 18 : 14, pulse: rand(0, TAU), life: options.fixed || fieldOnigiri ? 9999 : type === "chest" ? 42 : type === "fury" ? 28 : 24, fixed: !!options.fixed });
    return true;
  }

  function spawnFieldPickup() {
    const fieldItems = pickups.filter(p => !p.fixed && p.type !== "chest").length;
    if (fieldItems > 5) return;
    const angle = rand(0, TAU);
    const range = rand(260, Math.max(W, H) * 0.62);
    const roll = Math.random() + player.luck * 0.035;
    const type = roll > 0.962 ? "fury" : roll > 0.84 ? "magnet" : "heal";
    const point = keepPointInMap(player.x + Math.cos(angle) * range, player.y + Math.sin(angle) * range, 24);
    spawnPickup(point.x, point.y, type, { source: "field" });
  }

  function keepPointInMap(x, y, radius = 0) {
    const point = {
      x: clamp(x, MAP_RECT.x + MAP.margin + radius, MAP_RECT.x + MAP.w - MAP.margin - radius),
      y: clamp(y, MAP_RECT.y + MAP.margin + radius, MAP_RECT.y + MAP.h - MAP.margin - radius)
    };
    return projectInsideWalkable(point, radius);
  }

  function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i];
      const b = polygon[j];
      if (((a.y > point.y) !== (b.y > point.y)) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) {
        inside = !inside;
      }
    }
    return inside;
  }

  function closestPointOnSegment(point, a, b) {
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const len = vx * vx + vy * vy || 1;
    const t = clamp(((point.x - a.x) * vx + (point.y - a.y) * vy) / len, 0, 1);
    return { x: a.x + vx * t, y: a.y + vy * t };
  }

  function closestPointOnPolygon(point, polygon) {
    let best = null;
    let bestDist = Infinity;
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const p = closestPointOnSegment(point, a, b);
      const dist = sqr(point.x - p.x) + sqr(point.y - p.y);
      if (dist < bestDist) {
        bestDist = dist;
        best = p;
      }
    }
    return { point: best, dist: Math.sqrt(bestDist) };
  }

  function projectInsideWalkable(point, radius = 0) {
    const nearest = closestPointOnPolygon(point, WALKABLE_POLYGON);
    const inside = pointInPolygon(point, WALKABLE_POLYGON);
    if (inside && nearest.dist >= radius) return point;
    const edge = nearest.point || point;
    const dx = WALKABLE_CENTER.x - edge.x;
    const dy = WALKABLE_CENTER.y - edge.y;
    const len = Math.hypot(dx, dy) || 1;
    const push = Math.max(radius + 3, inside ? radius - nearest.dist + 3 : radius + 3);
    return {
      x: edge.x + dx / len * push,
      y: edge.y + dy / len * push
    };
  }

  function isWalkablePoint(point, radius = 0) {
    if (!pointInPolygon(point, WALKABLE_POLYGON)) return false;
    return closestPointOnPolygon(point, WALKABLE_POLYGON).dist >= radius;
  }

  function resolveMapCollision(entity, radius) {
    const p = projectInsideWalkable(entity, radius);
    entity.x = p.x;
    entity.y = p.y;
  }

  function spawnPointAroundPlayer(initial) {
    for (let tries = 0; tries < 18; tries++) {
      const angle = rand(0, TAU);
      const range = initial ? rand(130, 430) : Math.max(W, H) * rand(0.46, 0.72);
      const point = keepPointInMap(player.x + Math.cos(angle) * range, player.y + Math.sin(angle) * range, 80);
      if (pointInPolygon(point, WALKABLE_POLYGON)) return point;
    }
    return keepPointInMap(player.x + rand(-520, 520), player.y + rand(-360, 360), 80);
  }

  function burst(x, y, color, count, power) {
    for (let i = 0; i < count; i++) {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      const a = rand(0, TAU);
      const s = rand(40, 58 * power);
      particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: rand(0.2, 0.52),
        max: 0.52,
        r: rand(2.4, power),
        color
      });
    }
  }

  function spawnKillEffect(enemy, boss, strongEnemy) {
    const color = enemy.color || "#ffdf5a";
    const visible = isInDrawRange(enemy, 360, getCameraZoom());
    if (!visible && !strongEnemy) return;
    const particleCount = boss ? 28 : strongEnemy ? 12 : 4;
    const power = boss ? 8 : strongEnemy ? 5 : 3.5;
    burst(enemy.x, enemy.y, color, particleCount, power);
    const canAddRing = shockwaves.length < 18 && (strongEnemy || killRingCooldown <= 0);
    if (!canAddRing) return;
    const life = boss ? 0.34 : strongEnemy ? 0.28 : 0.18;
    shockwaves.push({ x: enemy.x, y: enemy.y, r: enemy.r * (boss ? 1 : 0.75), life, max: life, color, power: 0 });
    if (!strongEnemy) killRingCooldown = 0.075;
  }

  function update(dt) {
    if (state === "clearing") {
      clearDelay -= dt;
      camera.shake = Math.max(0, camera.shake - dt * 68);
      updateList(particles, dt, item => {
        item.x += item.vx * dt;
        item.y += item.vy * dt;
        item.vx *= 0.94;
        item.vy *= 0.94;
      });
      updateList(shockwaves, dt);
      if (clearDelay <= 0) {
        try {
          showEndingForClear(clearReason);
        } catch (error) {
          state = "ending";
          pauseScreen?.classList.add("hidden");
          levelScreen?.classList.add("hidden");
          gameOverScreen?.classList.add("hidden");
          titleScreen?.classList.add("hidden");
          shopScreen?.classList.add("hidden");
          recordsScreen?.classList.add("hidden");
          encyclopediaScreen?.classList.add("hidden");
          endingScreen?.classList.remove("hidden");
        }
      }
      return;
    }
    if (state !== "playing") return;
    elapsed += dt;
    if (!testMode && elapsed >= ENDING_TIME) {
      beginClear("survive");
      return;
    }
    toastTimer -= dt;
    enemyIntroTimer -= dt;
    killSfxTimer = Math.max(0, killSfxTimer - dt);
    killRingCooldown = Math.max(0, killRingCooldown - dt);
    catVoiceTimer = Math.max(0, catVoiceTimer - dt);
    if (furyCutin) {
      furyCutin.life -= dt;
      if (furyCutin.life <= 0) furyCutin = null;
    }
    if (toastTimer <= 0) toast.classList.add("hidden");
    if (enemyIntroTimer <= 0) hideEnemyIntro();
    spawnTimer -= dt;
    bossTimer -= dt;
    fieldPickupTimer -= dt;
    thiefTimer -= dt;

    if (testMode) {
      movePlayer(dt);
      updateEnemies(dt);
      updateEnemyBullets(dt);
      updateCombat(dt);
      updatePuddles(dt);
      updateList(particles, dt, item => {
        item.x += item.vx * dt;
        item.y += item.vy * dt;
        item.vx *= 0.94;
        item.vy *= 0.94;
      });
      updateList(texts, dt, item => {
        item.y += item.vy * dt;
      });
      updateList(slashes, dt);
      updateList(shockwaves, dt);
      updateCamera(dt);
      updateHud();
      return;
    }

    if (spawnTimer <= 0) {
      const wave = 1 + Math.floor(elapsed / 26);
      const finale = elapsed >= ENDGAME_TIME;
      const ramp = clamp(elapsed / 430, 0, 1);
      const pressure = finale
        ? Math.min(24, 12 + Math.floor((elapsed - ENDGAME_TIME) / 9) + Math.floor(player.curse * 8))
        : Math.min(18, 3 + Math.floor(elapsed / 32) + Math.floor(ramp * 4) + Math.floor(player.curse * 5));
      const budget = Math.min(pressure, MAX_ENEMIES - enemies.length);
      for (let i = 0; i < budget; i++) spawnEnemy(false);
      spawnTimer = finale ? 0.3 : Math.max(0.42, 1.48 - wave * 0.03 - player.curse * 0.14);
    }

    if (fieldPickupTimer <= 0) {
      spawnFieldPickup();
      fieldPickupTimer = rand(24, 38);
    }

    while (elapsed >= nextSupplyDropAt && nextSupplyDropAt < ENDING_TIME) {
      spawnTimedSupplyDrop();
      nextSupplyDropAt += 60;
    }

    if (thiefTimer <= 0) {
      if (elapsed > 24 && chance(0.72)) spawnSenryoThief();
      thiefTimer = rand(72, 132);
    }

    movePlayer(dt);
    updateEnemies(dt);
    updateEnemyBullets(dt);
    updateCombat(dt);
    updatePuddles(dt);
    updateGems(dt);
    updatePickups(dt);
    compactDistantEnemies();

    updateList(particles, dt, item => {
      item.x += item.vx * dt;
      item.y += item.vy * dt;
      item.vx *= 0.94;
      item.vy *= 0.94;
    });
    updateList(texts, dt, item => {
      item.y += item.vy * dt;
    });
    updateList(slashes, dt);
    updateList(shockwaves, dt);

    updateCamera(dt);
    updateHud();
  }

  function updateCamera(dt) {
    const zoom = getCameraZoom();
    const halfW = W / (2 * zoom);
    const halfH = H / (2 * zoom);
    const camMinX = MAP_RECT.x + Math.min(halfW, MAP.w / 2);
    const camMaxX = MAP_RECT.x + MAP.w - Math.min(halfW, MAP.w / 2);
    const camMinY = MAP_RECT.y + Math.min(halfH, MAP.h / 2);
    const camMaxY = MAP_RECT.y + MAP.h - Math.min(halfH, MAP.h / 2);
    const targetX = clamp(player.x, camMinX, camMaxX);
    const targetY = clamp(player.y, camMinY, camMaxY);
    camera.x += (targetX - camera.x) * 0.1;
    camera.y += (targetY - camera.y) * 0.1;
    camera.shake = Math.max(0, camera.shake - dt * 68);
  }

  function movePlayer(dt) {
    let mx = 0;
    let my = 0;
    if (keys.has("KeyW") || keys.has("ArrowUp")) my -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) my += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) mx -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) mx += 1;
    mx += gamepadInput.mx;
    my += gamepadInput.my;
    if (pointer.active && pointer.mode === "stick") {
      mx += pointer.dx;
      my += pointer.dy;
    } else if (pointer.active) {
      const zoom = getCameraZoom();
      const playerScreenX = W / 2 + (player.x - camera.x) * zoom;
      const playerScreenY = H / 2 + (player.y - camera.y) * zoom;
      const dx = pointer.x - playerScreenX;
      const dy = pointer.y - playerScreenY;
      const len = Math.hypot(dx, dy);
      if (len > 24) {
        mx += dx / len;
        my += dy / len;
      }
    }
    const len = Math.hypot(mx, my) || 1;
    if (mx || my) player.dir = Math.atan2(my, mx);
    const stepX = (mx / len) * player.speed * dt;
    const stepY = (my / len) * player.speed * dt;
    const radius = player.r * 0.9;
    const tryX = { x: player.x + stepX, y: player.y };
    const tryY = { x: player.x, y: player.y + stepY };
    const tryBoth = { x: player.x + stepX, y: player.y + stepY };
    if (isWalkablePoint(tryBoth, radius)) {
      player.x = tryBoth.x;
      player.y = tryBoth.y;
    } else {
      if (isWalkablePoint(tryX, radius)) player.x = tryX.x;
      if (isWalkablePoint(tryY, radius)) player.y = tryY.y;
    }
    if (!isWalkablePoint(player, radius)) resolveMapCollision(player, radius);
    player.invuln = Math.max(0, player.invuln - dt);
    player.poseTimer = Math.max(0, player.poseTimer - dt);
    player.beamPoseTimer = Math.max(0, player.beamPoseTimer - dt);
    if (player.regen > 0) {
      player.regenCarry += player.regen * dt;
      if (player.regenCarry >= 1) {
        const heal = Math.floor(player.regenCarry);
        player.regenCarry -= heal;
        player.hp = Math.min(player.maxHp, player.hp + heal);
      }
    }
  }

  function updateCombat(dt) {
    player.shotTimer -= dt;
    player.slashTimer -= dt;
    player.drumTimer -= dt;
    player.shurikenTimer -= dt;
    player.craneTimer -= dt;
    player.arrowTimer -= dt;
    player.smokeTimer -= dt;
    player.bannerTimer -= dt;
    player.sickleTimer -= dt;
    player.sakeTimer -= dt;
    if (player.fury > 0) {
      player.fury = Math.max(0, player.fury - dt);
      doFuryStorm(dt);
    }
    if (player.shotTimer <= 0) {
      shoot();
      player.shotTimer = cooldownTime(player.fireRate, 0.36);
    }
    if (player.slashTimer <= 0) {
      doSlash();
      player.slashTimer = cooldownTime(1.08 - player.level * 0.012 - player.slashPower * 0.02, 0.38);
    }
    if (player.drum && player.drumTimer <= 0) {
      doDrum();
      player.drumTimer = cooldownTime(3.1 - player.drum * 0.24, 1.05);
    }
    if (player.shuriken && player.shurikenTimer <= 0) {
      doShuriken();
      player.shurikenTimer = cooldownTime(2.25 - player.shuriken * 0.18, 0.72);
    }
    if (player.cranes && player.craneTimer <= 0) {
      doCranes();
      player.craneTimer = cooldownTime(2.25 - player.cranes * 0.16, 0.62);
    }
    if (player.arrows && player.arrowTimer <= 0) {
      doFireArrows();
      player.arrowTimer = cooldownTime(1.7 - player.arrows * 0.12, 0.54);
    }
    if (player.orbit || player.sutra) {
      doOrbitDamage(dt);
    }
    if (player.smoke && player.smokeTimer <= 0) {
      doSmokeBomb();
      player.smokeTimer = cooldownTime(4.2 - player.smoke * 0.34, 1.35);
    }
    if (player.banner && player.bannerTimer <= 0) {
      doTigerBanner();
      player.bannerTimer = cooldownTime(2.8 - player.banner * 0.18, 0.85);
    }
    if (player.sickle && player.sickleTimer <= 0) {
      doMoonSickle();
      player.sickleTimer = cooldownTime(2.1 - player.sickle * 0.14, 0.72);
    }
    if (player.sake && player.sakeTimer <= 0) {
      doPurifyingSake();
      player.sakeTimer = cooldownTime(2.7 - player.sake * 0.16, 0.88);
    }
    if (player.aura > 0) doAuraDamage(dt);
    updateProjectiles(dt);
  }

  function updateProjectiles(dt) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      if (p.homing) {
        const target = nearestEnemies(1, 620)[0];
        if (target) {
          const a = Math.atan2(target.y - p.y, target.x - p.x);
          p.vx += Math.cos(a) * 980 * dt;
          p.vy += Math.sin(a) * 980 * dt;
          const speed = 420 * player.projectileSpeed;
          const len = Math.hypot(p.vx, p.vy) || 1;
          p.vx = p.vx / len * speed;
          p.vy = p.vy / len * speed;
        }
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        if (p.area) areaDamage(p.x, p.y, p.area, p.damage * 0.85, p.color);
        projectiles.splice(i, 1);
        continue;
      }
      for (const enemy of enemies) {
        if (d2(p, enemy) < sqr(enemy.r + getProjectileHitRadius(p))) {
          damageEnemy(enemy, p.damage, Math.atan2(p.vy, p.vx));
          if (p.area) areaDamage(p.x, p.y, p.area, p.damage * 0.55, p.color);
          p.pierce -= 1;
          if (p.pierce < 0) {
            projectiles.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  function areaDamage(x, y, radius, damage, color) {
    const limit = sqr(radius);
    for (const enemy of enemies) {
      const dx = enemy.x - x;
      const dy = enemy.y - y;
      if (dx * dx + dy * dy < limit) damageEnemy(enemy, damage, Math.atan2(dy, dx));
    }
    shockwaves.push({ x, y, r: 18, life: 0.26, max: 0.26, color, power: 0 });
  }

  function updatePuddles(dt) {
    for (let i = puddles.length - 1; i >= 0; i--) {
      const puddle = puddles[i];
      puddle.life -= dt;
      puddle.tick -= dt;
      if (puddle.life <= 0) {
        puddles.splice(i, 1);
        continue;
      }
      if (puddle.tick > 0) continue;
      puddle.tick = 0.24;
      const limit = sqr(puddle.r);
      for (const enemy of enemies) {
        const dx = enemy.x - puddle.x;
        const dy = enemy.y - puddle.y;
        if (dx * dx + dy * dy < limit) {
          enemy.slow = Math.max(enemy.slow, 0.42);
          damageEnemy(enemy, puddle.damage, Math.atan2(dy, dx));
        }
      }
    }
  }

  function getProjectileHitRadius(p) {
    if (p.kind === "laser") return p.r + 13;
    const forgiving = p.kind === "sickle" ? 2 : p.homing || p.area ? 4 : 7;
    return p.r + forgiving;
  }

  function updateSenryoThief(enemy, dt, angleToPlayer, distanceToPlayer) {
    enemy.visibleLife = Math.max(0, (enemy.visibleLife || 0) - dt);
    enemy.escapeLife -= dt;
    const showoff = enemy.visibleLife > 0;
    let moveAngle;
    if (showoff) {
      const orbitDir = Math.sin(enemy.phase) >= 0 ? 1 : -1;
      if (distanceToPlayer < 190) moveAngle = angleToPlayer + Math.PI;
      else if (distanceToPlayer > 520) moveAngle = angleToPlayer;
      else moveAngle = angleToPlayer + Math.PI / 2 * orbitDir;
    } else {
      moveAngle = distanceToPlayer > 760 ? angleToPlayer : angleToPlayer + Math.PI;
    }
    const weave = Math.sin(elapsed * 7.6 + enemy.phase) * 0.88;
    const panic = !showoff && distanceToPlayer < 260 ? 1.55 : 1;
    const showoffMul = showoff ? 0.72 : 1;
    enemy.vx += Math.cos(moveAngle + weave) * enemy.speed * panic * showoffMul * dt * 6.7;
    enemy.vy += Math.sin(moveAngle + weave) * enemy.speed * panic * showoffMul * dt * 6.7;
    if (enemy.dashCd <= 0) {
      const hop = moveAngle + rand(-0.8, 0.8);
      enemy.vx += Math.cos(hop) * rand(showoff ? 70 : 120, showoff ? 135 : 220);
      enemy.vy += Math.sin(hop) * rand(showoff ? 70 : 120, showoff ? 135 : 220);
      enemy.dashCd = showoff ? rand(0.34, 0.62) : rand(0.45, 0.88);
      burst(enemy.x, enemy.y, "#ffcf4b", 4, 4);
    }
    enemy.vx *= 0.82;
    enemy.vy *= 0.82;
    enemy.x += enemy.vx * dt;
    enemy.y += enemy.vy * dt;
    resolveMapCollision(enemy, enemy.r * 0.78);
    enemy.sparkleCd = Math.max(0, (enemy.sparkleCd || 0) - dt);
    if (enemy.sparkleCd <= 0) {
      const len = Math.hypot(enemy.vx, enemy.vy) || 1;
      const bx = enemy.x - enemy.vx / len * enemy.r * 0.9;
      const by = enemy.y - enemy.vy / len * enemy.r * 0.9;
      for (let i = 0; i < 3; i++) {
        if (particles.length >= MAX_PARTICLES) particles.shift();
        particles.push({
          x: bx + rand(-10, 10),
          y: by + rand(-8, 8),
          vx: -enemy.vx * rand(0.05, 0.12) + rand(-34, 34),
          vy: -enemy.vy * rand(0.05, 0.12) + rand(-34, 34),
          life: rand(0.28, 0.46),
          max: 0.46,
          r: rand(2.4, 4.8),
          color: chance(0.38) ? "#ffffff" : chance(0.5) ? "#ffdf5a" : "#ff9f2f"
        });
      }
      enemy.sparkleCd = 0.055;
    }
    enemy.hit = Math.max(0, enemy.hit - dt);
    if (!showoff && (enemy.escapeLife <= 0 || distanceToPlayer > 1240)) {
      const idx = enemies.indexOf(enemy);
      if (idx >= 0) enemies.splice(idx, 1);
      burst(enemy.x, enemy.y, "#ffcf4b", 14, 7);
      showToast({ sprite: 11 }, "千両泥棒に逃げられた！");
    }
  }

  function updateEnemies(dt) {
    for (const enemy of enemies) {
      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      const distanceToPlayer = Math.sqrt(d2(enemy, player));
      enemy.dashCd -= dt;
      enemy.shootCd = Math.max(0, (enemy.shootCd || 0) - dt);
      enemy.slow = Math.max(0, enemy.slow - dt);
      if (enemy.type === "senryoThief") {
        updateSenryoThief(enemy, dt, angle, distanceToPlayer);
        continue;
      }
      if (enemy.type === "overlord") updateOverlordCast(enemy, dt, angle, distanceToPlayer);
      const casting = enemy.type === "overlord" && enemy.castTimer > 0;
      if (casting) {
        enemy.vx *= 0.58;
        enemy.vy *= 0.58;
      } else {
        const weave = Math.sin(elapsed * 2.9 + enemy.phase) * (enemy.type === "tengu" ? 1.35 : enemy.type === "shinobi" ? 0.15 : 0.42);
        const closeBoost = distanceToPlayer < 280 ? 1.18 + clamp(elapsed / 360, 0, 1) * 0.75 : 1;
        const slowMul = enemy.slow > 0 ? enemy.type === "overlord" ? 0.82 : 0.54 : 1;
        const traitMul = enemy.type === "overlord" ? 1.04 : enemy.type === "armored" ? 0.82 : enemy.type === "oniElite" ? 0.92 : 1;
        enemy.vx += Math.cos(angle + weave) * enemy.speed * closeBoost * slowMul * traitMul * dt * 4.8;
        enemy.vy += Math.sin(angle + weave) * enemy.speed * closeBoost * slowMul * traitMul * dt * 4.8;
        if (elapsed > 220 && enemy.type === "shinobi" && enemy.dashCd <= 0 && distanceToPlayer < 360) {
          const dashPower = 280 + clamp((elapsed - 220) / 220, 0, 1) * 120;
          enemy.vx += Math.cos(angle) * dashPower;
          enemy.vy += Math.sin(angle) * dashPower;
          enemy.dashCd = rand(1.5, 2.4);
        }
        if (elapsed > 450 && (enemy.type === "oniElite" || enemy.type === "overlord") && enemy.dashCd <= 0 && distanceToPlayer < 420) {
          const rushPower = 170 + clamp((elapsed - 450) / 180, 0, 1) * 80;
          enemy.vx += Math.cos(angle) * rushPower;
          enemy.vy += Math.sin(angle) * rushPower;
          enemy.dashCd = enemy.type === "overlord" ? rand(1.8, 2.6) : rand(2.2, 3.2);
        }
      }
      enemy.vx *= enemy.type === "armored" || enemy.type === "boss" || enemy.type === "overlord" ? 0.9 : 0.86;
      enemy.vy *= enemy.type === "armored" || enemy.type === "boss" || enemy.type === "overlord" ? 0.9 : 0.86;
      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;
      if (!isFlyingEnemy(enemy)) resolveMapCollision(enemy, enemy.r * 0.72);
      enemy.hit = Math.max(0, enemy.hit - dt);
      const contactRadius = getEnemyContactRadius(enemy);
      if (d2(enemy, player) < sqr(contactRadius)) {
        if (!testMode && player.invuln <= 0) {
          const baseHurt = getEnemyTouchDamage(enemy);
          const hurt = Math.max(1, baseHurt - player.armor);
          player.hp -= hurt;
          player.invuln = 0.44;
          camera.shake = Math.max(camera.shake, 8);
          burst(player.x, player.y, "#d82936", 12, 6);
          if (audio) audio.sfx("hurt");
          playCatVoice("pain", 0.58);
          if (player.armor > 0) areaDamage(player.x, player.y, 70 + player.armor * 14, scaledDamage(player.damage * (0.7 + player.armor * 0.08)), "#dcecff");
          if (player.hp <= 0) gameOver();
        }
        enemy.vx -= Math.cos(angle) * 160;
        enemy.vy -= Math.sin(angle) * 160;
      }
    }
  }

  function updateOverlordCast(enemy, dt, angle, distanceToPlayer) {
    const wasCasting = (enemy.castTimer || 0) > 0;
    enemy.castTimer = Math.max(0, (enemy.castTimer || 0) - dt);
    if (wasCasting) {
      if (enemy.castTimer <= 0 && !enemy.castFired) {
        enemy.castFired = true;
        fireOverlordVolley(enemy, angle);
      }
      if (enemy.castFired) {
        enemy.castFired = false;
        enemy.shootCd = rand(4.8, 6.8);
      }
      return;
    }
    if (enemy.shootCd > 0 || distanceToPlayer > 980) return;
    enemy.castTimer = 0.78;
    enemy.castFired = false;
    enemy.vx *= 0.18;
    enemy.vy *= 0.18;
    shockwaves.push({ x: enemy.x, y: enemy.y, r: enemy.r * 0.6, life: 0.44, max: 0.44, color: "#ff4058", power: 0 });
    burst(enemy.x, enemy.y, "#ff4058", 18, 7);
  }

  function fireOverlordVolley(enemy, angleToPlayer) {
    const speed = 250;
    const base = Number.isFinite(angleToPlayer) ? angleToPlayer : 0;
    const count = 6;
    for (let i = 0; i < count; i++) {
      if (enemyBullets.length >= MAX_ENEMY_BULLETS) enemyBullets.shift();
      const angle = base + i * TAU / count;
      enemyBullets.push({
        x: enemy.x + Math.cos(angle) * enemy.r * 0.72,
        y: enemy.y + Math.sin(angle) * enemy.r * 0.72,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 12,
        life: 4.2,
        max: 4.2,
        damage: 10,
        color: "#ff4058",
        kind: "overlordBullet"
      });
    }
    shockwaves.push({ x: enemy.x, y: enemy.y, r: enemy.r, life: 0.38, max: 0.38, color: "#ffdf5a", power: 0 });
    camera.shake = Math.max(camera.shake, 4);
  }

  function updateEnemyBullets(dt) {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const bullet = enemyBullets[i];
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.life -= dt;
      if (bullet.life <= 0 || d2(bullet, player) > sqr(Math.max(W, H) * 1.35)) {
        enemyBullets.splice(i, 1);
        continue;
      }
      if (d2(bullet, player) >= sqr(player.r * 0.82 + bullet.r)) continue;
      enemyBullets.splice(i, 1);
      if (testMode || player.invuln > 0) continue;
      const hurt = Math.max(1, bullet.damage - Math.floor(player.armor * 0.45));
      player.hp -= hurt;
      player.invuln = 0.36;
      camera.shake = Math.max(camera.shake, 5);
      burst(player.x, player.y, "#ff4058", 9, 5);
      if (audio) audio.sfx("hurt");
      playCatVoice("pain", 0.44);
      if (player.hp <= 0) gameOver();
    }
  }

  function getEnemyContactRadius(enemy) {
    const visualReach = enemy.type === "overlord"
      ? enemy.r * 1.82
      : enemy.type === "oniElite" || enemy.type === "boss"
        ? enemy.r * 1.68
        : enemy.type === "armored"
          ? enemy.r * 1.55
          : enemy.type === "ashigaru"
            ? enemy.r * 1.42
            : enemy.r * 1.34;
    return Math.max(enemy.r + player.r + 8, visualReach + player.r * 0.82);
  }

  function isFlyingEnemy(enemy) {
    return enemy.type === "wraith" || enemy.type === "tengu";
  }

  function getEnemyTouchDamage(enemy) {
    if (enemy.type === "overlord") return 36;
    if (enemy.type === "oniElite" || enemy.type === "boss") return 26;
    if (enemy.type === "armored") return 20;
    if (enemy.type === "ashigaru") return 15;
    if (enemy.type === "shinobi" || enemy.type === "tengu") return 12;
    return 10;
  }

  function updateGems(dt) {
    const magnet = player.magnet;
    const magnetLimit = sqr(magnet);
    for (let i = gems.length - 1; i >= 0; i--) {
      const g = gems[i];
      const dd = d2(g, player);
      if (dd < magnetLimit) {
        const a = Math.atan2(player.y - g.y, player.x - g.x);
        const pull = clamp((magnet - Math.sqrt(dd)) / magnet, 0, 1);
        g.vx += Math.cos(a) * (380 + pull * 850) * dt;
        g.vy += Math.sin(a) * (380 + pull * 850) * dt;
      }
      g.vx *= 0.94;
      g.vy *= 0.94;
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      if (dd < sqr(player.r + 12)) {
        gems.splice(i, 1);
        player.xp += g.value;
        score += Math.round(g.value * (1 + player.coinBonus));
        if (player.xp >= player.need) {
          player.xp -= player.need;
          player.level++;
          reinforceEnemiesForScaling();
          player.need = Math.floor(player.need * 1.24 + 5);
          if (canStartJackpot() && canMultiUpgrade() && chance(0.025 + player.luck * 0.06)) triggerSequentialJackpot();
          else pauseForLevel();
          return;
        }
      }
    }
  }

  function updatePickups(dt) {
    for (let i = pickups.length - 1; i >= 0; i--) {
      const pickup = pickups[i];
      pickup.life -= dt;
      if (pickup.life <= 0) {
        pickups.splice(i, 1);
        continue;
      }
      const dd = d2(pickup, player);
      if (dd < sqr(player.magnet * 0.72)) {
        const a = Math.atan2(player.y - pickup.y, player.x - pickup.x);
        pickup.x += Math.cos(a) * 240 * dt;
        pickup.y += Math.sin(a) * 240 * dt;
      }
      if (dd < sqr(player.r + pickup.r)) {
        pickups.splice(i, 1);
        applyPickup(pickup);
      }
    }
  }

  function applyPickup(pickup) {
    const type = pickup.type;
    if (type === "heal") {
      player.hp = Math.min(player.maxHp, player.hp + 38 + player.regen * 8);
      showToast({ sprite: 7 }, "おにぎりで回復");
      if (audio) audio.sfx("select");
    }
    if (type === "magnet") {
      for (const g of gems) {
        const a = Math.atan2(player.y - g.y, player.x - g.x);
        g.vx += Math.cos(a) * 980;
        g.vy += Math.sin(a) * 980;
      }
      showToast({ sprite: 8 }, "招き鈴が鳴った");
      if (audio) audio.sfx("select");
    }
    if (type === "bomb") {
      areaDamage(player.x, player.y, 520, scaledDamage(player.damage * 2.2), "#ffb93f");
      shockwaves.push({ x: player.x, y: player.y, r: 40, life: 0.52, max: 0.52, color: "#ffb93f", power: 0 });
      camera.shake = Math.max(camera.shake, 10);
      showToast({ sprite: 2 }, "鬼太鼓が轟いた");
      if (audio) audio.sfx("chest");
    }
    if (type === "fury") {
      activateFury();
    }
    if (type === "chest") {
      openTreasureChest(pickup);
      if (audio) audio.sfx("chest");
    }
  }

  function openTreasureChest(pickup = {}) {
    openedChestCount++;
    const tier = chestTiers[pickup.tier] ? pickup.tier : "wood";
    const chest = chestTiers[tier];
    const milestoneGuaranteed = openedChestCount % 7 === 0;
    const jackpotRoll = chance((chest.jackpotChance || 0) + player.luck * 0.018);
    const jackpot = canStartJackpot() && (milestoneGuaranteed || jackpotRoll) && canChestSlot();
    if (jackpot) {
      showToast({ sprite: 11 }, `${chest.name}${milestoneGuaranteed ? " 七箱目" : ""}: 大当たり`);
      triggerSequentialJackpot({ source: "chest", tier, minCount: chest.rewards, allowFresh: true });
      return;
    }
    showTreasureChoice(tier, chest);
  }

  function compactDistantEnemies() {
    if (enemies.length < MAX_ENEMIES * 0.92) return;
    const maxDist = sqr(Math.max(W, H) * 1.15);
    for (let i = enemies.length - 1; i >= 0 && enemies.length > MAX_ENEMIES * 0.82; i--) {
      if (d2(enemies[i], player) > maxDist && enemies[i].type !== "boss") enemies.splice(i, 1);
    }
  }

  function updateList(list, dt, fn = null) {
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      item.life -= dt;
      if (fn) fn(item);
      if (item.life <= 0) list.splice(i, 1);
    }
  }

  function updateHud() {
    hpBar.style.width = `${clamp(player.hp / player.maxHp, 0, 1) * 100}%`;
    xpBar.style.width = `${clamp(player.xp / player.need, 0, 1) * 100}%`;
    levelLabel.textContent = `Lv ${player.level}`;
    timeLabel.textContent = formatClock(elapsed);
    scoreLabel.textContent = score.toString();
  }

  function getCameraZoom() {
    const touch = navigator.maxTouchPoints > 0;
    const touchLandscape = touch && W > H;
    const smartphoneSize = Math.min(W, H) <= 720 && Math.max(W, H) <= 1180;
    const compactLandscape = W > H && H <= 560;
    if (touchLandscape) return FIELD_CAMERA_ZOOM_TOUCH;
    if (touch || smartphoneSize || compactLandscape) return FIELD_CAMERA_ZOOM_MOBILE;
    return FIELD_CAMERA_ZOOM;
  }

  function worldToScreen(x, y) {
    const zoom = getCameraZoom();
    return {
      x: W / 2 + (x - camera.x) * zoom,
      y: H / 2 + (y - camera.y) * zoom
    };
  }

  function isInDrawRange(entity, margin = 180, zoom = getCameraZoom()) {
    const halfW = W / (2 * zoom) + margin;
    const halfH = H / (2 * zoom) + margin;
    return entity.x >= camera.x - halfW
      && entity.x <= camera.x + halfW
      && entity.y >= camera.y - halfH
      && entity.y <= camera.y + halfH;
  }

  function visibleWorldRect(margin = 0, zoom = getCameraZoom()) {
    const halfW = W / (2 * zoom) + margin;
    const halfH = H / (2 * zoom) + margin;
    return {
      x: camera.x - halfW,
      y: camera.y - halfH,
      w: halfW * 2,
      h: halfH * 2
    };
  }

  function draw() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawBackground();
    ctx.save();
    const zoom = getCameraZoom();
    const shakePower = camera.shake < 1.2 ? 0 : camera.shake;
    const sx = shakePower ? rand(-shakePower, shakePower) : 0;
    const sy = shakePower ? rand(-shakePower, shakePower) : 0;
    ctx.translate(W / 2 + sx, H / 2 + sy);
    ctx.scale(zoom, zoom);
    ctx.translate(-camera.x, -camera.y);
    drawArena();
    for (const gem of gems) if (isInDrawRange(gem, 90, zoom)) drawGem(gem);
    for (const pickup of pickups) if (isInDrawRange(pickup, 120, zoom)) drawPickup(pickup);
    for (const puddle of puddles) if (isInDrawRange(puddle, 260, zoom)) drawPuddle(puddle);
    for (const enemy of enemies) if (isInDrawRange(enemy, 260, zoom)) drawEnemy(enemy);
    for (const slash of slashes) if (isInDrawRange(slash, 280, zoom)) drawSlash(slash);
    for (const p of projectiles) if (isInDrawRange(p, 220, zoom)) drawProjectile(p);
    for (const bullet of enemyBullets) if (isInDrawRange(bullet, 180, zoom)) drawProjectile(bullet);
    drawPlayer();
    let drawnShockwaves = 0;
    for (let i = shockwaves.length - 1; i >= 0 && drawnShockwaves < 12; i--) {
      const wave = shockwaves[i];
      if (!isInDrawRange(wave, 320, zoom)) continue;
      drawShockwave(wave);
      drawnShockwaves++;
    }
    for (const p of particles) if (isInDrawRange(p, 160, zoom)) drawParticle(p);
    for (const t of texts) if (isInDrawRange(t, 150, zoom)) drawText(t);
    ctx.restore();
    drawTreasureRadar();
    drawVignette();
    drawClearTransition();
    drawFuryCutin();
  }

  function drawTreasureRadar() {
    if (state !== "playing" && state !== "clearing") return;
    const targets = pickups
      .filter(pickup => pickup.type === "chest" || pickup.type === "heal")
      .sort((a, b) => d2(a, player) - d2(b, player))
      .slice(0, 9);
    if (!targets.length) return;
    const pad = clamp(Math.min(W, H) * 0.055, 26, 46);
    const topPad = Math.max(pad, 72 * currentHudScale);
    for (const pickup of targets) {
      const screen = worldToScreen(pickup.x, pickup.y);
      const visible = screen.x >= pad && screen.x <= W - pad && screen.y >= topPad && screen.y <= H - pad;
      if (visible) continue;
      const dx = screen.x - W / 2;
      const dy = screen.y - H / 2;
      const angle = Math.atan2(dy, dx);
      const x = clamp(screen.x, pad, W - pad);
      const y = clamp(screen.y, topPad, H - pad);
      const tier = pickup.type === "chest" ? (chestTiers[pickup.tier || "wood"] || chestTiers.wood) : null;
      drawPickupRadarMarker({
        x,
        y,
        angle,
        glow: tier ? tier.glow : "#7bf7df",
        color: tier ? tier.color : "#58f3e4"
      });
    }
  }

  function drawPickupRadarMarker({ x, y, angle, glow, color }) {
    const pulse = 1 + Math.sin(elapsed * 5.2) * 0.04;
    const chevron = 14 * pulse;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowColor = glow;
    ctx.shadowBlur = 11;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 0.82;
    ctx.strokeStyle = "rgba(5, 3, 2, 0.82)";
    ctx.lineWidth = 8.4;
    ctx.beginPath();
    ctx.moveTo(-chevron * 0.56, -chevron);
    ctx.lineTo(chevron * 0.7, 0);
    ctx.lineTo(-chevron * 0.56, chevron);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 5.6;
    ctx.globalAlpha = 0.96;
    ctx.beginPath();
    ctx.moveTo(-chevron * 0.56, -chevron);
    ctx.lineTo(chevron * 0.7, 0);
    ctx.lineTo(-chevron * 0.56, chevron);
    ctx.stroke();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = glow;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.72;
    ctx.beginPath();
    ctx.moveTo(-chevron * 0.36, -chevron * 0.72);
    ctx.lineTo(chevron * 0.46, 0);
    ctx.lineTo(-chevron * 0.36, chevron * 0.72);
    ctx.stroke();
    ctx.restore();
  }

  function drawBackground() {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0b0707");
    bg.addColorStop(0.46, "#17100d");
    bg.addColorStop(1, "#071413");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2 - (camera.x * 0.04) % W, H / 2 - (camera.y * 0.04) % H);
    for (const star of stars) {
      const x = ((star.x + W * 2) % (W * 2)) - W;
      const y = ((star.y + H * 2) % (H * 2)) - H;
      ctx.globalAlpha = 0.2 + star.z * 0.45;
      ctx.fillStyle = star.hue;
      ctx.beginPath();
      ctx.arc(x, y, star.z * 1.7, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawArena() {
    ctx.save();
    const visible = visibleWorldRect(96);
    if (stageImage.complete && stageImage.naturalWidth) {
      const vx = clamp(visible.x, MAP_RECT.x, MAP_RECT.x + MAP_RECT.w);
      const vy = clamp(visible.y, MAP_RECT.y, MAP_RECT.y + MAP_RECT.h);
      const vr = clamp(visible.x + visible.w, MAP_RECT.x, MAP_RECT.x + MAP_RECT.w);
      const vb = clamp(visible.y + visible.h, MAP_RECT.y, MAP_RECT.y + MAP_RECT.h);
      if (vr > vx && vb > vy) {
        const sx = (vx - MAP_RECT.x) / MAP_RECT.w * stageImage.naturalWidth;
        const sy = (vy - MAP_RECT.y) / MAP_RECT.h * stageImage.naturalHeight;
        const sw = (vr - vx) / MAP_RECT.w * stageImage.naturalWidth;
        const sh = (vb - vy) / MAP_RECT.h * stageImage.naturalHeight;
        ctx.drawImage(stageImage, sx, sy, sw, sh, vx, vy, vr - vx, vb - vy);
      }
      const shade = ctx.createRadialGradient(0, 0, 120, 0, 0, MAP.w * 0.58);
      shade.addColorStop(0, "rgba(5, 7, 8, 0.02)");
      shade.addColorStop(1, "rgba(5, 7, 8, 0.36)");
      ctx.fillStyle = shade;
      ctx.fillRect(visible.x, visible.y, visible.w, visible.h);
    } else {
      ctx.fillStyle = "#17100d";
      ctx.fillRect(visible.x, visible.y, visible.w, visible.h);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.52)";
    ctx.fillRect(MAP_RECT.x - 900, MAP_RECT.y - 900, MAP_RECT.w + 1800, 900);
    ctx.fillRect(MAP_RECT.x - 900, MAP_RECT.y + MAP_RECT.h, MAP_RECT.w + 1800, 900);
    ctx.fillRect(MAP_RECT.x - 900, MAP_RECT.y, 900, MAP_RECT.h);
    ctx.fillRect(MAP_RECT.x + MAP_RECT.w, MAP_RECT.y, 900, MAP_RECT.h);

    ctx.restore();
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    if (player.invuln > 0) ctx.globalAlpha = 0.64 + Math.sin(elapsed * 40) * 0.22;
    if (player.fury > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const pulse = 0.74 + Math.sin(elapsed * 18) * 0.14;
      const glow = ctx.createRadialGradient(0, 0, 8, 0, 0, 118);
      glow.addColorStop(0, "rgba(255, 244, 165, 0.28)");
      glow.addColorStop(0.52, "rgba(255, 48, 79, 0.14)");
      glow.addColorStop(1, "rgba(255, 48, 79, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 118, 0, TAU);
      ctx.fill();
      ctx.rotate(player.dir);
      ctx.strokeStyle = `rgba(255, 223, 90, ${pulse})`;
      ctx.lineWidth = 8;
      ctx.shadowColor = "#ff304f";
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(188, 0);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.52)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(56, -22);
      ctx.lineTo(150, -7);
      ctx.moveTo(56, 22);
      ctx.lineTo(150, 7);
      ctx.stroke();
      ctx.restore();
    }
    if (player.aura > 0) {
      const count = getAuraOrbCount();
      syncAuraOrbs(count);
      const radius = getAuraRadius();
      const activeCount = player.auraOrbs.filter(orb => orb.active).length;
      const g = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
      g.addColorStop(0, "rgba(92, 232, 214, 0.08)");
      g.addColorStop(0.7, `rgba(92, 232, 214, ${activeCount ? 0.06 : 0.02})`);
      g.addColorStop(1, "rgba(92, 232, 214, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, TAU);
      ctx.fill();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < player.auraOrbs.length; i++) {
        const orb = player.auraOrbs[i];
        const a = -elapsed * (1.35 + player.aura * 0.05) + i * TAU / Math.max(1, player.auraOrbs.length);
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        const pulse = 1 + Math.sin(elapsed * 10 + i) * 0.12;
        ctx.shadowColor = "#58f3e4";
        ctx.shadowBlur = orb.active ? 18 : 5;
        ctx.globalAlpha = orb.active ? 0.92 : clamp(1 - orb.respawn / 5, 0.12, 0.38);
        ctx.fillStyle = "#58f3e4";
        ctx.beginPath();
        if (orb.active) {
          ctx.arc(x, y, (7 + player.aura * 0.7) * pulse, 0, TAU);
          ctx.fill();
          ctx.fillStyle = "#fff0b8";
          ctx.beginPath();
          ctx.arc(x - 2, y - 2, 3.5 * pulse, 0, TAU);
          ctx.fill();
        } else {
          ctx.strokeStyle = "#58f3e4";
          ctx.lineWidth = 2;
          ctx.arc(x, y, 7 + player.aura * 0.5, 0, TAU);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    if (player.orbit || player.sutra) {
      const count = getOrbitOrbCount();
      syncOrbitOrbs(count);
      const radius = getOrbitRadius();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < player.orbitOrbs.length; i++) {
        const orb = player.orbitOrbs[i];
        const a = elapsed * (1.7 + player.sutra * 0.12) + i * TAU / Math.max(1, player.orbitOrbs.length);
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        ctx.fillStyle = orb.kind === "sutra" ? "#f3d0ff" : "#ffe8a8";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = orb.active ? 12 : 4;
        ctx.globalAlpha = orb.active ? 1 : clamp(1 - orb.respawn / 4.2, 0.16, 0.46);
        ctx.beginPath();
        if (orb.active) {
          ctx.arc(x, y, 5 + player.sutra, 0, TAU);
          ctx.fill();
          if (orb.hits <= 1) {
            ctx.strokeStyle = "rgba(255,255,255,0.55)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x, y, 9 + player.sutra, 0, TAU);
            ctx.stroke();
          }
        } else {
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = 2;
          ctx.arc(x, y, 6 + player.sutra, 0, TAU);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    const moving = keys.has("KeyW") || keys.has("ArrowUp") || keys.has("KeyS") || keys.has("ArrowDown") || keys.has("KeyA") || keys.has("ArrowLeft") || keys.has("KeyD") || keys.has("ArrowRight") || pointer.active;
    const isDenkichi = player.character === "denkichi";
    const heroKey = isDenkichi ? "denkichi" : "player";
    const heroFrames = isDenkichi ? (moving ? [0, 1, 2, 1] : [0]) : player.poseTimer > 0 ? [3] : moving ? [0, 1, 2, 1] : [0];
    const hero = getCharacterFrame(heroKey, moving ? 4.4 : 1, 0, heroFrames);
    if (drawDenkichiAttackPose()) {
      drawDenkichiHandGlow();
    } else if (isImageReady(hero)) {
      let flipHero = Math.cos(player.dir) > 0;
      const height = isDenkichi ? 104 : player.poseTimer > 0 ? 104 : 96;
      const step = moving ? Math.abs(Math.sin(elapsed * 6.1)) * 1.2 : Math.sin(elapsed * 2.4) * 0.35;
      const lean = moving ? Math.sin(elapsed * 6.1) * 0.01 : Math.sin(elapsed * 2.2) * 0.006;
      ctx.save();
      ctx.translate(0, step);
      ctx.rotate(flipHero ? -lean : lean);
      if (flipHero) ctx.scale(-1, 1);
      drawUprightSprite(hero, height, player.r * 1.22);
      ctx.restore();
      drawDenkichiHandGlow();
    } else {
      ctx.rotate(player.dir);
      ctx.drawImage(spriteCache.player, -48, -48, 96, 96);
    }
    ctx.restore();
  }

  function drawDenkichiAttackPose() {
    if (player.character !== "denkichi" || player.beamPoseTimer <= 0) return false;
    const beamDir = Number.isFinite(player.beamPoseDir) ? player.beamPoseDir : player.dir;
    const facingRight = Math.cos(beamDir) >= 0;
    const img = facingRight ? denkichiAttackRightImage : denkichiAttackLeftImage;
    if (!isImageReady(img)) return false;
    const height = 112;
    const width = height * (img.naturalWidth / img.naturalHeight);
    const bottomOffset = player.r * 1.22;
    ctx.save();
    ctx.shadowColor = "rgba(88, 243, 228, 0.55)";
    ctx.shadowBlur = 8;
    ctx.drawImage(img, -width / 2, -height + bottomOffset, width, height);
    ctx.restore();
    return true;
  }

  function drawDenkichiHandGlow() {
    if (player.character !== "denkichi" || player.beamPoseTimer <= 0) return;
    const beamDir = Number.isFinite(player.beamPoseDir) ? player.beamPoseDir : player.dir;
    const facingRight = Math.cos(beamDir) >= 0;
    const img = facingRight ? denkichiHandGlowRightImage : denkichiHandGlowLeftImage;
    if (!isImageReady(img)) return;
    const pulse = 1 + Math.sin(elapsed * 44) * 0.06;
    const size = 58 * pulse;
    const handX = (facingRight ? 1 : -1) * player.r * 1.72;
    const handY = -player.r * 1.72;
    ctx.save();
    ctx.translate(handX, handY);
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = "#7ff7ff";
    ctx.shadowBlur = 18;
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  function drawEnemy(enemy) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    const isBoss = enemy.type === "boss" || enemy.type === "oniElite" || enemy.type === "overlord";
    const size = isBoss ? enemy.r * 2.7 : enemy.r * 3.8;
    ctx.globalAlpha = d2(enemy, player) > sqr(Math.max(W, H) * 0.88) ? 0.58 : 1;
    const sprite = getCharacterFrame(enemy.spriteKey, getEnemyFrameRate(enemy), enemy.phase, getEnemyFrameSequence(enemy));
    if (isImageReady(sprite)) {
      const height = isBoss ? enemy.r * 4.25 : enemy.r * 4.55;
      const bottomOffset = enemy.r * 1.35;
      drawEnemyGroundShadow(enemy);
      ctx.save();
      applyEnemyMotion(enemy);
      const pulse = 1 + enemy.hit * 1.25 + Math.sin(elapsed * 4 + enemy.phase) * 0.035;
      ctx.scale(pulse, pulse);
      if (enemy.x < player.x) ctx.scale(-1, 1);
      drawEnemyMotionTrail(enemy, sprite, height, bottomOffset);
      drawUprightSprite(sprite, height, bottomOffset);
      ctx.restore();
    } else {
      const pulse = 1 + enemy.hit * 1.25 + Math.sin(elapsed * 4 + enemy.phase) * 0.035;
      const fallback = spriteCache[enemy.sprite] || spriteCache.boss;
      ctx.scale(pulse, pulse);
      ctx.drawImage(fallback, -size / 2, -size / 2, size, size);
    }
    if (enemy.hp < enemy.maxHp) {
      ctx.fillStyle = "rgba(0,0,0,0.42)";
      ctx.fillRect(-enemy.r, -enemy.r - 14, enemy.r * 2, 4);
      ctx.fillStyle = "#ffdf5a";
      ctx.fillRect(-enemy.r, -enemy.r - 14, enemy.r * 2 * clamp(enemy.hp / enemy.maxHp, 0, 1), 4);
    }
    ctx.restore();
  }

  function drawEnemyGroundShadow(enemy) {
    if (enemy.type === "wraith" || enemy.type === "tengu") return;
    ctx.save();
    ctx.globalAlpha *= enemy.type === "armored" || enemy.type === "oniElite" || enemy.type === "overlord" ? 0.32 : 0.22;
    ctx.fillStyle = "#050407";
    ctx.beginPath();
    ctx.ellipse(0, enemy.r * 1.18, enemy.r * 1.45, enemy.r * 0.36, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function applyEnemyMotion(enemy) {
    const t = elapsed + enemy.phase;
    if (enemy.type === "wraith") {
      ctx.translate(Math.sin(t * 1.8) * 1.1, Math.sin(t * 2.2) * 3.4 - 3);
      ctx.rotate(Math.sin(t * 2.0) * 0.018);
    } else if (enemy.type === "ashigaru") {
      ctx.translate(Math.sin(t * 5.2) * 0.7, Math.abs(Math.sin(t * 5.2)) * 1.2);
      ctx.rotate(Math.sin(t * 5.2) * 0.012);
    } else if (enemy.type === "tengu") {
      ctx.translate(Math.sin(t * 2.6) * 2.2, Math.sin(t * 3.0) * 3.2 - 4);
      ctx.rotate(Math.sin(t * 2.8) * 0.026);
    } else if (enemy.type === "shinobi") {
      ctx.translate(Math.sin(t * 6.5) * 1.4, Math.cos(t * 5.5) * 0.9);
      ctx.rotate(Math.sin(t * 6.5) * 0.018);
    } else if (enemy.type === "senryoThief") {
      ctx.translate(Math.sin(t * 9.0) * 2.0, Math.abs(Math.sin(t * 9.0)) * 2.2);
      ctx.rotate(Math.sin(t * 8.5) * 0.028);
    } else if (enemy.type === "armored") {
      ctx.translate(0, Math.abs(Math.sin(t * 3.2)) * 1.4);
      ctx.rotate(Math.sin(t * 3.2) * 0.008);
    } else if (enemy.type === "oniElite" || enemy.type === "boss") {
      ctx.translate(Math.sin(t * 2.0) * 0.8, Math.abs(Math.sin(t * 2.4)) * 1.2);
      ctx.rotate(Math.sin(t * 2.0) * 0.01);
    } else if (enemy.type === "overlord") {
      ctx.translate(Math.sin(t * 1.4) * 1.1, Math.sin(t * 1.8) * 1.6 - 2);
      ctx.rotate(Math.sin(t * 1.4) * 0.008);
    }
  }

  function drawEnemyMotionTrail(enemy, sprite, height, bottomOffset) {
    if (enemy.type === "shinobi" || enemy.type === "senryoThief") {
      if (enemy.type === "senryoThief") {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = "rgba(255, 223, 90, 0.58)";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#ffdf5a";
        ctx.shadowBlur = 18;
        for (let i = 0; i < 4; i++) {
          const y = bottomOffset * 0.28 - i * 8 + Math.sin(elapsed * 12 + enemy.phase + i) * 2;
          ctx.beginPath();
          ctx.moveTo(-enemy.r * (1.8 + i * 0.24), y);
          ctx.quadraticCurveTo(-enemy.r * 1.0, y - 8, -enemy.r * 0.14, y - 2);
          ctx.stroke();
        }
        ctx.restore();
      }
      for (let i = 2; i >= 1; i--) {
        ctx.save();
        ctx.globalAlpha *= enemy.type === "senryoThief" ? (i === 2 ? 0.12 : 0.18) : (i === 2 ? 0.04 : 0.07);
        ctx.globalCompositeOperation = "lighter";
        ctx.translate(-i * (enemy.type === "senryoThief" ? 14 : 6), i * 1.5);
        drawUprightSprite(sprite, height, bottomOffset);
        ctx.restore();
      }
    } else if (enemy.type === "wraith") {
      ctx.save();
      ctx.globalAlpha *= 0.08;
      ctx.globalCompositeOperation = "lighter";
      ctx.translate(0, -3);
      ctx.scale(1.03, 1.03);
      drawUprightSprite(sprite, height, bottomOffset);
      ctx.restore();
    } else if (enemy.type === "tengu") {
      ctx.save();
      ctx.globalAlpha *= 0.06;
      ctx.globalCompositeOperation = "lighter";
      ctx.rotate(Math.sin(elapsed * 3 + enemy.phase) * 0.04);
      ctx.scale(1.025, 1.015);
      drawUprightSprite(sprite, height, bottomOffset);
      ctx.restore();
    } else if (enemy.type === "oniElite" || enemy.type === "boss" || enemy.type === "overlord") {
      ctx.save();
      ctx.globalAlpha *= enemy.type === "overlord" ? 0.07 : 0.05;
      ctx.globalCompositeOperation = "lighter";
      ctx.translate(0, -2);
      ctx.scale(1.025, 1.025);
      drawUprightSprite(sprite, height, bottomOffset);
      ctx.restore();
    }
  }

  function isImageReady(img) {
    return img && img.complete && img.naturalWidth > 0;
  }

  function getCharacterFrame(key, fps, phase = 0, sequence = null) {
    const frames = characterAnimations[key];
    if (frames && frames.length) {
      const order = sequence && sequence.length ? sequence : frames.map((_, i) => i);
      const index = order[Math.floor((elapsed * fps + phase) % order.length)] % frames.length;
      if (isImageReady(frames[index])) return frames[index];
      const ready = order.map(i => frames[i % frames.length]).find(isImageReady) || frames.find(isImageReady);
      if (ready) return ready;
    }
    return characterBaseSprites[key];
  }

  function getEnemyFrameSequence(enemy) {
    if (enemy.type === "armored") return [0, 1, 0, 2, 1];
    if (enemy.type === "shinobi") return [0, 1, 2, 1];
    if (enemy.type === "senryoThief") return [0, 1, 2, 3, 2, 1];
    if (enemy.type === "boss") return [0, 1, 2, 3, 2, 1];
    return [0, 1, 2, 1];
  }

  function getEnemyFrameRate(enemy) {
    if (enemy.type === "wraith") return 2.6;
    if (enemy.type === "ashigaru") return 4.0;
    if (enemy.type === "tengu") return 3.4;
    if (enemy.type === "shinobi") return 5.0;
    if (enemy.type === "senryoThief") return 8.0;
    if (enemy.type === "armored") return 2.4;
    if (enemy.type === "boss") return 4.2;
    if (enemy.type === "oniElite") return 2.8;
    if (enemy.type === "overlord") return 2.2;
    return 3.4;
  }

  function drawUprightSprite(img, height, bottomOffset) {
    const width = height * (img.naturalWidth / img.naturalHeight);
    ctx.drawImage(img, -width / 2, -height + bottomOffset, width, height);
  }

  function drawProjectile(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.atan2(p.vy, p.vx));
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 20;
    const g = ctx.createLinearGradient(-18, 0, 20, 0);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(0.34, p.color);
    g.addColorStop(1, "#fff8d8");
    ctx.fillStyle = g;
    if (p.kind === "laser") {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 28;
      ctx.strokeStyle = "rgba(255,255,255,0.96)";
      ctx.lineWidth = Math.max(4, p.r * 0.42);
      ctx.beginPath();
      ctx.moveTo(-34, 0);
      ctx.lineTo(46, 0);
      ctx.stroke();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(12, p.r * 1.25);
      ctx.globalAlpha *= 0.76;
      ctx.beginPath();
      ctx.moveTo(-52, 0);
      ctx.lineTo(42, 0);
      ctx.stroke();
      ctx.globalAlpha *= 0.72;
      ctx.strokeStyle = "rgba(255,255,255,0.68)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-22, -p.r * 0.85);
      ctx.lineTo(28, -p.r * 0.16);
      ctx.moveTo(-22, p.r * 0.85);
      ctx.lineTo(28, p.r * 0.16);
      ctx.stroke();
    } else if (p.kind === "crane") {
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-10, -10);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fill();
    } else if (p.kind === "arrow") {
      ctx.fillRect(-22, -2, 38, 4);
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(8, -8);
      ctx.lineTo(12, 0);
      ctx.lineTo(8, 8);
      ctx.closePath();
      ctx.fill();
    } else if (p.kind === "sickle") {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(0, 0, p.r * 1.5, -0.9, 0.9);
      ctx.stroke();
      ctx.strokeStyle = "#fff8d8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, p.r * 1.5 + 5, -0.7, 0.7);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r * 2.6, p.r * 0.78, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSlash(slash) {
    const t = 1 - slash.life / slash.max;
    const alpha = Math.max(0, 1 - t);
    const core = slash.color || "#fff0a3";
    const edge = slash.edgeColor || "#d82936";
    const sweep = 0.82 + Math.sin(t * Math.PI) * 0.18;
    const inner = slash.r * 0.34;
    const outer = slash.r * (1.02 + t * 0.08);
    const tip = slash.r * (1.03 + t * 0.1);
    ctx.save();
    ctx.translate(slash.x, slash.y);
    ctx.rotate(slash.angle);
    ctx.globalCompositeOperation = "lighter";

    ctx.globalAlpha = alpha * 0.28;
    const aura = ctx.createRadialGradient(0, 0, inner * 0.2, 0, 0, outer);
    aura.addColorStop(0, "rgba(255, 245, 190, 0)");
    aura.addColorStop(0.46, slash.color ? "rgba(88, 243, 228, 0.18)" : "rgba(255, 223, 90, 0.16)");
    aura.addColorStop(0.74, slash.color ? "rgba(255, 48, 79, 0.16)" : "rgba(216, 41, 54, 0.18)");
    aura.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, outer, -sweep, sweep);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = alpha * 0.94;
    ctx.shadowColor = edge;
    ctx.shadowBlur = slash.color ? 38 : 30;
    ctx.lineCap = "round";
    const blade = ctx.createLinearGradient(inner, -outer * 0.2, outer, outer * 0.14);
    blade.addColorStop(0, "rgba(255,255,255,0.08)");
    blade.addColorStop(0.34, core);
    blade.addColorStop(0.68, "#ffffff");
    blade.addColorStop(1, edge);
    ctx.strokeStyle = blade;
    ctx.lineWidth = slash.color ? 28 : 22;
    ctx.beginPath();
    ctx.arc(0, 0, tip, -sweep * 0.92, sweep * 0.92);
    ctx.stroke();

    ctx.globalAlpha = alpha;
    ctx.shadowColor = "#fff8d8";
    ctx.shadowBlur = 18;
    ctx.strokeStyle = "rgba(255, 255, 245, 0.96)";
    ctx.lineWidth = slash.color ? 8 : 6;
    ctx.beginPath();
    ctx.arc(0, 0, tip + 8, -sweep * 0.72, sweep * 0.72);
    ctx.stroke();

    ctx.fillStyle = "#fff2a8";
    ctx.shadowColor = "#ff3b4f";
    ctx.shadowBlur = 12;
    for (let i = 0; i < 7; i++) {
      const a = -sweep + (i / 6) * sweep * 2;
      const r = tip + 8 + Math.sin(i * 2.1 + t * 5) * 12;
      ctx.globalAlpha = alpha * (0.32 + i * 0.045);
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2.2 + (i % 3), 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGem(gem) {
    ctx.save();
    ctx.translate(gem.x, gem.y);
    ctx.rotate(elapsed * 4);
    ctx.shadowColor = gem.color;
    ctx.shadowBlur = 13;
    ctx.fillStyle = gem.color;
    ctx.beginPath();
    ctx.moveTo(0, -gem.r);
    ctx.lineTo(gem.r, 0);
    ctx.lineTo(0, gem.r);
    ctx.lineTo(-gem.r, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawPickup(pickup) {
    const def = pickupDefs[pickup.type];
    const chest = pickup.type === "chest" ? chestTiers[pickup.tier || "wood"] : null;
    const fury = pickup.type === "fury";
    const bob = Math.sin(elapsed * 5 + pickup.pulse) * 3;
    ctx.save();
    ctx.translate(pickup.x, pickup.y + bob);
    ctx.shadowColor = fury ? "#ff304f" : chest ? chest.glow : "#62f0d8";
    ctx.shadowBlur = fury ? 30 : 18;
    ctx.fillStyle = "rgba(5, 8, 12, 0.72)";
    ctx.beginPath();
    ctx.arc(0, 0, pickup.r + 5, 0, TAU);
    ctx.fill();
    if (fury) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.rotate(-elapsed * 2.4);
      ctx.strokeStyle = "#ffdf5a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, pickup.r + 11, -0.9, 0.9);
      ctx.arc(0, 0, pickup.r + 11, Math.PI - 0.9, Math.PI + 0.9);
      ctx.stroke();
      ctx.rotate(elapsed * 4.8);
      ctx.strokeStyle = "#ff304f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-pickup.r - 8, 0);
      ctx.lineTo(pickup.r + 8, 0);
      ctx.moveTo(0, -pickup.r - 8);
      ctx.lineTo(0, pickup.r + 8);
      ctx.stroke();
      ctx.restore();
    }
    if (chest) {
      ctx.fillStyle = chest.color;
      ctx.strokeStyle = chest.glow;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-pickup.r - 3, -pickup.r + 3, pickup.r * 2 + 6, pickup.r * 1.65, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.32)";
      ctx.fillRect(-pickup.r + 3, -pickup.r + 8, pickup.r * 2 - 6, 4);
    }
    drawItemIconCanvas(def.sprite, -pickup.r, -pickup.r, pickup.r * 2, pickup.r * 2);
    ctx.restore();
  }

  function drawPuddle(puddle) {
    const a = clamp(puddle.life / puddle.max, 0, 1);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.2 + a * 0.28;
    const g = ctx.createRadialGradient(puddle.x, puddle.y, 0, puddle.x, puddle.y, puddle.r);
    g.addColorStop(0, "rgba(180, 245, 255, 0.42)");
    g.addColorStop(0.55, "rgba(82, 192, 255, 0.22)");
    g.addColorStop(1, "rgba(82, 192, 255, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(puddle.x, puddle.y, puddle.r, puddle.r * 0.58, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(230, 252, 255, 0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(puddle.x, puddle.y, puddle.r * (0.76 + Math.sin(elapsed * 4) * 0.04), puddle.r * 0.42, 0, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  function drawItemIconCanvas(sprite, x, y, w, h) {
    if (!itemAtlas.complete || !itemAtlas.naturalWidth) {
      ctx.fillStyle = "#ffdf5a";
      ctx.fillRect(x, y, w, h);
      return;
    }
    const cellW = itemAtlas.naturalWidth / ITEM_COLS;
    const cellH = itemAtlas.naturalHeight / ITEM_ROWS;
    const col = sprite % ITEM_COLS;
    const row = Math.floor(sprite / ITEM_COLS);
    ctx.drawImage(itemAtlas, col * cellW, row * cellH, cellW, cellH, x, y, w, h);
  }

  function drawParticle(p) {
    const a = clamp(p.life / p.max, 0, 1);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * (1.35 - a * 0.35), 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawShockwave(wave) {
    const t = 1 - wave.life / wave.max;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = wave.color;
    ctx.lineWidth = 5 * (1 - t);
    ctx.shadowColor = wave.color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y, wave.r + t * 145, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  function drawText(item) {
    ctx.save();
    ctx.globalAlpha = clamp(item.life / item.max, 0, 1);
    ctx.fillStyle = item.color;
    ctx.font = `900 ${item.size || 16}px Segoe UI, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 6;
    ctx.fillText(item.text, item.x, item.y);
    ctx.restore();
  }

  function drawVignette() {
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.18, W / 2, H / 2, Math.max(W, H) * 0.72);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.7, "rgba(0,0,0,0.12)");
    g.addColorStop(1, "rgba(0,0,0,0.62)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawClearTransition() {
    if (state !== "clearing") return;
    const t = 1 - clamp(clearDelay / Math.max(0.001, clearMaxDelay), 0, 1);
    const fadeIn = clamp(t / 0.28, 0, 1);
    const fadeOut = clamp(clearDelay / 0.45, 0, 1);
    const alpha = Math.min(fadeIn, fadeOut);
    const title = clearReason === "boss" ? "終焉の黒角王、討伐" : "夜明けの浄化";
    const subtitle = clearReason === "boss" ? "鬼の王は膝をつき、夜が裂ける。" : "十五分の夜を越え、妖気が霧散する。";
    const pulse = Math.sin(t * Math.PI);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + pulse * 0.18})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.48);
    glow.addColorStop(0, `rgba(255, 223, 90, ${0.32 * alpha})`);
    glow.addColorStop(0.42, `rgba(255, 74, 62, ${0.14 * alpha})`);
    glow.addColorStop(1, "rgba(255, 223, 90, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = clearReason === "boss" ? "#ff2438" : "#ffdf5a";
    ctx.shadowBlur = 32 + pulse * 28;
    ctx.fillStyle = "#fff4cc";
    ctx.font = `900 ${clamp(W * 0.072, 48, 104)}px "Yu Mincho", "Hiragino Mincho ProN", serif`;
    ctx.fillText(title, W / 2, H * 0.46 - pulse * 10);
    ctx.shadowBlur = 18;
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.font = `800 ${clamp(W * 0.024, 18, 34)}px "Yu Mincho", "Hiragino Mincho ProN", serif`;
    ctx.fillText(subtitle, W / 2, H * 0.58 + pulse * 8);

    ctx.strokeStyle = `rgba(255, 244, 204, ${0.86 * alpha})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(W * 0.18, H * 0.38);
    ctx.lineTo(W * 0.82, H * 0.34);
    ctx.moveTo(W * 0.2, H * 0.66);
    ctx.lineTo(W * 0.8, H * 0.62);
    ctx.stroke();
    ctx.restore();
  }

  function drawFuryCutin() {
    if (!furyCutin) return;
    const t = 1 - furyCutin.life / furyCutin.max;
    const intro = clamp(t / 0.18, 0, 1);
    const outro = clamp((1 - t) / 0.18, 0, 1);
    const alpha = Math.min(intro, outro);
    const ease = 1 - Math.pow(1 - intro, 3);
    const shake = rand(-10, 10) * (1 - t) * alpha;
    const panelH = Math.min(H * 0.72, W * 0.46);
    const y = H * 0.5 - panelH * 0.5 + shake * 0.2;
    const slide = (1 - ease) * W * 0.62;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgba(0, 0, 0, ${0.54 * alpha})`;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(-slide + shake, 0);
    ctx.beginPath();
    ctx.moveTo(-80, y + panelH * 0.08);
    ctx.lineTo(W + 120, y - panelH * 0.08);
    ctx.lineTo(W + 80, y + panelH * 0.92);
    ctx.lineTo(-120, y + panelH * 1.08);
    ctx.closePath();
    ctx.clip();

    const cutinImage = furyCutin.character === "denkichi" ? denkichiFuryCutinImage : furyCutinImage;
    if (isImageReady(cutinImage)) {
      const scale = Math.max((W + 180) / cutinImage.naturalWidth, (panelH + 80) / cutinImage.naturalHeight);
      const iw = cutinImage.naturalWidth * scale;
      const ih = cutinImage.naturalHeight * scale;
      const ix = W * 0.5 - iw * 0.5 + Math.sin(t * Math.PI) * 26;
      const iy = y + panelH * 0.5 - ih * 0.5;
      ctx.drawImage(cutinImage, ix, iy, iw, ih);
    } else {
      const bg = ctx.createLinearGradient(0, y, W, y + panelH);
      bg.addColorStop(0, "#050000");
      bg.addColorStop(0.42, "#35100c");
      bg.addColorStop(1, "#090604");
      ctx.fillStyle = bg;
      ctx.fillRect(-40, y - 40, W + 80, panelH + 80);
    }

    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.fillRect(-40, y - 40, W + 80, panelH + 80);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.88)";
    ctx.lineWidth = 5;
    for (let i = 0; i < 8; i++) {
      const lx = W * (0.62 + i * 0.08) - t * W * 0.24;
      const ly = y + panelH * (0.16 + (i % 5) * 0.18);
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 250, ly - 46);
      ctx.stroke();
    }
    ctx.restore();

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(255, 48, 79, ${0.22 * Math.sin(t * Math.PI)})`;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = `rgba(255, 223, 90, ${0.88 * alpha})`;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-40, y + panelH * 0.08);
    ctx.lineTo(W + 40, y - panelH * 0.08);
    ctx.moveTo(-40, y + panelH * 1.08);
    ctx.lineTo(W + 40, y + panelH * 0.92);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 223, 90, ${0.94 * alpha})`;
    ctx.shadowColor = "#ff304f";
    ctx.shadowBlur = 28;
    ctx.font = `900 ${clamp(W * 0.052, 36, 78)}px "Yu Mincho", "Hiragino Mincho ProN", serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("猫神奥義", W - 34 + shake, y + panelH - 24);
    ctx.restore();
  }

  function loop(now) {
    try {
      const delta = now - last;
      last = now;
      frameCarry += delta;
      if (frameCarry >= FRAME_MS) {
        const steps = Math.min(3, Math.floor(frameCarry / FRAME_MS));
        frameCarry -= steps * FRAME_MS;
        const dt = FRAME_MS / 1000;
        updateGamepadInput();
        for (let i = 0; i < steps; i++) update(dt);
        draw();
      }
    } catch (error) {
      console.error("game loop recovered", error);
      frameCarry = 0;
      if (state === "clearing") forceEndingScreen(clearReason);
      else if (state === "ending") endingScreen?.classList.remove("hidden");
    } finally {
      requestAnimationFrame(loop);
    }
  }

  function centerTouchKnob() {
    if (touchKnob) touchKnob.style.transform = "translate(-50%, -50%)";
  }

  function setTouchStickFloating(clientX, clientY) {
    if (!touchStick) return;
    touchStick.classList.add("floating");
    touchStick.style.left = `${clientX}px`;
    touchStick.style.top = `${clientY}px`;
    touchStick.style.right = "auto";
    touchStick.style.bottom = "auto";
  }

  function resetTouchStickPosition() {
    if (!touchStick) return;
    touchStick.classList.remove("floating");
    touchStick.style.left = "";
    touchStick.style.top = "";
    touchStick.style.right = "";
    touchStick.style.bottom = "";
  }

  function updateFloatingTouchStick(event, initial = false) {
    if (state !== "playing") return;
    if (initial) {
      pointer.startX = event.clientX;
      pointer.startY = event.clientY;
      pointer.id = event.pointerId;
      setTouchStickFloating(pointer.startX, pointer.startY);
    }
    const rect = touchStick?.getBoundingClientRect();
    const max = Math.max(34, Math.min(rect?.width || 118, rect?.height || 118) * 0.34);
    const rawX = event.clientX - pointer.startX;
    const rawY = event.clientY - pointer.startY;
    const len = Math.hypot(rawX, rawY);
    const scale = len > max ? max / len : 1;
    const x = rawX * scale;
    const y = rawY * scale;
    pointer.active = len > 8;
    pointer.mode = "stick";
    pointer.dx = len ? rawX / Math.max(max, len) : 0;
    pointer.dy = len ? rawY / Math.max(max, len) : 0;
    if (touchKnob) touchKnob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  }

  function updateTouchStick(event) {
    if (!touchStick || state !== "playing") return;
    const rect = touchStick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = rect.width * 0.34;
    const rawX = event.clientX - cx;
    const rawY = event.clientY - cy;
    const len = Math.hypot(rawX, rawY);
    const scale = len > max ? max / len : 1;
    const x = rawX * scale;
    const y = rawY * scale;
    pointer.active = len > 8;
    pointer.mode = "stick";
    pointer.dx = clamp(rawX / max, -1, 1);
    pointer.dy = clamp(rawY / max, -1, 1);
    if (touchKnob) touchKnob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  }

  function releaseTouchStick() {
    if (pointer.mode !== "stick") return;
    pointer.active = false;
    pointer.mode = "screen";
    pointer.id = null;
    pointer.dx = 0;
    pointer.dy = 0;
    centerTouchKnob();
    resetTouchStickPosition();
  }

  function axisWithDeadzone(value, deadzone = 0.18) {
    const abs = Math.abs(value || 0);
    if (abs < deadzone) return 0;
    return Math.sign(value) * clamp((abs - deadzone) / (1 - deadzone), 0, 1);
  }

  function firstGamepad() {
    if (!navigator.getGamepads) return null;
    return Array.from(navigator.getGamepads()).find(Boolean) || null;
  }

  function isPadPressed(gamepad, index) {
    const button = gamepad && gamepad.buttons[index];
    return !!button && (button.pressed || button.value > 0.5);
  }

  function padPressedOnce(gamepad, index) {
    const pressed = isPadPressed(gamepad, index);
    const wasPressed = !!gamepadPrev.buttons[index];
    gamepadPrev.buttons[index] = pressed;
    return pressed && !wasPressed;
  }

  function currentGamepadButtons() {
    if (state === "title") return [startButton, shopButton, recordsButton, encyclopediaButton, ...Array.from(characterSelect?.querySelectorAll("button") || []), ...Array.from(saveSlots?.querySelectorAll("button") || [])];
    if (state === "shop") return Array.from(shopScreen.querySelectorAll("button"));
    if (state === "records") return [recordsCloseButton];
    if (state === "encyclopedia") return [...Array.from(encyclopediaTabs?.querySelectorAll("button") || []), encyclopediaCloseButton];
    if (state === "gameover") return [restartButton];
    if (state === "ending") return [endingRestartButton];
    if (state === "paused") return [resumeButton, pauseEncyclopediaButton, pauseTitleButton].filter(Boolean);
    if (state === "level") return Array.from(upgradeChoices.querySelectorAll("button"));
    return [];
  }

  function updateGamepadFocus(navY, navX) {
    const buttons = currentGamepadButtons().filter(button => button && !button.disabled && !button.classList.contains("spinning"));
    document.querySelectorAll(".gamepad-focus").forEach(item => item.classList.remove("gamepad-focus"));
    if (!buttons.length) {
      gamepadChoiceIndex = 0;
      return buttons;
    }
    const movedDown = navY > 0 && gamepadPrev.navY <= 0;
    const movedUp = navY < 0 && gamepadPrev.navY >= 0;
    const movedRight = navX > 0 && gamepadPrev.navX <= 0;
    const movedLeft = navX < 0 && gamepadPrev.navX >= 0;
    if (movedDown || movedRight) gamepadChoiceIndex++;
    if (movedUp || movedLeft) gamepadChoiceIndex--;
    gamepadChoiceIndex = (gamepadChoiceIndex + buttons.length) % buttons.length;
    buttons[gamepadChoiceIndex].classList.add("gamepad-focus");
    return buttons;
  }

  function clickFocusedGamepadButton() {
    const buttons = currentGamepadButtons().filter(button => button && !button.disabled && !button.classList.contains("spinning"));
    if (!buttons.length) return false;
    gamepadChoiceIndex = clamp(gamepadChoiceIndex, 0, buttons.length - 1);
    buttons[gamepadChoiceIndex].click();
    return true;
  }

  function updateGamepadInput() {
    const gamepad = firstGamepad();
    if (!gamepad) {
      gamepadInput.mx = 0;
      gamepadInput.my = 0;
      return;
    }

    const lx = axisWithDeadzone(gamepad.axes[0]);
    const ly = axisWithDeadzone(gamepad.axes[1]);
    const dpadX = (isPadPressed(gamepad, 15) ? 1 : 0) - (isPadPressed(gamepad, 14) ? 1 : 0);
    const dpadY = (isPadPressed(gamepad, 13) ? 1 : 0) - (isPadPressed(gamepad, 12) ? 1 : 0);

    gamepadInput.mx = state === "playing" ? lx : 0;
    gamepadInput.my = state === "playing" ? ly : 0;

    const navX = dpadX || (Math.abs(lx) > 0.72 ? Math.sign(lx) : 0);
    const navY = dpadY || (Math.abs(ly) > 0.72 ? Math.sign(ly) : 0);
    updateGamepadFocus(navY, navX);

    if ((padPressedOnce(gamepad, 9) || padPressedOnce(gamepad, 8)) && (state === "playing" || state === "paused" || canOpenStatusFromLevel())) {
      togglePause();
    }
    if (padPressedOnce(gamepad, 0)) clickFocusedGamepadButton();

    gamepadPrev.navX = navX;
    gamepadPrev.navY = navY;
  }

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", event => {
    if (event.code === "KeyP" || event.code === "Escape") {
      if (state === "playing" || state === "paused" || canOpenStatusFromLevel()) {
        event.preventDefault();
        togglePause();
        return;
      }
    }
    keys.add(event.code);
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
  });
  window.addEventListener("keyup", event => keys.delete(event.code));
  canvas.addEventListener("pointerdown", event => {
    if (state !== "playing") return;
    if (event.pointerType === "touch") {
      event.preventDefault();
      canvas.setPointerCapture?.(event.pointerId);
      updateFloatingTouchStick(event, true);
      return;
    }
    pointer.active = true;
    pointer.mode = "screen";
    pointer.id = event.pointerId;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  canvas.addEventListener("pointermove", event => {
    if (pointer.id !== null && event.pointerId !== pointer.id) return;
    if (pointer.mode === "stick") {
      if (event.pointerType === "touch") {
        event.preventDefault();
        updateFloatingTouchStick(event);
      }
      return;
    }
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  window.addEventListener("pointerup", event => {
    if (pointer.id !== null && event.pointerId !== pointer.id) return;
    if (pointer.mode === "stick") releaseTouchStick();
    else {
      pointer.active = false;
      pointer.id = null;
    }
  });
  window.addEventListener("pointercancel", event => {
    if (pointer.id !== null && event.pointerId !== pointer.id) return;
    if (pointer.mode === "stick") releaseTouchStick();
    else {
      pointer.active = false;
      pointer.id = null;
    }
  });
  if (touchStick) {
    touchStick.addEventListener("pointerdown", event => {
      event.preventDefault();
      touchStick.setPointerCapture(event.pointerId);
      pointer.id = event.pointerId;
      updateTouchStick(event);
    });
    touchStick.addEventListener("pointermove", event => {
      if (pointer.id !== null && event.pointerId !== pointer.id) return;
      event.preventDefault();
      updateTouchStick(event);
    });
    touchStick.addEventListener("pointerup", event => {
      if (pointer.id !== null && event.pointerId !== pointer.id) return;
      event.preventDefault();
      releaseTouchStick();
    });
    touchStick.addEventListener("pointercancel", releaseTouchStick);
  }
  startButton.addEventListener("click", startGame);
  shopButton.addEventListener("click", openShop);
  recordsButton.addEventListener("click", openRecords);
  encyclopediaButton.addEventListener("click", openEncyclopedia);
  recordsCloseButton.addEventListener("click", closeRecords);
  encyclopediaCloseButton.addEventListener("click", closeEncyclopedia);
  encyclopediaTabs.addEventListener("click", event => {
    const button = event.target.closest("[data-encyclopedia-tab]");
    if (!button) return;
    gamepadChoiceIndex = 0;
    renderEncyclopedia(button.dataset.encyclopediaTab);
  });
  saveResetButton.addEventListener("click", resetSaveData);
  saveSlots.addEventListener("click", event => {
    const button = event.target.closest("[data-save-slot]");
    if (!button) return;
    switchSaveSlot(button.dataset.saveSlot);
  });
  characterSelect?.addEventListener("click", event => {
    const button = event.target.closest("[data-character-id]");
    if (!button) return;
    selectCharacter(button.dataset.characterId);
  });
  shopCloseButton.addEventListener("click", closeShop);
  shopItems.addEventListener("click", event => {
    const button = event.target.closest("[data-shop-id]");
    if (!button) return;
    buyShopUpgrade(button.dataset.shopId);
  });
  restartButton.addEventListener("click", returnToTitle);
  endingRestartButton.addEventListener("click", showEndingResult);
  pauseButton.addEventListener("click", () => togglePause());
  pauseEncyclopediaButton?.addEventListener("click", openEncyclopedia);
  pauseTitleButton?.addEventListener("click", confirmReturnToTitleFromPause);
  resumeButton.addEventListener("click", () => togglePause(false));

  resize();
  setupTitleStoryScroll();
  resetGame();
  renderShop();
  renderSaveSlots();
  updateTitleMoney();
  requestAnimationFrame(loop);
})();
