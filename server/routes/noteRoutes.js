const express = require('express')
const router = express.Router()
const Note = require('../models/Note')

// Create a new note
router.post('/create', async (req, res) => {
  try {
    const { content, password } = req.body

    // Validate input
    if (!content || !password) {
      return res.status(400).json({
        error: 'Content and password are required',
      })
    }

    // Create note with hashed password
    const note = await Note.createNote(content, password)

    res.status(201).json({
      message: 'Note created successfully',
      noteId: note._id,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create note',
      details: error.message,
    })
  }
})

// Retrieve a note
router.post('/retrieve', async (req, res) => {
  try {
    const { noteId, password } = req.body

    // Find the note
    const note = await Note.findById(noteId)

    if (!note) {
      return res.status(404).json({
        error: 'Note not found',
      })
    }

    // Verify password
    const isMatch = await note.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        error: 'Incorrect password',
      })
    }

    // Return note content if password is correct
    res.json({
      content: note.content,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve note',
      details: error.message,
    })
  }
})

// Update a note
router.put('/update', async (req, res) => {
  try {
    const { noteId, password, newContent } = req.body

    // Find the note
    const note = await Note.findById(noteId)

    if (!note) {
      return res.status(404).json({
        error: 'Note not found',
      })
    }

    // Verify password
    const isMatch = await note.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        error: 'Incorrect password',
      })
    }

    // Update note content
    note.content = newContent
    await note.save()

    res.json({
      message: 'Note updated successfully',
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update note',
      details: error.message,
    })
  }
})

// Delete a note
router.delete('/delete', async (req, res) => {
  try {
    const { noteId, password } = req.body

    // Find the note
    const note = await Note.findById(noteId)

    if (!note) {
      return res.status(404).json({
        error: 'Note not found',
      })
    }

    // Verify password
    const isMatch = await note.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        error: 'Incorrect password',
      })
    }

    // Delete the note
    await Note.findByIdAndDelete(noteId)

    res.json({
      message: 'Note deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete note',
      details: error.message,
    })
  }
})

module.exports = router