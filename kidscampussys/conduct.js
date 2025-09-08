document.addEventListener('DOMContentLoaded', () => {
  const termSelect = document.getElementById('termSelect');
  const classSelect = document.getElementById('classSelect');
  const loadBtn = document.getElementById('loadBtn');
  const tableBody = document.querySelector('#conductTable tbody');
  const form = document.getElementById('conductForm');
  const errorMsg = document.getElementById('formError');

  // Load dropdowns
  async function loadFilters() {
    const [terms, classes] = await Promise.all([
      fetch('/api/terms').then(r => r.json()),
      fetch('/api/classes').then(r => r.json())
    ]);
    terms.forEach(t => termSelect.add(new Option(t.name, t.id)));
    classes.forEach(c => classSelect.add(new Option(c.name, c.id)));
  }

  // Build table rows
  loadBtn.addEventListener('click', async () => {
    errorMsg.textContent = '';
    tableBody.innerHTML = '';
    const termId = termSelect.value;
    const classId = classSelect.value;
    if (!termId || !classId) {
      errorMsg.textContent = 'Please select both term and class.';
      return;
    }
    const pupils = await fetch(`/api/pupils?class=${classId}`).then(r => r.json());
    pupils.forEach((p, i) => {
      const row = document.createElement('tr');
      row.dataset.id = p.id;
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${p.fullName}</td>
        <td>
          <label><input type="radio" name="attendance_${p.id}" value="present" checked/> Present</label>
          <label><input type="radio" name="attendance_${p.id}" value="absent"/> Absent</label>
        </td>
        <td>
          <select name="behavior_${p.id}">
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </td>
        <td>
          <input type="text" name="comments_${p.id}" placeholder="Optional comments"/>
        </td>`;
      tableBody.append(row);
    });
  });

  // Submit conduct reports
  form.addEventListener('submit', async e => {
    e.preventDefault();
    errorMsg.textContent = '';
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const reports = rows.map(row => {
      const id = row.dataset.id;
      const attendance = form[`attendance_${id}`].value;
      const behavior = form[`behavior_${id}`].value;
      const comments = form[`comments_${id}`].value.trim();
      return { pupilId: +id, attendance, behavior, comments };
    });

    try {
      const res = await fetch('/api/conduct', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
        body: JSON.stringify({ termId: termSelect.value, classId: classSelect.value, reports })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert('Conduct reports saved successfully.');
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });

  loadFilters();
});
