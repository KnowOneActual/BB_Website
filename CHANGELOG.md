# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.3] - 2025-10-09

### Security

- Fixed multiple DOM-based Cross-site Scripting (XSS) vulnerabilities by refactoring JavaScript to build DOM elements programmatically instead of using `innerHTML`. This affects:
    - The blog post section on `index.html` (via `script.js`).
    - The test history table in `speed_test.html`.
    - The endpoint monitoring table in `network_latency_monitor.html`.

### Fixed

- Resolved an accessibility warning in `network_latency_monitor.html` by adding a `<label>` to the monitoring interval slider.
- Removed a redundant inline style from `speed_test.html` to resolve a linter warning and improve code quality.

## [1.5.2] - 2025-10-09

### Added

- A new `uses.html` page to showcase hardware, software, and services.
- A "My Tooling Philosophy" section to the `uses.html` page to provide context for technology choices.
- A "Live Production" category to the `uses.html` page to highlight skills in AV and live events.
- A link on the `index.html` page to the new `uses.html` page.

### Improved

- The `uses.html` page is now fully data-driven, fetching content from a new `data/uses.json` file.
- Refactored all JavaScript for the "Uses" page into a separate `uses.js` file for better code organization.
- Enhanced the introductory text on the `uses.html` page to be more professional and engaging.
- Grouped the "Live Production" tools into categories to improve readability and scannability.

### Security

- Fixed a DOM-based XSS vulnerability in `uses.js` by refactoring the code to create DOM elements directly instead of using `innerHTML`.
- Resolved multiple "disown-opener" linter warnings by adding `rel="noopener noreferrer"` to all links opening in a new tab across `index.html` and `uses.html`.

## [1.5.1] - 2025-10-01

### Fix

- Replaced axios with node-fetch in `fetch-posts.js`

- Resolved an issue where the "Recent Blog Posts" section failed to load due to Cloudflare's bot detection blocking the Netlify serverless function.
- The `fetch-posts.js` function was updated to send a custom `User-Agent` string, acting as a unique identifier.
- A corresponding Security Rule was added to Cloudflare to `Skip` bot protection measures when requests with the specific `User-Agent` are detected, allowing the function to access the RSS feed successfully.

## Fixed

The BlueSky icon didn't display until I updated to AwesomeFonts 6.7.2. \<link rel="stylesheet" href="[https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css)"\> Then update to version 7.0.0.

## [1.5.0] - 2025-09-13

### Added

- A `links.beaubremer.com` subdomain to provide a direct, shareable URL for the Links page.
- A domain-level redirect rule to the `_redirects` file to route traffic from the new subdomain to the `/links` page.

### Improved

- User experience by providing a short, memorable URL for a key landing page.

### Fixed

- An issue where the initial domain-level redirect was not being applied. The rule in `_redirects` was updated with a wildcard (`*`) and a force flag (`!`) to ensure it is always processed correctly.

## [1.4.0] - 2025-09-12

### Added

- A skeleton loader to the "Recent Blog Posts" section to provide a visual placeholder while content is being fetched.
- Empty and error state messages to the blog section to gracefully handle cases where posts cannot be loaded or the feed is empty.

### Improved

- The user experience is improved by providing clear visual feedback during the data fetching process for the blog section.

### Fixed

- A JavaScript syntax error that was preventing the site from rendering correctly.

## [1.3.0] - 2025-09-12

### Added

- A build process for Tailwind CSS using its CLI to generate an optimized, production-ready stylesheet.
- A script in package.json (npm run build:css) to execute the Tailwind CSS build process.
- A script to package.json (npm run update-browsers) to update the browser compatibility database.

### Changed

- Removed the Tailwind CSS CDN script from all HTML files in favor of a locally generated style.css file.
- Updated Netlify. toml to run the npm run build:css command on every deploy.
- Refined the tailwind.config.js to be more specific, improving build performance.

### Improved

- Site performance by significantly reducing the final CSS file size.

## [1.2.0] - 2025-09-11

### Added

- Integrated Snyk's free GitHub Action to automatically scan for dependency vulnerabilities.
- Created a .github/workflows/snyk.yml file to configure the automated security scans.

### Security

- Added SNYK\_TOKEN as a secret to the GitHub repository to allow the Snyk action to report to the Snyk dashboard.

## [1.1.1] - 2025-09-11

### Security

- Fixed a "Allocation of Resources Without Limits or Throttling" vulnerability in axios.
- Added maxContentLength and maxBodyLength limits to all axios requests in the Netlify functions to prevent potential Denial of Service (DoS) attacks.
- Updated the weather.js function to use axios for consistency and to apply the security fix.

## [1.1.0] - 2025-09-10

### Added

- A "Recent Blog Posts" section on the homepage that dynamically fetches posts from an RSS feed.
- A new Netlify serverless function (fetch-posts.js) to parse the RSS feed.
- The RSS-parser dependency to handle XML parsing.

### Fixed

- Resolved a series of issues in the fetch-posts.js function and script.js to fetch, parse, and render blog posts correctly.

## [1.0.0] - 2025-09-09

This is the inaugural entry for the changelog, summarizing the significant features and improvements made to the website up to this point.

### Added

- Conversational Weather Bot using Google's Gemini API, OpenWeatherMap API, and Firebase Firestore.
- AV IP Subnet Calculator for on-site network planning.
- Network Diagnostic Tools, including a Latency Monitor and Speed Test.
- Data Visualization Project using Chart.js.
- Site Technology & Security Report Page.
- Creative Resource Library with tools and guides.
- security.txt file for vulnerability reporting.

### Changed

- Implemented a strong Content-Security-Policy (CSP) and other security headers via a \_headers file for Netlify.
- Refactored all inline JavaScript and CSS into external files.
- Optimized site performance by removing a 4.1 MB unnecessary payload.
- Improved accessibility by fixing color contrast issues and using semantic HTML.

### Fixed

- Corrected a console error related to the favicon by updating it to a standard .ico file.