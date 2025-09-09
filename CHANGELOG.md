
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-09

This is the inaugural entry for the changelog, summarizing the major features and improvements made to the website up to this point.

### Added

* **Conversational Weather Bot:** An interactive bot using Google's Gemini API for natural language processing and the OpenWeatherMap API for live data, with chat history stored in Firebase Firestore.
* **AV IP Subnet Calculator:** A utility for AV technicians to plan on-site networks by mapping devices to IP addresses.
* **Network Diagnostic Tools:** A suite of client-side tools including a Network Latency Monitor and a Network Speed Test.
* **Data Visualization Project:** An interactive infographic built with Chart.js to demonstrate dynamic data presentation.
* **Site Technology & Security Report Page:** A dedicated page to document the technologies and security practices used on the site.
* **Creative Resource Library:** A curated collection of tools and resources for creative and technical work.
* **`security.txt` File:** Implemented a `security.txt` file to provide a clear channel for vulnerability reporting.

### Changed

* **Security Headers:** Implemented a comprehensive `_headers` file for Netlify, defining a strong Content-Security-Policy (CSP) and other security headers like `X-Frame-Options` and `Permissions-Policy` to enhance site security.
* **Code Refactoring:** Moved all inline JavaScript and CSS into dedicated external files (`script.js`, `style.css`), improving security by removing `'unsafe-inline'` from the CSP for custom code.
* **Performance Optimization:** Removed an unnecessary 4.1 MB text file that was being loaded on every page visit, significantly improving page load times.
* **Accessibility:** Addressed color contrast issues in the footer and implemented the `<main>` HTML5 semantic tag for better structure and accessibility.

### Fixed

* **Favicon Reliability:** Updated the favicon link to a standard `.ico` file, resolving a console error and ensuring it loads reliably.

---

