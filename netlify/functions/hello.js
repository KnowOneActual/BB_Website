exports.handler = async (event) => {
  console.log('[Function Log] Starting function execution.');

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (secret) {
      console.log('[Function Log] Secret key FOUND.');
    } else {
      console.error('[Function Log] Secret key NOT FOUND. Make sure TURNSTILE_SECRET_KEY is set in the Netlify UI.');
    }

    const body = new URLSearchParams(event.body);
    const token = body.get('cf-turnstile-response');
    console.log(`[Function Log] Received Turnstile token: ${token ? 'yes' : 'no'}`);

    const cloudflareResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: secret,
        response: token,
        remoteip: event.headers['client-ip'],
      }),
    });

    const data = await cloudflareResponse.json();
    console.log('[Function Log] Response from Cloudflare:', data);

    let responseObject;
    if (data.success) {
      responseObject = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Form submitted successfully!' }),
      };
    } else {
      responseObject = {
        statusCode: 400,
        body: JSON.stringify({ error: 'Turnstile verification failed.', details: data['error-codes'] }),
      };
    }

    console.log('[Function Log] Returning this object to the browser:', responseObject);
    return responseObject;

  } catch (error) {
    console.error('[Function Log] A critical error occurred:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred.' }),
    };
  }
};