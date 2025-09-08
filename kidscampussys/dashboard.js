// Toggle sidebar visibility
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// Highlight active link based on URL
document.querySelectorAll('.sidebar a').forEach(link => {
  if (link.href.includes(window.location.pathname)) {
    link.parentElement.classList.add('active');
  }
});

// dashboard.js (continued)
async function loadWidgets() {
  const res = await fetch('/api/dashboard', { credentials: 'include' });
  const data = await res.json();

  document.getElementById('totalPupils').querySelector('span').textContent = data.totalPupils;
  document.getElementById('totalTeachers').querySelector('span').textContent = data.totalTeachers;
  document.getElementById('activeTerm').querySelector('span').textContent = data.activeTerm;
  document.getElementById('upcomingEvents').querySelector('span').textContent = data.upcomingEvents.join(', ');
}

function printReport() {
  window.print();
}

loadWidgets();
