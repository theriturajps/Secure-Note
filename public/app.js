document.addEventListener('DOMContentLoaded', () => {
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
  const themeToggle = document.getElementById('theme-toggle');

  // Theme Handling
  const htmlElement = document.documentElement;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.classList.toggle('dark', savedTheme === 'dark');
  }

  themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
  });

  // Tab Switching
  createTab.addEventListener('click', () => {
    createTab.classList.add('text-gray-500', 'border-b-2', 'border-blue-600');
    retrieveTab.classList.remove('border-b-2', 'border-blue-600');
    createForm.classList.remove('hidden');
    retrieveForm.classList.add('hidden');
  });

  retrieveTab.addEventListener('click', () => {
    retrieveTab.classList.add('text-gray-500', 'border-b-2', 'border-blue-600');
    createTab.classList.remove('border-b-2', 'border-blue-600');
    retrieveForm.classList.remove('hidden');
    createForm.classList.add('hidden');
  });

  // Modal Controls
  closeModal.addEventListener('click', () => modal.classList.add('hidden'));

  // Enhanced Feedback Handler
  function showFeedback(message, type = 'info') {
    const feedbackStyles = {
      success: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        icon: 'fa-check-circle'
      },
      error: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        icon: 'fa-exclamation-circle'
      },
      warning: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: 'fa-exclamation-triangle'
      },
      info: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        icon: 'fa-info-circle'
      }
    };

    const style = feedbackStyles[type] || feedbackStyles.info;

    feedback.innerHTML = `
      <div class="p-3 rounded-md ${style.bg} flex items-center space-x-2 animate-fadeIn">
        <i class="fas ${style.icon} ${style.text}"></i>
        <p class="text-sm ${style.text}">${message}</p>
      </div>
    `;

    // Add fade-out animation before removing
    setTimeout(() => {
      const feedbackDiv = feedback.firstChild;
      feedbackDiv.style.transition = 'opacity 0.5s ease-out';
      feedbackDiv.style.opacity = '0';

      setTimeout(() => {
        feedback.innerHTML = '';
      }, 500);
    }, 4500);
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
        showFeedback(`Note created! ID: ${result.noteId}`, 'success');
        createForm.reset();
      } else {
        showFeedback(result.error || 'Failed to create note', 'error');
      }
    } catch (error) {
      showFeedback('Network error occurred', 'error');
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
        showFeedback(result.error || 'Failed to retrieve note', 'error');
      }
    } catch (error) {
      showFeedback('Network error occurred', 'error');
    }
  });

  // Edit Note
  editBtn.addEventListener('click', () => {
    noteContent.readOnly = false;
    editBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');
    noteContent.focus();
    showFeedback('You can now edit your note', 'info');
  });

  // Save Note
  saveBtn.addEventListener('click', async () => {
    const noteId = noteContent.getAttribute('data-note-id');
    const newContent = noteContent.value.trim();
    const password = document.getElementById('retrieve-password').value.trim();

    if (!newContent) {
      showFeedback('Note content cannot be empty', 'warning');
      return;
    }

    try {
      const response = await fetch('/api/notes/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, password, newContent })
      });
      const result = await response.json();

      if (response.ok) {
        showFeedback('Note updated successfully', 'success');
        noteContent.readOnly = true;
        editBtn.classList.remove('hidden');
        saveBtn.classList.add('hidden');
      } else {
        showFeedback(result.error || 'Failed to update note', 'error');
      }
    } catch (error) {
      showFeedback('Network error occurred', 'error');
    }
  });

  // Delete Note
  deleteBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

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
        showFeedback('Note deleted successfully', 'success');
        modal.classList.add('hidden');
        retrieveForm.reset();
      } else {
        showFeedback(result.error || 'Failed to delete note', 'error');
      }
    } catch (error) {
      showFeedback('Network error occurred', 'error');
    }
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });
});