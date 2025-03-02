const AppRes = require('../utils/AppRes');
const { getAllNotes, getNote, createNote, updateNote, deleteNote } = require('../services/notesService');

// Get all notes
exports.getAllNotesController = async (req, res, next) => {
    try {
        const result = await getAllNotes();
        AppRes.send(res, result.message, result.statusCode, result.payload);
    } catch(err) {
        next(err);
    }
};

// Get single note
exports.getNoteController = async (req, res, next) => {
    try {
        const result = await getNote(req.params.id);
        AppRes.send(res, result.message, result.statusCode, result.payload);
    } catch(err) {
        next(err);
    }
};

// Create note
exports.createNoteController = async (req, res, next) => {
    try {
        const result = await createNote(req.body);
        AppRes.send(res, result.message, result.statusCode, result.payload);
    } catch(err) {
        next(err);
    }
};

// Update note
exports.updateNoteController = async (req, res, next) => {
    try {
        const result = await updateNote(req.params.id, req.body);
        AppRes.send(res, result.message, result.statusCode, result.payload);
    } catch(err) {
        next(err);
    }
};

// Delete note
exports.deleteNoteController = async (req, res, next) => {
    try {
        const result = await deleteNote(req.params.id);
        AppRes.send(res, result.message, result.statusCode, result.payload);
    } catch(err) {
        next(err);
    }
};
