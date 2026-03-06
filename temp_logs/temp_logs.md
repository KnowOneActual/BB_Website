
## [RESOLVED] - 2026-03-05
The issues identified above have been addressed:
- **Hardcoded Secret (js/weather-bot.js)**: Resolved by removing hardcoded Firebase config and implementing a secure serverless fetch pattern via `netlify/functions/firebase-config.js`.
- **Button Accessibility (weather.html)**: Resolved by adding `title` and `aria-label` attributes to the close modal button.
