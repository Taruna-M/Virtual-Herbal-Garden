import React, { useState, useCallback, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import "./Notes.css";
import axios from 'axios';
import useHandleUnityInput from '../Hooks/useHandleUnityInput';

// Main Notes component for managing user notes with drag, resize, and CRUD operations
const Notes = () => {
  // State declarations for controlling UI visibility and modes
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isViewingNote, setIsViewingNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // State for window dragging and resizing functionality
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 650, height: 450 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // States for Unity game engine integration and data management
  const [unityInputStatus, setUnityInputStatus] = useState('enable');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Template for new note creation
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    date: "",
    back: "Back",
    title2: "Title",
    environment: "Content"
  });

  // Custom hook to manage Unity input state
  useHandleUnityInput(unityInputStatus);

  // Effect to disable Unity input when notes window is active
  useEffect(() => {
    const shouldDisableInput = isOpen || isDragging || isResizing || isAddingNote || isViewingNote;
    setUnityInputStatus(shouldDisableInput ? 'disable' : 'enable');
  }, [isOpen, isDragging, isResizing, isAddingNote, isViewingNote]);

  // Initial fetch of notes from backend API
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/notes`);
        setNotes(Array.isArray(response.data.payload) ? response.data.payload : []);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setError(error.message);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Handler to close notes window and reset states
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsAddingNote(false);
    setIsViewingNote(false);
    setSelectedNote(null);
    setSize({ width: 650, height: 450 });
    setUnityInputStatus('enable');
  }, []);

  // Effect to center the notes window when opened
  useEffect(() => {
    if (isOpen) {
      const defaultWidth = 650;
      const defaultHeight = 450;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      setPosition({
        x: (windowWidth - defaultWidth) / 2,
        y: (windowHeight - defaultHeight) / 2
      });
    }
  }, [isOpen]);

  // Handler to initiate window resizing
  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  // Handler for active window resizing with bounds checking
  const handleResize = useCallback((e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    let newX = position.x;
    let newY = position.y;

    const minWidth = 400;
    const minHeight = 300;
    const maxWidth = window.innerWidth - position.x;
    const maxHeight = window.innerHeight - position.y;

    switch (resizeDirection) {
      case 'e':
        newWidth = Math.min(Math.max(resizeStart.width + deltaX, minWidth), maxWidth);
        break;
      case 's':
        newHeight = Math.min(Math.max(resizeStart.height + deltaY, minHeight), maxHeight);
        break;
      case 'se':
        newWidth = Math.min(Math.max(resizeStart.width + deltaX, minWidth), maxWidth);
        newHeight = Math.min(Math.max(resizeStart.height + deltaY, minHeight), maxHeight);
        break;
      default:
        break;
    }

    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
  }, [isResizing, resizeDirection, resizeStart, position]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, handleResize, handleResizeEnd]);

  // Handler for window drag initiation
  const handleMouseDown = (e) => {
    if (e.target.closest('[data-drag-handle="true"]')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Handler for active window dragging with bounds checking
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const maxX = window.innerWidth - 650;
    const maxY = window.innerHeight - 450;

    setPosition({
      x: Math.min(Math.max(0, newX), maxX),
      y: Math.min(Math.max(0, newY), maxY)
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handler for note deletion with backend sync
  const handleDelete = useCallback(async (index) => {
    try {
      const noteToDelete = notes[index];
      if (!noteToDelete || !noteToDelete._id) {
        throw new Error('Invalid note data');
      }

      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/notes/${noteToDelete._id}`);
      if (response.status === 200) {
        setNotes(prevNotes => prevNotes.filter((_, i) => i !== index));
      } else {
        throw new Error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      // Show error to user - you might want to add a state for error messages
      setError(error.response?.data?.message || error.message || 'Failed to delete note');
    }
  }, [notes]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedNote !== null && !isAddingNote) {
        handleDelete(selectedNote.index);
        setIsViewingNote(false);
        setSelectedNote(null);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, selectedNote, isAddingNote, handleDelete]);

  // Handler for note creation with backend sync
  const handleAddNote = useCallback(async () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const now = new Date();
      const formattedDate = now.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const noteData = {
        ...newNote,
        date: formattedDate,
      };

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/notes`, noteData);
        setNotes(prevNotes => Array.isArray(prevNotes) ? [...prevNotes, response.data.payload] : [response.data.payload]);
        setNewNote({
          title: "",
          content: "",
          date: "",
          back: "Back",
          title2: "Title",
          environment: "Content"
        });
      } catch (error) {
        console.error('Error adding note:', error);
        setError(error.message);
      }
    }
    setIsAddingNote(false);
  }, [newNote]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter' && isAddingNote) {
        handleAddNote();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddingNote, handleAddNote]);
  
  const handleNoteClick = (note, index) => {
    setSelectedNote({ ...note, index });
    setIsViewingNote(true);
  };
  
  // Handler for note content changes with optimistic UI update and backend sync
  const handleNoteChange = async (field, value) => {
    if (isAddingNote) {
      setNewNote(prev => ({ ...prev, [field]: value }));
    } else if (selectedNote !== null) {
      // Update local state immediately for responsive UI
      setSelectedNote(prev => ({
        ...prev,
        [field]: value
      }));
      
      setNotes(prevNotes => 
        prevNotes.map((note, index) =>
          index === selectedNote.index ? { ...note, [field]: value } : note
        )
      );

      try {
        // Then update the backend
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/notes/${selectedNote._id}`, {
          [field]: value
        });
        
        if (!response.data.payload) {
          throw new Error('Failed to update note');
        }
      } catch (error) {
        console.error('Error updating note:', error);
        // Optionally handle the error (e.g., show a notification)
      }
    }
  };
  
  const handleAddNoteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingNote(true);
    setSelectedNote(null);
  };
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isAddingNote && !isViewingNote) {
      handleClose();
    }
  };
  
  // Render functions for different note forms
  const renderAddNoteForm = () => (
    <div className="note-form">
      <div className="note-form-container">
        <div className="note-form-header">
          <button 
            onClick={handleAddNote}
            className="back-button"
          >
            &lt; back
          </button>
          <div className="note-date">
            {new Date().toLocaleString()}
          </div>
        </div>
        <input
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => handleNoteChange("title", e.target.value)}
          className="note-title-input"
          autoFocus
        />
        <textarea
          placeholder="Write your note here..."
          value={newNote.content}
          onChange={(e) => handleNoteChange("content", e.target.value)}
          className="note-content-textarea"
        />
      </div>
    </div>
  );
  
  //renderViewNoteForm for viewing and updating the existing note
  const renderViewNoteForm = () => (
    <div className="note-form">
      <div className="note-form-container">
        <div className="note-form-header">
          <button
            onClick={() => {
              setIsViewingNote(false);
              setSelectedNote(null);
            }}
            className="back-button"
          >
            &lt; back
          </button>
          <div className="note-date">
            {selectedNote?.date || ""}
          </div>
        </div>
        <input
          value={selectedNote?.title || ""}
          onChange={(e) => handleNoteChange("title", e.target.value)}
          className="note-title-input"
        />
        <textarea
          value={selectedNote?.content || ""}
          onChange={(e) => handleNoteChange("content", e.target.value)}
          className="note-content-textarea"
        />
      </div>
    </div>
  );
  
  // Main component render with conditional content based on state
  return (
    <div className="notes-container">
      <button
        onClick={() => setIsOpen(true)}
        className="add-note-button"
        aria-label="Open Notes"
      >
        <Plus size={24} color="white" />
      </button>

      {isOpen && (
        <div className="notes-overlay">
          <div 
            onClick={handleOverlayClick}
            className="notes-overlay-background"
          />

          <div 
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()}
            className={`notes-window ${isDragging ? 'is-dragging' : ''}`}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: `${size.width}px`,
              height: `${size.height}px`,
            }}
          >
            {/* Resize handles */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'e')}
              className={`resize-handle resize-handle-e ${isResizing && resizeDirection === 'e' ? 'is-resizing' : ''}`}
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 's')}
              className={`resize-handle resize-handle-s ${isResizing && resizeDirection === 's' ? 'is-resizing' : ''}`}
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'se')}
              className={`resize-handle resize-handle-se ${isResizing && resizeDirection === 'se' ? 'is-resizing' : ''}`}
            />
  
  <div 
              data-drag-handle="true"
              className={`notes-header ${isDragging ? 'is-dragging' : ''}`}
            >
              <h2 className="notes-title">
                Notes
                {!isAddingNote && !isViewingNote && (
                  <button
                    onClick={handleAddNoteClick}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="header-button"
                  >
                    <Plus size={20} color="white" />
                  </button>
                )}
              </h2>
              <button
                onClick={handleClose}
                className="header-button"
                aria-label="Close Notes"
              >
                <X size={20} />
              </button>
            </div>
  
            {isViewingNote && selectedNote && renderViewNoteForm()}
            {isAddingNote && renderAddNoteForm()}

            {!isAddingNote && !isViewingNote && (
              <div className="notes-grid">
                {isLoading ? (
                  <div className="loading-message">Loading notes...</div>
                ) : error ? (
                  <div className="error-message">Error: {error}</div>
                ) : Array.isArray(notes) && notes.length === 0 ? (
                  <div className="empty-message">No notes yet. Click + to add one!</div>
                ) : (
                  notes.map((note, index) => (
                    <div
                      key={index}
                      onClick={() => handleNoteClick(note, index)}
                      className="note-card"
                    >
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                          className="delete-button"
                          aria-label="Delete Note"
                        >
                          <Trash2 size={16} color="#dc3545" />
                        </button>
                      </div>
                      <div className="note-card-date">
                        {note.date}
                      </div>
                      <h4 className="note-card-title">{note.title}</h4>
                      <p className="note-card-content">
                        {note.content.substring(0, 100)}...
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;