// This is our new Netlify Function that will handle form submissions.

// The 'handler' function is the main entry point.
exports.handler = async (event) => {
    // 1. We only want to handle POST requests (when the form is submitted)
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  
    // 2. Parse the form data and the Turnstile token from the request
    const body = new URLSearchParams(event.body);
    const name = body.get('name');
    const email = body.get('email');
    const message = body.get('message');
    const token = body.get('cf-turnstile-response'); // This is the Turnstile token
    const ip = event.headers['client-ip']; // The user's IP address
  
    // 3. Get the Secret Key we stored in Netlify's settings
    const secret = process.env.TURNSTILE_SECRET_KEY;
  
    // 4. Send a request to Cloudflare to verify the token
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
  
    // 5. Check if the verification was successful
    if (data.success) {
      // The user is human!
      // For now, we'll just log the message to your Netlify function logs.
      // You can see these logs in your Netlify dashboard under "Functions".
      console.log('Turnstile success! Form submission:', { name, email, message });
  
      // Return a success response to the browser
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Form submitted successfully!' }),
      };
    } else {
      // The user might be a bot.
      // Return an error response to the browser.
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Turnstile verification failed.', details: data['error-codes'] }),
      };
    }
  };