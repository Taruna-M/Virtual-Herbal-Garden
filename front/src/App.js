import React, { useState } from "react";
import LoginPage from "./Components/LoginPage";
import UnityComponent from "./Components/UnityComponent";
import Navbar from "./Components/Navbar";
import Gemini from "./Components/gemini";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [unityLoaded, setUnityLoaded] = useState(false);

  const handleLogin = () => {
    // Set loggedIn to true after successful login
    setLoggedIn(true);
  };

  const handleUnityLoaded = () => {
    // Set unityLoaded to true when Unity has finished loading
    setUnityLoaded(true);
  };

  return (
    <div className="App">
      {/* Show login page if not logged in, otherwise show Unity and Navbar/Gemini */}
      {!loggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <>
          {/* UnityComponent will trigger handleUnityLoaded when fully loaded */}
          <UnityComponent onUnityLoaded={handleUnityLoaded} />
          {/* Show Navbar and Gemini only after Unity has loaded */}
          {unityLoaded && (
            <>
              <Navbar />
              <Gemini />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
