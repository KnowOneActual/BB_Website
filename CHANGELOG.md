# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.1.0] - 2025-09-11


### Added



* **Recent Blog Posts Section:** Integrated the latest posts from the external blog (blog.beaubremer.com) onto the main page. This is powered by a new Netlify serverless function (fetch-posts.js) that fetches and parses the blog's RSS feed.
* **New Dependencies:** Added axios and rss-parser to package.json to support the new blog integration feature.


### Changed



* Updated the main script.js to include logic for fetching and dynamically displaying the recent blog posts.
* Refined the main DOMContentLoaded event listener to orchestrate all page-load functionalities, including the new blog post fetch.


## [1.0.0] - 2025-09-09

This was the first entry for the changelog, summarizing the major features and improvements made to the website up to that point.


### Added



* **Conversational Weather Bot:** An interactive bot using Google's Gemini API for natural language processing and the OpenWeatherMap API for live data, with chat history stored in Firebase Firestore.
* **AV IP Subnet Calculator:** A utility for AV technicians to plan on-site networks by mapping devices to IP addresses.
* **Network Diagnostic Tools:** A suite of client-side tools including a Network Latency Monitor and a Network Speed Test.
* **Data Visualization Project:** An interactive infographic built with Chart.js to demonstrate dynamic data presentation.
* **Site Technology & Security Report Page:** A dedicated page to document the technologies and security practices used on the site.
* **Creative Resource Library:** A curated collection of tools and resources for creative and technical work.
* **security.txt File:** Implemented a security.txt file to provide a clear channel for vulnerability reporting.


### Changed



* **Security Headers:** Implemented a comprehensive _headers file for Netlify, defining a strong Content-Security-Policy (CSP) and other security headers.
* **Code Refactoring:** Moved all inline JavaScript and CSS into dedicated external files (script.js, style.css), improving security.
* **Performance Optimization:** Removed an unnecessary 4.1 MB text file that was being loaded on every page visit, significantly improving page load times.
* **Accessibility:** Addressed color contrast issues in the footer and implemented the &lt;main> HTML5 semantic tag for better structure.


### Fixed



* **Favicon Reliability:** Updated the favicon link to a standard .ico file, resolving a console error and ensuring it loads reliably.