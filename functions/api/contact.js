export async function onRequestPost(ctx) {
  try {
    return await handleRequest(ctx);
  } catch(e) {
    return new Response(`${e.message}\n${e.stack}`, { status: 500 }); 
  }
}

async function handleRequest({ request, env }) {
  const data = await request.formData();

  // Grab the form fields
  const name = data.get('name');
  const message = data.get('message');
  const captcha = data.get('h-captcha-response');

  // Validate the JSON
  if (!name || !message || !captcha) {
    return new Response('Make sure the fields are set!', { status: 400 });
  }

  if (false) {
    return new Response(JSON.stringify({ env, }), { status: 500 });
  }

  // Validate the captcha
  const captchaVerified = await verifyHcaptcha(
    captcha,
    request.headers.get('cf-connecting-ip'),
    env.HCAPTCHA_SECRET,
    env.HCAPTCHA_SITE_KEY
  );
  if (!captchaVerified) {
    return new Response('Invalid captcha! >:(', { status: 400 });
  }

  // Send message :)
  // Just remove the comment from whichever one you want
  await sendDiscordMessage(name, message, env.DISCORD_WEBHOOK_URL);
  // await sendEmailWithSendGrid();

  return new Response('Thanks for contacting me! :)');
}

// Make sure to set the "HCAPTCHA_SECRET" & "HCAPTCHA_SITE_KEY" variable
// Refer to <> for help
// ---
// This function is responsible for verifying our captcha. This is used to prevent spam because spam sucks!
async function verifyHcaptcha(response, ip, secret, siteKey) {
  const res = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `response=${response}&remoteip=${ip}&secret=${secret}&sitekey=${siteKey}`
  });

  const json = await res.json();
  console.log(json);
  return json.success;
}

// Make sure to set the "DISCORD_WEBHOOK_URL" variable
// Refer to <> for help
// ---
// This function will send a Discord message to the supplied webhook URL
async function sendDiscordMessage(name, message, webhookUrl) {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'Website Contact Form',
      embeds: [{
        title: 'New Message',
        type: 'rich',
        fields: [
          {
            name: 'Name',
            value: name,
          },
          {
            name: 'Message',
            value: message,
          }
        ]
      }]
    }),
  });
}

// Make sure to set the "DISCORD_WEBHOOK_URL" variable
// Refer to <> for help
// ---
// This function will send an email through SendGrid
async function sendEmailWithSendGrid(details) {
  // TODO
} 