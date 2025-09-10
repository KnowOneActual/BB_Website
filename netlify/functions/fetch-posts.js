// /netlify/functions/fetch-posts.js
const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function (event) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const BLOG_RSS_URL = 'https://blog.beaubremer.com/feed/feed.xml';
  
  try {
    const feed = await parser.parseURL(BLOG_RSS_URL);
    const posts = feed.items.slice(0, 3).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      snippet: item.contentSnippet ? item.contentSnippet.substring(0, 150) + '...' : ''
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', 
      },
      body: JSON.stringify(posts),
    };
  } catch (error) {
    console.error("Error fetching or parsing RSS feed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch blog posts.' }),
    };
  }
};