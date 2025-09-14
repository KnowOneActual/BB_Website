
***

### ## Changelog: September 14, 2025

This update marks the initial deployment and stabilization of the Tor Onion Service for the website, including the launch of the new Secure Image Cleaner application.

### ### New Features

* **Tor Onion Service:** The website is now fully accessible via its own Tor Onion Service, providing enhanced privacy and anonymity for users.
* **Secure Image Cleaner:** A new web application (`cleaner.html`) has been launched. It allows users to upload JPG or PNG images (up to 10 MB) to strip all EXIF metadata, ensuring privacy before sharing.
    * The backend is powered by a Python Flask application using the Pillow library.
    * The application is managed by Gunicorn and runs as a persistent `systemd` service.

### ### Fixes & Improvements

* **Nginx Configuration:**
    * Fixed a persistent "403 Forbidden" error by updating the Nginx configuration to correctly identify `index.html` as the default document.
    * Configured Nginx as a reverse proxy to handle requests for the `/upload` endpoint, directing traffic to the Flask backend.
    * Increased the maximum client body size to `10M` to allow for larger image uploads.
* **Server & Application Stability:**
    * Resolved a "502 Bad Gateway" error by switching the Gunicorn-Nginx connection from a Unix socket to a TCP port, fixing a complex permissions issue.
    * Corrected file and directory permissions for the web root (`/var/www/html`) to allow the `www-data` user to serve files correctly.
    * Added detailed logging to the Python application to improve future troubleshooting.
* **Deployment:**
    * Created a comprehensive `deploy.sh` script to automate pulling the latest changes from GitHub, syncing both the static site and the Python application, setting correct permissions, and restarting all necessary services.