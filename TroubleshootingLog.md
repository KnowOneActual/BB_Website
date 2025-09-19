# Troubleshooting Log

This document tracks common issues and their resolutions for the onion website project. It also provides a high-level overview of the server architecture.

## Server Architecture Overview

Understanding how a visitor's request is handled is key to troubleshooting. The process involves several distinct components on the server:

1.  **Source Code (GitHub):** The website's code and deployment scripts are managed in the `KnowOneActual/BB_Website` GitHub repository.
2.  **Deployment Script (`deploy.sh`):** When run, this script pulls the latest code from the `onion-version` branch on GitHub into a temporary folder (`~/BB_Website`). It then uses `rsync` to copy the website files to the live web root.
3.  **Web Server (Nginx):** Nginx is the high-performance web server that serves the actual website files. It listens for requests and serves content from its root directory located at `/var/www/html/`.
4.  **Tor Service (`tor`):** The Tor daemon creates and maintains the connection to the Tor network, making the site available at its `.onion` address. Its configuration file (`/etc/tor/torrc`) tells it to forward all incoming visitor traffic to the Nginx server (`127.0.0.1:80`).
5.  **Firewall (`ufw`):** Ubuntu's "Uncomplicated Firewall" acts as a gatekeeper for network traffic. It needs to be configured to allow the Tor service to communicate with the Nginx server on its designated port.

### Request Flow

A typical visitor request follows this path:

`Visitor` -> `Tor Network` -> `Your Server's Tor Service` -> `ufw Firewall` -> `Nginx (Port 80)` -> `Serves files from /var/www/html`

-----

## Troubleshooting Log

Here are the document-specific issues, their diagnosis, and the final solution.

### **Issue #1: Onion Site Times Out**

  * **Date:** 2025-09-19
  * **Symptom:** The website was completely unreachable. Visitors using Tor Browser would see a "The connection has timed out" error message.
  * **Investigation:**
    1.  Checked the status of the Tor service (`sudo systemctl status tor@default`). It was `active (running)`.
    2.  Checked the status of the Nginx server (`sudo systemctl status nginx`). It was also `active (running)`.
    3.  Reviewed the Tor configuration (`/etc/tor/torrc`). It was correctly set to forward traffic: `HiddenServicePort 80 127.0.0.1:80`.
    4.  Reviewed the Nginx site configuration (`/etc/nginx/sites-enabled/default`). It was correctly set to listen on port `80`.
    5.  Since all services were running and configured correctly, the block had to be happening at the network level.
 
  * **Root Cause:** The server's local firewall (`ufw`) was `active` but did not have a rule to allow incoming TCP traffic on port `80`. This prevented the Tor service from successfully handing off requests to the Nginx server.
 
  * **Solution:** An explicit firewall rule was added to allow traffic on port 80.
    ```bash
    # Check firewall status
    sudo ufw status

    # Add the rule to allow traffic to Nginx
    sudo ufw allow 80/tcp

    # Restart services to be safe
    sudo systemctl restart tor@default
    sudo systemctl restart nginx
    ```
