# Development & Maintenance Log

This log tracks significant development sessions, architectural decisions, and troubleshooting sessions to provide context for future maintenance.

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
    2.  **Engagement:** Encourages a direct conversation with potential recruiters/collaborators.
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
*End of Log Entry*
