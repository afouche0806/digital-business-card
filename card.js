document.addEventListener('DOMContentLoaded', function() {
    const savedData = localStorage.getItem('businessCardData');

    if (savedData) {
        const cardData = JSON.parse(savedData);

        if (cardData.theme) {
            applyTheme(cardData.theme);
        }

        if (cardData.layout && cardData.layout !== 'default') {
            document.querySelector('.card').classList.add(`layout-${cardData.layout}`);
        }

        function applyTheme(themeName) {
            const root = document.documentElement;

            // Clear all previously set theme variables to ensure a clean slate
            const themeVariables = [
                '--background-color',
                '--card-background',
                '--text-color',
                '--text-color-light',
                '--card-footer-bg',
                '--primary-color',
                '--primary-color-dark'
            ];
            themeVariables.forEach(variable => root.style.removeProperty(variable));

            let primaryColorToApply = cardData.primaryColor || '#007bff';
            let primaryColorDarkToApply = '#0056b3'; // Default darker color

            // Helper to calculate darker color
            const calculateDarkerColor = (color) => {
                let usePound = false;
                if (color[0] == "#") {
                    color = color.slice(1);
                    usePound = true;
                }
                const num = parseInt(color, 16);
                let r = (num >> 16) - 20;
                if (r < 0) r = 0;
                let b = ((num >> 8) & 0x00FF) - 20;
                if (b < 0) b = 0;
                let g = (num & 0x0000FF) - 20;
                if (g < 0) g = 0;
                return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
            };

            if (cardData.primaryColor) {
                primaryColorDarkToApply = calculateDarkerColor(cardData.primaryColor);
            }

            switch (themeName) {
                case 'theme-dark':
                    root.style.setProperty('--background-color', '#121212');
                    root.style.setProperty('--card-background', '#1e1e1e');
                    root.style.setProperty('--text-color', '#e0e0e0');
                    root.style.setProperty('--text-color-light', '#a0a0a0');
                    root.style.setProperty('--card-footer-bg', '#2a2a2a');
                    root.style.setProperty('--primary-color', '#1a73e8');
                    root.style.setProperty('--primary-color-dark', '#0f52b6');
                    break;
                case 'theme-ocean':
                    root.style.setProperty('--background-color', '#e0f7fa');
                    root.style.setProperty('--card-background', '#ffffff');
                    root.style.setProperty('--text-color', '#004d40');
                    root.style.setProperty('--text-color-light', '#00695c');
                    root.style.setProperty('--card-footer-bg', '#b2ebf2');
                    root.style.setProperty('--primary-color', '#00838f');
                    root.style.setProperty('--primary-color-dark', '#005662');
                    break;
                case 'default':
                default:
                    root.style.setProperty('--background-color', '#f0f2f5');
                    root.style.setProperty('--card-background', '#ffffff');
                    root.style.setProperty('--text-color', '#333');
                    root.style.setProperty('--text-color-light', '#777');
                    root.style.setProperty('--card-footer-bg', '#f8f9fa');
                    root.style.setProperty('--primary-color', primaryColorToApply);
                    root.style.setProperty('--primary-color-dark', primaryColorDarkToApply);
                    break;
            }
        }

        document.getElementById('name').textContent = cardData.name || 'Your Name';
        document.getElementById('title').textContent = cardData.title || 'Your Title';

        if (cardData.email) {
            const emailLink = document.getElementById('email');
            emailLink.href = 'mailto:' + cardData.email;
            emailLink.textContent = cardData.email;
            document.getElementById('email-container').style.display = 'block';
        }

        if (cardData.phone) {
            const phoneLink = document.getElementById('phone');
            phoneLink.href = 'tel:' + cardData.phone;
            phoneLink.textContent = cardData.phone;
            document.getElementById('phone-container').style.display = 'block';
        }

        if (cardData.socialLinks && cardData.socialLinks.length > 0) {
            const socialLinksContainer = document.getElementById('social-links');
            socialLinksContainer.innerHTML = ''; // Clear any existing links

            const getIconForPlatform = (platform) => {
                const p = platform.toLowerCase();
                if (p.includes('linkedin')) return 'bi-linkedin';
                if (p.includes('github')) return 'bi-github';
                if (p.includes('twitter') || p.includes('x.com')) return 'bi-twitter-x';
                if (p.includes('facebook')) return 'bi-facebook';
                if (p.includes('instagram')) return 'bi-instagram';
                if (p.includes('youtube')) return 'bi-youtube';
                if (p.includes('behance')) return 'bi-behance';
                if (p.includes('dribbble')) return 'bi-dribbble';
                return 'bi-link-45deg'; // Default icon
            };

            cardData.socialLinks.forEach(link => {
                const linkEl = document.createElement('a');
                linkEl.href = link.url;
                linkEl.className = 'social-link';
                linkEl.target = '_blank';
                linkEl.setAttribute('aria-label', link.platform);

                const iconEl = document.createElement('i');
                iconEl.className = `bi ${getIconForPlatform(link.platform)}`;
                linkEl.appendChild(iconEl);
                
                socialLinksContainer.appendChild(linkEl);
            });
        }

        if (cardData.profilePic) {
            document.getElementById('profile-pic').src = cardData.profilePic;
        }

        if (cardData.companyLogo) {
            const companyLogoImg = document.getElementById('company-logo');
            companyLogoImg.src = cardData.companyLogo;
            companyLogoImg.style.display = 'block';
        }

        if (cardData.description) {
            document.getElementById('description-text').textContent = cardData.description;
            document.querySelector('.description-section').style.display = 'block';
        }

        // Share Card Button Logic
        const shareButton = document.getElementById('share-card-button');
        if (shareButton) {
            shareButton.addEventListener('click', async () => {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: cardData.name + ' - Digital Business Card',
                            text: 'Check out my digital business card!',
                            url: window.location.href,
                        });
                        console.log('Digital business card shared successfully!');
                    } catch (error) {
                        console.error('Error sharing digital business card:', error);
                    }
                } else {
                    // Fallback for browsers that do not support Web Share API
                    // For simplicity, we'll just copy the URL to clipboard
                    try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard! You can now share it.');
                    } catch (err) {
                        console.error('Failed to copy: ', err);
                        alert('Could not copy link. Please copy it manually from the address bar.');
                    }
                }
            });
        // VCard Generation Logic
        const saveVCardBtn = document.getElementById('save-vcard-btn');
        if (saveVCardBtn) {
            saveVCardBtn.addEventListener('click', () => {
                const name = cardData.name || '';
                const title = cardData.title || '';
                const email = cardData.email || '';
                const phone = cardData.phone || '';

                let vCardString = "BEGIN:VCARD\n";
                vCardString += "VERSION:3.0\n";
                vCardString += `FN:${name}\n`;
                vCardString += `TITLE:${title}\n`;
                if (email) {
                    vCardString += `EMAIL:${email}\n`;
                }
                if (phone) {
                    vCardString += `TEL:${phone}\n`;
                }
                vCardString += "END:VCARD";

                const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
                const downloadUrl = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `${name.replace(/ /g, '') || 'contact'}.vcf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(downloadUrl);
            });
        }

    } else {
        // If no data, hide the card details and show a setup prompt.
        document.querySelector('.card-header').style.display = 'none';
        // document.querySelector('.card-footer').style.display = 'none'; // Removed this line
        document.querySelector('#qrcode-container').style.display = 'none';
        
        const cardBody = document.querySelector('.card-body');
        cardBody.innerHTML = '<div class="no-data-prompt">' +
                               '<h2>Welcome!</h2>' +
                               '<p>Your digital business card is not set up yet.</p>' +
                               '<a href="setup.html" class="cta-button">Set Up Your Card</a>' +
                               '</div>';
    }
});
