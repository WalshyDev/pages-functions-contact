document.getElementById('submit').addEventListener('click', async (e) => {
  e.preventDefault();

  console.log(document.getElementById('hcaptcha'))

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const captcha = hcaptcha.getResponse();

  if (name.trim() === '' || message.trim() === '' && captcha.trim() === '') {
    document.getElementById('error').innerText = 'Please enter your name and message!'
  }

  const res = await fetch('/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      message,
      captcha,
    }),
  });

  // It was sent successfully :)
  if (res.status === 200) {
    // Reset fields
    name.value = '';
    message.value = '';
    hcaptcha.reset();

    document.getElementById('error').innerText = 'Sent!';
  } else {
    const response = await res.text();
    document.getElementById('error').innerText = response;
  }
})