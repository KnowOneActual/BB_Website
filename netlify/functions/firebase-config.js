// /netlify/functions/firebase-config.js
// This function returns the Firebase configuration for the client-side,
// retrieving sensitive information from environment variables.

exports.handler = async function (_event, _context) {
  const { 
    FIREBASE_API_KEY, 
    FIREBASE_AUTH_DOMAIN, 
    FIREBASE_PROJECT_ID, 
    FIREBASE_STORAGE_BUCKET, 
    FIREBASE_MESSAGING_SENDER_ID, 
    FIREBASE_APP_ID, 
    FIREBASE_MEASUREMENT_ID 
  } = process.env;

  // Check if critical variables are missing
  if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) {
    console.error('Missing Firebase environment variables.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Firebase configuration is incomplete on the server. Please check environment variables.' }),
    };
  }

  const config = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID,
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config),
  };
};
