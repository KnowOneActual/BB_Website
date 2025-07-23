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

## Contact

Have a question, a comment, or just want to say hi? Feel free to reach out via the contact form on my website.
