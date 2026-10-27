/**
 * МАЙН2048 v2.0: Шахтёрский Рогалик (Balatro × Minecraft) + Бесконечная Аркада
 */

const BLOCKS = [
  { val: 2, tier: 1, name: 'Земля', fullName: 'Блок земли с травой', connColor: '#66bb22', particleColors: ['#5ca924', '#866043', '#6b4c35', '#4a8f19'], type: 'grass' },
  { val: 4, tier: 2, name: 'Камень', fullName: 'Булыжник', connColor: '#9e9e9e', particleColors: ['#8c8c8c', '#6e6e6e', '#a8a8a8', '#525252'], type: 'cobble' },
  { val: 8, tier: 3, name: 'Уголь', fullName: 'Угольная руда', connColor: '#494949', particleColors: ['#1f1f1f', '#383838', '#7d7d7d', '#111111'], type: 'ore', orePalette: ['#151515', '#292929', '#3f3f3f', '#0a0a0a'], orePattern: 'coal' },
  { val: 16, tier: 4, name: 'Медь', fullName: 'Медная руда', connColor: '#e0734d', particleColors: ['#e0734d', '#49b592', '#c15533', '#7d7d7d'], type: 'ore', orePalette: ['#b84e2c', '#e0734d', '#f59a73', '#49b592'], orePattern: 'copper' },
  { val: 32, tier: 5, name: 'Железо', fullName: 'Железная руда', connColor: '#e2c0a4', particleColors: ['#d8af93', '#f2d0b6', '#b3896b', '#808080'], type: 'ore', orePalette: ['#b3896b', '#d8af93', '#f5dcc6', '#8f694f'], orePattern: 'iron' },
  { val: 64, tier: 6, name: 'Лазурит', fullName: 'Лазуритовая руда', connColor: '#3b82f6', particleColors: ['#1d4ed8', '#3b82f6', '#60a5fa', '#1e3a8a'], type: 'ore', orePalette: ['#17368a', '#2563eb', '#60a5fa', '#d4af37'], orePattern: 'lapis' },
  { val: 128, tier: 7, name: 'Редстоун', fullName: 'Редстоуновая руда', connColor: '#ff3333', particleColors: ['#dc2626', '#ff4d4d', '#991b1b', '#fca5a5'], type: 'ore', orePalette: ['#8c1111', '#dc2626', '#ff4d4d', '#ff9999'], orePattern: 'redstone' },
  { val: 256, tier: 8, name: 'Золото', fullName: 'Золотая руда', connColor: '#facc15', particleColors: ['#eab308', '#fde047', '#ca8a04', '#fef9c3'], type: 'ore', orePalette: ['#b57c05', '#eab308', '#fde047', '#ffffff'], orePattern: 'gold' },
  { val: 512, tier: 9, name: 'Алмаз', fullName: 'Алмазная руда', connColor: '#38bdf8', particleColors: ['#06b6d4', '#67e8f9', '#cffafe', '#0891b2'], type: 'ore', orePalette: ['#0891b2', '#22d3ee', '#a5f3fc', '#ffffff'], orePattern: 'diamond' },
  { val: 1024, tier: 10, name: 'Изумруд', fullName: 'Изумрудная руда', connColor: '#10b981', particleColors: ['#059669', '#34d399', '#a7f3d0', '#065f46'], type: 'ore', orePalette: ['#047857', '#10b981', '#6ee7b7', '#ecfdf5'], orePattern: 'emerald' },
  { val: 2048, tier: 11, name: 'Незерит', fullName: 'Древние обломки (Незерит)', connColor: '#b07d62', particleColors: ['#654740', '#8e685e', '#3d2824', '#c99e87'], type: 'debris' },
  { val: 4096, tier: 12, name: 'Обсидиан', fullName: 'Плачущий обсидиан', connColor: '#c084fc', particleColors: ['#1e1035', '#9333ea', '#e879f9', '#3b0764'], type: 'obsidian' },
  { val: 8192, tier: 13, name: 'Маяк', fullName: 'Маяк Звезды Незера', connColor: '#67e8f9', particleColors: ['#a5f3fc', '#ffffff', '#38bdf8', '#1e1b4b'], type: 'beacon' }
];

const BLOCK_MAP = new Map(BLOCKS.map(b => [b.val, b]));

/**
 * Бестиарий Сюжетного Режима (10 этапов кампании + Бесконечная Бездна Анте+)
 */
const CAMPAIGN_ENEMIES = [
  {
    stage: 1,
    id: 'chicken',
    name: '🐔 Курица',
    moves: 14,
    isBoss: false,
    questType: 'block',
    targetBlock: 8,
    desc: 'Держи на поле блок Угля (8) или выше'
  },
  {
    stage: 2,
    id: 'zombie',
    name: '🧟 Зомби',
    moves: 16,
    isBoss: false,
    questType: 'block_and_score',
    targetBlock: 16,
    targetScore: 70,
    desc: 'Держи Медь (16+) и набери 70 очк. в бою'
  },
  {
    stage: 3,
    id: 'spider',
    name: '🕷 Пещерный Паук',
    moves: 18,
    isBoss: true,
    abilityText: 'БОСС: требует простор (>50% пустых клеток)',
    questType: 'empty_and_score',
    minEmpty: 8,
    targetScore: 120,
    desc: 'Набери 120 очк. при ≥8 пустых клетках на поле!'
  },
  {
    stage: 4,
    id: 'skeleton',
    name: '💀 Скелет',
    moves: 17,
    isBoss: false,
    questType: 'merges_and_block',
    targetMerges: 4,
    targetBlock: 32,
    desc: 'Сделай 4 слияния в бою и держи Железо (32+)'
  },
  {
    stage: 5,
    id: 'slime',
    name: '🟢 Слайм',
    moves: 18,
    isBoss: false,
    questType: 'empty_and_score',
    minEmpty: 8,
    targetScore: 220,
    desc: 'Набери 220 очк. и освободи ≥8 пустых клеток!'
  },
  {
    stage: 6,
    id: 'creeper',
    name: '💥 Крипер-Босс',
    moves: 20,
    isBoss: true,
    ability: 'spawn_cobble',
    abilityFreq: 4,
    abilityText: 'БОСС: каждые 4 хода кидает Камень (4)',
    questType: 'block_and_score',
    targetBlock: 64,
    targetScore: 360,
    desc: 'Держи Лазурит (64+) и набери 360 очк. в бою'
  },
  {
    stage: 7,
    id: 'witch',
    name: '🔮 Ведьма',
    moves: 20,
    isBoss: false,
    questType: 'merges_and_block',
    targetMerges: 5,
    targetBlock: 128,
    desc: 'Сделай 5 слияний и держи Редстоун (128+)'
  },
  {
    stage: 8,
    id: 'blaze',
    name: '🔥 Ифрит Незера',
    moves: 22,
    isBoss: false,
    questType: 'block_and_score',
    targetBlock: 256,
    targetScore: 650,
    desc: 'Держи Золото (256+) и набери 650 очк. в бою'
  },
  {
    stage: 9,
    id: 'enderman',
    name: '🟣 Эндермен-Босс',
    moves: 24,
    isBoss: true,
    ability: 'swap_tiles',
    abilityFreq: 3,
    abilityText: 'БОСС: каждые 3 хода меняет блоки местами!',
    questType: 'empty_and_score',
    minEmpty: 6,
    targetScore: 1000,
    desc: 'Набери 1000 очк. при ≥6 пустых клетках на поле!'
  },
  {
    stage: 10,
    id: 'dragon',
    name: '🐉 Дракон Края',
    moves: 26,
    isBoss: true,
    ability: 'dragon_chaos',
    abilityFreq: 4,
    abilityText: 'ФИНАЛ: телепортирует блоки и спавнит породу!',
    questType: 'block_and_score',
    targetBlock: 512,
    targetScore: 1800,
    desc: 'Держи Алмаз (512+) и набери 1800 очк. в бою!'
  }
];

/**
 * Сквозные одноразовые предметы (сохраняются между забегами!)
 */
const CONSUMABLE_ITEMS = [
  {
    id: 'pearl',
    icon: '🟣',
    name: 'Жемчуг',
    fullName: 'Жемчуг Эндера',
    desc: 'Мгновенно скипнуть текущего врага и забрать награду'
  },
  {
    id: 'tnt',
    icon: '🧨',
    name: 'Динамит',
    fullName: 'Шашка ТНТ',
    desc: 'Взорвать всю мелкую породу (Земля 2 и Камень 4), освободив место'
  },
  {
    id: 'potion_double',
    icon: '🧪',
    name: '×2 Стак',
    fullName: 'Зелье Двойного Стака',
    desc: 'Следующие 3 слияния прыгают сразу через тир (×4 вместо ×2)!'
  },
  {
    id: 'anvil',
    icon: '🔨',
    name: 'Кузница',
    fullName: 'Алмазная Наковальня',
    desc: 'Кликни по любому блоку на поле, чтобы мгновенно удвоить его (×2)!'
  },
  {
    id: 'gapple',
    icon: '🍎',
    name: '+8 Ходов',
    fullName: 'Золотое Яблоко',
    desc: 'Добавляет +8 дополнительных ходов на текущего врага'
  },
  {
    id: 'totem',
    icon: '🛡',
    name: 'Тотем',
    fullName: 'Тотем Бессмертия (Авто)',
    desc: 'Автоматически спасает при поражении: чистит поле и даёт +8 ходов'
  }
];

/**
 * Пассивные Чары / Джокеры Забега (в духе Balatro)
 */
const JOKERS_POOL = [
  {
    id: 'void_echo',
    name: '🌌 Эхо Пустоты',
    desc: '×1.8 к очкам (Mult), когда на поле свободно ≥7 клеток'
  },
  {
    id: 'diamond_greed',
    name: '💎 Алмазный Азарт',
    desc: '+0.4× к множителю за каждый блок руды ≥64 на поле'
  },
  {
    id: 'geologist',
    name: '⛏ Мастер-Геолог',
    desc: 'Вместо Земли (2) на поле всегда спавнится сразу Камень (4) или Уголь (8)'
  },
  {
    id: 'hourglass',
    name: '⏳ Песочные Часы',
    desc: 'Каждый новый враг даёт +4 дополнительных хода и ×1.3 Mult'
  },
  {
    id: 'chain_combo',
    name: '⚡ Цепная Реакция',
    desc: 'Двойное слияние за 1 свайп возвращает +1 ход и даёт ×1.6 Mult'
  },
  {
    id: 'looter',
    name: '🎁 Удачливый Мародёр',
    desc: '100% шанс выпадения предмета в Сундук с каждого моба + ×1.4 Mult'
  }
];

const TEXTURE_CACHE = new Map();
const MOB_TEXTURE_CACHE = new Map();

function seededRand(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * 16x16 процедурные текстуры блоков и руд
 */
function generateBlockTexture(block) {
  if (TEXTURE_CACHE.has(block.val)) return TEXTURE_CACHE.get(block.val);

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
    const dirtColors = ['#866043', '#735137', '#966c4b', '#63452e'];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++)
        setPx(x, y, dirtColors[Math.floor(rng() * dirtColors.length)]);
    setPx(3, 10, '#523825'); setPx(11, 12, '#a37b5b'); setPx(7, 14, '#523825');
    const grassHeights = [4, 5, 4, 3, 5, 6, 4, 3, 4, 5, 4, 3, 5, 4, 3, 4];
    const grassColors = ['#5ca924', '#4d911c', '#6cc02e', '#448217'];
    for (let x = 0; x < 16; x++) {
      const h = grassHeights[x];
      for (let y = 0; y < h; y++)
        setPx(x, y, y === 0 ? '#6cc02e' : grassColors[Math.floor(rng() * grassColors.length)]);
      setPx(x, h, '#523825');
    }
  } else if (block.type === 'cobble') {
    const baseStone = ['#7d7d7d', '#8a8a8a', '#6e6e6e', '#969696'];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++)
        setPx(x, y, baseStone[Math.floor(rng() * baseStone.length)]);
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
    const isDeep = block.val >= 512;
    const stoneColors = isDeep
      ? ['#56565e', '#4b4b52', '#64646d', '#3f3f46']
      : ['#7d7d7d', '#737373', '#878787', '#686868'];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const idx = Math.floor((rng() + (x % 3 === 0 ? 0.1 : 0)) * stoneColors.length) % stoneColors.length;
        setPx(x, y, stoneColors[idx]);
      }
    }
    const drawCluster = (cx, cy, shape) => {
      shape.forEach(([dx, dy, cIdx]) => {
        setPx(cx + dx, cy + dy, block.orePalette[cIdx]);
        if (dy >= 1 && cy + dy + 1 < 16 && rng() > 0.4) {
          setPx(cx + dx, cy + dy + 1, isDeep ? '#2e2e33' : '#525252');
        }
      });
    };
    if (block.orePattern === 'emerald') {
      [[3, 3], [11, 2], [7, 7], [3, 11], [11, 10]].forEach(([gx, gy]) =>
        drawCluster(gx, gy, [[0, 0, 3], [1, 0, 2], [0, 1, 1], [1, 1, 0], [0, 2, 0]])
      );
    } else if (block.orePattern === 'lapis') {
      [[2, 3], [9, 2], [5, 7], [11, 8], [3, 11], [9, 12]].forEach(([sx, sy]) =>
        drawCluster(sx, sy, [[0, 0, 1], [1, 0, 2], [2, 0, 0], [0, 1, 0], [1, 1, 3], [2, 1, 1]])
      );
    } else if (block.orePattern === 'copper') {
      [[2, 2], [9, 3], [4, 7], [10, 8], [3, 12], [9, 12]].forEach(([vx, vy]) =>
        drawCluster(vx, vy, [[0, 0, 2], [1, 0, 1], [2, 0, 3], [1, 1, 0], [2, 1, 1], [3, 1, 3]])
      );
    } else {
      [[2, 2], [10, 3], [6, 6], [11, 8], [3, 10], [8, 12]].forEach(([cx, cy], i) => {
        if (i % 2 === 0) {
          drawCluster(cx, cy, [[1, 0, 3], [2, 0, 2], [0, 1, 2], [1, 1, 1], [2, 1, 0], [1, 2, 0]]);
        } else {
          drawCluster(cx, cy, [[0, 0, 3], [1, 0, 1], [0, 1, 1], [1, 1, 2], [2, 1, 0]]);
        }
      });
    }
  } else if (block.type === 'debris') {
    const cols = ['#4a322c', '#654740', '#7c5950', '#382420', '#9e776c'];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const wave = Math.sin(y * 0.9 + x * 0.4);
        setPx(x, y, cols[wave > 0.5 ? 4 : wave > 0.1 ? 2 : wave > -0.3 ? 1 : 0]);
      }
  } else if (block.type === 'obsidian') {
    const obs = ['#140c24', '#1f1238', '#0d0717', '#2b194d'];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) setPx(x, y, obs[Math.floor(rng() * obs.length)]);
    [[3,2],[3,3],[4,4],[11,3],[11,4],[10,5],[6,7],[6,8],[7,9],[4,11],[4,12],[12,10],[12,11],[11,12]].forEach(([x, y], i) =>
      setPx(x, y, i % 2 === 0 ? '#d946ef' : '#9333ea')
    );
  } else if (block.type === 'beacon') {
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        if (y >= 13) setPx(x, y, (x + y) % 2 === 0 ? '#1e1333' : '#2f1f4d');
        else if (x === 0 || x === 15 || y === 0) setPx(x, y, '#7dd3fc');
        else setPx(x, y, '#0c4a6e');
      }
    for (let y = 3; y <= 10; y++)
      for (let x = 4; x <= 11; x++) {
        const dist = Math.abs(x - 7.5) + Math.abs(y - 6.5);
        if (dist < 2.2) setPx(x, y, '#ffffff');
        else if (dist < 4.2) setPx(x, y, '#67e8f9');
        else if (dist < 5.5) setPx(x, y, '#0284c7');
      }
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fillRect(0, 0, 16, 1);
  ctx.fillRect(0, 1, 1, 15);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(0, 15, 16, 1);
  ctx.fillRect(15, 0, 1, 15);

  TEXTURE_CACHE.set(block.val, c);
  return c;
}

/**
 * 16x16 процедурные портреты мобов Майнкрафт
 */
function generateMobTexture(mobId) {
  if (MOB_TEXTURE_CACHE.has(mobId)) return MOB_TEXTURE_CACHE.get(mobId);
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const ctx = c.getContext('2d');
  const fill = (x, y, w, h, col) => {
    ctx.fillStyle = col;
    ctx.fillRect(x, y, w, h);
  };

  if (mobId === 'chicken') {
    fill(0, 0, 16, 16, '#f5f5f5');
    fill(2, 6, 2, 2, '#111');
    fill(12, 6, 2, 2, '#111');
    fill(5, 8, 6, 3, '#eab308'); // клюв
    fill(6, 11, 4, 3, '#ef4444'); // бородка
  } else if (mobId === 'zombie') {
    fill(0, 0, 16, 16, '#4d7c42');
    fill(0, 0, 16, 3, '#36582e');
    fill(2, 7, 3, 2, '#111');
    fill(11, 7, 3, 2, '#111');
    fill(6, 11, 4, 2, '#284522');
  } else if (mobId === 'spider') {
    fill(0, 0, 16, 16, '#262329');
    fill(1, 5, 2, 2, '#ef4444');
    fill(4, 6, 2, 3, '#dc2626');
    fill(10, 6, 2, 3, '#dc2626');
    fill(13, 5, 2, 2, '#ef4444');
    fill(5, 11, 2, 3, '#524b59');
    fill(9, 11, 2, 3, '#524b59');
  } else if (mobId === 'skeleton') {
    fill(0, 0, 16, 16, '#d4d4d8');
    fill(2, 6, 4, 3, '#27272a');
    fill(10, 6, 4, 3, '#27272a');
    fill(7, 9, 2, 2, '#3f3f46');
    fill(3, 12, 10, 2, '#27272a');
  } else if (mobId === 'slime') {
    fill(0, 0, 16, 16, '#4ade80');
    fill(2, 2, 12, 12, '#22c55e');
    fill(3, 5, 3, 3, '#14532d');
    fill(10, 5, 3, 3, '#14532d');
    fill(6, 10, 3, 2, '#14532d');
  } else if (mobId === 'creeper') {
    fill(0, 0, 16, 16, '#48b531');
    fill(2, 2, 4, 4, '#65d64c');
    fill(3, 4, 3, 3, '#111');
    fill(10, 4, 3, 3, '#111');
    fill(6, 7, 4, 5, '#111');
    fill(4, 9, 2, 5, '#111');
    fill(10, 9, 2, 5, '#111');
  } else if (mobId === 'witch') {
    fill(0, 0, 16, 16, '#d6b49c');
    fill(0, 0, 16, 4, '#3b0764');
    fill(3, 7, 3, 2, '#581c87');
    fill(10, 7, 3, 2, '#581c87');
    fill(7, 9, 3, 4, '#b08968');
    fill(9, 11, 1, 1, '#4d7c0f');
  } else if (mobId === 'blaze') {
    fill(0, 0, 16, 16, '#d97706');
    fill(2, 2, 12, 12, '#facc15');
    fill(3, 6, 3, 2, '#111');
    fill(4, 6, 1, 1, '#fff');
    fill(10, 6, 3, 2, '#111');
    fill(11, 6, 1, 1, '#fff');
    fill(5, 11, 6, 2, '#9a3412');
  } else if (mobId === 'enderman') {
    fill(0, 0, 16, 16, '#111115');
    fill(1, 7, 5, 2, '#f0abfc');
    fill(2, 7, 3, 2, '#d946ef');
    fill(10, 7, 5, 2, '#f0abfc');
    fill(11, 7, 3, 2, '#d946ef');
  } else {
    // Dragon / Wither
    fill(0, 0, 16, 16, '#181124');
    fill(3, 1, 2, 3, '#71717a');
    fill(11, 1, 2, 3, '#71717a');
    fill(2, 7, 4, 2, '#e879f9');
    fill(10, 7, 4, 2, '#e879f9');
    fill(5, 12, 6, 2, '#a855f7');
  }

  MOB_TEXTURE_CACHE.set(mobId, c);
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

function drawMobToCanvas(canvas, mobId) {
  const src = generateMobTexture(mobId);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
}

/**
 * WebAudio синтезатор звуков в стиле Майнкрафт
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

    const osc = this.ctx.createOscillator();
    const oGain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = 500 + tier * 68;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.16);
    oGain.gain.setValueAtTime(0.11, now);
    oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
    osc.connect(oGain);
    oGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playVictory() {
    if (!this.canPlay()) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      g.gain.setValueAtTime(0.11, now + idx * 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.19);
    });
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
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }
}

/**
 * Система пиксельных частиц
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
        x: cx + (Math.random() - 0.5) * 16,
        y: cy + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.6,
        size: isXp ? 5 : 5 + Math.floor(Math.random() * 4),
        color: isXp
          ? '#80ff20'
          : block.particleColors[Math.floor(Math.random() * block.particleColors.length)],
        alpha: 1,
        gravity: isXp ? -0.05 : 0.22
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
      p.alpha -= 0.034;

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
 * Основной контроллер игры МАЙН2048 (Сюжетный Рогалик + Бесконечная Аркада)
 */
class Mine2048Game {
  constructor() {
    this.size = 4;
    this.mode = 'story'; // 'story' | 'endless'
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

    // Интерактивные режимы клика по клетке ('pickaxe' | 'anvil' | null)
    this.activeBoardTool = null;
    this.doubleStackCharges = 0;

    // Сквозной сундук одноразовых предметов (сохраняется между забегами!)
    this.chest = {
      pearl: 1,
      tnt: 1,
      potion_double: 1,
      anvil: 1,
      gapple: 1,
      totem: 1
    };

    // Прогресс Сюжетного Рогалика
    this.stageIndex = 0; // 0..9 (и 10+ для Бесконечной Бездны Анте+)
    this.currentEnemy = null;
    this.movesLeft = 14;
    this.turnsInStage = 0;
    this.stageScore = 0;
    this.stageMerges = 0;
    this.activeJokers = []; // Список ID выбранных чар в текущем забеге
    this.toastTimer = null;

    this.sfx = new SoundFX();
    this.fx = new ParticleSystem(document.getElementById('fx-layer'));
    this.tileLayer = document.getElementById('tile-layer');
    this.boardFrame = document.getElementById('board-frame');

    this.loadProgress();
    this.initHeaderIcon();
    this.initCompendium();
    this.initChestUI();
    this.bindEvents();
    this.startNewGame(true);
  }

  initHeaderIcon() {
    const holder = document.getElementById('header-icon');
    const c = document.createElement('canvas');
    c.width = 16;
    c.height = 16;
    drawBlockToCanvas(c, 512);
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

  initChestUI() {
    const bar = document.getElementById('items-bar');
    bar.innerHTML = '';
    CONSUMABLE_ITEMS.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'item-slot';
      btn.id = `item-btn-${item.id}`;
      btn.title = `${item.fullName}: ${item.desc}`;
      btn.innerHTML = `
        <span class="item-icon">${item.icon}</span>
        <span class="item-name">${item.name}</span>
        <span class="item-count" id="item-count-${item.id}">0</span>
      `;
      btn.addEventListener('click', () => this.useConsumableItem(item.id));
      bar.appendChild(btn);
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
      const savedChest = localStorage.getItem('mine2048_chest');
      if (savedChest) {
        const parsed = JSON.parse(savedChest);
        this.chest = { ...this.chest, ...parsed };
      }
    } catch (e) {}
  }

  saveProgress() {
    try {
      localStorage.setItem('mine2048_best', String(this.bestScore));
      localStorage.setItem('mine2048_discovered', JSON.stringify([...this.discovered]));
      localStorage.setItem('mine2048_chest', JSON.stringify(this.chest));
    } catch (e) {}
  }

  switchMode(newMode) {
    if (this.mode === newMode) return;
    this.mode = newMode;
    document.getElementById('tab-story').classList.toggle('active', newMode === 'story');
    document.getElementById('tab-endless').classList.toggle('active', newMode === 'endless');
    document.getElementById('enemy-panel').classList.toggle('hidden', newMode === 'endless');
    document.getElementById('jokers-bar').classList.toggle('hidden', newMode === 'endless');
    document.getElementById('target-banner').classList.toggle('hidden', newMode === 'story');
    this.startNewGame(true);
  }

  startNewGame(resetRun = true) {
    this.tileLayer.innerHTML = '';
    this.tileElements.clear();
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
    this.score = 0;
    this.history = [];
    this.setBoardTool(null);
    this.doubleStackCharges = 0;

    if (resetRun) {
      this.undosLeft = 3;
      this.pickaxesLeft = 2;
      this.xp = 0;
      this.level = 1;
      this.stageIndex = 0;
      this.activeJokers = [];
    }

    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('joker-modal').classList.add('hidden');

    this.spawnRandomTile();
    this.spawnRandomTile();

    if (this.mode === 'story') {
      this.setupStage(0);
    }

    this.renderBoard();
    this.updateHUD();
  }

  /**
   * Настройка этапа Сюжетного Рогалика (Поле 4x4 сохраняется между врагами!)
   */
  setupStage(idx) {
    this.stageIndex = idx;
    this.turnsInStage = 0;
    this.stageScore = 0;
    this.stageMerges = 0;

    if (idx < CAMPAIGN_ENEMIES.length) {
      this.currentEnemy = { ...CAMPAIGN_ENEMIES[idx] };
    } else {
      // Бесконечная Бездна (Анте+ после победы над Драконом Края)
      const abyssLevel = idx - CAMPAIGN_ENEMIES.length + 1;
      const template = CAMPAIGN_ENEMIES[idx % CAMPAIGN_ENEMIES.length];
      const scale = Math.pow(1.45, abyssLevel);
      this.currentEnemy = {
        ...template,
        stage: idx + 1,
        isBoss: abyssLevel % 3 === 0,
        name: `☠️ Бездна #${abyssLevel}: ${template.name}`,
        moves: template.moves + 2,
        targetScore: Math.round((template.targetScore || 1200) * scale),
        targetBlock: Math.min(4096, (template.targetBlock || 256) * 2),
        questType: template.questType === 'empty_and_score' ? 'empty_and_score' : 'block_and_score',
        minEmpty: template.minEmpty || 6
      };
      if (this.currentEnemy.questType === 'empty_and_score') {
        this.currentEnemy.desc = `Набери ${this.currentEnemy.targetScore} очк. при ≥${this.currentEnemy.minEmpty} пустых клетках!`;
      } else {
        const b = BLOCK_MAP.get(this.currentEnemy.targetBlock) || BLOCKS[8];
        this.currentEnemy.desc = `Держи ${b.name} (${b.val}+) и набери ${this.currentEnemy.targetScore} очк. боя`;
      }
    }

    const bonusMoves = this.hasJoker('hourglass') ? 4 : 0;
    this.movesLeft = this.currentEnemy.moves + bonusMoves;
  }

  hasJoker(id) {
    return this.activeJokers.includes(id);
  }

  /**
   * Вычисление текущего множителя очков Balatro (×Mult)
   */
  calculateCurrentMult(mergesInSwipe = 1) {
    let mult = 1.0;
    const emptyCount = this.getEmptyCellsCount();

    if (this.hasJoker('void_echo') && emptyCount >= 7) {
      mult *= 1.8;
    }
    if (this.hasJoker('diamond_greed')) {
      let highOres = 0;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (this.grid[r][c] && this.grid[r][c].val >= 64) highOres++;
        }
      }
      mult += highOres * 0.4;
    }
    if (this.hasJoker('hourglass')) {
      mult *= 1.3;
    }
    if (this.hasJoker('looter')) {
      mult *= 1.4;
    }
    if (this.hasJoker('chain_combo') && mergesInSwipe >= 2) {
      mult *= 1.6;
    }
    if (this.doubleStackCharges > 0) {
      mult *= 2.0;
    }
    return Math.round(mult * 10) / 10;
  }

  getEmptyCellsCount() {
    let count = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) count++;
      }
    }
    return count;
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

  spawnRandomTile(forcedVal = null) {
    const empty = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return false;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    let val = forcedVal;
    if (!val) {
      if (this.hasJoker('geologist')) {
        val = Math.random() < 0.78 ? 4 : 8;
      } else {
        val = Math.random() < 0.88 ? 2 : 4;
      }
    }

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

  cloneGridState() {
    return {
      score: this.score,
      xp: this.xp,
      level: this.level,
      movesLeft: this.movesLeft,
      stageScore: this.stageScore,
      stageMerges: this.stageMerges,
      cells: this.grid.map(row => row.map(cell => (cell ? { val: cell.val } : null)))
    };
  }

  /**
   * Свайп / ход игрока
   */
  move(dir) {
    if (this.activeBoardTool) return;
    if (!document.getElementById('modal-overlay').classList.contains('hidden')) return;
    if (!document.getElementById('joker-modal').classList.contains('hidden')) return;

    const vectors = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1]
    };
    const [dr, dc] = vectors[dir];

    const snapshot = this.cloneGridState();
    let moved = false;
    let baseGainedScore = 0;
    let maxMergedVal = 0;
    const mergedPositions = [];

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
            // Если активно Зелье Двойного Стака — прыжок сразу через тир (×4 вместо ×2)!
            const jumpFactor = this.doubleStackCharges > 0 ? 4 : 2;
            if (this.doubleStackCharges > 0) {
              this.doubleStackCharges--;
            }
            const newVal = Math.min(8192, tile.val * jumpFactor);
            toRemoveIds.push(target.id);
            tile.r = nr;
            tile.c = nc;
            tile.val = newVal;
            tile.merged = true;
            this.grid[nr][nc] = tile;

            baseGainedScore += newVal;
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

    this.history.push(snapshot);
    if (this.history.length > 5) this.history.shift();

    toRemoveIds.forEach(id => {
      const el = this.tileElements.get(id);
      if (el) {
        el.remove();
        this.tileElements.delete(id);
      }
    });

    const mergesCount = mergedPositions.length;
    const mult = this.calculateCurrentMult(mergesCount);
    const finalGainedScore = Math.round(baseGainedScore * mult);

    if (finalGainedScore > 0) {
      this.score += finalGainedScore;
      this.stageScore += finalGainedScore;
      this.stageMerges += mergesCount;
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

    if (this.mode === 'story') {
      this.movesLeft--;
      this.turnsInStage++;
      if (this.hasJoker('chain_combo') && mergesCount >= 2) {
        this.movesLeft++;
        this.showToast('⚡ Цепная реакция: +1 ход!');
      }

      // Проверяем, выполнено ли условие победы над текущим врагом
      if (this.checkEnemyDefeated()) {
        this.saveProgress();
        this.renderBoard();
        this.updateHUD();
        this.handleEnemyVictory();
        return;
      }

      // Способности боссов (Крипер, Эндермен, Дракон)
      this.triggerBossAbilityIfNeeded();

      // Проверка поражения по ходам или завалу поля
      if (this.movesLeft <= 0 || !this.hasAvailableMoves()) {
        if (this.tryTriggerTotem()) {
          this.saveProgress();
          this.renderBoard();
          this.updateHUD();
          return;
        }
        this.saveProgress();
        this.renderBoard();
        this.updateHUD();
        setTimeout(() => this.showModal(false), 320);
        return;
      }
    } else {
      // Бесконечная Аркада
      if (!this.hasAvailableMoves()) {
        if (!this.tryTriggerTotem()) {
          setTimeout(() => this.showModal(false), 320);
        }
      }
    }

    this.saveProgress();
    this.renderBoard();
    this.updateHUD();
  }

  /**
   * Проверка условия победы над текущим врагом в Сюжетном режиме
   */
  checkEnemyDefeated() {
    if (!this.currentEnemy) return false;
    const e = this.currentEnemy;
    const maxBlock = this.getHighestBlockOnBoard();
    const emptyCells = this.getEmptyCellsCount();

    if (e.questType === 'block') {
      return maxBlock >= e.targetBlock;
    }
    if (e.questType === 'block_and_score') {
      return maxBlock >= e.targetBlock && this.stageScore >= e.targetScore;
    }
    if (e.questType === 'empty_and_score') {
      return emptyCells >= e.minEmpty && this.stageScore >= e.targetScore;
    }
    if (e.questType === 'merges_and_block') {
      return this.stageMerges >= e.targetMerges && maxBlock >= e.targetBlock;
    }
    return false;
  }

  /**
   * Вычисление прогресса квеста врага для прогресс-бара
   */
  getEnemyQuestProgress() {
    if (!this.currentEnemy) return { pct: 0, text: '' };
    const e = this.currentEnemy;
    const maxBlock = this.getHighestBlockOnBoard();
    const emptyCells = this.getEmptyCellsCount();

    if (e.questType === 'block') {
      const pct = Math.min(100, Math.round((Math.log2(maxBlock) / Math.log2(e.targetBlock)) * 100));
      return { pct, text: `Макс. блок: ${maxBlock} / ${e.targetBlock}` };
    }
    if (e.questType === 'block_and_score') {
      const scorePct = Math.min(1, this.stageScore / e.targetScore);
      const blockReady = maxBlock >= e.targetBlock;
      const pct = Math.min(100, Math.round(scorePct * 80 + (blockReady ? 20 : 0)));
      return {
        pct,
        text: `Очки боя: ${this.stageScore}/${e.targetScore} | Блок ${e.targetBlock}: ${blockReady ? '✅' : `сейчас ${maxBlock}`}`
      };
    }
    if (e.questType === 'empty_and_score') {
      const scorePct = Math.min(1, this.stageScore / e.targetScore);
      const emptyOk = emptyCells >= e.minEmpty;
      const pct = Math.min(100, Math.round(scorePct * 75 + (emptyOk ? 25 : 0)));
      return {
        pct,
        text: `Очки: ${this.stageScore}/${e.targetScore} | Пустых клеток: ${emptyCells}/${e.minEmpty} ${emptyOk ? '✅' : '⚠️'}`
      };
    }
    if (e.questType === 'merges_and_block') {
      const mPct = Math.min(1, this.stageMerges / e.targetMerges);
      const bOk = maxBlock >= e.targetBlock;
      const pct = Math.min(100, Math.round(mPct * 75 + (bOk ? 25 : 0)));
      return {
        pct,
        text: `Слияний: ${this.stageMerges}/${e.targetMerges} | Блок ${e.targetBlock}: ${bOk ? '✅' : `сейчас ${maxBlock}`}`
      };
    }
    return { pct: 0, text: '' };
  }

  /**
   * Пакости боссов (Крипер спавнит камень, Эндермен меняет местами блоки)
   */
  triggerBossAbilityIfNeeded() {
    const e = this.currentEnemy;
    if (!e || !e.ability || !e.abilityFreq) return;
    if (this.turnsInStage % e.abilityFreq !== 0) return;

    if (e.ability === 'spawn_cobble') {
      if (this.spawnRandomTile(4)) {
        this.showToast('💥 Крипер подбросил лишний Булыжник (4) на поле!');
      }
    } else if (e.ability === 'swap_tiles') {
      this.swapTwoRandomTiles();
      this.showToast('🟣 Эндермен телепортировал 2 блока местами!');
    } else if (e.ability === 'dragon_chaos') {
      this.swapTwoRandomTiles();
      this.spawnRandomTile(4);
      this.showToast('🐉 Дракон Края исказил шахту и сбросил породу!');
    }
  }

  swapTwoRandomTiles() {
    const occupied = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c]) occupied.push([r, c]);
      }
    }
    if (occupied.length < 2) return;
    const idx1 = Math.floor(Math.random() * occupied.length);
    let idx2 = Math.floor(Math.random() * occupied.length);
    if (idx1 === idx2) idx2 = (idx1 + 1) % occupied.length;

    const [r1, c1] = occupied[idx1];
    const [r2, c2] = occupied[idx2];
    const t1 = this.grid[r1][c1];
    const t2 = this.grid[r2][c2];

    t1.r = r2; t1.c = c2;
    t2.r = r1; t2.c = c1;
    this.grid[r1][c1] = t2;
    this.grid[r2][c2] = t1;
  }

  /**
   * Обработка победы над врагом: выпадение лута в Сквозной Сундук + выбор Чар Balatro
   */
  handleEnemyVictory() {
    this.sfx.playVictory();
    const defeated = this.currentEnemy;

    // 1. Выпадение одноразового предмета в Сквозной Сундук
    const dropChance = defeated.isBoss || this.hasJoker('looter') ? 1.0 : 0.55;
    let droppedItemName = null;
    if (Math.random() <= dropChance) {
      const randomItem = CONSUMABLE_ITEMS[Math.floor(Math.random() * CONSUMABLE_ITEMS.length)];
      this.chest[randomItem.id] = (this.chest[randomItem.id] || 0) + 1;
      droppedItemName = `${randomItem.icon} ${randomItem.fullName}`;
      this.saveProgress();
    }

    // Если побеждён Финальный Босс кампании (Этап 10 — Дракон Края)
    if (this.stageIndex === CAMPAIGN_ENEMIES.length - 1) {
      this.showToast(
        droppedItemName
          ? `🏆 Дракон повержен! Лут в сундук: ${droppedItemName}`
          : '🏆 Дракон Края повержен!'
      );
      setTimeout(() => this.showModal(true), 350);
      return;
    }

    const nextIdx = this.stageIndex + 1;
    const shouldOfferJoker =
      (defeated.isBoss || this.stageIndex % 2 === 1) &&
      this.activeJokers.length < JOKERS_POOL.length;

    const msg = droppedItemName
      ? `✅ ${defeated.name} побеждён! Выпал лут: ${droppedItemName}`
      : `✅ ${defeated.name} побеждён! Переход к этапу ${nextIdx + 1}`;
    this.showToast(msg);

    if (shouldOfferJoker) {
      this.openJokerSelectionModal(nextIdx);
    } else {
      this.setupStage(nextIdx);
      this.renderBoard();
      this.updateHUD();
    }
  }

  openJokerSelectionModal(nextStageIdx) {
    const available = JOKERS_POOL.filter(j => !this.activeJokers.includes(j.id));
    if (available.length === 0) {
      this.setupStage(nextStageIdx);
      this.renderBoard();
      this.updateHUD();
      return;
    }

    const shuffled = [...available].sort(() => Math.random() - 0.5).slice(0, 3);
    const container = document.getElementById('joker-choices');
    container.innerHTML = '';

    shuffled.forEach(joker => {
      const card = document.createElement('div');
      card.className = 'joker-card';
      card.innerHTML = `
        <div class="joker-card-title">${joker.name}</div>
        <div class="joker-card-desc">${joker.desc}</div>
      `;
      card.addEventListener('click', () => {
        this.activeJokers.push(joker.id);
        document.getElementById('joker-modal').classList.add('hidden');
        this.setupStage(nextStageIdx);
        this.renderBoard();
        this.updateHUD();
      });
      container.appendChild(card);
    });

    document.getElementById('joker-modal').classList.remove('hidden');
  }

  /**
   * Использование одноразовых предметов из Сквозного Сундука
   */
  useConsumableItem(itemId) {
    if ((this.chest[itemId] || 0) <= 0) return;

    if (itemId === 'pearl') {
      if (this.mode !== 'story') {
        this.showToast('🟣 Жемчуг Эндера используется для скипа мобов в Сюжетном режиме!');
        return;
      }
      this.chest.pearl--;
      this.saveProgress();
      this.showToast('🟣 Жемчуг Эндера: враг пропущен!');
      this.handleEnemyVictory();
    } else if (itemId === 'tnt') {
      let removed = 0;
      let totalTiles = 0;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (this.grid[r][c]) totalTiles++;
        }
      }
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const t = this.grid[r][c];
          if (t && t.val <= 4 && totalTiles - removed > 1) {
            this.fx.burstCell(r, c, t.val, 15);
            const el = this.tileElements.get(t.id);
            if (el) {
              el.remove();
              this.tileElements.delete(t.id);
            }
            this.grid[r][c] = null;
            removed++;
          }
        }
      }
      if (removed === 0) {
        this.showToast('🧨 На поле нет мелких блоков (2 или 4) для подрыва!');
        return;
      }
      this.chest.tnt--;
      this.sfx.playBreak();
      this.saveProgress();
      this.showToast(`🧨 ТНТ расчистил ${removed} мелких блоков!`);
      if (this.mode === 'story' && this.checkEnemyDefeated()) {
        this.handleEnemyVictory();
      }
      this.renderBoard();
      this.updateHUD();
    } else if (itemId === 'potion_double') {
      this.chest.potion_double--;
      this.doubleStackCharges += 3;
      this.sfx.playVictory();
      this.saveProgress();
      this.showToast('🧪 Зелье активировано: следующие 3 слияния прыгают через тир (×4)!');
      this.updateHUD();
    } else if (itemId === 'anvil') {
      if (this.activeBoardTool === 'anvil') {
        this.setBoardTool(null);
      } else {
        this.setBoardTool('anvil');
      }
    } else if (itemId === 'gapple') {
      if (this.mode !== 'story') {
        this.showToast('🍎 Золотое яблоко добавляет ходы в Сюжетном режиме!');
        return;
      }
      this.chest.gapple--;
      this.movesLeft += 8;
      this.sfx.playVictory();
      this.saveProgress();
      this.showToast('🍎 Золотое яблоко: +8 ходов к таймеру боя!');
      this.updateHUD();
    } else if (itemId === 'totem') {
      this.showToast('🛡 Тотем Бессмертия срабатывает автоматически при нехватке ходов или завале!');
    }
  }

  /**
   * Авто-срабатывание Тотема Бессмертия при угрозе поражения
   */
  tryTriggerTotem() {
    if ((this.chest.totem || 0) <= 0) return false;
    this.chest.totem--;

    // Очищаем до 6 самых мелких блоков на поле
    const allTiles = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c]) allTiles.push(this.grid[r][c]);
      }
    }
    allTiles.sort((a, b) => a.val - b.val);
    const toClear = allTiles.slice(0, Math.min(6, Math.max(0, allTiles.length - 2)));
    toClear.forEach(t => {
      this.fx.burstCell(t.r, t.c, t.val, 16);
      const el = this.tileElements.get(t.id);
      if (el) {
        el.remove();
        this.tileElements.delete(t.id);
      }
      this.grid[t.r][t.c] = null;
    });

    if (this.mode === 'story') {
      this.movesLeft += 8;
    }
    this.sfx.playVictory();
    this.showToast('🛡 ТОТЕМ БЕССМЕРТИЯ СПАС ВАС! Поле расчищено и дано +8 ходов!');
    return true;
  }

  setBoardTool(tool) {
    this.activeBoardTool = tool;
    this.boardFrame.classList.toggle('pickaxe-mode', Boolean(tool));
    document.getElementById('btn-pickaxe').classList.toggle('active-tool', tool === 'pickaxe');
    const anvilBtn = document.getElementById('item-btn-anvil');
    if (anvilBtn) anvilBtn.classList.toggle('active-item', tool === 'anvil');

    const hintEl = document.getElementById('pickaxe-hint');
    const hintText = document.getElementById('tool-hint-text');
    if (!tool) {
      hintEl.classList.add('hidden');
    } else if (tool === 'pickaxe') {
      hintText.textContent = '⛏ Кликните по любому блоку на поле, чтобы разбить его киркой!';
      hintEl.classList.remove('hidden');
    } else if (tool === 'anvil') {
      hintText.textContent = '🔨 Кликните по любому блоку на поле, чтобы удвоить его тир (×2)!';
      hintEl.classList.remove('hidden');
    }
  }

  onTileClicked(r, c) {
    const tile = this.grid[r][c];
    if (!tile || !this.activeBoardTool) return;

    if (this.activeBoardTool === 'pickaxe') {
      if (this.pickaxesLeft <= 0) return;
      let totalTiles = 0;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (this.grid[i][j]) totalTiles++;

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
      if (totalTiles <= 1) this.spawnRandomTile();

      this.setBoardTool(null);
      if (this.mode === 'story' && this.checkEnemyDefeated()) {
        this.handleEnemyVictory();
      }
      this.renderBoard();
      this.updateHUD();
    } else if (this.activeBoardTool === 'anvil') {
      if ((this.chest.anvil || 0) <= 0) return;
      this.history.push(this.cloneGridState());
      this.chest.anvil--;
      tile.val = Math.min(8192, tile.val * 2);
      tile.merged = true;
      this.discovered.add(tile.val);
      this.fx.burstCell(r, c, tile.val, 18);
      this.sfx.playMerge(tile.val);
      this.setBoardTool(null);
      this.saveProgress();

      if (this.mode === 'story' && this.checkEnemyDefeated()) {
        this.handleEnemyVictory();
      }
      this.renderBoard();
      this.updateHUD();
    }
  }

  addXP(amount) {
    this.xp += amount;
    const needed = this.level * 45;
    if (this.xp >= needed) {
      this.xp -= needed;
      this.level++;
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
    this.movesLeft = prev.movesLeft;
    this.stageScore = prev.stageScore;
    this.stageMerges = prev.stageMerges;

    this.tileLayer.innerHTML = '';
    this.tileElements.clear();

    this.grid = prev.cells.map((row, r) =>
      row.map((cell, c) =>
        cell
          ? { id: this.nextTileId++, val: cell.val, r, c, isNew: false, merged: false }
          : null
      )
    );

    this.sfx.playStep();
    this.renderBoard();
    this.updateHUD();
  }

  hasAvailableMoves() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cur = this.grid[r][c];
        if (!cur) return true;
        if (r + 1 < this.size && this.grid[r + 1][c] && this.grid[r + 1][c].val === cur.val) return true;
        if (c + 1 < this.size && this.grid[r][c + 1] && this.grid[r][c + 1].val === cur.val) return true;
      }
    }
    return false;
  }

  showToast(msg) {
    const el = document.getElementById('toast-banner');
    el.textContent = msg;
    el.classList.remove('hidden');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      el.classList.add('hidden');
    }, 3200);
  }

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
            if (this.activeBoardTool) {
              this.onTileClicked(tile.r, tile.c);
            }
          });
          this.tileLayer.appendChild(el);
          this.tileElements.set(tile.id, el);
        }

        el.style.setProperty('--tx', `calc(${tile.c} * (100% + var(--grid-gap)))`);
        el.style.setProperty('--ty', `calc(${tile.r} * (100% + var(--grid-gap)))`);
        el.style.setProperty('--conn-color', blockInfo.connColor);

        const sameRight =
          c + 1 < this.size && this.grid[r][c + 1] && this.grid[r][c + 1].val === tile.val;
        const sameBottom =
          r + 1 < this.size && this.grid[r + 1][c] && this.grid[r + 1][c].val === tile.val;

        el.dataset.connRight = sameRight ? '1' : '0';
        el.dataset.connBottom = sameBottom ? '1' : '0';

        if (el.dataset.val !== String(tile.val)) {
          el.dataset.val = String(tile.val);
          drawBlockToCanvas(el.querySelector('.tile-canvas'), tile.val);
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
    document.getElementById('mult-val').textContent = `×${this.calculateCurrentMult(1).toFixed(1)}`;

    const needed = this.level * 45;
    const pct = Math.min(100, Math.round((this.xp / needed) * 100));
    document.getElementById('xp-bar-fill').style.width = `${pct}%`;
    document.getElementById('xp-level').textContent = `УР. ${this.level}`;

    // Инструменты
    const btnUndo = document.getElementById('btn-undo');
    document.getElementById('undo-count').textContent = this.undosLeft;
    btnUndo.disabled = this.undosLeft <= 0 || this.history.length === 0;

    const btnPickaxe = document.getElementById('btn-pickaxe');
    document.getElementById('pickaxe-count').textContent = this.pickaxesLeft;
    btnPickaxe.disabled = this.pickaxesLeft <= 0;

    // Сюжетная панель врага
    if (this.mode === 'story' && this.currentEnemy) {
      const e = this.currentEnemy;
      const panel = document.getElementById('enemy-panel');
      panel.classList.toggle('boss-encounter', Boolean(e.isBoss));

      drawMobToCanvas(document.getElementById('enemy-canvas'), e.id);
      document.getElementById('enemy-stage-badge').textContent =
        this.stageIndex < 10 ? `${this.stageIndex + 1}/10` : `АНТЕ+${this.stageIndex - 9}`;
      document.getElementById('enemy-name').textContent = e.name;

      const abTag = document.getElementById('enemy-ability-tag');
      if (e.abilityText) {
        abTag.textContent = e.abilityText;
        abTag.classList.remove('hidden');
      } else {
        abTag.classList.add('hidden');
      }

      document.getElementById('enemy-quest-text').textContent = e.desc;
      const prog = this.getEnemyQuestProgress();
      document.getElementById('enemy-progress-fill').style.width = `${prog.pct}%`;
      document.getElementById('enemy-progress-label').textContent = prog.text;

      const movesEl = document.getElementById('moves-left-val');
      movesEl.textContent = this.movesLeft;
      movesEl.classList.toggle('danger', this.movesLeft <= 4);

      // Список активных чар (Джокеров)
      const jList = document.getElementById('jokers-list');
      if (this.activeJokers.length === 0) {
        jList.innerHTML = '<span class="jokers-empty">побеждай мобов для чар ×Mult</span>';
      } else {
        jList.innerHTML = '';
        this.activeJokers.forEach(jId => {
          const jObj = JOKERS_POOL.find(x => x.id === jId);
          if (!jObj) return;
          const badge = document.createElement('span');
          badge.className = 'joker-badge';
          badge.textContent = jObj.name;
          badge.title = jObj.desc;
          jList.appendChild(badge);
        });
      }
    } else {
      // Бесконечный режим
      const maxDiscovered = Math.max(...this.discovered);
      const nextBlock = BLOCKS.find(b => b.val > maxDiscovered) || BLOCKS[BLOCKS.length - 1];
      drawBlockToCanvas(document.getElementById('target-canvas'), nextBlock.val);
      document.getElementById('target-name').textContent = `${nextBlock.fullName} (${nextBlock.val})`;
    }

    // Индикатор баффа удвоения стаков
    const buffBadge = document.getElementById('double-buff-badge');
    if (this.doubleStackCharges > 0) {
      buffBadge.textContent = `⚡ ×2 СТАК: ${this.doubleStackCharges}`;
      buffBadge.classList.remove('hidden');
    } else {
      buffBadge.classList.add('hidden');
    }

    // Обновляем Сквозной Сундук Предметов
    CONSUMABLE_ITEMS.forEach(item => {
      const count = this.chest[item.id] || 0;
      const countEl = document.getElementById(`item-count-${item.id}`);
      const btnEl = document.getElementById(`item-btn-${item.id}`);
      if (countEl) countEl.textContent = count;
      if (btnEl) btnEl.disabled = count <= 0;
    });

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
      title.textContent = '🐉 ДРАКОН КРАЯ ПОВЕРЖЕН!';
      subtitle.textContent =
        'Вы прошли все 10 этапов Сюжетной кампании! Хотите продолжить этот забег в Бесконечной Бездне (Анте+) на рекорд?';
      btnContinue.classList.remove('hidden');
    } else {
      title.textContent =
        this.mode === 'story' && this.movesLeft <= 0 ? '⏳ ХОДЫ ЗАКОНЧИЛИСЬ!' : 'ШАХТА ЗАВАЛЕНА!';
      subtitle.textContent =
        'Забег окончен, но все предметы в вашем Сквозном Сундуке сохранены — используйте их в следующей игре!';
      btnContinue.classList.add('hidden');
    }

    overlay.classList.remove('hidden');
  }

  bindEvents() {
    document.getElementById('tab-story').addEventListener('click', () => this.switchMode('story'));
    document.getElementById('tab-endless').addEventListener('click', () => this.switchMode('endless'));

    window.addEventListener('keydown', e => {
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
      } else if (e.code === 'Escape' && this.activeBoardTool) {
        this.setBoardTool(null);
      }
    });

    let startX = 0;
    let startY = 0;
    let tracking = false;

    this.boardFrame.addEventListener(
      'pointerdown',
      e => {
        if (this.activeBoardTool) return;
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

    this.boardFrame.addEventListener(
      'touchmove',
      e => {
        e.preventDefault();
      },
      { passive: false }
    );

    document.getElementById('btn-new').addEventListener('click', () => {
      this.startNewGame(true);
    });

    document.getElementById('btn-undo').addEventListener('click', () => {
      this.undoMove();
    });

    document.getElementById('btn-pickaxe').addEventListener('click', () => {
      this.setBoardTool(this.activeBoardTool === 'pickaxe' ? null : 'pickaxe');
    });

    document.getElementById('btn-cancel-pickaxe').addEventListener('click', () => {
      this.setBoardTool(null);
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
      this.setupStage(this.stageIndex + 1);
      this.renderBoard();
      this.updateHUD();
    });

    document.addEventListener('visibilitychange', () => {
      this.sfx.mutedByVisibility = document.hidden;
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new Mine2048Game();
});
