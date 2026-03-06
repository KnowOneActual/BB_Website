# GEMINI.md - Beau Bremer Website Project Context

This file provides essential context for Gemini CLI when working on the Beau Bremer personal website and technical playground.

## Project Overview
- **Purpose:** Personal portfolio, technical showcase, and experimental "digital home" for Beau Bremer.
- **Role:** Professional showcase for a Technical Project Manager & AV/IT Systems Specialist.
- **Core Philosophies:** 
    - **Security-First:** Hardened CSP, no `unsafe-inline` scripts, automated security scanning (Snyk).
    - **Privacy-Conscious:** Self-hosted fonts, Chicago-hardcoded weather to avoid visitor tracking.
    - **Clean & Professional:** Modern "Indigo/Gray" aesthetic, high readability, and performance-oriented.
- **Primary Stack:** HTML5, CSS3 (Tailwind CSS), ES6+ JavaScript, Netlify Functions (Node.js).

## Architecture & Structure
- **Frontend:** Static HTML files in the root (`index.html`, `labs.html`, `links.html`, `toolbag.html`, etc.).
- **Styles:** Tailwind CSS with a custom configuration (`tailwind.config.js`). Source in `src/input.css`, compiled to `style.css`.
- **Client Logic:** Located in `js/`.
    - `script.js`: Main UI logic, form handling, and blog post fetching.
    - `weather-greeting.js`: Chicago-based hero greeting.
    - `weather-bot.js`: Interaction logic for the AI Weather Bot.
    - Specialized tools: `IP_Subnet_Calculator.js`, `network_latency_monitor.js`, etc.
- **Serverless Functions:** Located in `netlify/functions/`.
    - `weather.js`: Handles weather queries via OpenWeatherMap and Google Gemini AI (2.5 Flash).
    - `firebase-config.js`: Securely serves Firebase configuration to the client using environment variables.
    - `fetch-posts.js`: Proxy for fetching external blog content.
- **Data:** JSON files in `data/` for social links and other dynamic content.
- **Tests:** Jest tests located in `__tests__/`.

## Key Commands
### Development & Build
- **Install Dependencies:** `npm install`
- **Build CSS (Tailwind):** `npm run build:css` (Use `build:css:silent` for less output).
- **Local Development:** `npx netlify dev` (Starts local server with functions support).
- **Update Browserslist:** `npm run update-browsers`

### Quality Control
- **Linting:** `npm run lint` (ESLint with security-focused rules).
- **Formatting:** `npm run format` (Prettier).
- **Testing:** `npm test` (Runs Jest).
- **Coverage:** `npm run test:coverage`

## Development Conventions
- **Styling:** Follow the established "Indigo/Gray" theme (`gray-950` backgrounds, `indigo-400/600` accents). Use Tailwind utility classes primarily.
- **JavaScript:** Use modern ES6+ features. Prefer vanilla JS over frameworks where possible for the main site.
- **Security:** Always consider Content Security Policy (CSP) when adding new external resources. Use `eslint-plugin-security` to catch potential vulnerabilities.
- **AI & Firebase Integration:** The project uses Google Gemini (`gemini-2.5-flash`) and Firebase. All sensitive API keys and configurations are handled via serverless functions (Netlify Functions) to prevent exposure on the client-side.
- **Unit Testing:** New UI components or complex logic should include Jest tests in `__tests__/`.

## Troubleshooting & Notes
- **Netlify Functions:** Local development requires `netlify-cli`. Ensure environment variables (`WEATHER_API_KEY`, `GEMINI_API_KEY`) are set for functions to work.
- **CSS Issues:** If new Tailwind classes aren't appearing, ensure they are within the scanned file paths defined in `tailwind.config.js`.
- **Formatting:** Prettier is strict about trailing slashes in HTML void elements and lowercase doctypes. Avoid fighting the tools.

---
*Last Updated: March 2026*
