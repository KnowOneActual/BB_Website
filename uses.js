document.addEventListener('DOMContentLoaded', () => {
  fetch('data/uses.json')
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const createCard = (item) => {
        // Create elements
        const cardDiv = document.createElement('div');
        const title = document.createElement('h4');
        const description = document.createElement('p');

        // Add classes
        cardDiv.className =
          'bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-fuchsia-600/50 transition transform hover:-translate-y-1 h-full';
        title.className = 'text-xl font-semibold text-white mb-2';
        description.className = 'text-gray-400 text-sm';

        // Set content
        title.textContent = item.name;
        description.innerHTML = item.description; // Changed to innerHTML to support bold/italic tags

        if (item.url) {
          const link = document.createElement('a');
          link.href = item.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.className = 'block h-full';
          title.className =
            'text-xl font-semibold text-fuchsia-400 hover:underline mb-2';
          link.appendChild(title);
          link.appendChild(description);
          cardDiv.appendChild(link);
        } else {
          cardDiv.appendChild(title);
          cardDiv.appendChild(description);
        }

        return cardDiv;
      };

      const populateSection = (sectionId, title, items, gridCols) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const heading = document.createElement('h2');
          heading.className =
            'text-3xl font-bold text-fuchsia-400 mb-8 text-center';
          heading.textContent = title;

          const grid = document.createElement('div');
          grid.className = `grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-8`;

          items.forEach((item) => {
            grid.appendChild(createCard(item));
          });

          section.appendChild(heading);
          section.appendChild(grid);
        }
      };

      // Populate sections
      populateSection(
        'hardware-section',
        'Hardware',
        data.hardware,
        'lg:grid-cols-3',
      );

      // Software
      const softwareSection = document.getElementById('software-section');
      if (softwareSection) {
        const heading = document.createElement('h2');
        heading.className =
          'text-3xl font-bold text-fuchsia-400 mb-8 text-center';
        heading.textContent = 'Software';
        softwareSection.appendChild(heading);

        for (const category in data.software) {
          const subHeading = document.createElement('h3');
          subHeading.className =
            'text-2xl font-semibold text-fuchsia-400 mt-8 mb-6 text-center md:text-left';
          subHeading.textContent =
            category.charAt(0).toUpperCase() + category.slice(1);

          const grid = document.createElement('div');
          grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-8';

          data.software[category].forEach((item) => {
            grid.appendChild(createCard(item));
          });

          softwareSection.appendChild(subHeading);
          softwareSection.appendChild(grid);
        }
      }

      // Live Production
      populateSection(
        'live-production-section',
        'Live Production',
        data.live_production,
        'lg:grid-cols-3',
      );

      // Services
      populateSection(
        'services-section',
        'Services',
        data.services,
        'lg:grid-cols-4',
      );
    })
    .catch((error) => console.error('Error fetching uses data:', error));
});
