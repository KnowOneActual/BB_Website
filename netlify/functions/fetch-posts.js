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
      headers: {
        // This custom User-Agent is required to bypass Cloudflare's bot detection,
        // which was blocking the function from fetching the RSS feed.
        // A corresponding "Skip" rule is configured in Cloudflare's Security Rules.
        // This is the unique identifier or "secret handshake"
        'User-Agent': 'Beau-Bremer-Website-Blog-Fetcher/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
    }

    const xmlData = await response.text();
    const feed = await parser.parseString(xmlData);

    const posts = feed.items.slice(0, 3).map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      snippet: item.contentSnippet ? item.contentSnippet.substring(0, 150) + '...' : '',
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
      body: JSON.stringify({ error: 'Failed to fetch or parse blog posts.' }),
    };
  }
};
