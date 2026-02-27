# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2026-02-27

### Added
- **The Labs (Experimental Gallery):** Created a new `labs.html` page to showcase experimental projects, creative coding (JS Piano), and advanced data visualizations (Trends Infographic) that are not on the main index.
- **Interactive Resume Request:** Replaced the direct resume download link with a privacy-focused interactive workflow that pre-fills the contact form with a request message.
- **Sticky Navigation Bar:** A new fixed header was added to improve site navigation and provide easy access to key sections and social links.
- **LinkedIn Profile:** Added a link to the LinkedIn profile in the navigation bar.
- **Dedicated Toolbag Page:** Created a new `toolbag.html` page to provide a more detailed and focused view of the tech stack.
- **New Project Added:** Added the "Network Triage Tool" to the "Other Tools & Utilities" section to highlight practical Python and TUI development skills.
- **Design Rationale Document:** Created `docs/DESIGN_NOTES.md` to document the design philosophy behind this redesign for future reference.
- **System Metadata Badge:** Added a subtle technical badge to the footer showing build info and update frequency for professional transparency.

### Changed
- **Site-Wide Visual Redesign:** Completed the overhaul of *all* sub-pages (Tools, Utilities, Privacy, etc.) from the legacy Fuchsia theme to the professional Indigo/Gray color scheme.
- **Repository Reorganization:** Moved core JavaScript files (`script.js`, `links.js`, `daily-links.js`) into a dedicated `/js` directory for a cleaner project root.
- **Hero Section:** Redesigned the hero section with a clearer professional title and an optimized CSS-animated gradient.
- **About Me Section:** Streamlined the "About Me" section and added a scannable "Core Skills" grid.
- **Project Narratives:** Refined project descriptions on the home page to be more result-oriented and impactful for hiring managers.
- **Tailwind Optimization:** Refined `tailwind.config.js` to target specific files, reducing build times from >40s to <1s.

### Fixed
- **IP Information Restoration:** Fixed broken IP lookup functionality on `my_ip.html` and `qip.html` by switching to `ipapi.co` (HTTPS-compatible) and updating data field mappings.
- **Data Expansion:** Restored and expanded "System Identity" data points on `my_ip.html`, including ASN, network blocks, regional infrastructure (currency, calling codes), and a live geographic map. Added more technical browser specs (platform, hardware concurrency).
- **Accent Color Restoration:** Fixed an issue where the `indigo-400` accent color was missing by expanding the Tailwind `content` configuration and adding missing `group` classes for hover states.
- **Footer Readability:** Improved text contrast in the footer for better accessibility on dark backgrounds.
- **Design Consistency:** Resolved remaining instances of `slate` and `fuchsia` classes across the entire codebase, ensuring a unified professional aesthetic.
- **Daily Links Data Structure:** Fixed a mismatch between the JSON data structure and the rendering logic in `daily-links.js`.

### Removed
- Removed the "Toolbag" section from the main `index.html` page, replacing it with a link to the new dedicated page.
- Cleaned up root directory by removing legacy signature files (moved to `docs/signatures/`) and temporary development files (`temp.txt`, `TEST_README.md`).
- Deleted the old `toolbag.js` and `hello.js` files.

## [1.6.4] - 2026-02-19

### Changed
- Updated `glob` to v12.0.0 to address known security vulnerabilities (CVE-2025-64756)
- Updated `netlify-cli` to latest version
- Removed `--minify` flag from default CSS build to ensure test compatibility
- Added new `build:css:minify` script for production builds requiring minification

### Fixed
- Resolved EBADPLATFORM errors during npm install caused by optional platform-specific dependencies
- Fixed corrupted `package-lock.json` that was blocking Netlify deployments
- Regenerated dependency tree to resolve `path-scurry` version conflicts
- Fixed CSS build process to maintain readable output for Jest test parsing

### Security
- Addressed 3 vulnerabilities via `npm audit fix`: ajv (ReDoS), qs (DoS), and tar (file extraction)
- Reduced total audit warnings from 36 to 33 (remaining are dev-only minimatch ReDoS issues)

### Improved
- Cleaned up npm dependency tree, reducing package count from 1624 to 1498
- Updated browserslist database (caniuse-lite) to latest version
- Improved deployment reliability on Netlify build servers

## [1.6.3] - 2025-11-22

### Added
- **RSS Proxy Function:** Created `netlify/functions/rss-proxy.js`. This serverless function acts as a trusted tunnel, fetching the blog's RSS feed using the authorized User-Agent and serving it back as XML.
- **Workflow Integration:** This proxy enables the GitHub Profile README workflow to fetch blog posts without triggering Cloudflare's WAF/Bot protection.

## [1.6.2] - 2025-11-21

### Improved
- **Developer Experience:** Integrated Prettier locally to ensure consistent code formatting across environments.
- **Code Organization:** Added `prettier-plugin-tailwindcss` to automatically sort Tailwind utility classes, keeping HTML templates cleaner and more readable.
- **Workflow:** Added `npm run format` and `npm run format:check` scripts to `package.json` to allow for quick, project-wide formatting.

### Changed
- Updated `.prettierrc` configuration, increasing `printWidth` from 80 to 120 to prevent excessive line-wrapping in HTML files.


## [1.6.1 ] - 2025-11-17


### Security Hardening
* Disabled insecure TLS 1.0 and 1.1 protocols. All connections now require a minimum of TLS 1.2.
* Added `cross-origin-resource-policy` and `x-permitted-cross-domain-policies` HTTP headers to further secure site responses.
* Addes enhances the Snyk workflow through Snyk Code scanning via synk.yaml. 

## [1.6.0] - 2025-11-15

### Added
- Privacy Policy page

### Changed
- Updated Sitemap.xml
- Overhauled the hero section background animation.
- Replaced the JavaScript-driven Three.js 3D cube animation with a high-performance, CSS-only animated gradient.
- Layered a subtle noise texture over the hero gradient for a more modern and professional aesthetic.

### Removed
- Removed the Three.js (`three.min.js`) library dependency, significantly reducing initial page load size and improving site performance.
- Removed all related JavaScript functions (`initializeThreeJsAnimation`) and HTML (`<canvas>`) associated with the old animation.
- Removed Cloudflare Web Analytics to resolve the persistent Subresource Integrity (SRI) and CORS errors appearing in the browser console and help align with my overall privacy policy. 

### Fixed
- Fixed an issue where the new hero styles were not deploying to the live site. Styles were moved from the compiled `style.css` file to the source `src/input.css` to ensure they are correctly included in the site's build process.

### Security
- Patched a prototype pollution vulnerability in `js-yaml` (a development dependency) by updating the package to a secure version via `npm audit fix`.

## [1.5.9] - 2025-11-02

### Added
- Created the **Daily Links Hub**, a new internal utility page (`dayl.html`) for fast, universal access to frequently used external resources.
- Introduced a new data structure file: `data/daily-links.json` to store categorized links and metadata.
- Added a dedicated script: `daily-links.js` to fetch and dynamically render links by category and build the card-based interface.
- Included several new essential links in the initial data set, focusing on **AV System Design** and **Networking/Developer Tools**.

### Improved
- **User Experience (UX):** Links are now dynamically grouped by categories (e.g., Development & Web, Networking & Diagnostics) for better scannability and organization.
- **Maintainability:** Converted the initial flat Markdown list into a structured, JSON-based format for easier management and scaling.



[1.5.8] - 2025-10-26

Security

- Patched a DOM-based XSS vulnerability in weather.html. The addMessage function was refactored to securely create elements and use textContent instead of innerHTML when rendering chat messages.

### Fixed

- Resolved linter warnings in weather.html by removing the internal <style> block and all inline style attributes, moving all styling to the external style.css file.


## [1.5.7] - 2025-10-19

### Added
- Created a new "My Toolbag" section on the homepage to better showcase the tools and technologies I use.
- Added three new projects to the "My Projects" section:
    - Python File Encryption Tool
    - Network Triage Tool
    - Python Image Processor
- Added "Feather Icons" to the "Creative Resource Library."

### Changed
- Renamed `uses.html` to `toolbag.html` for a more personal touch.
- Renamed `uses.js` to `toolbag.js` to match the new page name.
- Updated the link in `toolbag.html` to correctly point to `toolbag.js`.
- Curated the "My Projects" section for a more focused portfolio by removing:
    - Simple Password Strength Checker
    - SRI Hash Generator
    - Metadata Remover for Images
    - Ping with Progress Percentage



## [1.5.6] - 2025-10-18

### Fixed

- **Network Monitor Stability:** Resolved an issue in `network_latency_monitor.html` where domain pings (e.g., Google, Yahoo) incorrectly showed a "Down" status. The fix implements a `HEAD` request with a cache-buster (`_cb`) inside a `no-cors` fetch to reliably bypass aggressive browser caching and optimization logic, ensuring accurate network reachability checks.
- **Code Consistency:** Removed a redundant CDN link (`https://cdn.tailwindcss.com`) from `uses.html` to fully commit to a local Tailwind build and maintain a strict Content-Security-Policy.
- **Style Cleanup:** Refactored animation logic in `links.js` to rely on CSS classes and `requestAnimationFrame`, eliminating verbose JavaScript inline styling and `setTimeout` calls for a cleaner, CSS-driven animation.



## [1.5.5] - 2025-10-18

### Added

- A dedicated **"My Tooling Philosophy"** section to `uses.html` to provide clear professional context for tool choices.
- A **Quick Jump (Table of Contents)** navigation bar to `uses.html` for faster access to sections.
- Dynamic Font Awesome icons added to all major section headers on `uses.html` (via `uses.js`) for improved scannability.

### Improved

- All tool descriptions in `data/uses.json` were updated with a stronger narrative, emphasizing AV/IT, FOSS (Free and Open-Source Software), and specialized roles like **deep network troubleshooting** and **Python development**.
- The layout for the **Live Production** section on `uses.html` was adjusted for a tighter, more scannable display of industry-specific tools.

### Fixed

- **CRITICAL SECURITY FIX:** Removed DOM-based XSS vulnerability by switching the injection of externally sourced content (`item.description`) in `uses.js` from the insecure `.innerHTML` to the safe `.textContent`.



## [1.5.4] - 2025-10-09

### Fixed

- Corrected several CSS linting warnings to improve cross-browser compatibility and code quality.
- Added the standard `appearance` property alongside the `-webkit-` prefix for form and search inputs.
- Added the standard `text-size-adjust` property to ensure consistent text rendering on mobile devices.
- Removed a redundant `vertical-align` property that was being ignored by the browser.

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