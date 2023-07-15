const mongoose = require('mongoose');
const notesSchema = new mongoose.Schema({
    uid: String,
    title: String,
    content: String,
    createdAt: Date,
    updatedAt: Date
});
const Notes = mongoose.model('Notes', notesSchema);
module.exports = Notes;