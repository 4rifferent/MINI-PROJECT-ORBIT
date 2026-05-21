/* ===== DARK MODE ===== */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

/* ===== NAVBAR ===== */
const header = document.querySelector('header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    const t = document.querySelector(this.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== TOAST ===== */
function showToast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  t.innerHTML = `${icons[type] || 'ℹ️'} ${msg}`;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 300); }, 3000);
}

/* ===== PROFILE ===== */
const studentName = localStorage.getItem('siswa_nama') || 'Alya';
const studentClass = 'XII IPA 1';
document.getElementById('siswaNama').textContent = studentName;
document.getElementById('siswaNama2').textContent = studentName;
document.getElementById('siswaKelas').textContent = studentClass;
document.querySelector('.avatar').textContent = studentName.charAt(0);

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

const daftarPiket = document.getElementById('daftarPiket');
if (jadwalPiket[hariFormatted]) {
  jadwalPiket[hariFormatted].forEach(n => {
    const li = document.createElement('li');
    li.textContent = n;
    daftarPiket.appendChild(li);
  });
} else {
  const li = document.createElement('li');
  li.textContent = 'Libur — Tidak ada jadwal';
  li.style.justifyContent = 'center'; li.style.opacity = '0.6';
  daftarPiket.appendChild(li);
}

const weekGrid = document.getElementById('weekGrid');
['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].forEach(day => {
  const row = document.createElement('div');
  row.style.cssText = `display:flex;justify-content:space-between;padding:6px 10px;border-radius:6px;font-size:13px;${day === hariFormatted ? 'background:rgba(37,99,235,0.1);font-weight:700;' : ''}`;
  row.innerHTML = `<span style="color:var(--text-light);font-weight:600">${day}</span><span>${(jadwalPiket[day] || []).join(', ') || '—'}</span>`;
  weekGrid.appendChild(row);
});

/* ===== TASKS ===== */
const tasks = [
  { id: 't1', label: 'Menyapu Kelas', cat: 'Kebersihan' },
  { id: 't2', label: 'Mengelap Meja & Kursi', cat: 'Kebersihan' },
  { id: 't3', label: 'Membuang Sampah', cat: 'Kebersihan' },
  { id: 't4', label: 'Merapikan Buku', cat: 'Kerapihan' },
  { id: 't5', label: 'Menata Meja', cat: 'Kerapihan' },
  { id: 't6', label: 'Menyiram Tanaman', cat: 'Perawatan' },
  { id: 't7', label: 'Membersihkan Jendela', cat: 'Perawatan' },
  { id: 't8', label: 'Menyemprot Ruangan', cat: 'Perawatan' },
];

const taskList = document.getElementById('taskList');
tasks.forEach(t => {
  const div = document.createElement('div');
  div.className = 'task-item';
  div.innerHTML = `<input type="checkbox" id="${t.id}"><label for="${t.id}">${t.label}</label>`;
  taskList.appendChild(div);
});

let points = parseInt(localStorage.getItem('cleanclass_points')) || 0;
document.getElementById('pointsDisplay').textContent = points;
document.getElementById('pointsDisplay2').textContent = points;
document.getElementById('exchangePoints').textContent = points;

const taskItems = document.querySelectorAll('.task-item');
const selesaiBtn = document.getElementById('selesaiBtn');

function updateProgress() {
  const total = taskItems.length;
  const done = document.querySelectorAll('.task-item.completed').length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('progressText').textContent = `${done}/${total}`;
  document.getElementById('progressFill').style.width = pct + '%';
  selesaiBtn.disabled = done === 0;
}

function saveTasks() {
  const s = [];
  taskItems.forEach(item => s.push(item.classList.contains('completed')));
  localStorage.setItem('siswa_checklist', JSON.stringify(s));
}

function loadTasks() {
  const saved = localStorage.getItem('siswa_checklist');
  if (saved) {
    const s = JSON.parse(saved);
    taskItems.forEach((item, i) => {
      if (s[i]) { item.classList.add('completed'); item.querySelector('input').checked = true; }
    });
  }
  updateProgress();
}

taskItems.forEach(item => {
  const cb = item.querySelector('input');
  cb.addEventListener('change', () => {
    item.classList.toggle('completed', cb.checked);
    saveTasks(); updateProgress();
  });
  item.addEventListener('click', (e) => {
    if (e.target.tagName !== 'INPUT') { cb.checked = !cb.checked; item.classList.toggle('completed', cb.checked); saveTasks(); updateProgress(); }
  });
});
loadTasks();

selesaiBtn.addEventListener('click', () => {
  const done = document.querySelectorAll('.task-item.completed').length;
  if (!done) return;
  points += done * 10;
  localStorage.setItem('cleanclass_points', points);
  document.getElementById('pointsDisplay').textContent = points;
  document.getElementById('pointsDisplay2').textContent = points;
  document.getElementById('exchangePoints').textContent = points;
  showToast(`Selesai! +${done * 10} poin 🎉`, 'success');
  taskItems.forEach(item => { item.classList.remove('completed'); item.querySelector('input').checked = false; });
  saveTasks(); updateProgress();
});

/* ===== LEADERBOARD ===== */
let leaderboard = JSON.parse(localStorage.getItem('cleanclass_leaderboard') || '[]');
const lbBody = document.getElementById('leaderboardBody');
const lbName = document.getElementById('lbName');
const lbPoints = document.getElementById('lbPoints');
const lbBtn = document.getElementById('lbBtn');

function renderLB() {
  leaderboard.sort((a, b) => b.points - a.points);
  if (!leaderboard.length) { lbBody.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-light);font-size:13px">Belum ada data</div>'; return; }
  lbBody.innerHTML = leaderboard.map((e, i) =>
    `<div class="lb-row">
      <div class="rank ${i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : ''}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</div>
      <span class="name">${e.name}</span>
      <span class="pts">${e.points}</span>
    </div>`
  ).join('');
}

lbBtn.addEventListener('click', () => {
  const n = lbName.value.trim();
  const p = parseInt(lbPoints.value);
  if (!n) { showToast('Masukkan nama!', 'error'); return; }
  if (isNaN(p) || p < 0) { showToast('Masukkan poin!', 'error'); return; }
  const ex = leaderboard.findIndex(e => e.name.toLowerCase() === n.toLowerCase());
  if (ex > -1) { leaderboard[ex].points = p; showToast(`${n} diperbarui!`, 'success'); }
  else { leaderboard.push({ name: n, points: p }); showToast(`${n} ditambahkan!`, 'success'); }
  localStorage.setItem('cleanclass_leaderboard', JSON.stringify(leaderboard));
  renderLB(); lbName.value = ''; lbPoints.value = '';
});
renderLB();

/* ===== REPORT ===== */
document.getElementById('reportForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('rName').value.trim();
  const area = document.getElementById('rArea').value;
  const desc = document.getElementById('rDesc').value.trim();
  if (!name || !area || !desc) { showToast('Isi semua kolom!', 'error'); return; }
  const reports = JSON.parse(localStorage.getItem('siswa_reports') || '[]');
  reports.unshift({ name, area, desc, date: new Date().toLocaleString('id-ID'), status: 'pending' });
  if (reports.length > 20) reports.length = 20;
  localStorage.setItem('siswa_reports', JSON.stringify(reports));
  showToast('Laporan terkirim ✅', 'success');
  e.target.reset();
  renderReports();
});

function renderReports() {
  const c = document.getElementById('reportHistory');
  const r = JSON.parse(localStorage.getItem('siswa_reports') || '[]');
  if (!r.length) { c.innerHTML = '<div class="history-empty">Belum ada laporan</div>'; return; }
  c.innerHTML = r.map(x =>
    `<div class="history-item">
      <div><span class="h-name">${x.area}</span><br><span style="font-size:12px;color:var(--text-light)">${x.desc.substring(0, 40)}${x.desc.length > 40 ? '...' : ''}</span></div>
      <div><span class="h-cost">${x.status}</span><br><span class="h-date">${x.date}</span></div>
    </div>`
  ).join('');
}
renderReports();

/* ===== EXCHANGE ===== */
const rewards = [
  { id: 1, name: 'Bebas Piket 1 Hari', desc: 'Bebas tugas piket sehari', icon: '🎫', cost: 80 },
  { id: 2, name: 'Voucher Pulsa 5K', desc: 'Voucher pulsa Rp5.000', icon: '📱', cost: 120 },
  { id: 3, name: 'Snack Pack', desc: 'Paket snack enak', icon: '🍿', cost: 150 },
  { id: 4, name: 'Peringatan Khusus', desc: 'Disebut di pengumuman kelas', icon: '📢', cost: 60 },
  { id: 5, name: 'Tugas PR Gratis', desc: 'Bebas PR satu kali', icon: '📝', cost: 200 },
  { id: 6, name: 'Voucher Kuota 1GB', desc: 'Kuota internet gratis', icon: '🌐', cost: 250 },
];

function renderRewards() {
  const c = document.getElementById('rewardsGrid');
  c.innerHTML = rewards.map(r => {
    const a = points >= r.cost;
    return `<div class="reward-card fade-in">
      <div class="reward-icon">${r.icon}</div>
      <div class="reward-name">${r.name}</div>
      <div class="reward-desc">${r.desc}</div>
      <div class="reward-cost">⭐ ${r.cost}</div>
      <button class="btn-redeem ${a ? 'available' : 'unavailable'}" data-id="${r.id}" ${!a ? 'disabled' : ''}>${a ? 'Tukar' : 'Kurang ' + (r.cost - points)}</button>
    </div>`;
  }).join('');

  document.querySelectorAll('.btn-redeem.available').forEach(btn => {
    btn.addEventListener('click', () => {
      const rew = rewards.find(r => r.id === parseInt(btn.dataset.id));
      if (!rew || points < rew.cost) return;
      points -= rew.cost;
      localStorage.setItem('cleanclass_points', points);
      document.getElementById('pointsDisplay').textContent = points;
      document.getElementById('pointsDisplay2').textContent = points;
      document.getElementById('exchangePoints').textContent = points;
      const h = JSON.parse(localStorage.getItem('siswa_redeem') || '[]');
      h.unshift({ reward: rew.name, cost: rew.cost, date: new Date().toLocaleString('id-ID') });
      if (h.length > 20) h.length = 20;
      localStorage.setItem('siswa_redeem', JSON.stringify(h));
      renderRewards(); renderHistory();
      showToast(`Berhasil menukar ${rew.name}! 🎉`, 'success');
    });
  });
}

function renderHistory() {
  const c = document.getElementById('redeemHistory');
  const h = JSON.parse(localStorage.getItem('siswa_redeem') || '[]');
  if (!h.length) { c.innerHTML = '<div class="history-empty">Belum ada penukaran</div>'; return; }
  c.innerHTML = '<div class="history-list">' + h.map(x =>
    `<div class="history-item"><span class="h-name">${x.reward}</span><span class="h-cost">-${x.cost}</span><span class="h-date">${x.date}</span></div>`
  ).join('') + '</div>';
}
renderRewards(); renderHistory();

/* ===== SCROLL ANIMATIONS ===== */
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in, .fade-in-right').forEach(el => obs.observe(el));
