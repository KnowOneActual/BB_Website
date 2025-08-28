document.addEventListener('DOMContentLoaded', () => {
    fetch('data/social-links.json')
        .then(response => response.json())
        .then(data => {
            const linksContainer = document.getElementById('links-container');
            data.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.target = '_blank';
                linkElement.className = 'link-button';

                // Create icon element
                const iconElement = document.createElement('i');
                iconElement.className = `${link.icon} link-icon`;

                // Create span for the title
                const titleElement = document.createElement('span');
                titleElement.textContent = link.title;

                linkElement.appendChild(iconElement);
                linkElement.appendChild(titleElement);
                linksContainer.appendChild(linkElement);
            });
        })
        .catch(error => console.error('Error fetching links:', error));
});