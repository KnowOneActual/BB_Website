# DRF Tools & Resources - Style & Content Guide

## Overview
This document establishes design standards, content guidelines, and technical specifications for the David Rubenstein Forum (DRF) tools and resources website. Use this guide to maintain consistency across all pages and ensure a cohesive user experience.

## Design System

### Color Palette
```css
/* Core Colors */
--bg: #060a12;                /* Deepest space navy background */
--fg: #f3f4f6;                /* High-contrast light text */
--accent: #ffd166;            /* Gold primary accent */
--accent-glow: rgba(255, 209, 102, 0.25);
--muted: #9ca3af;             /* Neutral gray muted text */
--card: rgba(21, 26, 40, 0.65); /* Glassmorphic card background */
--card-hover: rgba(30, 37, 56, 0.75);
--border: rgba(255, 209, 102, 0.12); /* Gold-tinted border */
--border-hover: rgba(255, 209, 102, 0.35);

/* Effects */
--radius: 16px;
--radius-sm: 10px;
--transition: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
--glow: 0 0 20px var(--accent-glow);
--shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
```

### Typography
- **Primary Font**: `'Inter', system-ui` - Body text, UI elements, technical labels
- **Display Font**: `'Poppins', sans-serif` - Headings, buttons, navigation links
- **Monospace**: System monospace - Code blocks

**Font Loading**: Always include `/fonts.css` in `<head>`:
```html
<link rel="stylesheet" href="/fonts.css" />
```

### Spacing & Layout
- **Base Unit**: 4px (0.25rem)
- **Border Radius**: `--radius: 16px`, `--radius-sm: 10px`
- **Card Padding**: `2rem` (mobile: `1.25rem`)
- **Section Spacing**: `2.5rem` margin between sections

### Interactive States
- **Hover Effects**: Subtle `translateY(-4px)` with scaling for cards, border-color change, and glowing drop shadow.
- **Transitions**: Use smooth bezier transition (`0.3s cubic-bezier(...)`) for state changes to avoid layout-shifting hovers.
- **Focus States**: Accent-colored border with box-shadow glow indicator.

## Content Guidelines

### Page Structure
1. **Header**
   - Sticky navigation with gradient backdrop
   - Page title with gold gradient
   - Optional subtitle/description
   - Navigation links (when applicable)

2. **Main Content**
   - Max width: `800px` (guides), `1200px` (index)
   - Consistent side padding: `1rem` (mobile), `1.5rem` (desktop)
   - Clear section hierarchy with appropriate heading levels

3. **Footer**
   - Copyright information
   - Revision date (use current year/month)
   - Minimal branding

### Writing Style
- **Tone**: Professional, helpful, concise
- **Audience**: DRF staff, event planners, technical users
- **Format**: Use clear headings, bullet points for lists, tables for comparisons
- **Accessibility**: Descriptive link text, alt text for images, ARIA labels

### Component Patterns

#### Navigation Cards (Index Page)
```html
<article class="resource-card" data-categories="category1 category2">
  <div class="card-header">
    <div class="card-icon" aria-hidden="true">📍</div>
    <div>
      <h3 class="card-title">Resource Title</h3>
      <p class="card-meta">Category • Subcategory</p>
    </div>
  </div>
  <p class="card-description">
    Clear, concise description of 2-3 sentences.
  </p>
  <div class="card-actions">
    <a href="page.html" class="btn btn-primary">Primary Action</a>
    <a href="page.html#section" class="btn btn-secondary">Secondary Action</a>
  </div>
</article>
```

#### Room Cards (Room Guide)
```html
<article class="room-card">
  <div class="room-title-row">
    <div class="room-name">Room Name</div>
    <div class="room-tag">Category</div>
  </div>
  <div class="room-capacity">Capacity details</div>
  <div class="room-notes">
    Description with key features and usage notes.
  </div>
  <div class="room-links">
    <a href="#link">Action Link</a>
  </div>
</article>
```

#### Step-by-Step Guides
```html
<section id="section-name">
  <h2>Section Title</h2>
  <div class="step">
    <h3>Step Title</h3>
    <div class="step-content">
      <p>Step instructions...</p>
      <div class="tip">
        <strong>Tip:</strong> Helpful advice or alternative approach.
      </div>
      <div class="warning">
        <strong>Warning:</strong> Important cautions or limitations.
      </div>
    </div>
  </div>
</section>
```

#### Data Tables
```html
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Important text</strong></td>
      <td>Description text</td>
      <td>Additional details</td>
    </tr>
  </tbody>
</table>
```

## Technical Standards

### HTML Structure
- **Doctype**: `<!doctype html>`
- **Language**: `<html lang="en">`
- **Viewport**: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Theme Color**: `<meta name="theme-color" content="#0a0e17">`
- **Favicon**: Use DRF favicon set (see existing pages)

### CSS Architecture
- **CSS Variables**: Use defined color variables, don't hardcode colors
- **Mobile First**: Base styles for mobile, enhancements for larger screens
- **Responsive Breakpoints**:
  - `@media (max-width: 480px)` - Small phones
  - `@media (max-width: 719px)` - Mobile navigation adjustments
  - `@media (min-width: 720px)` - Desktop enhancements

### JavaScript Usage
- **Progressive Enhancement**: Core functionality works without JS
- **Accessibility**: Keyboard navigation, screen reader support
- **Performance**: Lazy loading for images, efficient DOM manipulation

## File Organization

```
DRF/
├── drf-index.html              # Main resources index
├── drf-index.css              # Index page styles
├── drf-room-guide.html        # Room reference guide
├── drf-room-guide.css         # Room guide styles
├── drf-room-guide.js          # Room guide functionality
├── extron-quickstart.html     # Troubleshooting guide
├── quick_start_troubleshooting_guide_extron_macbook.md  # Source content
├── STYLE_CONTENT_GUIDE.md     # This document
├── img/                       # Images and icons
│   ├── favicon/
│   │   ├── favicon.svg
│   │   ├── favicon-32x32.webp
│   │   └── ...
│   └── [other images]
└── [future resources]
```

## Accessibility Standards

### WCAG Compliance
- **Color Contrast**: Text meets WCAG 2.1 AA (4.5:1 minimum)
- **Keyboard Navigation**: All interactive elements focusable
- **Screen Readers**: Semantic HTML, ARIA attributes when needed
- **Focus Management**: Visible focus indicators

### Implementation Checklist
- [ ] All images have descriptive `alt` text
- [ ] Form inputs have associated `<label>` elements
- [ ] Interactive elements have appropriate ARIA roles
- [ ] Color alone is not used to convey information
- [ ] Text resizes properly without breaking layout

## Maintenance & Updates

### Adding New Resources
1. Create HTML file with consistent structure
2. Add to `drf-index.html` resource grid
3. Update category filtering if needed
4. Test on mobile and desktop
5. Format with Prettier: `npx prettier --write DRF/filename.html`

### Style Updates
1. Modify CSS variables in `:root` for global changes
2. Update this guide to reflect changes
3. Test across all existing pages
4. Consider backward compatibility

### Content Updates
1. Keep revision dates current
2. Verify all links are functional
3. Check for outdated information
4. Maintain consistent terminology

## Performance Guidelines

### Optimizations
- **Image Loading**: Use `loading="lazy"` for non-critical images
- **CSS**: Minify in production, use efficient selectors
- **JavaScript**: Defer non-critical scripts
- **Fonts**: Load from local `/fonts.css`, no external dependencies

### File Size Limits
- HTML: Keep under 100KB
- CSS: Keep under 50KB per page
- Images: Compress, use modern formats (WebP)
- JavaScript: Minimize, bundle when possible

## Testing Checklist

Before publishing updates:
- [ ] Validate HTML markup
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on iOS and Android devices
- [ ] Verify keyboard navigation
- [ ] Check color contrast
- [ ] Test search functionality (if applicable)
- [ ] Verify all links work
- [ ] Check responsive behavior at all breakpoints
- [ ] Format code with Prettier

---

**Last Updated**: April 2026  
**Maintainer**: DRF Technical Team  
**Reference**: Based on existing DRF tools implementation