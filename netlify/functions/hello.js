exports.handler = async (event) => {
  // We only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Get the secret keys from environment variables
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  // Get the form data from the request
  const body = new URLSearchParams(event.body);
  const name = body.get('name');
  const email = body.get('email');
  const message = body.get('message');
  const turnstileToken = body.get('cf-turnstile-response');

  try {
    // 1. VERIFY THE TURNSTILE TOKEN
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
      // If Turnstile verification fails, return an error
      return { statusCode: 400, body: 'Turnstile verification failed.' };
    }

    // 2. SEND THE EMAIL VIA RESEND
    // (This part only runs if Turnstile verification was successful)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Contact Form <noreply@beaubremer.com>', // Must be from your verified domain
        to: 'support@beaubremer.com', // Change this to the email you want to receive notifications at
        subject: `New Message from ${name} on your Website`,
        html: `
          <p>You received a new message from your website's contact form:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      }),
    });

    // 3. RETURN A SUCCESS RESPONSE TO THE BROWSER
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully!' }),
    };

  } catch (error) {
    // Handle any unexpected errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred.' }),
    };
  }
};