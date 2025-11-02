document.addEventListener('DOMContentLoaded', () => {
  fetch('data/daily-links.json')
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const container = document.getElementById('links-container');
      container.innerHTML = ''; // Clear loading message

      // 1. Group links by category
      const categories = data.reduce((acc, link) => {
        const category = link.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(link);
        return acc;
      }, {});

      // 2. Render sections for each category
      for (const category in categories) {
        const section = document.createElement('section');
        section.className = 'mb-8 p-6 bg-gray-800 rounded-xl shadow-lg';

        const title = document.createElement('h2');
        title.className =
          'text-2xl font-bold text-fuchsia-400 mb-6 border-b border-gray-700 pb-3';
        title.textContent = category;
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

        // 3. Render individual links
        categories[category].forEach((item) => {
          const linkElement = document.createElement('a');
          linkElement.href = item.url;
          linkElement.target = '_blank';
          linkElement.rel = 'noopener noreferrer';
          linkElement.className =
            'bg-gray-700 p-4 rounded-lg card-link shadow hover:shadow-lg hover:shadow-fuchsia-600/50';

          // Title and Icon container
          const titleContainer = document.createElement('div');
          titleContainer.className = 'flex items-center space-x-3';

          const icon = document.createElement('i');
          icon.className = item.icon || 'fa-solid fa-link';
          icon.style.color = 'rgb(232 121 249 / 1)'; // text-fuchsia-400

          const linkTitle = document.createElement('span');
          linkTitle.className = 'text-lg font-semibold';
          linkTitle.textContent = item.title;

          titleContainer.appendChild(icon);
          titleContainer.appendChild(linkTitle);

          // Arrow icon
          const arrow = document.createElement('i');
          arrow.className = 'fa-solid fa-arrow-right';
          arrow.style.color = 'rgb(192 38 211 / 1)'; // text-fuchsia-600

          linkElement.appendChild(titleContainer);
          linkElement.appendChild(arrow);

          grid.appendChild(linkElement);
        });

        section.appendChild(grid);
        container.appendChild(section);
      }
    })
    .catch((error) => {
      console.error('Error loading daily links:', error);
      container.innerHTML = `<div class="text-center text-red-500 p-8 bg-gray-800 rounded-xl">
                Sorry, I couldn't load the daily links. Please check the 'data/daily-links.json' file.
            </div>`;
    });
});
