document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('roomSearch');
    const floorSections = document.querySelectorAll('section.floor');

    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase();

        floorSections.forEach(function(floorSection) {
            let floorHasVisibleRooms = false;
            const roomCards = floorSection.querySelectorAll('.room-card');

            roomCards.forEach(function(card) {
                const roomName = card.querySelector('.room-name')?.textContent.toLowerCase() || '';
                const roomTag = card.querySelector('.room-tag')?.textContent.toLowerCase() || '';
                const roomCapacity = card.querySelector('.room-capacity')?.textContent.toLowerCase() || '';
                const roomNotes = card.querySelector('.room-notes')?.textContent.toLowerCase() || '';

                if (roomName.includes(searchTerm) ||
                    roomTag.includes(searchTerm) ||
                    roomCapacity.includes(searchTerm) ||
                    roomNotes.includes(searchTerm)) {
                    card.style.display = ''; // Show card
                    floorHasVisibleRooms = true;
                } else {
                    card.style.display = 'none'; // Hide card
                }
            });

            // Hide floor section if no rooms are visible within it, otherwise show
            if (floorHasVisibleRooms) {
                floorSection.style.display = '';
            } else {
                floorSection.style.display = 'none';
            }
        });
    });
});