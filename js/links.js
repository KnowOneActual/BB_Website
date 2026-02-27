document.addEventListener('DOMContentLoaded', () => {
  fetch('data/social-links.json')
    .then((response) => response.json())
    .then((data) => {
      const linksContainer = document.getElementById('links-container');
      data.forEach((link, index) => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        linkElement.className = 'link-button fade-in-item';
        
        // Hide initially and let the animation handle it
        linkElement.style.opacity = '0';
        linkElement.style.animationDelay = `${index * 0.1}s`;

        const iconElement = document.createElement('i');
        iconElement.className = `${link.icon} link-icon`;

        const titleElement = document.createElement('span');
        titleElement.textContent = link.title;

        linkElement.appendChild(iconElement);
        linkElement.appendChild(titleElement);
        linksContainer.appendChild(linkElement);
      });
    })
    .catch((error) => console.error('Error fetching links:', error));
});
