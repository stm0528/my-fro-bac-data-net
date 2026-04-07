document.getElementById('text-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = document.getElementById('content-input');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('span');
    const btnLoader = document.getElementById('btn-loader');
    const statusMsg = document.getElementById('status-message');

    const content = input.value.trim();

    if (!content) return;

    // Loading State
    btnText.textContent = 'Saving...';
    btnLoader.classList.remove('hidden');
    submitBtn.disabled = true;
    
    statusMsg.classList.remove('show');
    statusMsg.className = '';

    try {
        const response = await fetch('/api/texts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });

        const data = await response.json();

        if (response.ok) {
            statusMsg.textContent = data.message || 'Saved successfully!';
            statusMsg.classList.add('status-success', 'show');
            input.value = ''; // Reset form
        } else {
            statusMsg.textContent = data.error || 'Failed to save.';
            statusMsg.classList.add('status-error', 'show');
        }
    } catch (error) {
        statusMsg.textContent = 'Network error. Please try again.';
        statusMsg.classList.add('status-error', 'show');
    } finally {
        // Reset button state
        setTimeout(() => {
            btnText.textContent = 'Save to Database';
            btnLoader.classList.add('hidden');
            submitBtn.disabled = false;
        }, 500); // slight delay for smooth visual transition
        
        // Hide success message after 3 seconds
        if (statusMsg.classList.contains('status-success')) {
            setTimeout(() => {
                statusMsg.classList.remove('show');
            }, 3000);
        }
    }
});
