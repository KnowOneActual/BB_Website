#!/bin/bash

# A script to deploy the onion site and the image cleaner app from GitHub

echo "--- Starting deployment ---"

# --- Step 1: Deploy the Static Website ---
echo "[1/4] Deploying the static HTML site..."

# Navigate to the project directory
cd ~/BB_Website || { echo "Failed to cd to BB_Website"; exit 1; }

# Pull the latest changes
git checkout onion-version
git pull origin onion-version

# Copy web-facing files, excluding the app code and git directory
echo "Copying HTML/CSS files to /var/www/html/..."
sudo rsync -av --delete --exclude='.git' --exclude='image_cleaner.py' --exclude='requirements.txt' --exclude='scripts' ~/BB_Website/ /var/www/html/


# --- Step 2: Set up the Python Image Cleaner App ---
echo "[2/4] Setting up the Python image cleaner app..."

# Define the location for our Flask app
APP_DIR=~/image_cleaner_app
VENV_DIR=$APP_DIR/venv

# Create the app directory if it doesn't exist
mkdir -p $APP_DIR

# Copy the Python app files from the repo to the app directory
cp ~/BB_Website/image_cleaner.py $APP_DIR/
cp ~/BB_Website/requirements.txt $APP_DIR/


# --- Step 3: Create Virtual Environment & Install Dependencies ---
echo "[3/4] Checking for virtual environment..."

# Check if the venv exists. If not, create it.
if [ ! -d "$VENV_DIR" ]; then
  echo "Virtual environment not found. Creating one..."
  python3 -m venv $VENV_DIR
fi

# Activate the virtual environment
source $VENV_DIR/bin/activate

# Install dependencies from requirements.txt
echo "Installing/updating Python dependencies..."
pip install -r $APP_DIR/requirements.txt

# Deactivate the virtual environment
deactivate


# --- Step 4: Restart the Application Service ---
# This step is for when we create a systemd service later.
echo "[4/4] Restarting the application service (if configured)..."
# sudo systemctl restart image_cleaner

echo "--- Deployment finished successfully! ---"