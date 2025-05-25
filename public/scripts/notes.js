// Notes functionality
document.addEventListener('DOMContentLoaded', function() {
    const addNoteBtn = document.getElementById('addNoteBtn');
    const searchNotesInput = document.getElementById('searchNotesInput');
    const notesGrid = document.getElementById('notesGrid');
    const noteModal = document.getElementById('noteModal');
    const modalTitle = document.getElementById('modalTitle');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const cancelNoteBtn = document.getElementById('cancelNoteBtn');
    const closeModal = document.querySelector('.close');
    
    let notes = Storage.get('simplr_notes') || [];
    let editingNoteId = null;
    
    // Helper functions
    function generateId() {
        return Math.random().toString(36).substring(2, 15);
    }
    
    function searchItems(items, searchTerm, keys) {
        if (!searchTerm) return items;
        searchTerm = searchTerm.toLowerCase();
        return items.filter(item => {
            return keys.some(key => {
                return item[key].toLowerCase().includes(searchTerm);
            });
        });
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    }
    
    // Event listeners
    addNoteBtn.addEventListener('click', openNewNoteModal);
    searchNotesInput.addEventListener('input', renderNotes);
    saveNoteBtn.addEventListener('click', saveNote);
    cancelNoteBtn.addEventListener('click', closeNoteModal);
    closeModal.addEventListener('click', closeNoteModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === noteModal) {
            closeNoteModal();
        }
    });
    
    function openNewNoteModal() {
        editingNoteId = null;
        modalTitle.textContent = 'New Note';
        noteTitle.value = '';
        noteContent.value = '';
        noteModal.style.display = 'block';
        noteTitle.focus();
    }
    
    function openEditNoteModal(note) {
        editingNoteId = note.id;
        modalTitle.textContent = 'Edit Note';
        noteTitle.value = note.title;
        noteContent.value = note.content;
        noteModal.style.display = 'block';
        noteTitle.focus();
    }
    
    function closeNoteModal() {
        noteModal.style.display = 'none';
        editingNoteId = null;
    }
    
    function saveNote() {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        
        if (title === '' || content === '') {
            alert('Please fill in both title and content!');
            return;
        }
        
        if (editingNoteId) {
            // Update existing note
            const noteIndex = notes.findIndex(note => note.id === editingNoteId);
            if (noteIndex !== -1) {
                notes[noteIndex].title = title;
                notes[noteIndex].content = content;
                notes[noteIndex].updatedAt = new Date().toISOString();
                notes[noteIndex].title = `Edited: ${notes[noteIndex].title}`; // Add 'Edited:' prefix
            }
        } else {
            // Create new note
            const newNote = {
                id: generateId(),
                title: title,
                content: content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            notes.unshift(newNote); // Add to beginning of array
        }
        
        saveNotes();
        renderNotes();
        closeNoteModal();
    }
    
    function saveNotes() {
        Storage.set('simplr_notes', notes);
    }
    
    function renderNotes() {
        const searchTerm = searchNotesInput.value;
        const filteredNotes = searchItems(notes, searchTerm, ['title', 'content']);
        
        notesGrid.innerHTML = '';
        
        if (filteredNotes.length === 0) {
            notesGrid.innerHTML = '<p style="text-align: center; color: #6b7280; grid-column: 1 / -1; padding: 2rem;">No notes found. Create your first note!</p>';
            return;
        }
        
        filteredNotes.forEach(note => {
            const noteCard = createNoteElement(note);
            notesGrid.appendChild(noteCard);
        });
    }
    
    function createNoteElement(note) {
        const div = document.createElement('div');
        div.className = 'note-card';
        
        div.innerHTML = `
            <div class="note-date" title="Last updated: ${formatDate(note.updatedAt)}">${formatDate(note.updatedAt)}</div>
            <div class="note-title" title="${note.title}">${note.title}</div>
            <div class="note-content" title="${note.content}">${note.content}</div>
            <div class="note-actions">
                <button class="edit-btn" onclick="editNote('${note.id}')" title="Edit this note">Edit</button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete this note">Delete</button>
            </div>
        `;
        
        // Add click event to open note for editing (excluding buttons)
        div.addEventListener('click', function(e) {
            if (!e.target.matches('button')) {
                openEditNoteModal(note);
            }
        });
        
        return div;
    }
    
    // Global functions for note actions
    window.editNote = function(noteId) {
        const note = notes.find(note => note.id === noteId);
        if (note) {
            openEditNoteModal(note);
        }
    };
    
    window.deleteNote = function(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(note => note.id !== noteId);
            saveNotes();
            renderNotes();
        }
    };
    
    // Initial render
    renderNotes();
});