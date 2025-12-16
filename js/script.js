function updateCarousel(currentIndex) {
    const headers = document.querySelectorAll('h1');
    headers.forEach(h => h.classList.remove('selected'));
    const headerIndex = currentIndex + 1; // first h1 is brand/title
    if (headers[headerIndex]) headers[headerIndex].classList.add('selected');

    const tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach(t => t.classList.remove('selected'));
    const target = tiles[currentIndex];
    if (target) target.classList.add('selected');

    const slider = document.querySelector('.tiles');
    const searchbar = document.querySelector('.searchbar');
    if (!slider) return;

    // Compute transform so the target tile is centered in the viewport.
    if (target) {
        const tileRect = target.getBoundingClientRect();
        const viewportCenter = window.innerWidth / 2;

        // Current translateX applied to slider (read from computed transform)
        const style = window.getComputedStyle(slider);
        let currentX = 0;
        try {
            const matrix = new DOMMatrixReadOnly(style.transform);
            currentX = matrix.m41;
        } catch (e) {
            // fallback: parse matrix string
            const m = style.transform.match(/matrix\((.+)\)/);
            if (m) {
                const vals = m[1].split(',');
                currentX = parseFloat(vals[4]);
            }
        }

        const targetCenterOnScreen = tileRect.left + (tileRect.width / 2);
        const delta = targetCenterOnScreen - viewportCenter;
        const newTranslate = currentX - delta;
        slider.style.transform = `translateX(${newTranslate}px)`;
    }

    if (searchbar) searchbar.style.display = (currentIndex === 0) ? 'flex' : 'none';
}

// Keep carousel position correct on resize
window.addEventListener('resize', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const selectedIndex = tiles.findIndex(t => t.classList.contains('selected'));
    if (selectedIndex >= 0) updateCarousel(selectedIndex);
});

// --- Games library interactions ---
function initLibraryHandlers() {
    const browseBtn = document.querySelector('.rectangle.eight');
    const libraryOverlay = document.getElementById('libraryOverlay');
    if (!browseBtn || !libraryOverlay) return;

    const closeBtn = libraryOverlay.querySelector('.close-btn');

    const openLibrary = () => {
        libraryOverlay.classList.add('open');
        libraryOverlay.setAttribute('aria-hidden', 'false');
    };
    const closeLibrary = () => {
        libraryOverlay.classList.remove('open');
        libraryOverlay.setAttribute('aria-hidden', 'true');
    };

    browseBtn.addEventListener('click', openLibrary);
    closeBtn.addEventListener('click', closeLibrary);

    libraryOverlay.addEventListener('click', (e) => {
        if (e.target === libraryOverlay) closeLibrary();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLibrary();
    });

    // Game selection
    const cards = libraryOverlay.querySelectorAll('.game-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
}

// Initialize handlers once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLibraryHandlers);
} else {
    initLibraryHandlers();
}