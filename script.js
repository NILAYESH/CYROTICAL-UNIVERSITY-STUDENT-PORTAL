// script.js

// Wait until DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('login-container');
  const registerContainer = document.getElementById('register-container');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const loginError = document.getElementById('login-error');
  const regError = document.getElementById('reg-error');
  const forgotSimple = document.getElementById('forgot-simple');
  const googleBtn = document.getElementById('google-btn');

  // Auth on index.html
  if (loginContainer) {
    showLoginScreen();
    showRegister.addEventListener('click', showRegisterScreen);
    showLogin.addEventListener('click', showLoginScreen);

    registerBtn.addEventListener('click', () => {
      const user = document.getElementById('reg-user').value.trim();
      const pass = document.getElementById('reg-pass').value;
      const confirm = document.getElementById('reg-confirm').value;
      const question = document.getElementById('reg-question').value.trim();
      const answer = document.getElementById('reg-answer').value.trim();
      if (!user || !pass || !question || !answer) {
        regError.textContent = 'All fields are required';
        regError.style.display = 'block';
        return;
      }
      if (pass !== confirm) {
        regError.textContent = 'Passwords do not match';
        regError.style.display = 'block';
        return;
      }
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.user === user)) {
        regError.textContent = 'Username already exists';
        regError.style.display = 'block';
        return;
      }
      users.push({ user, pass, question, answer });
      localStorage.setItem('users', JSON.stringify(users));
      regError.style.display = 'none';
      alert('Registration successful! Please log in.');
      showLoginScreen();
    });

    loginBtn.addEventListener('click', () => {
      const user = document.getElementById('login-user').value.trim();
      const pass = document.getElementById('login-pass').value;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.user === user && u.pass === pass)) {
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('currentUser', user);
        window.location.href = 'dashboard.html';
      } else {
        loginError.style.display = 'block';
      }
    });

    forgotSimple.addEventListener('click', () => {
      const user = prompt('Enter your username:');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find(u => u.user === user);
      if (found) {
        alert('Your password is: ' + found.pass);
      } else {
        alert('Username not found');
      }
    });

    googleBtn.addEventListener('click', () => {
      sessionStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('currentUser', 'demo@google.com');
      window.location.href = 'dashboard.html';
    });

    function showLoginScreen() {
      loginContainer.style.display = 'flex';
      registerContainer.style.display = 'none';
      loginError.style.display = 'none';
    }
    function showRegisterScreen() {
      loginContainer.style.display = 'none';
      registerContainer.style.display = 'flex';
      regError.style.display = 'none';
    }
  }

  // CRUD on dashboard.html
  if (window.location.pathname.endsWith('dashboard.html')) {
    if (!sessionStorage.getItem('loggedIn')) {
      window.location.href = 'index.html';
      return;
    }
    const logoutBtn = document.getElementById('logout-btn');
    const addBtn = document.getElementById('add-record-btn');
    const saveBtn = document.getElementById('save-btn');
    const modalBg = document.getElementById('modal-bg');
    const grid = document.getElementById('records-grid');
    const nameInput = document.getElementById('stu-name');
    const rollInput = document.getElementById('stu-roll');
    const deptInput = document.getElementById('stu-dept');
    let editIndex = null;

    logoutBtn.addEventListener('click', () => {
      sessionStorage.clear();
      window.location.href = 'index.html';
    });
    addBtn.addEventListener('click', () => openModal('Add Student'));
    saveBtn.addEventListener('click', saveRecord);
    modalBg.addEventListener('click', e => {
      if (e.target === modalBg) closeModal();
    });

    function openModal(mode, idx) {
      editIndex = idx;
      document.getElementById('modal-title').textContent = mode;
      if (mode === 'Edit Student') {
        const rec = fetchRecords()[idx];
        nameInput.value = rec.name;
        rollInput.value = rec.roll;
        deptInput.value = rec.dept;
      } else {
        nameInput.value = rollInput.value = deptInput.value = '';
      }
      modalBg.classList.add('show');
    }
    function closeModal() {
      modalBg.classList.remove('show');
    }
    function fetchRecords() {
      return JSON.parse(localStorage.getItem('students') || '[]');
    }
    function saveRecord() {
      const recs = fetchRecords();
      const rec = { name: nameInput.value, roll: rollInput.value, dept: deptInput.value };
      if (editIndex === null) recs.push(rec);
      else recs[editIndex] = rec;
      localStorage.setItem('students', JSON.stringify(recs));
      closeModal();
      loadRecords();
    }
    window.editRecord = function(i) { openModal('Edit Student', i); }
    window.deleteRecord = function(i) {
      const recs = fetchRecords();
      recs.splice(i, 1);
      localStorage.setItem('students', JSON.stringify(recs));
      loadRecords();
    }
    function loadRecords() {
      grid.innerHTML = '';
      fetchRecords().forEach((r, i) => {
        const card = document.createElement('div');
        card.className = 'glass card';
        card.innerHTML = `
          <h3>${r.name}</h3>
          <p>Roll No.: ${r.roll}</p>
          <p>Department: ${r.dept}</p>
          <button class="action-btn" onclick="editRecord(${i})">Edit</button>
          <button class="action-btn" style="right:6rem;" onclick="deleteRecord(${i})">Delete</button>
        `;
        grid.appendChild(card);
      });
    }
    loadRecords();
  }
});
