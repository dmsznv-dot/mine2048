/**
 * МАЙН2048: Шахтёрский Крафт (MVP для Яндекс Игр)
 * Процедурные 16x16 пиксельные текстуры блоков и руд, стыковка одинаковых блоков,
 * частицы разрушения блоков, WebAudio звуки и адаптивное управление.
 */

const BLOCKS = [
  {
    val: 2,
    tier: 1,
    name: 'Земля',
    fullName: 'Блок земли с травой',
    connColor: '#66bb22',
    particleColors: ['#5ca924', '#866043', '#6b4c35', '#4a8f19'],
    type: 'grass'
  },
  {
    val: 4,
    tier: 2,
    name: 'Камень',
    fullName: 'Булыжник',
    connColor: '#9e9e9e',
    particleColors: ['#8c8c8c', '#6e6e6e', '#a8a8a8', '#525252'],
    type: 'cobble'
  },
  {
    val: 8,
    tier: 3,
    name: 'Уголь',
    fullName: 'Угольная руда',
    connColor: '#494949',
    particleColors: ['#1f1f1f', '#383838', '#7d7d7d', '#111111'],
    type: 'ore',
    orePalette: ['#151515', '#292929', '#3f3f3f', '#0a0a0a'],
    orePattern: 'coal'
  },
  {
    val: 16,
    tier: 4,
    name: 'Медь',
    fullName: 'Медная руда',
    connColor: '#e0734d',
    particleColors: ['#e0734d', '#49b592', '#c15533', '#7d7d7d'],
    type: 'ore',
    orePalette: ['#b84e2c', '#e0734d', '#f59a73', '#49b592'],
    orePattern: 'copper'
  },
  {
    val: 32,
    tier: 5,
    name: 'Железо',
    fullName: 'Железная руда',
    connColor: '#e2c0a4',
    particleColors: ['#d8af93', '#f2d0b6', '#b3896b', '#808080'],
    type: 'ore',
    orePalette: ['#b3896b', '#d8af93', '#f5dcc6', '#8f694f'],
    orePattern: 'iron'
  },
  {
    val: 64,
    tier: 6,
    name: 'Лазурит',
    fullName: 'Лазуритовая руда',
    connColor: '#3b82f6',
    particleColors: ['#1d4ed8', '#3b82f6', '#60a5fa', '#1e3a8a'],
    type: 'ore',
    orePalette: ['#17368a', '#2563eb', '#60a5fa', '#d4af37'],
    orePattern: 'lapis'
  },
  {
    val: 128,
    tier: 7,
    name: 'Редстоун',
    fullName: 'Редстоуновая руда',
    connColor: '#ff3333',
    particleColors: ['#dc2626', '#ff4d4d', '#991b1b', '#fca5a5'],
    type: 'ore',
    orePalette: ['#8c1111', '#dc2626', '#ff4d4d', '#ff9999'],
    orePattern: 'redstone'
  },
  {
    val: 256,
    tier: 8,
    name: 'Золото',
    fullName: 'Золотая руда',
    connColor: '#facc15',
    particleColors: ['#eab308', '#fde047', '#ca8a04', '#fef9c3'],
    type: 'ore',
    orePalette: ['#b57c05', '#eab308', '#fde047', '#ffffff'],
    orePattern: 'gold'
  },
  {
    val: 512,
    tier: 9,
    name: 'Алмаз',
    fullName: 'Алмазная руда',
    connColor: '#38bdf8',
    particleColors: ['#06b6d4', '#67e8f9', '#cffafe', '#0891b2'],
    type: 'ore',
    orePalette: ['#0891b2', '#22d3ee', '#a5f3fc', '#ffffff'],
    orePattern: 'diamond'
  },
  {
    val: 1024,
    tier: 10,
    name: 'Изумруд',
    fullName: 'Изумрудная руда',
    connColor: '#10b981',
    particleColors: ['#059669', '#34d399', '#a7f3d0', '#065f46'],
    type: 'ore',
    orePalette: ['#047857', '#10b981', '#6ee7b7', '#ecfdf5'],
    orePattern: 'emerald'
  },
  {
    val: 2048,
    tier: 11,
    name: 'Незерит',
    fullName: 'Древние обломки (Незерит)',
    connColor: '#b07d62',
    particleColors: ['#654740', '#8e685e', '#3d2824', '#c99e87'],
    type: 'debris'
  },
  {
    val: 4096,
    tier: 12,
    name: 'Обсидиан',
    fullName: 'Плачущий обсидиан',
    connColor: '#c084fc',
    particleColors: ['#1e1035', '#9333ea', '#e879f9', '#3b0764'],
    type: 'obsidian'
  },
  {
    val: 8192,
    tier: 13,
    name: 'Маяк',
    fullName: 'Маяк Звезды Незера',
    connColor: '#67e8f9',
    particleColors: ['#a5f3fc', '#ffffff', '#38bdf8', '#1e1b4b'],
    type: 'beacon'
  }
];

const BLOCK_MAP = new Map(BLOCKS.map(b => [b.val, b]));

// Кэш сгенерированных 16x16 текстур (DataURL / OffscreenCanvas)
const TEXTURE_CACHE = new Map();

function seededRand(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Рисует аутентичную 16x16 пиксельную текстуру блока Майнкрафт
 */
function generateBlockTexture(block) {
  if (TEXTURE_CACHE.has(block.val)) {
    return TEXTURE_CACHE.get(block.val);
  }

  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const ctx = c.getContext('2d');
  const rng = seededRand(block.val * 97 + 31);

  const setPx = (x, y, color) => {
    if (x < 0 || x >= 16 || y < 0 || y >= 16) return;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  };

  if (block.type === 'grass') {
    // 1. Земляная основа
    const dirtColors = ['#866043', '#735137', '#966c4b', '#63452e'];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const col = dirtColors[Math.floor(rng() * dirtColors.length)];
        setPx(x, y, col);
      }
    }
    // Вкрапления камешков в земле
    setPx(3, 10, '#523825'); setPx(11, 12, '#a37b5b'); setPx(7, 14, '#523825');
    // 2. Зелёная шапка травы сверху с характерной "бахромой"
    const grassHeights = [4, 5, 4, 3, 5, 6, 4, 3, 4, 5, 4, 3, 5, 4, 3, 4];
    const grassColors = ['#5ca924', '#4d911c', '#6cc02e', '#448217'];
    for (let x = 0; x < 16; x++) {
      const h = grassHeights[x];
      for (let y = 0; y < h; y++) {
        const gCol = y === 0 ? '#6cc02e' : grassColors[Math.floor(rng() * grassColors.length)];
        setPx(x, y, gCol);
      }
      // Тень под травой
      setPx(x, h, '#523825');
    }
  } else if (block.type === 'cobble') {
    // Булыжник с характерной сеткой камней
    const baseStone = ['#7d7d7d', '#8a8a8a', '#6e6e6e', '#969696'];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        setPx(x, y, baseStone[Math.floor(rng() * baseStone.length)]);
      }
    }
    // Тёмные щели между булыжниками и светлые грани
    const cracks = [
      [0,3],[1,3],[2,4],[3,4],[4,3],[5,2],[6,2],[7,3],[8,4],[9,4],[10,3],[11,2],[12,3],[13,4],[14,4],[15,3],
      [3,0],[3,1],[3,2],[10,0],[10,1],[10,2],
      [0,9],[1,10],[2,10],[3,9],[4,8],[5,8],[6,9],[7,10],[8,10],[9,9],[10,8],[11,8],[12,9],[13,10],[14,9],[15,9],
      [6,4],[6,5],[6,6],[6,7],[12,4],[12,5],[12,6],[12,7],
      [4,10],[4,11],[4,12],[4,13],[4,14],[4,15],[11,10],[11,11],[11,12],[11,13],[11,14],[11,15]
    ];
    cracks.forEach(([x, y]) => {
      setPx(x, y, '#474747');
      if (y + 1 < 16 && rng() > 0.35) setPx(x, y + 1, '#adadad');
    });
  } else if (block.type === 'ore') {
    // Гладкий камень (Stone) как матрица для всех руд (или Deepslate для высоких тиров)
    const isDeep = block.val >= 512;
    const stoneColors = isDeep
      ? ['#56565e', '#4b4b52', '#64646d', '#3f3f46']
      : ['#7d7d7d', '#737373', '#878787', '#686868'];

    // Горизонтальная слоистость камня как в оригинальном Minecraft
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const idx = Math.floor((rng() + (x % 3 === 0 ? 0.1 : 0)) * stoneColors.length) % stoneColors.length;
        setPx(x, y, stoneColors[idx]);
      }
    }

    // Вкрапления руды (Узнаваемые кластеры)
    const [dark, mid, bright, spec] = block.orePalette;

    const drawCluster = (cx, cy, shape) => {
      shape.forEach(([dx, dy, cIdx]) => {
        const col = block.orePalette[cIdx];
        setPx(cx + dx, cy + dy, col);
        // Небольшая тень в камне под вкраплением руды
        if (dy >= 1 && cy + dy + 1 < 16 && rng() > 0.4) {
          setPx(cx + dx, cy + dy + 1, isDeep ? '#2e2e33' : '#525252');
        }
      });
    };

    if (block.orePattern === 'emerald') {
      // Изумруды — характерные вертикальные/октагональные кристаллы
      const gems = [[3, 3], [11, 2], [7, 7], [3, 11], [11, 10]];
      gems.forEach(([gx, gy]) => {
        drawCluster(gx, gy, [
          [0, 0, 3], [1, 0, 2],
          [0, 1, 1], [1, 1, 0],
          [0, 2, 0]
        ]);
      });
    } else if (block.orePattern === 'lapis') {
      // Лазурит — крупные густые синие пятна с золотистой искрой
      const spots = [[2, 3], [9, 2], [5, 7], [11, 8], [3, 11], [9, 12]];
      spots.forEach(([sx, sy]) => {
        drawCluster(sx, sy, [
          [0, 0, 1], [1, 0, 2], [2, 0, 0],
          [0, 1, 0], [1, 1, 3], [2, 1, 1]
        ]);
      });
    } else if (block.orePattern === 'copper') {
      // Медь — полосатые оранжево-бирюзовые прожилки
      const veins = [[2, 2], [9, 3], [4, 7], [10, 8], [3, 12], [9, 12]];
      veins.forEach(([vx, vy]) => {
        drawCluster(vx, vy, [
          [0, 0, 2], [1, 0, 1], [2, 0, 3],
          [1, 1, 0], [2, 1, 1], [3, 1, 3]
        ]);
      });
    } else {
      // Классические гроздья руды (Уголь, Железо, Редстоун, Золото, Алмаз)
      const clusters = [
        [2, 2], [10, 3],
        [6, 6], [11, 8],
        [3, 10], [8, 12]
      ];
      clusters.forEach(([cx, cy], i) => {
        if (i % 2 === 0) {
          drawCluster(cx, cy, [
            [1, 0, 3], [2, 0, 2],
            [0, 1, 2], [1, 1, 1], [2, 1, 0],
            [1, 2, 0]
          ]);
        } else {
          drawCluster(cx, cy, [
            [0, 0, 3], [1, 0, 1],
            [0, 1, 1], [1, 1, 2], [2, 1, 0]
          ]);
        }
      });
    }
  } else if (block.type === 'debris') {
    // Древние обломки (Незерит) — слоистый тёмно-медный панцирь
    const cols = ['#4a322c', '#654740', '#7c5950', '#382420', '#9e776c'];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const wave = Math.sin(y * 0.9 + x * 0.4);
        const idx = wave > 0.5 ? 4 : wave > 0.1 ? 2 : wave > -0.3 ? 1 : 0;
        setPx(x, y, cols[idx]);
      }
    }
  } else if (block.type === 'obsidian') {
    // Плачущий обсидиан
    const obs = ['#140c24', '#1f1238', '#0d0717', '#2b194d'];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        setPx(x, y, obs[Math.floor(rng() * obs.length)]);
      }
    }
    const glow = [[3,2],[3,3],[4,4],[11,3],[11,4],[10,5],[6,7],[6,8],[7,9],[4,11],[4,12],[12,10],[12,11],[11,12]];
    glow.forEach(([x, y], i) => setPx(x, y, i % 2 === 0 ? '#d946ef' : '#9333ea'));
  } else if (block.type === 'beacon') {
    // Маяк со Звездой Незера внутри
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        if (y >= 13) {
          // Обсидиановый постамент
          setPx(x, y, (x + y) % 2 === 0 ? '#1e1333' : '#2f1f4d');
        } else if (x === 0 || x === 15 || y === 0) {
          // Стеклянный купол
          setPx(x, y, '#7dd3fc');
        } else {
          setPx(x, y, '#0c4a6e');
        }
      }
    }
    // Сияющее ядро звезды в центре
    for (let y = 3; y <= 10; y++) {
      for (let x = 4; x <= 11; x++) {
        const dist = Math.abs(x - 7.5) + Math.abs(y - 6.5);
        if (dist < 2.2) setPx(x, y, '#ffffff');
        else if (dist < 4.2) setPx(x, y, '#67e8f9');
        else if (dist < 5.5) setPx(x, y, '#0284c7');
      }
    }
  }

  // Тонкая пиксельная рамка объёма (свет сверху/слева, тень снизу/справа)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fillRect(0, 0, 16, 1);
  ctx.fillRect(0, 1, 1, 15);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(0, 15, 16, 1);
  ctx.fillRect(15, 0, 1, 15);

  TEXTURE_CACHE.set(block.val, c);
  return c;
}

function drawBlockToCanvas(canvas, val) {
  const block = BLOCK_MAP.get(val) || BLOCKS[BLOCKS.length - 1];
  const src = generateBlockTexture(block);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
}

/**
 * WebAudio синтезатор звуков в стиле Майнкрафт (копание, камень, сферы опыта)
 * С поддержкой правил Яндекс Игр (авто-пауза при скрытии вкладки)
 */
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.mutedByVisibility = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  canPlay() {
    return this.enabled && !this.mutedByVisibility;
  }

  playStep() {
    if (!this.canPlay()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(135, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.055);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playMerge(maxVal) {
    if (!this.canPlay()) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const tier = Math.log2(maxVal);

    // 1. Хруст блока (шумовой импульс)
    const bufferSize = this.ctx.sampleRate * 0.07;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400 + tier * 90, now);

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.16, now);
    nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.ctx.destination);
    noise.start(now);

    // 2. Звон сферы опыта (XP Orb chime) для руд
    const osc = this.ctx.createOscillator();
    const oGain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = 520 + tier * 68;
    osc.frequency.setValueAtTime(baseFreq, now + 0.02);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.16);

    oGain.gain.setValueAtTime(0.11, now + 0.02);
    oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(oGain);
    oGain.connect(this.ctx.destination);
    osc.start(now + 0.02);
    osc.stop(now + 0.19);
  }

  playBreak() {
    if (!this.canPlay()) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }
}

/**
 * Система пиксельных частиц (осколки блоков при стыковке и сферы XP)
 */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.raf = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  burstCell(r, c, val, count = 14) {
    const block = BLOCK_MAP.get(val) || BLOCKS[0];
    const cellW = this.canvas.width / 4;
    const cellH = this.canvas.height / 4;
    const cx = (c + 0.5) * cellW;
    const cy = (r + 0.5) * cellH;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.4 + Math.random() * 4.2;
      const isXp = i < 3 && val >= 8;
      this.particles.push({
        x: cx + (Math.random() - 0.5) * 18,
        y: cy + (Math.random() - 0.5) * 18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8,
        size: isXp ? 5 : 5 + Math.floor(Math.random() * 4),
        color: isXp
          ? '#80ff20'
          : block.particleColors[Math.floor(Math.random() * block.particleColors.length)],
        alpha: 1,
        gravity: isXp ? -0.05 : 0.22,
        isXp
      });
    }

    if (!this.raf) this.loop();
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= 0.032;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    this.ctx.globalAlpha = 1;

    if (this.particles.length > 0) {
      this.raf = requestAnimationFrame(() => this.loop());
    } else {
      this.raf = null;
    }
  }
}

/**
 * Основной контроллер игры Майн2048
 */
class Mine2048Game {
  constructor() {
    this.size = 4;
    this.grid = [];
    this.tileElements = new Map();
    this.nextTileId = 1;

    this.score = 0;
    this.bestScore = 0;
    this.xp = 0;
    this.level = 1;
    this.undosLeft = 3;
    this.pickaxesLeft = 2;
    this.history = [];
    this.discovered = new Set([2, 4]);
    this.pickaxeMode = false;
    this.won2048Shown = false;

    this.sfx = new SoundFX();
    this.fx = new ParticleSystem(document.getElementById('fx-layer'));

    this.tileLayer = document.getElementById('tile-layer');
    this.boardFrame = document.getElementById('board-frame');

    this.loadProgress();
    this.initHeaderIcon();
    this.initCompendium();
    this.bindEvents();
    this.startNewGame(false);
  }

  initHeaderIcon() {
    const holder = document.getElementById('header-icon');
    const c = document.createElement('canvas');
    c.width = 16;
    c.height = 16;
    drawBlockToCanvas(c, 512); // Алмазная руда на логотипе
    holder.innerHTML = '';
    holder.appendChild(c);
  }

  initCompendium() {
    const container = document.getElementById('ore-chain');
    container.innerHTML = '';
    BLOCKS.forEach(block => {
      const slot = document.createElement('div');
      slot.className = 'ore-slot locked';
      slot.dataset.val = block.val;
      slot.title = `${block.fullName} (${block.val})`;

      const c = document.createElement('canvas');
      c.width = 16;
      c.height = 16;
      drawBlockToCanvas(c, block.val);

      const num = document.createElement('span');
      num.className = 'ore-slot-num';
      num.textContent = block.val >= 1024 ? `${block.val / 1024}k` : block.val;

      slot.appendChild(c);
      slot.appendChild(num);
      container.appendChild(slot);
    });
  }

  loadProgress() {
    try {
      const savedBest = localStorage.getItem('mine2048_best');
      if (savedBest) this.bestScore = parseInt(savedBest, 10) || 0;
      const savedDisc = localStorage.getItem('mine2048_discovered');
      if (savedDisc) {
        JSON.parse(savedDisc).forEach(v => this.discovered.add(v));
      }
    } catch (e) {
      // Игнорируем ограничения куки в приватных вкладках
    }
  }

  saveProgress() {
    try {
      localStorage.setItem('mine2048_best', String(this.bestScore));
      localStorage.setItem('mine2048_discovered', JSON.stringify([...this.discovered]));
    } catch (e) {}
  }

  startNewGame(resetTools = true) {
    this.tileLayer.innerHTML = '';
    this.tileElements.clear();
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
    this.score = 0;
    this.history = [];
    this.pickaxeMode = false;
    this.won2048Shown = false;
    if (resetTools) {
      this.undosLeft = 3;
      this.pickaxesLeft = 2;
      this.xp = 0;
      this.level = 1;
    }

    document.getElementById('modal-overlay').classList.add('hidden');
    this.setPickaxeMode(false);

    this.spawnRandomTile();
    this.spawnRandomTile();
    this.renderBoard();
    this.updateHUD();
  }

  cloneGridState() {
    return {
      score: this.score,
      xp: this.xp,
      level: this.level,
      cells: this.grid.map(row => row.map(cell => (cell ? { val: cell.val } : null)))
    };
  }

  spawnRandomTile() {
    const empty = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return false;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    // 88% Земля (2), 12% Камень (4)
    const val = Math.random() < 0.88 ? 2 : 4;
    this.grid[r][c] = {
      id: this.nextTileId++,
      val,
      r,
      c,
      isNew: true,
      merged: false
    };
    this.discovered.add(val);
    return true;
  }

  /**
   * Движение и стыковка одинаковых блоков:
   * Земля + Земля -> Камень, Камень + Камень -> Угольная руда и т.д.
   */
  move(dir) {
    if (this.pickaxeMode) return;

    const vectors = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1]
    };
    const [dr, dc] = vectors[dir];

    const snapshot = this.cloneGridState();
    let moved = false;
    let gainedScore = 0;
    let maxMergedVal = 0;
    const mergedPositions = [];

    // Очищаем флаги анимации
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c]) {
          this.grid[r][c].isNew = false;
          this.grid[r][c].merged = false;
        }
      }
    }

    const rows = [0, 1, 2, 3];
    const cols = [0, 1, 2, 3];
    if (dr === 1) rows.reverse();
    if (dc === 1) cols.reverse();

    const toRemoveIds = [];

    for (const r of rows) {
      for (const c of cols) {
        const tile = this.grid[r][c];
        if (!tile) continue;

        let nr = r;
        let nc = c;

        while (true) {
          const tr = nr + dr;
          const tc = nc + dc;
          if (tr < 0 || tr >= this.size || tc < 0 || tc >= this.size) break;

          const target = this.grid[tr][tc];
          if (!target) {
            nr = tr;
            nc = tc;
          } else if (target.val === tile.val && !target.merged) {
            // Стыковка двух одинаковых блоков!
            nr = tr;
            nc = tc;
            break;
          } else {
            break;
          }
        }

        if (nr !== r || nc !== c) {
          moved = true;
          const target = this.grid[nr][nc];
          this.grid[r][c] = null;

          if (target && target.val === tile.val) {
            const newVal = tile.val * 2;
            toRemoveIds.push(target.id);
            tile.r = nr;
            tile.c = nc;
            tile.val = newVal;
            tile.merged = true;
            this.grid[nr][nc] = tile;

            gainedScore += newVal;
            maxMergedVal = Math.max(maxMergedVal, newVal);
            this.discovered.add(newVal);
            mergedPositions.push({ r: nr, c: nc, val: newVal });
          } else {
            tile.r = nr;
            tile.c = nc;
            this.grid[nr][nc] = tile;
          }
        }
      }
    }

    if (!moved) return;

    // Сохраняем в историю для отмены хода
    this.history.push(snapshot);
    if (this.history.length > 5) this.history.shift();

    // Удаляем поглощённые при слиянии DOM-элементы
    toRemoveIds.forEach(id => {
      const el = this.tileElements.get(id);
      if (el) {
        el.remove();
        this.tileElements.delete(id);
      }
    });

    if (gainedScore > 0) {
      this.score += gainedScore;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
      }
      this.addXP(Math.ceil(Math.log2(maxMergedVal) * 4));
      this.sfx.playMerge(maxMergedVal);
      mergedPositions.forEach(m => this.fx.burstCell(m.r, m.c, m.val, 14));
    } else {
      this.sfx.playStep();
    }

    this.spawnRandomTile();
    this.saveProgress();
    this.renderBoard();
    this.updateHUD();

    // Проверка победы (открыт Незерит 2048 впервые за партию)
    if (maxMergedVal >= 2048 && !this.won2048Shown) {
      this.won2048Shown = true;
      setTimeout(() => this.showModal(true), 320);
      return;
    }

    if (!this.hasAvailableMoves()) {
      setTimeout(() => this.showModal(false), 360);
    }
  }

  addXP(amount) {
    this.xp += amount;
    const needed = this.level * 45;
    if (this.xp >= needed) {
      this.xp -= needed;
      this.level++;
      // Награда за новый уровень шахтёра: +1 кирка или +1 отмена хода
      if (this.level % 2 === 0) {
        this.pickaxesLeft++;
      } else {
        this.undosLeft++;
      }
    }
  }

  undoMove() {
    if (this.undosLeft <= 0 || this.history.length === 0) return;
    const prev = this.history.pop();
    this.undosLeft--;
    this.score = prev.score;
    this.xp = prev.xp;
    this.level = prev.level;

    this.tileLayer.innerHTML = '';
    this.tileElements.clear();

    this.grid = prev.cells.map((row, r) =>
      row.map((cell, c) =>
        cell
          ? {
              id: this.nextTileId++,
              val: cell.val,
              r,
              c,
              isNew: false,
              merged: false
            }
          : null
      )
    );

    this.sfx.playStep();
    this.renderBoard();
    this.updateHUD();
  }

  setPickaxeMode(active) {
    if (active && this.pickaxesLeft <= 0) return;
    this.pickaxeMode = active;
    this.boardFrame.classList.toggle('pickaxe-mode', active);
    document.getElementById('btn-pickaxe').classList.toggle('active-tool', active);
    document.getElementById('pickaxe-hint').classList.toggle('hidden', !active);
  }

  usePickaxeOnTile(r, c) {
    if (!this.pickaxeMode || this.pickaxesLeft <= 0) return;
    const tile = this.grid[r][c];
    if (!tile) return;

    // Подсчёт оставшихся плиток (нельзя разбить единственный последний блок)
    let totalTiles = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j]) totalTiles++;
      }
    }

    this.history.push(this.cloneGridState());
    this.pickaxesLeft--;
    this.fx.burstCell(r, c, tile.val, 20);
    this.sfx.playBreak();

    const el = this.tileElements.get(tile.id);
    if (el) {
      el.remove();
      this.tileElements.delete(tile.id);
    }
    this.grid[r][c] = null;

    if (totalTiles <= 1) {
      this.spawnRandomTile();
    }

    this.setPickaxeMode(false);
    this.renderBoard();
    this.updateHUD();
  }

  hasAvailableMoves() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cur = this.grid[r][c];
        if (!cur) return true;
        if (r + 1 < this.size && this.grid[r + 1][c] && this.grid[r + 1][c].val === cur.val) {
          return true;
        }
        if (c + 1 < this.size && this.grid[r][c + 1] && this.grid[r][c + 1].val === cur.val) {
          return true;
        }
      }
    }
    return false;
  }

  getHighestBlockOnBoard() {
    let maxVal = 2;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] && this.grid[r][c].val > maxVal) {
          maxVal = this.grid[r][c].val;
        }
      }
    }
    return maxVal;
  }

  /**
   * Отрисовка плиток и визуальных стыковок (перемычек) между соседними одинаковыми блоками
   */
  renderBoard() {
    const activeIds = new Set();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const tile = this.grid[r][c];
        if (!tile) continue;
        activeIds.add(tile.id);

        const blockInfo = BLOCK_MAP.get(tile.val) || BLOCKS[BLOCKS.length - 1];
        let el = this.tileElements.get(tile.id);

        if (!el) {
          el = document.createElement('div');
          el.className = 'tile';
          el.innerHTML = `
            <div class="tile-inner">
              <canvas class="tile-canvas" width="16" height="16"></canvas>
              <div class="tile-top-row">
                <span class="tile-num"></span>
                <span class="tile-tier"></span>
              </div>
              <div class="tile-name"></div>
              <div class="tile-connector conn-right"></div>
              <div class="tile-connector conn-bottom"></div>
            </div>
          `;
          el.addEventListener('click', () => {
            if (this.pickaxeMode) {
              this.usePickaxeOnTile(tile.r, tile.c);
            }
          });
          this.tileLayer.appendChild(el);
          this.tileElements.set(tile.id, el);
        }

        // Обновляем координаты с учётом gap
        const posExprX = `calc(${tile.c} * (100% + var(--grid-gap)))`;
        const posExprY = `calc(${tile.r} * (100% + var(--grid-gap)))`;
        el.style.setProperty('--tx', posExprX);
        el.style.setProperty('--ty', posExprY);
        el.style.setProperty('--conn-color', blockInfo.connColor);

        // Проверяем, стоит ли справа или снизу такой же блок (визуальная стыковка!)
        const sameRight =
          c + 1 < this.size &&
          this.grid[r][c + 1] &&
          this.grid[r][c + 1].val === tile.val;
        const sameBottom =
          r + 1 < this.size &&
          this.grid[r + 1][c] &&
          this.grid[r + 1][c].val === tile.val;

        el.dataset.connRight = sameRight ? '1' : '0';
        el.dataset.connBottom = sameBottom ? '1' : '0';

        // Если значение изменилось или плитка только создана — перерисовываем текстуру
        if (el.dataset.val !== String(tile.val)) {
          el.dataset.val = String(tile.val);
          const canvas = el.querySelector('.tile-canvas');
          drawBlockToCanvas(canvas, tile.val);
          el.querySelector('.tile-num').textContent = tile.val;
          el.querySelector('.tile-tier').textContent = `T${blockInfo.tier}`;
          el.querySelector('.tile-name').textContent = blockInfo.name;
        }

        el.classList.remove('tile-new', 'tile-merged');
        if (tile.isNew) {
          void el.offsetWidth;
          el.classList.add('tile-new');
        } else if (tile.merged) {
          void el.offsetWidth;
          el.classList.add('tile-merged');
        }
      }
    }

    // Очистка старых элементов
    for (const [id, el] of this.tileElements.entries()) {
      if (!activeIds.has(id)) {
        el.remove();
        this.tileElements.delete(id);
      }
    }
  }

  updateHUD() {
    document.getElementById('score-val').textContent = this.score;
    document.getElementById('best-val').textContent = this.bestScore;

    // XP прогресс
    const needed = this.level * 45;
    const pct = Math.min(100, Math.round((this.xp / needed) * 100));
    document.getElementById('xp-bar-fill').style.width = `${pct}%`;
    document.getElementById('xp-level').textContent = `УР. ${this.level}`;

    // Кнопки инструментов
    const btnUndo = document.getElementById('btn-undo');
    document.getElementById('undo-count').textContent = this.undosLeft;
    btnUndo.disabled = this.undosLeft <= 0 || this.history.length === 0;

    const btnPickaxe = document.getElementById('btn-pickaxe');
    document.getElementById('pickaxe-count').textContent = this.pickaxesLeft;
    btnPickaxe.disabled = this.pickaxesLeft <= 0;

    // Следующая цель открытия
    const maxDiscovered = Math.max(...this.discovered);
    const nextBlock =
      BLOCKS.find(b => b.val > maxDiscovered) || BLOCKS[BLOCKS.length - 1];
    drawBlockToCanvas(document.getElementById('target-canvas'), nextBlock.val);
    document.getElementById('target-name').textContent = `${nextBlock.fullName} (${nextBlock.val})`;

    // Нижняя шкала открытых руд
    const maxBoardVal = this.getHighestBlockOnBoard();
    document.getElementById('discovered-count').textContent = `Открыто: ${Math.min(
      this.discovered.size,
      BLOCKS.length
    )} / ${BLOCKS.length}`;

    document.querySelectorAll('.ore-slot').forEach(slot => {
      const v = parseInt(slot.dataset.val, 10);
      const isDisc = this.discovered.has(v);
      slot.classList.toggle('locked', !isDisc);
      slot.classList.toggle('discovered', isDisc);
      slot.classList.toggle('current-best', v === maxBoardVal);
    });
  }

  showModal(isVictory) {
    const overlay = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    const btnContinue = document.getElementById('btn-modal-continue');

    const bestBoardVal = this.getHighestBlockOnBoard();
    const block = BLOCK_MAP.get(bestBoardVal) || BLOCKS[0];

    drawBlockToCanvas(document.getElementById('modal-block-canvas'), block.val);
    document.getElementById('modal-block-name').textContent = `${block.fullName} (${block.val})`;

    if (isVictory) {
      title.textContent = 'НЕЗЕРИТ ДОБЫТ! (2048)';
      subtitle.textContent =
        'Вы раскопали Древние Обломки! Продолжайте спускаться глубже за Плачущим Обсидианом и Маяком!';
      btnContinue.classList.remove('hidden');
    } else {
      title.textContent = 'ШАХТА ЗАВАЛЕНА!';
      subtitle.textContent =
        'Свободных клеток и доступных стыковок больше нет. Попробуем новую выработку?';
      btnContinue.classList.add('hidden');
    }

    overlay.classList.remove('hidden');
  }

  bindEvents() {
    // Клавиатура (Стрелки и WASD / ЦФЫВ)
    window.addEventListener('keydown', e => {
      if (!document.getElementById('modal-overlay').classList.contains('hidden')) return;

      const keyMap = {
        ArrowUp: 'up',
        KeyW: 'up',
        ArrowDown: 'down',
        KeyS: 'down',
        ArrowLeft: 'left',
        KeyA: 'left',
        ArrowRight: 'right',
        KeyD: 'right'
      };
      const dir = keyMap[e.code] || keyMap[e.key];
      if (dir) {
        e.preventDefault();
        this.move(dir);
      } else if (e.code === 'Escape' && this.pickaxeMode) {
        this.setPickaxeMode(false);
      }
    });

    // Свайпы пальцем или мышью по полю
    let startX = 0;
    let startY = 0;
    let tracking = false;

    this.boardFrame.addEventListener(
      'pointerdown',
      e => {
        if (this.pickaxeMode) return;
        startX = e.clientX;
        startY = e.clientY;
        tracking = true;
      },
      { passive: true }
    );

    window.addEventListener(
      'pointerup',
      e => {
        if (!tracking) return;
        tracking = false;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        if (Math.max(absX, absY) < 24) return;

        if (absX > absY) {
          this.move(dx > 0 ? 'right' : 'left');
        } else {
          this.move(dy > 0 ? 'down' : 'up');
        }
      },
      { passive: true }
    );

    // Предотвращение системного скролла страницы при свайпах (требование Яндекс Игр п. 4.4 / мобильные вебвью)
    this.boardFrame.addEventListener(
      'touchmove',
      e => {
        e.preventDefault();
      },
      { passive: false }
    );

    // Кнопки интерфейса
    document.getElementById('btn-new').addEventListener('click', () => {
      this.startNewGame(true);
    });

    document.getElementById('btn-undo').addEventListener('click', () => {
      this.undoMove();
    });

    document.getElementById('btn-pickaxe').addEventListener('click', () => {
      this.setPickaxeMode(!this.pickaxeMode);
    });

    document.getElementById('btn-cancel-pickaxe').addEventListener('click', () => {
      this.setPickaxeMode(false);
    });

    const btnSound = document.getElementById('btn-sound');
    btnSound.addEventListener('click', () => {
      this.sfx.enabled = !this.sfx.enabled;
      btnSound.textContent = this.sfx.enabled ? '🔊' : '🔇';
    });

    document.getElementById('btn-modal-action').addEventListener('click', () => {
      this.startNewGame(true);
    });

    document.getElementById('btn-modal-continue').addEventListener('click', () => {
      document.getElementById('modal-overlay').classList.add('hidden');
    });

    // Авто-приглушение звука при сворачивании вкладки (требование Яндекс Игр)
    document.addEventListener('visibilitychange', () => {
      this.sfx.mutedByVisibility = document.hidden;
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new Mine2048Game();
});
