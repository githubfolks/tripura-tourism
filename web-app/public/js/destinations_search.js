
// Destination Page Search & Filter Logic
const destGrid = document.getElementById('destGrid');
if (destGrid) {
    const searchInput = document.getElementById('searchInput');
    const regionFilter = document.getElementById('regionFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const cards = destGrid.getElementsByClassName('dest-card');

    function filterDestinations() {
        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedRegion = regionFilter ? regionFilter.value : 'all';
        const selectedExperience = experienceFilter ? experienceFilter.value : 'all';

        Array.from(cards).forEach(card => {
            const title = card.querySelector('.dest-title').textContent.toLowerCase();
            const region = card.dataset.region || '';
            const experience = card.dataset.experience || '';

            const matchesSearch = title.includes(searchText);
            const matchesRegion = selectedRegion === 'all' || region === selectedRegion;
            const matchesExperience = selectedExperience === 'all' || experience === selectedExperience;

            if (matchesSearch && matchesRegion && matchesExperience) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Event Listeners
    if (searchInput) searchInput.addEventListener('input', filterDestinations);
    if (regionFilter) regionFilter.addEventListener('change', filterDestinations);
    if (experienceFilter) experienceFilter.addEventListener('change', filterDestinations);
}
