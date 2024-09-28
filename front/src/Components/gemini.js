import React, { useState } from 'react';
import axios from 'axios';
import "./gemini.css"
import { useEffect } from 'react';
function Gemini() {
  const [inputText, setInputText] = useState('');
  const [responseData, setResponseData] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/generate-content', {
        text: inputText,
      });
      const yo = response.data.candidates[0].content.parts[0].text;
      const formattedText = yo
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Convert **text** to <strong>text</strong>
  .replace(/\n/g, '<br>');
  document.getElementById('content').innerHTML = formattedText;

    } catch (error) {
      console.error('Error making API request:', error);
    }
  };

  useEffect(() => {
    // Function to disable Unity input
    const unityObject = "WebGLInputHandler"; 
    const disableUnityInput = () => {
      window.unityInstance?.SendMessage(unityObject, "DisableUnityInput");
    };

    // Function to enable Unity input
    const enableUnityInput = () => {
      window.unityInstance?.SendMessage(unityObject, "EnableUnityInput");
    };

    // Set up event listeners
    const handleFocusIn = (event) => {
      if (event.target.tagName === "TEXTAREA") {
        disableUnityInput();
      }
    };

    const handleFocusOut = (event) => {
      if (event.target.tagName === "TEXTAREA") {
        enableUnityInput();
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <div className="gemini" >
      <h1>Gemini API Integration</h1>
      <textarea tabindex="1"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter your prompt here"
      />
      <button onClick={handleSubmit}>Submit</button>
      <div id="content"> </div>
      
    </div>
  );
}

export default Gemini;
