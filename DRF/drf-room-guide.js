document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('roomSearch');
    const floorSections = document.querySelectorAll('section.floor');
    const announcer = document.getElementById('search-announcer');
    const noResultsMessage = document.getElementById('no-results');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        let totalVisibleRooms = 0;

        floorSections.forEach(function(floorSection) {
            let floorHasVisibleRooms = false;
            const roomCards = floorSection.querySelectorAll('.room-card');

            roomCards.forEach(function(card) {
                const cardText = card.textContent.toLowerCase();

                if (cardText.includes(searchTerm)) {
                    card.style.display = ''; // Show card
                    floorHasVisibleRooms = true;
                    totalVisibleRooms++;
                } else {
                    card.style.display = 'none'; // Hide card
                }
            });

            // Hide floor section if no rooms are visible within it, otherwise show
            floorSection.style.display = floorHasVisibleRooms ? '' : 'none';
        });

        // Announce results for screen readers
        if (announcer) {
            if (searchTerm === '') {
                announcer.textContent = '';
            } else if (totalVisibleRooms === 0) {
                announcer.textContent = 'No rooms found matching your search.';
            } else if (totalVisibleRooms === 1) {
                announcer.textContent = 'Found 1 matching room.';
            } else {
                announcer.textContent = `Found ${totalVisibleRooms} matching rooms.`;
            }
        }
        
        // Show or hide the "no results" message
        if (noResultsMessage) {
            noResultsMessage.style.display = (totalVisibleRooms === 0 && searchTerm !== '') ? 'block' : 'none';
        }
    });
});