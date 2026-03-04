document.addEventListener('DOMContentLoaded', () => {
  fetch('data/daily-links.json')
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById('links-container');
      container.innerHTML = '';

      // Extract pinned links
      const pinnedLinks = [];
      data.categories.forEach((category) => {
        category.links.forEach((link) => {
          if (link.pinned) {
            pinnedLinks.push(link);
          }
        });
      });

      // Render pinned section if exists
      if (pinnedLinks.length > 0) {
        renderCategory(
          {
            name: 'Quick Access',
            links: pinnedLinks,
            isPinned: true,
          },
          container
        );
      }

      // Render regular categories
      data.categories.forEach((category) => {
        renderCategory(category, container);
      });

      // Trigger fade-in appear
      setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el) => el.classList.add('appear'));
      }, 100);
    })
    .catch((error) => {
      console.error('Error loading links:', error);
      document.getElementById('links-container').innerHTML =
        '<p class="text-center text-red-400">Error loading links. Please try again later.</p>';
    });
});

function renderCategory(category, container) {
  const section = document.createElement('section');
  section.className = 'fade-in';

  const title = document.createElement('h2');
  title.className = `text-2xl font-bold mb-8 border-b border-gray-800 pb-4 tracking-tight ${
    category.isPinned ? 'text-amber-400 flex items-center gap-2' : 'text-indigo-400'
  }`;

  if (category.isPinned) {
    const pinIcon = document.createElement('i');
    pinIcon.className = 'fa-solid fa-thumbtack text-sm rotate-45';
    title.appendChild(pinIcon);
  }

  const titleText = document.createTextNode(category.name);
  title.appendChild(titleText);
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
    label.textContent = link.name;

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
