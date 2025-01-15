document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.className = savedTheme;

  themeToggle.addEventListener('click', () => {
    const newTheme = html.className === 'light' ? 'dark' : 'light';
    html.className = newTheme;
    localStorage.setItem('theme', newTheme);
  });

  // DOM Elements
  const createTab = document.getElementById('create-tab');
  const retrieveTab = document.getElementById('retrieve-tab');
  const createForm = document.getElementById('create-note-form');
  const retrieveForm = document.getElementById('retrieve-note-form');
  const modal = document.getElementById('noteModal');
  const closeModal = document.getElementById('close-modal');
  const noteContent = document.getElementById('retrieved-note-content');
  const editBtn = document.getElementById('edit-note-btn');
  const saveBtn = document.getElementById('save-note-btn');
  const deleteBtn = document.getElementById('delete-note-btn');
  const feedback = document.getElementById('feedback');

  // Set initial active tab
  createTab.classList.add('active');

  // Tab Switching
  createTab.addEventListener('click', () => {
    createTab.classList.add('active');
    retrieveTab.classList.remove('active');
    createForm.classList.remove('hidden');
    retrieveForm.classList.add('hidden');
  });

  retrieveTab.addEventListener('click', () => {
    retrieveTab.classList.add('active');
    createTab.classList.remove('active');
    retrieveForm.classList.remove('hidden');
    createForm.classList.add('hidden');
  });

  // Modal Controls
  closeModal.addEventListener('click', () => modal.classList.add('hidden'));

  // Feedback Handler
  function showFeedback(message, isError = false) {
    feedback.innerHTML = `
            <div class="p-2 rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                <p class="text-sm"><i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-1"></i>${message}</p>
            </div>
        `;
    setTimeout(() => feedback.innerHTML = '', 5000);
  }

  // Create Note
  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('note-content').value.trim();
    const password = document.getElementById('note-password').value.trim();

    try {
      const response = await fetch('/api/notes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, password })
      });
      const result = await response.json();

      if (response.ok) {
        showFeedback(`Note created! ID: ${result.noteId}`);
        createForm.reset();
      } else {
        showFeedback(result.error || 'Failed to create note', true);
      }
    } catch (error) {
      showFeedback('Network error occurred', true);
    }
  });

  // Retrieve Note
  retrieveForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const noteId = document.getElementById('note-id').value.trim();
    const password = document.getElementById('retrieve-password').value.trim();

    try {
      const response = await fetch('/api/notes/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, password })
      });
      const result = await response.json();

      if (response.ok) {
        noteContent.value = result.content;
        noteContent.setAttribute('data-note-id', noteId);
        noteContent.readOnly = true;
        editBtn.classList.remove('hidden');
        saveBtn.classList.add('hidden');
        modal.classList.remove('hidden');
      } else {
        showFeedback(result.error || 'Failed to retrieve note', true);
      }
    } catch (error) {
      showFeedback('Network error occurred', true);
    }
  });

  // Edit Note
  editBtn.addEventListener('click', () => {
    noteContent.readOnly = false;
    editBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');
    noteContent.focus();
  });

  // Save Note
  saveBtn.addEventListener('click', async () => {
    const noteId = noteContent.getAttribute('data-note-id');
    const newContent = noteContent.value.trim();
    const password = document.getElementById('retrieve-password').value.trim();

    try {
      const response = await fetch('/api/notes/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, password, newContent })
      });
      const result = await response.json();

      if (response.ok) {
        showFeedback('Note updated successfully');
        noteContent.readOnly = true;
        editBtn.classList.remove('hidden');
        saveBtn.classList.add('hidden');
      } else {
        showFeedback(result.error || 'Failed to update note', true);
      }
    } catch (error) {
      showFeedback('Network error occurred', true);
    }
  });

  // Delete Note
  deleteBtn.addEventListener('click', async () => {
    if (!confirm('Delete this note?')) return;

    const noteId = noteContent.getAttribute('data-note-id');
    const password = document.getElementById('retrieve-password').value.trim();

    try {
      const response = await fetch('/api/notes/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, password })
      });
      const result = await response.json();

      if (response.ok) {
        modal.classList.add('hidden');
        showFeedback('Note deleted successfully');
        retrieveForm.reset();
      } else {
        showFeedback(result.error || 'Failed to delete note', true);
      }
    } catch (error) {
      showFeedback('Network error occurred', true);
    }
  });
});