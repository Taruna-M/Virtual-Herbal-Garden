import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { FaLeaf } from 'react-icons/fa'; // Icon for the button
import "./plantsearch.css";

function PlantSearch() {
  const [plantData, setPlantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(false); // Toggle box visibility
  const webcamRef = useRef(null);
  const apiKey = '7G4RoSFqFmdnA3mBqJGnAtlmDvigOCSpvk4Eea63Z22qIlXVHF';

  const toggleBox = () => setIsBoxOpen(!isBoxOpen);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageSrc) {
      alert('Please capture an image');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('images', dataURLtoFile(imageSrc, 'plant.jpg'));
    formData.append('organs', 'leaf');

    try {
      const response = await axios.post(
        'https://api.plant.id/v2/identify',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Api-Key': apiKey
          }
        }
      );

      const suggestion = response.data.suggestions[0];
      if (suggestion.probability > 0.1) {
        setPlantData(suggestion);
      } else {
        setPlantData(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error identifying plant:', error);
      setLoading(false);
    }
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="plant-search-container">
      {/* Icon Button */}
      <button className="plant-icon-btn" onClick={toggleBox}>
        <FaLeaf size={30} />
      </button>

      {/* Popup Box */}
      {isBoxOpen && (
        <div className="plant-search-box">
          <h2>Plant Search</h2>
          {loading && <p>Identifying plant...</p>}

          {plantData ? (
            <div className="plant-details">
              <p><strong>Common Name:</strong> {plantData.plant_name}</p>
              <p><strong>Scientific Name:</strong> {plantData.scientific_name}</p>
              <p><strong>Family:</strong> {plantData.family}</p>
              <p><strong>Accuracy:</strong> {(plantData.probability * 100).toFixed(2)}%</p>
            </div>
          ) : (
            imageSrc && <p>No plant found.</p>
          )}

          {isCameraOpen && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={280}
            />
          )}

          <div className="button-group">
            <button onClick={() => setIsCameraOpen(true)}>Open Camera</button>
            <button onClick={capture} disabled={!isCameraOpen}>Capture Image</button>
            <button onClick={handleSubmit}>Identify Plant</button>
            <button onClick={toggleBox}>Close</button>
          </div>

          {imageSrc && (
            <img
              src={imageSrc}
              alt="Captured plant"
              className="captured-image"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PlantSearch;
