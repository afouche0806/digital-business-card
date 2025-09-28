document.addEventListener('DOMContentLoaded', function() {
    const portfolioListContainer = document.getElementById('portfolio-list');
    const portfolioItems = JSON.parse(localStorage.getItem('portfolioData')) || [];

    if (portfolioItems.length === 0) {
        portfolioListContainer.innerHTML = '<p class="no-data-prompt">You have no portfolio items saved. <a href="add-portfolio-item.html">Add one!</a></p>';
        return;
    }

    // Sort portfolio items by creation date, newest first
    portfolioItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    portfolioItems.forEach(item => {
        const portfolioCard = document.createElement('div');
        portfolioCard.className = 'portfolio-card';

        portfolioCard.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="portfolio-image">
            <div class="portfolio-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <small>Added: ${new Date(item.createdAt).toLocaleDateString()}</small>
            </div>
        `;
        portfolioListContainer.appendChild(portfolioCard);
    });
});
