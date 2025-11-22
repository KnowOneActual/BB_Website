const fetch = require('node-fetch');

exports.handler = async function (event) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const BLOG_RSS_URL = 'https://blog.beaubremer.com/feed/feed.xml';

  try {
    // Use your "Secret Handshake" User-Agent that is already whitelisted
    const response = await fetch(BLOG_RSS_URL, {
      headers: {
        'User-Agent': 'Beau-Bremer-Website-Blog-Fetcher/1.0',
      },
    });

    if (!response.ok) {
      return { statusCode: response.status, body: `Error: ${response.statusText}` };
    }

    // Get the raw XML text
    const xmlData = await response.text();

    // Return it directly as XML
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      },
      body: xmlData,
    };
  } catch (error) {
    console.error('Proxy Error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
