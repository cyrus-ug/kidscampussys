document.addEventListener('DOMContentLoaded', () => {
  const termSelect    = document.getElementById('termSelect');
  const classSelect   = document.getElementById('classSelect');
  const sectionSelect = document.getElementById('sectionSelect');
  const dateFrom      = document.getElementById('dateFrom');
  const dateTo        = document.getElementById('dateTo');
  const loadBtn       = document.getElementById('loadBtn');
  const exportCsv     = document.getElementById('exportCsv');
  const exportPdf     = document.getElementById('exportPdf');
  const feesTable     = document.getElementById('feesTable').querySelector('tbody');
  const paymentModal  = document.getElementById('paymentModal');
  const historyModal  = document.getElementById('historyModal');
  const paymentForm   = document.getElementById('paymentForm');
  const historyTable  = document.getElementById('historyTable').querySelector('tbody');
  const cancelPayment = document.getElementById('cancelPayment');
  const closeHistory  = document.getElementById('closeHistory');

  // Load filters
  async function loadFilters() {
    const [terms, classes, sections] = await Promise.all([
      fetch('/api/terms').then(r => r.json()),
      fetch('/api/classes').then(r => r.json()),
      fetch('/api/sections').then(r => r.json())
    ]);
    terms.forEach(t => termSelect.add(new Option(t.name, t.id)));
    classes.forEach(c => classSelect.add(new Option(c.name, c.id)));
    sections.forEach(s => sectionSelect.add(new Option(s.name, s.id)));
  }

  // Load fee data
  async function loadFees() {
    const params = new URLSearchParams({
      term: termSelect.value,
      class: classSelect.value,
      section: sectionSelect.value,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value
    });
    const data = await fetch(`/api/fees?${params}`, { credentials:'include' })
                     .then(r => r.json());
    feesTable.innerHTML = '';
    data.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i+1}</td>
        <td>${p.fullName}</td>
        <td>${p.totalDue}</td>
        <td>${p.paid}</td>
        <td>${p.balance}</td>
        <td>
          <button class="record-btn" data-id="${p.id}" ${p.balance==0?'disabled':''}>Record</button>
          <button class="history-btn" data-id="${p.id}">History</button>
          <button class="print-btn" data-id="${p.id}">Print</button>
        </td>`;
      feesTable.append(tr);
    });
    attachTableHandlers();
  }

  // Table button handlers
  function attachTableHandlers() {
    document.querySelectorAll('.record-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        paymentModal.setAttribute('aria-hidden', 'false');
        paymentForm.reset();
        document.getElementById('modalPupilId').value = btn.dataset.id;
      });
    });
    document.querySelectorAll('.history-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        historyTable.innerHTML = '';
        const id = btn.dataset.id;
        const history = await fetch(`/api/fees/history?pupilId=${id}`, { credentials:'include' })
                               .then(r => r.json());
        history.forEach(h => {
          const row = document.createElement('tr');
          row.innerHTML = `<td>${new Date(h.date).toLocaleDateString()}</td>
                           <td>${h.amount}</td>
                           <td>${h.recordedBy}</td>`;
          historyTable.append(row);
        });
        historyModal.setAttribute('aria-hidden', 'false');
      });
    });
    document.querySelectorAll('.print-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.open(`/api/fees/invoice?pupilId=${btn.dataset.id}`, '_blank');
      });
    });
  }

  // Record payment submit
  paymentForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id     = document.getElementById('modalPupilId').value;
    const amount = paymentForm.amount.value;
    const date   = paymentForm.date.value;
    await fetch('/api/fees/pay', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
      body: JSON.stringify({ pupilId: id, amount, date })
    });
    paymentModal.setAttribute('aria-hidden', 'true');
    loadFees();
  });
  cancelPayment.addEventListener('click', () =>
    paymentModal.setAttribute('aria-hidden', 'true')
  );
  closeHistory.addEventListener('click', () =>
    historyModal.setAttribute('aria-hidden', 'true')
  );

  // Export
  exportCsv.addEventListener('click', () => {
    const params = new URLSearchParams({
      export: 'csv',
      term: termSelect.value,
      class: classSelect.value,
      section: sectionSelect.value
    });
    window.location = `/api/fees?${params}`;
  });
  exportPdf.addEventListener('click', () => {
    const params = new URLSearchParams({
      export: 'pdf',
      term: termSelect.value,
      class: classSelect.value,
      section: sectionSelect.value
    });
    window.open(`/api/fees?${params}`, '_blank');
  });

  loadFilters().then(loadFees);
  loadBtn.addEventListener('click', loadFees);
});
