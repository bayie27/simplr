// To-Do List functionality
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const searchInput = document.getElementById('searchInput');
    const taskList = document.getElementById('taskList');
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');
    const pendingTasks = document.getElementById('pendingTasks');
    
    let tasks = Storage.get('simplr_tasks') || [];
    let editingTaskId = null;
    
    // Event listeners
    addTaskBtn.addEventListener('click', addOrUpdateTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addOrUpdateTask();
        }
    });
    searchInput.addEventListener('input', renderTasks);
    
    // Add or update task function
    function addOrUpdateTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
        
        if (editingTaskId) {
            // Update existing task
            const taskIndex = tasks.findIndex(task => task.id === editingTaskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].text = taskText;
                tasks[taskIndex].updatedAt = new Date().toISOString();
            }
            editingTaskId = null;
            addTaskBtn.textContent = 'Add Task';
        } else {
            // Add new task
            const newTask = {
                id: generateId(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            tasks.push(newTask);
        }
        
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        Storage.set('simplr_tasks', tasks);
    }
    
    // Render tasks
    function renderTasks() {
        const searchTerm = searchInput.value;
        const filteredTasks = searchItems(tasks, searchTerm, ['text']);
        
        taskList.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const taskItem = createTaskElement(task);
            taskList.appendChild(taskItem);
        });
        
        updateStats();
    }
    
    // Create task element
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Show 'Edited:' if updatedAt != createdAt
        const isEdited = task.updatedAt && task.updatedAt !== task.createdAt;
        li.innerHTML = `
            <div class="task-content">
                <strong>${task.text}</strong>
                <div style="font-size: 0.8rem; color: #666; margin-top: 0.25rem;">
                    ${isEdited ? 'Edited' : 'Created'}: ${formatDate(isEdited ? task.updatedAt : task.createdAt)}
                </div>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleTask('${task.id}')">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="edit-btn" onclick="editTask('${task.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        
        return li;
    }
    
    // Toggle task completion
    window.toggleTask = function(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            // Do NOT update updatedAt here
            saveTasks();
            renderTasks();
        }
    };
    
    // Edit task
    window.editTask = function(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            taskInput.value = task.text;
            editingTaskId = taskId;
            addTaskBtn.textContent = 'Update Task';
            taskInput.focus();
        }
    };
    
    // Delete task
    window.deleteTask = function(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }
    };
    
    // Update statistics
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        totalTasks.textContent = `Total: ${total}`;
        completedTasks.textContent = `Completed: ${completed}`;
        pendingTasks.textContent = `Pending: ${pending}`;
    }
    
    // Initial render
    renderTasks();
});