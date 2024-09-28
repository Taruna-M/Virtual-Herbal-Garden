import React, { useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const UnityComponent = () => {
  const { unityProvider, loadingProgression, isLoaded, sendMessage } = useUnityContext({
    loaderUrl: "/garden4/Build/garden4.loader.js",
    dataUrl: "/garden4/Build/garden4.data",
    frameworkUrl: "/garden4/Build/garden4.framework.js",
    codeUrl: "/garden4/Build/garden4.wasm",
  });

  // Store the Unity instance globally
  useEffect(() => {
    const unityInstance = window.unityInstance;
    if (unityInstance) {
      // This sets the instance globally
      window.unityInstance = unityInstance;
    }
  }, [isLoaded]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {!isLoaded && <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>}
      <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100vh", visibility: isLoaded ? "visible" : "hidden" }} />
    </div>
  );
};

export default UnityComponent;
