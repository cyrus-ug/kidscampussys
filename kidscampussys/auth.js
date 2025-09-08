const form = document.getElementById('loginForm');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    username: form.username.value.trim(),
    password: form.password.value
  };

  // Simple validation
  if (!data.username || !data.password) {
    return alert('Both fields are required.');
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    window.location.href = '/dashboard.html';
  } catch (err) {
    alert(err.message);
  }
});
