// Final Production Code for hello.js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  const body = new URLSearchParams(event.body);
  const name = body.get('name');
  const email = body.get('email');
  const message = body.get('message');
  const turnstileToken = body.get('cf-turnstile-response');

  try {
    // 1. Verify the Turnstile token
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: turnstileToken,
        remoteip: event.headers['client-ip'],
      }),
    });

    const turnstileData = await turnstileResponse.json();
    if (!turnstileData.success) {
      console.error("Turnstile verification failed:", turnstileData['error-codes']);
      return { statusCode: 400, body: 'CAPTCHA verification failed.' };
    }

    // 2. Send the email via Resend if CAPTCHA was successful
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      // This section is now corrected
      body: JSON.stringify({
        from: 'Contact Form <noreply@beaubremer.com>', 
        to: 'support@beaubremer.com',
        subject: `New Message from ${name} on your Website`,
        html: `
          <p>You received a new message:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      }),
    });

    // 3. Return a success response to the browser
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully!' }),
    };

  } catch (error) {
    console.error("An internal error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Sorry, something went wrong.' }),
    };
  }
};