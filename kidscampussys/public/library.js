// In attachHandlers(), add:
document.querySelectorAll('.history').forEach(btn =>
  btn.addEventListener('click', showHistory)
);

// In showHistory(), inside each history row:
history.forEach(h => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${h.pupilName}</td>
    <td>${new Date(h.checkedOut).toLocaleDateString()}</td>
    <td>${h.returned ? new Date(h.returned).toLocaleDateString() : '—'}</td>
    <td>${h.overdue ? 'Overdue' : 'OK'}</td>
    <td>
      ${h.returned
        ? ''
        : `<button class="return-btn" data-id="${h.checkoutId}">Return</button>`
      }
    </td>`;
  historyTbody.append(tr);
});

// After rendering rows, attach return handlers:
historyTbody.querySelectorAll('.return-btn').forEach(btn =>
  btn.addEventListener('click', async () => {
    await fetch('/api/library/return', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      credentials: 'include',
      body: JSON.stringify({ checkoutId: btn.dataset.id })
    });
    // Refresh history and main table
    showHistory({ target: { dataset: { id: currentBookId } } });
    loadBooks();
  })
);
