document.addEventListener('DOMContentLoaded', () => {
  const teacherSelect = document.getElementById('teacherSelect');
  const actionSelect  = document.getElementById('actionSelect');
  const dateFrom      = document.getElementById('dateFrom');
  const dateTo        = document.getElementById('dateTo');
  const loadBtn       = document.getElementById('loadBtn');
  const exportBtn     = document.getElementById('exportCsv');
  const tableBody     = document.querySelector('#logsTable tbody');
  const prevBtn       = document.getElementById('prevPage');
  const nextBtn       = document.getElementById('nextPage');
  const pageInfo      = document.getElementById('pageInfo');

  let currentPage = 1;
  const pageSize  = 20;

  async function loadTeachers() {
    const teachers = await fetch('/api/teachers', { credentials:'include' }).then(r => r.json());
    teachers.forEach(t => teacherSelect.add(new Option(t.name, t.id)));
  }

  async function loadLogs(page = 1) {
    const params = new URLSearchParams({
      teacherId: teacherSelect.value,
      action: actionSelect.value,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      page,
      pageSize
    });
    const res = await fetch(`/api/logs?${params}`, { credentials:'include' });
    const { logs, totalPages } = await res.json();
    tableBody.innerHTML = '';
    logs.forEach((log, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${(page-1)*pageSize + i + 1}</td>
        <td>${new Date(log.timestamp).toLocaleString()}</td>
        <td>${log.teacherName}</td>
        <td>${log.actionLabel}</td>
        <td>${log.details}</td>`;
      tableBody.append(tr);
    });
    currentPage = page;
    pageInfo.textContent = `Page ${page} of ${totalPages}`;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
  }

  loadBtn.addEventListener('click', () => loadLogs(1));
  prevBtn.addEventListener('click', () => loadLogs(currentPage - 1));
  nextBtn.addEventListener('click', () => loadLogs(currentPage + 1));

  exportBtn.addEventListener('click', () => {
    const params = new URLSearchParams({
      teacherId: teacherSelect.value,
      action: actionSelect.value,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      export: 'csv'
    });
    window.location = `/api/logs?${params}`;
  });

  loadTeachers().then(() => loadLogs(1));
});
