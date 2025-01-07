// Import necessary React hooks and icons
import React, { useState, useCallback, useEffect } from "react";
import { X, Plus } from "lucide-react";

// Main Notes component declaration
const Notes = () => {
  // UI state management for modal visibility and interaction modes
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isViewingNote, setIsViewingNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Window drag and resize state management
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 650, height: 450 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
   // Note data state management
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

  // Handles closing the notes window and resetting states
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsAddingNote(false);
    setIsViewingNote(false);
    setSelectedNote(null);
    // Reset size to default
    setSize({ width: 650, height: 450 });
  }, []);

  // Centers the window when it's opened
  useEffect(() => {
    if (isOpen) {
      // Use default dimensions
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

  // Initializes window resize operation
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

  // Handles ongoing window resize calculations
  const handleResize = useCallback((e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    let newX = position.x;
    let newY = position.y;

    // Minimum sizes
    const minWidth = 400;
    const minHeight = 300;
    // Maximum sizes
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

   // Finalizes the window resize operation
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  // Sets up event listeners for window resize
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

  // Initializes window drag operation
  const handleMouseDown = (e) => {
    // Only start drag if clicking the header
    if (e.target.closest('[data-drag-handle="true"]')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Handles ongoing window drag calculations
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Add boundary checks
    const maxX = window.innerWidth - 650; // window width
    const maxY = window.innerHeight - 450; // window height

    setPosition({
      x: Math.min(Math.max(0, newX), maxX),
      y: Math.min(Math.max(0, newY), maxY)
    });
  }, [isDragging, dragStart]);

   // Finalizes the window drag operation
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Sets up event listeners for window dragging
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

  // Handles note deletion
  const handleDelete = useCallback((index) => {
    setNotes(prevNotes => prevNotes.filter((_, i) => i !== index));
  }, []);

  // Sets up keyboard shortcut for deleting notes
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

  // Handles creating a new note
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

  // Sets up keyboard shortcut for saving notes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter' && isAddingNote) {
        handleAddNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddingNote, handleAddNote]);

  // Handles selecting and viewing a note
  const handleNoteClick = (note, index) => {
    setSelectedNote({ ...note, index });
    setIsViewingNote(true);
  };

  // Handles updating note content
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

  // Handles switching to note creation mode
  const handleAddNoteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingNote(true);
    setSelectedNote(null);
  };

  // Rest of your component code remains the same, but update the close handlers
  // Handles clicks on the modal overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isAddingNote && !isViewingNote) {
      handleClose();
    }
  };

  // Renders the form for adding a new note
  const renderAddNoteForm = () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "24px",
        zIndex: 100002,
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #ddd",
            paddingBottom: "12px",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={() => {
              setIsAddingNote(false);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              fontSize: "16px",
              cursor: "pointer",
              display: "block",
              textAlign: "right",
              width: "100%",
            }}
          >
            &lt; back
          </button>
  
          <div style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>
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
          style={{
            fontSize: "24px",
            marginBottom: "16px",
            border: "none",
            outline: "none",
            padding: "4px",
          }}
        />
        <textarea
          placeholder="Write your note here..."
          onChange={(e) => handleNoteChange("content", e.target.value)}
          style={{
            flex: 1,
            fontSize: "16px",
            border: "none",
            outline: "none",
            padding: "4px",
            resize: "none",
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );  
  
  // Renders the form for viewing/editing an existing note
  const renderViewNoteForm = () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "24px",
        zIndex: 100002,
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #ddd",
            paddingBottom: "12px",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={() => {
              setIsViewingNote(false);
              setSelectedNote(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              fontSize: "16px",
              cursor: "pointer",
              display: "block",
              textAlign: "right",
              width: "100%",
            }}
          >
            &lt; back
          </button>
  
          <div style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>
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
          style={{
            fontSize: "24px",
            marginBottom: "16px",
            border: "none",
            outline: "none",
            padding: "4px",
          }}
        />
        <textarea
          value={selectedNote?.content || ""}
          onChange={(e) => handleNoteChange("content", e.target.value)}
          style={{
            flex: 1,
            fontSize: "16px",
            border: "none",
            outline: "none",
            padding: "4px",
            resize: "none",
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  ); 
   
  return (
    <div style={{ position: "relative", zIndex: 99999 }}>
      {/* Keep existing button */}
      {/* Fixed "+" button in bottom-right corner to open the notes modal */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "160px",
          right: "16px",
          width: "54px",
          height: "54px",
          backgroundColor: "#2ea043",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
          zIndex: 99999,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
        aria-label="Open Notes"
      >
        <Plus size={24} color="white" />
      </button>

      {isOpen && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
          }}
        >
          {/* Keep existing overlay */}
          {/* Semi-transparent overlay that covers the whole screen when notes modal is open */}
          <div 
            onClick={handleOverlayClick}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          />

          {/* Main window container */}
          {/* Main draggable and resizable notes window with blur effect background */}
          <div 
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: `${size.width}px`,
              height: `${size.height}px`,
              backgroundColor: "rgba(209, 224, 192, 0.85)",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              zIndex: 100001,
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
              transition: isDragging || isResizing ? "none" : "all 0.2s ease",
              cursor: isDragging ? "grabbing" : "default",
            }}
          >
            {/* Resize handles */}
            {/* Resize handles on right edge, bottom edge, and bottom-right corner for window resizing */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'e')}
              style={{
                position: "absolute",
                right: -3,
                top: "50%",
                transform: "translateY(-50%)",
                width: "6px",
                height: "50px",
                cursor: "ew-resize",
                backgroundColor: isResizing && resizeDirection === 'e' ? "rgba(46, 160, 67, 0.5)" : "transparent",
              }}
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 's')}
              style={{
                position: "absolute",
                bottom: -3,
                left: "50%",
                transform: "translateX(-50%)",
                height: "6px",
                width: "50px",
                cursor: "ns-resize",
                backgroundColor: isResizing && resizeDirection === 's' ? "rgba(46, 160, 67, 0.5)" : "transparent",
              }}
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'se')}
              style={{
                position: "absolute",
                bottom: -3,
                right: -3,
                width: "12px",
                height: "12px",
                cursor: "se-resize",
                backgroundColor: isResizing && resizeDirection === 'se' ? "rgba(46, 160, 67, 0.5)" : "transparent",
                borderRadius: "50%",
              }}
            />

            {/* Green header bar with title, add note button, and close button */}
            <div 
              data-drag-handle="true"
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
                backgroundColor: "rgba(46, 160, 67, 0.9)",
                margin: "-24px -24px 24px -24px",
                padding: "16px 24px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                position: "relative",
                zIndex: 100002,
                cursor: isDragging ? "grabbing" : "grab",
              }}
            >
              <h2 style={{ margin: 0, color: "white", fontSize: "24px", flex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
                Notes
                {!isAddingNote && !isViewingNote && (
                  <button
                    onClick={handleAddNoteClick}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    <Plus size={20} color="white" />
                  </button>
                )}
              </h2>
              {/* Update the close button onClick handler */}
              <button
                onClick={handleClose}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
                aria-label="Close Notes"
              >
                <X size={20} />
              </button>
            </div>

            {isViewingNote && selectedNote && renderViewNoteForm()}
            {isAddingNote && renderAddNoteForm()}

            {!isAddingNote && !isViewingNote && (
              // Grid layout container for displaying note cards in 2 columns 
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                overflowY: "auto",
                padding: "0 0 24px 0",
                height: "calc(100% - 80px)", // Account for header
              }}>
                {notes.map((note, index) => (
                  // Individual note card showing date, title, and truncated content with delete button
                  <div
                    key={index}
                    onClick={() => handleNoteClick(note, index)}
                    style={{
                      padding: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "4px",
                      border: "1px solid rgba(221, 221, 221, 0.8)",
                      position: "relative",
                      cursor: "pointer",
                      backdropFilter: "blur(5px)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                        style={{
                          width: "24px",
                          height: "24px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label="Delete Note"
                      >
                        <X size={16} color="#dc3545" />
                      </button>
                    </div>
                    <div style={{ color: "#666", fontSize: "12px", marginBottom: "8px" }}>
                      {note.date}
                    </div>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{note.title}</h4>
                    <p style={{ margin: 0, color: "#666" }}>{note.content.substring(0, 100)}...</p>
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