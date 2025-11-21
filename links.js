document.addEventListener('DOMContentLoaded', () => {
  fetch('data/social-links.json')
    .then((response) => response.json())
    .then((data) => {
      const linksContainer = document.getElementById('links-container');
      data.forEach((link, index) => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.target = '_blank';
        linkElement.className = 'link-button';

        // Add this line to hide the buttons initially for the animation
        linkElement.style.opacity = '0';

        const iconElement = document.createElement('i');
        iconElement.className = `${link.icon} link-icon`;

        const titleElement = document.createElement('span');
        titleElement.textContent = link.title;

        linkElement.appendChild(iconElement);
        linkElement.appendChild(titleElement);
        linksContainer.appendChild(linkElement);

        // This is the animation part
        setTimeout(
          () => {
            linkElement.style.transition = 'opacity 0.5s ease';
            linkElement.style.opacity = '1';
          },
          100 * (index + 1),
        ); // Stagger the animation
      });
    })
    .catch((error) => console.error('Error fetching links:', error));
});
