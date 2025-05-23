// Pomodoro Timer functionality
document.addEventListener('DOMContentLoaded', function() {
    const workTimeDisplay = document.getElementById('workTime');
    const breakTimeDisplay = document.getElementById('breakTime');
    const workIncrement = document.getElementById('workIncrement');
    const workDecrement = document.getElementById('workDecrement');
    const breakIncrement = document.getElementById('breakIncrement');
    const breakDecrement = document.getElementById('breakDecrement');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerMode = document.getElementById('timerMode');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const sessionCount = document.getElementById('sessionCount');
    
    // Load settings from localStorage
    let settings = Storage.get('simplr_pomodoro_settings') || {
        workTime: 25,
        breakTime: 5,
        sessions: 0
    };
    
    let currentTime = settings.workTime * 60; // Convert to seconds
    let isRunning = false;
    let isWorkTime = true;
    let timerInterval = null;
    
    // Initialize display
    updateDisplay();
    updateSessionCount();
    updateButtonStates();
    
    // Event listeners for increment/decrement buttons
    workIncrement.addEventListener('click', () => {
        if (settings.workTime < 60) {
            settings.workTime++;
            updateDisplay();
            saveSettings();
            if (!isRunning && isWorkTime) {
                currentTime = settings.workTime * 60;
                updateTimerDisplay();
            }
        }
    });
    
    workDecrement.addEventListener('click', () => {
        if (settings.workTime > 1) {
            settings.workTime--;
            updateDisplay();
            saveSettings();
            if (!isRunning && isWorkTime) {
                currentTime = settings.workTime * 60;
                updateTimerDisplay();
            }
        }
    });
    
    breakIncrement.addEventListener('click', () => {
        if (settings.breakTime < 30) {
            settings.breakTime++;
            updateDisplay();
            saveSettings();
            if (!isRunning && !isWorkTime) {
                currentTime = settings.breakTime * 60;
                updateTimerDisplay();
            }
        }
    });
    
    breakDecrement.addEventListener('click', () => {
        if (settings.breakTime > 1) {
            settings.breakTime--;
            updateDisplay();
            saveSettings();
            if (!isRunning && !isWorkTime) {
                currentTime = settings.breakTime * 60;
                updateTimerDisplay();
            }
        }
    });
    
    // Timer control event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    function updateDisplay() {
        workTimeDisplay.textContent = settings.workTime;
        breakTimeDisplay.textContent = settings.breakTime;
    }
    
    function updateTimerDisplay() {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerMode.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    }
    
    function updateSessionCount() {
        sessionCount.textContent = `Sessions: ${settings.sessions}`;
    }
    
    function updateButtonStates() {
        // Remove all state classes
        startBtn.classList.remove('active', 'disabled');
        pauseBtn.classList.remove('active', 'disabled');
        resetBtn.classList.remove('active', 'disabled');
        
        if (isRunning) {
            startBtn.classList.add('disabled');
            pauseBtn.classList.add('active');
            resetBtn.classList.remove('disabled');
        } else {
            startBtn.classList.remove('disabled');
            pauseBtn.classList.add('disabled');
            resetBtn.classList.remove('disabled');
        }
    }
    
    function saveSettings() {
        Storage.set('simplr_pomodoro_settings', settings);
    }
    
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            updateButtonStates();
            if (isWorkTime) {
                alert('Timer started! Stay focused!');
            } else {
                alert('Break started! Relax and recharge!');
            }
            timerInterval = setInterval(() => {
                currentTime--;
                updateTimerDisplay();
                
                if (currentTime <= 0) {
                    // Timer finished
                    clearInterval(timerInterval);
                    isRunning = false;
                    updateButtonStates();
                    
                    if (isWorkTime) {
                        // Work session completed
                        settings.sessions++;
                        updateSessionCount();
                        saveSettings();
                        // Switch to break time and reset timer BEFORE alert
                        isWorkTime = false;
                        currentTime = settings.breakTime * 60;
                        updateTimerDisplay();
                        // Show alert and start break only after alert is dismissed
                        alert('Work session completed! Time for a break!');
                        // Start break timer only after alert is dismissed
                        startTimer();
                    } else {
                        // Break completed
                        alert('Break time over! Ready for another work session?');
                        
                        // Switch to work time
                        isWorkTime = true;
                        currentTime = settings.workTime * 60;
                        updateTimerDisplay();
                    }
                }
            }, 1000);
        }
    }
    
    function pauseTimer() {
        if (isRunning) {
            isRunning = false;
            clearInterval(timerInterval);
            updateButtonStates();
        }
    }
    
    function resetTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        currentTime = isWorkTime ? settings.workTime * 60 : settings.breakTime * 60; // Keep the current timer type
        updateTimerDisplay();
        updateButtonStates();
    }
    
    // Add reset button functionality
    const resetSessionBtn = document.createElement('button');
    resetSessionBtn.innerHTML = '<i class="fas fa-undo-alt"></i>'; // Use Font Awesome icon
    resetSessionBtn.title = 'Reset Sessions'; // Add tooltip for clarity
    resetSessionBtn.className = 'secondary-btn';
    resetSessionBtn.addEventListener('click', () => {
        settings.sessions = 0;
        updateSessionCount();
        saveSettings();
    });
    sessionCount.parentNode.appendChild(resetSessionBtn); // Add button next to session count
    
    // Initial timer display
    updateTimerDisplay();
    
    // Make timer circle clickable
    const timerCircle = document.querySelector('.timer-circle');
    timerCircle.addEventListener('click', () => {
        if (!isRunning) {
            isWorkTime = !isWorkTime; // Toggle between work and break time
            currentTime = isWorkTime ? settings.workTime * 60 : settings.breakTime * 60;
            updateTimerDisplay();
        }
    });
});