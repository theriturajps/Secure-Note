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
  const themeToggle = document.getElementById('theme-toggle');
  const year = document.getElementById('year');

  // Theme Handling
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.classList.toggle('dark', savedTheme === 'dark');
  }

  themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
  });

  // Mobile Tab Switching
  function handleMobileTabSwitch() {
    if (window.innerWidth < 768) {
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
    }
  }

  // Initial call for mobile tab handling
  handleMobileTabSwitch();

  // Handle resize events
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      createForm.classList.remove('hidden');
      retrieveForm.classList.remove('hidden');
    } else {
      handleMobileTabSwitch();
      // Reset to default view on mobile
      createTab.click();
    }
  });

  // Add feedback elements
  const createFeedback = document.createElement('div');
  createFeedback.id = 'create-feedback';
  createFeedback.className = 'mt-2';
  createForm.appendChild(createFeedback);

  const retrieveFeedback = document.createElement('div');
  retrieveFeedback.id = 'retrieve-feedback';
  retrieveFeedback.className = 'mt-2';
  retrieveForm.appendChild(retrieveFeedback);

  const modalFeedback = document.createElement('div');
  modalFeedback.id = 'modal-feedback';
  modalFeedback.className = 'mt-1 mb-1';
  modal.querySelector('.p-3').insertBefore(modalFeedback, modal.querySelector('.flex.gap-2'));

  // Enhanced Feedback Handler
  function showFeedback(message, type = 'info', location = 'create') {
    const feedbackElements = {
      create: createFeedback,
      retrieve: retrieveFeedback,
      modal: modalFeedback
    };

    const feedbackElement = feedbackElements[location];
    if (!feedbackElement) return;

    feedbackElement.innerHTML = '';

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

    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `p-3 rounded-md ${style.bg} flex items-center space-x-2 animate-fadeIn`;
    feedbackDiv.style.opacity = '1';
    feedbackDiv.style.transition = 'opacity 0.5s ease-out';

    feedbackDiv.innerHTML = `
      <i class="fas ${style.icon} ${style.text}"></i>
      <p class="text-sm ${style.text}">${message}</p>
    `;

    feedbackElement.appendChild(feedbackDiv);

    const fadeOutTimeout = setTimeout(() => {
      if (feedbackDiv && feedbackDiv.parentNode === feedbackElement) {
        feedbackDiv.style.opacity = '0';
        const removeTimeout = setTimeout(() => {
          if (feedbackDiv && feedbackDiv.parentNode === feedbackElement) {
            feedbackElement.removeChild(feedbackDiv);
          }
        }, 500);
        feedbackDiv.addEventListener('remove', () => clearTimeout(removeTimeout));
      }
    }, 4500);

    feedbackDiv.addEventListener('remove', () => clearTimeout(fadeOutTimeout));
  }

  // Form Handlers
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
        showFeedback(`Note created! ID: ${result.noteId}`, 'success', 'create');
        createForm.reset();
      } else {
        showFeedback(result.error || 'Failed to create note', 'error', 'create');
      }
    } catch (error) {
      showFeedback('Network error occurred', 'error', 'create');
    }
  });

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
        showFeedback(result.error || 'Failed to retrieve note', 'error', 'retrieve');
      }
    } catch (error) {
      showFeedback('Network error occurred', 'error', 'retrieve');
    }
  });

  editBtn.addEventListener('click', () => {
    noteContent.readOnly = false;
    editBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');
    noteContent.focus();
    showFeedback('You can now edit your note', 'info', 'modal');
  });

  saveBtn.addEventListener('click', async () => {
    const noteId = noteContent.getAttribute('data-note-id');
    const newContent = noteContent.value.trim();
    const password = document.getElementById('retrieve-password').value.trim();

    if (!newContent) {
      showFeedback('Note content cannot be empty', 'warning', 'modal');
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
        showFeedback('Note updated successfully', 'success', 'modal');
        noteContent.readOnly = true;
        editBtn.classList.remove('hidden');
        saveBtn.classList.add('hidden');
      } else {
        showFeedback(result.error || 'Failed to update note', 'error', 'modal');
      }
    } catch (error) {
      showFeedback('Network error occurred', 'error', 'modal');
    }
  });

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
        showFeedback('Note deleted successfully', 'success', 'retrieve');
        modal.classList.add('hidden');
        retrieveForm.reset();
      } else {
        showFeedback(result.error || 'Failed to delete note', 'error', 'modal');
      }
    } catch (error) {
      showFeedback('Network error occurred', 'error', 'modal');
    }
  });

  // Modal Controls
  closeModal.addEventListener('click', () => modal.classList.add('hidden'));

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

  // Set copyright year
  function getYear() {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }

  year.innerHTML = getYear();
});