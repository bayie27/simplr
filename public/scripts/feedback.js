// Feedback form functionality
document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const userName = document.getElementById('userName');
    const userMessage = document.getElementById('userMessage');
    const submissionSummary = document.getElementById('submissionSummary');
    const summaryText = document.getElementById('summaryText');
    const viewFeedbackBtn = document.getElementById('viewFeedbackBtn');
    const feedbackHistory = document.getElementById('feedbackHistory');
    const feedbackList = document.getElementById('feedbackList');
    const clearFeedbackBtn = document.getElementById('clearFeedbackBtn');
    
    // Load existing feedback from localStorage
    let feedbackHistoryData = Storage.get('simplr_feedback') || [];
    
    // Event listeners
    feedbackForm.addEventListener('submit', handleSubmit);
    viewFeedbackBtn.addEventListener('click', toggleFeedbackHistory);
    clearFeedbackBtn.addEventListener('click', clearAllFeedback);

    // Helper function to generate a unique ID
    function generateId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Helper function to format the date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        const name = userName.value.trim();
        const message = userMessage.value.trim();
        
        // Validation - check if message is empty
        if (message === '') {
            alert('Please enter your feedback message!');
            userMessage.focus();
            return;
        }
        
        // Create feedback object
        const feedback = {
            id: generateId(),
            name: name || 'Anonymous',
            message: message,
            submittedAt: new Date().toISOString()
        };
        
        // Add to feedback history
        feedbackHistoryData.push(feedback);
        
        // Save to localStorage
        Storage.set('simplr_feedback', feedbackHistoryData);
        
        // Show submission summary
        const displayName = name || 'Anonymous';
        summaryText.innerHTML = `
            <strong>Name:</strong> ${displayName}<br>
            <strong>Message:</strong> <span class="summary-message">${message}</span><br>
            <strong>Submitted:</strong> ${formatDate(feedback.submittedAt)}<br><br>
            Your feedback has been saved locally and will help us improve Simplr!
        `;
        
        submissionSummary.style.display = 'block';
        
        // Clear form
        feedbackForm.reset();
        
        // Scroll to summary
        submissionSummary.scrollIntoView({ behavior: 'smooth' });
        
        // Hide summary after 10 seconds
        setTimeout(() => {
            submissionSummary.style.display = 'none';
        }, 10000);
        
        // Update feedback history if it's currently visible
        if (feedbackHistory.style.display === 'block') {
            renderFeedbackHistory();
        }
    }
    
    function toggleFeedbackHistory() {
        if (feedbackHistory.style.display === 'none' || feedbackHistory.style.display === '') {
            renderFeedbackHistory();
            feedbackHistory.style.display = 'block';
            viewFeedbackBtn.textContent = 'Hide Previous Feedback';
        } else {
            feedbackHistory.style.display = 'none';
            viewFeedbackBtn.textContent = 'View Previous Feedback';
        }
    }
    
    function renderFeedbackHistory() {
        const feedbacks = Storage.get('simplr_feedback') || [];
        
        if (feedbacks.length === 0) {
            feedbackList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No feedback submitted yet.</p>';
            return;
        }
        
        feedbackList.innerHTML = '';
        
        // Sort by most recent first
        feedbacks.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        
        feedbacks.forEach(feedback => {
            const feedbackCard = document.createElement('div');
            feedbackCard.className = 'feedback-card';
            feedbackCard.innerHTML = `
                <div class="feedback-header">
                    <strong>${feedback.name}</strong>
                    <span class="feedback-date">${formatDate(feedback.submittedAt)}</span>
                </div>
                <div class="feedback-message">${feedback.message}</div>
            `;
            feedbackList.appendChild(feedbackCard);
        });
    }
    
    function clearAllFeedback() {
        if (confirm('Are you sure you want to clear all feedback history?')) {
            Storage.remove('simplr_feedback');
            feedbackHistoryData = [];
            feedbackHistory.style.display = 'none';
            viewFeedbackBtn.textContent = 'View Previous Feedback';
        }
    }
    
    // Character counter for message
    userMessage.setAttribute('maxlength', 500);
    userMessage.addEventListener('input', function() {
        const maxLength = 500;
        const currentLength = this.value.length;
        if (currentLength > maxLength) {
            this.value = this.value.slice(0, maxLength);
        }
        
        // Create or update character counter
        let counter = document.getElementById('messageCounter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'messageCounter';
            counter.style.fontSize = '0.85rem';
            counter.style.color = '#9ca3af';
            counter.style.textAlign = 'right';
            counter.style.marginTop = '0.5rem';
            this.parentNode.appendChild(counter);
        }
        
        counter.textContent = `${currentLength}/${maxLength} characters`;
        
        // Change color if approaching limit
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#ef4444';
        } else if (currentLength > maxLength * 0.8) {
            counter.style.color = '#f59e0b';
        } else {
            counter.style.color = '#9ca3af';
        }
    });
});