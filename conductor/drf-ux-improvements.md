# Plan: DRF Folder UX & Accessibility Improvements

This plan details the steps to improve the User Experience (UX) and Web Accessibility (A11y) of the files within the `DRF/` directory. The improvements are based on a review guided by the `ux-polisher` skill, focusing on WCAG guidelines and modern UX best practices.

## Phase 1: Improvements for `drf-index.html` & `drf-index.css`

These changes target the main resource hub page, focusing on discoverability and accessibility for all users.

### 1.1. Add Explicit Focus Styles for Interactive Elements

**File:** `DRF/drf-index.css`

**Problem:** Keyboard users do not get clear visual feedback when navigating through buttons and links because there are no `:focus` or `:focus-visible` styles defined.

**Solution:** Add `:focus-visible` styles to all interactive elements to match their existing `:hover` states.

```css
/* In DRF/drf-index.css */

.category-btn:hover,
.category-btn.active,
.category-btn:focus-visible { /* Add :focus-visible */
  border-color: var(--accent);
  background: rgba(255, 209, 102, 0.1);
  color: var(--accent);
}

.btn-primary:hover,
.btn-primary:focus-visible { /* Add :focus-visible */
  background: #ffc145;
  transform: translateY(-2px);
  /* Consider a box-shadow for focus instead of transform for better stability */
  box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.5);
}

.btn-secondary:hover,
.btn-secondary:focus-visible { /* Add :focus-visible */
  background: rgba(255, 209, 102, 0.1);
}

footer a:hover,
footer a:focus-visible { /* Add :focus-visible */
  color: var(--fg); /* Or another clear indicator */
  text-decoration: underline;
}
```

### 1.2. Enhance Category Filter Accessibility (ARIA)

**File:** `DRF/drf-index.html`

**Problem:** The category filter buttons change content dynamically but do not communicate their state or function to screen readers.

**Solution:** Enhance the `<nav>` section with ARIA roles (`tablist`, `tab`) and states (`aria-selected`).

-   The `<nav>` element can be treated as a `tablist`.
-   Each `<button>` will be a `tab`.
-   The `.active` class will correspond to `aria-selected="true"`.

I will also need to review the JavaScript in `drf-index.html` to update the `aria-selected` attribute when a new category is chosen.

## Phase 2: Improvements for `drf-event-checklist-av.html` & CSS/JS

These changes target the interactive checklist page, focusing on making the dynamic application fully accessible and more robust.

### 2.1. Add Missing Labels to Input Fields

**File:** `DRF/drf-event-checklist-av.html`

**Problem:** The text input fields for adding new tasks lack associated `<label>` elements, which is a critical accessibility failure.

**Solution:** Add a visually hidden `<label>` for each input field.

```html
<!-- Example for the 'setup' phase -->
<div class="add-item-form">
  <label for="setup-input" class="visually-hidden">Add a setup task</label>
  <input
    type="text"
    class="add-item-input"
    id="setup-input"
    placeholder="Add a setup task (e.g., 'Test all microphones')"
    maxlength="200"
  />
  ...
</div>

<!-- Add a .visually-hidden class to the CSS -->
```
A `.visually-hidden` utility class will need to be added to one of the CSS files to hide the labels from view while keeping them accessible to screen readers.

### 2.2. Add Explicit Focus Styles

**File:** `DRF/drf-event-checklist-av.css`

**Problem:** Similar to the index page, interactive elements like buttons and the custom checkboxes lack focus styles.

**Solution:** Add `:focus-visible` styles for all custom controls.

```css
/* In DRF/drf-event-checklist-av.css */

.btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.5);
}

.checklist-checkbox:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.delete-item:focus-visible {
  opacity: 1;
  color: #ff6b6b;
  outline: 2px solid #ff6b6b;
  outline-offset: 2px;
}
```

### 2.3. Implement ARIA Live Regions for Dynamic Changes

**File:** `DRF/drf-event-checklist-av.js`

**Problem:** Screen readers are not notified when tasks are added, deleted, or when the list becomes empty.

**Solution:**
1.  Add a visually hidden `aria-live` region to `drf-event-checklist-av.html`.
    ```html
    <div class="visually-hidden" id="task-announcer" aria-live="polite" aria-atomic="true"></div>
    ```
2.  Update the JavaScript to populate this region with status messages.
    -   In `addItem()`: `announcer.textContent = 'Task added: [task name]';`
    -   In `deleteItem()`: `announcer.textContent = 'Task deleted.';`
    -   In `clearAll()`: `announcer.textContent = 'All checklists have been cleared.';`

### 2.4. Improve Focus Management on Deletion

**File:** `DRF/drf-event-checklist-av.js`

**Problem:** When a task is deleted, focus is lost and resets to the top of the page.

**Solution:** Modify the `deleteItem()` function. After an item is removed, programmatically set focus to the next item in the list, the previous item, or the corresponding "add task" input field if the list becomes empty.

### 2.5. Improve ARIA Labeling on Controls

**File:** `DRF/drf-event-checklist-av.html` and `DRF/drf-event-checklist-av.js`

**Problem:** Icons and symbols are used for buttons without proper screen reader labels.

**Solution:**
1.  In `drf-event-checklist-av.html`, add `aria-hidden="true"` to all decorative icon `<span>`s inside buttons (e.g., `<span>🖨️</span>`).
2.  In `drf-event-checklist-av.js`, modify the `createChecklistItem` function to add `aria-label="Delete task"` to the delete button (`<button class="delete-item">`). This is more robust than the `title` attribute.

This comprehensive plan will significantly enhance the usability and accessibility of the DRF tools, making them more professional and inclusive.
