import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List,
  Heading1, 
  X,
  Quote
} from 'lucide-react';

const HybridEditor = ({ 
  onSave, 
  placeholder = "Write your comment...",
  type = "comment", // can be "answer", "comment", "question"
  initialContent = "",
  minHeight = "120px",
  maxHeight = "400px",
  expandedByDefault = false,
  toolbarConfig = {
    basic: true,    // bold, italic, underline
    links: true,    // link insertion
    clear: true,    // clear formatting
    heading: false, // heading options
    quote: false,   // blockquote
  }
}) => {
  const [isExpanded, setIsExpanded] = useState(expandedByDefault);
  const editorRef = useRef(null);
  
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleQuote = () => {
    execCommand('formatBlock', 'blockquote');
  };

  const handleSave = () => {
    const content = editorRef.current.innerHTML;
    if (content.trim() && content !== '<br>') {
      onSave({
        content,
        type,
        timestamp: new Date().toISOString()
      });
      editorRef.current.innerHTML = '';
      setIsExpanded(false);
    }
  };

  const handleHeader = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    
    const isHeading = container.parentElement.tagName === 'H2' || 
                     container.tagName === 'H2';
    
    if (isHeading) {
      execCommand('formatBlock', 'p');
    } else {
      execCommand('formatBlock', 'h2');
    }
  };

  const ToolbarButton = ({ icon: Icon, title, onClick, isActive = false }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${
        isActive ? 'bg-gray-100' : ''
      }`}
      title={title}
    >
      <Icon size={18} className={isActive ? 'text-blue-600' : ''} />
    </button>
  );

  // Dynamic save button text based on type
  const getSaveButtonText = () => {
    switch (type) {
      case 'answer':
        return 'Post Answer';
      case 'comment':
        return 'Save Comment';
      case 'question':
        return 'Save Comment';
      default:
        return 'Save';
    }
  };

  React.useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  return (
    <div className={`w-full rounded-lg border border-gray-200 bg-white shadow-sm 
      ${type === 'answer' ? 'border-blue-200' : ''} 
      ${type === 'question' ? 'border-green-200' : ''}`}
    >
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="p-3 text-gray-500 cursor-text hover:bg-gray-50 rounded-lg"
        >
          {placeholder}
        </div>
      ) : (
        <form className="p-3">
          <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
            <div className="flex items-center divide-x divide-gray-200">
              {toolbarConfig.basic && (
                <div className="px-2 flex gap-1">
                  <ToolbarButton 
                    icon={Bold} 
                    title="Bold (Ctrl+B)" 
                    onClick={() => execCommand('bold')}
                  />
                  <ToolbarButton 
                    icon={Italic} 
                    title="Italic (Ctrl+I)" 
                    onClick={() => execCommand('italic')}
                  />
                  <ToolbarButton 
                    icon={Underline} 
                    title="Underline (Ctrl+U)" 
                    onClick={() => execCommand('underline')}
                  />
                </div>
              )}
              
              {toolbarConfig.links && (
                <div className="px-2">
                  <ToolbarButton 
                    icon={Link} 
                    title="Insert Link" 
                    onClick={handleLink}
                  />
                </div>
              )}

              {toolbarConfig.heading && (
                <div className="px-2">
                  <ToolbarButton 
                    icon={Heading1} 
                    title="Toggle Heading" 
                    onClick={handleHeader}
                  />
                </div>
              )}

              {toolbarConfig.quote && (
                <div className="px-2">
                  <ToolbarButton 
                    icon={Quote} 
                    title="Block Quote" 
                    onClick={handleQuote}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div
            ref={editorRef}
            contentEditable
            className={`w-half overflow-y-auto p-2 focus:outline-none ${
              type === 'answer' ? 'min-h-[200px]' : ''
            }`}
            style={{
              minHeight,
              maxHeight
            }}
            placeholder="Type your message here..."
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData('text/plain');
              document.execCommand('insertText', false, text);
            }}
          />
          
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                if (editorRef.current) {
                  editorRef.current.innerHTML = '';
                }
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                ${type === 'answer' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                ${type === 'question' ? 'bg-green-600 hover:bg-green-700' : ''}
                ${type === 'comment' ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
            >
              {getSaveButtonText()}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default HybridEditor;