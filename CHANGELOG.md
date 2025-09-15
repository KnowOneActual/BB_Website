Onion Site

### ## Changelog: September 14, 2025

This update marks the initial deployment and stabilization of the Tor Onion Service for the website, including the launch of the new Secure Image Cleaner application and initial server hardening.

### ### New Features

* **Tor Onion Service:** The website is now fully accessible via its own Tor Onion Service, providing enhanced privacy and anonymity for users.
* **Secure Image Cleaner:** A new web application (`cleaner.html`) has been launched. It allows users to upload JPG or PNG images (up to 10 MB) to strip all EXIF metadata, ensuring privacy before sharing.
    * The backend is powered by a Python Flask application using the Pillow library.
    * The application is managed by Gunicorn and runs as a persistent `systemd` service.

### ### Security & Hardening

* **UFW Firewall:** The server firewall has been enabled and configured to deny all incoming traffic by default, only allowing connections on the SSH port.
* **Automatic Security Updates:** The `unattended-upgrades` package has been configured to automatically install new security patches.
* **Disabled Root Login:** Direct SSH login for the `root` user has been disabled to enhance security.
* **Permissions Corrected:** Fixed file and directory permissions for `/var/www/html` to ensure the Nginx user (`www-data`) can serve files correctly.

### ### Infrastructure & Deployment

* **Deployment Script:** Created a comprehensive `deploy.sh` script to automate pulling the latest changes from GitHub, syncing both the static site and the Python application, setting permissions, and restarting all necessary services.
    * **Improved Script Stability:** Added a sanity check to the deployment script to verify `index.html` exists before syncing. This prevents the script from accidentally deleting the homepage and causing a site outage.
* **Service Enablement:** Nginx, Tor, and the `image_cleaner` services have all been enabled to ensure they start automatically after a server reboot.
* **Nginx Configuration:**
    * Fixed a persistent "403 Forbidden" error by updating the configuration to correctly identify `index.html` as the default document.
    * Configured Nginx as a reverse proxy to handle requests for the `/upload` endpoint.
    * Increased the maximum client body size to `10M` to allow for larger image uploads.
* **Application Stability:**
    * Resolved a "502 Bad Gateway" error by switching the Gunicorn-Nginx connection from a Unix socket to a TCP port, fixing a complex permissions issue.
    * Increased Gunicorn's worker timeout to handle long-running image processing tasks.
    * Added detailed logging to the Python application to improve future troubleshooting.
* **Quality of Life:**
    * A dedicated non-root user with `sudo` privileges was created for server administration.
    * A bash alias `deploy` was created for the deployment script, simplifying the process of running updates.