// /netlify/functions/fetch-posts.js
const Parser = require('rss-parser');
const fetch = require('node-fetch'); // Using node-fetch, which is proven to work in your environment

const parser = new Parser();

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const BLOG_RSS_URL = 'https://blog.beaubremer.com/feed/feed.xml';

  try {
    // Use the node-fetch library to get the RSS feed
    const response = await fetch(BLOG_RSS_URL); 

    if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
    }
    
    // Get the response as text, since the parser expects an XML string
    const xmlData = await response.text(); 

    if (!xmlData) {
        throw new Error('No data received from RSS feed URL.');
    }
    
    const feed = await parser.parseString(xmlData);

    if (!feed || !feed.items || !Array.isArray(feed.items)) {
      console.error('Parsed feed is missing or does not have an "items" array:', feed);
      throw new Error('Parsed feed is not in the expected format.');
    }

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
    console.error('Error in fetch-posts function:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch or parse blog posts.',
        details: error.message,
      }),
    };
  }
};