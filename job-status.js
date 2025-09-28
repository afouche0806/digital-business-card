document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('id');

    const jobTitleEl = document.getElementById('job-title');
    const jobStatusEl = document.getElementById('job-status');
    const jobDescriptionEl = document.getElementById('job-description');
    const jobAddressEl = document.getElementById('job-address');
    const jobDateEl = document.getElementById('job-date');
    const errorContainer = document.getElementById('error-container');
    const jobDetailsContainer = document.getElementById('job-details');

    if (!jobId) {
        showError('No job ID provided.');
        return;
    }

    const allJobs = JSON.parse(localStorage.getItem('jobListData')) || [];
    const job = allJobs.find(j => j.id === jobId);

    if (job) {
        jobDetailsContainer.style.display = 'block';
        jobTitleEl.textContent = `Status for: ${job.customerName}`;
        jobStatusEl.textContent = job.status;
        jobStatusEl.className = 'job-status status-' + job.status.toLowerCase().replace(' ', '-');
        jobDescriptionEl.textContent = job.description;
        jobAddressEl.textContent = `Address: ${job.address}`;
        jobDateEl.textContent = `Job Added: ${new Date(job.createdAt).toLocaleDateString()}`;
    } else {
        showError('Job not found. The link may be invalid or the job may have been deleted.');
    }

    function showError(message) {
        jobDetailsContainer.style.display = 'none';
        errorContainer.style.display = 'block';
        errorContainer.textContent = message;
    }
});
