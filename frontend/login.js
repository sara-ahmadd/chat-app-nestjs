document.getElementById('sendOtp').addEventListener('click', async () => {
  const phone = document.getElementById('phone').value;
  const res = await fetch('http://localhost:3000/auth/request-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (res.ok) {
    document.getElementById('otpSection').style.display = 'block';
  }
});

document.getElementById('verifyOtp').addEventListener('click', async () => {
  const phone = document.getElementById('phone').value;
  const otp = document.getElementById('otp').value;
  const res = await fetch('http://localhost:3000/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('token', data.token);
    window.location.href = 'chat.html';
  } else {
    alert('Wrong OTP');
  }
});
