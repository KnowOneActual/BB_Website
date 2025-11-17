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