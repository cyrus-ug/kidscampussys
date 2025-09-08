document.addEventListener('DOMContentLoaded', () => {
  const termSelect    = document.getElementById('termSelect');
  const classSelect   = document.getElementById('classSelect');
  const sectionSelect = document.getElementById('sectionSelect');
  const loadBtn       = document.getElementById('loadBtn');
  const printBtn      = document.getElementById('printReport');
  const emailBtn      = document.getElementById('emailMissing');
  const table         = document.getElementById('inventoryTable');
  const thead         = table.querySelector('thead tr');
  const tbody         = table.querySelector('tbody');

  let requirements = [];

  // Load filter options and requirements list
  async function init() {
    const [terms, classes, reqs] = await Promise.all([
      fetch('/api/terms').then(r => r.json()),
      fetch('/api/classes').then(r => r.json()),
      fetch('/api/requirements').then(r => r.json())
    ]);
    terms.forEach(t => termSelect.add(new Option(t.name, t.id)));
    classes.forEach(c => classSelect.add(new Option(c.name, c.id)));
    requirements = reqs;
    renderTableHeader();
  }

  // Render requirement columns in header
  function renderTableHeader() {
    // Insert one <th> per requirement before Missing Count
    const idx = thead.querySelectorAll('th').length - 2;
    requirements.forEach(req => {
      const th = document.createElement('th');
      th.textContent = req.label;
      thead.insertBefore(th, thead.children[idx]);
    });
  }

  // Load pupils and their submission statuses
  loadBtn.addEventListener('click', async () => {
    const termId    = termSelect.value;
    const classId   = classSelect.value;
    const sectionId = sectionSelect.value;
    if (!classId) return alert('Select a class');
    const params = new URLSearchParams({ term:termId, class:classId, section:sectionId });
    const data = await fetch(`/api/requirements/tracker?${params}`, { credentials:'include' })
                    .then(r => r.json());
    renderTableRows(data);
  });

  // Render rows with checkboxes and missing count
  function renderTableRows(pupils) {
    tbody.innerHTML = '';
    pupils.forEach((p, i) => {
      const tr = document.createElement('tr');
      const missing = requirements.reduce((cnt, req) => cnt + (p.submissions[req.id] ? 0 : 1), 0);
      tr.innerHTML = `
        <td>${i+1}</td>
        <td>${p.fullName}</td>
        ${requirements.map(req =>
          `<td>
             <input type="checkbox"
                    class="submit-checkbox"
                    data-pupil="${p.id}"
                    data-req="${req.id}"
                    ${p.submissions[req.id] ? 'checked' : ''}/>
           </td>`
        ).join('')}
        <td class="missing-count">${missing}</td>
        <td>
          <button class="clear-row" data-pupil="${p.id}">Clear</button>
        </td>`;
      tbody.append(tr);
    });
    attachEventHandlers();
  }

  // Attach checkbox and clear-row handlers
  function attachEventHandlers() {
    // Checkbox change → update one submission
    tbody.querySelectorAll('.submit-checkbox').forEach(cb => {
      cb.addEventListener('change', async () => {
        const pupilId = cb.dataset.pupil;
        const reqId   = cb.dataset.req;
        const submitted = cb.checked;
        await fetch('/api/requirements/tracker', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          credentials: 'include',
          body: JSON.stringify({ pupilId, reqId, submitted })
        });
        // Update missing count cell
        const row = cb.closest('tr');
        const newMissing = Array.from(row.querySelectorAll('.submit-checkbox'))
          .reduce((cnt, el) => cnt + (el.checked ? 0 : 1), 0);
        row.querySelector('.missing-count').textContent = newMissing;
      });
    });

    // Clear-row button → uncheck all and update
    tbody.querySelectorAll('.clear-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        row.querySelectorAll('.submit-checkbox').forEach(cb => cb.checked = false);
        row.querySelector('.missing-count').textContent = requirements.length;
        // Bulk update
        const pupilId = btn.dataset.pupil;
        fetch('/api/requirements/tracker/bulk', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            pupilId,
            updates: requirements.map(req => ({ reqId: req.id, submitted: false }))
          })
        });
      });
    });
  }

  // Print report
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // Email missing-items list
  emailBtn.addEventListener('click', async () => {
    const classId   = classSelect.value;
    const termId    = termSelect.value;
    const sectionId = sectionSelect.value;
    if (!classId) return alert('Select a class');
    await fetch('/api/requirements/tracker/notify', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
      body: JSON.stringify({ termId, classId, sectionId })
    });
    alert('Notification sent for missing items.');
  });

  init();
});
