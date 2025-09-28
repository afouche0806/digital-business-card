document.addEventListener('DOMContentLoaded', function() {
    loadExistingData();

    document.getElementById('add-social-link').addEventListener('click', function() {
        addSocialLinkInput();
    });

    document.getElementById('setup-form').addEventListener('submit', function(event) {
        event.preventDefault();
        saveCardData();
    });
});

function addSocialLinkInput(platform = '', url = '') {
    const container = document.getElementById('social-links-container');
    const socialLinkDiv = document.createElement('div');
    socialLinkDiv.className = 'social-link-entry';

    socialLinkDiv.innerHTML = `
        <input type="text" class="social-platform" placeholder="Platform (e.g., LinkedIn)" value="${platform}">
        <input type="url" class="social-url" placeholder="URL" value="${url}">
        <button type="button" class="remove-social-link">Remove</button>
    `;

    container.appendChild(socialLinkDiv);

    socialLinkDiv.querySelector('.remove-social-link').addEventListener('click', function() {
        socialLinkDiv.remove();
    });
}

function saveCardData() {
    const themeSelect = document.getElementById('theme-select');
    const layoutSelect = document.getElementById('layout-select');
    const primaryColorInput = document.getElementById('primary-color');
    const nameInput = document.getElementById('name');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const messageEl = document.getElementById('message');

    if (!name || !email) {
        messageEl.textContent = 'Name and Email are required.';
        messageEl.style.color = 'red';
        return;
    }

    messageEl.textContent = 'Saving...';
    messageEl.style.color = 'inherit';

    const socialLinks = [];
    document.querySelectorAll('.social-link-entry').forEach(entry => {
        const platform = entry.querySelector('.social-platform').value;
        const url = entry.querySelector('.social-url').value;
        if (platform && url) {
            socialLinks.push({ platform, url });
        }
    });

    const cardData = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        description: document.getElementById('description').value,
        socialLinks: socialLinks,
        layout: layoutSelect.value,
        primaryColor: primaryColorInput.value,
        theme: themeSelect.value
    };

    const profilePicFile = document.getElementById('profilePic').files[0];
    const companyLogoFile = document.getElementById('companyLogo').files[0];

    let filesToProcess = 0;
    let filesProcessed = 0;

    const existingData = JSON.parse(localStorage.getItem('businessCardData'));

    const checkAndSave = () => {
        if (filesToProcess === filesProcessed) {
            localStorage.setItem('businessCardData', JSON.stringify(cardData));
            displaySaveSuccess();
        }
    };

    // Handle Profile Picture
    if (profilePicFile) {
        filesToProcess++;
        const reader = new FileReader();
        reader.onload = function(e) {
            cardData.profilePic = e.target.result;
            filesProcessed++;
            checkAndSave();
        };
        reader.readAsDataURL(profilePicFile);
    } else if (existingData && existingData.profilePic) {
        cardData.profilePic = existingData.profilePic;
    }

    // Handle Company Logo
    if (companyLogoFile) {
        filesToProcess++;
        const reader = new FileReader();
        reader.onload = function(e) {
            cardData.companyLogo = e.target.result;
            filesProcessed++;
            checkAndSave();
        };
        reader.readAsDataURL(companyLogoFile);
    } else if (existingData && existingData.companyLogo) {
        cardData.companyLogo = existingData.companyLogo;
    }

    // If no files were selected, or only existing data was used, save immediately
    if (filesToProcess === 0) {
        localStorage.setItem('businessCardData', JSON.stringify(cardData));
        displaySaveSuccess();
    }
}

function loadExistingData() {
    const existingData = JSON.parse(localStorage.getItem('businessCardData'));
    const messageEl = document.getElementById('message');
    messageEl.innerHTML += '<br>Loaded Data: ' + JSON.stringify(existingData);

    if (existingData) {
        document.getElementById('title').value = existingData.title || '';
        document.getElementById('phone').value = existingData.phone || '';
        document.getElementById('description').value = existingData.description || '';
        document.getElementById('primaryColor').value = existingData.primaryColor || '#007bff';

        if (existingData.theme) {
            themeSelect.value = existingData.theme;
        }

        if (existingData.layout) {
            layoutSelect.value = existingData.layout;
        }

        if (existingData.socialLinks) {
            existingData.socialLinks.forEach(link => {
                addSocialLinkInput(link.platform, link.url);
            });
        }

        if (existingData.companyLogo) {
            const companyLogoPreview = document.getElementById('companyLogoPreview');
            companyLogoPreview.src = existingData.companyLogo;
            companyLogoPreview.style.display = 'block';
        }

        if (existingData.profilePic) {
            const profilePicPreview = document.getElementById('profilePicPreview');
            profilePicPreview.src = existingData.profilePic;
            profilePicPreview.style.display = 'block';
        }
    }
}

function displaySaveSuccess() {
    const messageEl = document.getElementById('message');
    const savedDataRaw = localStorage.getItem('businessCardData');
    messageEl.innerHTML = 'Your card has been saved! You can view it now.<br>Saved Data: ' + savedDataRaw;
    messageEl.style.color = 'green';

    if (!document.getElementById('view-card-link')) {
        const viewLink = document.createElement('a');
        viewLink.id = 'view-card-link';
        viewLink.href = 'index.html';
        viewLink.textContent = 'View your card';
        viewLink.style.display = 'block';
        viewLink.style.marginTop = '10px';
        messageEl.parentNode.appendChild(viewLink);
    }
}
