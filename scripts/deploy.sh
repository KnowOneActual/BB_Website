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


# --- 2. Deploy the Static Website Files ---
echo "[2/4] Syncing website files to /var/www/html/..."
# Use rsync to efficiently copy files and set correct ownership in one step.
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
# Restart the Python application service
sudo systemctl restart image_cleaner.service

# Reload Nginx to ensure it's running the latest config (if any changes were made)
sudo systemctl reload nginx

echo "--- Deployment Finished Successfully! ---"