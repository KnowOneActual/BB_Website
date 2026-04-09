// Checklist Manager
class ChecklistManager {
  constructor() {
    console.log('ChecklistManager constructor called');
    this.phases = ['setup', 'during', 'post'];
    this.init();
  }

  init() {
    console.log('ChecklistManager init called');
    try {
      this.loadAllItems();
    } catch (error) {
      console.error('Error in ChecklistManager.loadAllItems:', error);
    }

    try {
      this.setupEventListeners();
    } catch (error) {
      console.error('Error in ChecklistManager.setupEventListeners:', error);
    }
  }

  generateId(phase) {
    return `${phase}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createChecklistItem(phase, text, id = null, checked = false) {
    const itemId = id || this.generateId(phase);
    const li = document.createElement('li');
    li.className = 'checklist-item';
    li.dataset.id = itemId;

    li.innerHTML = `
      <input type="checkbox" id="${itemId}" class="checklist-checkbox" data-id="${itemId}" ${checked ? 'checked' : ''} />
      <label for="${itemId}" class="checklist-label">${this.escapeHtml(text)}</label>
      <button class="delete-item" data-phase="${phase}" data-id="${itemId}" title="Delete task">✕</button>
    `;

    // Add checkbox event listener
    const checkbox = li.querySelector('.checklist-checkbox');
    checkbox.addEventListener('change', (e) => {
      this.saveCheckboxState(e.target.dataset.id, e.target.checked);
    });

    // Add delete button event listener
    const deleteBtn = li.querySelector('.delete-item');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteItem(phase, itemId);
    });

    return li;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  addItem(phase, text) {
    console.log(`addItem called: phase=${phase}, text="${text}"`);
    if (!text.trim()) {
      console.log('Text is empty, returning');
      return;
    }

    const checklist = document.getElementById(`${phase}-checklist`);
    console.log(`Checklist element:`, checklist);
    if (!checklist) {
      console.error(`Checklist not found for phase: ${phase}`);
      return;
    }

    const emptyState = checklist.querySelector('.empty-state');
    console.log(`Empty state:`, emptyState);

    // Remove empty state if it exists
    if (emptyState) {
      console.log('Removing empty state');
      emptyState.remove();
    }

    // Create and add new item
    console.log('Creating checklist item');
    const item = this.createChecklistItem(phase, text);
    console.log('Item created:', item);
    checklist.appendChild(item);

    // Save to localStorage
    this.saveItem(phase, text, item.dataset.id);

    // Clear input
    document.getElementById(`${phase}-input`).value = '';

    // Scroll to new item
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    console.log(`Item added successfully to ${phase} checklist`);
  }

  saveItem(phase, text, id) {
    const items = this.getPhaseItems(phase);
    items.push({ id, text, checked: false });
    localStorage.setItem(`av_checklist_${phase}`, JSON.stringify(items));
  }

  saveCheckboxState(id, checked) {
    // Find which phase this item belongs to
    for (const phase of this.phases) {
      const items = this.getPhaseItems(phase);
      const itemIndex = items.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        items[itemIndex].checked = checked;
        localStorage.setItem(`av_checklist_${phase}`, JSON.stringify(items));
        break;
      }
    }
  }

  deleteItem(phase, id) {
    if (!confirm('Delete this task?')) return;

    // Remove from DOM
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) item.remove();

    // Remove from localStorage
    const items = this.getPhaseItems(phase);
    const filteredItems = items.filter((item) => item.id !== id);
    localStorage.setItem(`av_checklist_${phase}`, JSON.stringify(filteredItems));

    // Show empty state if no items left
    const checklist = document.getElementById(`${phase}-checklist`);
    if (!checklist) {
      console.error(`Checklist not found for phase: ${phase} in deleteItem`);
      return;
    }
    if (filteredItems.length === 0 && !checklist.querySelector('.empty-state')) {
      const emptyState = document.createElement('li');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No items yet. Add your first task below.';
      checklist.appendChild(emptyState);
    }
  }

  getPhaseItems(phase) {
    const stored = localStorage.getItem(`av_checklist_${phase}`);
    return stored ? JSON.parse(stored) : [];
  }

  loadAllItems() {
    console.log('loadAllItems called');
    this.phases.forEach((phase) => {
      console.log(`Loading items for phase: ${phase}`);
      const items = this.getPhaseItems(phase);
      console.log(`Found ${items.length} items in localStorage`);
      const checklist = document.getElementById(`${phase}-checklist`);
      console.log(`Checklist element for ${phase}:`, checklist);

      if (!checklist) {
        console.error(`Checklist not found for phase: ${phase}`);
        return;
      }

      // Clear existing items (except empty state)
      const existingItems = checklist.querySelectorAll('.checklist-item');
      console.log(`Found ${existingItems.length} existing DOM items`);
      existingItems.forEach((item) => item.remove());

      if (items.length > 0) {
        // Remove empty state if it exists
        const emptyState = checklist.querySelector('.empty-state');
        if (emptyState) {
          console.log('Removing empty state');
          emptyState.remove();
        }

        // Add saved items
        items.forEach((item) => {
          console.log(`Adding item: ${item.text}, checked: ${item.checked}`);
          const li = this.createChecklistItem(phase, item.text, item.id, item.checked);
          checklist.appendChild(li);
        });
      } else {
        console.log('No items in localStorage for this phase');
      }
    });
  }

  clearAll() {
    if (!confirm('Clear ALL checklists? This cannot be undone.')) return;

    this.phases.forEach((phase) => {
      localStorage.removeItem(`av_checklist_${phase}`);
      const checklist = document.getElementById(`${phase}-checklist`);

      // Remove all checklist items
      const items = checklist.querySelectorAll('.checklist-item');
      items.forEach((item) => item.remove());

      // Add empty state
      const emptyState = document.createElement('li');
      emptyState.className = 'empty-state';
      emptyState.textContent =
        phase === 'setup'
          ? 'No items yet. Add your first setup task below.'
          : phase === 'during'
            ? 'No items yet. Add your first during‑event task below.'
            : 'No items yet. Add your first cleanup task below.';
      checklist.appendChild(emptyState);
    });
  }

  loadExampleTasks() {
    // Check if any phase already has items
    let hasItems = false;
    this.phases.forEach((phase) => {
      if (this.getPhaseItems(phase).length > 0) {
        hasItems = true;
      }
    });

    if (
      hasItems &&
      !confirm('This will add example tasks to empty sections. Existing tasks will be preserved. Continue?')
    ) {
      return;
    }

    const examples = {
      setup: [
        'Test all microphones and wireless lapel mics',
        'Check projector/lens and focus',
        'Verify audio mixer levels and mute/unmute',
        'Confirm video switcher inputs (laptop, doc cam, etc.)',
        'Test recording/streaming setup',
        'Ensure backup batteries for wireless mics',
      ],
      during: [
        'Monitor audio levels and adjust gain as needed',
        'Watch for clipping or feedback',
        'Be ready to switch to backup microphone',
        'Keep an eye on projector lamp hours',
        'Have spare cables accessible',
      ],
      post: [
        'Power down all equipment properly',
        'Coil and store all cables',
        'Return wireless mics to charging stations',
        'Document any issues for maintenance',
        'Clean lenses and filters',
        'Reset room to default configuration',
      ],
    };

    this.phases.forEach((phase) => {
      const existingItems = this.getPhaseItems(phase);
      if (existingItems.length === 0) {
        // Phase is empty, add examples
        const checklist = document.getElementById(`${phase}-checklist`);
        const emptyState = checklist.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        examples[phase].forEach((text) => {
          const item = this.createChecklistItem(phase, text);
          checklist.appendChild(item);
          this.saveItem(phase, text, item.dataset.id);
        });
      }
    });
  }

  setupEventListeners() {
    console.log('Setting up event listeners');
    // Add buttons
    this.phases.forEach((phase) => {
      const addBtn = document.getElementById(`${phase}-add`);
      const cancelBtn = document.getElementById(`${phase}-cancel`);
      const input = document.getElementById(`${phase}-input`);

      console.log(`Phase: ${phase}, addBtn:`, addBtn, 'cancelBtn:', cancelBtn, 'input:', input);

      if (!addBtn) {
        console.error(`Add button not found for phase: ${phase}`);
        return;
      }

      addBtn.addEventListener('click', () => {
        console.log(`Add button clicked for ${phase}, input value:`, input.value);
        this.addItem(phase, input.value);
      });

      cancelBtn.addEventListener('click', () => {
        console.log(`Cancel button clicked for ${phase}`);
        input.value = '';
      });

      // Enter key support
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          console.log(`Enter key pressed for ${phase}, input value:`, input.value);
          this.addItem(phase, input.value);
        }
      });
    });

    // Print button
    document.getElementById('printBtn').addEventListener('click', () => {
      window.print();
    });

    // Clear all button
    document.getElementById('clearBtn').addEventListener('click', () => {
      this.clearAll();
    });

    // Load example tasks button
    document.getElementById('loadExamplesBtn').addEventListener('click', () => {
      this.loadExampleTasks();
    });

    // Present mode toggle
    const presentModeBtn = document.getElementById('presentModeBtn');
    presentModeBtn.addEventListener('click', () => {
      document.body.classList.toggle('present-mode');
      presentModeBtn.innerHTML = document.body.classList.contains('present-mode')
        ? '<span>📺</span> Exit Present Mode'
        : '<span>📺</span> Present Mode';

      if (document.body.classList.contains('present-mode')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  console.error('Error message:', event.message);
  console.error('Error at:', event.filename, 'line', event.lineno, 'col', event.colno);
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  new ChecklistManager();
});
