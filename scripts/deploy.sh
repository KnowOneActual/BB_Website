#!/bin/bash

# A script to pull the latest changes from GitHub and deploy them to the live server.
# This script handles both the static website and the Python Flask application.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting Deployment ---"

# --- 1. Update the local repository from GitHub ---
echo "[1/4] Pulling latest changes from GitHub..."
cd ~/BB_Website || exit
git checkout onion-version
git pull origin onion-version

# --- SANITY CHECK ---
# Verify that the index.html file exists before we deploy.
if [ ! -f "index.html" ]; then
    echo "ERROR: index.html not found after git pull. Aborting deployment to prevent site outage."
    exit 1
fi
# --- END SANITY CHECK ---


# --- 2. Deploy the Static Website Files ---
echo "[2/4] Syncing website files to /var/www/html/..."
sudo rsync -av --delete \
    --exclude='.git' \
    --exclude='image_cleaner.py' \
    --exclude='requirements.txt' \
    --exclude='deploy.sh' \
    ~/BB_Website/ /var/www/html/

# Fix permissions for the web server
echo "Setting permissions for Nginx..."
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html


# --- 3. Deploy the Python Application ---
echo "[3/4] Updating the Python image cleaner application..."
APP_DIR=~/image_cleaner_app

# Copy the latest version of the app and its requirements
cp ~/BB_Website/image_cleaner.py $APP_DIR/
cp ~/BB_Website/requirements.txt $APP_DIR/

# Install any new dependencies into the virtual environment
source $APP_DIR/venv/bin/activate
pip install -r $APP_DIR/requirements.txt
deactivate


# --- 4. Restart Services ---
echo "[4/4] Restarting services to apply all changes..."
sudo systemctl restart image_cleaner.service
sudo systemctl reload nginx

echo "--- Deployment Finished Successfully! ---"