
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Fixed

The BlueSky icon didn't display until I updated to AwesomeFonts 6.7.2. <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">



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



* A skeleton loader to the "Recent Blog Posts" section to provide a visual placeholder while content is being fetched.
* Empty and error state messages to the blog section to gracefully handle cases where posts cannot be loaded or the feed is empty.


### Improved



* The user experience is improved by providing clear visual feedback during the data fetching process for the blog section.


### Fixed



* A JavaScript syntax error that was preventing the site from rendering correctly.


## [1.3.0] - 2025-09-12


### Added



* A build process for Tailwind CSS using its CLI to generate an optimized, production-ready stylesheet.
* A script in package.json (npm run build:css) to execute the Tailwind CSS build process.
* A script to package.json (npm run update-browsers) to update the browser compatibility database.


### Changed



* Removed the Tailwind CSS CDN script from all HTML files in favor of a locally generated style.css file.
* Updated Netlify. toml to run the npm run build:css command on every deploy.
* Refined the tailwind.config.js to be more specific, improving build performance.


### Improved



* Site performance by significantly reducing the final CSS file size.


## [1.2.0] - 2025-09-11


### Added



* Integrated Snyk's free GitHub Action to automatically scan for dependency vulnerabilities.
* Created a .github/workflows/snyk.yml file to configure the automated security scans.


### Security



* Added SNYK_TOKEN as a secret to the GitHub repository to allow the Snyk action to report to the Snyk dashboard.


## [1.1.1] - 2025-09-11


### Security



* Fixed a "Allocation of Resources Without Limits or Throttling" vulnerability in axios.
* Added maxContentLength and maxBodyLength limits to all axios requests in the Netlify functions to prevent potential Denial of Service (DoS) attacks.
* Updated the weather.js function to use axios for consistency and to apply the security fix.


## [1.1.0] - 2025-09-10


### Added



* A "Recent Blog Posts" section on the homepage that dynamically fetches posts from an RSS feed.
* A new Netlify serverless function (fetch-posts.js) to parse the RSS feed.
* The RSS-parser dependency to handle XML parsing.


### Fixed



* Resolved a series of issues in the fetch-posts.js function and script.js to fetch, parse, and render blog posts correctly.


## [1.0.0] - 2025-09-09

This is the inaugural entry for the changelog, summarizing the significant features and improvements made to the website up to this point.


### Added



* Conversational Weather Bot using Google's Gemini API, OpenWeatherMap API, and Firebase Firestore.
* AV IP Subnet Calculator for on-site network planning.
* Network Diagnostic Tools, including a Latency Monitor and Speed Test.
* Data Visualization Project using Chart.js.
* Site Technology & Security Report Page.
* Creative Resource Library with tools and guides.
* security.txt file for vulnerability reporting.


### Changed



* Implemented a strong Content-Security-Policy (CSP) and other security headers via a _headers file for Netlify.
* Refactored all inline JavaScript and CSS into external files.
* Optimized site performance by removing a 4.1 MB unnecessary payload.
* Improved accessibility by fixing color contrast issues and using semantic HTML.


### Fixed



* Corrected a console error related to the favicon by updating it to a standard .ico file.