import React, { useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const UnityComponent = () => {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "/garden3/Build/garden3.loader.js",
    dataUrl: "/garden3/Build/garden3.data",
    frameworkUrl: "/garden3/Build/garden3.framework.js",
    codeUrl: "/garden3/Build/garden3.wasm",
  });

  useEffect(() => {
    if (unityProvider) {
      unityProvider.focusEnabled = false;
    }
  }, [unityProvider]);

  return (
    <div style={{ position: 'relative', width: "100%", height: "100vh" }}>
      {!isLoaded && <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>}
      <Unity 
        unityProvider={unityProvider} 
        style={{ width: "100%", height: "100vh", visibility: isLoaded ? "visible" : "hidden" }}
      />
    </div>
  );
};

export default UnityComponent;