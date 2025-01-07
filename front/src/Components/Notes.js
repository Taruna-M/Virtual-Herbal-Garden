import React, { useState, useCallback, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import "./Notes.css";

//react to unity communication
import useHandleUnityInput from '../Hooks/useHandleUnityInput';

const Notes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isViewingNote, setIsViewingNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 650, height: 450 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  // ... (previous state declarations remain the same)
  const [unityInputStatus, setUnityInputStatus] = useState('enable');
  
  useHandleUnityInput(unityInputStatus);

  // Update unity input status when notes window opens/closes
  useEffect(() => {
    setUnityInputStatus(isOpen ? 'disable' : 'enable');
  }, [isOpen]);

  // Update unity input status when starting to drag or resize
  useEffect(() => {
    if (isDragging || isResizing) {
      setUnityInputStatus('disable');
    } else {
      setUnityInputStatus(isOpen ? 'disable' : 'enable');
    }
  }, [isDragging, isResizing, isOpen]);

  // Update unity input status when interacting with forms
  useEffect(() => {
    if (isAddingNote || isViewingNote) {
      setUnityInputStatus('disable');
    } else {
      setUnityInputStatus(isOpen ? 'disable' : 'enable');
    }
  }, [isAddingNote, isViewingNote, isOpen]);

  const [newNote, setNewNote] = useState({ 
    title: "", 
    content: "", 
    date: "", 
    back: "",
    title2: "",
    environment: ""
  });
  const [notes, setNotes] = useState([
    {
      title: "Ginkgo",
      content: "Ginkgo Biloba is an ancient, deciduous tree that grows up to 100 feet tall with distinctive fan-shaped leaves.",
      date: "01/03/2024, 12:00 PM",
      back: "Back",
      title2: "Title",
      environment: "Content"
    },
    {
      title: "Tulsi",
      content: "Tulsi (Ocimum sanctum) is an aromatic, shrub-like herb that grows up to 2 feet tall with purple-pink flowers.",
      date: "01/03/2024, 03:45 PM",
      back: "Back",
      title2: "Title",
      environment: "Content"
    },
    {
      title: "Ginkgo",
      content: "Ginkgo Biloba is an ancient, deciduous tree that grows up to 100 feet tall with distinctive fan-shaped leaves.",
      date: "01/03/2024, 12:00 PM",
      back: "Back",
      title2: "Title",
      environment: "Content"
    },
    {
      title: "Tulsi",
      content: "Tulsi (Ocimum sanctum) is an aromatic, shrub-like herb that grows up to 2 feet tall with purple-pink flowers.",
      date: "01/03/2024, 03:45 PM",
      back: "Back",
      title2: "Title",
      environment: "Content"
    }
  ]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsAddingNote(false);
    setIsViewingNote(false);
    setSelectedNote(null);
    setSize({ width: 650, height: 450 });
    setUnityInputStatus('enable');  // Enable Unity input when closing
  }, []);

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

  const handleMouseDown = (e) => {
    if (e.target.closest('[data-drag-handle="true"]')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

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

  const handleDelete = useCallback((index) => {
    setNotes(prevNotes => prevNotes.filter((_, i) => i !== index));
  }, []);

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

  const handleAddNote = useCallback(() => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const now = new Date();
      const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString().slice(0, 5)}`;
      
      setNotes(prevNotes => [...prevNotes, {
        ...newNote,
        date: formattedDate,
        back: "Back",
        title2: "Title",
        environment: "Content"
      }]);
      
      setNewNote({ 
        title: "", 
        content: "", 
        date: "", 
        back: "",
        title2: "",
        environment: ""
      });
      setIsAddingNote(false);
      setIsOpen(true);
    }
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
  
  const handleNoteChange = (field, value) => {
    if (selectedNote !== null) {
      const updatedNotes = notes.map((note, index) => 
        index === selectedNote.index 
          ? { ...note, [field]: value }
          : note
      );
      
      setNotes(updatedNotes);
      setSelectedNote(prev => ({
        ...prev,
        [field]: value
      }));
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
  
  const renderAddNoteForm = () => (
    <div className="note-form">
      <div className="note-form-container">
        <div className="note-form-header">
          <button
            onClick={() => setIsAddingNote(false)}
            className="back-button"
          >
            &lt; back
          </button>
          <div className="note-date">
            {new Date().toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
        <input
          placeholder="Title"
          onChange={(e) => handleNoteChange("title", e.target.value)}
          className="note-title-input"
        />
        <textarea
          placeholder="Write your note here..."
          onChange={(e) => handleNoteChange("content", e.target.value)}
          className="note-content-textarea"
        />
      </div>
    </div>
  );
  
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
            {selectedNote?.date
              ? new Date(selectedNote.date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : ""}
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
                {notes.map((note, index) => (
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
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;