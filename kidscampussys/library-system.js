import { can, initUserPermissions } from './src/permissions-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tbody           = document.querySelector('#booksTable tbody');
  const newBookBtn      = document.getElementById('newBookBtn');
  const searchInput     = document.getElementById('searchInput');
  const availFilter     = document.getElementById('availabilityFilter');

  // Initialize user permissions
  await initUserPermissions();

  // Check permissions and show/hide new book button
  if (can('Library', 'C')) {
    newBookBtn.style.display = 'inline-block';
  } else {
    newBookBtn.style.display = 'none';
  }

  const bookModal       = document.getElementById('bookModal');
  const bookForm        = document.getElementById('bookForm');
  const cancelBook      = document.getElementById('cancelBook');

  const checkoutModal   = document.getElementById('checkoutModal');
  const checkoutForm    = document.getElementById('checkoutForm');
  const cancelCheckout  = document.getElementById('cancelCheckout');
  const checkoutPupil   = document.getElementById('checkoutPupil');

  const historyModal    = document.getElementById('historyModal');
  const historyTbody    = document.querySelector('#historyTable tbody');
  const closeHistory    = document.getElementById('closeHistory');

  const toggleModal = (m, show) => m.setAttribute('aria-hidden', show ? 'false' : 'true');

  async function loadPupils() {
    const pupils = await fetch('/api/pupils').then(r => r.json());
    checkoutPupil.innerHTML = '<option value="">Select Pupil</option>';
    pupils.forEach(p => checkoutPupil.add(new Option(p.fullName, p.id)));
  }

  async function loadBooks() {
    const params = new URLSearchParams({
      q: searchInput.value.trim(),
      status: availFilter.value
    });
    const books = await fetch(`/api/library/books?${params}`, { credentials:'include' })
                     .then(r => r.json());
    tbody.innerHTML = '';
    books.forEach((b, i) => {
      const tr = document.createElement('tr');
      if (b.overdueCount > 0) tr.classList.add('overdue-row');
      tr.innerHTML = `
        <td>${i+1}</td>
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td>${b.isbn}</td>
        <td>${b.totalCopies}</td>
        <td>${b.availableCopies}</td>
        <td class="actions">
          <button class="edit" data-id="${b.id}">Edit</button>
          <button class="delete" data-id="${b.id}">Del</button>
          <button class="checkout" data-id="${b.id}" ${b.availableCopies==0?'disabled':''}>Out</button>
          <button class="history" data-id="${b.id}">Hist</button>
        </td>`;
      tbody.append(tr);
    });
    attachHandlers();
  }

  function attachHandlers() {
    document.querySelectorAll('.edit').forEach(btn => btn.onclick = editBook);
    document.querySelectorAll('.delete').forEach(btn => btn.onclick = deleteBook);
    document.querySelectorAll('.checkout').forEach(btn => btn.onclick = openCheckout);
    document.querySelectorAll('.history').forEach(btn => btn.onclick = showHistory);
  }

  // New/Edit Book
  newBookBtn.onclick = () => {
    bookForm.reset();
    bookForm.bookId.value = '';
    document.getElementById('bookModalTitle').textContent = 'New Book';
    toggleModal(bookModal, true);
  };
  cancelBook.onclick = () => toggleModal(bookModal, false);

  bookForm.onsubmit = async e => {
    e.preventDefault();
    const id     = bookForm.bookId.value;
    const data   = Object.fromEntries(new FormData(bookForm));
    const method = id ? 'PUT' : 'POST';
    const url    = id ? `/api/library/books/${id}` : '/api/library/books';
    await fetch(url, {
      method, headers: {'Content-Type':'application/json'},
      credentials:'include', body: JSON.stringify(data)
    });
    toggleModal(bookModal, false);
    loadBooks();
  };

  async function editBook(e) {
    const id = e.target.dataset.id;
    const b  = await fetch(`/api/library/books/${id}`, { credentials:'include' }).then(r => r.json());
    bookForm.bookId.value   = b.id;
    bookForm.title.value    = b.title;
    bookForm.author.value   = b.author;
    bookForm.isbn.value     = b.isbn;
    bookForm.copies.value   = b.totalCopies;
    document.getElementById('bookModalTitle').textContent = 'Edit Book';
    toggleModal(bookModal, true);
  }

  async function deleteBook(e) {
    if (!confirm('Delete this book?')) return;
    await fetch(`/api/library/books/${e.target.dataset.id}`, {
      method:'DELETE', credentials:'include'
    });
    loadBooks();
  }

  // Checkout
  openCheckout = e => {
    checkoutForm.reset();
    checkoutForm.checkoutBookId.value = e.target.dataset.id;
    toggleModal(checkoutModal, true);
  };
  cancelCheckout.onclick = () => toggleModal(checkoutModal, false);
  checkoutForm.onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(checkoutForm));
    await fetch('/api/library/checkout', {
      method:'POST', headers:{'Content-Type':'application/json'},
      credentials:'include', body: JSON.stringify(data)
    });
    toggleModal(checkoutModal, false);
    loadBooks();
  };

  // History
  async function showHistory(e) {
    historyTbody.innerHTML = '';
    const hist = await fetch(
      `/api/library/history?bookId=${e.target.dataset.id}`, { credentials:'include' }
    ).then(r => r.json());
    hist.forEach(h => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${h.pupilName}</td>
        <td>${new Date(h.checkedOut).toLocaleDateString()}</td>
        <td>${h.returned ? new Date(h.returned).toLocaleDateString() : '—'}</td>
        <td>${h.overdue ? 'Overdue' : 'OK'}</td>`;
      if (h.overdue) tr.classList.add('overdue-row');
      historyTbody.append(tr);
    });
    toggleModal(historyModal, true);
  }
  closeHistory.onclick = () => toggleModal(historyModal, false);

  // Filters
  searchInput.oninput = loadBooks;
  availFilter.onchange = loadBooks;

  loadPupils().then(loadBooks);
});
