document.addEventListener('DOMContentLoaded', () => {
  // Fade-in animation logic
  const initializeFadeIn = () => {
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1 };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, appearOptions);
    faders.forEach((fader) => appearOnScroll.observe(fader));
  };

  fetch('data/uses.json')
    .then((response) => response.json())
    .then((data) => {
      const createCard = (item) => {
        const cardLink = document.createElement('a');
        cardLink.href = item.url || '#';
        if (item.url) cardLink.target = '_blank';
        cardLink.rel = 'noopener noreferrer';
        cardLink.className =
          'group block p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-indigo-500/50 hover:bg-gray-800/50 transition duration-300 h-full';

        const nameEl = document.createElement('h4');
        nameEl.className = 'text-lg font-bold text-white group-hover:text-indigo-400 transition';
        nameEl.textContent = item.name;

        const descEl = document.createElement('p');
        descEl.className = 'text-gray-400 text-sm mt-2 leading-relaxed';
        descEl.textContent = item.description;

        cardLink.appendChild(nameEl);
        cardLink.appendChild(descEl);
        return cardLink;
      };

      const populateSection = (sectionId, title, items, gridCols = 'lg:grid-cols-3') => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const heading = document.createElement('h2');
        heading.className = 'text-3xl font-bold text-white mb-8 text-center tracking-tight';
        heading.textContent = title;

        const grid = document.createElement('div');
        grid.className = `grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`;
        items.forEach((item) => grid.appendChild(createCard(item)));

        section.appendChild(heading);
        section.appendChild(grid);
      };

      // Populate sections
      populateSection('hardware-section', 'Hardware', data.hardware, 'lg:grid-cols-3');

      const softwareSection = document.getElementById('software-section');
      if (softwareSection) {
        const heading = document.createElement('h2');
        heading.className = 'text-3xl font-bold text-white mb-12 text-center tracking-tight';
        heading.textContent = 'Software';
        softwareSection.appendChild(heading);

        for (const category in data.software) {
          const subHeading = document.createElement('h3');
          subHeading.className =
            'text-xl font-semibold text-indigo-400 mt-10 mb-6 uppercase tracking-wider text-sm border-l-4 border-indigo-500 pl-4';
          subHeading.textContent = category;
          softwareSection.appendChild(subHeading);

          const grid = document.createElement('div');
          grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
          data.software[category].forEach((item) => grid.appendChild(createCard(item)));
          softwareSection.appendChild(grid);
        }
      }

      populateSection('live-production-section', 'Live Production', data.live_production, 'lg:grid-cols-2');
      populateSection('services-section', 'Services', data.services, 'lg:grid-cols-4');

      initializeFadeIn();
    });
});
