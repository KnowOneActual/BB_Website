const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const BLOG_RSS_URL = 'https://blog.beaubremer.com/feed/feed.xml';

    try {
        const response = await axios.get(BLOG_RSS_URL, { timeout: 5000 });
        if (response.status !== 200) {
            throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
        }

        const feed = await parser.parseString(response.data);
        if (!feed || !feed.items) {
            throw new Error('Failed to parse RSS feed.');
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
            body: JSON.stringify(posts)
        };
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch blog posts.' })
        };
    }
};