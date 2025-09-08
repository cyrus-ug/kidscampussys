document.addEventListener('DOMContentLoaded', () => {
  const classSelect = document.getElementById('classSelect');
  const sectionSelect = document.getElementById('sectionSelect');
  const form = document.getElementById('pupilForm');
  const errorMsg = document.getElementById('formError');

  // Load classes and sections
  fetch('/api/classes')
    .then(res => res.json())
    .then(classes => {
      classes.forEach(c => {
        classSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
      });
    });

  classSelect.addEventListener('change', () => {
    const classId = classSelect.value;
    sectionSelect.innerHTML = '<option value="">Select Section</option>';
    if (!classId) return;
    fetch(`/api/classes/${classId}/sections`)
      .then(res => res.json())
      .then(sections => {
        sections.forEach(s => {
          sectionSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
        });
      });
  });

  // Form submission
  form.addEventListener('submit', async e => {
    e.preventDefault();
    errorMsg.textContent = '';

    const formData = new FormData(form);
    const payload = {
      fullName: formData.get('fullName').trim(),
      dob: formData.get('dob'),
      gender: formData.get('gender'),
      classId: formData.get('classId'),
      sectionId: formData.get('sectionId'),
      requirements: formData.getAll('requirements'),
      guardian: {
        name: formData.get('guardianName').trim(),
        relationship: formData.get('guardianRelationship').trim(),
        phone: formData.get('guardianPhone').trim(),
        email: formData.get('guardianEmail').trim(),
      }
    };

    // Basic validation
    if (!payload.fullName || !payload.dob || !payload.gender) {
      errorMsg.textContent = 'Please fill in all required fields.';
      return;
    }

    try {
      const res = await fetch('/api/pupils', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      window.location.href = 'pupils.html';
    } catch (err) {
      errorMsg.textContent = err.message;
    }
  });
});
