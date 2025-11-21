document.addEventListener('DOMContentLoaded', () => {
  fetch('data/uses.json')
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const createCard = (item, sectionId) => {
        // Create elements
        const cardDiv = document.createElement('div');
        const title = document.createElement('h4');
        const description = document.createElement('p');

        // Determine if this is a Live Production card for tighter styling
        const isLiveProduction = sectionId === 'live-production-section';

        // Add classes
        cardDiv.className =
          'bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-fuchsia-600/50 transition transform hover:-translate-y-1 h-full';

        // Use a smaller font size for Live Production descriptions to keep them tight
        title.className = isLiveProduction
          ? 'text-lg font-semibold text-white mb-1'
          : 'text-xl font-semibold text-white mb-2';

        description.className = isLiveProduction ? 'text-gray-400 text-xs' : 'text-gray-400 text-sm';

        // Set content
        title.textContent = item.name;

        // CRITICAL FIX: Use textContent for security compliance.
        // This will strip any HTML (like <strong>) but guarantees no XSS vulnerability.
        description.textContent = item.description;

        if (item.url) {
          const link = document.createElement('a');
          link.href = item.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.className = 'block h-full';
          title.className = 'text-xl font-semibold text-fuchsia-400 hover:underline mb-2';
          link.appendChild(title);
          link.appendChild(description);
          cardDiv.appendChild(link);
        } else {
          cardDiv.appendChild(title);
          cardDiv.appendChild(description);
        }

        return cardDiv;
      };

      const populateSection = (sectionId, title, items) => {
        const section = document.getElementById(sectionId);
        if (section) {
          // --- ICON & GRID LOGIC ---
          let iconClass = '';
          let gridCols = 'lg:grid-cols-3';

          if (title === 'Hardware') {
            iconClass = 'fa-solid fa-microchip';
            gridCols = 'lg:grid-cols-3';
          } else if (title === 'Software') {
            iconClass = 'fa-solid fa-desktop';
            gridCols = 'lg:grid-cols-2';
          } else if (title === 'Live Production') {
            iconClass = 'fa-solid fa-sliders';
            gridCols = 'lg:grid-cols-2';
          } else if (title === 'Services') {
            iconClass = 'fa-solid fa-cloud';
            gridCols = 'lg:grid-cols-4';
          }
          // -----------------------

          const heading = document.createElement('h2');
          heading.className = 'text-3xl font-bold text-fuchsia-400 mb-8 text-center';

          // Create and append icon element
          const icon = document.createElement('i');
          icon.className = `${iconClass} mr-3`;

          heading.appendChild(icon);
          heading.appendChild(document.createTextNode(title));

          const grid = document.createElement('div');
          grid.className = `grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-8`;

          items.forEach((item) => {
            grid.appendChild(createCard(item, sectionId));
          });

          section.appendChild(heading);
          section.appendChild(grid);
        }
      };

      // --- POPULATE SECTIONS ---

      // 1. Hardware
      populateSection('hardware-section', 'Hardware', data.hardware);

      // 2. Software (Custom Handling)
      const softwareSection = document.getElementById('software-section');
      if (softwareSection) {
        let iconClass = 'fa-solid fa-desktop';

        const heading = document.createElement('h2');
        heading.className = 'text-3xl font-bold text-fuchsia-400 mb-8 text-center';

        const icon = document.createElement('i');
        icon.className = `${iconClass} mr-3`;
        heading.appendChild(icon);
        heading.appendChild(document.createTextNode('Software'));

        softwareSection.appendChild(heading);

        for (const category in data.software) {
          const subHeading = document.createElement('h3');
          subHeading.className = 'text-2xl font-semibold text-fuchsia-400 mt-8 mb-6 text-center md:text-left';
          subHeading.textContent = category.charAt(0).toUpperCase() + category.slice(1);

          const grid = document.createElement('div');
          // Use two columns for software sub-categories for better spacing
          grid.className = 'grid grid-cols-1 lg:grid-cols-2 gap-8';

          data.software[category].forEach((item) => {
            grid.appendChild(createCard(item, 'software-section'));
          });

          softwareSection.appendChild(subHeading);
          softwareSection.appendChild(grid);
        }
      }

      // 3. Live Production
      populateSection('live-production-section', 'Live Production', data.live_production);

      // 4. Services
      populateSection('services-section', 'Services', data.services);
    })
    .catch((error) => console.error('Error fetching uses data:', error));
});
