document.addEventListener('DOMContentLoaded', () => {
  const sidebar        = document.getElementById('sidebar');
  const menuBtn        = document.getElementById('menuBtn');
  const logoutBtn      = document.getElementById('logoutBtn');
  const parentNameEl   = document.getElementById('parentName');
  const childrenList   = document.getElementById('childrenList');
  const notifications  = document.getElementById('notificationsList');
  const alertForm      = document.getElementById('alertSettingsForm');
  const sections       = document.querySelectorAll('.section');
  const links          = document.querySelectorAll('.sidebar a');

  // Toggle sidebar on mobile
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
  });

  // Navigation
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      sections.forEach(s => s.classList.add('hidden'));
      document.querySelector(link.getAttribute('href')).classList.remove('hidden');
    });
  });

  // Logout
  logoutBtn.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login.html';
  });

  // Load parent profile & children
  async function loadDashboard() {
    const data = await fetch('/api/parent/dashboard', { credentials: 'include' }).then(r => r.json());
    parentNameEl.textContent = data.parentName;
    data.children.forEach(child => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${child.fullName}</h2>
        <div class="actions">
          <button class="view" data-child="${child.id}" data-page="reports">View Reports</button>
          <button class="view" data-child="${child.id}" data-page="conduct">Conduct</button>
          <button class="view" data-child="${child.id}" data-page="fees">Fees</button>
        </div>`;
      childrenList.append(card);
    });
    attachViewHandlers();
  }

  // Handle “View …” buttons
  function attachViewHandlers() {
    childrenList.querySelectorAll('.view').forEach(btn => {
      btn.addEventListener('click', () => {
        const { child, page } = btn.dataset;
        window.location.href = `/parent/${page}.html?childId=${child}`;
      });
    });
  }

  // Load notifications
  async function loadNotifications() {
    const notes = await fetch('/api/parent/notifications', { credentials: 'include' }).then(r => r.json());
    notifications.innerHTML = '';
    notes.forEach(n => {
      const li = document.createElement('li');
      li.textContent = `[${new Date(n.date).toLocaleString()}] ${n.message}`;
      notifications.append(li);
    });
  }

  // Load & save alert settings
  async function initSettings() {
    const settings = await fetch('/api/parent/settings', { credentials: 'include' }).then(r => r.json());
    alertForm.email.checked = settings.email;
    alertForm.sms.checked   = settings.sms;
  }
  alertForm.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      email: alertForm.email.checked,
      sms:   alertForm.sms.checked
    };
    await fetch('/api/parent/settings', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    alert('Settings saved.');
  });

  // Initial load
  loadDashboard();
  loadNotifications();
  initSettings();
});
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const childId = params.get('childId');
  const data = await fetch(`/api/parent/fees?childId=${childId}`, {
    credentials: 'include'
  }).then(r => r.json());

  const tbody = document.getElementById('feeStatusBody');
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.termName}</td>
      <td>${item.amount_due.toFixed(2)}</td>
      <td>${item.paid.toFixed(2)}</td>
      <td>${(item.amount_due - item.paid).toFixed(2)}</td>`;
    tbody.append(tr);
  });
});
