document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('notificationsForm');
  const msg  = document.getElementById('formMsg');

  // Load children and their settings
  async function loadSettings() {
    const data = await fetch('/api/parent/children-notifications', {
      credentials: 'include'
    }).then(r => r.json());

    data.children.forEach(child => {
      const panel = document.createElement('div');
      panel.className = 'child-panel';
      panel.innerHTML = `
        <div class="child-header">
          <img src="${child.photoUrl || '/assets/avatar.png'}" alt="">
          <h2>${child.fullName}</h2>
        </div>
        <table class="event-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Email</th>
              <th>SMS</th>
              <th>Push</th>
            </tr>
          </thead>
          <tbody>
            ${data.events.map(evt => {
              const s = child.settings[evt.id] || {};
              return `<tr>
                <td>${evt.label}</td>
                <td><input type="checkbox" class="toggle-checkbox"
                           name="${child.id}_${evt.id}_email"
                           ${s.email ? 'checked' : ''}></td>
                <td><input type="checkbox" class="toggle-checkbox"
                           name="${child.id}_${evt.id}_sms"
                           ${s.sms ? 'checked' : ''}></td>
                <td><input type="checkbox" class="toggle-checkbox"
                           name="${child.id}_${evt.id}_push"
                           ${s.push ? 'checked' : ''}></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>`;
      form.insertBefore(panel, form.querySelector('.save-btn'));
    });
  }

  // Submit all preferences in bulk
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.textContent = '';
    const formData = new FormData(form);
    const payload = [];

    // Parse FormData entries: key = "<childId>_<eventId>_<channel>"
    for (let [key, val] of formData.entries()) {
      const [childId, eventId, channel] = key.split('_');
      let entry = payload.find(p => p.childId == childId && p.eventId == eventId);
      if (!entry) {
        entry = { childId, eventId, email: false, sms: false, push: false };
        payload.push(entry);
      }
      entry[channel] = true;
    }

    // Send to server
    try {
      const res = await fetch('/api/parent/children-notifications', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
        body: JSON.stringify({ preferences: payload })
      });
      if (!res.ok) throw new Error('Save failed');
      msg.textContent = 'Settings saved successfully';
    } catch (err) {
      msg.textContent = err.message;
      msg.style.color = '#e74a3b';
    }
  });

  loadSettings();
});
document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('notificationsForm');
  const msg       = document.getElementById('formMsg');
  const resetBtn  = document.getElementById('resetDefaults');

  // Existing loadSettings() and form submit handler…

  // 1. Fetch and apply global settings
  resetBtn.addEventListener('click', async () => {
    msg.textContent = '';
    try {
      // Get global preferences: { email: bool, sms: bool, push: bool }
      const global = await fetch('/api/parent/settings', {
        credentials: 'include'
      }).then(res => res.json());

      // For every checkbox in the form, apply global[channel]
      form.querySelectorAll('.toggle-checkbox').forEach(cb => {
        const channel = cb.name.split('_')[2]; // childId_eventId_channel
        cb.checked = !!global[channel];
      });

      msg.style.color = '#1cc88a';
      msg.textContent = 'All panels reset to global defaults.';
    } catch (err) {
      msg.style.color = '#e74a3b';
      msg.textContent = 'Failed to reset defaults.';
    }
  });

  loadSettings();
});
