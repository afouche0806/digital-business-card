document.getElementById('add-job-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const newJob = {
        id: Date.now(), // Simple unique ID
        customerName: document.getElementById('customerName').value,
        address: document.getElementById('address').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value,
        createdAt: new Date().toISOString()
    };

    // Get existing jobs or initialize an empty array
    const jobs = JSON.parse(localStorage.getItem('jobListData')) || [];

    // Add the new job
    jobs.push(newJob);

    // Save the updated list back to localStorage
    localStorage.setItem('jobListData', JSON.stringify(jobs));

    // Redirect to the job list page
    window.location.href = 'jobs.html';
});
