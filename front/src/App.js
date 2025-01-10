import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from "./Components/LoginPage";
import UnityComponent from "./Components/UnityComponent";
import Navbar from "./Components/Navbar";
import Gemini from "./Components/gemini";
import PlantSearch from "./Components/scan";
import { UnityProvider } from "./Context/UnityProvider";
import Notes from "./Components/Notes"
function App() {
  const [unityLoaded, setUnityLoaded] = useState(false);

  const handleUnityLoaded = () => {
    // Set unityLoaded to true when Unity has finished loading
    setUnityLoaded(true);
  };

  return (
    <UnityProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/garden/:uid" element={<>
              {/* UnityComponent will trigger handleUnityLoaded when fully loaded */}
              <UnityComponent onUnityLoaded={handleUnityLoaded}/>
              {/* Show Navbar and Gemini only after Unity has loaded */}
              {unityLoaded && (
                <>
                  <Navbar/>
                  <PlantSearch/>
                  <Gemini/>
                  <Notes/>
                </>
              )}
            </>
            }
          />
          <Route path="*" element={<LoginPage/>} />
        </Routes>
      </Router>
    </UnityProvider>
  );
}

export default App;
