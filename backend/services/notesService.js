const AppError = require('../utils/AppError');
const AppRes = require('../utils/AppRes');
const Note = require('../models/Note');

//TODO: specific to each user -> userID

//fetches all the notes
exports.getAllNotes = async() => {
    const notes = await Note.find().sort({ createdAt: -1 }).select('-__v');
    if (!notes || notes.length === 0) return new AppRes(`notes not found`, 200);
    return new AppRes(`notes fetched`, 200, notes);
}

// Get single note
exports.getNote = async (id) => {
    const note = await Note.findById(id).select('-__v');
    if (!note) throw new AppError(`note not found`, 404);
    return new AppRes(`note fetched`, 200, note);
};

// Create note
exports.createNote = async (body) => {
    const note = await Note.create(body);
    return new AppRes('note created', 201, note);
};

// Update note
exports.updateNote = async (id, body) => {
    const updatedNote = await Note.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true, runValidators: true }
    );
    if (!updatedNote) throw new AppError(`note not found`, 404);
    return new AppRes(`note updated`, 200, updatedNote);
};

// Delete note
exports.deleteNote = async (id) => {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) throw new AppError(`note not found`, 404);
    return new AppRes(`note deleted`, 200);
};
