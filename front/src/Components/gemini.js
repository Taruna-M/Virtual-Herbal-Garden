import React, { useState } from 'react';
import axios from 'axios';
import "./gemini.css"
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
