document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements (existing)
  const currentPassword = document.getElementById('current-password');
  const newPassword = document.getElementById('new-password');
  const changePasswordBtn = document.getElementById('change-password-btn');

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
  const year = document.getElementById('year')

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
  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    newPassword.classList.add('hidden');
    newPassword.value = '';
    changePasswordBtn.innerHTML = '<i class="fas fa-key mr-1"></i> Change Password';
  });


  // Add new feedback elements for each section
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
  modal.querySelector('.p-3').insertBefore(modalFeedback, modal.querySelector('.flex.space-x-2'));

  // Enhanced Feedback Handler
  function showFeedback(message, type = 'info', location = 'create') {
    const feedbackElements = {
      create: createFeedback,
      retrieve: retrieveFeedback,
      modal: modalFeedback
    };

    const feedbackElement = feedbackElements[location];
    if (!feedbackElement) return;

    // Clear any existing feedback first
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

    // Create the feedback div
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `p-3 rounded-md ${style.bg} flex items-center space-x-2 animate-fadeIn`;
    feedbackDiv.style.opacity = '1';
    feedbackDiv.style.transition = 'opacity 0.5s ease-out';

    feedbackDiv.innerHTML = `
    <i class="fas ${style.icon} ${style.text}"></i>
    <p class="text-sm ${style.text}">${message}</p>
  `;

    // Append the feedback div
    feedbackElement.appendChild(feedbackDiv);

    // Set up the fade out
    const fadeOutTimeout = setTimeout(() => {
      if (feedbackDiv && feedbackDiv.parentNode === feedbackElement) {
        feedbackDiv.style.opacity = '0';

        // Remove the element after transition
        const removeTimeout = setTimeout(() => {
          if (feedbackDiv && feedbackDiv.parentNode === feedbackElement) {
            feedbackElement.removeChild(feedbackDiv);
          }
        }, 500);

        // Cleanup timeout if element is removed early
        feedbackDiv.addEventListener('remove', () => clearTimeout(removeTimeout));
      }
    }, 4500);

    // Cleanup timeout if element is removed early
    feedbackDiv.addEventListener('remove', () => clearTimeout(fadeOutTimeout));
  }

  // Update event listeners to use specific feedback locations
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
        currentPassword.value = password; // Set the current password
        noteContent.readOnly = true;
        currentPassword.readOnly = true;
        editBtn.classList.remove('hidden');
        saveBtn.classList.add('hidden');
        newPassword.classList.add('hidden');
        modal.classList.remove('hidden');
      } else {
        showFeedback(result.error || 'Failed to retrieve note', 'error', 'retrieve');
      }
    } catch (error) {
      showFeedback('Network error occurred', 'error', 'retrieve');
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

  changePasswordBtn.addEventListener('click', async () => {
    if (newPassword.classList.contains('hidden')) {

      newPassword.classList.remove('hidden');
      changePasswordBtn.innerHTML = '<i class="fas fa-check mr-1"></i> Save Pass';
      showFeedback('Enter new password', 'info', 'modal');
    } else {

      const newPass = newPassword.value.trim();
      if (!newPass) {
        showFeedback('New password cannot be empty', 'error', 'modal');
        return;
      }

      const noteId = noteContent.getAttribute('data-note-id');
      const currentPass = currentPassword.value.trim();

      try {
        const response = await fetch('/api/notes/update-password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            noteId,
            currentPassword: currentPass,
            newPassword: newPass
          })
        });
        const result = await response.json();

        if (response.ok) {
          showFeedback('Password updated successfully', 'success', 'modal');
          currentPassword.value = newPass;
          newPassword.value = '';
          newPassword.classList.add('hidden');
          changePasswordBtn.innerHTML = '<i class="fas fa-key mr-1"></i> Edit Pass';
        } else {
          showFeedback(result.error || 'Failed to update password', 'error', 'modal');
        }
      } catch (error) {
        showFeedback('Network error occurred', 'error', 'modal');
      }
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

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      newPassword.classList.add('hidden');
      newPassword.value = '';
      changePasswordBtn.innerHTML = '<i class="fas fa-key mr-1"></i> Change Pass';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });

  function getYear() {
    const currentYear = new Date().getFullYear()
    return currentYear
  }

  year.innerHTML = getYear()
});