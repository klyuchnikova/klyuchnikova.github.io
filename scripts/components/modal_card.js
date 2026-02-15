document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.querySelector('.character-modal');
    const modalCard = modal.querySelector('.character-detail-card');
    const modalPhoto = modal.querySelector('.character-detail-photo img');
    const modalName = modal.querySelector('.character-detail-name');
    const modalQuote = modal.querySelector('.character-detail-quote');
    const modalBio = modal.querySelector('.character-detail-bio');
    const modalStats = modal.querySelector('.character-detail-stats');
    const closeButton = modal.querySelector('.close-modal');

    // Add click event to all cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            // Get basic data
            const role = card.getAttribute('data-role');
            const photo = card.querySelector('.character-photo img').src;
            const name = card.querySelector('.character-name').textContent;
            const quote = card.querySelector('.character-quote').textContent;
            const fullDesc = card.querySelector('.character-full-desc').innerHTML;

            // Get skills data
            const skills = [];
            card.querySelectorAll('.skill').forEach(skill => {
                const name = skill.querySelector('.skill-name span:first-child').textContent;
                const value = skill.querySelector('.skill-name span:last-child').textContent;
                skills.push({ name, value });
            });

            // Populate modal
            modalCard.setAttribute('data-role', role);
            modalPhoto.src = photo;
            modalPhoto.alt = name;
            modalName.textContent = name;
            modalQuote.textContent = quote;
            modalBio.innerHTML = fullDesc;

            // Clear and rebuild stats
            modalStats.innerHTML = '';
            skills.forEach(skill => {
                const statItem = document.createElement('div');
                statItem.className = 'stat-item';
                statItem.innerHTML = `
                    <div class="stat-label">${skill.name}</div>
                    <div class="stat-value">${skill.value}</div>
                `;
                modalStats.appendChild(statItem);
            });

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal handlers
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});