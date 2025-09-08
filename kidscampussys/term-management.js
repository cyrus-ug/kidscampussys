document.addEventListener('DOMContentLoaded', () => {
  const termsTableBody = document.querySelector('#termsTable tbody');
  const newTermBtn = document.getElementById('newTermBtn');
  const newTermModal = document.getElementById('newTermModal');
  const newTermForm = document.getElementById('newTermForm');
  const cancelNewTerm = document.getElementById('cancelNewTerm');
  const searchInput = document.getElementById('searchInput');
  const showArchived = document.getElementById('showArchived');

  // Fetch and render terms
  async function loadTerms() {
    const includeArchived = showArchived.checked;
    const query = includeArchived ? '?archived=true' : '';
    const terms = await fetch(`/api/terms${query}`, { credentials:'include' }).then(r=>r.json());
    termsTableBody.innerHTML = '';
    terms.forEach(term => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${term.name}</td>
        <td>${term.startDate}</td>
        <td>${term.endDate}</td>
        <td>${term.status}</td>
        <td>
          ${term.status === 'Open' ? `<button class="close-btn" data-id="${term.id}">Close</button>`
        : term.status === 'Closed' ? `<button class="open-btn" data-id="${term.id}">Open</button>
                                      <button class="archive-btn" data-id="${term.id}">Archive</button>`
        : ''}
        </td>`;
      termsTableBody.append(tr);
    });
    attachTermActions();
  }

  // Show/hide modal
  newTermBtn.addEventListener('click', ()=> newTermModal.setAttribute('aria-hidden','false'));
  cancelNewTerm.addEventListener('click', ()=> newTermModal.setAttribute('aria-hidden','true'));

  // Create new term
  newTermForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(newTermForm);
    const payload = {
      name: formData.get('name').trim(),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate')
    };
    await fetch('/api/terms', {
      method:'POST', headers:{'Content-Type':'application/json'},
      credentials:'include', body:JSON.stringify(payload)
    });
    newTermModal.setAttribute('aria-hidden','true');
    loadTerms();
  });

  // Attach open/close/archive buttons
  function attachTermActions() {
    document.querySelectorAll('.open-btn').forEach(btn =>
      btn.addEventListener('click', () => toggleTerm(btn.dataset.id, 'open'))
    );
    document.querySelectorAll('.close-btn').forEach(btn =>
      btn.addEventListener('click', () => toggleTerm(btn.dataset.id, 'close'))
    );
    document.querySelectorAll('.archive-btn').forEach(btn =>
      btn.addEventListener('click', () => toggleTerm(btn.dataset.id, 'archive'))
    );
  }

  // Toggle term status
  async function toggleTerm(id, action) {
    await fetch(`/api/terms/${id}/${action}`, {
      method:'PUT', credentials:'include'
    });
    loadTerms();
  }

  // Search and filter
  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    document.querySelectorAll('#termsTable tbody tr').forEach(row => {
      const termName = row.cells[0].textContent.toLowerCase();
      row.style.display = termName.includes(filter) ? '' : 'none';
    });
  });
  showArchived.addEventListener('change', loadTerms);

  loadTerms();
});
