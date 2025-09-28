document.getElementById('add-portfolio-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const itemTitle = document.getElementById('itemTitle').value;
    const itemDescription = document.getElementById('itemDescription').value;
    const itemImageFile = document.getElementById('itemImage').files[0];

    const messageEl = document.getElementById('message');
    messageEl.textContent = 'Saving...';

    if (itemImageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newPortfolioItem = {
                id: Date.now(), // Simple unique ID
                title: itemTitle,
                description: itemDescription,
                image: e.target.result,
                createdAt: new Date().toISOString()
            };

            const portfolioItems = JSON.parse(localStorage.getItem('portfolioData')) || [];
            portfolioItems.push(newPortfolioItem);
            localStorage.setItem('portfolioData', JSON.stringify(portfolioItems));

            window.location.href = 'portfolio.html';
        };
        reader.readAsDataURL(itemImageFile);
    } else {
        messageEl.textContent = 'Please select an image for your portfolio item.';
        messageEl.style.color = 'red';
    }
});
