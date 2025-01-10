import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Unity } from "react-unity-webgl";
import { useUnity } from "../Context/UnityProvider";

const UnityComponent = ({ onUnityLoaded }) => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { unityProvider, loadingProgression, isLoaded } = useUnity();
  // Store the Unity instance globally and trigger the callback when loaded
  useEffect(() => {
    if (sessionStorage.getItem('uid') === uid) {
      if (isLoaded) onUnityLoaded(); // Call the callback to notify that Unity has loaded
    }
    else return navigate('/login');
  }, [isLoaded, onUnityLoaded, navigate, uid]);

  return (
    <div className="" style={{ width: "100%", height: "100vh" ,zIndex:"-1000"}}>
      {!isLoaded && <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>}
      <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100vh", visibility: isLoaded ? "visible" : "hidden" }} />
    </div>
  );
};

export default UnityComponent;
