
const overlay = document.getElementById('overlay');
const content = document.getElementById('content');
const closeButton = document.getElementById('close');
const toast = document.getElementById('toast');

const pages = {
  feelings: {
    title: 'ruang keluh kesah ♡',
    html: `
      <p>Tidak perlu menyusun kata dengan sempurna.
      Tuliskan saja apa yang sedang terasa berat.</p>
      <div class="paper">
        <label for="feelingTitle">apa yang memenuhi pikiranmu?</label>
        <input id="feelingTitle" placeholder="hari ini terasa...">
        <label for="feelingText">keluarkan semuanya di sini</label>
        <textarea id="feelingText"
          placeholder="aku sedang merasa..."></textarea>
        <button class="action" id="saveFeeling">simpan tulisan ♡</button>
        <button class="action" id="clearFeeling">kosongkan</button>
        <p>Catatan disimpan di browser perangkat ini.</p>
        <div id="feelingSaved"></div>
      </div>
      <div class="paper">
        <strong>pengingat kecil</strong>
        <p>Kamu tidak harus menyelesaikan semuanya hari ini.
        Perasaanmu layak diberi ruang.</p>
      </div>`
  },

  letter: {
    title: 'surat untuk diri sendiri ୨୧',
    html: `
      <p>Tulislah sesuatu yang ingin kamu dengar
      dari seseorang yang memperlakukanmu dengan lembut.</p>
      <div class="paper">
        <label for="letterText">hai, aku ingin kamu tahu...</label>
        <textarea id="letterText"
          placeholder="terima kasih sudah berusaha sejauh ini..."></textarea>
        <button class="action" id="saveLetter">simpan surat</button>
        <button class="action" id="letterPrompt">kalimat pembuka</button>
        <div id="letterSaved"></div>
      </div>`
  },

  wish: {
    title: 'kotak harapan ✧',
    html: `
      <p>Harapan tidak harus besar.
      Satu hari yang lebih ringan pun berarti.</p>
      <div class="paper">
        <label for="wishText">satu hal yang kuharapkan...</label>
        <textarea id="wishText"
          placeholder="aku berharap suatu hari nanti..."></textarea>
        <button class="action" id="saveWish">simpan harapan ✦</button>
        <div id="wishSaved"></div>
      </div>
      <div class="choice-grid">
        <button class="choice" data-wish="semoga aku bisa tumbuh pelan-pelan.">☁ tumbuh pelan-pelan</button>
        <button class="choice" data-wish="semoga aku menemukan hal kecil yang menyenangkan.">♡ hal kecil yang baik</button>
        <button class="choice" data-wish="semoga aku berani meminta bantuan.">୨୧ berani meminta bantuan</button>
        <button class="choice" data-wish="semoga esok terasa lebih ringan.">✧ esok yang ringan</button>
      </div>`
  },

  reset: {
    title: 'jeda kecil untukmu ☁',
    html: `
      <p>Berhentilah sebentar.
      Kamu tidak harus melakukan semuanya sekaligus.</p>
      <div class="breath">tarik napas<br>perlahan</div>
      <div class="paper">
        <p>pilih satu hal kecil untuk saat ini:</p>
        <div class="choice-grid">
          <button class="choice" data-reset="minum sedikit air">♡ minum air</button>
          <button class="choice" data-reset="meregangkan bahu">✧ regangkan bahu</button>
          <button class="choice" data-reset="melihat tiga hal di sekitarmu">☁ lihat sekeliling</button>
          <button class="choice" data-reset="menyapa orang yang kamu percaya">୨୧ menyapa seseorang</button>
        </div>
        <p id="resetReply">Pilih yang terasa mungkin untukmu.</p>
      </div>`
  },

  about: {
    title: 'selamat datang ʚ♡⃛ɞ',
    html: `
      <div class="paper">
        <p>Ini adalah ruang untuk berhenti sejenak,
        merapikan pikiran, menulis tanpa takut dinilai,
        dan mengingat bahwa kamu tidak harus selalu baik-baik saja.</p>
      </div>
      <div class="paper">
        <strong>cara menggunakan</strong>
        <p>Tekan stiker atau tombol untuk membuka halaman.
        Gunakan tombol × atau Escape untuk kembali.</p>
      </div>
      <div class="paper">
        <strong>pengingat</strong>
        <p>Jika masalah terasa terlalu berat, cobalah
        berbicara kepada orang dewasa yang tepercaya
        atau tenaga profesional.</p>
      </div>`
  }
};

function openPage(key) {
  const page = pages[key];
  if (!page) return;

  content.innerHTML = `<h2>${page.title}</h2>${page.html}`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  history.pushState({ page: key }, '', '#' + key);

  bindActions(key);
  makeConfetti(12);
  closeButton.focus();
}

function closePage() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';

  if (location.hash) {
    history.replaceState(
      {},
      '',
      location.pathname + location.search
    );
  }
}

document.querySelectorAll('[data-page]').forEach(button => {
  button.addEventListener('click', () => {
    openPage(button.dataset.page);
  });
});

closeButton.addEventListener('click', closePage);

overlay.addEventListener('click', event => {
  if (event.target === overlay) closePage();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closePage();
});

window.addEventListener('popstate', () => {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
});

function bindActions(key) {
  if (key === 'feelings') {
    const title = document.getElementById('feelingTitle');
    const text = document.getElementById('feelingText');
    const saved = document.getElementById('feelingSaved');

    const old = localStorage.getItem('creative-feeling');
    if (old) {
      saved.innerHTML = '<div class="saved"></div>';
      saved.firstElementChild.textContent = old;
    }

    document.getElementById('saveFeeling').onclick = () => {
      const value = [
        title.value.trim(),
        text.value.trim()
      ].filter(Boolean).join('\n');

      if (!value) return showToast('Tuliskan sedikit dulu ♡');

      localStorage.setItem('creative-feeling', value);
      saved.innerHTML = '<div class="saved"></div>';
      saved.firstElementChild.textContent = value;
      showToast('Tulisan tersimpan di browser ini ♡');
      makeConfetti(18);
    };

    document.getElementById('clearFeeling').onclick = () => {
      title.value = '';
      text.value = '';
      text.focus();
    };
  }

  if (key === 'letter') {
    const field = document.getElementById('letterText');
    const result = document.getElementById('letterSaved');

    field.value = localStorage.getItem('creative-letter') || '';

    document.getElementById('saveLetter').onclick = () => {
      if (!field.value.trim()) {
        return showToast('Suratnya masih kosong ♡');
      }

      localStorage.setItem('creative-letter', field.value);
      result.textContent = 'suratmu sudah tersimpan ୨୧';
      showToast('Surat kecilmu tersimpan.');
    };

    document.getElementById('letterPrompt').onclick = () => {
      const prompts = [
        'aku tahu akhir-akhir ini tidak mudah, tetapi...',
        'hal yang ingin kumaafkan dari diriku adalah...',
        'aku bangga pada diriku karena...',
        'aku berharap kamu tidak lupa bahwa...'
      ];

      field.value =
        prompts[Math.floor(Math.random() * prompts.length)] + '\n';
      field.focus();
    };
  }

  if (key === 'wish') {
    const field = document.getElementById('wishText');
    const result = document.getElementById('wishSaved');

    field.value = localStorage.getItem('creative-wish') || '';

    document.getElementById('saveWish').onclick = () => {
      if (!field.value.trim()) {
        return showToast('Tuliskan satu harapan kecil ✧');
      }

      localStorage.setItem('creative-wish', field.value);
      result.innerHTML = '<div class="saved"></div>';
      result.firstElementChild.textContent = field.value;
      showToast('Harapanmu sudah disimpan ♡');
      makeConfetti(18);
    };

    content.querySelectorAll('[data-wish]').forEach(button => {
      button.onclick = () => {
        field.value = button.dataset.wish;
        showToast('Satu harapan telah dipilih ✧');
      };
    });
  }

  if (key === 'reset') {
    content.querySelectorAll('[data-reset]').forEach(button => {
      button.onclick = () => {
        document.getElementById('resetReply').textContent =
          'Cobalah ' + button.dataset.reset +
          '. Pelan-pelan saja; satu langkah kecil sudah cukup.';

        showToast('pelan-pelan saja ☁');
        makeConfetti(8);
      };
    });
  }
}

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function makeConfetti(amount = 10) {
  const symbols = ['✦', '♡', '✧', '⋆', '୨୧', '✿'];

  for (let i = 0; i < amount; i++) {
    const bit = document.createElement('span');

    bit.className = 'confetti';
    bit.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    bit.style.left = Math.random() * 100 + 'vw';
    bit.style.top = '-25px';
    bit.style.setProperty(
      '--drift',
      (Math.random() * 180 - 90) + 'px'
    );

    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 1800);
  }
}

/* tiny wonderland extra features */

const extraOverlay = document.getElementById('extraOverlay');
const extraTitle = document.getElementById('extraTitle');
const extraContent = document.getElementById('extraContent');
const extraClose = document.getElementById('extraClose');

const extraPages = {
  bakery: {
    title: 'sugar bakery 🍰',
    html: `
      <h3>let's make a pancake!</h3>
      <p>pilih bahan satu per satu, lalu masak pancake-mu.</p>
      <div class="pancake-plate" id="pancakePlate">
        🥣
        <span id="pancakeStatus">adonan masih kosong</span>
      </div>
      <p class="game-counter" id="ingredientCounter">bahan: 0 / 4</p>
      <div class="ingredient-row">
        <button class="ingredient" data-ingredient="🥚">
          <span>🥚</span>telur
        </button>
        <button class="ingredient" data-ingredient="🥛">
          <span>🥛</span>susu
        </button>
        <button class="ingredient" data-ingredient="🌾">
          <span>🌾</span>tepung
        </button>
        <button class="ingredient" data-ingredient="🍯">
          <span>🍯</span>gula
        </button>
      </div>
      <div class="extra-panel">
        <button id="cookPancake">masak pancake ♡</button>
        <button id="resetPancake">mulai lagi</button>
        <p id="bakeryMessage">aduk bahan-bahannya terlebih dahulu.</p>
        <p id="bakeryScore">pancake berhasil dibuat: 0</p>
      </div>`
  },

  dressup: {
    title: 'little closet 🎀',
    html: `
      <h3>dress up your little doll</h3>
      <p>pilih pakaian dan aksesori yang kamu suka.</p>
      <div class="doll-preview">
        <div>
          <div class="doll-face" id="dollFace">૮ ˶ᵔ ᵕ ᵔ˶ ა</div>
          <div class="doll-clothes" id="dollClothes">୨୧</div>
          <p id="dollCaption">pink day</p>
        </div>
      </div>
      <div class="extra-panel">
        <p>pilih pakaian</p>
        <div class="outfit-row">
          <button data-outfit="🎀" data-name="pink dress">🎀 dress</button>
          <button data-outfit="🩵" data-name="blue outfit">🩵 blue</button>
          <button data-outfit="🌼" data-name="flower outfit">🌼 flower</button>
          <button data-outfit="🖤" data-name="night outfit">🖤 night</button>
        </div>
        <p>pilih aksesori</p>
        <div class="outfit-row">
          <button data-accessory="🎀">🎀 pita</button>
          <button data-accessory="👑">👑 mahkota</button>
          <button data-accessory="🌷">🌷 bunga</button>
          <button data-accessory="✨">✨ glitter</button>
        </div>
        <button id="saveOutfit">simpan penampilan ♡</button>
        <p id="outfitMessage">buat penampilan favoritmu.</p>
      </div>`
  },

  desktop: {
    title: 'dream desktop ☁',
    html: `
      <h3>my little computer</h3>
      <p>selamat datang di desktop kecilmu.</p>
      <div class="desktop-demo" id="desktopDemo">
        <p id="desktopClock">♡ 08:08</p>
        <h3>hello, little star!</h3>
        <div class="outfit-row">
          <button data-desktop-app="diary">📔 diary</button>
          <button data-desktop-app="music">🎵 music</button>
          <button data-desktop-app="weather">☁ weather</button>
        </div>
        <div class="extra-panel" id="desktopApp">
          pilih salah satu aplikasi di desktop.
        </div>
      </div>
      <div class="extra-panel">
        <p>ubah wallpaper</p>
        <div class="outfit-row">
          <button data-wallpaper="#ffe0ed">pink</button>
          <button data-wallpaper="#d7f7fb">mint</button>
          <button data-wallpaper="#e8ddff">lavender</button>
          <button data-wallpaper="#fff1a8">butter</button>
        </div>
      </div>`
  },

  memory: {
    title: 'little memories ♡',
    html: `
      <h3>dear little diary</h3>
      <p>tuliskan cerita, hal kecil yang menyenangkan,
      atau sesuatu yang ingin kamu ingat.</p>
      <div class="extra-panel">
        <label for="memoryTitle">judul kenangan</label>
        <input id="memoryTitle" placeholder="hari yang menyenangkan...">
        <label for="memoryText">ceritamu</label>
        <textarea id="memoryText" placeholder="hari ini aku..."></textarea>
        <button id="saveMemory">simpan kenangan ♡</button>
      </div>
      <div class="memory-list" id="memoryList"></div>
      <p class="game-counter">kenangan disimpan di browser perangkat ini.</p>`
  },

  poster: {
    title: 'sticker studio ✧',
    html: `
      <h3>make your own poster!</h3>
      <p>buat poster mini dengan kata-kata pilihanmu.</p>
      <div class="poster-preview" id="posterPreview">
        <h3 id="posterWords">sweet little things ♡</h3>
      </div>
      <div class="extra-panel">
        <label for="posterInput">tulisan poster</label>
        <input id="posterInput" maxlength="45"
          placeholder="tulis sesuatu yang lucu...">
        <label for="posterColor">warna latar</label>
        <select id="posterColor">
          <option value="#b8f2f7">mint blue</option>
          <option value="#ffd8e9">strawberry pink</option>
          <option value="#fff0a8">butter yellow</option>
          <option value="#e3d6ff">lavender dream</option>
          <option value="#d8f3b9">pistachio green</option>
        </select>
        <button id="randomPoster">acak dekorasi ✧</button>
        <p id="posterDecoration">♡ ✦ ୨୧ ✿</p>
      </div>`
  },

  garden: {
    title: 'tiny flower garden 🌷',
    html: `
      <h3>grow a little garden</h3>
      <p>setiap kali kamu menanam, tamanmu akan semakin ramai.</p>
      <div class="garden-bed" id="gardenBed">
        <span class="garden-plant">🌱</span>
      </div>
      <div class="extra-panel">
        <button data-flower="🌷">tanam tulip</button>
        <button data-flower="🌼">tanam daisy</button>
        <button data-flower="🌸">tanam sakura</button>
        <button data-flower="🌻">tanam sunflower</button>
        <button id="clearGarden">mulai taman baru</button>
        <p id="gardenMessage">pilih bunga untuk mulai menanam.</p>
      </div>`
  }
};

let pancakeIngredients = new Set();
let pancakeWins = 0;
let dollOutfit = '🎀';
let dollAccessory = '✨';

function openExtra(key) {
  const page = extraPages[key];
  if (!page) return;

  extraTitle.textContent = page.title;
  extraContent.innerHTML = page.html;
  extraOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  bindExtraActions(key);
}

function closeExtra() {
  extraOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-extra]').forEach(button => {
  button.addEventListener('click', () => {
    openExtra(button.dataset.extra);
  });
});

extraClose.addEventListener('click', closeExtra);

extraOverlay.addEventListener('click', event => {
  if (event.target === extraOverlay) closeExtra();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeExtra();
  }
});

function bindExtraActions(key) {
  if (key === 'bakery') bindBakery();
  if (key === 'dressup') bindDressup();
  if (key === 'desktop') bindDesktop();
  if (key === 'memory') bindMemory();
  if (key === 'poster') bindPoster();
  if (key === 'garden') bindGarden();
}

/* baking game */

function bindBakery() {
  pancakeIngredients = new Set();

  const savedScore = Number(
    localStorage.getItem('tiny-bakery-score') || 0
  );

  pancakeWins = savedScore;
  updateBakeryScore();

  extraContent.querySelectorAll('[data-ingredient]').forEach(button => {
    button.onclick = () => {
      const ingredient = button.dataset.ingredient;

      if (pancakeIngredients.has(ingredient)) {
        showToast('bahan ini sudah dimasukkan ♡');
        return;
      }

      pancakeIngredients.add(ingredient);
      button.style.background = '#c8f5d6';

      document.getElementById('pancakePlate').firstChild.textContent =
        [...pancakeIngredients].join(' ');

      document.getElementById('ingredientCounter').textContent =
        `bahan: ${pancakeIngredients.size} / 4`;

      document.getElementById('pancakeStatus').textContent =
        pancakeIngredients.size === 4
          ? 'adonan siap dimasak!'
          : 'tambahkan bahan lainnya...';
    };
  });

  document.getElementById('cookPancake').onclick = () => {
    const message = document.getElementById('bakeryMessage');

    if (pancakeIngredients.size < 4) {
      message.textContent =
        'masih ada bahan yang belum dimasukkan!';
      return;
    }

    document.getElementById('pancakePlate').firstChild.textContent = '🥞';
    document.getElementById('pancakeStatus').textContent =
      'pancake berhasil dibuat!';

    pancakeWins++;
    localStorage.setItem('tiny-bakery-score', pancakeWins);

    message.textContent =
      'yummy! pancake buatanmu berhasil. ♡';

    updateBakeryScore();
    makeConfetti(18);
  };

  document.getElementById('resetPancake').onclick = () => {
    bindBakery();
  };
}

function updateBakeryScore() {
  const score = document.getElementById('bakeryScore');
  if (score) {
    score.textContent =
      `pancake berhasil dibuat: ${pancakeWins}`;
  }
}

/* dress-up game */

function bindDressup() {
  const saved = JSON.parse(
    localStorage.getItem('tiny-doll-look') || 'null'
  );

  if (saved) {
    dollOutfit = saved.outfit;
    dollAccessory = saved.accessory;
  }

  updateDoll();

  extraContent.querySelectorAll('[data-outfit]').forEach(button => {
    button.onclick = () => {
      dollOutfit = button.dataset.outfit;
      document.getElementById('dollCaption').textContent =
        button.dataset.name;

      updateDoll();
    };
  });

  extraContent.querySelectorAll('[data-accessory]').forEach(button => {
    button.onclick = () => {
      dollAccessory = button.dataset.accessory;
      updateDoll();
    };
  });

  document.getElementById('saveOutfit').onclick = () => {
    localStorage.setItem(
      'tiny-doll-look',
      JSON.stringify({
        outfit: dollOutfit,
        accessory: dollAccessory
      })
    );

    document.getElementById('outfitMessage').textContent =
      'penampilanmu sudah disimpan! ୨୧';

    makeConfetti(10);
  };
}

function updateDoll() {
  const clothes = document.getElementById('dollClothes');
  if (!clothes) return;

  clothes.textContent = dollOutfit + ' ' + dollAccessory;
}

/* desktop simulator */

function bindDesktop() {
  const clock = document.getElementById('desktopClock');

  function updateClock() {
    if (!clock || !clock.isConnected) return;

    const now = new Date();
    clock.textContent = '♡ ' + now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  updateClock();

  extraContent.querySelectorAll('[data-wallpaper]').forEach(button => {
    button.onclick = () => {
      document.getElementById('desktopDemo').style.background =
        button.dataset.wallpaper;
    };
  });

  extraContent.querySelectorAll('[data-desktop-app]').forEach(button => {
    button.onclick = () => {
      const app = document.getElementById('desktopApp');

      const messages = {
        diary: '📔 hari ini adalah halaman baru untuk cerita kecilmu.',
        music: '🎵 now playing: imaginary strawberry radio ♡',
        weather: '☁ ramalan hari ini: peluang besar untuk hal-hal kecil yang baik.'
      };

      app.textContent = messages[button.dataset.desktopApp];
    };
  });
}

/* personal memory book */

function getMemories() {
  try {
    return JSON.parse(
      localStorage.getItem('tiny-memories') || '[]'
    );
  } catch {
    return [];
  }
}

function bindMemory() {
  renderMemories();

  document.getElementById('saveMemory').onclick = () => {
    const title = document.getElementById('memoryTitle').value.trim();
    const text = document.getElementById('memoryText').value.trim();

    if (!title && !text) {
      showToast('tuliskan sedikit kenanganmu ♡');
      return;
    }

    const memories = getMemories();

    memories.unshift({
      title: title || 'kenangan kecil',
      text,
      date: new Date().toLocaleDateString('id-ID')
    });

    localStorage.setItem('tiny-memories', JSON.stringify(memories));

    document.getElementById('memoryTitle').value = '';
    document.getElementById('memoryText').value = '';

    renderMemories();
    showToast('kenangan kecilmu sudah tersimpan ♡');
    makeConfetti(10);
  };
}

function renderMemories() {
  const list = document.getElementById('memoryList');
  if (!list) return;

  list.replaceChildren();

  const memories = getMemories();

  if (!memories.length) {
    list.textContent = 'belum ada kenangan. buat yang pertama yuk!';
    return;
  }

  memories.forEach(memory => {
    const card = document.createElement('article');
    card.className = 'memory-note';

    const heading = document.createElement('strong');
    heading.textContent = memory.title;

    const date = document.createElement('small');
    date.textContent = ' ♡ ' + memory.date;

    const story = document.createElement('p');
    story.textContent = memory.text;

    card.append(heading, date, story);
    list.appendChild(card);
  });
}

/* poster maker */

function bindPoster() {
  const input = document.getElementById('posterInput');
  const color = document.getElementById('posterColor');
  const preview = document.getElementById('posterPreview');
  const words = document.getElementById('posterWords');

  input.addEventListener('input', () => {
    words.textContent = input.value || 'sweet little things ♡';
  });

  color.addEventListener('change', () => {
    preview.style.background = color.value;
  });

  document.getElementById('randomPoster').onclick = () => {
    const decorations = [
      '♡ ✦ ୨୧ ✿',
      '⋆｡°✩ ૮꒰ ˶• ༝ •˶꒱ა',
      '🎀 ♡ strawberry dreams ♡ 🎀',
      '✿ 𓂃 ࣪˖ ⋆ sweet days ⋆',
      '☁ little things matter ☁'
    ];

    document.getElementById('posterDecoration').textContent =
      decorations[Math.floor(Math.random() * decorations.length)];

    const colors = [
      '#b8f2f7',
      '#ffd8e9',
      '#fff0a8',
      '#e3d6ff',
      '#d8f3b9'
    ];

    color.value = colors[
      Math.floor(Math.random() * colors.length)
    ];

    preview.style.background = color.value;
    makeConfetti(8);
  };
}

/* flower garden */

function bindGarden() {
  const bed = document.getElementById('gardenBed');
  const message = document.getElementById('gardenMessage');

  let flowers = [];

  try {
    flowers = JSON.parse(
      localStorage.getItem('tiny-garden') || '[]'
    );
  } catch {
    flowers = [];
  }

  function renderGarden() {
    bed.replaceChildren();

    if (!flowers.length) {
      const seed = document.createElement('span');
      seed.className = 'garden-plant';
      seed.textContent = '🌱';
      bed.appendChild(seed);
      return;
    }

    flowers.forEach(flower => {
      const plant = document.createElement('span');
      plant.className = 'garden-plant';
      plant.textContent = flower;
      bed.appendChild(plant);
    });
  }

  extraContent.querySelectorAll('[data-flower]').forEach(button => {
    button.onclick = () => {
      if (flowers.length >= 18) {
        message.textContent =
          'tamannya sudah penuh bunga! indah sekali ♡';
        return;
      }

      flowers.push(button.dataset.flower);

      localStorage.setItem(
        'tiny-garden',
        JSON.stringify(flowers)
      );

      renderGarden();

      message.textContent =
        'hore! satu bunga baru tumbuh di tamanmu.';

      makeConfetti(6);
    };
  });

  document.getElementById('clearGarden').onclick = () => {
    flowers = [];
    localStorage.removeItem('tiny-garden');
    renderGarden();

    message.textContent = 'kita mulai menanam lagi 🌱';
  };

  renderGarden();
}

/* the little things club */

const clubOverlay = document.getElementById('clubOverlay');
const clubTitle = document.getElementById('clubWindowTitle');
const clubContent = document.getElementById('clubContent');
const clubClose = document.getElementById('clubClose');

const clubPages = {
  fortune: {
    title: 'fortune cookie ✧',
    html: `
      <h3>a tiny message for you</h3>
      <p>take a breath and see what the universe has for you.</p>
      <div class="fortune-paper">
        <div>
          <span style="font-size:42px">🥠</span>
          <p id="fortuneMessage">your little fortune is waiting...</p>
        </div>
      </div>
      <button id="openFortune">crack the cookie ♡</button>
      <button id="saveFortune">save this message</button>
      <div class="club-panel" id="fortuneSaved"></div>`
  },

  love: {
    title: 'love letter machine 💌',
    html: `
      <h3>a letter from your future self</h3>
      <p>imagine a kinder version of yourself writing to you.</p>
      <div class="fortune-paper">
        <p id="futureLetter">dear little me, your letter is waiting.</p>
      </div>
      <button id="generateLetter">receive a letter ♡</button>
      <button id="saveFutureLetter">keep this letter</button>
      <div class="club-panel" id="letterStatus"></div>`
  },

  pet: {
    title: 'pocket bunny 🐰',
    html: `
      <h3>meet your tiny companion</h3>
      <div class="pet-stage">
        <div>
          <div class="pet-face" id="petFace">૮ ˶ᵔ ᵕ ᵔ˶ ა</div>
          <p id="petNameLabel">little mochi</p>
          <p id="petMood">i am happy to see you!</p>
        </div>
      </div>
      <div class="club-panel">
        <label for="petNameInput">give your bunny a name</label>
        <input id="petNameInput" maxlength="20"
          placeholder="little mochi">
        <button id="renamePet">save name ♡</button>
      </div>
      <div class="pet-stats">
        <div class="pet-stat">happiness
          <div class="pet-meter"><span id="petHappy"></span></div>
        </div>
        <div class="pet-stat">fullness
          <div class="pet-meter"><span id="petFood"></span></div>
        </div>
        <div class="pet-stat">energy
          <div class="pet-meter"><span id="petEnergy"></span></div>
        </div>
      </div>
      <div class="club-panel">
        <button id="petPat">pet bunny ♡</button>
        <button id="petFeed">give a carrot 🥕</button>
        <button id="petPlay">play together ✧</button>
        <p id="petMessage">your bunny is ready to play.</p>
      </div>`
  },

  room: {
    title: 'my dream room 🛋️',
    html: `
      <h3>decorate your happy place</h3>
      <div class="room-preview" id="roomPreview">
        <div>
          <div class="room-furniture" id="roomFurniture">🪟 🌷</div>
          <div class="room-furniture" id="roomFurniture2">🛏️ 🧸</div>
          <p id="roomCaption">a cozy little bedroom</p>
        </div>
      </div>
      <div class="club-panel">
        <p>choose your wallpaper</p>
        <button data-room-color="#ffe2ef">strawberry pink</button>
        <button data-room-color="#d9f7fa">mint cloud</button>
        <button data-room-color="#eee3ff">lavender dream</button>
        <button data-room-color="#fff0ad">butter sunshine</button>
        <p>choose your furniture</p>
        <button data-furniture="🛏️">bed</button>
        <button data-furniture="🛋️">sofa</button>
        <button data-furniture="🧸">teddy bear</button>
        <button data-furniture="🌷">flowers</button>
        <button data-furniture="🎀">ribbons</button>
        <button data-furniture="🪟">window</button>
        <p id="roomStatus">make yourself at home ♡</p>
      </div>`
  },

  capsule: {
    title: 'time capsule 🫧',
    html: `
      <h3>a message for future you</h3>
      <p>write something you want to remember.
      Your message will stay on this browser until you open it again.</p>
      <div class="club-panel">
        <label for="capsuleText">dear future me...</label>
        <textarea id="capsuleText"
          placeholder="i hope you remember that..."></textarea>
        <button id="sealCapsule">seal my capsule ♡</button>
      </div>
      <div class="capsule-box" id="capsuleResult">
        your time capsule is waiting to be filled.
      </div>
      <button id="openCapsule">open my capsule</button>`
  },

  arcade: {
    title: 'tiny arcade 🎮',
    html: `
      <h3>catch the lucky stars!</h3>
      <p>click the stars before they change.
      Collect as many as you can.</p>
      <div class="club-panel">
        <p id="arcadeScore">stars: 0</p>
        <p id="arcadeTime">time: 15 seconds</p>
        <button id="startArcade">start game ✦</button>
      </div>
      <div class="arcade-board" id="arcadeBoard">
        ${Array.from({ length: 9 }, (_, i) =>
          `<button class="arcade-hole" data-hole="${i}">☁</button>`
        ).join('')}
      </div>
      <p id="arcadeMessage">press start to begin!</p>`
  }
};

let currentFortune = '';
let currentFutureLetter = '';

function openClub(key) {
  const page = clubPages[key];
  if (!page) return;

  clubTitle.textContent = page.title;
  clubContent.innerHTML = page.html;
  clubOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  bindClubActions(key);
}

function closeClub() {
  clubOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-club]').forEach(button => {
  button.addEventListener('click', () => {
    openClub(button.dataset.club);
  });
});

clubClose.addEventListener('click', closeClub);

clubOverlay.addEventListener('click', event => {
  if (event.target === clubOverlay) closeClub();
});

function bindClubActions(key) {
  if (key === 'fortune') bindFortune();
  if (key === 'love') bindLoveLetter();
  if (key === 'pet') bindPet();
  if (key === 'room') bindRoom();
  if (key === 'capsule') bindCapsule();
  if (key === 'arcade') bindArcade();
}

/* fortune cookie */

function bindFortune() {
  const fortunes = [
    'small steps are still steps forward. ♡',
    'you deserve the same kindness you give others.',
    'something lovely can begin with an ordinary day.',
    'you are allowed to grow at your own pace.',
    'your story still has beautiful pages ahead.',
    'rest is part of the journey, too.',
    'you do not have to bloom all at once. 🌷',
    'one little brave thing is enough for today.',
    'you are more than your most difficult day.',
    'leave a little room for unexpected happiness.'
  ];

  const saved = localStorage.getItem('club-fortune');
  if (saved) {
    document.getElementById('fortuneSaved').textContent =
      'saved fortune: ' + saved;
  }

  document.getElementById('openFortune').onclick = () => {
    currentFortune =
      fortunes[Math.floor(Math.random() * fortunes.length)];

    document.getElementById('fortuneMessage').textContent =
      currentFortune;

    makeConfetti(10);
  };

  document.getElementById('saveFortune').onclick = () => {
    if (!currentFortune) {
      showToast('crack your cookie first ♡');
      return;
    }

    localStorage.setItem('club-fortune', currentFortune);
    document.getElementById('fortuneSaved').textContent =
      'saved fortune: ' + currentFortune;

    showToast('a little message has been saved ♡');
  };
}

/* future-self letters */

function bindLoveLetter() {
  const letters = [
    'dear little me, thank you for continuing to try. i hope you give yourself more credit for the things nobody sees. love, your future self ♡',
    'hello, sunshine. you do not need to have every answer today. keep learning, keep resting, and let yourself be a beginner sometimes.',
    'dear me, i hope you remember the tiny things that made you smile. they were never too small to matter. with love, future you.',
    'hi, little star. i am proud of the way you kept discovering who you are. there is still so much joy left to find.',
    'dear heart, please make room for your own happiness, too. you deserve a life that feels gentle and honest.'
  ];

  document.getElementById('generateLetter').onclick = () => {
    currentFutureLetter =
      letters[Math.floor(Math.random() * letters.length)];

    document.getElementById('futureLetter').textContent =
      currentFutureLetter;

    makeConfetti(12);
  };

  document.getElementById('saveFutureLetter').onclick = () => {
    if (!currentFutureLetter) {
      showToast('receive your letter first 💌');
      return;
    }

    localStorage.setItem('club-future-letter', currentFutureLetter);

    document.getElementById('letterStatus').textContent =
      'your letter is safely saved in this browser ♡';

    showToast('letter saved!');
  };
}

/* pocket bunny */

function bindPet() {
  const defaults = {
    name: 'little mochi',
    happy: 65,
    food: 65,
    energy: 75
  };

  let pet;

  try {
    pet = JSON.parse(
      localStorage.getItem('club-pet') || 'null'
    );
  } catch {
    pet = null;
  }

  pet = { ...defaults, ...(pet || {}) };

  const face = document.getElementById('petFace');
  const nameLabel = document.getElementById('petNameLabel');
  const mood = document.getElementById('petMood');
  const message = document.getElementById('petMessage');

  document.getElementById('petNameInput').value = pet.name;

  function renderPet() {
    nameLabel.textContent = pet.name;
    document.getElementById('petHappy').style.width =
      pet.happy + '%';
    document.getElementById('petFood').style.width =
      pet.food + '%';
    document.getElementById('petEnergy').style.width =
      pet.energy + '%';

    mood.textContent = pet.happy > 75
      ? 'i am so happy to see you!'
      : pet.food < 30
        ? 'could i have a little snack?'
        : pet.energy < 25
          ? 'i am getting sleepy...'
          : 'i am happy to be here ♡';

    face.textContent = pet.happy > 75
      ? '૮ ˶ᵔ ᵕ ᵔ˶ ა'
      : '૮ ˶• ༝ •˶ ა';

    localStorage.setItem('club-pet', JSON.stringify(pet));
  }

  document.getElementById('renamePet').onclick = () => {
    const name = document.getElementById('petNameInput')
      .value.trim();

    if (!name) {
      showToast('give your bunny a name ♡');
      return;
    }

    pet.name = name.slice(0, 20);
    message.textContent = 'hello, ' + pet.name + '! ♡';
    renderPet();
  };

  document.getElementById('petPat').onclick = () => {
    pet.happy = Math.min(100, pet.happy + 12);
    pet.energy = Math.max(0, pet.energy - 3);
    message.textContent = pet.name + ' loves your gentle pats!';
    renderPet();
    makeConfetti(5);
  };

  document.getElementById('petFeed').onclick = () => {
    pet.food = Math.min(100, pet.food + 20);
    pet.happy = Math.min(100, pet.happy + 5);
    message.textContent = pet.name + ' enjoyed the carrot! 🥕';
    renderPet();
  };

  document.getElementById('petPlay').onclick = () => {
    if (pet.energy < 10) {
      message.textContent =
        pet.name + ' needs a little rest first.';
      return;
    }

    pet.happy = Math.min(100, pet.happy + 15);
    pet.energy = Math.max(0, pet.energy - 15);
    pet.food = Math.max(0, pet.food - 5);

    message.textContent =
      'you and ' + pet.name + ' had a lovely playtime!';
    renderPet();
    makeConfetti(8);
  };

  renderPet();
}

/* dream room decorator */

function bindRoom() {
  const preview = document.getElementById('roomPreview');
  const furniture = document.getElementById('roomFurniture');
  const furniture2 = document.getElementById('roomFurniture2');

  let items = ['🪟', '🌷', '🛏️', '🧸'];

  const saved = localStorage.getItem('club-room');

  if (saved) {
    try {
      const room = JSON.parse(saved);
      preview.style.background = room.color;
      items = room.items;
    } catch {}
  }

  function renderRoom() {
    furniture.textContent = items.slice(0, 2).join(' ');
    furniture2.textContent = items.slice(2, 4).join(' ');
  }

  clubContent.querySelectorAll('[data-room-color]').forEach(button => {
    button.onclick = () => {
      preview.style.background = button.dataset.roomColor;
      saveRoom();
    };
  });

  clubContent.querySelectorAll('[data-furniture]').forEach(button => {
    button.onclick = () => {
      const item = button.dataset.furniture;

      if (items.includes(item)) {
        items = items.filter(value => value !== item);
      } else {
        items.push(item);
      }

      items = items.slice(-4);
      renderRoom();
      saveRoom();

      document.getElementById('roomStatus').textContent =
        'your little room is taking shape! ♡';
    };
  });

  function saveRoom() {
    localStorage.setItem('club-room', JSON.stringify({
      color: preview.style.background || '#ffe2ef',
      items
    }));
  }

  renderRoom();
}

/* time capsule */

function bindCapsule() {
  const field = document.getElementById('capsuleText');
  const result = document.getElementById('capsuleResult');

  field.value = '';

  const saved = localStorage.getItem('club-capsule');

  result.textContent = saved
    ? 'your capsule is sealed. open it whenever you are ready.'
    : 'your time capsule is waiting to be filled.';

  document.getElementById('sealCapsule').onclick = () => {
    if (!field.value.trim()) {
      showToast('write a little message first ♡');
      return;
    }

    const capsule = {
      text: field.value.trim(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    localStorage.setItem('club-capsule', JSON.stringify(capsule));

    result.textContent =
      'sealed on ' + capsule.date +
      '\n\ncome back when you are ready to read your message.';

    field.value = '';
    showToast('your time capsule is sealed 🫧');
    makeConfetti(10);
  };

  document.getElementById('openCapsule').onclick = () => {
    const raw = localStorage.getItem('club-capsule');

    if (!raw) {
      result.textContent =
        'there is no message inside yet. write one first ♡';
      return;
    }

    try {
      const capsule = JSON.parse(raw);
      result.textContent =
        'a message from your past self ♡\n' +
        capsule.date + '\n\n' + capsule.text;
    } catch {
      result.textContent = raw;
    }
  };
}

/* tiny arcade */

function bindArcade() {
  let score = 0;
  let time = 15;
  let running = false;
  let activeHole = -1;
  let timer = null;
  let switchTimer = null;

  const holes = [
    ...clubContent.querySelectorAll('[data-hole]')
  ];

  const scoreLabel = document.getElementById('arcadeScore');
  const timeLabel = document.getElementById('arcadeTime');
  const message = document.getElementById('arcadeMessage');
  const start = document.getElementById('startArcade');

  function chooseStar() {
    holes.forEach(hole => {
      hole.textContent = '☁';
      hole.classList.remove('hit');
    });

    activeHole = Math.floor(Math.random() * holes.length);
    holes[activeHole].textContent = '⭐';
  }

  function finishGame() {
    running = false;
    clearInterval(timer);
    clearInterval(switchTimer);

    holes.forEach(hole => {
      hole.textContent = '☁';
    });

    activeHole = -1;
    start.disabled = false;
    start.textContent = 'play again ♡';

    message.textContent =
      'you collected ' + score + ' lucky stars! ✧';

    const best = Math.max(
      score,
      Number(localStorage.getItem('club-arcade-best') || 0)
    );

    localStorage.setItem('club-arcade-best', best);

    message.textContent += ' best score: ' + best;
  }

  holes.forEach((hole, index) => {
    hole.onclick = () => {
      if (!running || index !== activeHole) return;

      score++;
      scoreLabel.textContent = 'stars: ' + score;
      hole.textContent = '💖';
      hole.classList.add('hit');

      makeConfetti(2);
      chooseStar();
    };
  });

  start.onclick = () => {
    if (running) return;

    score = 0;
    time = 15;
    running = true;
    start.disabled = true;

    scoreLabel.textContent = 'stars: 0';
    timeLabel.textContent = 'time: 15 seconds';
    message.textContent = 'catch as many stars as you can!';

    chooseStar();

    timer = setInterval(() => {
      time--;
      timeLabel.textContent = 'time: ' + time + ' seconds';

      if (time <= 0) finishGame();
    }, 1000);

    switchTimer = setInterval(() => {
      if (running) chooseStar();
    }, 1100);
  };
}

/* sweetie pie kitchen — interactive cooking world */

(() => {
  const overlay = document.getElementById("cookingOverlay");
  const content = document.getElementById("cookingContent");
  const title = document.getElementById("cookingWindowTitle");
  const close = document.getElementById("closeCooking");

  if (!overlay || !content || !title || !close) return;

  const recipes = {
    pancake: {
      name: "fluffy pancakes",
      emoji: "🥞",
      ingredients: [
        ["🥚", "fresh egg"],
        ["🥛", "milk"],
        ["🌾", "flour"],
        ["🍯", "sugar"],
        ["🧈", "butter"],
        ["🍓", "strawberries"]
      ],
      steps: [
        "let's gather everything for our fluffy pancakes!",
        "perfect! now mix everything into a smooth batter.",
        "pour the batter into the warm pan.",
        "add your favorite toppings and make it pretty!",
        "your fluffy pancakes are ready to serve!"
      ]
    },

    cake: {
      name: "strawberry dream cake",
      emoji: "🍰",
      ingredients: [
        ["🥚", "fresh eggs"],
        ["🥛", "milk"],
        ["🌾", "cake flour"],
        ["🍬", "sugar"],
        ["🍓", "strawberries"],
        ["🍦", "whipped cream"]
      ],
      steps: [
        "let's prepare the sweetest strawberry cake!",
        "mix the eggs, milk, flour, and sugar.",
        "bake your cake until it looks lovely and fluffy.",
        "decorate it with strawberries and whipped cream.",
        "one dreamy strawberry cake, coming right up!"
      ]
    },

    cookies: {
      name: "sugar cookies",
      emoji: "🍪",
      ingredients: [
        ["🧈", "butter"],
        ["🌾", "flour"],
        ["🍬", "sugar"],
        ["🥚", "egg"],
        ["🍫", "chocolate chips"],
        ["🌈", "sprinkles"]
      ],
      steps: [
        "time to make some adorable little cookies!",
        "mix your butter, flour, sugar, and egg.",
        "shape your cookies and bake them until golden.",
        "add chocolate chips and colorful sprinkles.",
        "your little cookies are ready for the cookie jar!"
      ]
    },

    boba: {
      name: "strawberry boba milk",
      emoji: "🧋",
      ingredients: [
        ["🥛", "fresh milk"],
        ["🍓", "strawberry syrup"],
        ["🧊", "ice cubes"],
        ["🧋", "boba pearls"],
        ["🍯", "honey"],
        ["🍒", "cherry topping"]
      ],
      steps: [
        "let's make a sweet and refreshing boba drink!",
        "combine the milk, strawberry syrup, and honey.",
        "add ice and give everything a good shake.",
        "pour in the boba pearls and add a cherry.",
        "your pink boba milk is ready to enjoy!"
      ]
    },

    waffle: {
      name: "honey cloud waffles",
      emoji: "🧇",
      ingredients: [
        ["🥚", "fresh egg"],
        ["🥛", "milk"],
        ["🌾", "flour"],
        ["🧈", "butter"],
        ["🍯", "golden honey"],
        ["🫐", "blueberries"]
      ],
      steps: [
        "let's make golden waffles for a cozy morning!",
        "mix the flour, milk, egg, and melted butter.",
        "cook the batter in your waffle maker.",
        "drizzle honey and add blueberries on top.",
        "your honey cloud waffles are ready!"
      ]
    },

    donut: {
      name: "rainbow dream donuts",
      emoji: "🍩",
      ingredients: [
        ["🌾", "flour"],
        ["🥛", "milk"],
        ["🍬", "sugar"],
        ["🧈", "butter"],
        ["🍫", "chocolate glaze"],
        ["🌈", "rainbow sprinkles"]
      ],
      steps: [
        "welcome to the little donut bakery!",
        "mix the flour, milk, sugar, and butter.",
        "shape the donuts and cook them until ready.",
        "cover them with chocolate glaze and sprinkles.",
        "rainbow dream donuts are ready to serve!"
      ]
    }
  };

  const starters = {
    pancake: "🥣",
    cake: "🥣",
    cookies: "🍪",
    boba: "🥛",
    waffle: "🥣",
    donut: "🍩"
  };

  const defaults = {
    points: 0,
    level: 1,
    made: 0,
    unlocked: ["pancake", "cake", "cookies", "boba", "waffle", "donut"],
    purchased: []
  };

  function loadData() {
    try {
      const saved = JSON.parse(
        localStorage.getItem("sweetie-pie-progress") || "null"
      );

      return { ...defaults, ...(saved || {}) };
    } catch {
      return { ...defaults };
    }
  }

  let data = loadData();
  let activeRecipe = null;
  let selected = [];
  let stage = 0;
  let decoration = "🍓";
  let currentOrder = null;
  let orderFinished = false;

  const stageNames = [
    "ingredient station",
    "mixing room",
    "the oven corner",
    "decoration table",
    "ready to serve"
  ];

  const toppingOptions = [
    "🍓", "🍒", "🫐", "🍫", "🍦",
    "🍯", "🌈", "🎀", "✨", "🍬"
  ];

  function saveData() {
    localStorage.setItem(
      "sweetie-pie-progress",
      JSON.stringify(data)
    );

    updateKitchenStats();
  }

  function updateKitchenStats() {
    const score = document.getElementById("kitchenScore");
    const level = document.getElementById("kitchenLevel");
    const points = document.getElementById("sweetPoints");

    if (score) score.textContent = `treats made: ${data.made}`;
    if (level) level.textContent = data.level;
    if (points) points.textContent = data.points;
  }

  function safeText(value) {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
  }

  function notify(message) {
    const chef = document.getElementById("chefMessage");
    if (chef) chef.textContent = message;
  }

  function sparkle(amount = 8) {
    const symbols = ["♡", "✦", "✿", "୨୧", "⋆"];

    for (let i = 0; i < amount; i++) {
      const star = document.createElement("span");

      star.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      Object.assign(star.style, {
        position: "fixed",
        left: Math.random() * 94 + 3 + "vw",
        top: Math.random() * 85 + 5 + "vh",
        zIndex: "10001",
        pointerEvents: "none",
        color: ["#f17cae", "#b5a2f3", "#e4bb53"][
          Math.floor(Math.random() * 3)
        ],
        fontSize: 12 + Math.random() * 20 + "px",
        animation: "sweetieSparkle .9s ease-out forwards"
      });

      document.body.appendChild(star);

      setTimeout(() => star.remove(), 950);
    }
  }

  function openWindow(windowTitle, html) {
    title.textContent = windowTitle;
    content.innerHTML = html;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeWindow() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  close.addEventListener("click", closeWindow);

  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeWindow();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeWindow();
  });

  /* recipe selection */

  document.querySelectorAll("[data-recipe]").forEach(button => {
    button.addEventListener("click", () => {
      openRecipe(button.dataset.recipe);
    });
  });

  function openRecipe(key) {
    const recipe = recipes[key];
    if (!recipe) return;

    activeRecipe = key;
    selected = [];
    stage = 0;
    decoration = "🍓";
    orderFinished = false;

    renderCooking();
  }

  function renderCooking() {
    const recipe = recipes[activeRecipe];
    if (!recipe) return;

    const ingredientButtons = recipe.ingredients.map(
      ([emoji, name], index) => `
        <button class="cook-ingredient ${
          selected.includes(index) ? "selected" : ""
        }" data-ingredient-index="${index}"
          ${stage !== 0 ? "disabled" : ""}>
          <span>${emoji}</span>
          ${name}
          ${selected.includes(index) ? " ✓" : ""}
        </button>
      `
    ).join("");

    const decorations = toppingOptions.map(item => `
      <button class="cook-ingredient ${
        decoration === item ? "selected" : ""
      }" data-topping="${item}">
        <span>${item}</span>
        ${decoration === item ? "selected" : "add topping"}
      </button>
    `).join("");

    const progress = stage * 25;
    const currentEmoji = stage === 0
      ? starters[activeRecipe]
      : stage === 1
        ? "🥣"
        : stage === 2
          ? recipe.emoji
          : stage === 3
            ? decoration + recipe.emoji
            : recipe.emoji + decoration;

    let description = recipe.steps[stage];

    if (stage === 0) {
      description += " Choose at least three ingredients to continue.";
    }

    if (stage === 1) {
      description += " Press the button when the mixture is ready.";
    }

    if (stage === 2) {
      description += " Give your dessert a moment to bake.";
    }

    if (stage === 3) {
      description += " Choose a topping for your masterpiece.";
    }

    const action = stage === 0
      ? "mix ingredients →"
      : stage === 1
        ? "start cooking →"
        : stage === 2
          ? "finish baking →"
          : stage === 3
            ? "serve dessert ♡"
            : "make another treat ↻";

    openWindow(
      recipe.emoji + " " + recipe.name,
      `
        <p class="game-counter">
          step ${stage + 1} of 5 · ${stageNames[stage]}
        </p>

        <h3>${safeText(recipe.name)}</h3>

        <div class="cook-stage">
          <div>
            <div class="cook-food" id="cookingFood">${currentEmoji}</div>
            <p id="cookingDescription">${safeText(description)}</p>
          </div>
        </div>

        <div class="cook-progress">
          <span style="width:${progress}%"></span>
        </div>

        ${
          stage === 0
            ? `<div class="cook-ingredients">${ingredientButtons}</div>
               <p>selected: <strong id="selectedCount">${selected.length}</strong> / 6</p>`
            : ""
        }

        ${
          stage === 3
            ? `<p>pick your finishing touch!</p>
               <div class="cook-ingredients">${decorations}</div>`
            : ""
        }

        ${
          stage === 4
            ? `<div class="cook-order">
                 <strong>your finished creation</strong>
                 <span>${recipe.emoji} ${decoration}</span>
               </div>
               <div class="cook-message">
                 ${orderFinished
                   ? "wonderful work, little chef! your treat is complete ♡"
                   : "one sweet creation, made with love."}
               </div>`
            : ""
        }

        <div class="cook-actions">
          <button id="nextCookingStep">
            ${action}
          </button>
          <button id="restartCooking">start over ↻</button>
          <button id="leaveCooking">back to kitchen</button>
        </div>

        <p id="cookingNotice" class="cook-message">
          ${stage === 0
            ? "choose the ingredients you want to use."
            : "you're doing wonderfully, little chef! ♡"}
        </p>
      `
    );

    bindCooking();
  }

  function bindCooking() {
    const recipe = recipes[activeRecipe];

    content.querySelectorAll("[data-ingredient-index]").forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.ingredientIndex);

        if (selected.includes(index)) {
          selected = selected.filter(item => item !== index);
        } else {
          selected.push(index);
        }

        const counter = document.getElementById("selectedCount");
        if (counter) counter.textContent = selected.length;

        button.classList.toggle("selected", selected.includes(index));

        button.innerHTML = `
          <span>${recipe.ingredients[index][0]}</span>
          ${recipe.ingredients[index][1]}
          ${selected.includes(index) ? " ✓" : ""}
        `;

        const notice = document.getElementById("cookingNotice");
        if (notice) {
          notice.textContent =
            `${selected.length} ingredients selected.`;
        }
      });
    });

    content.querySelectorAll("[data-topping]").forEach(button => {
      button.addEventListener("click", () => {
        decoration = button.dataset.topping;

        content.querySelectorAll("[data-topping]").forEach(item => {
          item.classList.toggle(
            "selected",
            item.dataset.topping === decoration
          );
        });

        const food = document.getElementById("cookingFood");
        if (food) food.textContent = decoration + recipe.emoji;
      });
    });

    document.getElementById("nextCookingStep").onclick = () => {
      if (stage === 0 && selected.length < 3) {
        document.getElementById("cookingNotice").textContent =
          "choose at least three ingredients first! ♡";
        return;
      }

      if (stage === 4) {
        if (!orderFinished) {
          orderFinished = true;
          data.made++;
          data.points += 10;

          const previousLevel = data.level;
          data.level = Math.floor(data.made / 3) + 1;

          saveData();
          notify("a new treat has been made! 🍰");
          sparkle(15);

          const notice = document.getElementById("cookingNotice");
          notice.textContent = data.level > previousLevel
            ? `level up! you're now a level ${data.level} chef!`
            : "+10 sweet points! wonderful baking!";

          document.getElementById("nextCookingStep").textContent =
            "make another treat ↻";

          return;
        }

        openRecipe(activeRecipe);
        return;
      }

      stage++;

      if (stage === 4) {
        orderFinished = false;
      }

      renderCooking();
    };

    document.getElementById("restartCooking").onclick = () => {
      openRecipe(activeRecipe);
    };

    document.getElementById("leaveCooking").onclick = closeWindow;
  }

  /* recipe book: opens another page */

  document.getElementById("openRecipeBook")?.addEventListener("click", () => {
    openWindow("📖 little recipe book", `
      <h3>the sweet recipe collection</h3>
      <p>choose a recipe to open its own cooking room.</p>

      <div class="cook-ingredients">
        ${Object.entries(recipes).map(([key, recipe]) => `
          <button class="cook-ingredient" data-book-recipe="${key}">
            <span>${recipe.emoji}</span>
            ${safeText(recipe.name)}
          </button>
        `).join("")}
      </div>

      <div class="cook-message">
        recipes completed: ${data.made}<br>
        chef level: ${data.level}<br>
        sweet points: ${data.points}
      </div>
    `);

    content.querySelectorAll("[data-book-recipe]").forEach(button => {
      button.addEventListener("click", () => {
        openRecipe(button.dataset.bookRecipe);
      });
    });
  });

  /* kitchen shop */

  const shopItems = [
    { id: "pink-apron", name: "pink chef apron", emoji: "🎀", price: 20 },
    { id: "golden-spoon", name: "golden spoon", emoji: "🥄", price: 30 },
    { id: "strawberry-bowl", name: "strawberry bowl", emoji: "🍓", price: 25 },
    { id: "magic-whisk", name: "magic whisk", emoji: "🪄", price: 40 },
    { id: "cookie-jar", name: "cookie jar", emoji: "🍪", price: 35 },
    { id: "rainbow-oven", name: "rainbow oven", emoji: "🌈", price: 60 }
  ];

  document.getElementById("openKitchenShop")?.addEventListener("click", () => {
    renderShop();
  });

  function renderShop() {
    openWindow("🛍️ the little kitchen shop", `
      <h3>a little shopping spree</h3>
      <p>collect sweet points by making desserts, then choose your kitchen treasures.</p>

      <div class="cook-message">
        your balance: <strong>${data.points}</strong> sweet points ♡
      </div>

      <div class="cook-ingredients">
        ${shopItems.map(item => {
          const owned = data.purchased.includes(item.id);

          return `
            <button class="cook-ingredient" data-buy-item="${item.id}"
              ${owned ? "disabled" : ""}>
              <span>${item.emoji}</span>
              ${safeText(item.name)}
              <br>
              ${owned ? "collected ✓" : item.price + " points"}
            </button>
          `;
        }).join("")}
      </div>

      <p id="shopNotice" class="cook-message">
        your tiny kitchen deserves something lovely.
      </p>
    `);

    content.querySelectorAll("[data-buy-item]").forEach(button => {
      button.addEventListener("click", () => {
        const item = shopItems.find(
          product => product.id === button.dataset.buyItem
        );

        if (!item || data.purchased.includes(item.id)) return;

        const notice = document.getElementById("shopNotice");

        if (data.points < item.price) {
          notice.textContent =
            "not enough sweet points yet. bake a few more treats! ♡";
          return;
        }

        data.points -= item.price;
        data.purchased.push(item.id);

        saveData();
        sparkle(8);
        renderShop();
      });
    });
  }

  /* little welcome animation */

  if (!document.getElementById("sweetieSparkleStyle")) {
    const style = document.createElement("style");
    style.id = "sweetieSparkleStyle";

    style.textContent = `
      @keyframes sweetieSparkle {
        0% {
          opacity: 0;
          transform: translateY(10px) scale(.4) rotate(0deg);
        }
        30% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translateY(-65px) scale(1.3) rotate(90deg);
        }
      }
    `;

    document.head.appendChild(style);
  }

  updateKitchenStats();
})();

/* starry catcher — actual playable mini-game */

(() => {
  const canvas = document.getElementById("starCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("starGameOverlay");
  const intro = document.getElementById("starIntro");
  const result = document.getElementById("starResult");

  const scoreEl = document.getElementById("starScore");
  const timeEl = document.getElementById("starTime");
  const livesEl = document.getElementById("starLives");
  const bestEl = document.getElementById("starBestScore");

  const W = canvas.width;
  const H = canvas.height;

  let player;
  let objects = [];
  let particles = [];
  let score = 0;
  let lives = 3;
  let timeLeft = 30;
  let running = false;
  let animationId = 0;
  let spawnClock = 0;
  let lastTime = 0;
  let elapsed = 0;
  let keys = {};
  let pointerDirection = 0;
  let best = 0;

  try {
    best = Number(localStorage.getItem("starry-catcher-best")) || 0;
  } catch {}

  bestEl.textContent = best;

  function openGame() {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    intro.hidden = false;
    result.hidden = true;
    drawScene();
  }

  function closeGame() {
    running = false;
    cancelAnimationFrame(animationId);
    animationId = 0;
    keys = {};
    pointerDirection = 0;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.getElementById("launchStarGame")
    .addEventListener("click", openGame);

  document.getElementById("exitStarGame")
    .addEventListener("click", closeGame);

  document.getElementById("leaveStarGame")
    .addEventListener("click", closeGame);

  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeGame();
  });

  document.addEventListener("keydown", event => {
    if ([
      "ArrowLeft", "ArrowRight", " ", "a", "d", "A", "D"
    ].includes(event.key)) {
      if (overlay.classList.contains("open")) {
        event.preventDefault();
      }
    }

    keys[event.key.toLowerCase()] = true;
    keys[event.key] = true;
  });

  document.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;
    keys[event.key] = false;
  });

  function bindHold(buttonId, direction) {
    const button = document.getElementById(buttonId);

    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      pointerDirection = direction;

      try {
        button.setPointerCapture(event.pointerId);
      } catch {}
    });

    ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => {
      button.addEventListener(type, () => {
        if (pointerDirection === direction) {
          pointerDirection = 0;
        }
      });
    });
  }

  bindHold("moveStarLeft", -1);
  bindHold("moveStarRight", 1);

  document.getElementById("beginStarGame")
    .addEventListener("click", startGame);

  document.getElementById("replayStarGame")
    .addEventListener("click", startGame);

  function startGame() {
    cancelAnimationFrame(animationId);

    score = 0;
    lives = 3;
    timeLeft = 30;
    elapsed = 0;
    spawnClock = 0;
    lastTime = 0;
    objects = [];
    particles = [];
    keys = {};
    pointerDirection = 0;

    player = {
      x: W / 2,
      y: H - 55,
      width: 58,
      height: 30,
      speed: 270
    };

    running = true;
    intro.hidden = true;
    result.hidden = true;

    updateHUD();
    drawScene();

    animationId = requestAnimationFrame(loop);
  }

  function updateHUD() {
    scoreEl.textContent = score;
    timeEl.textContent = Math.max(0, Math.ceil(timeLeft));
    livesEl.textContent =
      "♥ ".repeat(lives).trim() + " ♡ ".repeat(3 - lives);
  }

  function spawnObject() {
    const cloud = Math.random() < 0.29;

    objects.push({
      x: 20 + Math.random() * (W - 40),
      y: -25,
      size: cloud ? 25 : 19 + Math.random() * 5,
      speed: (cloud ? 125 : 100) + Math.random() * 80
        + Math.min(score * 1.5, 100),
      type: cloud ? "cloud" : "star",
      rotation: Math.random() * 6,
      spin: (Math.random() - 0.5) * 2
    });
  }

  function loop(timestamp) {
    if (!running) return;

    if (!lastTime) lastTime = timestamp;

    const dt = Math.min((timestamp - lastTime) / 1000, 0.035);
    lastTime = timestamp;

    elapsed += dt;
    timeLeft = Math.max(0, 30 - elapsed);

    updatePlayer(dt);
    updateObjects(dt);
    updateParticles(dt);
    drawScene();
    updateHUD();

    if (timeLeft <= 0 || lives <= 0) {
      endGame();
      return;
    }

    animationId = requestAnimationFrame(loop);
  }

  function updatePlayer(dt) {
    let direction = 0;

    if (keys.ArrowLeft || keys.a) direction -= 1;
    if (keys.ArrowRight || keys.d) direction += 1;

    if (pointerDirection) direction = pointerDirection;

    player.x += direction * player.speed * dt;

    player.x = Math.max(
      player.width / 2,
      Math.min(W - player.width / 2, player.x)
    );
  }

  function updateObjects(dt) {
    spawnClock += dt;

    const spawnRate = Math.max(0.24, 0.65 - score * 0.003);

    if (spawnClock >= spawnRate) {
      spawnClock = 0;
      spawnObject();

      if (score >= 15 && Math.random() < 0.2) {
        spawnObject();
      }
    }

    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];

      obj.y += obj.speed * dt;
      obj.rotation += obj.spin * dt;

      const hitX = Math.abs(obj.x - player.x) <
        player.width / 2 + obj.size * 0.6;

      const hitY = Math.abs(obj.y - player.y) <
        player.height / 2 + obj.size * 0.6;

      if (hitX && hitY) {
        if (obj.type === "star") {
          score++;
          burst(obj.x, obj.y, "⭐", 7);
        } else {
          lives--;
          burst(obj.x, obj.y, "☁️", 8);
        }

        objects.splice(i, 1);
        continue;
      }

      if (obj.y > H + 35) {
        objects.splice(i, 1);
      }
    }
  }

  function burst(x, y, emoji, count) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 180,
        vy: (Math.random() - 0.8) * 160,
        life: 0.6,
        emoji
      });
    }
  }

  function updateParticles(dt) {
    particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    });

    particles = particles.filter(p => p.life > 0);
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);

    gradient.addColorStop(0, "#c4f3f0");
    gradient.addColorStop(1, "#f5e2ff");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#ffffff88";

    for (let i = 0; i < 28; i++) {
      const x = (i * 79 + 25) % W;
      const y = (i * 103 + 35) % H;

      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#ffffff75";

    for (let i = 0; i < 5; i++) {
      const x = ((i * 125 + elapsed * 8) % (W + 100)) - 50;
      const y = 65 + i * 95;

      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.arc(x + 23, y - 8, 27, 0, Math.PI * 2);
      ctx.arc(x + 48, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStar(x, y, radius, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.beginPath();

    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      const r = i % 2 === 0 ? radius : radius * 0.45;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.closePath();
    ctx.fillStyle = "#ffcf5d";
    ctx.strokeStyle = "#b98556";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function drawBasket() {
    ctx.save();
    ctx.translate(player.x, player.y);

    ctx.fillStyle = "#ed8fbd";
    ctx.strokeStyle = "#a86d94";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, 20, Math.PI, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-29, -8);
    ctx.lineTo(-23, 15);
    ctx.quadraticCurveTo(0, 29, 23, 15);
    ctx.lineTo(29, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffe3ef";

    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(i * 10, 6, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = "17px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("♡", 0, -25);

    ctx.restore();
  }

  function drawScene() {
    drawBackground();

    objects.forEach(obj => {
      if (obj.type === "star") {
        drawStar(obj.x, obj.y, obj.size, obj.rotation);
      } else {
        ctx.font = `${obj.size * 1.8}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("☁️", obj.x, obj.y + 9);
      }
    });

    if (player) drawBasket();

    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life / 0.6);
      ctx.font = "18px sans-serif";
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.globalAlpha = 1;
    });
  }

  function endGame() {
    running = false;
    cancelAnimationFrame(animationId);
    animationId = 0;

    if (score > best) {
      best = score;
      bestEl.textContent = best;

      try {
        localStorage.setItem("starry-catcher-best", String(best));
      } catch {}
    }

    document.getElementById("resultMascot").textContent =
      score >= 20 ? "👑" : score >= 10 ? "🌟" : "☁️";

    document.getElementById("resultTitle").textContent =
      score >= 20
        ? "star-catching superstar!"
        : score >= 10
          ? "you did wonderfully!"
          : "keep chasing your dreams!";

    document.getElementById("resultText").textContent =
      `you caught ${score} stars! ${
        lives === 0
          ? "the clouds got a little too close."
          : "your little adventure has ended."
      }`;

    result.hidden = false;
  }

  drawScene();
})();
/* =========================================
   GAME PARADISE — GAME ENGINE
========================================= */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const root = $("gameCenter");
  if (!root || root.dataset.gcReady) return;
  root.dataset.gcReady = "yes";

  const screen = $("gcScreen");
  const views = {
    dress: $("gcDressView"),
    rhythm: $("gcRhythmView"),
    pet: $("gcPetView"),
    stars: $("gcStarsView")
  };

  let currentGame = "";
  let totalCoins = 0;
  let bestLevel = 1;

  try {
    totalCoins = Number(localStorage.getItem("gcCoins")) || 0;
    bestLevel = Number(localStorage.getItem("gcLevel")) || 1;
  } catch (_) {}

  function updateProfile() {
    $("gcCoins").textContent = totalCoins;
    $("gcLevel").textContent = bestLevel;
    try {
      localStorage.setItem("gcCoins", totalCoins);
      localStorage.setItem("gcLevel", bestLevel);
    } catch (_) {}
  }

  function reward(amount) {
    totalCoins += amount;
    bestLevel = Math.max(bestLevel, Math.floor(totalCoins / 50) + 1);
    updateProfile();
  }

  updateProfile();

  function openGame(name) {
    if (!views[name]) return;
    stopRhythm();
    stopStars();

    currentGame = name;
    Object.values(views).forEach(view => view.hidden = true);
    views[name].hidden = false;

    const titles = {
      dress: "closet cutie",
      rhythm: "beat bubble!",
      pet: "tiny pet club",
      stars: "starry scramble"
    };

    $("gcWindowTitle").textContent = titles[name];
    $("gcWindowFooter").textContent = "playing: " + titles[name];
    screen.classList.add("gc-open");
    screen.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (name === "stars") drawStarScene();
    if (name === "pet") renderPet();
  }

  function closeGame() {
    screen.classList.remove("gc-open");
    screen.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    stopRhythm();
    stopStars();
    currentGame = "";
  }

  root.querySelectorAll("[data-game]").forEach(card => {
    card.addEventListener("click", () => openGame(card.dataset.game));
  });

  $("gcClose").addEventListener("click", closeGame);

  screen.addEventListener("click", event => {
    if (event.target === screen) closeGame();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && screen.classList.contains("gc-open")) {
      closeGame();
    }
  });

  /* =========================================
     GAME 1 — CLOSET CUTIE
  ========================================= */
  const outfitState = {
    hair: "🎀",
    outfit: "👗",
    shoes: "👢"
  };

  const lookNames = [
    "sugar plum look", "cotton candy dream",
    "little star outfit", "strawberry day",
    "dreamy pastel mood", "tiny fashion icon"
  ];

  function applyOutfit(part, value) {
    if (!Object.prototype.hasOwnProperty.call(outfitState, part)) return;
    outfitState[part] = value;

    const target = {
      hair: "gcHair",
      outfit: "gcOutfit",
      shoes: "gcShoes"
    }[part];

    $(target).textContent = value;

    root.querySelectorAll(`[data-part="${part}"]`).forEach(button => {
      button.classList.toggle("gc-selected", button.dataset.value === value);
    });

    $("gcLookName").textContent =
      lookNames[Math.floor(Math.random() * lookNames.length)];
  }

  root.querySelectorAll("[data-part]").forEach(button => {
    button.addEventListener("click", () => {
      applyOutfit(button.dataset.part, button.dataset.value);
    });
  });

  $("gcSaveLook").addEventListener("click", () => {
    reward(5);
    $("gcDressMessage").textContent =
      "saved! +5 sparkle coins ♡";
    $("gcLookName").textContent = "♡ saved dream look ♡";
  });

  Object.entries(outfitState).forEach(([part, value]) => {
    applyOutfit(part, value);
  });

  /* =========================================
     GAME 2 — BEAT BUBBLE
  ========================================= */
  const rhythmArena = $("gcRhythmArena");
  let rhythmRunning = false;
  let rhythmTimer = null;
  let rhythmSpawner = null;
  let rhythmScore = 0;
  let rhythmCombo = 0;
  let rhythmTime = 25;
  let rhythmBest = 0;
  let rhythmNotes = [];

  function showRhythmFeedback(message) {
    const feedback = $("gcRhythmFeedback");
    feedback.textContent = message;
    feedback.classList.remove("gc-show");
    void feedback.offsetWidth;
    feedback.classList.add("gc-show");
  }

  function updateRhythmHud() {
    $("gcRhythmScore").textContent = rhythmScore;
    $("gcRhythmTime").textContent = rhythmTime;
    $("gcCombo").textContent = rhythmCombo;
  }

  function removeRhythmNotes() {
    rhythmNotes.forEach(note => note.remove());
    rhythmNotes = [];
  }

  function stopRhythm() {
    rhythmRunning = false;
    clearInterval(rhythmTimer);
    clearInterval(rhythmSpawner);
    rhythmTimer = null;
    rhythmSpawner = null;
  }

  function spawnRhythmNote() {
    if (!rhythmRunning) return;

    const note = document.createElement("button");
    note.className = "gc-rhythm-note";
    note.type = "button";
    note.textContent = ["♪", "♫", "♡", "✦", "★"][
      Math.floor(Math.random() * 5)
    ];
    note.setAttribute("aria-label", "Tap the floating note");

    const maxX = Math.max(10, rhythmArena.clientWidth - 65);
    const maxY = Math.max(60, rhythmArena.clientHeight - 70);

    note.style.left = Math.random() * maxX + "px";
    note.style.top = (55 + Math.random() * Math.max(10, maxY - 55)) + "px";

    const noteData = { element: note, timer: null };
    rhythmNotes.push(noteData);

    note.addEventListener("click", () => {
      if (!rhythmRunning) return;

      clearTimeout(noteData.timer);
      note.remove();
      rhythmNotes = rhythmNotes.filter(item => item !== noteData);

      rhythmCombo++;
      rhythmScore += Math.min(10, 1 + Math.floor(rhythmCombo / 5));
      updateRhythmHud();
      showRhythmFeedback(
        rhythmCombo >= 10 ? "AMAZING!! ✨" :
        rhythmCombo >= 5 ? "perfect! ♡" : "nice!! +"
      );
    });

    rhythmArena.appendChild(note);

    noteData.timer = setTimeout(() => {
      note.remove();
      rhythmNotes = rhythmNotes.filter(item => item !== noteData);
      if (rhythmRunning) {
        rhythmCombo = 0;
        updateRhythmHud();
      }
    }, 2300);
  }

  function finishRhythm() {
    stopRhythm();
    removeRhythmNotes();

    const oldStart = $("gcRhythmStart");
    oldStart.style.display = "flex";
    oldStart.innerHTML = `
      <div>🏆</div>
      <h3>beat completed!</h3>
      <p>you collected ${rhythmScore} points with a best combo of ${rhythmBest}x!</p>
      <button class="gc-action-btn" id="gcRhythmFinish">play again ♫</button>
    `;

    $("gcRhythmFinish").addEventListener("click", startRhythm);
    reward(Math.floor(rhythmScore / 5));
  }

  function startRhythm() {
    stopRhythm();
    removeRhythmNotes();

    rhythmRunning = true;
    rhythmScore = 0;
    rhythmCombo = 0;
    rhythmBest = 0;
    rhythmTime = 25;

    const startPanel = $("gcRhythmStart");
    startPanel.style.display = "none";
    updateRhythmHud();

    rhythmSpawner = setInterval(spawnRhythmNote, 650);
    spawnRhythmNote();

    rhythmTimer = setInterval(() => {
      rhythmTime--;
      rhythmBest = Math.max(rhythmBest, rhythmCombo);
      updateRhythmHud();

      if (rhythmTime <= 0) {
        finishRhythm();
      }
    }, 1000);
  }

  $("gcRhythmBegin").addEventListener("click", startRhythm);
  $("gcRhythmAgain").addEventListener("click", () => {
    const startPanel = $("gcRhythmStart");
    startPanel.style.display = "flex";
    startPanel.innerHTML = `
      <div>🎧</div>
      <h3>ready, music lover?</h3>
      <p>tap as many floating notes as you can in 25 seconds!</p>
      <button class="gc-action-btn" id="gcRhythmBegin">start the beat ♫</button>
    `;
    $("gcRhythmBegin").addEventListener("click", startRhythm);
    stopRhythm();
    removeRhythmNotes();
  });

  /* =========================================
     GAME 3 — TINY PET CLUB
  ========================================= */
  const pet = {
    name: "mochi",
    hunger: 70,
    happy: 70,
    clean: 70,
    emoji: "🐱"
  };

  const petMessages = {
    feed: ["nom nom nom! 🍓", "yummy! happy tummy ♡", "best snack ever!"],
    play: ["WHEEEE!! 🧸", "playtime is the best!", "your pet zooms around!"],
    wash: ["splish splash! 🫧", "all clean and shiny!", "smells like flowers!"],
    sleep: ["zzz... sweet dreams 🌙", "tiny nap time!", "recharging cuteness..."]
  };

  function clampStat(value) {
    return Math.max(0, Math.min(100, value));
  }

  function setStat(name, value) {
    pet[name] = clampStat(value);

    const ids = {
      hunger: ["gcHungerLabel", "gcHungerBar"],
      happy: ["gcHappyLabel", "gcHappyBar"],
      clean: ["gcCleanLabel", "gcCleanBar"]
    };

    const [label, bar] = ids[name];
    $(label).textContent = pet[name] + "%";
    $(bar).style.width = pet[name] + "%";
  }

  function renderPet() {
    const enteredName = $("gcPetName").value.trim();
    pet.name = enteredName || "mochi";

    $("gcPetEmoji").textContent = pet.emoji;
    $("gcPetPreview").textContent = pet.emoji;

    const average = (pet.hunger + pet.happy + pet.clean) / 3;
    $("gcPetMood").textContent =
      average > 80 ? "living the dream! ✨" :
      average > 55 ? "happy little bean! ♡" :
      average > 30 ? "needs a little love..." :
      "please take care of me 🥺";

    setStat("hunger", pet.hunger);
    setStat("happy", pet.happy);
    setStat("clean", pet.clean);
  }

  $("gcPetName").addEventListener("input", renderPet);

  root.querySelectorAll("[data-pet-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.petAction;
      let message = "";

      if (action === "feed") {
        setStat("hunger", pet.hunger + 25);
        setStat("happy", pet.happy + 5);
      } else if (action === "play") {
        setStat("happy", pet.happy + 25);
        setStat("hunger", pet.hunger - 7);
        setStat("clean", pet.clean - 5);
      } else if (action === "wash") {
        setStat("clean", pet.clean + 30);
        setStat("happy", pet.happy + 5);
      } else if (action === "sleep") {
        setStat("hunger", pet.hunger - 5);
        setStat("happy", pet.happy + 10);
        setStat("clean", pet.clean - 3);
      }

      const options = petMessages[action];
      message = options[Math.floor(Math.random() * options.length)];

      $("gcPetMessage").textContent = pet.name + ": " + message;
      $("gcPetEmoji").animate(
        [
          { transform: "translateY(0) scale(1)" },
          { transform: "translateY(-20px) scale(1.1)" },
          { transform: "translateY(0) scale(1)" }
        ],
        { duration: 400, easing: "ease-out" }
      );

      renderPet();
      $("gcPetMessage").textContent = pet.name + ": " + message;
      reward(1);
    });
  });

  /* =========================================
     GAME 4 — STARRY SCRAMBLE
  ========================================= */
  const canvas = $("gcStarCanvas");
  const ctx = canvas.getContext("2d");

  let starFrame = 0;
  let starRunning = false;
  let starAnimation = 0;
  let starTimer = null;
  let starScore = 0;
  let starTime = 30;
  let starLives = 3;
  let starObjects = [];
  let starKeys = { left: false, right: false };
  let starLastTime = 0;
  let starSpawnClock = 0;

  const player = { x: 320, y: 370, width: 65, speed: 310 };
  const skyDots = Array.from({ length: 60 }, () => ({
    x: Math.random() * 640,
    y: Math.random() * 430,
    size: Math.random() * 2 + 0.5,
    phase: Math.random() * 6
  }));

  function drawStarScene() {
    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#40396f");
    gradient.addColorStop(1, "#9275bb");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    skyDots.forEach(dot => {
      ctx.globalAlpha = 0.5 + Math.sin(starFrame * 0.03 + dot.phase) * 0.4;
      ctx.fillStyle = "#fff8d7";
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    ctx.fillStyle = "#d9b7ef";
    ctx.fillRect(0, height - 25, width, 25);
    ctx.fillStyle = "#f4d2f0";
    for (let x = 0; x < width; x += 26) {
      ctx.fillRect(x, height - 25, 13, 4);
    }

    if (!starRunning) {
      ctx.font = "28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("✦   ✧   ☆   ✧   ✦", width / 2, 75);
    }

    starObjects.forEach(obj => {
      ctx.font = `${obj.size * 2}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(obj.type === "star" ? "⭐" : "☁️", obj.x, obj.y);
    });

    ctx.font = "54px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🧺", player.x, player.y);

    starFrame++;
  }

  function updateStarHud() {
    $("gcStarScore").textContent = starScore;
    $("gcStarTime").textContent = starTime;
    $("gcStarLives").textContent =
      "♡".repeat(starLives) + "♡".repeat(3 - starLives).replace(/♡/g, "·");
  }

  function stopStars() {
    starRunning = false;
    cancelAnimationFrame(starAnimation);
    clearInterval(starTimer);
    starTimer = null;
    starKeys.left = false;
    starKeys.right = false;
  }

  function startStars() {
    stopStars();

    starRunning = true;
    starScore = 0;
    starTime = 30;
    starLives = 3;
    starObjects = [];
    starSpawnClock = 0;
    starLastTime = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;

    $("gcStarIntro").hidden = true;
    $("gcStarResult").hidden = true;
    updateStarHud();

    starTimer = setInterval(() => {
      if (!starRunning) return;
      starTime--;
      updateStarHud();

      if (starTime <= 0) finishStars();
    }, 1000);

    starAnimation = requestAnimationFrame(starLoop);
  }

  function spawnStarObject() {
    const isStar = Math.random() > 0.32;
    starObjects.push({
      x: 25 + Math.random() * (canvas.width - 50),
      y: -25,
      size: isStar ? 17 : 20,
      type: isStar ? "star" : "cloud",
      speed: 100 + Math.random() * 95 + (30 - starTime) * 2
    });
  }

  function starLoop(timestamp) {
    if (!starRunning) return;

    const dt = Math.min((timestamp - (starLastTime || timestamp)) / 1000, 0.035);
    starLastTime = timestamp;
    starSpawnClock += dt;

    if (starSpawnClock > Math.max(0.24, 0.65 - (30 - starTime) * 0.012)) {
      spawnStarObject();
      starSpawnClock = 0;
    }

    if (starKeys.left) player.x -= player.speed * dt;
    if (starKeys.right) player.x += player.speed * dt;

    player.x = Math.max(30, Math.min(canvas.width - 30, player.x));

    for (let i = starObjects.length - 1; i >= 0; i--) {
      const obj = starObjects[i];
      obj.y += obj.speed * dt;

      const hit =
        Math.abs(obj.x - player.x) < obj.size + 26 &&
        Math.abs(obj.y - player.y) < obj.size + 22;

      if (hit) {
        if (obj.type === "star") {
          starScore += 10;
        } else {
          starLives--;
          player.x = Math.max(40, Math.min(canvas.width - 40, player.x + (Math.random() > 0.5 ? 55 : -55)));
        }

        starObjects.splice(i, 1);
        updateStarHud();

        if (starLives <= 0) {
          finishStars();
          return;
        }
        continue;
      }

      if (obj.y > canvas.height + 35) {
        starObjects.splice(i, 1);
      }
    }

    drawStarScene();
    starAnimation = requestAnimationFrame(starLoop);
  }

  function finishStars() {
    stopStars();
    drawStarScene();

    $("gcStarIntro").hidden = true;
    $("gcStarResult").hidden = false;
    $("gcStarResultFace").textContent = starScore >= 150 ? "🏆" : "🌟";
    $("gcStarResultTitle").textContent =
      starScore >= 150 ? "star superstar!!" : "good catching! ♡";
    $("gcStarResultText").textContent =
      "you collected " + starScore + " points! " +
      (starLives > 0 ? "you still had " + starLives + " lives left." : "try again to beat your score!");

    reward(Math.floor(starScore / 10));
  }

  $("gcStarBegin").addEventListener("click", startStars);
  $("gcStarAgain").addEventListener("click", startStars);

  function setStarDirection(direction, active) {
    starKeys[direction] = active;
  }

  $("gcStarLeft").addEventListener("pointerdown", event => {
    event.preventDefault();
    setStarDirection("left", true);
  });
  $("gcStarRight").addEventListener("pointerdown", event => {
    event.preventDefault();
    setStarDirection("right", true);
  });

  ["gcStarLeft", "gcStarRight"].forEach(id => {
    const button = $(id);
    ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
      button.addEventListener(type, () => {
        starKeys.left = false;
        starKeys.right = false;
      });
    });
  });

  document.addEventListener("keydown", event => {
    if (currentGame !== "stars" || !starRunning) return;

    if (["ArrowLeft", "ArrowRight", "a", "d", "A", "D"].includes(event.key)) {
      event.preventDefault();
    }

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      starKeys.left = true;
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      starKeys.right = true;
    }
  });

  document.addEventListener("keyup", event => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      starKeys.left = false;
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      starKeys.right = false;
    }
  });

  window.addEventListener("blur", () => {
    starKeys.left = false;
    starKeys.right = false;
  });

  drawStarScene();
  renderPet();
})();