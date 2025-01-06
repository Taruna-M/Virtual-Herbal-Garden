import React, { useEffect } from "react";
import { Unity } from "react-unity-webgl";
import { useUnity } from "../Context/UnityProvider";

const UnityComponent = ({ onUnityLoaded }) => {
  const { unityProvider, loadingProgression, isLoaded } = useUnity();
  // Store the Unity instance globally and trigger the callback when loaded
  useEffect(() => {
    if (isLoaded) {
      // Call the callback to notify that Unity has loaded
      onUnityLoaded();
    }
  }, [isLoaded, onUnityLoaded]);

  return (
    <div className="" style={{ width: "100%", height: "100vh" ,zIndex:"-1000"}}>
      {!isLoaded && <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>}
      <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100vh", visibility: isLoaded ? "visible" : "hidden" }} />
    </div>
  );
};

export default UnityComponent;
