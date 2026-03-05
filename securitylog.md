## 2026-03-04 - CSP Compliance & AI Quota Optimization

* **Activity:** Resolved Weather Bot initialization hang and optimized AI model selection.
* **Summary:** Externalized the Weather Bot's inline script module to comply with strict Content Security Policy (CSP) headers and switched to the Gemini 1.5 Flash model to stay within free-tier API quotas.

---

### Changes Implemented

* **CSP Compliance (Script Externalization)**
    * **Action:** Moved all weather bot logic from an inline script in `weather.html` to a dedicated external file `js/weather-bot.js`.
    * **Reason:** Strict CSP in `netlify.toml` blocked the inline module. Externalizing the script allows it to run under the whitelisted `gstatic.com` and `self` directives without needing a hash or nonce for every change.
* **AI Model Reliability (Gemini 2.5 Flash)**
    * **Action:** Updated `netlify/functions/weather.js` to target the `gemini-2.5-flash` model.
    * **Reason:** In this 2026 environment, earlier models like 1.5 and 2.0 Flash have been deprecated or moved. Switching to 2.5 Flash ensures stability and compliance with current production endpoints.
* **Proactive Connection Monitoring**
    * **Action:** Added a 10-second connection timeout and granular console logging to the weather bot frontend.
    * **Reason:** Provides immediate feedback to the user if the bot initialization is slow or blocked (e.g., by ad-blockers), improving the overall robust feel of the utility.

## 2026-03-01 - Security & Privacy Hardening (Fonts, Scripts, & Linting)

* **Activity:** Implemented self-hosted fonts, externalized inline scripts, and integrated security-focused linting.
* **Summary:** Migrated from Google Fonts to local hosting, moved all inline scripts to external JS files, and added ESLint with security plugins for deep code analysis.

---

### Changes Implemented

* **Static Analysis & Security Linting**
    * **Action:** Integrated **ESLint** with `eslint-plugin-security`.
    * **Reason:** Provides automated detection of potential security risks (like object injection sinks) and common logic bugs during development.
* **Font Privacy & Fingerprinting Protection**
    * **Action:** Downloaded Inter, Poppins, Roboto, and Space Grotesk font files and hosted them locally from `/assets/fonts/`.
    * **Reason:** Resolves Firefox "Fingerprinting Protection" blocks seen in site logs and eliminates third-party tracking associated with Google Fonts.
* **Script Externalization & Caching**
    * **Action:** Moved all remaining large inline scripts from utility pages (`my_ip.html`, `trends.html`, `speed_test.html`, etc.) to dedicated external `.js` files.
    * **Reason:** Allows for better browser caching, cleaner HTML, and is a prerequisite for removing `'unsafe-inline'` from the CSP.
* **Content Security Policy (CSP) Hardening**
    * **Action:** Updated `netlify.toml` to remove `'unsafe-inline'` from `script-src` and removed all Google Fonts domains (`fonts.googleapis.com`, `fonts.gstatic.com`) from the whitelist.
    * **Reason:** Significantly reduces the site's attack surface against Cross-Site Scripting (XSS) and reduces reliance on third-party infrastructure.

## 2026-02-27 - Security & Accessibility Hardening

* **Activity:** Addressed linting warnings, CSP violations, DOMXSS risks, and hardcoded secrets.
* **Summary:** Fixed `rel="noopener"` security issues, added ARIA labels for accessibility, refactored dynamic HTML to prevent XSS, and migrated secrets to environment variables.

---

### Changes Implemented

* **Tab Security (`rel="noopener"`)**
    * **Action:** Added `rel="noopener noreferrer"` to all external links across `index.html`, `my_ip.html`, `toolbag.html`, and `labs.html`.
    * **Reason:** Mitigates the "Reverse Tab-nabbing" security risk where a malicious linked page can control the original page via `window.opener`.
* **Accessibility Labels (ARIA)**
    * **Action:** Added `aria-label` to icon-only links (GitHub, LinkedIn).
    * **Reason:** Ensures that screen reader users have a clear understanding of the link's destination, satisfying accessibility audits.
* **CSP Header Expansion**
    * **Action:** Updated `netlify.toml` to explicitly allow `https://beaubremer.com` and `https://challenges.cloudflare.com` in `script-src`, `connect-src`, and `img-src`.
    * **Reason:** Prevents the browser from blocking essential Cloudflare security scripts and challenge assets, which were previously flagged as violations.
* **DOMXSS Mitigation**
    * **Action:** Refactored dynamic DOM generation in `toolbag.html` and `IP_Subnet_Calculator.html` to use `textContent` and `createElement` instead of `innerHTML` for dynamic values (`item.name`, `item.description`).
    * **Reason:** Eliminates the possibility of cross-site scripting (XSS) from potentially compromised or manipulated data files.
* **Secret Hardening**
    * **Action:** Updated `netlify/functions/rss-proxy.js` to use `process.env.RSS_SECRET_UA` for its authorized User-Agent.
    * **Reason:** Resolves Snyk security findings regarding hardcoded non-cryptographic secrets and follows best practices for credential management.
* **CSP Compliance (No Inline Styles)**
    * **Action:** Moved inline animation styles from `weather.html` to `style.css` using custom classes (`.dot`, `.dot-2`, `.dot-3`).
    * **Reason:** Facilitates a stricter CSP by removing the need for `'unsafe-inline'` styles where possible and satisfies `webhint` linting rules.

## 2026-02-27 - Routine Dependency Audit & Reorganization

* **Activity:** Investigated 14 vulnerabilities reported by GitHub Dependabot and ran `npm audit`.
* **Summary:** Updated top-level dependencies, moved development tools to `devDependencies`, and verified that remaining issues are contained within build-time tools.

---

### Actions Taken

* **Dependency Updates**
    * **Action:** Updated `node-fetch` to `^2.7.0`, `tailwindcss` to `^3.4.19`, and `prettier` to `^3.8.1`.
    * **Reason:** General maintenance and ensuring the project uses the most stable versions within current major branches.
* **Package Reorganization**
    * **Action:** Moved `netlify-cli` from `dependencies` to `devDependencies`.
    * **Reason:** `netlify-cli` is a build-time and deployment tool, not required for the production runtime of the website. This properly scopes the package and its associated vulnerabilities.
* **Vulnerability Assessment**
    * **Finding:** Remaining vulnerabilities (ajv, minimatch, qs, rollup, tar) are all sub-dependencies of `netlify-cli`.
    * **Risk Assessment:** Low. These tools run only during the build and deployment phase on trusted CI/CD environments (Netlify) or local developer machines. They pose no direct risk to the live website or its users.
    * **Resolution:** Standard `npm audit fix` cannot resolve these as they are bundled within `netlify-cli`. Will monitor for future updates to the `netlify-cli` package.

## 2026-02-27 - Privacy & Accessibility Hardening

* **Activity:** Implemented resume protection and improved site contrast.
* **Summary:** Replaced direct PDF downloads with an interactive request system and updated UI contrast for better accessibility.

---

### Changes Implemented

* **Interactive Resume Request (PII Protection)**
    * **Action:** Removed `Beau_Bremer_Resume.pdf` direct link and implemented a JS-driven pre-fill contact form workflow.
    * **Reason:** Reduces the exposure of Personal Identifiable Information (PII) to automated web scrapers and ensures the document is only shared with interested human parties.
* **Footer Contrast Improvement**
    * **Action:** Updated footer text from `text-gray-500` to `text-gray-400`.
    * **Reason:** Improved readability and accessibility on the `gray-950` background.
* **Tailwind Config Hardening**
    * **Action:** Expanded `content` array in `tailwind.config.js` to include all nested JS directories.
    * **Reason:** Ensures critical security-related UI classes (like error states or tooltips) are not purged during the build process.

## 2025-11-22 - Infrastructure Update (RSS Proxy)

* **Activity:** Implemented a serverless proxy for RSS feed consumption.
* **Summary:** Created a Netlify function (`rss-proxy.js`) to allow the GitHub Actions bot to retrieve blog posts for the profile README.

---

### Architecture & Risk Assessment

* **Implementation Details**
    * The function acts as a middleware. It accepts a request from GitHub, fetches the feed from `blog.beaubremer.com` using the authorized "Secret Handshake" User-Agent, and returns the XML.
    * **Risk Level:** Low.
* **Security Controls**
    * **Method Restriction:** The function hard-rejects any request that is not a `GET` request (returns 405).
    * **Hardcoded Target:** The function can *only* fetch the specific blog feed URL; it cannot be manipulated to fetch arbitrary URLs (preventing SSRF attacks).
    * **User-Agent Control:** It utilizes the existing Cloudflare allowlist rule for the `Beau-Bremer-Website-Blog-Fetcher` User-Agent.


## 2025-11-17 - Website Security Hardening & Review

* **Activity:** Ran a routine security review using multiple external scanners.
* **Tools Used:** Nuclei, Mozilla Observatory, securityheaders.com
* **Summary:** Scanned the live site and resolved several low-to-medium severity findings by hardening TLS configurations and adding new security headers.

---

### Changes Implemented

* **Disabled Deprecated TLS Versions**
    * **Action:** Set the "Minimum TLS Version" in the Cloudflare dashboard to **TLS 1.2**.
    * **Reason:** Scans detected that the server still accepted insecure TLS 1.0 and TLS 1.1 protocols. This resolves `deprecated-tls` and `weak-cipher-suites` findings.

* **Added HTTP Security Headers**
    * **Action:** Added two new headers to the `[[headers]]` section in the `netlify.toml` file.
    * **Reason:** Scans flagged several missing headers. These two were added to improve security:
        * `cross-origin-resource-policy = "same-origin"`
        * `x-permitted-cross-domain-policies = "none"`

---

### Deliberate Exclusions (Findings Ignored)

* **Missing Subresource Integrity (SRI)**
    * **Reason:** Scanners flagged dynamic scripts from `challenges.cloudflare.com` (Turnstile) and `fonts.googleapis.com`. SRI hashes cannot be used for dynamic, third-party scripts, as the file content changes, which would break the site. This finding was ignored as expected.

* **Missing `cross-origin-embedder-policy` (COEP)**
    * **Reason:** This header is known to be restrictive and can break third-party embeds. It was left out to avoid breaking site functionality.

* **Missing `clear-site-data`**
    * **Reason:** This header is not a standard security header for all pages. It's a utility header used for specific actions (like logout), so the "missing" finding was ignored.

 ### Routine Dependency Audit

    Activity: Performed a routine dependency audit using npm audit.

    Tools Used: npm audit

Findings & Analysis

    Finding: The audit reported 12 vulnerabilities (7 high, 5 low) in packages like glob, fast-redact, and tmp.

    Analysis: All 12 vulnerabilities are transitive dependencies (dependencies of a dependency) and trace back to the netlify-cli package.

    Action Taken: Ran npm audit fix --force which was unable to resolve the issues. Also ran npm update netlify-cli to ensure the latest version was installed. The vulnerabilities persist in the latest version.

Conclusion & Risk Assessment

    Risk: The netlify-cli package is a build-time tool. These vulnerabilities do not affect the production runtime of the deployed website and pose no direct risk to end-users.

    Resolution: The fix must be implemented by the netlify-cli maintainers. Because the risk is low and contained to the local build environment, no further action can be taken. This finding is acknowledged and will be monitored for future package updates.