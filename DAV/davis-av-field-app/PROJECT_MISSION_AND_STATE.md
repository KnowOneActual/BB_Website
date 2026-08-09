# Davis Audio Field Assistant: Mission & Development State

**Project:** Mobile Field AV Installation & Daily Log Assistant  
**Lead Developer / User:** Beau Bremer (Davis Audio)  
**Location:** Chicago, IL  
**Last Updated:** August 8, 2024  

---

## 1. Core Mission Statement

Build a simple, mobile-first web application for AV field technicians at Davis Audio. The app standardizes job site documentation, eliminates paper scratchpads, automates mounting math and rack port mapping, and generates clean daily log summaries in seconds.

---

## 2. Technical Architecture & File Structure

The project lives in `/Users/userx/Desktop/davis-av-field-app` with zero heavy dependencies or complex build steps.

```
davis-av-field-app/
├── index.html        # Main HTML5 application layout & section cards
├── styles.css        # Mobile-first CSS design system (Dark Industrial theme)
├── app.js            # Vanilla JS application state, DOM rendering, and export logic
├── README.md          # Local server setup and mobile phone instructions
└── PROJECT_MISSION_AND_STATE.md # Active development state & roadmap
```

### Key Design Specs:
* **Color Palette:** Dark Graphite (`#0b0f19`), Surface Cards (`#151c2c`), Electric Cyan (`#00f0ff`), Amber Gold (`#ffb000`), Emerald Green (`#10b981`).
* **Typography:** `Plus Jakarta Sans` for clean UI body text; `JetBrains Mono` for serial numbers, MAC addresses, and port maps.
* **Touch Targets:** Minimum 44px to 48px touch heights with sticky mobile bottom navigation.

---

## 3. Completed Work & Core Features

### Section 1: General Site Notes & Logistics
* Dynamic list manager for Client Questions (with checkboxes).
* General site observations text area.
* Active Issues tracker.
* Action Item checklists for Bring Next Visit, Van Run, and Home Depot Run.

### Section 2: Mounting Specs & Housing Dimensions
* Wall center height and width inputs.
* TV center height, width, and bracket model fields.
* Soundbar model, soundbar bracket, and combined TV + Soundbar height dimensions.
* Router Service Tag (ST), MAC address, LAN port list, and WAN connection inputs.

### Section 3: Core Rack & Equipment Wiring Matrix
* **Core Switch (16 Ports):** Service Tag, MAC address, and individual port mapping cards (1 through 16).
* **Wattbox PDU (12 Outlets):** Service Tag, MAC address, and outlet assignment cards (1 through 12).
* **AVR Receiver Matrix:** 6 HDMI inputs (CBL/Sat, DVD, Blu-ray, Media Player, Game, 8K), HDMI ARC/eARC, Monitor output, and 4 RCA audio inputs.
* **Control4 C4-CORE1:** HDMI Out, Ethernet Out, and 4 IR output assignments.

### Section 4: Audio & Credentials Vault
* **Dynamic Sonos Hardware Manager:** Supports adding unlimited Sonos devices per job (Ports, Amps, Arcs, Era 100/300, Beams, Subs, Fives, Moves). Tracks Serial Numbers (S/N) and PIN codes per device.
* **Credentials Vault:** Pre-configured cards for Modem, Router, Switch, Wattbox, Sonos, eero, Wi-Fi, Control4, and **Apple ID**. Includes password show/hide toggles (`👁`) and a **`+ Add Custom Credential`** button for arbitrary system logins.

### Section 5: Daily Log & Site Documentation
* Technician Arrival and Departure time pickers.
* **Inventory Used for Van Today:** Dynamic checklist for tracking van stock and parts consumed on-site.
* **Photo Camera & Attachment Handler:** Compressed Base64 image uploader (< 600px canvas) preventing local storage quota crashes.
* Email correspondence notes and end-of-day summary log text area.

### System & Export Engines
* **Auto-Save Protection:** Keystroke auto-save to `localStorage` with graceful quota overflow pruning.
* **Safe DOM Node Handler:** Pure DOM element creation preventing quote escaping bugs on special characters (e.g. `24" TV`).
* **Modal Backdrop Tap Dismissal:** Touch-friendly backdrop dismissal on mobile screens.
* **Obsidian Full Spec Exporter:** Generates full markdown documentation ready for company archiving.
* **Dedicated Daily Log Exporter:** Generates standalone daily log entries ready to copy or download.

---

## 4. Development Roadmap & Future Enhancements

These items are planned for future development iterations:

1. **Progressive Web App (PWA) Manifest:** Add a web manifest and Service Worker so the app can be installed to iOS/Android home screens and work 100% offline without local web servers.
2. **Client Digital Signature Pad:** Add a HTML5 Canvas signature box at the bottom of the form for customer sign-off.
3. **One-Touch PDF Report Generator:** Add client-side PDF export alongside the Markdown exporter for sending formal summaries to project managers.
4. **Network IP & VLAN Table:** Add a dedicated static IP allocation matrix (IP, Subnet, Gateway, VLAN ID) for Core Switch, Wattbox, Control4, and Sonos units.
5. **Obsidian Vault Auto-Sync:** Automated script or hook to sync exported notes directly into `/Users/userx/Notes/ObsidianVault/`.
