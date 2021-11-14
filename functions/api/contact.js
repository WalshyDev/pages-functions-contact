export async function onRequestPost({ request, env }) {
  let obj;
  try {
    obj = await request.json();
  } catch(e) {
    return new Response('Invalid JSON body!');
  }

  // Validate the JSON
  if (!obj.name || !obj.message || !obj.captcha) {
    return new Response('Invalid body', { status: 400 });
  }

  // Validate the captcha
  const captchaVerified = await verifyHcaptcha(
    obj.captcha,
    request.headers.get('cf-connecting-ip'),
    env.HCAPTCHA_SECRET,
    env.HCAPTCHA_SITE_KEY
  );
  if (!captchaVerified) {
    return new Response('Invalid captcha', { status: 400 });
  }

  // Send message :)
  // Just remove the comment from whichever one you want
  await sendDiscordMessage(obj, env.DISCORD_WEBHOOK_URL);
  // await sendEmailWithSendGrid();

  return new Response();
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
  return json.success;
}

// Make sure to set the "DISCORD_WEBHOOK_URL" variable
// Refer to <> for help
// ---
// This function will send a Discord message to the supplied webhook URL
async function sendDiscordMessage(details, webhookUrl) {
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
            value: details.name,
          },
          {
            name: 'Message',
            value: details.message,
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