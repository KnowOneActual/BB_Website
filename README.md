<p align="center">
<img src="img/favicon/favicon_email.svg" alt="alt text" width="200">
</p>

# Beau Bremer's Personal Website

Hello there! Welcome to the GitHub repository for my personal website, [beaubremer.com](https://beaubremer.com). This is a living project where I experiment with new technologies, build fun tools, and share my work. I handle everything you see here, from the big features to the little details, as a way to continuously learn and grow as a tech professional.

## About The Project

This website serves as a central hub for my professional background in technical project management and AV/IT systems, as well as a showcase for my personal coding projects. I believe in a hands-on approach, and this site is a testament to that philosophy.

Here, you'll find a collection of interactive tools and resources I've built, reflecting my interests in everything from network diagnostics to AI-powered applications.

### Key Features

  * **Conversational Weather Bot:** An interactive chatbot that uses Google's Gemini API for natural language processing and the OpenWeatherMap API to provide live weather data. Chat history is stored in Firebase Firestore.
  * **Secure Image Cleaner:** A privacy-first tool hosted on the Tor Onion Service version of the site. It's a server-side utility that strips all EXIF metadata from images, demonstrating a practical application of secure, anonymous web services.
  * **AV IP Subnet Calculator:** A practical tool for AV technicians to plan on-site networks, mapping devices to IP addresses.
  * **Network Diagnostic Tools:** A suite of client-side tools including a **Network Latency Monitor** and a **Network Speed Test** to provide real-time insights into your connection.
  * **Data Visualization Project:** An interactive infographic showcasing industry trends, built with Chart.js to demonstrate dynamic data presentation.
  * **Creative & Technical Library:** A curated collection of resources, including helpful guides like a "Wireshark Quick Start Guide" and a "Simple Guide to Creating Gmail Filters for Spam" available as downloadable PDFs.
  * **Interactive 3D Background:** The hero section of the main page features a 3D animation created with Three.js.

### Tech Stack

This website is built with a focus on modern, efficient, and secure technologies.

  * **Frontend:**
      * HTML5, CSS3, Vanilla JavaScript
      * **Tailwind CSS** for styling
      * **Three.js** for the 3D hero background animation
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

  * **Robust HTTP Security Headers:** A strong Content-Security-Policy (CSP) is in place to prevent XSS and data injection attacks. Other headers like `X-Frame-Options` and `X-Content-Type-Options` are also configured to enhance security.
  * **Responsible Disclosure:** I have a `security.txt` file and a security acknowledgements page to provide a clear channel for reporting vulnerabilities.
  * **Performance Optimization:** I'm mindful of the user experience, which is why I've taken steps like removing a 4.1 MB unnecessary payload, drastically reducing page load times.
  * **Code Quality:** I've refactored the codebase to move all inline JavaScript and CSS into external files, which not only improves security by allowing for a stricter CSP but also enhances maintainability.
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

You can access the live site using the [Tor Browser via this link](https://www.google.com/search?q=http://32fd3d4gq3u4qqpofstaiq3sf3h6tnyrdpqdcgdszbrhovv25yfxzhqd.onion). Please note that this link will only resolve if you are using the Tor Browser. (32fd3d4gq3u4qqpofstaiq3sf3h6tnyrdpqdcgdszbrhovv25yfxzhqd.onion)

## Contact

Have a question, a comment, or just want to say hi? Feel free to reach out via the contact form on my website.ant to say hi? Feel free to reach out via the contact form on my website.
