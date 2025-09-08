document.addEventListener('DOMContentLoaded', () => {
  const rolePromise = fetch('/api/auth/me', { credentials:'include' }).then(r=>r.json());
  const tableBody     = document.querySelector('#assignmentsTable tbody');
  const newBtn        = document.getElementById('newAssignmentBtn');
  const assignmentModal = document.getElementById('assignmentModal');
  const assignmentForm  = document.getElementById('assignmentForm');
  const cancelAssignment= document.getElementById('cancelAssignment');
  const submitModal     = document.getElementById('submitModal');
  const submitForm      = document.getElementById('submitForm');
  const cancelSubmit    = document.getElementById('cancelSubmit');
  const reviewModal     = document.getElementById('reviewModal');
  const submissionsBody = document.querySelector('#submissionsTable tbody');
  const cancelReview    = document.getElementById('cancelReview');
  const saveGrades      = document.getElementById('saveGrades');

  let userRole;

  // Utility: show/hide modal
  function toggle(modal, show) {
    modal.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  // Load subjects for assignment form
  async function loadSubjects() {
    const subjects = await fetch('/api/subjects', { credentials:'include' }).then(r=>r.json());
    const select = document.getElementById('assignSubject');
    subjects.forEach(s => select.add(new Option(s.name, s.id)));
  }

  // Load assignments & render actions
  async function loadAssignments() {
    const assignments = await fetch('/api/assignments', { credentials:'include' }).then(r=>r.json());
    tableBody.innerHTML = '';
    assignments.forEach((a, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i+1}</td>
        <td>${a.title}</td>
        <td>${a.subjectName}</td>
        <td>${a.dueDate}</td>
        <td>${a.resources.map(r=>`<a href="${r.url}" target="_blank">Download</a>`).join(', ')}</td>
        <td class="actions"></td>`;
      const actions = tr.querySelector('.actions');
      if (userRole === 'teacher') {
        actions.innerHTML = `
          <button class="review-btn" data-id="${a.id}">Review</button>`;
      } else {
        actions.innerHTML = `
          <button class="submit-btn" data-id="${a.id}">Submit</button>`;
      }
      tableBody.append(tr);
    });
    attachActionHandlers();
  }

  // Handlers for New, Review, Submit
  function attachActionHandlers() {
    if (userRole === 'teacher') {
      document.querySelectorAll('.review-btn').forEach(btn =>
        btn.addEventListener('click', () => openReview(btn.dataset.id))
      );
    } else {
      document.querySelectorAll('.submit-btn').forEach(btn =>
        btn.addEventListener('click', () => openSubmit(btn.dataset.id))
      );
    }
  }

  // New Assignment
  rolePromise.then(user => {
    userRole = user.role;
    if (userRole !== 'teacher') newBtn.style.display = 'none';
    return loadSubjects();
  }).then(loadAssignments);

  newBtn.addEventListener('click', () => {
    assignmentForm.reset();
    assignmentForm.assignmentId.value = '';
    document.getElementById('modalTitle').textContent = 'New Assignment';
    toggle(assignmentModal, true);
  });
  cancelAssignment.addEventListener('click', () => toggle(assignmentModal, false));

  assignmentForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(assignmentForm);
    await fetch('/api/assignments', {
      method:'POST',
      credentials:'include',
      body: formData
    });
    toggle(assignmentModal, false);
    loadAssignments();
  });

  // Student Submit
  function openSubmit(id) {
    submitForm.reset();
    document.getElementById('submitAssignmentId').value = id;
    toggle(submitModal, true);
  }
  cancelSubmit.addEventListener('click', () => toggle(submitModal, false));
  submitForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(submitForm);
    const id = data.get('assignmentId') || data.get('submitAssignmentId');
    await fetch(`/api/assignments/${id}/submissions`, {
      method:'POST',
      credentials:'include',
      body: data
    });
    toggle(submitModal, false);
  });

  // Teacher Review
  async function openReview(id) {
    submissionsBody.innerHTML = '';
    const subs = await fetch(`/api/assignments/${id}/submissions`, { credentials:'include' })
                    .then(r=>r.json());
    subs.forEach(s => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${s.studentName}</td>
        <td><a href="${s.fileUrl}" target="_blank">Download</a></td>
        <td>${s.comment || ''}</td>
        <td><input type="text" data-subid="${s.id}" value="${s.grade||''}" size="4"/></td>`;
      submissionsBody.append(row);
    });
    document.getElementById('saveGrades').dataset.assignId = id;
    toggle(reviewModal, true);
  }
  cancelReview.addEventListener('click', () => toggle(reviewModal, false));
  saveGrades.addEventListener('click', async () => {
    const id = saveGrades.dataset.assignId;
    const updates = Array.from(submissionsBody.querySelectorAll('input')).map(inp => ({
      submissionId: inp.dataset.subid,
      grade: inp.value
    }));
    await fetch(`/api/assignments/${id}/submissions/grade`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'include',
      body: JSON.stringify({ updates })
    });
    toggle(reviewModal, false);
  });
});
