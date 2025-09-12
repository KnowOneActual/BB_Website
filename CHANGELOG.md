
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## **[1.3.0] - 2025-09-12**


### **Added**



* A build process for Tailwind CSS using its CLI to generate an optimized, production-ready stylesheet from the project's source files.
* A script to package.json (npm run build:css) to execute the Tailwind CSS build process.
* A script to package.json (npm run update-browsers) to update the browser compatibility database.


### **Changed**



* Removed the Tailwind CSS CDN script from all HTML files in favor of a locally generated style.css file.
* Updated netlify.toml to run the npm run build:css command on every deploy, automating the optimization process.
* Refined the tailwind.config.js to be more specific about which files to scan, improving build performance.


### **Improved**



* Site performance by significantly reducing the final CSS file size for production builds.


## **[1.2.0] - 2025-09-11**


### **Added**



* Integrated Snyk's free GitHub Action to automatically scan for dependency vulnerabilities on every push and pull request to the main branch.
* Created a .github/workflows/snyk.yml file to configure the automated security scans.


### **Security**



* Added SNYK_TOKEN as a secret to the GitHub repository to allow the Snyk action to report to the Snyk dashboard.


## **[1.1.1] - 2025-09-11**


### **Security**



* Fixed a "Allocation of Resources Without Limits or Throttling" vulnerability in axios reported by Snyk.
* Added maxContentLength and maxBodyLength limits to all axios requests in the Netlify functions (fetch-posts.js, weather.js) to prevent potential Denial of Service (DoS) attacks.
* Updated the weather.js function to use axios for consistency and to apply the security fix.


## **[1.1.0] - 2025-09-10**


### **Added**



* A "Recent Blog Posts" section to the homepage that dynamically fetches and displays the latest posts from the blog.beaubremer.com RSS feed.
* A new Netlify serverless function (fetch-posts.js) to parse the RSS feed and return it as JSON.
* The rss-parser dependency to handle XML parsing in the new serverless function.


### **Fixed**



* Resolved a series of issues in the fetch-posts.js function and script.js to correctly fetch, parse, and render blog posts.


## **[1.0.0] - 2025-09-09**

This is the inaugural entry for the changelog, summarizing the major features and improvements made to the website up to this point.


### **Added**



* Conversational Weather Bot using Google's Gemini API, OpenWeatherMap API, and Firebase Firestore.
* AV IP Subnet Calculator for on-site network planning.
* Network Diagnostic Tools including a Latency Monitor and Speed Test.
* Data Visualization Project using Chart.js.
* Site Technology & Security Report Page.
* Creative Resource Library with tools and guides.
* security.txt file for vulnerability reporting.


### **Changed**



* Implemented a strong Content-Security-Policy (CSP) and other security headers via a _headers file for Netlify.
* Refactored all inline JavaScript and CSS into external files for improved security and maintainability.
* Optimized site performance by removing a 4.1 MB unnecessary payload.
* Improved accessibility by fixing color contrast issues and using semantic HTML.


### **Fixed**



* Corrected a console error related to the favicon by updating it to a standard .ico file.