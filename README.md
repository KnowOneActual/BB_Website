<p align="center">
  <img src="img/readme/BB_logo_green.webp" alt="Beau Bremer Logo" width="150">
</p>

# Beau Bremer's Personal Website & Technical Playground

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
[![Netlify Status](https://api.netlify.com/api/v1/badges/80028065-01f6-4f67-9922-c62f7feb32b7/deploy-status)](https://app.netlify.com/projects/bb-main-site/deploys)
![Security](https://img.shields.io/badge/Security-Policy-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Repository for [beaubremer.com](https://beaubremer.com/), a static personal site, IT/AV toolset, and serverless playground. The project serves as an operational showcase for a Technical Project Manager and AV/IT Field Engineer.

## Core Technical Architecture

Built around client-side performance, data privacy, and minimal external dependencies:

*   **Asset Self-Hosting:** Web fonts, stylesheets, and scripts are stored and served locally to block third-party tracking networks, eliminate external DNS lookups, and guarantee rapid rendering.
*   **Hardened Security Headers:** Configured via [netlify.toml](file:///Users/userx/websites/bb_main/BB_Website/netlify.toml) with a strict Content Security Policy (CSP) that completely bans inline script execution.
*   **Dependency Resolution & Audits:** Code is scanned using Snyk. Transitive dependencies are pinned using `package.json` overrides to address upstream CVEs (such as security patches for `qs`, `ws`, and `multiparty`).
*   **Static Linters:** Strictly formatted using Prettier and linted with ESLint using `eslint-plugin-security` rules.

## Integrated Services & Tools

*   **AI Weather Bot:** Netlify serverless functions proxy user weather queries to the Google Gemini (`gemini-2.5-flash`) API and OpenWeatherMap, avoiding public API key exposure.
*   **Location-Safe Greeting:** Client-side greeting panel fallback configured specifically for Chicago. Prevents visitor geo-tracking by keeping API key validation and location mapping on the backend.
*   **Scrape-Resistant Resume Flow:** Secure download logic prevents automated crawlers from harvesting email addresses and phone numbers.
*   **Network Diagnostics:** In-browser tools including a visual IPv4 Subnet Calculator and a network Latency Monitor (WebSocket-based) for field troubleshooting.
*   **Daily Links Hub:** Interactive dashboard ([dayl.html](file:///Users/userx/websites/bb_main/BB_Website/dayl.html)) featuring live search, instant keyboard shortcuts, category filtering, and client-side caching.

## Tech Stack

*   **Frontend:** Semantic HTML5, ES6+ JavaScript, Tailwind CSS, Chart.js.
*   **Backend / Serverless:** Netlify Functions (Node.js 20+ runtime), Firebase Firestore.
*   **Third-Party APIs:** Cloudflare DNS, Google Gemini API, Resend Email API, OpenWeatherMap.

## Testing & Quality Control

The project uses Jest for unit and integration testing. Tests reside in the [__tests__/](file:///Users/userx/websites/bb_main/BB_Website/__tests__) directory:

*   [daily-links.test.js](file:///Users/userx/websites/bb_main/BB_Website/__tests__/daily-links.test.js): Verifies JSON payload parsing, live search matching, DOM rendering, and security sanitization.
*   [hero-background.test.js](file:///Users/userx/websites/bb_main/BB_Website/__tests__/hero-background.test.js): Confirms the migration of the hero canvas backdrop from Three.js to GPU-accelerated CSS animations.

Run the test suite:
```bash
npm test
```

Generate a coverage report:
```bash
npm run test:coverage
```

## Local Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Local Dev Server & Emulator:**
   Requires the Netlify CLI to run functions:
   ```bash
   npx netlify dev
   ```

3. **Build Tailwind Assets:**
   ```bash
   npm run build:css
   ```

## Documentation

*   **[Design Rationale](file:///Users/userx/websites/bb_main/BB_Website/docs/DESIGN_NOTES.md):** Indigo/gray theme constraints, typography choices, and professional AV/IT branding guidelines.
*   **[Security Log](file:///Users/userx/websites/bb_main/BB_Website/securitylog.md):** Ledger of security hardening, CSP changes, and dependency audits.
*   **[Labs (Experimental)](https://beaubremer.com/labs.html):** Creative coding and browser-based canvas experiments.
*   **[Tor Onion Service Mirror](https://github.com/KnowOneActual/BB_Website/tree/onion-version):** Privacy-hardened version configured for Onion routing.

## Contact

*   **LinkedIn:** [/in/beau-bremer-chicago](https://www.linkedin.com/in/beau-bremer-chicago/)
*   **Blog:** [blog.beaubremer.com](https://blog.beaubremer.com/)
*   **Contact Form:** [beaubremer.com/#contact](https://beaubremer.com/#contact)
*   **PGP Public Key:** [beaubremer.com/BeauBremer-pgp-key.asc](https://beaubremer.com/BeauBremer-pgp-key.asc)
