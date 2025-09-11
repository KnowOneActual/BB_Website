// /netlify/functions/fetch-posts.js
const Parser = require('rss-parser');
const axios = require('axios');

const parser = new Parser();

exports.handler = async function (event) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const BLOG_RSS_URL = 'https://blog.beaubremer.com/feed/feed.xml';

  try {
    // First, fetch the RSS feed as plain text using axios
    const response = await axios.get(BLOG_RSS_URL, { responseType: 'text' });
    
    // Then, parse that text into a structured object
    const feed = await parser.parseString(response.data);

    // Now, process the parsed feed to get the posts
    const posts = feed.items.slice(0, 3).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      snippet: item.contentSnippet ? item.contentSnippet.substring(0, 150) + '...' : ''
    }));

    // Finally, return the posts as a JSON string
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(posts),
    };
  } catch (error) {
    // If anything goes wrong, log the error and return a helpful message
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