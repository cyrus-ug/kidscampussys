import { initUserPermissions, can } from './permissions-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initUserPermissions();
  
  const saveBtn = document.getElementById('saveMarksBtn');
  if (!can('Marks', 'U')) {
    saveBtn.disabled = true;
    saveBtn.title = 'You do not have permission to update marks';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const termSelect = document.getElementById('termSelect');
  const classSelect = document.getElementById('classSelect');
  const subjectSelect = document.getElementById('subjectSelect');
  const loadBtn = document.getElementById('loadBtn');
  const tableBody = document.querySelector('#marksTable tbody');
  const form = document.getElementById('marksForm');
  const errorMsg = document.getElementById('formError');

  
  // Utility: calculate average and grade
  function calcAverage(mid, end) {
    return ((mid || 0) + (end || 0)) / 2;
  }
  function calcGrade(avg) {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  }

  // Load dropdown data
  async function loadDropdowns() {
    const [terms, classes, subjects] = await Promise.all([
      fetch('/api/terms').then(r => r.json()),
      fetch('/api/classes').then(r => r.json()),
      fetch('/api/subjects').then(r => r.json())
    ]);
    terms.forEach(t => termSelect.add(new Option(t.name, t.id)));
    classes.forEach(c => classSelect.add(new Option(c.name, c.id)));
    subjects.forEach(s => subjectSelect.add(new Option(s.name, s.id)));
  }

  // Fetch pupils and build table
  loadBtn.addEventListener('click', async () => {
    errorMsg.textContent = '';
    tableBody.innerHTML = '';
    const termId = termSelect.value;
    const classId = classSelect.value;
    const subjectId = subjectSelect.value;
    if (!termId || !classId || !subjectId) {
      errorMsg.textContent = 'Select term, class, and subject.';
      return;
    }
    const res = await fetch(`/api/marks?term=${termId}&class=${classId}&subject=${subjectId}`, { credentials: 'include' });
    const pupils = await res.json();
    pupils.forEach((p, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${p.fullName}</td>
        <td><input type="number" min="0" max="100" name="midTerm" value="${p.midTerm||''}" /></td>
        <td><input type="number" min="0" max="100" name="endTerm" value="${p.endTerm||''}" /></td>
        <td class="avg">–</td>
        <td class="grade">–</td>`;
      // Update avg & grade on input
      row.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', () => {
          const mid = parseFloat(row.querySelector('input[name="midTerm"]').value) || 0;
          const end = parseFloat(row.querySelector('input[name="endTerm"]').value) || 0;
          const avg = calcAverage(mid, end).toFixed(1);
          row.querySelector('.avg').textContent = avg;
          row.querySelector('.grade').textContent = calcGrade(avg);
        });
      });
      tableBody.append(row);
    });
  });

  // Submit marks
  form.addEventListener('submit', async e => {
    e.preventDefault();
    errorMsg.textContent = '';
    const term = termSelect.value;
    const cls = classSelect.value;
    const subj = subjectSelect.value;
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const payload = rows.map(row => ({
      pupilId: Number(row.dataset.id),
      midTerm: Number(row.querySelector('input[name="midTerm"]').value) || 0,
      endTerm: Number(row.querySelector('input[name="endTerm"]').value) || 0,
    }));
    try {
      const res = await fetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        credentials: 'include',
        body: JSON.stringify({ term, class: cls, subject: subj, marks: payload })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert('Marks saved successfully.');
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });

  loadDropdowns();
});
<button id="saveMarksBtn">Save Marks</button>
