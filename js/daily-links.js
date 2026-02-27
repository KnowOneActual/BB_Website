document.addEventListener('DOMContentLoaded', () => {
    fetch('data/daily-links.json')
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('links-container');
        container.innerHTML = '';
  
        data.categories.forEach(category => {
          const section = document.createElement('section');
          section.className = 'fade-in';
  
          const title = document.createElement('h2');
          title.className = 'text-2xl font-bold text-indigo-400 mb-8 border-b border-gray-800 pb-4 tracking-tight';
          title.textContent = category.name;
          section.appendChild(title);
  
          const grid = document.createElement('div');
          grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
  
          category.links.forEach(link => {
            const card = document.createElement('a');
            card.href = link.url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.className = 'bg-gray-900 border border-gray-800 p-5 rounded-xl card-link hover:border-indigo-500/50 transition-all duration-300';
  
            const leftSide = document.createElement('div');
            leftSide.className = 'flex items-center gap-4';
  
            const icon = document.createElement('i');
            icon.className = `${link.icon} text-lg text-indigo-400`;
            
            const label = document.createElement('span');
            label.className = 'font-semibold text-gray-100';
            label.textContent = link.name;
  
            leftSide.appendChild(icon);
            leftSide.appendChild(label);
  
            const arrow = document.createElement('i');
            arrow.className = 'fa-solid fa-chevron-right text-xs text-gray-600 group-hover:text-indigo-400 transition-colors';
  
            card.appendChild(leftSide);
            card.appendChild(arrow);
            grid.appendChild(card);
          });
  
          section.appendChild(grid);
          container.appendChild(section);
        });

        // Trigger fade-in appear
        setTimeout(() => {
          document.querySelectorAll('.fade-in').forEach(el => el.classList.add('appear'));
        }, 100);
      })
      .catch(error => {
        console.error('Error loading links:', error);
        document.getElementById('links-container').innerHTML = 
          '<p class="text-center text-red-400">Error loading links. Please try again later.</p>';
      });
  });