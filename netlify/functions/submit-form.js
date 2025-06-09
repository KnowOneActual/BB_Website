exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = new URLSearchParams(event.body);
  const name = body.get('name');
  const email = body.get('email');
  const message = body.get('message');
  const token = body.get('cf-turnstile-response');
  const ip = event.headers['client-ip'];

  const secret = process.env.TURNSTILE_SECRET_KEY;

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: secret,
      response: token,
      remoteip: ip,
    }),
  });

  const data = await response.json();

  if (data.success) {
    console.log('Turnstile success! Form submission:', { name, email, message });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully!' }),
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Turnstile verification failed.', details: data['error-codes'] }),
    };
  }
};
