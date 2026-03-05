// /netlify/functions/weather.js
// This Netlify function handles weather queries using OpenWeatherMap and Gemini AI.
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const { WEATHER_API_KEY } = process.env;

  // --- GET Request: Simple Chicago Greeting ---
  if (event.httpMethod === 'GET') {
    try {
      if (!WEATHER_API_KEY) throw new Error('Weather API key not configured.');

      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=${WEATHER_API_KEY}&units=metric`;
      const response = await fetch(weatherApiUrl);
      const data = await response.json();

      const condition = data.weather[0].main;
      const temp = Math.round(data.main.temp);

      // Get the current day of the week in Chicago time
      const dayName = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: 'America/Chicago',
      }).format(new Date());

      const greetings = {
        Clear: `Enjoying the clear Chicago skies this ${dayName}`,
        Clouds: `Navigating a cloudy ${dayName} in Chicago`,
        Rain: `Escaping the Chicago rain this ${dayName}`,
        Drizzle: `In the midst of a Chicago drizzle this ${dayName}`,
        Thunderstorm: `Watching the storms roll through Chicago this ${dayName}`,
        Snow: `Embracing the Chicago winter this ${dayName}`,
        Mist: `Lost in the Chicago fog this ${dayName}`,
        Smoke: `A hazy ${dayName} in Chicago`,
        Haze: `A hazy ${dayName} in Chicago`,
        Dust: `A dusty ${dayName} in Chicago`,
        Fog: `Lost in the Chicago fog this ${dayName}`,
        Sand: `A sandy ${dayName} in Chicago`,
        Ash: `An ashy ${dayName} in Chicago`,
        Squall: `Braving the Chicago squalls this ${dayName}`,
        Tornado: `Taking cover in Chicago this ${dayName}!`,
      };

      // eslint-disable-next-line security/detect-object-injection
      const greeting = greetings[condition] || 'Currently in Chicago';

      return {
        statusCode: 200,
        body: JSON.stringify({ greeting: `${greeting} • ${temp}°C` }),
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
  }

  // --- POST Request: Gemini AI Weather Bot ---
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userQuery } = JSON.parse(event.body);

    // --- Get API keys from secure environment variables ---
    const { WEATHER_API_KEY, GEMINI_API_KEY } = process.env;

    if (!WEATHER_API_KEY || !GEMINI_API_KEY) {
      throw new Error('API keys are not configured on the server.');
    }

    // --- Helper function to call Gemini API ---
    const callGemini = async (prompt) => {
      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const payload = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        console.error('Gemini API Error:', errorBody);
        throw new Error(errorBody?.error?.message || response.statusText);
      }
      const result = await response.json();
      return result?.candidates?.[0]?.content?.parts?.[0]?.text.trim();
    };

    // 1. Get city from user query
    const cityPrompt = `From the user query, extract only the city or location. If none, respond "N/A". Query: "${userQuery}"`;
    const city = await callGemini(cityPrompt);

    if (city === 'N/A' || !city) {
      throw new Error("I'm sorry, I couldn't identify a city in your request. Could you please rephrase it?");
    }

    // 2. Get weather data for the city
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const weatherResponse = await fetch(weatherApiUrl);
    if (!weatherResponse.ok) {
      if (weatherResponse.status === 404)
        throw new Error(`I couldn't find a city named "${city}". Please check the spelling.`);
      throw new Error(`Weather API error: ${weatherResponse.statusText}`);
    }
    const weatherDataRaw = await weatherResponse.json();
    const weatherData = {
      city: weatherDataRaw.name,
      country: weatherDataRaw.sys.country,
      temperature_celsius: weatherDataRaw.main.temp,
      feels_like_celsius: weatherDataRaw.main.feels_like,
      condition: weatherDataRaw.weather[0].main,
      description: weatherDataRaw.weather[0].description,
      humidity_percent: weatherDataRaw.main.humidity,
      wind_speed_mps: weatherDataRaw.wind.speed,
    };

    // 3. Get the final AI analysis
    const analysisPrompt = `You are a friendly and helpful weather bot. A user asked: "${userQuery}". The current weather data is: ${JSON.stringify(weatherData)}. 
      
      All data provided to you is in metric units (Celsius, meters per second).
      
      Provide a conversational, one-paragraph response. Be natural and helpful. In your response, ALWAYS provide both metric and US standard (imperial) units for all relevant measurements.
      - For temperature, show Celsius (°C) first, then Fahrenheit (°F) in parentheses. Formula: (Celsius * 9/5) + 32.
      - For wind speed, show miles per hour (mph) first, then meters per second (m/s) in parentheses. Formula: (m/s * 2.237).
      
      Example response format for Chicago: "The weather in Chicago is currently 15°C (59°F)... with winds of 11.2 mph (5 m/s)."`;

    const botResponse = await callGemini(analysisPrompt);

    // --- Return the successful response to the frontend ---
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: botResponse }),
    };
  } catch (error) {
    console.error('Netlify Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'An internal server error occurred.' }),
    };
  }
};
