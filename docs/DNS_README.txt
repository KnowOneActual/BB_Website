# DNS CONFIGURATION & NOTES
# Last Updated: 2025-12-23
# Domain: beaubremer.com

========================================================================
1. MAIN EMAIL (Personal/Business)
   Provider: Apple iCloud
   Usage: sending/receiving mail via iPhone & Mail.app
========================================================================
- MX Records: mx01.mail.icloud.com, mx02.mail.icloud.com
- TXT Record: "v=spf1 include:icloud.com ~all"
- TXT Record: "apple-domain=..." (Proof of ownership)

>> ACTION: NEVER DELETE. These run your primary email.


========================================================================
2. WEBSITE CONTACT FORM (Automated)
   Provider: Resend (running on Amazon SES)
   Usage: The contact form on beaubremer.com sends emails via API
========================================================================
- MX Record: send.beaubremer.com -> feedback-smtp...amazonses.com
- TXT Record: send.beaubremer.com -> "v=spf1 include:amazonses.com ~all"
- CNAME/TXT: resend._domainkey... (DKIM signature)

>> CRITICAL NOTE: These look like "junk" Amazon records, but they are REQUIRED. 
   If deleted, the contact form on the website will break immediately.
   They are safely isolated to the "send" subdomain.


========================================================================
3. SECURITY (DMARC)
========================================================================
- Record: _dmarc.beaubremer.com
- Value: "v=DMARC1; p=quarantine; sp=reject; rua=..."

>> EXPLANATION:
   p=quarantine  : Sends bad emails from main domain to Spam.
   sp=reject     : BLOCKs bad emails from subdomains.
   
   * Note: The Contact Form (Section 2) still works because it correctly 
     authenticates via the Amazon/Resend records.