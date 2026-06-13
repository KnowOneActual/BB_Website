document.addEventListener('DOMContentLoaded', () => {
  let allData = null;
  let activeCategory = 'All'; // 'All', 'Quick Access', or specific category name
  let searchQuery = '';

  const container = document.getElementById('links-container');
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const categoryPillsContainer = document.getElementById('category-pills');
  const shortcutBadge = document.getElementById('shortcut-badge');

  // Load links data
  fetch('data/daily-links.json')
    .then((response) => response.json())
    .then((data) => {
      allData = data;

      // Initialize pills and render
      initPills();
      render();

      // Trigger fade-in appear
      setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el) => el.classList.add('appear'));
      }, 100);
    })
    .catch((error) => {
      console.error('Error loading links:', error);
      if (container) {
        container.innerHTML = '<p class="text-center text-red-400">Error loading links. Please try again later.</p>';
      }
    });

  // Setup Search Input Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) {
        if (searchQuery.length > 0) {
          clearBtn.classList.remove('hidden');
          if (shortcutBadge) shortcutBadge.classList.add('opacity-0');
        } else {
          clearBtn.classList.add('hidden');
          if (shortcutBadge) shortcutBadge.classList.remove('opacity-0');
        }
      }
      render();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchQuery = '';
        searchInput.blur();
        if (clearBtn) clearBtn.classList.add('hidden');
        if (shortcutBadge) shortcutBadge.classList.remove('opacity-0');
        render();
      }
    });
  }

  // Clear Button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchQuery = '';
      clearBtn.classList.add('hidden');
      if (shortcutBadge) shortcutBadge.classList.remove('opacity-0');
      render();
    });
  }

  // Keyboard Shortcuts: '/' or 'Cmd+K'/'Ctrl+K' to focus search
  document.addEventListener('keydown', (e) => {
    // Focus search on '/' (only if not already typing in an input/textarea)
    const isEditing =
      document.activeElement &&
      (document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.isContentEditable);

    if (e.key === '/' && !isEditing) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    // Focus search on Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  // Initialize Category Navigation Pills
  function initPills() {
    if (!allData || !categoryPillsContainer) return;
    categoryPillsContainer.innerHTML = '';

    const categories = [];

    // Pinned links check
    let hasPinned = false;
    allData.categories.forEach((cat) => {
      if (cat.links.some((l) => l.pinned)) {
        hasPinned = true;
      }
    });

    // Add 'All' pill
    categories.push({ name: 'All', id: 'All' });

    if (hasPinned) {
      categories.push({ name: 'Quick Access', id: 'Quick Access', isPinned: true });
    }

    // Add other categories
    allData.categories.forEach((cat) => {
      categories.push({ name: cat.name, id: cat.name });
    });

    categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `pill-btn px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 bg-gray-900 text-gray-400 ${
        cat.isPinned ? 'border-amber-500/30 hover:border-amber-400 text-amber-500/80 pill-pinned' : ''
      }`;
      btn.textContent = cat.name;
      btn.dataset.categoryId = cat.id;

      if (cat.id === activeCategory) {
        btn.classList.add('active');
        btn.classList.remove('text-gray-400');
        if (!cat.isPinned) {
          btn.classList.add('text-white');
        }
      }

      btn.addEventListener('click', () => {
        // Toggle active status
        document.querySelectorAll('.pill-btn').forEach((p) => {
          p.classList.remove('active');
          if (!p.classList.contains('pill-pinned')) {
            p.classList.add('text-gray-400');
            p.classList.remove('text-white');
          }
        });

        activeCategory = cat.id;
        btn.classList.add('active');
        if (!cat.isPinned) {
          btn.classList.remove('text-gray-400');
          btn.classList.add('text-white');
        }
        render();
      });

      categoryPillsContainer.appendChild(btn);
    });
  }

  // Render links
  function render() {
    if (!allData || !container) return;
    container.innerHTML = '';

    // Step 1: Filter data
    const query = searchQuery.trim().toLowerCase();
    let categoriesToRender = [];

    if (activeCategory === 'Quick Access') {
      // Pinned category: extract pinned links
      const pinnedLinks = [];
      allData.categories.forEach((cat) => {
        cat.links.forEach((link) => {
          if (link.pinned) {
            pinnedLinks.push({ ...link, parentCategory: cat.name });
          }
        });
      });
      categoriesToRender.push({
        name: 'Quick Access',
        links: pinnedLinks,
        isPinned: true,
      });
    } else if (activeCategory !== 'All') {
      // Specific category
      const matchedCat = allData.categories.find((c) => c.name === activeCategory);
      if (matchedCat) {
        categoriesToRender.push(matchedCat);
      }
    } else {
      // 'All' categories
      // First, render Quick Access at the top if we aren't searching OR if there are pinned matches
      const pinnedLinks = [];
      allData.categories.forEach((cat) => {
        cat.links.forEach((link) => {
          if (link.pinned) {
            pinnedLinks.push({ ...link, parentCategory: cat.name });
          }
        });
      });
      if (pinnedLinks.length > 0) {
        categoriesToRender.push({
          name: 'Quick Access',
          links: pinnedLinks,
          isPinned: true,
        });
      }

      // Add regular categories
      allData.categories.forEach((cat) => {
        categoriesToRender.push(cat);
      });
    }

    // Step 2: Apply Search query to the categories and their links
    let totalMatches = 0;
    const finalCategories = [];

    categoriesToRender.forEach((cat) => {
      const filteredLinks = cat.links.filter((link) => {
        const matchesName = link.name.toLowerCase().includes(query);
        const matchesUrl = link.url.toLowerCase().includes(query);
        const matchesCategory = (link.parentCategory || cat.name).toLowerCase().includes(query);
        return matchesName || matchesUrl || matchesCategory;
      });

      if (filteredLinks.length > 0) {
        finalCategories.push({
          ...cat,
          links: filteredLinks,
        });
        totalMatches += filteredLinks.length;
      }
    });

    // Step 3: Render matching items
    if (totalMatches === 0) {
      renderEmptyState(query);
      return;
    }

    finalCategories.forEach((cat) => {
      renderCategory(cat, container, query);
    });
  }

  // Highlight helper function
  function highlightText(text, query) {
    if (!query) return document.createTextNode(text);

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return document.createTextNode(text);

    const fragment = document.createDocumentFragment();

    // Part before match
    if (index > 0) {
      fragment.appendChild(document.createTextNode(text.substring(0, index)));
    }

    // Highlighted match
    const highlightSpan = document.createElement('mark');
    highlightSpan.className = 'highlight';
    highlightSpan.textContent = text.substring(index, index + query.length);
    fragment.appendChild(highlightSpan);

    // Part after match
    const remainingText = text.substring(index + query.length);
    if (remainingText) {
      fragment.appendChild(highlightText(remainingText, query));
    }

    return fragment;
  }

  // Render empty state
  function renderEmptyState(query) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'text-center py-12 fade-in appear';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-magnifying-glass-minus text-4xl text-gray-600 mb-4';
    emptyDiv.appendChild(icon);

    const title = document.createElement('h3');
    title.className = 'text-xl font-semibold text-gray-300 mb-2';
    title.textContent = 'No matches found';
    emptyDiv.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'text-gray-500 max-w-md mx-auto mb-6';
    desc.textContent = `We couldn't find any links matching "${query}". Try searching for another term or click below to clear.`;
    emptyDiv.appendChild(desc);

    const clearBtnInEmpty = document.createElement('button');
    clearBtnInEmpty.className =
      'px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium rounded-xl transition-all shadow-md';
    clearBtnInEmpty.textContent = 'Clear Search';
    clearBtnInEmpty.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      searchQuery = '';
      if (clearBtn) clearBtn.classList.add('hidden');
      if (shortcutBadge) shortcutBadge.classList.remove('opacity-0');
      render();
    });
    emptyDiv.appendChild(clearBtnInEmpty);

    container.appendChild(emptyDiv);
  }

  // Render a single category section
  function renderCategory(category, container, query) {
    const section = document.createElement('section');
    section.className = 'fade-in appear';

    const title = document.createElement('h2');
    title.className = `text-2xl font-bold mb-8 border-b border-gray-800 pb-4 tracking-tight ${
      category.isPinned ? 'text-amber-400 flex items-center gap-2' : 'text-indigo-400'
    }`;

    if (category.isPinned) {
      const pinIcon = document.createElement('i');
      pinIcon.className = 'fa-solid fa-thumbtack text-sm rotate-45';
      title.appendChild(pinIcon);
    }

    // Highlight category title if it matches
    title.appendChild(highlightText(category.name, query));
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

    category.links.forEach((link) => {
      const card = document.createElement('a');
      card.href = link.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = `group bg-gray-900 border p-5 rounded-xl card-link transition-all duration-300 ${
        category.isPinned
          ? 'border-amber-500/30 hover:border-amber-400 shadow-[0_0_15px_-5px_rgba(251,191,36,0.2)]'
          : 'border-gray-800 hover:border-indigo-500/50'
      }`;

      const leftSide = document.createElement('div');
      leftSide.className = 'flex items-center gap-4';

      let iconElement;
      if (link.icon === 'svg' && link.svg) {
        iconElement = document.createElement('div');
        iconElement.className = `w-6 h-6 flex items-center justify-center svg-icon ${
          category.isPinned ? 'text-amber-400' : 'text-indigo-400'
        }`;

        // --- Security: Sanitize SVG before injection ---
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(link.svg, 'image/svg+xml');
          const svgElement = doc.querySelector('svg');

          if (svgElement) {
            // Remove potential script tags
            const scripts = svgElement.querySelectorAll('script');
            scripts.forEach((s) => s.remove());

            // Strip 'on*' event handler attributes from all elements
            const allElements = svgElement.querySelectorAll('*');
            allElements.forEach((el) => {
              const attrs = el.attributes;
              for (let i = attrs.length - 1; i >= 0; i--) {
                if (attrs[i].name.toLowerCase().startsWith('on')) {
                  el.removeAttribute(attrs[i].name);
                }
              }
            });

            iconElement.appendChild(svgElement);
          } else {
            // Fallback if SVG parsing fails
            const fallback = document.createElement('i');
            fallback.className = `fa-solid fa-link text-lg ${category.isPinned ? 'text-amber-400' : 'text-indigo-400'}`;
            iconElement.appendChild(fallback);
          }
        } catch (err) {
          console.error('SVG sanitization error:', err);
          const fallback = document.createElement('i');
          fallback.className = `fa-solid fa-link text-lg ${category.isPinned ? 'text-amber-400' : 'text-indigo-400'}`;
          iconElement.appendChild(fallback);
        }
      } else {
        iconElement = document.createElement('i');
        iconElement.className = `${link.icon} text-lg ${category.isPinned ? 'text-amber-400' : 'text-indigo-400'}`;
      }

      const label = document.createElement('span');
      label.className = 'font-semibold text-gray-100';
      // Highlight matching text in the label
      label.appendChild(highlightText(link.name, query));

      leftSide.appendChild(iconElement);
      leftSide.appendChild(label);

      const arrow = document.createElement('i');
      arrow.className = `fa-solid fa-chevron-right text-xs text-gray-600 transition-colors ${
        category.isPinned ? 'group-hover:text-amber-400' : 'group-hover:text-indigo-400'
      }`;

      card.appendChild(leftSide);
      card.appendChild(arrow);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  }
});
