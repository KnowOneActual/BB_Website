<p align="center">
<img src="img/readme/BB_logo_green.webp" alt=" Beau's Awesome Logo! You are missing out" width="150">
</p>

# Beau Bremer's Personal Website

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
[![Netlify Status](https://api.netlify.com/api/v1/badges/80028065-01f6-4f67-9922-c62f7feb32b7/deploy-status)](https://app.netlify.com/projects/bb-main-site/deploys)
![Security](https://img.shields.io/badge/Security-Policy-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)


Welcome to the GitHub repository for my personal website, [beaubremer.com](https://beaubremer.com/). This is a living project where I experiment with new technologies, build fun tools, and share my work. I handle everything you see here, from the big features to the little details, as a way to continuously learn and grow.

## About The Project

This website serves as a central hub for my professional background in technical project management and AV/IT systems, as well as a showcase for my personal coding projects. I believe in a hands-on approach, and this site is a testament to that philosophy.

Here, you'll find a collection of interactive tools and resources I've built, reflecting my interests in everything from network diagnostics to AI-powered applications.

### Key Features

  * **My Toolkit & Philosophy Page:** A comprehensive breakdown of my professional tool stack (hardware, FOSS software, AV/IT gear) designed with a strong focus on cost-effectiveness, cross-platform use, and problem-solving through tools like Python and network analyzers.
  * **Conversational Weather Bot:** An interactive chatbot that uses Google's Gemini API for natural language processing and the OpenWeatherMap API to provide live weather data. Chat history is stored in Firebase Firestore.
  * **Secure Image Cleaner:** A privacy-first tool hosted on the Tor Onion Service version of the site. It's a server-side utility that strips all EXIF metadata from images, demonstrating a practical application of secure, anonymous web services.
  * **AV IP Subnet Calculator:** A practical tool for AV technicians to plan on-site networks, mapping devices to IP addresses.
  * **Network Diagnostic Tools:** A suite of client-side tools including a **Network Latency Monitor** and a **Network Speed Test** to provide real-time insights into your connection.
  * **Data Visualization Project:** An interactive infographic showcasing industry trends, built with Chart.js to demonstrate dynamic data presentation.
  * **Creative & Technical Library:** A curated collection of resources, including helpful guides like a "Wireshark Quick Start Guide" and a "Simple Guide to Creating Gmail Filters for Spam" available as downloadable PDFs.
 
 
### Tech Stack

This website is built with a focus on modern, efficient, and secure technologies.

  * **Frontend:**
      * HTML5, CSS3, Vanilla JavaScript
      * **Tailwind CSS** for styling
      * **Chart.js** for data visualization
  * **Backend & Hosting:**
      * **Netlify** for hosting and serverless functions
      * **Node.js** for serverless functions
      * **Firebase Firestore** for real-time chat history in the Weather Bot
  * **APIs & Services:**
      * **Google Gemini API** for natural language processing
      * **OpenWeatherMap API** for live weather data
      * **Resend** for secure email delivery from the contact form
      * **Cloudflare Turnstile** for CAPTCHA verification

### Security & Performance Highlights

I take security and performance seriously. Here are some of the measures I've implemented:

  * **Code Quality & Security Hardening:** Refactored multiple DOM manipulation patterns across the site to eliminate potential **DOM-based XSS vulnerabilities** (e.g., switching from `.innerHTML` to `.textContent` for external data). This improves security and maintains strict CSP compliance.
  * **Robust HTTP Security Headers:** A strong Content-Security-Policy (CSP) is in place to prevent XSS and data injection attacks. Other headers like `X-Frame-Options` and `X-Content-Type-Options` are also configured to enhance security.
  * **Responsible Disclosure:** I have a `security.txt` file and a security acknowledgements page to provide a clear channel for reporting vulnerabilities.
  * **Performance Optimization:** I'm mindful of the user experience, which is why I've taken steps like removing a 4.1 MB unnecessary payload, drastically reducing page load times.
  * **Accessibility:** I've addressed color contrast issues and used semantic HTML to ensure the site is accessible to all users.

## Tor Onion Service Version

This repository contains a branch named `onion-version` which hosts a privacy-first, minimalist version of this website. This version is designed to be served as a Tor Onion Service.

### Purpose

The `onion-version` of this site is a learning project and a proof of concept with several key goals:

  * **Privacy-First:** It is intentionally stripped of all JavaScript, third-party trackers, and external API calls to maximize user anonymity.
  * **Lightweight:** By using simple, clean HTML and CSS, the site is fast and efficient, which is ideal for the higher-latency environment of the Tor network.
  * **Self-Contained:** All necessary assets are hosted locally to prevent any data leaks to outside services.
  * **Educational:** It serves as a practical demonstration of how to deploy a secure and anonymous web presence.

### Featured Utility: Secure Image Cleaner

As part of this project, I developed and deployed a **Secure Image Cleaner** that runs exclusively on the Onion Service. This tool allows users to upload an image and download a new version with all identifying EXIF metadata removed. It's a practical demonstration of building a useful, privacy-respecting tool on an anonymous network.

**[Read the project write-up on my blog.](https://blog.beaubremer.com/posts/iimage_cleaner_on_a_tor_onion_service/)**

### Deployment

The onion site is hosted on a Google Cloud "Always Free" `e2-micro` VM. Updates are managed via a simple deployment script on the server (`deploy.sh`) which pulls the latest changes from the `onion-version` branch and copies them to the web root.

### Accessing the Onion Site

You can access the live site using the [Tor Browser via this link](http://wb7kwfl6bygqg4zh2fdk7jk6v2ab3bhmjo63xtdm2nltl33vuwoqlkqd.onion). Please note that this link will only resolve if you are using the Tor Browser. (wb7kwfl6bygqg4zh2fdk7jk6v2ab3bhmjo63xtdm2nltl33vuwoqlkqd.onion)

## External Dependencies

### Cloudflare Security Rule

The "Recent Blog Posts" section relies on a serverless function that fetches an RSS feed from `blog.beaubremer.com`. This domain is protected by Cloudflare's bot detection. A **Security Rule** has been created in the Cloudflare dashboard for `beaubremer.com` to allow requests that contain the `User-Agent` string `Beau-Bremer-Website-Blog-Fetcher`. If this feature breaks, verify that the Cloudflare rule is still active.


## Security Posture

I take the security of this project seriously. My security strategy is built on two key parts:

1.  **Automated Scanning:** This repository is automatically scanned for vulnerable dependencies on every push to the `main` branch using Snyk.
2.  **Periodic Reviews:** I conduct regular security audits of the live site and its dependencies. The findings and actions from these reviews are documented in a public log.

### Security Documentation

* **`SECURITY.md`**: View the official security policy, which includes instructions on how to responsibly disclose a vulnerability.
* **`securitylog.md`**: View the public, time-stamped log of all security audits and hardening actions taken on this site.


## Contact

Have a question, a comment, or just want to say hi? Feel free to reach out via the contact form on my website.
