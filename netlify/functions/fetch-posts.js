// /netlify/functions/fetch-posts.js
const Parser = require('rss-parser');
const fetch = require('node-fetch');

const parser = new Parser();

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const BLOG_RSS_URL = 'https://blog.beaubremer.com/feed/feed.xml';

  try {
    const response = await fetch(BLOG_RSS_URL, {
      // Add a browser-like User-Agent header to the request
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`RSS feed fetch failed with status: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
    }

    const xmlData = await response.text();
    const feed = await parser.parseString(xmlData);

    const posts = feed.items.slice(0, 3).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      snippet: item.contentSnippet ? item.contentSnippet.substring(0, 150) + '...' : ''
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(posts),
    };
  } catch (error) {
    console.error('Error in fetch-posts function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch or parse blog posts.',
        details: error.message,
      }),
    };
  }
};