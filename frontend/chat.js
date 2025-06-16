const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

const socket = io('http://localhost:3000', {
  auth: { token },
});

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('users', (users) => {
  const list = document.getElementById('userList');
  list.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user.phone || 'User';
    list.appendChild(li);
  });
});

socket.on('message', (msg) => {
  const chatBox = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.textContent = msg.text;
  chatBox.appendChild(div);
});

document.getElementById('sendBtn').addEventListener('click', () => {
  const input = document.getElementById('messageInput');
  const text = input.value;
  socket.emit('message', { text });
  input.value = '';
});
