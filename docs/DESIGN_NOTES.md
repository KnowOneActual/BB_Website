# Design Rationale & Philosophy (Feb 2026 Redesign)

This document outlines the design thinking behind the website redesign completed in February 2026.

## 1. Primary Goal

The main objective was to refine the personal website to better reflect a professional image while still maintaining a clean, straightforward, and laid-back style that aligns with my personality. The previous design, while bold, used a high-energy Fuchsia/Purple theme that could be distracting. The new design aims for a more professional and grounded aesthetic.

## 2. Core Design Pillars

### a. Color Palette: Professional & Grounded

- **From:** High-contrast, neon-inspired Fuchsia and Purple.
- **To:** A more subdued and professional theme using **Indigo** and **Gray**.

**Rationale:**
- **Dark Gray (`gray-950`)** serves as the primary background, creating a calm, focused, and "laid-back" environment that is easy on the eyes.
- **Indigo (`indigo-400`, `indigo-600`)** is used as a modern, tech-forward accent color. It's less jarring than fuchsia and is often associated with trust, stability, and professionalism, which are positive attributes for a hiring manager to perceive.

### b. Typography & Spacing: Readability & Calm

- The font pairing of **Space Grotesk** (headings) and **Inter** (body) was retained, as it's a strong, modern combination.
- **Whitespace (Margin/Padding):** Increased spacing between sections and elements to give content more room to breathe. This reduces cognitive load and contributes to the "clean and laid-back" feeling.
- **Typographic Hierarchy:** Refined the size and weight of headings and text to create a clearer visual hierarchy, making the site easier to scan and digest quickly.

### c. Content Strategy: Highlighting Professional Impact

The content structure was reorganized to prioritize information that a hiring manager would find most valuable.

- **Clearer Professional Title:** The hero section now immediately states the professional role ("Technical Project Manager & AV/IT Systems Specialist") for immediate clarity.
- **Scannable "Core Skills" Section:** The "About Me" section was streamlined, and a "Core Skills" grid was added. This format allows a recruiter to quickly identify key competencies (e.g., Project Management, Python, Network Analysis) without reading through paragraphs of text.
- **Dedicated "Toolbag" Page:** The "Toolbag" section was moved to its own page (`toolbag.html`). This declutters the main page while allowing a more comprehensive, detailed showcase of technical skills for those interested.
- **Prominent Social/Professional Links:** A sticky navigation bar was added, featuring prominent links to GitHub and LinkedIn, which are critical resources for recruiters.

### d. User Experience (UX)

- **Sticky Navigation:** The new navigation bar remains visible on scroll, allowing users to easily jump between sections without having to scroll back to the top. It has a semi-transparent, blurred background when scrolled to maintain the context of the content behind it.
- **Project Discoverability:** Project cards were refined to include tech tags, making it easier to see the technologies used at a glance. A new, relevant project ("Network Triage Tool") was added to better showcase practical skills.

### e. Privacy & Security as a Feature

- **Interactive Resume Request:** Replaced direct resume downloads with a "request" workflow.
    - **Rationale:** This protects personal information (phone/email/address) from automated scrapers and ensures the user always receives the most current version. It also creates a natural opportunity for professional interaction by landing the user directly at the contact form.
- **Tailwind Build Integrity:** Refined the build process to scan all JavaScript-driven templates.
    - **Rationale:** Ensures that even dynamically rendered components (like blog posts and daily links) maintain the professional aesthetic by including all necessary utility classes in the final CSS.

## 3. Tooling & Code Standards

### a. Automated Formatting (Prettier)

The project uses **Prettier** to maintain a consistent code style across all files. This ensures that the codebase remains readable and professional, regardless of which environment or editor is used.

**Opinionated Formatting:**
- We have adopted Prettier's default, opinionated behavior for HTML.
- **Self-Closing Tags:** Prettier (v3+) automatically adds trailing slashes to HTML void elements (e.g., `<meta charset="UTF-8" />`). While this differs from some traditional HTML5 styles, it was chosen to maintain strict consistency across the project and ensure compatibility with modern tooling.
- **Doctype Casing:** We use the lowercase `<!doctype html>`. While both uppercase and lowercase are valid and trigger Standards Mode in modern browsers, Prettier enforces lowercase. We have adopted this to avoid "fighting the tools" and maintain a uniform codebase.

## 4. Conclusion

This redesign represents a strategic shift from a purely expressive personal site to a polished and professional one. It balances personality with clarity, scannability, and a calm, trustworthy aesthetic.
