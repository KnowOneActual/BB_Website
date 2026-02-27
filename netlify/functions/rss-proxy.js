/**
 * RSS Proxy Service
 * * Purpose: This function acts as a "Tunnel" for the GitHub Action that updates
 * my profile README. GitHub's IPs are often blocked by Cloudflare, so this
 * function (running on Netlify) fetches the feed using the authorized
 * User-Agent and passes the data back to GitHub.
 */

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  // The feed we want to fetch
  const FEED_URL = 'https://blog.beaubremer.com/feed/feed.xml';
  // Use environment variable for secret UA, fallback for local dev
  const SECRET_UA = process.env.RSS_SECRET_UA || 'Beau-Bremer-Website-Blog-Fetcher/1.0';

  try {
    // Fetch the feed using the secret User-Agent
    const response = await fetch(FEED_URL, {
      headers: { 'User-Agent': SECRET_UA },
    });

    if (!response.ok) {
      return { statusCode: response.status, body: `Error fetching feed: ${response.statusText}` };
    }

    const data = await response.text();

    // Return the raw XML to whoever asked for it
    return {
      statusCode: 200,
      body: data,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
