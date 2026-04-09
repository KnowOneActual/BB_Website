// Checklist Manager
class ChecklistManager {
  constructor() {
    this.phases = ['setup', 'during', 'post'];
    this.announcer = null;
    this.init();
  }

  init() {
    this.announcer = document.getElementById('task-announcer');
    this.loadAllItems();
    this.setupEventListeners();
  }

  announce(message) {
    if (this.announcer) {
      this.announcer.textContent = message;
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
      <button class="delete-item" data-phase="${phase}" data-id="${itemId}" aria-label="Delete task: ${this.escapeHtml(text)}" title="Delete task">✕</button>
    `;

    // Add checkbox event listener
    const checkbox = li.querySelector('.checklist-checkbox');
    checkbox.addEventListener('change', (e) => {
      this.saveCheckboxState(e.target.dataset.id, e.target.checked);
      if (e.target.checked) {
        this.announce(`Task completed: ${text}`);
      }
    });

    // Add delete button event listener
    const deleteBtn = li.querySelector('.delete-item');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteItem(phase, itemId, li);
    });

    return li;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  addItem(phase, text) {
    if (!text.trim()) return;

    const checklist = document.getElementById(`${phase}-checklist`);
    const emptyState = checklist.querySelector('.empty-state');

    if (emptyState) {
      emptyState.remove();
    }

    const item = this.createChecklistItem(phase, text);
    checklist.appendChild(item);

    this.saveItem(phase, text, item.dataset.id);
    document.getElementById(`${phase}-input`).value = '';

    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    this.announce(`Task added: ${text}`);
  }

  saveItem(phase, text, id) {
    const items = this.getPhaseItems(phase);
    items.push({ id, text, checked: false });
    localStorage.setItem(`av_checklist_${phase}`, JSON.stringify(items));
  }

  saveCheckboxState(id, checked) {
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

  deleteItem(phase, id, listItem) {
    if (!confirm('Delete this task?')) return;

    const nextFocusable = listItem.nextElementSibling || listItem.previousElementSibling || document.getElementById(`${phase}-input`);

    const itemText = listItem.querySelector('.checklist-label').textContent;
    listItem.remove();

    const items = this.getPhaseItems(phase);
    const filteredItems = items.filter((item) => item.id !== id);
    localStorage.setItem(`av_checklist_${phase}`, JSON.stringify(filteredItems));

    const checklist = document.getElementById(`${phase}-checklist`);
    if (filteredItems.length === 0 && !checklist.querySelector('.empty-state')) {
      const emptyState = document.createElement('li');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No items yet. Add your first task below.';
      checklist.appendChild(emptyState);
    }
    
    this.announce(`Task deleted: ${itemText}`);
    if(nextFocusable) {
      nextFocusable.focus();
    }
  }

  getPhaseItems(phase) {
    const stored = localStorage.getItem(`av_checklist_${phase}`);
    return stored ? JSON.parse(stored) : [];
  }

  loadAllItems() {
    this.phases.forEach((phase) => {
      const items = this.getPhaseItems(phase);
      const checklist = document.getElementById(`${phase}-checklist`);
      if (!checklist) return;

      const existingItems = checklist.querySelectorAll('.checklist-item');
      existingItems.forEach((item) => item.remove());

      if (items.length > 0) {
        const emptyState = checklist.querySelector('.empty-state');
        if (emptyState) {
          emptyState.remove();
        }
        items.forEach((item) => {
          const li = this.createChecklistItem(phase, item.text, item.id, item.checked);
          checklist.appendChild(li);
        });
      }
    });
  }

  clearAll() {
    if (!confirm('Clear ALL checklists? This cannot be undone.')) return;

    this.phases.forEach((phase) => {
      localStorage.removeItem(`av_checklist_${phase}`);
      const checklist = document.getElementById(`${phase}-checklist`);
      const items = checklist.querySelectorAll('.checklist-item');
      items.forEach((item) => item.remove());

      if (!checklist.querySelector('.empty-state')) {
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.textContent =
          phase === 'setup'
            ? 'No items yet. Add your first setup task below.'
            : phase === 'during'
              ? 'No items yet. Add your first during‑event task below.'
              : 'No items yet. Add your first cleanup task below.';
        checklist.appendChild(emptyState);
      }
    });
    this.announce('All checklists have been cleared.');
  }

  loadExampleTasks() {
    let hasItems = this.phases.some(phase => this.getPhaseItems(phase).length > 0);

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
      if (this.getPhaseItems(phase).length === 0) {
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
    this.announce('Example tasks loaded.');
  }

  setupEventListeners() {
    this.phases.forEach((phase) => {
      const addBtn = document.getElementById(`${phase}-add`);
      const cancelBtn = document.getElementById(`${phase}-cancel`);
      const input = document.getElementById(`${phase}-input`);

      if (!addBtn) return;

      addBtn.addEventListener('click', () => this.addItem(phase, input.value));
      cancelBtn.addEventListener('click', () => input.value = '');

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addItem(phase, input.value);
        }
      });
    });

    document.getElementById('printBtn').addEventListener('click', () => window.print());
    document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
    document.getElementById('loadExamplesBtn').addEventListener('click', () => this.loadExampleTasks());

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
  console.error('Global error caught:', event.error, event.message, event.filename, event.lineno, event.colno);
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ChecklistManager();
});
