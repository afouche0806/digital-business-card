document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the business card owner's email from localStorage
    const ownerEmail = localStorage.getItem('email');
    const ownerName = localStorage.getItem('name') || 'the card owner';

    const contactForm = document.getElementById('contact-form');

    if (!ownerEmail) {
        const formContainer = document.querySelector('.card-body');
        formContainer.innerHTML = '<h1>Error</h1><p>The owner of this card has not set up their email address yet. Cannot send message.</p>';
        return;
    }

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const visitorName = document.getElementById('contact-name').value;
        const visitorEmail = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        const subject = `Contact Form Submission from ${visitorName}`;
        const body = `You have a new message from your digital business card:\n\nFrom: ${visitorName}\nEmail: ${visitorEmail}\n\nMessage:\n${message}`;

        // Construct the mailto link
        const mailtoLink = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Redirect to the mailto link
        window.location.href = mailtoLink;
    });
});