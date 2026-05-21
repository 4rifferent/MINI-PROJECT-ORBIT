/* ===== DARK MODE ===== */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('admin_theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('admin_theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

/* ===== NAVIGATION ===== */
const navLinks = document.querySelectorAll('.sidebar-nav a, .sidebar-footer a');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.page;
    if (!target) return;
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + target).classList.add('active');
    document.getElementById('pageTitle').textContent = link.querySelector('span')?.textContent || target;
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

/* ===== MODAL ===== */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('open'); });
});

/* ===== DASHBOARD ===== */
function updateDashboard() {
  const students = JSON.parse(localStorage.getItem('admin_students') || '[]');
  const reports = JSON.parse(localStorage.getItem('siswa_reports') || localStorage.getItem('cleanclass_reports') || '[]');
  const points = parseInt(localStorage.getItem('cleanclass_points') || '0');
  const redeem = JSON.parse(localStorage.getItem('siswa_redeem') || '[]');

  document.getElementById('dashStudents').textContent = students.length || 15;
  document.getElementById('dashReports').textContent = reports.length;
  document.getElementById('dashPoints').textContent = points;
  document.getElementById('dashRedeem').textContent = redeem.length;

  document.getElementById('dashStudents2').textContent = students.length || 15;
  document.getElementById('dashReports2').textContent = reports.length;
  document.getElementById('dashPoints2').textContent = points;
  document.getElementById('dashRedeem2').textContent = redeem.length;
}
updateDashboard();

/* ===== STUDENTS ===== */
let students = JSON.parse(localStorage.getItem('admin_students') || '[]');
if (!students.length) {
  students = [
    { name: 'Rizky', class: 'XII IPA 1', points: 320, status: 'active' },
    { name: 'Alya', class: 'XII IPA 1', points: 290, status: 'active' },
    { name: 'Fahri', class: 'XII IPA 2', points: 260, status: 'active' },
    { name: 'Nabila', class: 'XII IPA 1', points: 240, status: 'active' },
    { name: 'Dimas', class: 'XII IPS 1', points: 210, status: 'active' },
  ];
  localStorage.setItem('admin_students', JSON.stringify(students));
}

const studentModal = document.getElementById('studentModal');
const studentForm = document.getElementById('studentForm');
let editingStudent = null;

function renderStudents() {
  const tbody = document.getElementById('studentsBody');
  if (!students.length) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="icon">👥</div>Belum ada siswa. Tambahkan siswa baru!</div></td></tr>';
    return;
  }
  tbody.innerHTML = students.map((s, i) =>
    `<tr>
      <td>${i + 1}</td>
      <td><strong>${s.name}</strong></td>
      <td>${s.class}</td>
      <td>${s.points}</td>
      <td><span class="badge ${s.status}">${s.status}</span></td>
      <td>
        <div class="actions">
          <button class="edit" onclick="editStudent(${i})" title="Edit">✏️</button>
          <button class="del" onclick="deleteStudent(${i})" title="Hapus">🗑️</button>
        </div>
      </td>
    </tr>`
  ).join('');
}

window.editStudent = function(i) {
  editingStudent = i;
  const s = students[i];
  document.getElementById('sName').value = s.name;
  document.getElementById('sClass').value = s.class;
  document.getElementById('sPoints').value = s.points;
  document.getElementById('sStatus').value = s.status;
  document.getElementById('studentModalTitle').textContent = 'Edit Siswa';
  openModal('studentModal');
};

window.deleteStudent = function(i) {
  if (!confirm(`Hapus ${students[i].name}?`)) return;
  students.splice(i, 1);
  localStorage.setItem('admin_students', JSON.stringify(students));
  renderStudents(); updateDashboard();
  showToast('Siswa dihapus', 'info');
};

studentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById('sName').value.trim(),
    class: document.getElementById('sClass').value.trim(),
    points: parseInt(document.getElementById('sPoints').value) || 0,
    status: document.getElementById('sStatus').value,
  };
  if (editingStudent !== null) {
    students[editingStudent] = data;
    showToast(`${data.name} diperbarui`, 'success');
    editingStudent = null;
  } else {
    students.push(data);
    showToast(`${data.name} ditambahkan`, 'success');
  }
  localStorage.setItem('admin_students', JSON.stringify(students));
  renderStudents(); updateDashboard();
  studentForm.reset();
  closeModal('studentModal');
});

document.getElementById('addStudentBtn').addEventListener('click', () => {
  editingStudent = null;
  studentForm.reset();
  document.getElementById('studentModalTitle').textContent = 'Tambah Siswa';
  openModal('studentModal');
});

renderStudents();

/* ===== SCHEDULE ===== */
let schedule = JSON.parse(localStorage.getItem('admin_schedule') || 'null') || {
  Senin: ['Rizky', 'Alya', 'Fahri'],
  Selasa: ['Nabila', 'Dimas', 'Putri'],
  Rabu: ['Bagas', 'Sinta', 'Raka'],
  Kamis: ['Dion', 'Citra', 'Kevin'],
  Jumat: ['Andi', 'Lala', 'Farhan'],
};

function renderSchedule() {
  const c = document.getElementById('scheduleBody');
  const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  c.innerHTML = dayNames.map(day =>
    `<tr>
      <td><strong>${day}</strong></td>
      <td>${(schedule[day] || []).join(', ')}</td>
      <td>
        <div class="actions">
          <button onclick="editSchedule('${day}')" title="Edit">✏️</button>
        </div>
      </td>
    </tr>`
  ).join('');
}

window.editSchedule = function(day) {
  const val = (schedule[day] || []).join(', ');
  const input = prompt(`Edit jadwal ${day} (pisahkan dengan koma):`, val);
  if (input !== null) {
    schedule[day] = input.split(',').map(s => s.trim()).filter(Boolean);
    localStorage.setItem('admin_schedule', JSON.stringify(schedule));
    renderSchedule();
    showToast(`Jadwal ${day} diperbarui`, 'success');
  }
};

renderSchedule();

/* ===== REPORTS ===== */
function renderReports() {
  const tbody = document.getElementById('reportsBody');
  let reports = JSON.parse(localStorage.getItem('siswa_reports') || '[]');
  const globalReports = JSON.parse(localStorage.getItem('cleanclass_reports') || '[]');
  reports = [...reports, ...globalReports];

  if (!reports.length) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="icon">📋</div>Belum ada laporan</div></td></tr>';
    return;
  }
  tbody.innerHTML = reports.map((r, i) =>
    `<tr>
      <td>${i + 1}</td>
      <td>${r.name}</td>
      <td>${r.area}</td>
      <td>${r.desc.substring(0, 30)}${r.desc.length > 30 ? '...' : ''}</td>
      <td><span class="badge ${r.status || 'pending'}">${r.status || 'pending'}</span></td>
      <td>
        <div class="actions">
          <button class="edit" onclick="approveReport(${i})" title="Setujui">✅</button>
          <button class="del" onclick="rejectReport(${i})" title="Tolak">❌</button>
        </div>
      </td>
    </tr>`
  ).join('');
}

window.approveReport = function(i) {
  let reports = JSON.parse(localStorage.getItem('siswa_reports') || '[]');
  if (reports[i]) { reports[i].status = 'done'; localStorage.setItem('siswa_reports', JSON.stringify(reports)); }
  else {
    reports = JSON.parse(localStorage.getItem('cleanclass_reports') || '[]');
    if (reports[i - JSON.parse(localStorage.getItem('siswa_reports') || '[]').length]) {
      const idx = i - JSON.parse(localStorage.getItem('siswa_reports') || '[]').length;
      reports[idx].status = 'done';
      localStorage.setItem('cleanclass_reports', JSON.stringify(reports));
    }
  }
  renderReports(); showToast('Laporan disetujui ✅', 'success');
};

window.rejectReport = function(i) {
  let reports = JSON.parse(localStorage.getItem('siswa_reports') || '[]');
  if (reports[i]) { reports[i].status = 'rejected'; localStorage.setItem('siswa_reports', JSON.stringify(reports)); }
  else {
    reports = JSON.parse(localStorage.getItem('cleanclass_reports') || '[]');
    const idx = i - JSON.parse(localStorage.getItem('siswa_reports') || '[]').length;
    if (reports[idx]) { reports[idx].status = 'rejected'; localStorage.setItem('cleanclass_reports', JSON.stringify(reports)); }
  }
  renderReports(); showToast('Laporan ditolak ❌', 'warning');
};

renderReports();

/* ===== LEADERBOARD ===== */
function renderAdminLB() {
  const tbody = document.getElementById('adminLBBody');
  let lb = JSON.parse(localStorage.getItem('cleanclass_leaderboard') || '[]');
  if (!lb.length) {
    lb = [
      { name: 'Rizky', points: 320 },
      { name: 'Alya', points: 290 },
      { name: 'Fahri', points: 260 },
    ];
    localStorage.setItem('cleanclass_leaderboard', JSON.stringify(lb));
  }
  lb.sort((a, b) => b.points - a.points);
  tbody.innerHTML = lb.map((e, i) =>
    `<tr>
      <td>${i + 1}</td>
      <td><strong>${e.name}</strong></td>
      <td>${e.points}</td>
      <td>
        <div class="actions">
          <button onclick="editLBEntry(${i})" title="Edit">✏️</button>
          <button onclick="deleteLBEntry(${i})" title="Hapus">🗑️</button>
        </div>
      </td>
    </tr>`
  ).join('');
}

window.editLBEntry = function(i) {
  const lb = JSON.parse(localStorage.getItem('cleanclass_leaderboard') || '[]');
  const name = prompt('Nama:', lb[i].name);
  if (name === null) return;
  const pts = parseInt(prompt('Poin:', lb[i].points));
  if (isNaN(pts)) return;
  lb[i] = { name: name.trim(), points: pts };
  localStorage.setItem('cleanclass_leaderboard', JSON.stringify(lb));
  renderAdminLB(); updateDashboard();
  showToast('Leaderboard diperbarui', 'success');
};

window.deleteLBEntry = function(i) {
  const lb = JSON.parse(localStorage.getItem('cleanclass_leaderboard') || '[]');
  if (!confirm(`Hapus ${lb[i].name}?`)) return;
  lb.splice(i, 1);
  localStorage.setItem('cleanclass_leaderboard', JSON.stringify(lb));
  renderAdminLB(); updateDashboard();
  showToast('Dihapus', 'info');
};

document.getElementById('addLBbtn')?.addEventListener('click', () => {
  const name = prompt('Nama siswa:');
  if (!name) return;
  const pts = parseInt(prompt('Poin:'));
  if (isNaN(pts)) return;
  const lb = JSON.parse(localStorage.getItem('cleanclass_leaderboard') || '[]');
  lb.push({ name: name.trim(), points: pts });
  localStorage.setItem('cleanclass_leaderboard', JSON.stringify(lb));
  renderAdminLB(); updateDashboard();
  showToast(`${name} ditambahkan`, 'success');
});

document.getElementById('resetLBbtn')?.addEventListener('click', () => {
  if (!confirm('Reset semua data leaderboard?')) return;
  localStorage.setItem('cleanclass_leaderboard', '[]');
  renderAdminLB(); updateDashboard();
  showToast('Leaderboard direset', 'warning');
});

renderAdminLB();

/* ===== REWARDS ===== */
let rewards = JSON.parse(localStorage.getItem('admin_rewards') || 'null') || [
  { id: 1, name: 'Bebas Piket 1 Hari', desc: 'Bebas tugas piket sehari', icon: '🎫', cost: 80 },
  { id: 2, name: 'Voucher Pulsa 5K', desc: 'Voucher pulsa Rp5.000', icon: '📱', cost: 120 },
  { id: 3, name: 'Snack Pack', desc: 'Paket snack enak', icon: '🍿', cost: 150 },
  { id: 4, name: 'Peringatan Khusus', desc: 'Disebut di pengumuman', icon: '📢', cost: 60 },
  { id: 5, name: 'Tugas PR Gratis', desc: 'Bebas PR satu kali', icon: '📝', cost: 200 },
  { id: 6, name: 'Voucher Kuota 1GB', desc: 'Kuota internet gratis', icon: '🌐', cost: 250 },
];

function renderRewardManage() {
  const tbody = document.getElementById('rewardBody');
  tbody.innerHTML = rewards.map((r, i) =>
    `<tr>
      <td>${r.icon}</td>
      <td><strong>${r.name}</strong></td>
      <td>${r.desc}</td>
      <td>⭐ ${r.cost}</td>
      <td>
        <div class="actions">
          <button class="edit" onclick="editReward(${i})" title="Edit">✏️</button>
          <button class="del" onclick="deleteReward(${i})" title="Hapus">🗑️</button>
        </div>
      </td>
    </tr>`
  ).join('');
}

window.editReward = function(i) {
  const r = rewards[i];
  const name = prompt('Nama reward:', r.name);
  if (!name) return;
  const desc = prompt('Deskripsi:', r.desc);
  if (!desc) return;
  const cost = parseInt(prompt('Biaya (poin):', r.cost));
  if (isNaN(cost)) return;
  rewards[i] = { ...r, name, desc, cost };
  saveRewards();
};

window.deleteReward = function(i) {
  if (!confirm(`Hapus ${rewards[i].name}?`)) return;
  rewards.splice(i, 1);
  saveRewards();
};

function saveRewards() {
  localStorage.setItem('admin_rewards', JSON.stringify(rewards));
  renderRewardManage();
  showToast('Reward diperbarui', 'success');
}

document.getElementById('addRewardBtn')?.addEventListener('click', () => {
  const name = prompt('Nama reward:');
  if (!name) return;
  const desc = prompt('Deskripsi:');
  if (!desc) return;
  const icon = prompt('Icon (emoji):', '🎁');
  const cost = parseInt(prompt('Biaya (poin):'));
  if (isNaN(cost)) return;
  const id = Math.max(...rewards.map(r => r.id), 0) + 1;
  rewards.push({ id, name, desc, icon, cost });
  saveRewards();
});

renderRewardManage();
