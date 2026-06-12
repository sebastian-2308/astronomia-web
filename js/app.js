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
    efemerideIndex: 0,
    notifications: [],
    foroPosts: {}
  };

  const ADMIN_USER = 'sebas2308';
  const ADMIN_PASS = 'seya2308';
  const ADMIN_EMAIL = 'sebastianalfonzo23@gmail.com';

  // ==================== GITHUB STORAGE ====================
  const GIT_TOKEN = window.GIT_TOKEN || '';
  const GIT_OWNER = 'sebastian-2308';
  const GIT_REPO = 'astronomia-web';
  const GIT_FILE = 'data/registros.json';

  async function githubGetFile() {
    try {
      const res = await fetch(`https://api.github.com/repos/${GIT_OWNER}/${GIT_REPO}/contents/${GIT_FILE}`, {
        headers: { Authorization: `token ${GIT_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
      });
      if (!res.ok) return { content: [], sha: null };
      const data = await res.json();
      const content = JSON.parse(atob(data.content));
      return { content, sha: data.sha };
    } catch(e) { return { content: [], sha: null }; }
  }

  async function githubSaveFile(content, sha, message) {
    try {
      const body = {
        message: message || 'Actualizar registros',
        content: btoa(JSON.stringify(content, null, 2)),
        sha: sha
      };
      const res = await fetch(`https://api.github.com/repos/${GIT_OWNER}/${GIT_REPO}/contents/${GIT_FILE}`, {
        method: 'PUT',
        headers: { Authorization: `token ${GIT_TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github.v3+json' },
        body: JSON.stringify(body)
      });
      return res.ok;
    } catch(e) { return false; }
  }

  // ==================== USER MANAGEMENT (GitHub-backed) ====================
  let _cachedUsers = null;

  async function getUsers() {
    if (_cachedUsers) return _cachedUsers;
    const result = await githubGetFile();
    _cachedUsers = result.content || [];
    return _cachedUsers;
  }

  async function saveUsers(users) {
    _cachedUsers = users;
    const result = await githubGetFile();
    const sha = result.sha;
    await githubSaveFile(users, sha, 'Actualizar registros de usuarios');
  }

  async function registerUser(email, username, password) {
    const users = await getUsers();
    if (users.find(u => u.username === username)) return { error: 'El usuario ya existe' };
    if (users.find(u => u.email === email)) return { error: 'El correo ya está registrado' };
    const newUser = { email, username, password, registeredAt: new Date().toISOString(), progress: { trivia: [], game: [] } };
    users.push(newUser);
    await saveUsers(users);
    return { success: true, user: newUser };
  }

  async function loginUser(username, password) {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return { user: { username: ADMIN_USER, email: ADMIN_EMAIL, isAdmin: true } };
    }
    const users = await getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return { error: 'Usuario o contraseña incorrectos' };
    return { user: { username: user.username, email: user.email, isAdmin: false } };
  }

  function getCurrentUser() {
    try {
      return JSON.parse(sessionStorage.getItem('astronomia_current_user'));
    } catch(e) { return null; }
  }

  function setCurrentUser(user) {
    if (user) {
      sessionStorage.setItem('astronomia_current_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('astronomia_current_user');
    }
  }

  function logoutUser() {
    setCurrentUser(null);
    APP.state.isAdmin = false;
    updateAdminUI();
    updateUserBtn();
    showToast('👋 Sesión cerrada', 'info');
  }

  async function getUserData(username) {
    const users = await getUsers();
    return users.find(u => u.username === username) || null;
  }

  async function saveUserProgress(username, type, score) {
    const users = await getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return;
    if (!user.progress) user.progress = { trivia: [], game: [] };
    if (!user.progress[type]) user.progress[type] = [];
    user.progress[type].push({ puntaje: score, fecha: new Date().toISOString() });
    await saveUsers(users);
  }

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
        facts: APP.state.facts,
        efemerides: APP.state.efemerides,
        notifications: APP.state.notifications,
        foroPosts: APP.state.foroPosts
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
        if (data.facts) APP.state.facts = data.facts;
        if (data.efemerides) APP.state.efemerides = data.efemerides;
        if (data.notifications) APP.state.notifications = data.notifications;
        if (data.foroPosts) APP.state.foroPosts = data.foroPosts;
      }
    } catch (e) { /* ignore */ }
  }

  // ==================== NOTIFICATIONS ====================
  function addNotification(icon, text) {
    APP.state.notifications.unshift({
      icon,
      text,
      time: new Date().toLocaleString('es-VE'),
      read: false,
      id: Date.now() + Math.random()
    });
    if (APP.state.notifications.length > 50) APP.state.notifications.pop();
    saveState();
    renderNotificationBadge();
  }

  function getUnreadNotifCount() {
    return APP.state.notifications.filter(n => !n.read).length;
  }

  function markAllNotifRead() {
    APP.state.notifications.forEach(n => n.read = true);
    saveState();
    renderNotificationBadge();
    renderNotificationList();
  }

  function renderNotificationBadge() {
    const badge = $('notificationBadge');
    const count = getUnreadNotifCount();
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  function renderNotificationList() {
    const list = $('notificationList');
    if (!list) return;
    if (!APP.state.notifications.length) {
      list.innerHTML = '<div style="padding:1rem;color:var(--text-secondary);font-size:0.85rem;">Sin notificaciones</div>';
      return;
    }
    list.innerHTML = APP.state.notifications.map(n => `
      <div class="notif-item${n.read ? '' : ' unread'}" data-notif-id="${n.id}">
        <span class="notif-icon">${n.icon}</span>
        <div class="notif-body">
          <div class="notif-text">${n.text}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');
  }

  function initNotifications() {
    renderNotificationBadge();
    renderNotificationList();

    $('notificationBell').addEventListener('click', (e) => {
      e.stopPropagation();
      $('notificationDropdown').classList.toggle('open');
    });

    $('markAllNotifRead').addEventListener('click', () => {
      markAllNotifRead();
    });

    document.addEventListener('click', () => {
      $('notificationDropdown')?.classList.remove('open');
    });

    $('notificationList').addEventListener('click', (e) => {
      const item = e.target.closest('.notif-item');
      if (item) {
        const id = item.dataset.notifId;
        const notif = APP.state.notifications.find(n => n.id == id);
        if (notif) {
          notif.read = true;
          saveState();
          renderNotificationBadge();
          renderNotificationList();
        }
      }
    });
  }

  // ==================== FOROS ====================
  function getForoKey(courseId, foroType) {
    return courseId + '_' + foroType;
  }

  function getForoPosts(courseId, foroType) {
    const key = getForoKey(courseId, foroType);
    return APP.state.foroPosts[key] || [];
  }

  function addForoPost(courseId, foroType, autor, texto) {
    const key = getForoKey(courseId, foroType);
    if (!APP.state.foroPosts[key]) APP.state.foroPosts[key] = [];
    APP.state.foroPosts[key].push({
      autor,
      texto,
      fecha: new Date().toLocaleString('es-VE'),
      respuestas: []
    });
    saveState();
  }

  function addForoReply(courseId, foroType, postIdx, autor, texto) {
    const key = getForoKey(courseId, foroType);
    const posts = APP.state.foroPosts[key];
    if (!posts || !posts[postIdx]) return;
    posts[postIdx].respuestas.push({
      autor,
      texto,
      fecha: new Date().toLocaleString('es-VE')
    });
    saveState();
  }

  function renderForo(courseId, foroType, containerId) {
    const curso = DATA.cursosVirtuales.find(c => c.id === courseId);
    if (!curso || !curso.foros) return;
    const foroData = curso.foros[foroType];
    if (!foroData) return;

    const container = $(containerId);
    if (!container) return;

    const currentStudent = getCurrentUser() ? getCurrentUser().username : 'Anónimo';
    const posts = getForoPosts(courseId, foroType);

    let html = `<div style="margin-bottom:1rem;">
      <h3 style="font-size:1rem;">${foroData.titulo}</h3>
      <p style="font-size:0.85rem;color:var(--text-secondary);">${foroData.desc}</p>
    </div>`;

    if (posts.length === 0) {
      html += '<div class="foro-empty">💬 Aún no hay publicaciones. ¡Sé el primero en preguntar!</div>';
    } else {
      html += posts.map((post, idx) => `
        <div class="foro-post">
          <div class="foro-post-header">
            <span class="foro-post-author">${post.autor}</span>
            <span class="foro-post-date">${post.fecha}</span>
          </div>
          <div class="foro-post-text">${post.texto}</div>
          ${post.respuestas.map(r => `
            <div class="foro-post-reply">
              <span class="reply-author">${r.autor}</span>: ${r.texto}
              <span style="float:right;font-size:0.7rem;color:var(--text-secondary);">${r.fecha}</span>
            </div>
          `).join('')}
          <div style="margin-top:0.5rem;">
            <button class="btn btn-xs btn-secondary foro-reply-btn" data-course="${courseId}" data-foro="${foroType}" data-idx="${idx}">💬 Responder</button>
          </div>
        </div>
      `).join('');
    }

    html += `
      <div class="foro-new-post-area">
        <strong style="font-size:0.9rem;">Nueva publicación</strong>
        <textarea class="form-input" id="foroNewPostText_${courseId}_${foroType}" rows="2" placeholder="Escribe tu mensaje..."></textarea>
        <button class="btn btn-sm btn-primary foro-new-post-btn" data-course="${courseId}" data-foro="${foroType}">Publicar</button>
      </div>
    `;

    container.innerHTML = html;
  }

  // ==================== TUTOR IA (Aula Virtual) ====================
  function initTutorIA() {
    $('tutorAskBtn')?.addEventListener('click', askTutor);
    $('tutorQuestion')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') askTutor();
    });
    document.querySelectorAll('.tutor-suggest').forEach(btn => {
      btn.addEventListener('click', () => {
        $('tutorQuestion').value = btn.dataset.q;
        askTutor();
      });
    });
  }

  async function askTutor() {
    const input = $('tutorQuestion');
    const q = input.value.trim();
    if (!q) return;

    const chatBox = $('tutorChatBox');
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.textContent = q;
    chatBox.appendChild(userDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    const thinkDiv = document.createElement('div');
    thinkDiv.className = 'chat-msg bot';
    thinkDiv.textContent = '🤔 Pensando...';
    chatBox.appendChild(thinkDiv);

    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent('Eres tutor de astronomía. Responde en español, claro y educativo, como si enseñaras a un estudiante. Pregunta: ' + q)}`);
      const txt = await res.text();
      thinkDiv.remove();
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg bot';
      botDiv.textContent = txt;
      chatBox.appendChild(botDiv);
    } catch (e) {
      thinkDiv.remove();
      const errDiv = document.createElement('div');
      errDiv.className = 'chat-msg bot';
      errDiv.textContent = '⚠️ Error al consultar la IA. Intenta de nuevo.';
      chatBox.appendChild(errDiv);
    }
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
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
    if (localStorage.getItem('astronomia_theme') === 'light') {
      document.body.classList.add('light-mode');
    }
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('astronomia_theme', isLight ? 'light' : 'dark');
    });
  }

  // ==================== ADMIN ====================
  function initAdmin() {
    const authModal = $('authModal');

    // Auth tab switching
    $('authTabLogin').addEventListener('click', () => {
      $('authTabLogin').style.cssText = 'flex:1;padding:0.6rem;border:none;background:transparent;color:var(--accent);font-weight:600;border-bottom:2px solid var(--accent);cursor:pointer;font-size:0.95rem;';
      $('authTabRegister').style.cssText = 'flex:1;padding:0.6rem;border:none;background:transparent;color:var(--text-secondary);cursor:pointer;font-size:0.95rem;';
      $('authLoginForm').style.display = 'block';
      $('authRegisterForm').style.display = 'none';
      $('authLoginError').style.display = 'none';
      $('authRegError').style.display = 'none';
    });
    $('authTabRegister').addEventListener('click', () => {
      $('authTabRegister').style.cssText = 'flex:1;padding:0.6rem;border:none;background:transparent;color:var(--accent);font-weight:600;border-bottom:2px solid var(--accent);cursor:pointer;font-size:0.95rem;';
      $('authTabLogin').style.cssText = 'flex:1;padding:0.6rem;border:none;background:transparent;color:var(--text-secondary);cursor:pointer;font-size:0.95rem;';
      $('authLoginForm').style.display = 'none';
      $('authRegisterForm').style.display = 'block';
      $('authLoginError').style.display = 'none';
      $('authRegError').style.display = 'none';
    });

    function openAuth() {
      authModal.classList.add('open');
      $('authLoginError').style.display = 'none';
      $('authRegError').style.display = 'none';
      $('authLoginUser').value = '';
      $('authLoginPass').value = '';
      $('authRegEmail').value = '';
      $('authRegUser').value = '';
      $('authRegPass').value = '';
    }

    // User button in header
    $('userBtn').addEventListener('click', async () => {
      const user = getCurrentUser();
      if (user) {
        await showProfileModal(user);
      } else {
        openAuth();
      }
    });

    // Cancel buttons
    $('authCancelBtn').addEventListener('click', () => authModal.classList.remove('open'));
    $('authRegCancelBtn').addEventListener('click', () => authModal.classList.remove('open'));

    // Profile modal
    $('closeProfileBtn').addEventListener('click', () => $('profileModal').classList.remove('open'));
    $('profileLogoutBtn').addEventListener('click', () => {
      $('profileModal').classList.remove('open');
      logoutUser();
      updateUserBtn();
    });
    $('profileModal').addEventListener('click', e => {
      if (e.target === $('profileModal')) $('profileModal').classList.remove('open');
    });

    // Login
    $('authLoginBtn').addEventListener('click', async () => {
      const u = $('authLoginUser').value.trim();
      const p = $('authLoginPass').value;
      const result = await loginUser(u, p);
      if (result.error) {
        $('authLoginError').textContent = result.error;
        $('authLoginError').style.display = 'block';
        return;
      }
      APP.state.isAdmin = result.user.isAdmin;
      if (result.user.isAdmin) APP.state.currentUser = result.user;
      setCurrentUser(result.user);
      authModal.classList.remove('open');
      updateAdminUI();
      updateUserBtn();
      showToast(`👋 ¡Bienvenido, ${result.user.username}!`, 'success');
      if (window._onAuthCallback) window._onAuthCallback(result.user);
    });

    // Register
    $('authRegisterBtn').addEventListener('click', async () => {
      const email = $('authRegEmail').value.trim();
      const user = $('authRegUser').value.trim();
      const pass = $('authRegPass').value;
      if (!email || !user || !pass) {
        $('authRegError').textContent = 'Todos los campos son obligatorios';
        $('authRegError').style.display = 'block';
        return;
      }
      if (!email.includes('@')) {
        $('authRegError').textContent = 'Ingresa un correo válido';
        $('authRegError').style.display = 'block';
        return;
      }
      const result = await registerUser(email, user, pass);
      if (result.error) {
        $('authRegError').textContent = result.error;
        $('authRegError').style.display = 'block';
        return;
      }
      const loginResult = await loginUser(user, pass);
      APP.state.isAdmin = loginResult.user.isAdmin;
      setCurrentUser(loginResult.user);
      authModal.classList.remove('open');
      updateAdminUI();
      updateUserBtn();
      showToast('✅ Registro exitoso! Bienvenido!', 'success');
      addNotification('📝', `${user} se registró en la plataforma`);
      if (window._onAuthCallback) window._onAuthCallback(loginResult.user);
    });

    // Enter key support
    $('authLoginPass').addEventListener('keydown', e => { if (e.key === 'Enter') $('authLoginBtn').click(); });
    $('authRegPass').addEventListener('keydown', e => { if (e.key === 'Enter') $('authRegisterBtn').click(); });

    // Admin buttons
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

    // Send notification to all users
    $('sendNotifBtn').addEventListener('click', () => {
      const title = $('notifTitleInput').value.trim();
      const msg = $('notifMsgInput').value.trim();
      if (!title || !msg) { showToast('⚠️ Completa título y mensaje', 'warning'); return; }
      $('notifTitleInput').value = '';
      $('notifMsgInput').value = '';
      $('notifStatus').textContent = '✅ Notificación registrada';
      addNotification('📨', `Anuncio: ${title}`);
      showToast('📨 Anuncio enviado', 'success');
    });

    $('addGalleryBtn').addEventListener('click', () => openGalleryEditor(-1));

    // View registered users
    $('viewUsersBtn').addEventListener('click', async () => {
      const result = await githubGetFile();
      const users = result.content || [];
      if (users.length === 0) {
        $('usersModalBody').innerHTML = '<p style="color:var(--text-secondary);">No hay usuarios registrados aún.</p>';
      } else {
        $('usersModalBody').innerHTML = `<p style="margin-bottom:0.5rem;color:var(--text-secondary);">Total: <strong>${users.length}</strong></p>` +
          users.map((u, i) => `<div style="padding:0.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
            <div><strong>${u.username}</strong><br><span style="font-size:0.8rem;color:var(--text-secondary);">${u.email}</span></div>
            <span style="font-size:0.75rem;color:var(--text-secondary);">${new Date(u.registeredAt).toLocaleDateString('es-VE')}</span>
          </div>`).join('');
      }
      $('usersModal').classList.add('open');
    });
    $('closeUsersBtn').addEventListener('click', () => $('usersModal').classList.remove('open'));
    $('usersModal').addEventListener('click', e => {
      if (e.target === $('usersModal')) $('usersModal').classList.remove('open');
    });

    initEfemeridesAdmin();
    initEditModal();
  }

  function updateUserBtn() {
    const user = getCurrentUser();
    const btn = $('userBtn');
    if (user) {
      if (user.isAdmin) {
        btn.textContent = '👑';
        btn.title = `Admin: ${user.username}`;
      } else {
        btn.textContent = '👤';
        btn.title = user.username;
      }
    } else {
      btn.textContent = '👤';
      btn.title = 'Iniciar sesión';
    }
  }

  function updateAdminUI() {
    const user = getCurrentUser();
    APP.state.isAdmin = user && user.isAdmin;
    if (APP.state.isAdmin) {
      qsa('.admin-panel').forEach(el => el.style.display = 'block');
      $('adminVisitasPanel').style.display = 'block';
      $('adminControlsPanel').style.display = 'block';
      $('efemeridesAdminPanel').style.display = 'block';
      $('galleryAdminBar').style.display = 'block';
      updateVisitDisplay();
    } else {
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
      <div class="gallery-item" data-gal-img="${obj.img}">
        ${APP.state.isAdmin ? `<div style="position:absolute;top:8px;right:8px;display:flex;gap:4px;z-index:10;">
          <button class="btn btn-xs btn-secondary" data-edit-gal="${i}">✏️</button>
          <button class="btn btn-xs btn-danger" data-del-gal="${i}">✕</button>
        </div>` : ''}
        <img src="${obj.img}" alt="${obj.nombre}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML+='<div style=\\'height:180px;display:flex;align-items:center;justify-content:center;font-size:3rem;\\'>🌌</div>'">
        <div class="caption"><h3>${obj.nombre}</h3><p>${obj.desc}</p></div>
      </div>
    `).join('');

    qsa('.gallery-item').forEach(el => {
      el.addEventListener('click', () => {
        const imgUrl = el.dataset.galImg;
        if (imgUrl) window.open(imgUrl, '_blank');
      });
    });

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
          <a href="${data.hdurl || data.url}" target="_blank">
            ${data.media_type === 'image'
              ? `<img src="${data.url}" style="max-width:100%;border-radius:var(--radius);" loading="lazy">`
              : `<iframe src="${data.url}" style="width:100%;height:400px;border-radius:var(--radius);border:none;"></iframe>`
            }
          </a>
          <h3 style="margin-top:0.75rem;">${data.title}</h3>
          <small style="color:var(--text-secondary);">📅 ${data.date || ''}</small>
          <p style="margin-top:0.5rem;text-align:left;color:var(--text-secondary);font-size:0.9rem;">${data.explanation}</p>
        </div>`;
    } catch (e) {
      c.innerHTML = `
        <div class="result-box">
          ⏳ Límite de API alcanzado. Mira la
          <a href="https://apod.nasa.gov/apod/astropix.html" target="_blank">página oficial de la NASA</a>
          o prueba <a href="https://www.nasa.gov/image-of-the-day/" target="_blank">NASA Image of the Day</a>.
        </div>`;
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

    function convertirUnidades() {
      const ua = +$('ua').value;
      if (!isNaN(ua) && ua > 0) {
        const km = ua * 149597870.7;
        const pc = ua / 206264.8;
        const ly = ua / 63241.1;
        $('km').value = km.toExponential(4);
        $('pc').value = pc.toExponential(4);
        $('ly').value = ly.toExponential(4);
        $('resultConversor').innerHTML = `${ua} UA = ${km.toLocaleString()} km = ${pc.toExponential(4)} pc = ${ly.toExponential(4)} ly`;
      }
    }

    $('convertirAstro').addEventListener('click', convertirUnidades);
    ['ua', 'km', 'pc', 'ly'].forEach(id => {
      $(id).addEventListener('input', () => {
        if (id === 'ua') convertirUnidades();
      });
      $(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') convertirUnidades();
      });
    });
    setTimeout(convertirUnidades, 100);

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
    $('nextQuestionBtn').addEventListener('click', () => {
      if (quizState.active) {
        $('nextQuestionBtn').style.display = 'none';
        loadNextQuestion();
      }
    });

    // Auth buttons for quiz
    $('quizLoginBtn').addEventListener('click', () => {
      window._onAuthCallback = (user) => {
        startQuiz(user.username);
        window._onAuthCallback = null;
      };
      $('authModal').classList.add('open');
    });
    $('quizRegisterBtn').addEventListener('click', () => {
      // Switch to register tab
      $('authTabRegister').click();
      window._onAuthCallback = (user) => {
        startQuiz(user.username);
        window._onAuthCallback = null;
      };
      $('authModal').classList.add('open');
    });

    // Check if already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      $('quizAuthRequired').innerHTML = `<p style="color:var(--text-secondary);">👋 Bienvenido, <strong>${currentUser.username}</strong>! </p><button class="btn btn-success" id="startQuizBtn" style="margin-top:0.5rem;">Comenzar Desafío</button>`;
      $('startQuizBtn').addEventListener('click', () => startQuiz(currentUser.username));
    }
  }

  function startQuiz(name) {
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
          $('loginSection').innerHTML = `<p style="color:var(--text-secondary);margin-bottom:1rem;">🔐 Inicia sesión para jugar de nuevo.</p><button class="btn btn-primary" id="quizLoginBtn">Iniciar Sesión</button> <button class="btn btn-secondary" id="quizRegisterBtn" style="margin-left:0.5rem;">Registrarse</button>`;
          $('quizLoginBtn').addEventListener('click', () => {
            window._onAuthCallback = (user) => { startQuiz(user.username); window._onAuthCallback = null; };
            $('authModal').classList.add('open');
          });
          $('quizRegisterBtn').addEventListener('click', () => {
            $('authTabRegister').click();
            window._onAuthCallback = (user) => { startQuiz(user.username); window._onAuthCallback = null; };
            $('authModal').classList.add('open');
          });
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
        $('loginSection').innerHTML = `<p style="color:var(--text-secondary);margin-bottom:1rem;">🏆 ¡Completaste las 100!</p><button class="btn btn-primary" id="quizLoginBtn">Volver a jugar</button>`;
        $('quizLoginBtn').addEventListener('click', () => {
          const user = getCurrentUser();
          if (user) startQuiz(user.username);
          else {
            window._onAuthCallback = (u) => { startQuiz(u.username); window._onAuthCallback = null; };
            $('authModal').classList.add('open');
          }
        });
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
        $('loginSection').innerHTML = `<p style="color:var(--text-secondary);margin-bottom:1rem;">❌ Fallaste. Puntuación: ${quizState.score}</p><button class="btn btn-primary" id="quizLoginBtn">Intentar de nuevo</button>`;
        $('quizLoginBtn').addEventListener('click', () => {
          const user = getCurrentUser();
          if (user) startQuiz(user.username);
          else {
            window._onAuthCallback = (u) => { startQuiz(u.username); window._onAuthCallback = null; };
            $('authModal').classList.add('open');
          }
        });
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
    // Save to GitHub if logged in
    const user = getCurrentUser();
    if (user && !user.isAdmin) {
      saveUserProgress(user.username, 'trivia', puntaje);
    }
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

  // ==================== ASTEROID GAME (IMPROVED) ====================
  function initGame() {
    const canvas = $('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let ship, bullets, enemies, asteroids, particles, powerups, bgStars;
    let score = 0, running = false, loopId = null, gameTime = 0, lives = 3, level = 1;
    let hasShield = false, rapidFire = false, rapidFireTimer = 0, paused = false;
    let mobileLeft = false, mobileRight = false, mobileUp = false;
    let keys = {};
    let shootCooldown = 0, hitFlash = 0;
    let finalScore = 0;

    function reset() {
      ship = { x: 400, y: 400, vx: 0, vy: 0, angle: -Math.PI / 2, active: true };
      bullets = []; enemies = []; asteroids = []; particles = []; powerups = [];
      score = 0; gameTime = 0; lives = 3; level = 1;
      hasShield = false; rapidFire = false; rapidFireTimer = 0; paused = false;
      shootCooldown = 0; hitFlash = 0;
      bgStars = [];
      for (let i = 0; i < 80; i++) {
        bgStars.push({ x: Math.random() * 800, y: Math.random() * 800, r: Math.random() * 1.5 + 0.3, s: Math.random() * 0.3 + 0.05 });
      }
      for (let i = 0; i < 3; i++) {
        asteroids.push(spawnAsteroid(20 + Math.random() * 20, null));
      }
      running = true;
      $('startGameBtn').style.display = 'none';
      $('restartGameBtn').style.display = 'inline-block';
      $('pauseGameBtn').style.display = 'inline-block';
      $('pauseGameBtn').textContent = '⏸️ Pausa';
      $('gameOverOverlay').style.display = 'none';
      $('gameNameInput').style.display = 'none';
      if (loopId) cancelAnimationFrame(loopId);
      loopId = requestAnimationFrame(frame);
    }

    function spawnAsteroid(size, pos) {
      const sides = Math.floor(Math.random() * 4) + 6;
      const shape = [];
      for (let i = 0; i < sides; i++) {
        const a = (i / sides) * 2 * Math.PI;
        const rad = size * (0.7 + Math.random() * 0.3);
        shape.push({ x: Math.cos(a) * rad, y: Math.sin(a) * rad });
      }
      return {
        x: pos ? pos.x : Math.random() * 700 + 50,
        y: pos ? pos.y : Math.random() * 700 + 50,
        vx: (Math.random() - 0.5) * (1 + level * 0.15),
        vy: (Math.random() - 0.5) * (1 + level * 0.15),
        size, shape, sides,
        color: `hsl(${30 + Math.random() * 30}, ${20 + Math.random() * 30}%, ${35 + Math.random() * 25}%)`,
        rot: Math.random() * 6.28, rotSpeed: (Math.random() - 0.5) * 0.03
      };
    }

    function spawnPowerup(x, y) {
      if (!running) return;
      const types = ['shield', 'rapidfire', 'life'];
      const type = types[Math.floor(Math.random() * types.length)];
      powerups.push({
        x: x || Math.random() * 750 + 25, y: y || Math.random() * 750 + 25,
        type, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, size: 14,
        pulse: 0
      });
    }

    function createExplosion(x, y, color, count) {
      count = count || 20 + Math.floor(score / 10);
      const hue = parseInt(color ? color.slice(1) : 'ffaa00', 16);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * (3 + level * 0.3) + 1;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 1, decay: Math.random() * 0.025 + 0.015,
          size: Math.random() * 4 + 2,
          color: `hsl(${hue >> 16}, 100%, ${Math.random() * 30 + 50}%)`
        });
      }
    }

    function update() {
      if (!running || paused) return;

      if (ship.active) {
        if (keys['ArrowLeft'] || keys['a']) ship.angle -= 0.08;
        if (keys['ArrowRight'] || keys['d']) ship.angle += 0.08;
        if (keys['ArrowUp'] || keys['w'] || mobileUp) {
          ship.vx += 0.15 * Math.cos(ship.angle);
          ship.vy += 0.15 * Math.sin(ship.angle);
          for (let i = 0; i < 2; i++) {
            particles.push({
              x: ship.x - 8 * Math.cos(ship.angle),
              y: ship.y - 8 * Math.sin(ship.angle),
              vx: -Math.cos(ship.angle) * (1 + Math.random()) + ship.vx * 0.3,
              vy: -Math.sin(ship.angle) * (1 + Math.random()) + ship.vy * 0.3,
              life: 0.6, decay: 0.03 + Math.random() * 0.02,
              size: 2 + Math.random() * 3,
              color: `hsl(${30 + Math.random() * 20}, 100%, ${60 + Math.random() * 30}%)`
            });
          }
        }
        if (keys['ArrowDown'] || keys['s']) {
          ship.vx *= 0.96;
          ship.vy *= 0.96;
        }
      }

      gameTime += 1 / 60;
      level = Math.floor(gameTime / 25) + 1;

      if (gameTime > 8 && Math.random() < 0.004 + level * 0.001) spawnPowerup();

      if (gameTime > 15 && level >= 2 && Math.random() < 0.003 + level * 0.001) {
        if (enemies.filter(e => e.type === 'splitter').length < 1 + Math.floor(level / 3))
          enemies.push({
            type: 'splitter', x: Math.random() * 800, y: Math.random() * 800,
            vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2, size: 22 + Math.random() * 8,
            color: '#ff8c00', hp: 2
          });
      }
      if (level >= 3 && Math.random() < 0.002 + level * 0.0005) {
        const maxShooters = Math.min(level - 2, 4);
        if (enemies.filter(e => e.type === 'shooter').length < maxShooters)
          enemies.push({
            type: 'shooter', x: Math.random() * 800, y: Math.random() * 800,
            vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, size: 16,
            angle: 0, shootCooldown: 30 + Math.floor(Math.random() * 20), color: '#e94560'
          });
      }

      const spawnRate = 0.008 + gameTime / 2000;
      if (Math.random() < spawnRate) {
        asteroids.push(spawnAsteroid(12 + Math.random() * 18 + level * 2, null));
      }

      if (ship.active) {
        ship.x += ship.vx;
        ship.y += ship.vy;
        if (ship.x < 0) ship.x = 800;
        if (ship.x > 800) ship.x = 0;
        if (ship.y < 0) ship.y = 800;
        if (ship.y > 800) ship.y = 0;
        ship.vx *= 0.985;
        ship.vy *= 0.985;
      }

      shootCooldown--;
      const fireRate = rapidFire ? 4 : 10;
      if ((keys[' '] || mobileShoot) && ship.active && shootCooldown <= 0) {
        bullets.push({
          x: ship.x + 16 * Math.cos(ship.angle),
          y: ship.y + 16 * Math.sin(ship.angle),
          vx: ship.vx + 7 * Math.cos(ship.angle),
          vy: ship.vy + 7 * Math.sin(ship.angle),
          life: 40
        });
        shootCooldown = fireRate;
      }

      bullets = bullets.filter(b => {
        b.x += b.vx; b.y += b.vy; b.life--;
        return b.life > 0 && b.x >= -10 && b.x <= 810 && b.y >= -10 && b.y <= 810;
      });

      enemies.forEach(e => {
        e.x += e.vx; e.y += e.vy;
        if (e.x < 0) e.x = 800;
        if (e.x > 800) e.x = 0;
        if (e.y < 0) e.y = 800;
        if (e.y > 800) e.y = 0;
        if (e.type === 'shooter' && ship.active) {
          e.angle = Math.atan2(ship.y - e.y, ship.x - e.x);
          e.shootCooldown--;
          if (e.shootCooldown <= 0) {
            bullets.push({
              x: e.x + e.size * Math.cos(e.angle),
              y: e.y + e.size * Math.sin(e.angle),
              vx: 2.5 * Math.cos(e.angle),
              vy: 2.5 * Math.sin(e.angle),
              enemyBullet: true, life: 50
            });
            e.shootCooldown = 40 + Math.floor(Math.random() * 20);
          }
        }
      });

      asteroids.forEach(a => {
        a.x += a.vx; a.y += a.vy; a.rot += a.rotSpeed;
        if (a.x < -50) a.x = 850;
        if (a.x > 850) a.x = -50;
        if (a.y < -50) a.y = 850;
        if (a.y > 850) a.y = -50;
      });

      powerups.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.05;
        if (p.x < 0 || p.x > 800) p.vx *= -1;
        if (p.y < 0 || p.y > 800) p.vy *= -1;
      });

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        if (b.enemyBullet) continue;
        for (let j = asteroids.length - 1; j >= 0; j--) {
          const a = asteroids[j];
          if (Math.hypot(b.x - a.x, b.y - a.y) < a.size) {
            createExplosion(a.x, a.y, '#aaa', 15);
            bullets.splice(i, 1);
            asteroids.splice(j, 1);
            score += Math.floor(10 * (1 + level * 0.2));
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
            createExplosion(e.x, e.y, e.type === 'shooter' ? '#e94560' : '#ff8c00', 25);
            bullets.splice(i, 1);
            e.hp = (e.hp || 1) - 1;
            if (e.hp <= 0) {
              if (e.type === 'splitter') {
                score += 30;
                if (e.size > 10) {
                  for (let k = 0; k < 2; k++) {
                    enemies.push({
                      type: 'splitter', x: e.x, y: e.y,
                      vx: e.vx + (Math.random() - 0.5) * 2,
                      vy: e.vy + (Math.random() - 0.5) * 2,
                      size: e.size * 0.6, color: '#ffaa44', hp: 1
                    });
    }
  }

  async function showProfileModal(user) {
    const userData = await getUserData(user.username);
    const body = $('profileModalBody');
    const trivia = userData?.progress?.trivia || [];
    const game = userData?.progress?.game || [];
    const bestTrivia = trivia.length ? Math.max(...trivia.map(t => t.puntaje)) : 0;
    const totalTrivia = trivia.length;
    const bestGame = game.length ? Math.max(...game.map(g => g.puntaje)) : 0;
    const totalGame = game.length;
    body.innerHTML = `
      <div style="text-align:center;margin:1rem 0;">
        <div style="font-size:2rem;">👤</div>
        <strong style="font-size:1.1rem;">${userData?.username || user.username}</strong>
        <br><span style="font-size:0.8rem;color:var(--text-secondary);">${userData?.email || ''}</span>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:1rem;">
        <h4 style="margin:0 0 0.5rem;">📊 Mis Puntajes</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
          <div style="background:var(--bg-card);padding:0.8rem;border-radius:var(--radius);text-align:center;">
            <div style="font-size:0.75rem;color:var(--text-secondary);">🏆 Trivia</div>
            <div style="font-size:1.3rem;font-weight:700;">${bestTrivia} pts</div>
            <div style="font-size:0.7rem;color:var(--text-secondary);">${totalTrivia} partidas</div>
          </div>
          <div style="background:var(--bg-card);padding:0.8rem;border-radius:var(--radius);text-align:center;">
            <div style="font-size:0.75rem;color:var(--text-secondary);">🚀 Juego</div>
            <div style="font-size:1.3rem;font-weight:700;">${bestGame} pts</div>
            <div style="font-size:0.7rem;color:var(--text-secondary);">${totalGame} partidas</div>
          </div>
        </div>
      </div>
      <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);">
        <details>
          <summary style="cursor:pointer;font-size:0.85rem;color:var(--accent);">📜 Historial completo</summary>
          <div style="margin-top:0.5rem;max-height:150px;overflow-y:auto;">
            ${trivia.length ? trivia.map(t => `<div style="font-size:0.8rem;padding:0.2rem 0;">🏆 Trivia: ${t.puntaje} pts (${new Date(t.fecha).toLocaleDateString('es-VE')})</div>`).join('') : ''}
            ${game.length ? game.map(g => `<div style="font-size:0.8rem;padding:0.2rem 0;">🚀 Juego: ${g.puntaje} pts (${new Date(g.fecha).toLocaleDateString('es-VE')})</div>`).join('') : ''}
            ${!trivia.length && !game.length ? '<div style="font-size:0.8rem;color:var(--text-secondary);">Aún no has jugado</div>' : ''}
          </div>
        </details>
      </div>`;
    $('profileModal').classList.add('open');
  }
              } else {
                score += 40;
              }
              enemies.splice(j, 1);
            }
            break;
          }
        }
      }

      if (ship.active) {
        for (let a of asteroids) {
          if (Math.hypot(ship.x - a.x, ship.y - a.y) < a.size + 8) { hitShip(); break; }
        }
        for (let e of enemies) {
          if (Math.hypot(ship.x - e.x, ship.y - e.y) < e.size + 8) { hitShip(); break; }
        }
        for (let b of bullets) {
          if (b.enemyBullet && Math.hypot(ship.x - b.x, ship.y - b.y) < 10) { hitShip(); break; }
        }
        for (let i = powerups.length - 1; i >= 0; i--) {
          const p = powerups[i];
          if (Math.hypot(ship.x - p.x, ship.y - p.y) < p.size + 15) {
            if (p.type === 'shield') { hasShield = true; setTimeout(() => hasShield = false, 5000); showToast('🛡 Escudo activado!', 'success'); }
            else if (p.type === 'rapidfire') { rapidFire = true; rapidFireTimer = 200; showToast('⚡ Disparo rápido!', 'info'); }
            else if (p.type === 'life') { lives = Math.min(lives + 1, 5); showToast('❤️ Vida extra!', 'success'); }
            powerups.splice(i, 1);
          }
        }
      }

      if (rapidFire) {
        rapidFireTimer--;
        if (rapidFireTimer <= 0) rapidFire = false;
      }

      if (hitFlash > 0) hitFlash--;

      particles = particles.filter(p => {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.97; p.vy *= 0.97;
        p.life -= p.decay;
        p.size *= 0.99;
        return p.life > 0;
      });
    }

    function hitShip() {
      if (hasShield || !ship.active) return;
      lives--;
      hitFlash = 15;
      if (lives <= 0) {
        ship.active = false;
        running = false;
        stopGame();
      } else {
        createExplosion(ship.x, ship.y, '#ff4444', 15);
        ship.x = 400; ship.y = 400;
        ship.vx = 0; ship.vy = 0;
        hasShield = true;
        setTimeout(() => hasShield = false, 2000);
      }
    }

    function stopGame() {
      $('startGameBtn').style.display = 'inline-block';
      $('restartGameBtn').style.display = 'inline-block';
      $('pauseGameBtn').style.display = 'none';
      finalScore = score;
      const highScore = parseInt(localStorage.getItem('astronomia_game_hs')) || 0;
      if (score > highScore) {
        localStorage.setItem('astronomia_game_hs', score);
        $('gameOverOverlay').querySelector('h2').textContent = '🎉 ¡NUEVO RÉCORD!';
        $('gameOverOverlay').style.display = 'flex';
        $('finalScoreDisplay').textContent = score;
        $('gameNameInput').style.display = 'block';
        $('gamePlayerName').value = '';
        $('gamePlayerName').focus();
      } else {
        $('gameOverOverlay').querySelector('h2').textContent = '💥 GAME OVER';
        $('goScore').textContent = score;
        $('gameOverOverlay').style.display = 'flex';
        APP.state.gameRanking.push({ nombre: 'Anónimo', puntaje: score, fecha: new Date().toLocaleDateString() });
        APP.state.gameRanking.sort((a, b) => b.puntaje - a.puntaje);
        APP.state.gameRanking = APP.state.gameRanking.slice(0, 10);
        saveState();
        renderGameRanking();
        const cur = getCurrentUser();
        if (cur && !cur.isAdmin) saveUserProgress(cur.username, 'game', score);
      }
    }

    function submitGameScore() {
      const name = $('gamePlayerName').value.trim() || 'Anónimo';
      APP.state.gameRanking.push({ nombre: name, puntaje: finalScore, fecha: new Date().toLocaleDateString() });
      APP.state.gameRanking.sort((a, b) => b.puntaje - a.puntaje);
      APP.state.gameRanking = APP.state.gameRanking.slice(0, 10);
      saveState();
      renderGameRanking();
      $('gameNameInput').style.display = 'none';
      $('gameOverOverlay').querySelector('h2').textContent = '💥 GAME OVER';
      showToast(`🏆 ${name} guardado en el ranking!`, 'success');
      const cur = getCurrentUser();
      if (cur && !cur.isAdmin) saveUserProgress(cur.username, 'game', finalScore);
    }

    function drawAsteroid(a) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rot);
      ctx.strokeStyle = a.color;
      ctx.lineWidth = 2;
      ctx.fillStyle = a.color + '44';
      ctx.beginPath();
      ctx.moveTo(a.shape[0].x, a.shape[0].y);
      for (let i = 1; i < a.shape.length; i++) {
        ctx.lineTo(a.shape[i].x, a.shape[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    function draw() {
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, 800, 800);

      bgStars.forEach(s => {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * (0.5 + 0.5 * Math.sin(s.s * gameTime * 10))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fill();
      });

      asteroids.forEach(drawAsteroid);

      enemies.forEach(e => {
        ctx.save();
        ctx.translate(e.x, e.y);
        if (e.type === 'shooter') {
          ctx.rotate(e.angle);
          ctx.fillStyle = '#e94560';
          ctx.shadowColor = '#e94560';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(e.size, 0);
          ctx.lineTo(-e.size * 0.7, -e.size * 0.7);
          ctx.lineTo(-e.size * 0.7, e.size * 0.7);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ff6b81';
          ctx.beginPath();
          ctx.arc(e.size * 0.3, 0, e.size * 0.3, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillStyle = e.color || '#ff8c00';
          ctx.shadowColor = e.color || '#ff8c00';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, e.size, 0, 2 * Math.PI);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(-e.size * 0.2, -e.size * 0.2, e.size * 0.4, 0, 2 * Math.PI);
          ctx.stroke();
        }
        ctx.restore();
      });

      bullets.forEach(b => {
        ctx.fillStyle = b.enemyBullet ? '#ff4444' : '#ffff44';
        ctx.shadowColor = b.enemyBullet ? '#ff4444' : '#ffff44';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.enemyBullet ? 4 : 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      powerups.forEach(p => {
        const colors = { shield: '#00aaff', rapidfire: '#ffaa00', life: '#44ff44' };
        const col = colors[p.type] || '#fff';
        const s = p.size + 2 * Math.sin(p.pulse);
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icons = { shield: '🛡', rapidfire: '⚡', life: '❤' };
        ctx.fillText(icons[p.type] || '?', p.x, p.y);
      });

      particles.forEach(p => {
        ctx.globalAlpha = Math.min(p.life * 2, 1);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.size * p.life, 0.3), 0, 2 * Math.PI);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (ship.active) {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = hitFlash > 0 ? 20 : 5;
        ctx.strokeStyle = hitFlash > 0 ? '#ff4444' : '#fff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(-12, -12);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-12, 12);
        ctx.closePath();
        ctx.stroke();
        ctx.shadowBlur = 5;
        ctx.fillStyle = 'rgba(100,180,255,0.15)';
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-6, -6);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        if (hasShield) {
          ctx.strokeStyle = 'rgba(0, 170, 255, ' + (0.2 + 0.3 * Math.sin(Date.now() * 0.01)) + ')';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00aaff';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(ship.x, ship.y, 24, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        if (rapidFire) {
          ctx.fillStyle = 'rgba(255, 170, 0, 0.1)';
          ctx.beginPath();
          ctx.arc(ship.x, ship.y, 32, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`🏆 ${localStorage.getItem('astronomia_game_hs') || 0}`, 12, 25);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '12px monospace';
      ctx.fillText(`NIVEL ${level}`, 788, 25);
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '11px monospace';
      ctx.fillText(`💥 ${asteroids.length}  👾 ${enemies.length}`, 12, 45);

      if (paused && running) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, 800, 800);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⏸ PAUSA', 400, 400);
        ctx.font = '16px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('Presiona P para continuar', 400, 440);
      }

      if (!ship.active && !$('gameOverOverlay').style.display !== 'none') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, 800, 800);
      }
    }

    function frame() {
      update();
      draw();
      loopId = requestAnimationFrame(frame);
    }

    function togglePause() {
      if (!running) return;
      paused = !paused;
      $('pauseGameBtn').textContent = paused ? '▶️ Reanudar' : '⏸️ Pausa';
    }

    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      keys[e.key] = true;
      if (e.key === 'p' || e.key === 'P') togglePause();
      if (e.key === 'Escape' && $('gameNameInput').style.display === 'block') {
        submitGameScore();
      }
      if (e.key === 'Enter' && $('gameNameInput').style.display === 'block') {
        submitGameScore();
      }
    });
    window.addEventListener('keyup', e => { keys[e.key] = false; });

    $('mobileLeftBtn').addEventListener('mousedown', e => { e.preventDefault(); keys['ArrowLeft'] = true; });
    $('mobileLeftBtn').addEventListener('mouseup', () => keys['ArrowLeft'] = false);
    $('mobileLeftBtn').addEventListener('mouseleave', () => keys['ArrowLeft'] = false);
    $('mobileLeftBtn').addEventListener('touchstart', e => { e.preventDefault(); keys['ArrowLeft'] = true; });
    $('mobileLeftBtn').addEventListener('touchend', () => keys['ArrowLeft'] = false);
    $('mobileRightBtn').addEventListener('mousedown', e => { e.preventDefault(); keys['ArrowRight'] = true; });
    $('mobileRightBtn').addEventListener('mouseup', () => keys['ArrowRight'] = false);
    $('mobileRightBtn').addEventListener('mouseleave', () => keys['ArrowRight'] = false);
    $('mobileRightBtn').addEventListener('touchstart', e => { e.preventDefault(); keys['ArrowRight'] = true; });
    $('mobileRightBtn').addEventListener('touchend', () => keys['ArrowRight'] = false);
    $('mobileUpBtn').addEventListener('mousedown', e => { e.preventDefault(); keys['ArrowUp'] = true; });
    $('mobileUpBtn').addEventListener('mouseup', () => keys['ArrowUp'] = false);
    $('mobileUpBtn').addEventListener('mouseleave', () => keys['ArrowUp'] = false);
    $('mobileUpBtn').addEventListener('touchstart', e => { e.preventDefault(); keys['ArrowUp'] = true; });
    $('mobileUpBtn').addEventListener('touchend', () => keys['ArrowUp'] = false);

    let mobileShoot = false;
    $('mobileShootBtn').addEventListener('mousedown', e => { e.preventDefault(); mobileShoot = true; });
    $('mobileShootBtn').addEventListener('mouseup', () => mobileShoot = false);
    $('mobileShootBtn').addEventListener('mouseleave', () => mobileShoot = false);
    $('mobileShootBtn').addEventListener('touchstart', e => { e.preventDefault(); mobileShoot = true; });
    $('mobileShootBtn').addEventListener('touchend', () => mobileShoot = false);

    $('startGameBtn').addEventListener('click', reset);
    $('restartGameBtn').addEventListener('click', reset);
    $('pauseGameBtn').addEventListener('click', togglePause);
    $('submitGameScoreBtn').addEventListener('click', submitGameScore);
    $('gamePlayerName').addEventListener('keydown', e => { if (e.key === 'Enter') submitGameScore(); });
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

  // ==================== AULA VIRTUAL ====================
  function initAulaVirtual() {
    const backToCoursesBtn = $('backToCoursesBtn');
    const coursesContainer = $('coursesContainer');
    const courseDetailView = $('courseDetailView');
    const courseDetailContent = $('courseDetailContent');
    const courseGeniallyContainer = $('courseGeniallyContainer');
    const courseForosContainer = $('courseForosContainer');
    const courseForosTabs = $('courseForosTabs');
    const courseForosContent = $('courseForosContent');
    const courseTutorContainer = $('courseTutorContainer');
    const studentDashboard = $('studentDashboard');
    const studentLoginCard = $('studentLoginCard');
    const studentProgress = $('studentProgress');

    let currentStudent = null;
    let completedLessons = {};
    let currentCourseId = null;
    let currentForoType = 'anuncios';

    function loadStudent() {
      try {
        const user = getCurrentUser();
        currentStudent = user ? user.username : null;
        const completed = localStorage.getItem('aulaCompleted');
        if (completed) completedLessons = JSON.parse(completed);
      } catch(e) {}
    }

    function saveStudent() {
      localStorage.setItem('aulaCompleted', JSON.stringify(completedLessons));
    }

    function updateUI() {
      if (currentStudent) {
        studentLoginCard.style.display = 'none';
        studentDashboard.style.display = 'block';
        const totalLessons = DATA.cursosVirtuales.reduce((sum, c) => sum + c.modulos.reduce((s, m) => s + m.lecciones.length, 0), 0);
        const completedCount = Object.keys(completedLessons).length;
        const pct = totalLessons > 0 ? Math.round(completedCount / totalLessons * 100) : 0;
        studentProgress.innerHTML = `👋 Bienvenido, <strong>${currentStudent}</strong>! · Progreso: ${completedCount}/${totalLessons} lecciones (${pct}%)`;
      } else {
        studentLoginCard.style.display = 'block';
        studentDashboard.style.display = 'none';
      }
    }

    function renderCourses() {
      coursesContainer.style.display = 'block';
      courseDetailView.style.display = 'none';

      let html = '<div class="aula-courses-grid">';
      DATA.cursosVirtuales.forEach(curso => {
        const totalLecciones = curso.modulos.reduce((s, m) => s + m.lecciones.length, 0);
        const completedCount = curso.modulos.reduce((s, m) => s + m.lecciones.filter(l => completedLessons[curso.id + '-' + l.titulo]).length, 0);
        html += `<div class="aula-course-card" data-course-id="${curso.id}" style="--course-color:${curso.color};">
          <div class="aula-course-img" style="background-image:url('${curso.img}');">
            <span class="aula-course-badge">${curso.siglas}</span>
          </div>
          <div class="aula-course-body">
            <h4>${curso.titulo}</h4>
            <div class="aula-course-teacher">👨‍🏫 ${curso.profesor}</div>
            <div class="aula-course-desc">${curso.desc}</div>
            <div style="margin-top:0.75rem;font-size:0.8rem;color:var(--text-secondary);">
              ${totalLecciones} lecciones · ${completedCount} completadas
            </div>
          </div>
        </div>`;
      });
      html += '</div>';
      coursesContainer.innerHTML = html;
      updateUI();

      document.querySelectorAll('.aula-course-card').forEach(card => {
        card.addEventListener('click', () => renderCourseDetail(card.dataset.courseId));
      });
    }

    function renderCourseDetail(courseId) {
      const curso = DATA.cursosVirtuales.find(c => c.id === courseId);
      if (!curso) return renderCourses();
      currentCourseId = courseId;
      coursesContainer.style.display = 'none';
      courseDetailView.style.display = 'block';

      // Modules
      let html = `<h2 style="margin-bottom:0.5rem;">${curso.titulo}</h2>
        <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:1.5rem;">👨‍🏫 ${curso.profesor} · ${curso.modulos.reduce((s,m) => s + m.lecciones.length, 0)} lecciones</p>`;

      curso.modulos.forEach(mod => {
        const modCompleted = mod.lecciones.filter(l => completedLessons[curso.id + '-' + l.titulo]).length;
        html += `<div class="modulo-card card" style="margin-bottom:1rem;">
          <h3 style="margin-bottom:0.25rem;">${mod.titulo}</h3>
          <div style="font-size:0.8rem;color:var(--text-secondary);">${modCompleted}/${mod.lecciones.length} completado</div>
          <div class="lecciones-list">`;
        mod.lecciones.forEach(lec => {
          const key = curso.id + '-' + lec.titulo;
          const done = completedLessons[key];
          html += `<div class="leccion-item${done ? ' completed' : ''}" data-course="${curso.id}" data-titulo="${lec.titulo.replace(/"/g, '&quot;')}">
            <span class="leccion-status">${done ? '✅' : '📖'}</span>
            <div class="leccion-info">
              <strong>${lec.titulo}</strong>
              <span style="font-size:0.75rem;color:var(--text-secondary);">${lec.texto.substring(0, 100)}...</span>
            </div>
          </div>`;
        });
        html += '</div></div>';
      });

      courseDetailContent.innerHTML = html;
      updateUI();

      document.querySelectorAll('.leccion-item').forEach(item => {
        item.addEventListener('click', () => {
          playLeccion(item.dataset.course, item.dataset.titulo);
        });
      });

      // Genially
      if (curso.genially) {
        courseGeniallyContainer.style.display = 'block';
        courseGeniallyContainer.innerHTML = `
          <h3>🗺️ Ruta de Aprendizaje</h3>
          <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:0.75rem;">Explora el plan del curso de forma interactiva.</p>
          <div class="genially-container">
            <iframe src="${curso.genially}" allowfullscreen="allowfullscreen" loading="lazy"></iframe>
          </div>
        `;
      } else {
        courseGeniallyContainer.style.display = 'none';
      }

      // Foros
      if (curso.foros) {
        courseForosContainer.style.display = 'block';
        const foroTypes = Object.keys(curso.foros);
        courseForosTabs.innerHTML = foroTypes.map(t => `
          <button class="foro-tab-btn${t === currentForoType ? ' active' : ''}" data-foro-type="${t}">${curso.foros[t].titulo}</button>
        `).join('');
        renderCurrentForo();

        courseForosTabs.querySelectorAll('.foro-tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            currentForoType = btn.dataset.foroType;
            courseForosTabs.querySelectorAll('.foro-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCurrentForo();
          });
        });
      } else {
        courseForosContainer.style.display = 'none';
      }

      // Tutor IA
      courseTutorContainer.style.display = 'block';
      const tutorChatBox = $('tutorChatBox');
      if (tutorChatBox) {
        tutorChatBox.innerHTML = `
          <div class="chat-msg bot">🔭 ¡Hola! Soy tu tutor virtual del curso <strong>${curso.titulo}</strong>. Pregúntame sobre cualquier tema de astronomía.</div>
        `;
      }
    }

    function renderCurrentForo() {
      const curso = DATA.cursosVirtuales.find(c => c.id === currentCourseId);
      if (!curso || !curso.foros || !curso.foros[currentForoType]) return;
      const foroData = curso.foros[currentForoType];
      const foroContentId = 'courseForosContent';
      const container = $(foroContentId);
      if (!container) return;

      const currentStudent = (getCurrentUser() && getCurrentUser().username) || 'Anónimo';
      const posts = getForoPosts(currentCourseId, currentForoType);

      let html = `<div style="margin-bottom:1rem;">
        <h3 style="font-size:1rem;">${foroData.titulo}</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);">${foroData.desc}</p>
      </div>`;

      if (posts.length === 0) {
        html += '<div class="foro-empty">💬 Aún no hay publicaciones. ¡Sé el primero en preguntar!</div>';
      } else {
        html += posts.map((post, idx) => `
          <div class="foro-post">
            <div class="foro-post-header">
              <span class="foro-post-author">${post.autor}</span>
              <span class="foro-post-date">${post.fecha}</span>
            </div>
            <div class="foro-post-text">${post.texto}</div>
            ${post.respuestas.map(r => `
              <div class="foro-post-reply">
                <span class="reply-author">${r.autor}</span>: ${r.texto}
                <span style="float:right;font-size:0.7rem;color:var(--text-secondary);">${r.fecha}</span>
              </div>
            `).join('')}
            <div style="margin-top:0.5rem;">
              <button class="btn btn-xs btn-secondary foro-reply-btn" data-course="${currentCourseId}" data-foro="${currentForoType}" data-idx="${idx}">💬 Responder</button>
            </div>
          </div>
        `).join('');
      }

      html += `
        <div class="foro-new-post-area">
          <strong style="font-size:0.9rem;">Nueva publicación</strong>
          <textarea class="form-input" id="foroNewPostText_${currentCourseId}_${currentForoType}" rows="2" placeholder="Escribe tu mensaje..."></textarea>
          <button class="btn btn-sm btn-primary foro-new-post-btn" data-course="${currentCourseId}" data-foro="${currentForoType}">Publicar</button>
        </div>
      `;

      container.innerHTML = html;
    }

    function playLeccion(courseId, titulo) {
      const curso = DATA.cursosVirtuales.find(c => c.id === courseId);
      if (!curso) return;
      let leccion = null;
      curso.modulos.forEach(m => m.lecciones.forEach(l => { if (l.titulo === titulo) leccion = l; }));
      if (!leccion) return;

      const key = courseId + '-' + titulo;
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay open';
      overlay.innerHTML = `
        <div class="modal-box leccion-modal-box">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <h3 style="margin:0;">${leccion.titulo}</h3>
            <button class="btn btn-sm btn-secondary leccion-close">✕</button>
          </div>
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:var(--radius-sm);margin-bottom:1rem;">
            <iframe src="${leccion.video}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowfullscreen loading="lazy"></iframe>
          </div>
          <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6;">${leccion.texto}</p>
          <div style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn btn-primary mark-completed-btn">${completedLessons[key] ? '✅ Completada' : 'Marcar como completada'}</button>
            <button class="btn btn-secondary leccion-close">Cerrar</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      overlay.querySelector('.mark-completed-btn').addEventListener('click', function() {
        completedLessons[key] = true;
        saveStudent();
        this.textContent = '✅ Completada';
        renderCourseDetail(courseId);
        updateUI();
        addNotification('✅', `Completaste "${leccion.titulo}" en ${curso.titulo}`);
        showToast('✅ Lección marcada como completada', 'success');
      });

      overlay.querySelectorAll('.leccion-close').forEach(btn => {
        btn.addEventListener('click', () => overlay.remove());
      });

      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
      });
    }

    // Foro event delegation
    document.addEventListener('click', function(e) {
      const replyBtn = e.target.closest('.foro-reply-btn');
      if (replyBtn) {
        const course = replyBtn.dataset.course;
        const foro = replyBtn.dataset.foro;
        const idx = parseInt(replyBtn.dataset.idx);
        const autor = getCurrentUser() ? getCurrentUser().username : 'Anónimo';
        const replyText = prompt('Escribe tu respuesta:');
        if (replyText && replyText.trim()) {
          addForoReply(course, foro, idx, autor, replyText.trim());
          if (course === currentCourseId && foro === currentForoType) {
            renderCurrentForo();
          }
        }
        return;
      }

      const postBtn = e.target.closest('.foro-new-post-btn');
      if (postBtn) {
        const course = postBtn.dataset.course;
        const foro = postBtn.dataset.foro;
        const textarea = document.getElementById(`foroNewPostText_${course}_${foro}`);
        const texto = textarea ? textarea.value.trim() : '';
        if (!texto) { showToast('⚠️ Escribe un mensaje', 'warning'); return; }
        const autor = getCurrentUser() ? getCurrentUser().username : 'Anónimo';
        addForoPost(course, foro, autor, texto);
        if (textarea) textarea.value = '';
        if (course === currentCourseId && foro === currentForoType) {
          renderCurrentForo();
        }
        addNotification('💬', `${autor} publicó en el foro de ${DATA.cursosVirtuales.find(c => c.id === course)?.titulo || course}`);
        showToast('✅ Publicación creada', 'success');
        return;
      }
    });

    // Aula virtual auth buttons
    $('aulaLoginBtn').addEventListener('click', () => {
      window._onAuthCallback = (user) => {
        loadStudent();
        updateUI();
        renderCourses();
        showToast(`👋 Bienvenido, ${user.username}!`, 'success');
        window._onAuthCallback = null;
      };
      $('authModal').classList.add('open');
    });

    $('aulaRegisterBtn').addEventListener('click', () => {
      $('authTabRegister').click();
      window._onAuthCallback = (user) => {
        loadStudent();
        updateUI();
        renderCourses();
        showToast(`👋 Bienvenido, ${user.username}!`, 'success');
        window._onAuthCallback = null;
      };
      $('authModal').classList.add('open');
    });

    $('logoutStudentBtn').addEventListener('click', () => {
      currentStudent = null;
      completedLessons = {};
      saveStudent();
      updateUI();
      renderCourses();
      showToast('👋 Sesión cerrada', 'info');
    });

    backToCoursesBtn.addEventListener('click', function() {
      renderCourses();
      courseGeniallyContainer.style.display = 'none';
      courseForosContainer.style.display = 'none';
      courseTutorContainer.style.display = 'none';
    });

    loadStudent();
    renderCourses();
    updateUI();
    initTutorIA();
  }

  // ==================== KEYBOARD SHORTCUTS ====================
  function initKeyboard() {
    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      if (key === 'd') $('themeToggle')?.click();
      if (key === '/') { e.preventDefault(); $('globalSearch')?.focus(); }
      if (key === '?') showToast('⌨️ Atajos: D=modo oscuro, /=buscar, 1-9,0,-=pestañas', 'info');
      if (key >= '1' && key <= '9') {
        const tab = qs(`.tab-btn[data-tab="tab${key}"]`);
        if (tab) tab.click();
      }
      if (key === '0') {
        const tab = qs('.tab-btn[data-tab="tab10"]');
        if (tab) tab.click();
      }
      if (key === '-' || key === '_') {
        const tab = qs('.tab-btn[data-tab="tab11"]');
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
    updateUserBtn();
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
    initAulaVirtual();
    initNotifications();
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

