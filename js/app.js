(function () {
  'use strict';

  const APP = {};

  // ==================== STATE ====================
  APP.state = {
    isAdmin: false,
    ranking: [],
    gameRanking: [],
    news: [],
    visitas: { total: 0, hoy: 0, fechaHoy: '' },
    gallery: [...DATA.galeria],
    facts: [...DATA.facts],
    efemerides: [...DATA.efemerides],
    currentEditContext: null,
    factIndex: 0,
    efemerideIndex: 0
  };

  const ADMIN_CREDS = [
    { user: 'jorge', pass: 'astronomiacaracas' },
    { user: 'sebastian', pass: 'astronomiacaracas' }
  ];

  // ==================== UTILITIES ====================
  function $(id) { return document.getElementById(id); }
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return document.querySelectorAll(sel); }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function showToast(msg, type = 'info') {
    const container = $('toastContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.4s';
      setTimeout(() => el.remove(), 400);
    }, 4000);
  }

  // ==================== PERSISTENCE (localStorage) ====================
  function saveState() {
    try {
      localStorage.setItem('astronomia_state', JSON.stringify({
        ranking: APP.state.ranking,
        gameRanking: APP.state.gameRanking,
        news: APP.state.news,
        visitas: APP.state.visitas,
        gallery: APP.state.gallery,
        facts: APP.state.facts,
        efemerides: APP.state.efemerides
      }));
    } catch (e) { /* quota exceeded, ignore */ }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem('astronomia_state');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.ranking) APP.state.ranking = data.ranking;
        if (data.gameRanking) APP.state.gameRanking = data.gameRanking;
        if (data.news) APP.state.news = data.news;
        if (data.visitas) APP.state.visitas = data.visitas;
        if (data.gallery) APP.state.gallery = data.gallery;
        if (data.facts) APP.state.facts = data.facts;
        if (data.efemerides) APP.state.efemerides = data.efemerides;
      }
    } catch (e) { /* ignore */ }
  }

  // ==================== VISITAS ====================
  function checkDailyReset() {
    const hoy = new Date().toLocaleDateString('es-VE');
    if (APP.state.visitas.fechaHoy !== hoy) {
      APP.state.visitas.hoy = 0;
      APP.state.visitas.fechaHoy = hoy;
    }
    if (APP.state.ranking.length && APP.state.ranking[0]?.fecha !== hoy) {
      APP.state.ranking = [];
    }
  }

  function countVisit() {
    const hoy = new Date().toLocaleDateString('es-VE');
    if (APP.state.visitas.fechaHoy !== hoy) {
      APP.state.visitas.hoy = 1;
      APP.state.visitas.fechaHoy = hoy;
    } else {
      APP.state.visitas.hoy += 1;
    }
    APP.state.visitas.total += 1;
    saveState();
    updateVisitDisplay();
  }

  function updateVisitDisplay() {
    const v = APP.state.visitas;
    ['visitasTotales', 'footerVisitas'].forEach(id => {
      const el = $(id);
      if (el) el.textContent = v.total;
    });
    ['visitasHoy', 'footerVisitasHoy'].forEach(id => {
      const el = $(id);
      if (el) el.textContent = v.hoy;
    });
  }

  // ==================== TABS ====================
  function initTabs() {
    qsa('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        qsa('.tab-btn').forEach(b => b.classList.remove('active'));
        qsa('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        $(tabId).classList.add('active');
      });
    });
  }

  // ==================== THEME ====================
  function initTheme() {
    const btn = $('themeToggle');
    if (localStorage.getItem('astronomia_theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('astronomia_theme', isDark ? 'dark' : 'light');
    });
  }

  // ==================== ADMIN ====================
  function initAdmin() {
    const loginModal = $('loginModal');
    $('adminBtn').addEventListener('click', () => {
      if (APP.state.isAdmin) {
        APP.state.isAdmin = false;
        updateAdminUI();
      } else {
        loginModal.classList.add('open');
      }
    });
    $('cancelLoginBtn').addEventListener('click', () => loginModal.classList.remove('open'));
    $('confirmLoginBtn').addEventListener('click', () => {
      const u = $('adminUser').value.trim();
      const p = $('adminPass').value;
      if (ADMIN_CREDS.some(c => c.user === u && c.pass === p)) {
        APP.state.isAdmin = true;
        loginModal.classList.remove('open');
        updateAdminUI();
        showToast('✅ Modo administrador activado', 'success');
      } else {
        $('loginError').textContent = 'Credenciales incorrectas';
      }
    });

    $('resetRankingBtn').addEventListener('click', () => {
      if (confirm('¿Resetear todo el ranking?')) {
        APP.state.ranking = [];
        saveState();
        renderRanking();
      }
    });
    $('resetVisitasBtn').addEventListener('click', () => {
      if (confirm('¿Resetear visitas?')) {
        APP.state.visitas = { total: 0, hoy: 0, fechaHoy: new Date().toLocaleDateString('es-VE') };
        saveState();
        updateVisitDisplay();
      }
    });
    $('exportDataBtn').addEventListener('click', () => {
      const data = {
        ranking: APP.state.ranking,
        gameRanking: APP.state.gameRanking,
        news: APP.state.news,
        visitas: APP.state.visitas
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `astronomia_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    });

    $('addGalleryBtn').addEventListener('click', () => openGalleryEditor(-1));
    initEfemeridesAdmin();
    initEditModal();
  }

  function updateAdminUI() {
    const adminBtn = $('adminBtn');
    if (APP.state.isAdmin) {
      adminBtn.textContent = '👑 Admin';
      adminBtn.classList.add('active');
      qsa('.admin-panel').forEach(el => el.style.display = 'block');
      $('adminVisitasPanel').style.display = 'block';
      $('adminControlsPanel').style.display = 'block';
      $('efemeridesAdminPanel').style.display = 'block';
      $('galleryAdminBar').style.display = 'block';
      updateVisitDisplay();
    } else {
      adminBtn.classList.remove('active');
      qsa('.admin-panel').forEach(el => el.style.display = 'none');
      $('adminVisitasPanel').style.display = 'none';
      $('adminControlsPanel').style.display = 'none';
      $('efemeridesAdminPanel').style.display = 'none';
      $('galleryAdminBar').style.display = 'none';
    }
    renderGallery();
    renderNews();
    renderRanking();
    renderGameRanking();
    initFacts();
  }

  // ==================== EDIT MODAL ====================
  function initEditModal() {
    $('saveEditBtn').addEventListener('click', () => saveEdit());
    $('cancelEditBtn').addEventListener('click', () => $('editModal').classList.remove('open'));
  }

  function saveEdit() {
    const ctx = APP.state.currentEditContext;
    if (!ctx) return;

    if (ctx.type === 'gallery') {
      const nombre = $('editGaleriaNombre')?.value.trim();
      const desc = $('editGaleriaDesc')?.value.trim();
      const img = $('editGaleriaImg')?.value.trim();
      if (nombre && desc && img) {
        if (ctx.idx === -1) APP.state.gallery.push({ nombre, desc, img });
        else APP.state.gallery[ctx.idx] = { nombre, desc, img };
        saveState();
        renderGallery();
        showToast('✅ Imagen guardada', 'success');
      }
      $('editModal').classList.remove('open');
      return;
    }

    if (ctx.type === 'facts') {
      const text = $('editFactText')?.value.trim();
      if (text) {
        if (ctx.idx === -1) APP.state.facts.push(text);
        else APP.state.facts[ctx.idx] = text;
        saveState();
        initFacts();
      }
      $('editModal').classList.remove('open');
      return;
    }

    if (ctx.type === 'efemerides') {
      const text = $('editEfemerideText')?.value.trim();
      if (text) {
        if (ctx.idx === -1) APP.state.efemerides.push(text);
        else APP.state.efemerides[ctx.idx] = text;
        saveState();
      }
      $('editModal').classList.remove('open');
      return;
    }

    if (ctx.type === 'card') {
      const newHTML = $('editTextArea').value;
      const parts = newHTML.split('\n---\n');
      const texts = ctx.card.querySelectorAll('.editable-text');
      texts.forEach((el, i) => { if (i < parts.length) el.innerHTML = parts[i]; });
      $('editModal').classList.remove('open');
    }
  }

  function openGalleryEditor(idx) {
    const item = idx >= 0 ? APP.state.gallery[idx] : null;
    $('editModalTitle').textContent = item ? '✏️ Editar imagen' : '➕ Nueva imagen';
    $('editModalFields').innerHTML = `
      <label class="form-label">Nombre</label>
      <input class="form-input" id="editGaleriaNombre" value="${item ? item.nombre.replace(/"/g, '&quot;') : ''}">
      <label class="form-label">Descripción</label>
      <input class="form-input" id="editGaleriaDesc" value="${item ? item.desc.replace(/"/g, '&quot;') : ''}">
      <label class="form-label">URL de la imagen</label>
      <input class="form-input" id="editGaleriaImg" value="${item ? item.img.replace(/"/g, '&quot;') : ''}">
    `;
    APP.state.currentEditContext = { type: 'gallery', idx };
    $('editModal').classList.add('open');
  }

  function deleteGalleryItem(idx) {
    if (!confirm(`¿Eliminar "${APP.state.gallery[idx].nombre}"?`)) return;
    APP.state.gallery.splice(idx, 1);
    saveState();
    renderGallery();
  }

  function initEfemeridesAdmin() {
    $('addEfemerideBtn').addEventListener('click', () => {
      $('editModalTitle').textContent = '➕ Nueva efeméride';
      $('editModalFields').innerHTML = '<label class="form-label">Texto</label><textarea class="form-input" id="editEfemerideText" rows="3"></textarea>';
      APP.state.currentEditContext = { type: 'efemerides', idx: -1 };
      $('editModal').classList.add('open');
    });
    $('editEfemerideBtn').addEventListener('click', () => {
      const text = APP.state.efemerides[APP.state.efemerideIndex % APP.state.efemerides.length] || '';
      $('editModalTitle').textContent = '✏️ Editar efeméride';
      $('editModalFields').innerHTML = `<label class="form-label">Texto</label><textarea class="form-input" id="editEfemerideText" rows="3">${text.replace(/"/g, '&quot;')}</textarea>`;
      APP.state.currentEditContext = { type: 'efemerides', idx: APP.state.efemerideIndex % APP.state.efemerides.length };
      $('editModal').classList.add('open');
    });
    $('delEfemerideBtn').addEventListener('click', () => {
      if (!confirm('¿Eliminar esta efeméride?')) return;
      const idx = APP.state.efemerideIndex % APP.state.efemerides.length;
      APP.state.efemerides.splice(idx, 1);
      if (APP.state.efemerides.length === 0) APP.state.efemerides.push('(Sin efemérides. Añade una nueva.)');
      saveState();
    });
  }

  // ==================== NEWS ====================
  function renderNews() {
    const container = $('customNewsContainer');
    if (!container) return;
    if (!APP.state.news.length) {
      container.innerHTML = '<p style="color:var(--text-secondary); padding:1rem;">No hay noticias aún. Usa el panel de administración para agregar.</p>';
      return;
    }
    container.innerHTML = APP.state.news.map((n, i) => `
      <div class="news-card">
        ${APP.state.isAdmin ? `<div style="position:absolute;top:8px;right:8px;display:flex;gap:4px;z-index:10;">
          <button class="btn btn-xs btn-secondary" data-edit-news="${i}">✏️</button>
          <button class="btn btn-xs btn-danger" data-del-news="${i}">✕</button>
        </div>` : ''}
        ${n.img ? `<img src="${n.img}" alt="${n.title}" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="news-content">
          <div class="title">${n.title}</div>
          <div class="date">📅 ${n.date || new Date().toLocaleDateString('es-VE')}</div>
          <div class="desc">${n.desc}</div>
          ${n.link && n.link !== '#' ? `<a href="${n.link}" target="_blank" class="btn btn-sm btn-primary" style="margin-top:0.5rem;display:inline-flex;">Leer más →</a>` : ''}
        </div>
      </div>
    `).join('');

    if (APP.state.isAdmin) {
      qsa('[data-edit-news]').forEach(b => b.addEventListener('click', () => editNews(+b.dataset.editNews)));
      qsa('[data-del-news]').forEach(b => b.addEventListener('click', () => {
        APP.state.news.splice(+b.dataset.delNews, 1);
        saveState();
        renderNews();
      }));
    }
  }

  function editNews(idx) {
    const n = APP.state.news[idx];
    $('newsTitle').value = n.title;
    $('newsDesc').value = n.desc;
    $('newsImgUrl').value = n.img || '';
    $('newsLink').value = n.link || '';
    $('editingNewsId').value = idx;
  }

  function initNewsForm() {
    $('saveNewsBtn').addEventListener('click', () => {
      const title = $('newsTitle').value.trim();
      const desc = $('newsDesc').value.trim();
      const img = $('newsImgUrl').value.trim();
      const link = $('newsLink').value.trim();
      if (!title || !desc) { alert('Título y descripción obligatorios'); return; }
      const editingId = $('editingNewsId').value;
      const item = { title, desc, img: img || null, link: link || '#', date: new Date().toLocaleDateString('es-VE') };
      if (editingId !== '') APP.state.news[+editingId] = item;
      else APP.state.news.push(item);
      saveState();
      renderNews();
      $('newsTitle').value = '';
      $('newsDesc').value = '';
      $('newsImgUrl').value = '';
      $('newsLink').value = '';
      $('editingNewsId').value = '';
      showToast('✅ Noticia guardada', 'success');
    });
    $('cancelNewsEditBtn').addEventListener('click', () => {
      ['newsTitle', 'newsDesc', 'newsImgUrl', 'newsLink', 'editingNewsId'].forEach(id => $(id).value = '');
    });
  }

  // ==================== GALLERY ====================
  function renderGallery() {
    const container = $('sistemaSolarGallery');
    if (!container) return;
    container.innerHTML = APP.state.gallery.map((obj, i) => `
      <div class="gallery-item" onclick="window.open('${obj.img}','_blank')">
        ${APP.state.isAdmin ? `<div style="position:absolute;top:8px;right:8px;display:flex;gap:4px;z-index:10;">
          <button class="btn btn-xs btn-secondary" data-edit-gal="${i}">✏️</button>
          <button class="btn btn-xs btn-danger" data-del-gal="${i}">✕</button>
        </div>` : ''}
        <img src="${obj.img}" alt="${obj.nombre}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML+='<div style=\\'height:180px;display:flex;align-items:center;justify-content:center;font-size:3rem;\\'>🌌</div>'">
        <div class="caption"><h3>${obj.nombre}</h3><p>${obj.desc}</p></div>
      </div>
    `).join('');

    if (APP.state.isAdmin) {
      qsa('[data-edit-gal]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); openGalleryEditor(+b.dataset.editGal); }));
      qsa('[data-del-gal]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); deleteGalleryItem(+b.dataset.delGal); }));
    }
  }

  // ==================== FACTS ====================
  function initFacts() {
    showFact(APP.state.factIndex);
    $('nextFactBtn').addEventListener('click', () => showFact(APP.state.factIndex + 1));
    $('prevFactBtn').addEventListener('click', () => showFact(APP.state.factIndex - 1));

    const existing = qsa('.fact-admin-btn');
    existing.forEach(el => el.remove());

    const factCard = $('factDisplay');
    if (APP.state.isAdmin && factCard && !factCard.parentElement.querySelector('.fact-admin-btn')) {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;gap:0.5rem;margin-top:0.5rem;';

      const addBtn = document.createElement('button');
      addBtn.textContent = '➕ Añadir';
      addBtn.className = 'btn btn-sm btn-secondary fact-admin-btn';
      addBtn.addEventListener('click', () => {
        $('editModalTitle').textContent = '➕ Nuevo dato curioso';
        $('editModalFields').innerHTML = '<label class="form-label">Texto</label><textarea class="form-input" id="editFactText" rows="3"></textarea>';
        APP.state.currentEditContext = { type: 'facts', idx: -1 };
        $('editModal').classList.add('open');
      });

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️ Editar';
      editBtn.className = 'btn btn-sm btn-secondary fact-admin-btn';
      editBtn.addEventListener('click', () => {
        const text = APP.state.facts[APP.state.factIndex] || '';
        $('editModalTitle').textContent = '✏️ Editar dato curioso';
        $('editModalFields').innerHTML = `<label class="form-label">Texto</label><textarea class="form-input" id="editFactText" rows="3">${text.replace(/"/g, '&quot;')}</textarea>`;
        APP.state.currentEditContext = { type: 'facts', idx: APP.state.factIndex };
        $('editModal').classList.add('open');
      });

      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑️';
      delBtn.className = 'btn btn-sm btn-danger fact-admin-btn';
      delBtn.addEventListener('click', () => {
        if (!confirm('¿Eliminar este dato?')) return;
        APP.state.facts.splice(APP.state.factIndex, 1);
        if (APP.state.facts.length === 0) APP.state.facts.push('(Sin datos aún. Añade uno nuevo.)');
        saveState();
        APP.state.factIndex = 0;
        initFacts();
      });

      wrap.appendChild(addBtn);
      wrap.appendChild(editBtn);
      wrap.appendChild(delBtn);
      factCard.parentElement.insertBefore(wrap, factCard.nextSibling);
    }
  }

  function showFact(index) {
    const display = $('factDisplay');
    const counter = $('factCounter');
    if (!display || !counter) return;
    const facts = APP.state.facts;
    APP.state.factIndex = ((index % facts.length) + facts.length) % facts.length;
    display.textContent = facts[APP.state.factIndex];
    counter.textContent = `${APP.state.factIndex + 1} / ${facts.length}`;
  }

  // ==================== EFEMERIDES ====================
  function rotateEfemerides() {
    const el = $('efemeridesText');
    if (el && APP.state.efemerides.length > 0) {
      el.textContent = APP.state.efemerides[APP.state.efemerideIndex % APP.state.efemerides.length];
      APP.state.efemerideIndex = (APP.state.efemerideIndex + 1) % APP.state.efemerides.length;
    }
  }

  // ==================== APOD ====================
  async function loadAPOD() {
    const c = $('apodContainer');
    try {
      const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
      if (!res.ok) throw new Error('API limit');
      const data = await res.json();
      c.innerHTML = `
        <div style="text-align:center;">
          ${data.media_type === 'image'
            ? `<img src="${data.url}" style="max-width:100%;border-radius:var(--radius);" loading="lazy">`
            : `<iframe src="${data.url}" style="width:100%;height:400px;border-radius:var(--radius);border:none;"></iframe>`
          }
          <h3 style="margin-top:0.75rem;">${data.title}</h3>
          <small style="color:var(--text-secondary);">📅 ${data.date || ''}</small>
          <p style="margin-top:0.5rem;text-align:left;color:var(--text-secondary);font-size:0.9rem;">${data.explanation}</p>
        </div>`;
    } catch (e) {
      c.innerHTML = '<div class="result-box">⏳ Límite de API alcanzado. Mira la <a href="https://apod.nasa.gov/apod/astropix.html" target="_blank">página oficial</a>.</div>';
    }
  }

  // ==================== GRAVITY SIMULATOR ====================
  function initGravitySim() {
    const canvas = $('simuladorCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dist = 384000, ang = 0, vel = 0.01, trail = [];
    let active = false;

    function updateVel() {
      const r = dist / 384000;
      vel = Math.min(0.08, Math.max(0.002, 0.01 * Math.pow(1 / r, 1.5)));
      const per = 27.3 * Math.pow(dist / 384000, 1.5);
      const v = (2 * Math.PI * dist) / (per * 86400);
      $('infoVelocidad').innerHTML = `🛸 Vel: ${v.toFixed(2)} km/s | 📅 Periodo: ${per.toFixed(1)} días | 📏 Dist: ${dist.toLocaleString()} km`;
    }

    function draw() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.2, 0, 2 * Math.PI);
        ctx.fill();
      }

      const eg = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 40);
      eg.addColorStop(0, '#6fcf97');
      eg.addColorStop(0.6, '#4cafaa');
      eg.addColorStop(1, '#2e7d64');
      ctx.fillStyle = eg;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 35, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = 'rgba(100,200,150,0.15)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 45, 0, 2 * Math.PI);
      ctx.fill();

      const r = Math.min(250, dist / 1600);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      const lx = w / 2 + r * Math.cos(ang);
      const ly = h / 2 + r * Math.sin(ang);
      trail.push({ x: lx, y: ly });
      if (trail.length > 80) trail.shift();

      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          ctx.strokeStyle = `rgba(255,255,255,${i / trail.length * 0.4})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.stroke();
        }
      }

      const lg = ctx.createRadialGradient(lx, ly, 2, lx, ly, 18);
      lg.addColorStop(0, '#fff');
      lg.addColorStop(0.5, '#ddd');
      lg.addColorStop(1, '#999');
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.arc(lx, ly, 12, 0, 2 * Math.PI);
      ctx.fill();

      ang += vel;
    }

    function toggleActive() {
      const tab = qs('.tab-btn[data-tab="tab2"]');
      active = tab && tab.classList.contains('active');
    }

    qsa('.tab-btn').forEach(btn => btn.addEventListener('click', toggleActive));

    $('distanciaLuna').addEventListener('input', e => {
      dist = +e.target.value * 1000;
      $('distanciaValor').textContent = dist.toLocaleString() + ' km';
      trail = [];
      updateVel();
    });

    updateVel();
    toggleActive();

    (function loop() {
      if (active) draw();
      requestAnimationFrame(loop);
    })();
  }

  // ==================== CALCULATORS ====================
  function initCalculators() {
    $('calcTelescopioBtn').addEventListener('click', () => {
      const D = +$('diametroCalc').value;
      const F = +$('focalCalc').value;
      const o = +$('ocularCalc').value;
      if (isNaN(D) || isNaN(F) || isNaN(o)) return;
      const aum = F / o;
      const mag = 2.5 * Math.log10(D) + 7.5;
      const campo = (50 / aum).toFixed(1);
      $('resultadoCalc').innerHTML = `🔍 Aumento: ${aum.toFixed(0)}x | ⭐ Mag lím: ${mag.toFixed(1)} | 🌙 Campo: ${campo}°`;
    });
    $('calcTelescopioBtn').click();

    $('convertirAstro').addEventListener('click', () => {
      const ua = +$('ua').value;
      if (!isNaN(ua)) {
        const km = ua * 149597870.7;
        const pc = ua / 206264.8;
        const ly = ua / 63241.1;
        $('km').value = km.toExponential(4);
        $('pc').value = pc.toExponential(4);
        $('ly').value = ly.toExponential(4);
        $('resultConversor').innerHTML = `${ua} UA = ${km.toFixed(0)} km = ${pc.toExponential(4)} pc = ${ly.toExponential(4)} ly`;
      }
    });
    $('convertirAstro').click();

    $('calcBHBtn').addEventListener('click', () => {
      const M = +$('bhMass').value;
      if (isNaN(M) || M <= 0) return;
      const G = 6.674e-11, c = 299792458, Msun = 1.989e30;
      const rs = (2 * G * M * Msun) / (c * c);
      $('resultBH').innerHTML =
        `🕳️ Radio de Schwarzschild: <strong>${(rs / 1000).toFixed(1)} km</strong><br>` +
        `📏 Diámetro: <strong>${(rs * 2 / 1000).toFixed(1)} km</strong><br>` +
        `⚫ Masa: <strong>${M.toLocaleString()} masas solares</strong>`;
    });
    $('calcBHBtn').click();

    $('calcEscBtn').addEventListener('click', () => {
      const M = +$('escMass').value;
      const R = +$('escRadius').value * 1000;
      if (isNaN(M) || isNaN(R) || M <= 0 || R <= 0) return;
      const G = 6.674e-11;
      const ve = Math.sqrt(2 * G * M / R);
      $('resultEsc').innerHTML =
        `🚀 Velocidad de escape: <strong>${(ve / 1000).toFixed(2)} km/s</strong><br>` +
        `📊 Equivale a: <strong>${(ve / 340).toFixed(1)}x</strong> la velocidad del sonido`;
    });
    $('calcEscBtn').click();
  }

  // ==================== SOLAR SYSTEM VIEWER ====================
  function initSolarSystem() {
    const canvas = $('planetsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let selectedPlanet = null, showLabels = true, speedMult = 1;
    let active = false;

    const planets = DATA.planetas.map((d, i) => ({
      name: d.name, r: 40 + i * 30, c: d.color,
      s: 0.05 - i * 0.004, a: Math.random() * 6.28,
      sz: 5 + i * 1.2, data: d
    }));

    function draw() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 60; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.2, 0, 2 * Math.PI);
        ctx.fill();
      }

      planets.forEach(p => {
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, p.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      const sg = ctx.createRadialGradient(w / 2, h / 2, 5, w / 2, h / 2, 30);
      sg.addColorStop(0, '#fff8e0');
      sg.addColorStop(0.5, '#ffcc44');
      sg.addColorStop(1, '#ff8800');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 22, 0, 2 * Math.PI);
      ctx.fill();

      planets.forEach(p => {
        const x = w / 2 + p.r * Math.cos(p.a);
        const y = h / 2 + p.r * Math.sin(p.a);

        const pg = ctx.createRadialGradient(x, y, 0, x, y, p.sz * 2);
        pg.addColorStop(0, p.c);
        pg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(x, y, p.sz * 2.5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(x, y, p.sz, 0, 2 * Math.PI);
        ctx.fill();

        if (selectedPlanet === p.name) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, p.sz + 4, 0, 2 * Math.PI);
          ctx.stroke();
        }

        if (showLabels) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(p.name, x, y - p.sz - 8);
        }

        p.a += p.s * speedMult;
      });
    }

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * canvas.width / rect.width;
      const my = (e.clientY - rect.top) * canvas.height / rect.height;
      planets.forEach(p => {
        const x = 250 + p.r * Math.cos(p.a);
        const y = 250 + p.r * Math.sin(p.a);
        if (Math.hypot(mx - x, my - y) < p.sz + 10) {
          selectedPlanet = (selectedPlanet === p.name) ? null : p.name;
          showPlanetDetail(p.name);
        }
      });
    });

    $('togglePlanetSpeedBtn').addEventListener('click', function () {
      speedMult = speedMult === 1 ? 3 : 1;
      this.textContent = speedMult === 1 ? '⏩ Acelerar' : '⏪ Normal';
    });

    $('togglePlanetLabelsBtn').addEventListener('click', function () {
      showLabels = !showLabels;
      this.textContent = showLabels ? '🏷️ Ocultar nombres' : '🏷️ Mostrar nombres';
    });

    function toggleActive() {
      const tab = qs('.tab-btn[data-tab="tab4"]');
      active = tab && tab.classList.contains('active');
    }
    qsa('.tab-btn').forEach(btn => btn.addEventListener('click', toggleActive));
    toggleActive();

    (function loop() {
      if (active) draw();
      requestAnimationFrame(loop);
    })();
  }

  // ==================== PLANET DETAIL ====================
  function showPlanetDetail(name) {
    const panel = $('planetDetailPanel');
    const d = DATA.planetas.find(p => p.name === name);
    if (!d || !panel) return;
    panel.classList.add('open');
    $('planetDetailName').textContent = `${d.icon} ${d.name}`;
    $('planetDetailDesc').textContent = d.desc;
    const g = 9.81;
    $('planetDetailGrid').innerHTML = `
      <div class="detail-item"><div class="label">Diámetro</div><div class="value">${(d.diam / 1000).toFixed(0)} km</div></div>
      <div class="detail-item"><div class="label">Masa (Tierras)</div><div class="value">${d.mass}×</div></div>
      <div class="detail-item"><div class="label">Gravedad</div><div class="value">${d.gravity} m/s²</div></div>
      <div class="detail-item"><div class="label">Duración del día</div><div class="value">${d.day} días</div></div>
      <div class="detail-item"><div class="label">Duración del año</div><div class="value">${d.year} días</div></div>
      <div class="detail-item"><div class="label">Lunas</div><div class="value">${d.moons}</div></div>
      <div class="detail-item"><div class="label">Temperatura</div><div class="value">${d.temp}°C</div></div>
      <div class="detail-item"><div class="label">Distancia al Sol</div><div class="value">${d.dist}M km</div></div>
      <div class="detail-item"><div class="label">Tu peso aquí</div><div class="value">${(70 * d.gravity / g).toFixed(0)} kg</div></div>
      <div class="detail-item"><div class="label">Tu edad aquí</div><div class="value">${(20 * 365 / d.year).toFixed(1)} años</div></div>
    `;
  }

  // ==================== PLANET DATA GRID ====================
  function renderPlanetGrid() {
    const grid = $('planetDataGrid');
    if (!grid) return;
    grid.innerHTML = DATA.planetas.map((p, i) => `
      <div class="planet-card" data-planet="${i}">
        <div class="bar" style="background:${p.color};"></div>
        <div class="icon">${p.icon}</div>
        <div class="info">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <span class="planet-stat">⌀ ${(p.diam / 1000).toFixed(0)}k km</span>
          <span class="planet-stat">🌡️ ${p.temp}°C</span>
          <span class="planet-stat">🌙 ${p.moons} lunas</span>
        </div>
      </div>
    `).join('');
    grid.querySelectorAll('.planet-card').forEach(el => {
      el.addEventListener('click', () => showPlanetDetail(DATA.planetas[+el.dataset.planet].name));
    });
  }

  // ==================== COMPARISON TABLE ====================
  function renderComparison() {
    const body = $('comparisonBody');
    if (!body) return;
    body.innerHTML = DATA.planetas.map(p => `
      <tr>
        <td><strong>${p.icon} ${p.name}</strong></td>
        <td>${(p.diam / 1000).toFixed(0)}k km</td>
        <td>${p.mass}×</td>
        <td>${p.gravity} m/s²</td>
        <td>${p.day} d</td>
        <td>${p.year} d</td>
        <td>${p.moons}</td>
        <td>${p.temp}°C</td>
      </tr>
    `).join('');
  }

  // ==================== AGE & WEIGHT ====================
  function initAgeWeight() {
    $('calcAgeWeightBtn').addEventListener('click', calcAgeWeight);
  }

  function calcAgeWeight() {
    const age = +$('userAge').value || 20;
    const weight = +$('userWeight').value || 70;
    const grid = $('ageWeightGrid');
    if (!grid) return;
    const gEarth = 9.81;
    grid.innerHTML = DATA.planetas.map(p => `
      <div style="background:var(--bg-card);border-radius:var(--radius-sm);padding:0.75rem;text-align:center;border:1px solid var(--border);">
        <div style="font-size:1.5rem;">${p.icon}</div>
        <div style="font-weight:600;font-size:0.9rem;">${p.name}</div>
        <div style="font-size:0.8rem;color:var(--text-secondary);">Edad: <strong style="color:var(--accent);">${(age * 365 / p.year).toFixed(1)}</strong> años</div>
        <div style="font-size:0.8rem;color:var(--text-secondary);">Peso: <strong style="color:var(--accent);">${(weight * p.gravity / gEarth).toFixed(1)}</strong> kg</div>
      </div>
    `).join('');
  }

  // ==================== SPACE HISTORY ====================
  function initSpaceHistory() {
    const el = $('spaceHistoryText');
    if (!el) return;
    const hoy = new Date();
    const dia = hoy.getDate(), mes = hoy.getMonth() + 1;
    const eventos = DATA.spaceHistory.filter(e => e[0] === dia && e[1] === mes);
    if (eventos.length > 0) {
      const rand = eventos[Math.floor(Math.random() * eventos.length)];
      el.textContent = rand[2];
    } else {
      el.textContent = '🌟 Cada día es una oportunidad para descubrir algo nuevo en el cosmos.';
    }
  }

  // ==================== RANDOM SPACE OBJECT ====================
  function initRandomSpace() {
    $('randomSpaceBtn').addEventListener('click', showRandomObject);
  }

  function showRandomObject() {
    const obj = DATA.randomSpaceObjects[Math.floor(Math.random() * DATA.randomSpaceObjects.length)];
    const container = $('randomSpaceObject');
    container.innerHTML = `
      <h3 style="color:var(--accent);font-size:1.6rem;text-shadow:0 0 20px var(--accent-glow);">${obj.name}</h3>
      <p style="margin-top:0.5rem;opacity:0.8;">${obj.type} · ${obj.dist}</p>
      <p style="margin-top:1rem;font-size:0.9rem;opacity:0.9;">💡 ${obj.fact}</p>
      <button id="randomSpaceBtn" class="btn btn-primary" style="margin-top:1rem;">🎲 ¡Otro!</button>
    `;
    $('randomSpaceBtn').addEventListener('click', showRandomObject);
  }

  // ==================== EVENTS 2026 ====================
  function renderEvents() {
    const container = $('eventosAstronomicos');
    if (!container) return;
    container.innerHTML = DATA.eventos2026.map(e => `
      <div class="evento-item">
        <strong>${e.fecha}</strong>
        <span>${e.evento}</span>
        <small>${e.detalle}</small>
      </div>
    `).join('');
  }

  // ==================== MISSIONS ====================
  function renderMissions() {
    const container = $('misionesContainer');
    if (!container) return;
    container.innerHTML = DATA.misiones.map(m => `
      <div class="mision-card">
        <div class="icon">${m.icon}</div>
        <div class="body">
          <strong>${m.name}</strong><br>
          <small>${m.year}</small>
          <p>${m.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // ==================== MOON PHASE ====================
  function getMoonPhase(date) {
    const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
    const diff = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const lunarCycle = 29.53058867;
    const days = ((diff % lunarCycle) + lunarCycle) % lunarCycle;
    const phase = days / lunarCycle;
    const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
    const names = ["🌑 Luna Nueva", "🌒 Luna Creciente", "🌓 Cuarto Creciente", "🌔 Gibosa Creciente", "🌕 Luna Llena", "🌖 Gibosa Menguante", "🌗 Cuarto Menguante", "🌘 Luna Menguante"];
    const idx = Math.round(phase * 8) % 8;
    return { phase, illumination, name: names[idx], days };
  }

  function drawMoon() {
    const canvas = $('moonCanvas');
    const info = $('moonInfo');
    if (!canvas || !info) return;
    const ctx = canvas.getContext('2d');
    const cx = 110, cy = 110, r = 95;
    const now = new Date();
    const { illumination, name, days } = getMoonPhase(now);

    ctx.clearRect(0, 0, 220, 220);
    const grad = ctx.createRadialGradient(110, 110, 10, 110, 110, r);
    grad.addColorStop(0, '#3a3a5a');
    grad.addColorStop(0.7, '#1a1a3a');
    grad.addColorStop(1, '#0a0a1a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();

    const moonGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    if (illumination < 0.05) {
      moonGrad.addColorStop(0, '#1a1a2e');
      moonGrad.addColorStop(1, '#1a1a2e');
    } else {
      const brightStart = 0.5 - illumination / 2;
      const brightEnd = 0.5 + illumination / 2;
      moonGrad.addColorStop(0, '#ddd');
      moonGrad.addColorStop(brightStart, '#eee');
      moonGrad.addColorStop(brightEnd, '#555');
      moonGrad.addColorStop(1, '#222');
    }
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.stroke();

    const nextFull = new Date(now);
    nextFull.setDate(nextFull.getDate() + ((29.53 - days + 14.765) % 29.53));
    const nextNew = new Date(now);
    nextNew.setDate(nextNew.getDate() + ((29.53 - days) % 29.53));
    const fmt = d => d.toLocaleDateString('es-VE', { day: 'numeric', month: 'long' });
    info.innerHTML = `${name} — <span>${(illumination * 100).toFixed(1)}%</span> iluminada<br><small style="color:var(--text-secondary);">🌕 Próxima luna llena: ${fmt(nextFull)} | 🌑 Luna nueva: ${fmt(nextNew)}</small>`;
  }

  // ==================== STARFIELD ====================
  function initStarfield() {
    const canvas = $('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w, h;

    function resize() {
      const hero = canvas.parentElement;
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 100; i++) {
      stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + 0.5, s: Math.random() * 0.5 + 0.1, a: Math.random() * 6.28 });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        s.a += s.s * 0.015;
        const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(s.a));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ==================== AI CHAT ====================
  function initAIChat() {
    $('askBtn').addEventListener('click', askAI);
    $('userQuestion').addEventListener('keydown', e => {
      if (e.key === 'Enter') askAI();
    });
    qsa('.suggest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $('userQuestion').value = btn.dataset.q;
        askAI();
      });
    });
  }

  async function askAI() {
    const input = $('userQuestion');
    const q = input.value.trim();
    if (!q) return;

    addChatMsg(q, true);
    const thinkEl = addChatMsg('🤔 Pensando...', false);

    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent('Eres experto en astronomía. Responde en español de forma clara y educativa: ' + q)}`);
      const txt = await res.text();
      thinkEl.remove();
      addChatMsg(txt, false);
    } catch (e) {
      thinkEl.remove();
      addChatMsg('⚠️ Error al consultar la IA. Intenta de nuevo.', false);
    }
    input.value = '';
  }

  function addChatMsg(text, isUser) {
    const box = $('chatBox');
    const div = document.createElement('div');
    div.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div;
  }

  // ==================== QUIZ ====================
  let quizState = {
    active: false,
    player: '',
    score: 0,
    questions: [],
    current: null,
    answered: false,
    timer: null,
    timeLeft: 15
  };

  function generateQuestions() {
    const bank = [];
    const planetas = ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"];
    const respuestas = [
      "Es el planeta más cercano al Sol y el más pequeño.",
      "Tiene atmósfera densa de CO2 y efecto invernadero extremo.",
      "Nuestro hogar, el único planeta conocido con vida.",
      "El planeta rojo, con el Monte Olimpo, el volcán más grande.",
      "Gigante gaseoso con la Gran Mancha Roja.",
      "Famoso por su espectacular sistema de anillos.",
      "Gigante de hielo que rota de lado.",
      "El planeta más ventoso, con vientos supersónicos."
    ];
    for (let i = 0; i < 8; i++) {
      let opts = [respuestas[i]];
      let otras = respuestas.filter((_, idx) => idx !== i);
      while (opts.length < 4) opts.push(otras.shift());
      opts = shuffle(opts);
      bank.push({ q: `¿Cuál es la característica principal de ${planetas[i]}?`, opts, correctText: respuestas[i] });
    }

    const extra = [
      { q: "¿Cuál es la estrella más cercana a la Tierra?", opts: ["Próxima Centauri", "Sirio", "El Sol", "Alfa Centauri"], correct: "El Sol" },
      { q: "¿En qué año llegó el ser humano a la Luna?", opts: ["1965", "1969", "1972", "1958"], correct: "1969" },
      { q: "¿Qué tipo de galaxia es la Vía Láctea?", opts: ["Elíptica", "Espiral", "Irregular", "Lenticular"], correct: "Espiral" },
      { q: "¿Cuál es el planeta más caliente?", opts: ["Mercurio", "Venus", "Tierra", "Marte"], correct: "Venus" },
      { q: "¿Cuántas lunas tiene Marte?", opts: ["1", "2", "4", "0"], correct: "2" },
      { q: "¿Quién formuló las leyes del movimiento planetario?", opts: ["Newton", "Kepler", "Galileo", "Copérnico"], correct: "Kepler" },
      { q: "¿Qué es un púlsar?", opts: ["Estrella de neutrones giratoria", "Agujero negro", "Nebulosa", "Galaxia"], correct: "Estrella de neutrones giratoria" },
      { q: "¿Cuál es la luna más grande de Saturno?", opts: ["Titán", "Europa", "Ganímedes", "Calisto"], correct: "Titán" },
      { q: "¿Qué planeta tiene el día más largo?", opts: ["Venus", "Mercurio", "Marte", "Júpiter"], correct: "Venus" },
      { q: "¿Cuál es el planeta más grande?", opts: ["Júpiter", "Saturno", "Urano", "Neptuno"], correct: "Júpiter" },
      { q: "¿Qué es una supernova?", opts: ["Explosión estelar", "Agujero negro", "Nebulosa", "Planeta"], correct: "Explosión estelar" },
      { q: "¿Cuál es la galaxia más cercana a la Vía Láctea?", opts: ["Andrómeda", "Triángulo", "Nube de Magallanes", "Sombrero"], correct: "Andrómeda" },
      { q: "¿Cuántos planetas hay en el sistema solar?", opts: ["8", "9", "7", "10"], correct: "8" },
      { q: "¿Qué es un eclipse solar?", opts: ["La Luna tapa al Sol", "La Tierra tapa al Sol", "El Sol tapa a la Luna", "Ninguna"], correct: "La Luna tapa al Sol" },
      { q: "¿Qué planeta tiene la Gran Mancha Roja?", opts: ["Júpiter", "Saturno", "Marte", "Venus"], correct: "Júpiter" }
    ];

    for (let eq of extra) {
      bank.push({ q: eq.q, opts: shuffle([...eq.opts]), correctText: eq.correct });
    }

    while (bank.length < 100) {
      const base = extra[(bank.length - extra.length) % extra.length];
      bank.push({ q: base.q, opts: shuffle([...base.opts]), correctText: base.correct });
    }
    return bank.slice(0, 100);
  }

  const questionBank = generateQuestions();

  function initQuiz() {
    $('startQuizBtn').addEventListener('click', startQuiz);
    $('nextQuestionBtn').addEventListener('click', () => {
      if (quizState.active) {
        $('nextQuestionBtn').style.display = 'none';
        loadNextQuestion();
      }
    });
  }

  function startQuiz() {
    const name = $('playerName').value.trim();
    if (!name) { alert('Ingresa tu nombre'); return; }
    quizState = {
      active: true, player: name, score: 0,
      questions: shuffle([...questionBank]),
      current: null, answered: false, timer: null, timeLeft: 15
    };
    $('displayName').textContent = name;
    $('loginSection').style.display = 'none';
    $('quizSection').style.display = 'block';
    $('quizMessage').style.display = 'none';
    $('nextQuestionBtn').style.display = 'none';
    loadNextQuestion();
  }

  function startTimer() {
    quizState.timeLeft = 15;
    $('quizTimer').textContent = '⏱️ 15s';
    $('quizTimer').style.color = '';
    clearInterval(quizState.timer);
    quizState.timer = setInterval(() => {
      quizState.timeLeft--;
      $('quizTimer').textContent = `⏱️ ${quizState.timeLeft}s`;
      if (quizState.timeLeft <= 5) $('quizTimer').style.color = '#ef4444';
      if (quizState.timeLeft <= 0 && !quizState.answered) {
        clearInterval(quizState.timer);
        qsa('.question-option').forEach(opt => opt.style.pointerEvents = 'none');
        quizState.answered = true;
        updateRanking(quizState.player, quizState.score);
        $('quizMessage').style.display = 'block';
        $('quizMessage').innerHTML = `⏰ ¡TIEMPO! Acertaste ${quizState.score} preguntas.`;
        quizState.active = false;
        setTimeout(() => {
          $('quizSection').style.display = 'none';
          $('loginSection').style.display = 'block';
          $('playerName').value = '';
        }, 3000);
      }
    }, 1000);
  }

  function loadNextQuestion() {
    if (!quizState.active) return;
    quizState.answered = false;
    $('quizTimer').textContent = '⏱️ 15s';
    $('quizTimer').style.color = '';

    if (quizState.questions.length === 0) {
      clearInterval(quizState.timer);
      quizState.active = false;
      $('quizMessage').style.display = 'block';
      $('quizMessage').innerHTML = '🏆 ¡FELICIDADES! Completaste las 100 preguntas.';
      $('nextQuestionBtn').style.display = 'none';
      updateRanking(quizState.player, 100);
      setTimeout(() => {
        $('quizSection').style.display = 'none';
        $('loginSection').style.display = 'block';
        $('playerName').value = '';
      }, 3000);
      return;
    }

    quizState.current = quizState.questions.shift();
    const numActual = 100 - quizState.questions.length;
    $('questionText').textContent = quizState.current.q;
    $('currentQuestionNumber').textContent = numActual;
    $('progressFill').style.width = (numActual / 100 * 100) + '%';

    const optsContainer = $('optionsContainer');
    optsContainer.innerHTML = '';
    quizState.current.opts.forEach(text => {
      const div = document.createElement('button');
      div.className = 'question-option';
      div.textContent = text;
      div.dataset.optText = text;
      div.addEventListener('click', () => handleAnswer(text, div));
      optsContainer.appendChild(div);
    });
    startTimer();
  }

  function handleAnswer(selectedText, element) {
    if (quizState.answered || !quizState.active) return;
    quizState.answered = true;
    clearInterval(quizState.timer);
    const isCorrect = (selectedText === quizState.current.correctText);
    qsa('.question-option').forEach(opt => opt.style.pointerEvents = 'none');

    if (isCorrect) {
      element.classList.add('correct');
      element.innerHTML += ' ✅';
      quizState.score++;
      $('nextQuestionBtn').style.display = 'block';
    } else {
      element.classList.add('wrong');
      element.innerHTML += ' ❌';
      qsa('.question-option').forEach(opt => {
        if (opt.dataset.optText === quizState.current.correctText) {
          opt.classList.add('correct');
          opt.innerHTML += ' ✅';
        }
      });
      updateRanking(quizState.player, quizState.score);
      $('quizMessage').style.display = 'block';
      $('quizMessage').innerHTML = `❌ FALLIDO. Acertaste ${quizState.score} preguntas.`;
      quizState.active = false;
      setTimeout(() => {
        $('quizSection').style.display = 'none';
        $('loginSection').style.display = 'block';
        $('playerName').value = '';
      }, 3000);
    }
  }

  function updateRanking(nombre, puntaje) {
    const hoy = new Date().toLocaleDateString('es-VE');
    const index = APP.state.ranking.findIndex(r => r.nombre.toLowerCase() === nombre.toLowerCase());
    if (index !== -1) {
      if (puntaje > APP.state.ranking[index].puntaje) APP.state.ranking[index].puntaje = puntaje;
    } else {
      APP.state.ranking.push({ nombre, puntaje, fecha: hoy });
    }
    APP.state.ranking.sort((a, b) => b.puntaje - a.puntaje);
    APP.state.ranking = APP.state.ranking.slice(0, 10);
    saveState();
    renderRanking();
  }

  function renderRanking() {
    const list = $('rankingList');
    if (!list) return;
    if (!APP.state.ranking.length) {
      list.innerHTML = '<li>Aún no hay puntajes hoy. ¡Sé el primero!</li>';
      return;
    }
    list.innerHTML = APP.state.ranking.map((r, i) =>
      `<li class="${i === 0 ? 'champion' : ''}"><span>${i + 1}. ${r.nombre}</span><span>${r.puntaje} pts</span></li>`
    ).join('');
  }

  function renderGameRanking() {
    const list = $('gameRankingList');
    if (!list) return;
    if (!APP.state.gameRanking.length) {
      list.innerHTML = '<li>Aún no hay puntajes.</li>';
      return;
    }
    list.innerHTML = APP.state.gameRanking.map((r, i) =>
      `<li><span>${i + 1}. ${r.nombre}</span><span>${r.puntaje} pts</span></li>`
    ).join('');
  }

  // ==================== ASTEROID GAME ====================
  function initGame() {
    const canvas = $('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let ship, bullets, enemies, asteroids, particles, powerups;
    let score = 0, running = false, loopId = null, gameTime = 0, lives = 3;
    let hasShield = false, rapidFire = false, rapidFireTimer = 0;
    let mobileLeft = false, mobileRight = false, mobileUp = false, mobileShoot = false;
    let shootCooldown = 0;

    function reset() {
      ship = { x: 400, y: 400, vx: 0, vy: 0, angle: 0, active: true };
      bullets = [];
      enemies = [];
      asteroids = [];
      particles = [];
      powerups = [];
      score = 0;
      gameTime = 0;
      lives = 3;
      hasShield = false;
      rapidFire = false;
      rapidFireTimer = 0;
      shootCooldown = 0;
      updateLives();
      $('gameScoreDisplay').textContent = '0';
      for (let i = 0; i < 2; i++) {
        asteroids.push({
          x: 100 + Math.random() * 600, y: 100 + Math.random() * 600,
          vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
          size: 20 + Math.random() * 15
        });
      }
      running = true;
      $('startGameBtn').style.display = 'none';
      $('restartGameBtn').style.display = 'inline-block';
      if (loopId) cancelAnimationFrame(loopId);
      loopId = requestAnimationFrame(frame);
    }

    function updateLives() {
      const d = document.querySelector('.lives-display');
      if (d) d.textContent = '❤️'.repeat(Math.max(0, lives));
    }

    function spawnPowerup() {
      if (!running) return;
      const types = ['shield', 'rapidfire', 'life'];
      const type = types[Math.floor(Math.random() * types.length)];
      powerups.push({
        x: Math.random() * 750 + 25, y: Math.random() * 750 + 25,
        type, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        size: 12
      });
    }

    function createExplosion(x, y, color, count = 20) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 3 + 1;
        particles.push({
          x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 1, decay: Math.random() * 0.03 + 0.02,
          size: Math.random() * 4 + 2,
          color: color || `hsl(${Math.random() * 60 + 20}, 100%, ${Math.random() * 40 + 40}%)`
        });
      }
    }

    function update() {
      if (!running) return;

      if (ship.active) {
        if (mobileLeft) ship.angle -= 0.1;
        if (mobileRight) ship.angle += 0.1;
        if (mobileUp) {
          ship.vx += 0.2 * Math.cos(ship.angle);
          ship.vy += 0.2 * Math.sin(ship.angle);
        }
      }

      gameTime += 1 / 60;
      if (gameTime > 10 && Math.random() < 0.003) spawnPowerup();

      if (gameTime > 30 && gameTime <= 60) {
        if (Math.random() < 0.005 && enemies.filter(e => e.type === 'splitter').length < 2)
          enemies.push({ type: 'splitter', x: Math.random() * 800, y: Math.random() * 800, vx: (Math.random() - 0.5) * 1.0, vy: (Math.random() - 0.5) * 1.0, size: 25 });
      }
      if (gameTime > 60) {
        const maxShooters = gameTime > 90 ? 3 : 1;
        if (Math.random() < 0.003 && enemies.filter(e => e.type === 'shooter').length < maxShooters)
          enemies.push({ type: 'shooter', x: Math.random() * 800, y: Math.random() * 800, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, size: 18, angle: 0, shootCooldown: 20 });
        if (Math.random() < 0.005 && enemies.filter(e => e.type === 'splitter').length < 3)
          enemies.push({ type: 'splitter', x: Math.random() * 800, y: Math.random() * 800, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2, size: 22 });
      }

      if (Math.random() < 0.01 + gameTime / 3000)
        asteroids.push({ x: Math.random() * 800, y: Math.random() * 800, vx: (Math.random() - 0.5) * (1 + gameTime / 200), vy: (Math.random() - 0.5) * (1 + gameTime / 200), size: 15 + Math.random() * 25 });

      if (ship.active) {
        ship.x += ship.vx;
        ship.y += ship.vy;
        if (ship.x < 0) ship.x = 800;
        if (ship.x > 800) ship.x = 0;
        if (ship.y < 0) ship.y = 800;
        if (ship.y > 800) ship.y = 0;
        ship.vx *= 0.98;
        ship.vy *= 0.98;
      }

      bullets = bullets.filter(b => {
        b.x += b.vx;
        b.y += b.vy;
        return (b.x >= 0 && b.x <= 800 && b.y >= 0 && b.y <= 800);
      });

      enemies.forEach(e => {
        e.x += e.vx;
        e.y += e.vy;
        if (e.x < 0) e.x = 800;
        if (e.x > 800) e.x = 0;
        if (e.y < 0) e.y = 800;
        if (e.y > 800) e.y = 0;
        if (e.type === 'shooter') {
          if (ship.active) e.angle = Math.atan2(ship.y - e.y, ship.x - e.x);
          e.shootCooldown--;
          if (e.shootCooldown <= 0 && ship.active) {
            bullets.push({ x: e.x + e.size * Math.cos(e.angle), y: e.y + e.size * Math.sin(e.angle), vx: 2 * Math.cos(e.angle), vy: 2 * Math.sin(e.angle), enemyBullet: true });
            e.shootCooldown = 60;
          }
        }
      });

      asteroids.forEach(a => {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0) a.x = 800;
        if (a.x > 800) a.x = 0;
        if (a.y < 0) a.y = 800;
        if (a.y > 800) a.y = 0;
      });

      powerups.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 800) p.vx *= -1;
        if (p.y < 0 || p.y > 800) p.vy *= -1;
      });

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        if (b.enemyBullet) continue;
        for (let j = asteroids.length - 1; j >= 0; j--) {
          const a = asteroids[j];
          if (Math.hypot(b.x - a.x, b.y - a.y) < a.size) {
            createExplosion(a.x, a.y, '#aaa');
            bullets.splice(i, 1);
            asteroids.splice(j, 1);
            score += 10;
            $('gameScoreDisplay').textContent = score;
            break;
          }
        }
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        if (b.enemyBullet) continue;
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (Math.hypot(b.x - e.x, b.y - e.y) < e.size + 5) {
            createExplosion(e.x, e.y, e.type === 'shooter' ? '#e94560' : '#ff8c00', 30);
            bullets.splice(i, 1);
            if (e.type === 'splitter') {
              score += 20;
              $('gameScoreDisplay').textContent = score;
              if (e.size > 8) {
                for (let k = 0; k < 2; k++) {
                  enemies.push({ type: 'splitter', x: e.x, y: e.y, vx: e.vx + (Math.random() - 0.5) * 2, vy: e.vy + (Math.random() - 0.5) * 2, size: e.size * 0.7 });
                }
              }
              enemies.splice(j, 1);
            } else {
              score += 30;
              $('gameScoreDisplay').textContent = score;
              enemies.splice(j, 1);
            }
            break;
          }
        }
      }

      if (ship.active) {
        for (let a of asteroids) {
          if (Math.hypot(ship.x - a.x, ship.y - a.y) < a.size + 10) { hitShip(); break; }
        }
        for (let e of enemies) {
          if (Math.hypot(ship.x - e.x, ship.y - e.y) < e.size + 10) { hitShip(); break; }
        }
        for (let b of bullets) {
          if (b.enemyBullet && Math.hypot(ship.x - b.x, ship.y - b.y) < 12) { hitShip(); break; }
        }
        for (let i = powerups.length - 1; i >= 0; i--) {
          const p = powerups[i];
          if (Math.hypot(ship.x - p.x, ship.y - p.y) < p.size + 15) {
            if (p.type === 'shield') { hasShield = true; setTimeout(() => hasShield = false, 5000); }
            else if (p.type === 'rapidfire') { rapidFire = true; rapidFireTimer = 100; }
            else if (p.type === 'life') { lives = Math.min(lives + 1, 5); updateLives(); }
            powerups.splice(i, 1);
          }
        }
      }

      if (rapidFire) {
        rapidFireTimer--;
        if (rapidFireTimer <= 0) rapidFire = false;
      }

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= p.decay;
        p.size *= 0.99;
      });
      particles = particles.filter(p => p.life > 0);
    }

    function hitShip() {
      if (hasShield || !ship.active) return;
      lives--;
      updateLives();
      if (lives <= 0) {
        ship.active = false;
        running = false;
        stopGame();
      } else {
        ship.x = 400;
        ship.y = 400;
        ship.vx = 0;
        ship.vy = 0;
        hasShield = true;
        setTimeout(() => hasShield = false, 2000);
      }
    }

    function stopGame() {
      $('startGameBtn').style.display = 'inline-block';
      $('restartGameBtn').style.display = 'inline-block';
      const highScore = parseInt(localStorage.getItem('astronomia_game_hs')) || 0;
      if (score > highScore) {
        localStorage.setItem('astronomia_game_hs', score);
      }
      let nombre = prompt('¡Fin del juego! Ingresa tu nombre para el ranking:', 'Anónimo');
      if (!nombre) nombre = 'Anónimo';
      APP.state.gameRanking.push({ nombre, puntaje: score, fecha: new Date().toLocaleDateString() });
      APP.state.gameRanking.sort((a, b) => b.puntaje - a.puntaje);
      APP.state.gameRanking = APP.state.gameRanking.slice(0, 10);
      saveState();
      renderGameRanking();
    }

    function draw() {
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, 800, 800);

      asteroids.forEach(a => {
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, 2 * Math.PI);
        ctx.stroke();
      });

      enemies.forEach(e => {
        if (e.type === 'shooter') {
          ctx.save();
          ctx.translate(e.x, e.y);
          ctx.rotate(e.angle);
          ctx.fillStyle = '#e94560';
          ctx.beginPath();
          ctx.moveTo(e.size, 0);
          ctx.lineTo(-e.size * 0.7, -e.size * 0.7);
          ctx.lineTo(-e.size * 0.7, e.size * 0.7);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = '#ff8c00';
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      ctx.fillStyle = 'yellow';
      bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });

      powerups.forEach(p => {
        const colors = { shield: '#00aaff', rapidfire: '#ffaa00', life: '#44ff44' };
        ctx.fillStyle = colors[p.type] || '#fff';
        ctx.shadowColor = colors[p.type] || '#fff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icons = { shield: '🛡', rapidfire: '⚡', life: '❤' };
        ctx.fillText(icons[p.type] || '?', p.x, p.y);
      });

      particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (ship.active) {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, -10);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        if (hasShield) {
          ctx.strokeStyle = 'rgba(0, 170, 255, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(ship.x, ship.y, 22, 0, 2 * Math.PI);
          ctx.stroke();
        }
        if (rapidFire) {
          ctx.fillStyle = 'rgba(255, 170, 0, 0.15)';
          ctx.beginPath();
          ctx.arc(ship.x, ship.y, 30, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      const highScore = parseInt(localStorage.getItem('astronomia_game_hs')) || 0;
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`🏆 Récord: ${highScore}`, 780, 20);

      if (!ship.active) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('¡GAME OVER!', 400, 360);
        ctx.font = '18px sans-serif';
        ctx.fillText(`Puntuación final: ${score}`, 400, 400);
      }
    }

    function frame() {
      update();
      draw();
      loopId = requestAnimationFrame(frame);
    }

    const keys = {};
    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === ' ') {
        e.preventDefault();
        if (running && ship.active) {
          bullets.push({
            x: ship.x + 15 * Math.cos(ship.angle), y: ship.y + 15 * Math.sin(ship.angle),
            vx: ship.vx + 5 * Math.cos(ship.angle), vy: ship.vy + 5 * Math.sin(ship.angle)
          });
        }
      }
      keys[e.key] = true;
    });
    window.addEventListener('keyup', e => { keys[e.key] = false; });

    setInterval(() => {
      if (!running || !ship.active) return;
      if (keys['ArrowLeft']) ship.angle -= 0.1;
      if (keys['ArrowRight']) ship.angle += 0.1;
      if (keys['ArrowUp']) {
        ship.vx += 0.2 * Math.cos(ship.angle);
        ship.vy += 0.2 * Math.sin(ship.angle);
      }
    }, 20);

    $('mobileLeftBtn').addEventListener('mousedown', e => { e.preventDefault(); mobileLeft = true; });
    $('mobileLeftBtn').addEventListener('mouseup', () => mobileLeft = false);
    $('mobileLeftBtn').addEventListener('touchstart', e => { e.preventDefault(); mobileLeft = true; });
    $('mobileLeftBtn').addEventListener('touchend', () => mobileLeft = false);
    $('mobileRightBtn').addEventListener('mousedown', e => { e.preventDefault(); mobileRight = true; });
    $('mobileRightBtn').addEventListener('mouseup', () => mobileRight = false);
    $('mobileRightBtn').addEventListener('touchstart', e => { e.preventDefault(); mobileRight = true; });
    $('mobileRightBtn').addEventListener('touchend', () => mobileRight = false);
    $('mobileUpBtn').addEventListener('mousedown', e => { e.preventDefault(); mobileUp = true; });
    $('mobileUpBtn').addEventListener('mouseup', () => mobileUp = false);
    $('mobileUpBtn').addEventListener('touchstart', e => { e.preventDefault(); mobileUp = true; });
    $('mobileUpBtn').addEventListener('touchend', () => mobileUp = false);
    $('mobileShootBtn').addEventListener('mousedown', e => { e.preventDefault(); mobileShoot = true; });
    $('mobileShootBtn').addEventListener('touchstart', e => { e.preventDefault(); mobileShoot = true; });

    $('startGameBtn').addEventListener('click', reset);
    $('restartGameBtn').addEventListener('click', reset);
    $('fullscreenBtn').addEventListener('click', () => {
      if (!document.fullscreenElement) document.querySelector('.game-container').requestFullscreen();
      else document.exitFullscreen();
    });
  }

  // ==================== CONSTELLATIONS ====================
  function drawConstellation(name) {
    const canvas = $('constellationCanvas');
    const info = $('constellationInfo');
    if (!canvas || !info) return;
    const ctx = canvas.getContext('2d');
    const data = DATA.constelaciones[name];
    if (!data) { info.textContent = 'Selecciona una constelación arriba'; return; }

    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const starGrad = ctx.createRadialGradient(300, 200, 10, 300, 200, 350);
    starGrad.addColorStop(0, '#0a0a1a');
    starGrad.addColorStop(1, '#050510');
    ctx.fillStyle = starGrad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.2, 0, 2 * Math.PI);
      ctx.fill();
    }

    data.lines.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(data.stars[a].x, data.stars[a].y);
      ctx.lineTo(data.stars[b].x, data.stars[b].y);
      ctx.strokeStyle = 'rgba(100, 180, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    data.stars.forEach(s => {
      const isMain = s.label !== '';
      const r = isMain ? 3 : 2;
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 4);
      glow.addColorStop(0, 'rgba(255,255,200,0.3)');
      glow.addColorStop(1, 'rgba(255,255,200,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r * 4, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, 2 * Math.PI);
      ctx.fill();

      if (s.label) {
        ctx.fillStyle = '#aac';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(s.label, s.x + 8, s.y + 4);
      }
    });

    info.innerHTML = `<strong>${name}</strong> — ${data.info}`;
    qsa('.constellation-selector button').forEach(b => b.classList.toggle('active', b.dataset.const === name));
  }

  function initConstellations() {
    const selector = $('constellationSelector');
    if (!selector) return;
    const names = Object.keys(DATA.constelaciones);
    names.forEach(n => {
      const btn = document.createElement('button');
      btn.textContent = n;
      btn.dataset.const = n;
      btn.addEventListener('click', () => drawConstellation(n));
      selector.appendChild(btn);
    });
    if (names.length) drawConstellation(names[0]);
  }

  // ==================== KEYBOARD SHORTCUTS ====================
  function initKeyboard() {
    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      if (key === 'd') $('themeToggle')?.click();
      if (key === '/') { e.preventDefault(); $('globalSearch')?.focus(); }
      if (key === '?') showToast('⌨️ Atajos: D=modo oscuro, /=buscar, 1-9=pestañas', 'info');
      if (key >= '1' && key <= '9') {
        const tab = qs(`.tab-btn[data-tab="tab${key}"]`);
        if (tab) tab.click();
      }
      if (key === '0') {
        const tab = qs('.tab-btn[data-tab="tab10"]');
        if (tab) tab.click();
      }
    });
  }

  // ==================== GLOBAL SEARCH ====================
  function initSearch() {
    $('globalSearchBtn').addEventListener('click', () => {
      const q = $('globalSearch').value.toLowerCase();
      filterTabs(q);
      if (q) showToast(`🔍 Buscando: "${q}"`, 'info');
    });
    $('globalSearch').addEventListener('keydown', e => {
      if (e.key === 'Enter') $('globalSearchBtn')?.click();
      if (e.key === 'Escape') { e.target.value = ''; filterTabs(''); e.target.blur(); }
    });
  }

  function filterTabs(q) {
    qsa('.tab-btn').forEach((btn, i) => {
      if (!q) { btn.style.display = ''; return; }
      const text = btn.textContent.toLowerCase();
      const content = qsa('.tab-content')[i];
      const contentText = content ? content.textContent.toLowerCase() : '';
      btn.style.display = (text.includes(q) || contentText.includes(q)) ? '' : 'none';
    });
  }

  // ==================== BACK TO TOP ====================
  function initBackToTop() {
    const btn = $('backToTopBtn');
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ==================== SHOOTING STARS ====================
  function createShootingStar() {
    const star = document.createElement('div');
    star.style.cssText = `
      position:fixed; width:3px; height:3px; background:white; border-radius:50%;
      pointer-events:none; z-index:9999;
      left:${Math.random() * 80 + 10}%; top:${Math.random() * 40 + 5}%;
      animation: shoot 1s ease-out forwards;
    `;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1200);
  }

  // ==================== WELCOME ====================
  function showWelcome() {
    const hora = new Date().getHours();
    let saludo = 'Buenos días';
    if (hora >= 12 && hora < 18) saludo = 'Buenas tardes';
    else if (hora >= 18) saludo = 'Buenas noches';
    setTimeout(() => showToast(`✨ ${saludo}, bienvenido al Semillero Astronómico`, 'success'), 1500);
  }

  // ==================== INIT ====================
  (function init() {
    loadState();
    checkDailyReset();

    initTabs();
    initTheme();
    initAdmin();
    initNewsForm();
    initStarfield();
    initGravitySim();
    initCalculators();
    initSolarSystem();
    initAgeWeight();
    initAIChat();
    initQuiz();
    initGame();
    initConstellations();
    initSpaceHistory();
    initRandomSpace();
    initFacts();
    initKeyboard();
    initSearch();
    initBackToTop();

    renderPlanetGrid();
    renderComparison();
    renderGallery();
    renderNews();
    renderRanking();
    renderGameRanking();
    renderEvents();
    renderMissions();
    rotateEfemerides();
    drawMoon();

    setInterval(rotateEfemerides, 10000);
    setInterval(drawMoon, 3600000);
    setInterval(createShootingStar, 8000);

    loadAPOD();
    countVisit();
    showWelcome();

    updateVisitDisplay();

    document.body.addEventListener('click', () => {
      // first click to enable audio
    }, { once: true });
  })();

})();
