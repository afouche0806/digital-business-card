document.addEventListener('DOMContentLoaded', function() {
    const jobListContainer = document.getElementById('job-list');
    const jobs = JSON.parse(localStorage.getItem('jobListData')) || [];

    if (jobs.length === 0) {
        jobListContainer.innerHTML = '<p class="no-data-prompt">You have no jobs saved. <a href="add-job.html">Add one!</a></p>';
        return;
    }

    // Sort jobs by creation date, newest first
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';

        // Add a class based on the job status for styling
        jobCard.classList.add('status-' + job.status.toLowerCase().replace(' ', '-'));

        jobCard.innerHTML = `
            <div class="job-card-header">
                <h3>${job.customerName}</h3>
                <span class="job-status">${job.status}</span>
            </div>
            <div class="job-card-body">
                <p><strong>Address:</strong> ${job.address}</p>
                <p><strong>Description:</strong> ${job.description}</p>
            </div>
            <div class="job-card-footer">
                <small>Created: ${new Date(job.createdAt).toLocaleDateString()}</small>
                <button class="share-button">Share</button>
            </div>
        `;

        const shareButton = jobCard.querySelector('.share-button');
        shareButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click events if any
            const shareUrl = `${window.location.origin}/job-status.html?id=${job.id}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                shareButton.textContent = 'Copied!';
                setTimeout(() => {
                    shareButton.textContent = 'Share';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy link. Please copy it manually: ' + shareUrl);
            });
        });

        jobListContainer.appendChild(jobCard);
    });
});
