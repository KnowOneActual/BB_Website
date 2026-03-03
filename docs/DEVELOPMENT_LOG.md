# Development & Maintenance Log

This log tracks significant development sessions, architectural decisions, and troubleshooting sessions to provide context for future maintenance.

## Session: 2026-03-01 - Content Security & Privacy Hardening

### 1. Font Self-Hosting Implementation
*   **Issue:** Console logs identified Firefox "Fingerprinting Protection" was blocking third-party font requests (Roboto).
*   **Root Cause:** Firefox Enhanced Tracking Protection (ETP) limits third-party font calls.
*   **Solution:** 
    1.  Downloaded the used font files (Inter, Poppins, Roboto, Space Grotesk) to `assets/fonts/`.
    2.  Created `fonts.css` with `@font-face` rules.
    3.  Updated all 16 HTML files to use local fonts and removed Google Fonts references.
*   **Rationale:** Improves privacy, ensures consistent visual rendering across strict privacy browsers, and eliminates third-party dependencies.

### 2. Script Externalization & CSP Strengthening
*   **Action:** Moved remaining inline scripts from `my_ip.html`, `trends.html`, `speed_test.html`, `IP_Subnet_Calculator.html`, `qip.html`, `network_latency_monitor.html`, and `toolbag.html` to dedicated `.js` files.
*   **Reasoning:** 
    1.  Allows for cleaner HTML structure.
    2.  Enables better browser caching for script assets.
    3.  Critical step for disabling `'unsafe-inline'` in the Content Security Policy.
*   **Security Outcome:** Removed `'unsafe-inline'` from `script-src` in `netlify.toml`, significantly hardening the site against XSS.

### 3. Dynamic Weather Greeting Integration
*   **Feature:** Implemented a real-time, personalized greeting on the homepage based on Chicago's weather conditions.
*   **Implementation:** 
    1.  Updated `netlify/functions/weather.js` to handle `GET` requests for simple Chicago weather data.
    2.  Added logic to map weather "conditions" (Clear, Rain, etc.) to friendly strings (e.g., "Enjoying the clear Chicago skies").
    3.  Created `js/weather-greeting.js` to fetch this data and render it in the hero section with a fade-in animation.
    4.  Included dual-unit support (Celsius and Fahrenheit) for international and local visitors.

### 4. Static Analysis & Code Quality (ESLint)
*   **Action:** Integrated **ESLint** with the `eslint-plugin-security` plugin.
*   **Reasoning:** To provide automated, real-time bug detection and security scanning similar to the Ruff tool in the Python ecosystem.
*   **Fixes:** 
    1.  Resolved 11+ warnings including unused variables in tests and Netlify functions.
    2.  Audited and verified "Object Injection Sinks" in data-driven components (Subnet Calculator, Toolbag).
    3.  Configured modern flat-file configuration (`eslint.config.mjs`) with Prettier compatibility.

### 5. Log Review & Cloudflare Analysis
*   **Audit:** Analyzed HAR and console logs in `temp_log/`.
*   **Findings:** Confirmed that most remaining CSP errors and "skipped feature" warnings are internal to Cloudflare's Turnstile widget and are not indicative of local code issues.

---
## Session: 2026-02-27 - Refactor Cleanup & Security Audit

### 1. UI/UX & Tailwind Troubleshooting
*   **Issue:** Accent colors (`indigo-400`) and hover states were missing on dynamically rendered elements (Blog posts, Daily Links).
*   **Root Cause:** 
    1.  The `tailwind.config.js` `content` array was too narrow, excluding the `/js` and `/netlify/functions` directories.
    2.  The `group` class was missing from parent containers of elements using `group-hover`.
*   **Solution:** Expanded Tailwind content scanning and programmatically added `group` classes to dynamic elements in `js/script.js` and `js/daily-links.js`.
*   **Lesson Learned:** Always include all directories containing strings of CSS classes in the Tailwind configuration to prevent purging.

### 2. Privacy & Lead Generation
*   **Decision:** Replaced the direct download of `Beau_Bremer_Resume.pdf` with an interactive request system.
*   **Workflow:** Clicking "Request Latest Resume" pre-fills the contact form with a request message and scrolls the user to the form.
*   **Rationale:** 
    1.  **PII Protection:** Prevents automated scrapers from harvesting phone numbers/emails from the PDF.
    *   **Engagement:** Encourages a direct conversation with potential collaborators.
    3.  **Document Control:** Ensures the recipient always gets the most up-to-date version.

### 3. Security Audit & Dependency Management
*   **Audit:** Ran `npm audit` following Dependabot alerts.
*   **Reorganization:** Moved `netlify-cli` from `dependencies` to `devDependencies`.
*   **Rationale:** Build-time tools (like CLIs) should not be scoped as production dependencies. This reduces the "noise" in production security scans and correctly identifies that vulnerabilities in these tools are low-risk to the live site.
*   **Updates:** Maintained major version stability while updating `node-fetch`, `tailwindcss`, and `prettier` to their latest minor/patch versions.

### 4. Data Integrity
*   **Action:** Restored 35+ links to the `Daily Links Hub` that were lost during the initial refactor.
*   **Technical Note:** Migrated from a flat JSON array to a nested `category -> links` structure to support the new UI organization.

---
## Session: 2026-03-03 - Security Workflow Enhancement & SARIF Integration

### 1. GitHub Security Tab Integration (SARIF)
*   **Action:** Updated `.github/workflows/security.yml` to enable SARIF output for **Semgrep**.
*   **Implementation:** 
    1.  Added `generateSarif: "1"` to the Semgrep scan step.
    2.  Configured separate `github/codeql-action/upload-sarif` steps for both **Trivy** and **Semgrep**.
    3.  Utilized `category` tags (`trivy`, `semgrep`) to ensure distinct reporting within the GitHub Security dashboard.
*   **Rationale:** Centralizes security findings (vulnerabilities and code smells) directly into the GitHub UI, making them easier to track and resolve without leaving the repository.

### 2. Multi-Engine Security Strategy
*   **Decision:** Retained both `snyk.yml` and the updated `security.yml`.
*   **Reasoning:** 
    1.  **Snyk:** Provides deep dependency analysis and excellent secret scanning.
    2.  **Trivy/Semgrep:** Offers fast, native GitHub integration for filesystem and static code analysis.
    3.  **Redundancy:** Running multiple engines reduces "blind spots" and ensures higher confidence in the site's security posture.

---
*End of Log Entry*
