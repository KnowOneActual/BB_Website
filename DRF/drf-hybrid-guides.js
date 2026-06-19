document.addEventListener('DOMContentLoaded', () => {
  // --- Mermaid Initialization (CSP-compliant) ---
  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        background: '#151a28',
        primaryColor: '#151a28',
        primaryTextColor: '#f0f0f0',
        primaryBorderColor: '#2a3042',
        lineColor: '#ffd166',
        secondaryColor: '#0a0e17',
        tertiaryColor: '#2a3042',
      },
    });
  }

  // --- Navigation (Tab Switching) ---
  const navItems = document.querySelectorAll('.nav-item');
  const guidePanels = document.querySelectorAll('.guide-panel');
  const mobileSelector = document.getElementById('mobile-guide-select');

  function switchTab(targetId) {
    // Update active nav items (desktop)
    navItems.forEach((item) => {
      const button = item.querySelector('button');
      if (button && button.dataset.target === targetId) {
        item.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('active');
        if (button) button.setAttribute('aria-selected', 'false');
      }
    });

    // Update active panels
    guidePanels.forEach((panel) => {
      if (panel.id === targetId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update mobile selector
    if (mobileSelector) {
      mobileSelector.value = targetId;
    }

    // Scroll to top of content on change
    const mainContent = document.querySelector('.content-area');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update URL hash without jumping
    history.pushState(null, null, `#${targetId}`);

    // Rerender Mermaid diagrams if needed
    if (window.mermaid && targetId === 'general-guide') {
      window.mermaid.init(undefined, document.querySelectorAll('#general-guide .mermaid'));
    }
  }

  // Bind desktop buttons
  navItems.forEach((item) => {
    const btn = item.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        switchTab(target);
      });
    }
  });

  // Bind mobile select dropdown
  if (mobileSelector) {
    mobileSelector.addEventListener('change', (e) => {
      switchTab(e.target.value);
    });
  }

  // Handle URL hashes on page load
  const currentHash = window.location.hash.substring(1);
  const validIds = Array.from(guidePanels).map((panel) => panel.id);
  if (currentHash && validIds.includes(currentHash)) {
    switchTab(currentHash);
  } else {
    // Default to the first available guide panel
    if (validIds.length > 0) {
      switchTab(validIds[0]);
    }
  }

  // --- Interactive Checklists & LocalStorage ---
  const checklists = document.querySelectorAll('.checklist-container');

  checklists.forEach((container, checklistIndex) => {
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const progressBar = container.querySelector('.checklist-progress-bar');
    const resetBtn = container.querySelector('.checklist-reset-btn');

    // Create unique key for this checklist
    const guideId = container.closest('.guide-panel').id;
    const storageKey = `drf_checklist_${guideId}_${checklistIndex}`;

    // Load saved states
    const savedStates = JSON.parse(localStorage.getItem(storageKey)) || {};

    checkboxes.forEach((checkbox, checkboxIndex) => {
      // Restore checked status
      if (savedStates[checkboxIndex]) {
        checkbox.checked = true;
      }

      // Add change listener
      checkbox.addEventListener('change', () => {
        savedStates[checkboxIndex] = checkbox.checked;
        localStorage.setItem(storageKey, JSON.stringify(savedStates));
        updateProgress();
      });
    });

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        checkboxes.forEach((checkbox, checkboxIndex) => {
          checkbox.checked = false;
          savedStates[checkboxIndex] = false;
        });
        localStorage.setItem(storageKey, JSON.stringify(savedStates));
        updateProgress();
      });
    }

    // Update progress bar helper
    function updateProgress() {
      if (!progressBar) return;
      const total = checkboxes.length;
      if (total === 0) return;

      const checked = Array.from(checkboxes).filter((cb) => cb.checked).length;
      const percent = Math.round((checked / total) * 100);
      progressBar.style.width = `${percent}%`;
      progressBar.setAttribute('aria-valuenow', percent);
    }

    // Init progress bar on load
    updateProgress();
  });

  // --- Copy Code Blocks ---
  const wrappers = document.querySelectorAll('.code-block-wrapper');

  wrappers.forEach((wrapper) => {
    const code = wrapper.querySelector('code');
    const btn = wrapper.querySelector('.copy-code-btn');

    if (code && btn) {
      btn.addEventListener('click', () => {
        const text = code.innerText.trim();
        navigator.clipboard
          .writeText(text)
          .then(() => {
            btn.textContent = 'Copied!';
            btn.style.color = '#10b981';
            btn.style.borderColor = '#10b981';

            setTimeout(() => {
              btn.textContent = 'Copy';
              btn.style.color = '';
              btn.style.borderColor = '';
            }, 2000);
          })
          .catch((err) => {
            console.error('Failed to copy text: ', err);
            btn.textContent = 'Error';

            setTimeout(() => {
              btn.textContent = 'Copy';
            }, 2000);
          });
      });
    }
  });

  // --- Live Full-Text Search ---
  const searchInput = document.getElementById('guide-search');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();

      // Perform search on the active panel content (or all panels)
      // Note: We search elements inside all guide panels
      guidePanels.forEach((panel) => {
        const searchableElements = panel.querySelectorAll('p, li, td, h3, h4');

        searchableElements.forEach((el) => {
          // Remove previous highlights
          if (el.dataset.originalHtml) {
            el.innerHTML = el.dataset.originalHtml;
          } else {
            el.dataset.originalHtml = el.innerHTML;
          }

          if (!term) return; // Empty term, just restore original html

          const text = el.textContent;
          const index = text.toLowerCase().indexOf(term);

          if (index !== -1) {
            // Re-highlight matches using HTML regex replace safely on text content
            const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
            el.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
          }
        });
      });
    });
  }

  // Helper to escape regex special characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
});
