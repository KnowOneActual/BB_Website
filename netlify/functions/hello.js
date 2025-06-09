exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const body = new URLSearchParams(event.body);
  const turnstileToken = body.get('cf-turnstile-response');

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: turnstileToken,
        remoteip: event.headers['client-ip'],
      }),
    });

    const cloudflareData = await response.json();

    // IMPORTANT: We are now sending the full Cloudflare response back to the browser for debugging.
    return {
      statusCode: 200, // Always return 200 OK so we can see the body
      body: JSON.stringify(cloudflareData),
    };

  } catch (error) {
    // If a lower-level error happens, send that back too.
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};