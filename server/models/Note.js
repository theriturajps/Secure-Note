const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

NoteSchema.methods.comparePassword = async function (candidatePassword) {
  return this.password === candidatePassword;
}

NoteSchema.statics.createNote = async function (content, password) {
  return this.create({
    content,
    password,
  })
}

module.exports = mongoose.model('Note', NoteSchema)