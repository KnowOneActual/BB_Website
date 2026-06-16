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

This is the repository for [beaubremer.com](https://beaubremer.com/), a portfolio site and technical playground showcasing expertise in **Technical Project Management** and **AV/IT Systems**.

## Engineering Standards & Architecture

The codebase prioritizes performance, security, and clean architecture:

*   **Code Quality & Formatting:** ESLint (with security-focused plugins) and Prettier for automated syntax validation and style enforcement.
*   **Hardened Security:** A strict Content Security Policy (CSP) with no `'unsafe-inline'` scripts.
*   **Privacy & Performance:** Self-hosted fonts to eliminate third-party tracking, optimize loading times, and maintain fast tailwind compilations.
*   **Dependency Auditing:** Automated vulnerability scanning via Snyk.

## Implemented Features & Tools

*   **AI Weather Bot:** A serverless Node.js service integrating Google Gemini and OpenWeatherMap for conversational queries.
*   **Weather-Responsive Greeting:** Dynamic Chicago-hardcoded weather integration to make the homepage interactive without tracking visitor locations.
*   **Secure Resume Delivery:** An interactive workflow protecting contact details from scrapers while delivering verified copies.
*   **Network Diagnostics:** Client-side utilities including a Subnet Calculator and Latency Monitor for AV/IT operations.

## Technology Stack

*   **Frontend:** HTML5, CSS3, ES6+ JavaScript, Tailwind CSS, Chart.js.
*   **Backend & Serverless:** Netlify Functions (Node.js), Firebase Firestore.
*   **Services:** Cloudflare WAF/DNS, Google Gemini API, Resend.

## Project Documentation

*   **[Design Rationale](docs/DESIGN_NOTES.md):** Details on color systems, typography choices, and professional branding guidelines.
*   **[Security Log](securitylog.md):** Audit record of security hardening actions and configurations.
*   **[Labs (Experimental)](https://beaubremer.com/labs.html):** Creative coding and interactive visual experiments.
*   **[Tor Onion Service Mirror](https://github.com/KnowOneActual/BB_Website/tree/onion-version):** Minimalist, privacy-focused mirror for the Tor network.

---

## Contact & Links

*   **LinkedIn:** [/in/beau-bremer-chicago](https://www.linkedin.com/in/beau-bremer-chicago/)
*   **Blog:** [blog.beaubremer.com](https://blog.beaubremer.com/)
*   **Contact Form:** [beaubremer.com/#contact](https://beaubremer.com/#contact)
*   **PGP Public Key:** [beaubremer.com/BeauBremer-pgp-key.asc](https://beaubremer.com/BeauBremer-pgp-key.asc)
