document.addEventListener('DOMContentLoaded', () => {
    fetch('data/v2_links.json')
        .then(response => response.json())
        .then(data => {
            const linksContainer = document.getElementById('links-container');
            data.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.target = '_blank';
                linkElement.className = 'block bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 px-8 rounded-full transition duration-300 transform hover:scale-105';
                linkElement.textContent = link.title;
                linksContainer.appendChild(linkElement);
            });
        })
        .catch(error => console.error('Error fetching links:', error));
});