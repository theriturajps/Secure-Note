const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const NoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Method to check password
NoteSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

// Static method to create a new note with hashed password
NoteSchema.statics.createNote = async function (content, password) {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  return this.create({
    content,
    passwordHash,
  })
}

module.exports = mongoose.model('Note', NoteSchema)
