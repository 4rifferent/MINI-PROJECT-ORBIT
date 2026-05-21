/* ===== DARK MODE ===== */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

/* ===== NAVBAR ===== */
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== TYPING EFFECT ===== */
const typingEl = document.getElementById('typingText');
const phrases = ['Jaga Kebersihan Kelas', 'Disiplin & Transparan', 'Piket Jadi Menyenangkan', 'Raih Poin & Reward!'];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeEffect() {
  const current = phrases[phraseIdx];
  if (!isDeleting) {
    typingEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) { isDeleting = true; setTimeout(typeEffect, 2000); return; }
  } else {
    typingEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(typeEffect, isDeleting ? 40 : 80);
}
typeEffect();

/* ===== TOAST ===== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `${icons[type] || 'ℹ️'} ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ===== JADWAL ===== */
const jadwalPiket = {
  Senin: ['Rizky', 'Alya', 'Fahri'],
  Selasa: ['Nabila', 'Dimas', 'Putri'],
  Rabu: ['Bagas', 'Sinta', 'Raka'],
  Kamis: ['Dion', 'Citra', 'Kevin'],
  Jumat: ['Andi', 'Lala', 'Farhan'],
};

const hari = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
const hariFormatted = hari.charAt(0).toUpperCase() + hari.slice(1);

document.getElementById('namaHari').textContent = hariFormatted;

const daftarPiket = document.getElementById('daftar-piket');
if (jadwalPiket[hariFormatted]) {
  jadwalPiket[hariFormatted].forEach(nama => {
    const li = document.createElement('li');
    li.textContent = nama;
    daftarPiket.appendChild(li);
  });
} else {
  const li = document.createElement('li');
  li.textContent = 'Libur — Tidak ada jadwal piket';
  li.style.justifyContent = 'center';
  li.style.opacity = '0.6';
  daftarPiket.appendChild(li);
}

const weekGrid = document.getElementById('weekGrid');
const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
dayNames.forEach(day => {
  const row = document.createElement('div');
  row.className = `week-row${day === hariFormatted ? ' today' : ''}`;
  row.innerHTML = `<span class="day">${day}</span><span class="names">${(jadwalPiket[day] || []).join(', ') || '—'}</span>`;
  weekGrid.appendChild(row);
});

/* ===== CHECKLIST ===== */
const taskItems = document.querySelectorAll('.task-item');
const selesaiBtn = document.getElementById('selesaiBtn');
const pointSpan = document.getElementById('point');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let points = parseInt(localStorage.getItem('cleanclass_points')) || 0;
pointSpan.textContent = points;

function updateProgress() {
  const total = taskItems.length;
  const completed = document.querySelectorAll('.task-item.completed').length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  if (totalTasksSpan) totalTasksSpan.textContent = total;
  if (completedTasksSpan) completedTasksSpan.textContent = completed;
  if (progressFill) progressFill.style.width = pct + '%';
  if (progressText) progressText.textContent = `${completed}/${total} selesai`;
  if (selesaiBtn) selesaiBtn.disabled = completed === 0;
}

function saveChecklistState() {
  const states = [];
  taskItems.forEach(item => states.push(item.classList.contains('completed')));
  localStorage.setItem('cleanclass_checklist', JSON.stringify(states));
}

function loadChecklistState() {
  const saved = localStorage.getItem('cleanclass_checklist');
  if (saved) {
    const states = JSON.parse(saved);
    taskItems.forEach((item, i) => {
      if (states[i]) {
        item.classList.add('completed');
        item.querySelector('input[type="checkbox"]').checked = true;
      }
    });
  }
  updateProgress();
}

taskItems.forEach(item => {
  const checkbox = item.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    item.classList.toggle('completed', checkbox.checked);
    saveChecklistState();
    updateProgress();
  });
  item.addEventListener('click', (e) => {
    if (e.target.tagName !== 'INPUT') {
      checkbox.checked = !checkbox.checked;
      item.classList.toggle('completed', checkbox.checked);
      saveChecklistState();
      updateProgress();
    }
  });
});

loadChecklistState();

selesaiBtn.addEventListener('click', () => {
  const completed = document.querySelectorAll('.task-item.completed').length;
  if (completed === 0) return;
  const earned = completed * 10;
  points += earned;
  localStorage.setItem('cleanclass_points', points);
  pointSpan.textContent = points;
  document.getElementById('exchangePoints').textContent = points;
  showToast(`Tugas selesai! +${earned} Point 🎉`, 'success');
  taskItems.forEach(item => {
    item.classList.remove('completed');
    item.querySelector('input[type="checkbox"]').checked = false;
  });
  saveChecklistState();
  updateProgress();
});

/* ===== LEADERBOARD ===== */
const lbBody = document.getElementById('leaderboardBody');
const lbName = document.getElementById('lbName');
const lbPoints = document.getElementById('lbPoints');
const lbAddBtn = document.getElementById('lbAddBtn');
const lbResetBtn = document.getElementById('lbResetBtn');
let leaderboard = JSON.parse(localStorage.getItem('cleanclass_leaderboard') || '[]');

function renderLeaderboard() {
  if (!lbBody) return;
  leaderboard.sort((a, b) => b.points - a.points);
  if (leaderboard.length === 0) {
    lbBody.innerHTML = `<tr><td colspan="3"><div class="leaderboard-empty">Belum ada data. Tambahkan siswa!</div></td></tr>`;
    return;
  }
  lbBody.innerHTML = leaderboard.map((entry, i) => {
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : '';
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
    return `<tr>
      <td><span class="rank-badge ${rankClass}"><span class="rank-medal">${medal}</span></span></td>
      <td>${entry.name}</td>
      <td>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px">
          <span>${entry.points}</span>
          <div class="actions">
            <button class="del-btn" data-name="${entry.name}" title="Hapus">🗑️</button>
          </div>
        </div>
      </td>
    </tr>`;
  }).join('');

  document.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const idx = leaderboard.findIndex(e => e.name === name);
      if (idx > -1) {
        leaderboard.splice(idx, 1);
        saveLeaderboard();
        showToast(`${name} dihapus dari leaderboard`, 'info');
      }
    });
  });
}

function saveLeaderboard() {
  localStorage.setItem('cleanclass_leaderboard', JSON.stringify(leaderboard));
  renderLeaderboard();
}

lbAddBtn.addEventListener('click', () => {
  const name = lbName.value.trim();
  const pts = parseInt(lbPoints.value);
  if (!name) { showToast('Masukkan nama siswa!', 'error'); return; }
  if (isNaN(pts) || pts < 0) { showToast('Masukkan poin valid!', 'error'); return; }
  const existing = leaderboard.findIndex(e => e.name.toLowerCase() === name.toLowerCase());
  if (existing > -1) {
    leaderboard[existing].points = pts;
    showToast(`${name} diperbarui → ${pts} pts`, 'success');
  } else {
    leaderboard.push({ name, points: pts });
    showToast(`${name} ditambahkan!`, 'success');
  }
  saveLeaderboard();
  lbName.value = '';
  lbPoints.value = '';
});

lbResetBtn.addEventListener('click', () => {
  if (confirm('Reset semua data leaderboard?')) {
    leaderboard = [];
    saveLeaderboard();
    showToast('Leaderboard direset', 'warning');
  }
});

renderLeaderboard();

/* ===== REPORT ===== */
const reportForm = document.getElementById('reportForm');

reportForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('reportName').value.trim();
  const area = document.getElementById('reportArea').value;
  const desc = document.getElementById('reportDesc').value.trim();
  if (!name || !area || !desc) {
    showToast('Harap isi semua kolom wajib!', 'error');
    return;
  }
  const reports = JSON.parse(localStorage.getItem('cleanclass_reports') || '[]');
  const statuses = ['pending', 'progress', 'done'];
  reports.unshift({
    name, area, desc,
    date: new Date().toLocaleString('id-ID'),
    status: statuses[Math.floor(Math.random() * 3)],
  });
  if (reports.length > 20) reports.length = 20;
  localStorage.setItem('cleanclass_reports', JSON.stringify(reports));
  showToast('Laporan berhasil dikirim! ✅', 'success');
  reportForm.reset();
  renderReports();
  const totalReports = document.getElementById('totalReports');
  if (totalReports) totalReports.textContent = reports.length;
});

function renderReports() {
  const container = document.getElementById('reportHistory');
  const reports = JSON.parse(localStorage.getItem('cleanclass_reports') || '[]');
  const statusLabel = { pending: 'Pending', progress: 'Diproses', done: 'Selesai' };
  if (reports.length === 0) {
    container.innerHTML = '<div class="report-empty">Belum ada laporan. Kirim laporan pertama kamu!</div>';
    return;
  }
  container.innerHTML = reports.map(r => `
    <div class="report-item">
      <div class="r-header">
        <span class="r-name">${r.name}</span>
        <span class="status-badge ${r.status}">${statusLabel[r.status] || r.status}</span>
      </div>
      <div class="r-area">📍 ${r.area}</div>
      <div class="r-desc">${r.desc}</div>
      <div class="r-footer">
        <span class="r-date">${r.date}</span>
      </div>
    </div>
  `).join('');
}

renderReports();

const totalReportsInit = document.getElementById('totalReports');
if (totalReportsInit) {
  const reports = JSON.parse(localStorage.getItem('cleanclass_reports') || '[]');
  totalReportsInit.textContent = reports.length;
}

/* ===== EXCHANGE POINT ===== */
const rewards = [
  { id: 1, name: 'Bebas Piket 1 Hari', desc: 'Bebas dari tugas piket sehari penuh', icon: '🎫', cost: 80 },
  { id: 2, name: 'Voucher Pulsa 5K', desc: 'Voucher pulsa senilai Rp5.000', icon: '📱', cost: 120 },
  { id: 3, name: 'Snack Pack', desc: 'Paket snack enak untuk istirahat', icon: '🍿', cost: 150 },
  { id: 4, name: 'Peringatan Khusus', desc: 'Namamu disebut di pengumuman kelas', icon: '📢', cost: 60 },
  { id: 5, name: 'Tugas PR Gratis', desc: 'Bebas dari PR satu kali', icon: '📝', cost: 200 },
  { id: 6, name: 'Voucher Kuota 1GB', desc: 'Kuota internet 1GB gratis', icon: '🌐', cost: 250 },
];

function renderRewards() {
  const container = document.getElementById('rewardsGrid');
  if (!container) return;
  container.innerHTML = rewards.map(r => {
    const affordable = points >= r.cost;
    return `
      <div class="reward-card fade-in-up">
        <div class="reward-icon">${r.icon}</div>
        <div class="reward-name">${r.name}</div>
        <div class="reward-desc">${r.desc}</div>
        <div class="reward-cost"><span class="star">⭐</span> ${r.cost}</div>
        <button class="btn-redeem ${affordable ? 'available' : 'unavailable'}" data-id="${r.id}" ${!affordable ? 'disabled' : ''}>
          ${affordable ? 'Tukar Poin' : 'Kurang ⭐ ' + (r.cost - points)}
        </button>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.btn-redeem.available').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const reward = rewards.find(r => r.id === id);
      if (!reward || points < reward.cost) return;
      points -= reward.cost;
      localStorage.setItem('cleanclass_points', points);
      pointSpan.textContent = points;
      document.getElementById('exchangePoints').textContent = points;

      const history = JSON.parse(localStorage.getItem('cleanclass_redeem_history') || '[]');
      history.unshift({
        reward: reward.name,
        cost: reward.cost,
        date: new Date().toLocaleString('id-ID'),
      });
      if (history.length > 20) history.length = 20;
      localStorage.setItem('cleanclass_redeem_history', JSON.stringify(history));

      renderRewards();
      renderRedeemHistory();
      showToast(`Berhasil menukar ${reward.name}! 🎉`, 'success');
    });
  });
}

function renderRedeemHistory() {
  const container = document.getElementById('redeemHistory');
  const history = JSON.parse(localStorage.getItem('cleanclass_redeem_history') || '[]');
  if (!container) return;
  if (history.length === 0) {
    container.innerHTML = '<div class="history-empty">Belum ada penukaran. Kumpulkan poin dan tukarkan!</div>';
    return;
  }
  container.innerHTML = '<div class="history-list">' + history.map(h => `
    <div class="history-item">
      <div><span class="h-name">${h.reward}</span></div>
      <div><span class="h-cost">-${h.cost} ⭐</span></div>
      <div class="h-date">${h.date}</div>
    </div>
  `).join('') + '</div>';
}

if (document.getElementById('exchangePoints')) {
  document.getElementById('exchangePoints').textContent = points;
  renderRewards();
  renderRedeemHistory();
}

/* ===== SCROLL ANIMATIONS ===== */
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up').forEach(el => {
  observer.observe(el);
});

/* ===== COUNTER ANIMATION ===== */
function animateCounter(element, target, duration = 1500) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(target * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      if (target && !el.dataset.animated) {
        el.dataset.animated = 'true';
        animateCounter(el, target);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statsObserver.observe(el));
