## 2026-02-27 - Security & Accessibility Hardening

* **Activity:** Addressed linting warnings and CSP violations.
* **Summary:** Fixed `rel="noopener"` security issues, added ARIA labels for accessibility, and updated CSP headers to prevent Cloudflare asset blocks.

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