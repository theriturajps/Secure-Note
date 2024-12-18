document.addEventListener('DOMContentLoaded', () => {
  // DOM Selectors
  const createNoteForm = document.getElementById('create-note-form')
  const retrieveNoteForm = document.getElementById('retrieve-note-form')
  const feedbackElement = document.getElementById('feedback')

  // Note Modal Elements
  const noteDisplayModal = new bootstrap.Modal(
    document.getElementById('noteDisplayModal')
  )
  const retrievedNoteContent = document.getElementById('retrieved-note-content')
  const editNoteBtn = document.getElementById('edit-note-btn')
  const saveNoteBtn = document.getElementById('save-note-btn')
  const deleteNoteBtn = document.getElementById('delete-note-btn')

  // Utility Functions
  function showFeedback(message, isError = false) {
    feedbackElement.innerHTML = `
            <div class="alert ${
              isError ? 'alert-danger' : 'alert-success'
            } alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `
  }

  function clearFeedback() {
    feedbackElement.innerHTML = ''
  }

  // Create Note Handler
  createNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearFeedback()

    const content = document.getElementById('note-content').value.trim()
    const password = document.getElementById('note-password').value.trim()

    try {
      const response = await fetch('/api/notes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, password }),
      })

      const result = await response.json()

      if (response.ok) {
        showFeedback(`Note created successfully! Note ID: ${result.noteId}`)
        createNoteForm.reset()
      } else {
        showFeedback(result.error || 'Failed to create note', true)
      }
    } catch (error) {
      showFeedback('Network error. Please try again.', true)
      console.error('Create note error:', error)
    }
  })

  // Retrieve Note Handler
  retrieveNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearFeedback()

    const noteId = document.getElementById('note-id').value.trim()
    const password = document.getElementById('retrieve-password').value.trim()

    try {
      const response = await fetch('/api/notes/retrieve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId, password }),
      })

      const result = await response.json()

      if (response.ok) {
        // Populate and show note modal
        retrievedNoteContent.value = result.content
        retrievedNoteContent.setAttribute('data-note-id', noteId)
        retrievedNoteContent.readOnly = true

        // Reset modal buttons
        editNoteBtn.classList.remove('d-none')
        saveNoteBtn.classList.add('d-none')

        noteDisplayModal.show()
      } else {
        showFeedback(result.error || 'Failed to retrieve note', true)
      }
    } catch (error) {
      showFeedback('Network error. Please try again.', true)
      console.error('Retrieve note error:', error)
    }
  })

  // Edit Note Handler
  editNoteBtn.addEventListener('click', () => {
    retrievedNoteContent.readOnly = false
    editNoteBtn.classList.add('d-none')
    saveNoteBtn.classList.remove('d-none')
    retrievedNoteContent.focus()
  })

  // Save Note Handler
  saveNoteBtn.addEventListener('click', async () => {
    const noteId = retrievedNoteContent.getAttribute('data-note-id')
    const newContent = retrievedNoteContent.value.trim()
    const password = document.getElementById('retrieve-password').value.trim()

    try {
      const response = await fetch('/api/notes/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId,
          password,
          newContent,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        showFeedback('Note updated successfully')
        retrievedNoteContent.readOnly = true
        editNoteBtn.classList.remove('d-none')
        saveNoteBtn.classList.add('d-none')
      } else {
        showFeedback(result.error || 'Failed to update note', true)
      }
    } catch (error) {
      showFeedback('Network error. Please try again.', true)
      console.error('Update note error:', error)
    }
  })

  // Delete Note Handler
  deleteNoteBtn.addEventListener('click', async () => {
    const noteId = retrievedNoteContent.getAttribute('data-note-id')
    const password = document.getElementById('retrieve-password').value.trim()

    if (!confirm('Are you sure you want to delete this note?')) {
      return
    }

    try {
      const response = await fetch('/api/notes/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId, password }),
      })

      const result = await response.json()

      if (response.ok) {
        noteDisplayModal.hide()
        showFeedback('Note deleted successfully')
        retrieveNoteForm.reset()
      } else {
        showFeedback(result.error || 'Failed to delete note', true)
      }
    } catch (error) {
      showFeedback('Network error. Please try again.', true)
      console.error('Delete note error:', error)
    }
  })
})
