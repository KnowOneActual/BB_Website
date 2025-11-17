## 2025-11-17 - Website Security Hardening

Ran a routine security scan using Nuclei and resolved several low-to-medium severity findings.

### Changes Implemented

* **Disabled Deprecated TLS Versions**
    * **Action:** Set the "Minimum TLS Version" in the Cloudflare dashboard to **TLS 1.2**.
    * **Reason:** The scan detected that the server still accepted insecure TLS 1.0 and TLS 1.1 protocols. This change resolves `deprecated-tls` and `weak-cipher-suites` findings.

* **Added HTTP Security Headers**
    * **Action:** Added two new headers to the `[[headers]]` section in the `netlify.toml` file.
    * **Reason:** The scan flagged several missing headers. These two were added to improve security and resolve the findings:
        * `cross-origin-resource-policy = "same-origin"`
        * `x-permitted-cross-domain-policies = "none"`

### Deliberate Exclusions (Findings Ignored)

* **Missing Subresource Integrity (SRI)**
    * **Reason:** The scanner flagged dynamic scripts from `challenges.cloudflare.com` (Turnstile) and `fonts.googleapis.com`. SRI hashes cannot be used for dynamic, third-party scripts, so this finding was ignored as expected.

* **Missing `cross-origin-embedder-policy` (COEP)**
    * **Reason:** This header is known to be restrictive and can break third-party embeds. It was left out to avoid breaking site functionality.

* **Missing `clear-site-data`**
    * **Reason:** This header is not a standard security header for all pages. It's a utility header used for specific actions (like logout), so the "missing" finding was ignored.