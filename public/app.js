document.addEventListener('DOMContentLoaded', () => {
  // Create main container
  const container = document.querySelector('.container');

  const header = document.createElement('header');
  header.className = 'flex justify-between items-center mb-4';
  header.innerHTML = `
    <h1 class="text-xl font-bold text-blue-600">SecureNote</h1>
    <button id="theme-toggle" class="p-2 rounded-full hover:bg-gray-200">
      <i class="fas fa-sun dark:hidden"></i>
      <i class="fas fa-moon hidden dark:inline"></i>
    </button>
  `;
  container.appendChild(header);

  const mainCard = document.createElement('div');
  mainCard.className = 'bg-white rounded-lg shadow-md p-3';

  const tabs = document.createElement('div');
  tabs.className = 'flex mb-3 border-b border-gray-200';
  tabs.innerHTML = `
    <button id="create-tab" class="flex-1 py-1.5 px-3 text-sm font-medium text-gray-500 border-b-2 border-blue-600">
      <i class="fas fa-plus-circle mr-1"></i> Create
    </button>
    <button id="retrieve-tab" class="flex-1 py-1.5 px-3 text-sm font-medium text-gray-500">
      <i class="fas fa-search mr-1"></i> Retrieve
    </button>
  `;
  mainCard.appendChild(tabs);

  const createForm = document.createElement('form');
  createForm.id = 'create-note-form';
  createForm.className = 'space-y-2';
  createForm.innerHTML = `
    <textarea id="note-content" class="w-full h-20 p-2 border rounded-md resize-none"
      placeholder="Enter your note..." required></textarea>
    <input type="password" id="note-password" class="w-full p-2 border rounded-md" placeholder="Password" required>
    <button type="submit" class="w-full py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
      <i class="fas fa-lock mr-1"></i> Create Secure Note
    </button>
  `;

  const retrieveForm = document.createElement('form');
  retrieveForm.id = 'retrieve-note-form';
  retrieveForm.className = 'hidden space-y-2';
  retrieveForm.innerHTML = `
    <input type="text" id="note-id" class="w-full p-2 border rounded-md" placeholder="Note ID" required>
    <input type="password" id="retrieve-password" class="w-full p-2 border rounded-md" placeholder="Password" required>
    <button type="submit" class="w-full py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700">
      <i class="fas fa-unlock mr-1"></i> Retrieve Note
    </button>
  `;

  mainCard.appendChild(createForm);
  mainCard.appendChild(retrieveForm);
  container.appendChild(mainCard);

  const modal = document.createElement('div');
  modal.id = 'noteModal';
  modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-lg w-full max-w-sm">
      <div class="p-3">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-medium">Your Note</h3>
          <button id="close-modal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <textarea id="retrieved-note-content" class="w-full h-28 p-2 border rounded-md resize-none" readonly></textarea>
        <div class="flex gap-2">
          <button id="edit-note-btn" class="flex-1 py-1.5 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 w-20">
            <i class="fas fa-edit mr-1"></i> Edit
          </button>
          <button id="save-note-btn" class="hidden flex-1 py-1.5 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-20">
            <i class="fas fa-save mr-1"></i> Save
          </button>
          <button id="delete-note-btn" class="flex-1 py-1.5 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 w-20">
            <i class="fas fa-trash-alt mr-1"></i> Delete
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const footer = document.createElement('footer');
  footer.className = 'text-center py-3 text-sm text-gray-500';
  footer.innerHTML = `
    <p>&copy; <span id="year"></span> SecureNote. All rights reserved.</p>
  `;
  document.body.appendChild(footer);

  initializeApp();
});

function initializeApp() {
  // DOM Elements (existing)
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
  closeModal.addEventListener('click', () => modal.classList.add('hidden'));


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

  function getYear() {
    const currentYear = new Date().getFullYear()
    return currentYear
  }

  year.innerHTML = getYear()
};