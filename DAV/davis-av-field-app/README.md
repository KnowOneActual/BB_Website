# Davis Audio - Mobile Field AV Assistant

A mobile-first web app designed for field technicians to quickly fill out site notes, hardware measurements, rack port maps, and credentials directly from a phone or tablet.

## Features

- **Mobile Phone Optimized**: Large touch targets, dark high-contrast industrial theme, and a sticky bottom navigation bar.
- **Auto-Save Persistence**: Automatically saves all inputs locally (`localStorage`) so field data is preserved even if the phone screen locks or reloads.
- **Obsidian Markdown Integration**: One-tap export to clean, formatted Markdown ready to paste into Obsidian or download as a `.md` file.
- **Interactive Port & Outlet Grid**: Visual layout mapping for 16-Port Core Switches and 12-Outlet Wattbox PDUs.
- **Camera & Photo Attachments**: Capture photos directly from a mobile camera or upload site images.
- **Credentials Vault**: Password field toggles and quick copy buttons for network equipment and service logins.

## How to Run

### Option 1: Open Directly in Browser
Double-click `index.html` or open `file:///Users/userx/Desktop/davis-av-field-app/index.html` in Safari or Chrome.

### Option 2: Host Locally on Wi-Fi Network (Access from Mobile Phone)
Run a local web server from your computer so you can access it on your phone via local Wi-Fi:

```bash
cd /Users/userx/Desktop/davis-av-field-app
python3 -m http.server 8080
```

Then open `http://<your-computer-ip>:8080` on your phone!
