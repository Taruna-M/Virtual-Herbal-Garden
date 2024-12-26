import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './plantsearch.css';
import { FaLeaf } from 'react-icons/fa';

function PlantSearch() {
  const [plantData, setPlantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef(null);
  const apiKey = '7G4RoSFqFmdnA3mBqJGnAtlmDvigOCSpvk4Eea63Z22qIlXVHF';

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
            'Api-Key': apiKey,
          },
        }
      );

      const suggestion = response.data.suggestions[0];
      console.log(suggestion)
      if (suggestion.probability > 0.1) {
        setPlantData(suggestion);
      } else {
        setPlantData(null);
      }
    } catch (error) {
      console.error('Error identifying plant:', error);
    } finally {
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
    <>
      <button className="plant-icon-btn" onClick={() => setIsCameraOpen(!isCameraOpen)}>
        <FaLeaf size={24} />
      </button>

      {isCameraOpen && (
        <div className="plant-search-box">
          <h2>Plant Search</h2>
          <div className="webcam-container">
            <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className="webcam" />
            {imageSrc && <img src={imageSrc} alt="Captured plant" className="captured-image" />}
          </div>

          <div className="button-group">
            <button onClick={capture}>Capture</button>
            <button onClick={handleSubmit}>Identify</button>
          </div>

          {loading && <p>Identifying plant...</p>}
          {plantData && (
            <div className="result-box">
              <p><strong>Common Name:</strong> {plantData.plant_name}</p>
              <p><strong>Accuracy:</strong> {(plantData.probability * 100).toFixed(2)}%</p>
            </div>
          )}
          {!plantData && (
            <div className="result-box">
                <p>No plant identified.</p>
                </div>
          )}
        </div>
      )}
    </>
  );
}

export default PlantSearch;
